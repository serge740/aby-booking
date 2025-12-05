import { HttpException, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { deleteFile } from 'src/common/Utils/file-upload.util';
import { PurposeStatus, DrinkStateStatus } from 'generated/prisma';

@Injectable()
export class MenuItemService {
  constructor(private readonly prisma: PrismaService) {}

  /** ===============================
   * 🧩 Create Menu Item
   * =============================== */
  async create(companyId: string, data: any) {
    const {
      name,
      sellingPrice,
      purchasingPrice,
      purpose,
      drinkState,
      alcoholicType,
      ingredients,
      recipe,
    } = data;

    if (!name || !sellingPrice)
      throw new BadRequestException('Name & selling price are required.');

    // --- Validate based on purpose ---
    if (purpose === PurposeStatus.DRINKING) {
      if (!drinkState)
        throw new BadRequestException('Drink state is required for drinks.');
      if (drinkState === DrinkStateStatus.ALCOHOLIC && !alcoholicType) {
        throw new BadRequestException(
          'Alcoholic type is required for alcoholic drinks.'
        );
      }
    }



    const diff =
      purchasingPrice && sellingPrice
        ? parseFloat(sellingPrice) - parseFloat(purchasingPrice)
        : null;

    return this.prisma.menuItem.create({
      data: {
        ...data,
        companyId,
        sellingPrice: parseFloat(sellingPrice),
        discount: parseInt(data.discount),
        purchasingPrice: purchasingPrice ? parseFloat(purchasingPrice) : null,
        difference: diff,
        isActive: data.isActive === 'true' || data.isActive === true,
      },
    });
  }

  /** ===============================
   * 🧩 Get All Items by Company
   * =============================== */
  async findAllByCompanyId(companyId: string) {
    return this.prisma.menuItem.findMany({
      where: { companyId },
      include: { company: true },
    });
  }

  /** ===============================
   * 🧩 Get All Items (Admin)
   * =============================== */
  async findAll() {
    return this.prisma.menuItem.findMany({
      include: { company: true },
    });
  }

  /** ===============================
   * 🧩 Get Single Item
   * =============================== */
  async findOne(id: string) {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  /** ===============================
   * 🧩 Update Menu Item
   * =============================== */
  async update(companyId: string, id: string, data: any) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });

    if (!item || item.companyId !== companyId)
      throw new HttpException('Item not found or unauthorized', 403);

    // --- Validate based on purpose ---
    if (data.purpose === PurposeStatus.DRINKING) {
      if (!data.drinkState)
        throw new BadRequestException('Drink state is required for drinks.');
      if (
        data.drinkState === DrinkStateStatus.ALCOHOLIC &&
        !data.alcoholicType
      ) {
        throw new BadRequestException(
          'Alcoholic type is required for alcoholic drinks.'
        );
      }
    }



    const sellingPrice = data.sellingPrice
      ? parseFloat(data.sellingPrice)
      : item.sellingPrice;
    const purchasingPrice = data.purchasingPrice
      ? parseFloat(data.purchasingPrice)
      : item.purchasingPrice;
    const difference =
      sellingPrice && purchasingPrice
        ? sellingPrice - purchasingPrice
        : item.difference;

    // --- Manage images safely ---
    const removedImages: string[] = data.removedImages ?? [];
    const newImages: string[] = data.otherImages ?? [];

    const existingImages = Array.isArray(item.otherImages)
      ? item.otherImages.filter((v): v is string => typeof v === 'string')
      : [];

    const finalImages = [
      ...existingImages.filter((img) => !removedImages.includes(img)),
      ...newImages,
    ];

    const updated = await this.prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        sellingPrice,
        purchasingPrice,
        difference,
        discount: parseInt(data.discount),
        otherImages: finalImages,
        isActive: data.isActive === 'true' || data.isActive === true,
      },
    });

    // --- Delete files if replaced ---
    if (data.mainImage && item.mainImage && data.mainImage !== item.mainImage) {
      deleteFile(item.mainImage);
    }

    for (const img of removedImages) {
      deleteFile(img);
    }

    return updated;
  }

  /** ===============================
   * 🧩 Delete Menu Item
   * =============================== */
  async delete(companyId: string, id: string) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });

    if (!item || item.companyId !== companyId)
      throw new HttpException('Unauthorized delete', 403);

    return this.prisma.menuItem.delete({ where: { id } });
  }
}
