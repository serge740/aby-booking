import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PurchasingUserService } from '../purchasingUser/purchasingUser.service';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/Global/email/email.service';

@Injectable()
export class PaymentService {
  private readonly baseUrl = 'https://api.flutterwave.com/v3';
  private readonly secretKey = process.env.FLW_SECRET_KEY;

  constructor(
    private prisma: PrismaService,
    private purchasingUserService: PurchasingUserService, // inject user service
    private email: EmailService,
  ) { }

  // Create payment for an order (default: all Flutterwave methods)
  async createPayment(order: any, paymentMethod?: string) {
    const txRef = `novagemstx-${uuidv4()}`;
    const paymentOptions = paymentMethod ?? 'card,mobilemoneyrwanda,ussd,account,qr';

    // Save payment record
    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        txRef,
        amount: order.amount,
        currency: order.currency,
        status: 'PENDING',
        paymentMethod: paymentOptions,
      },
    });

    // Call Flutterwave API
    const payload = {
      tx_ref: txRef,
      amount: order.amount,
      currency: order.currency,
      redirect_url: `${process.env.BASE_URL}/payments/callback`,
      payment_options: paymentOptions,
      customer: {
        email: order.customerEmail,
        phonenumber: order.customerPhone,
        name: order.customerName,
      },
    };

    try {
      const res = await axios.post<any>(`${this.baseUrl}/payments`, payload, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });



      return res.data.data.link;
    } catch (error) {
      console.error('Flutterwave payment error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to create Flutterwave payment');
    }
  }

  async retryPayment(orderId: string) {
  // 1️⃣ Find the most recent failed payment for the order
  const lastPayment = await this.prisma.payment.findFirst({
    where: {
      orderId,
      status: 'FAILED',
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!lastPayment) {
    throw new BadRequestException('No failed payment found to retry.');
  }

  // 2️⃣ Generate a new transaction reference
  const txRef = `novagemstx-retry-${uuidv4()}`;

  // 3️⃣ Create a new payment attempt linked to the old one
  const newPayment = await this.prisma.payment.create({
    data: {
      orderId,
      txRef,
      amount: lastPayment.amount,
      currency: lastPayment.currency,
      status: 'PENDING',
      paymentMethod: lastPayment.paymentMethod,
      retryOfPaymentId: lastPayment.id, // 🔗 link to previous failed payment
    },
  });

  // 4️⃣ Get order info for the customer details
  const order = await this.prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new BadRequestException('Order not found.');
  }

  // 5️⃣ Create a new Flutterwave payment link
  const payload = {
    tx_ref: txRef,
    amount: order.amount,
    currency: order.currency,
    redirect_url: `${process.env.BASE_URL}/payments/callback`,
    payment_options: newPayment.paymentMethod ?? 'card,mobilemoneyrwanda,ussd,account,qr',
    customer: {
      email: order.customerEmail,
      phonenumber: order.customerPhone,
      name: order.customerName,
    },
  };

  try {
    const res:any = await axios.post(`${this.baseUrl}/payments`, payload, {
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      message: 'Payment retry created successfully.',
      retryPaymentId: newPayment.id,
      txRef: newPayment.txRef,
      link: res.data.data.link, // new payment link
    };
  } catch (error) {
    console.error('Flutterwave retry error:', error.response?.data || error.message);
    throw new BadRequestException('Failed to create Flutterwave retry payment');
  }
}


  async verifyPaymentAndGetRedirect(txRef: string, transactionId: string,paymentStatus:string): Promise<string> {
    // 1️⃣ Verify with Flutterwave

    if(paymentStatus == 'cancelled'){
      return `${process.env.FRONTEND_BASE_URL}/products`;
    }

    const res = await axios.get<any>(`${this.baseUrl}/transactions/${transactionId}/verify`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });

    const data = res.data.data;
    const status = data.status === 'successful' ? 'SUCCESSFUL' : 'FAILED';
  

    const paymentMethod = data.payment_type || data.payment_type || 'unknown'; // Flutterwave field for method

    // 2️⃣ Update Payment record (now includes paymentMethod)
    const payment = await this.prisma.payment.update({
      where: { txRef },
      data: {
        status,
        transactionId,
        paymentMethod, // save which method was used
      },
    });

    // 3️⃣ Get order with items
    const order = await this.prisma.order.findUnique({
      where: { id: payment.orderId },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
    });
    if (!order) throw new BadRequestException('Order not found for this payment');

    // 4️⃣ Link or create PurchasingUser
    const user: any = await this.purchasingUserService.createOrGetUser({
      name: order.customerName,
      email: order.customerEmail,
      phoneNumber: order.customerPhone,
    });

    // 5️⃣ Update order
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: status === 'SUCCESSFUL' ? 'COMPLETED' : order.status,
        purchasingUserId: user.id ?? user.user?.id,
      },
    });
    const currentUser = user || user.user

    // 6️⃣ Decrease product quantity if successful
    if (status === 'SUCCESSFUL') {
      for (const item of order.orderItems) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }
      const currentYear = new Date().getFullYear();
      await this.email.sendEmail(
        currentUser.email,
        'Your NovaGems Payment was Successful 💎',
        'payment-success', // HBS filename (without .hbs)
        {
          name: currentUser.name,
          email: currentUser.email,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          paymentMethod: payment.paymentMethod,
          date: new Date().toLocaleString(),
          items: order.orderItems.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price.toFixed(2),
            subtotal: item.subtotal.toFixed(2),
          })),
          year: currentYear,
        },
      );
    }
    else {
      const currentYear = new Date().getFullYear();

      await this.email.sendEmail(
        currentUser.email,
        'NovaGems Payment Failed ❌',
        'payment-failed', // name of the .hbs file
        {
          name: name,
          email: currentUser.email,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          paymentMethod: payment.paymentMethod,
          date: new Date().toLocaleString(),
          retryLink: `${process.env.FRONTEND_BASE_URL}/retry-payment?orderId=${order.id}`,
          items: order.orderItems.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price.toFixed(2),
            subtotal: item.subtotal.toFixed(2),
          })),
          year: currentYear,
        },
      );

    }

    // 7️⃣ Construct frontend redirect URL
    return `${process.env.FRONTEND_BASE_URL}/payment-status?status=${status === 'SUCCESSFUL' ? 'success' : 'failed'}&orderId=${order.id}&amount=${order.amount}&currency=${order.currency}&method=${paymentMethod}`;
  }



}
