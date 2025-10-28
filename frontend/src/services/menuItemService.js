import api from '../api/api'; // Axios configured with credentials

class MenuItemService {
  // ✅ Create Menu Item
  async createMenuItem(data, mainImage, otherImages = []) {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (mainImage) {
        formData.append('mainImage', mainImage);
      }

      if (otherImages.length > 0) {
        otherImages.forEach(file =>
          formData.append('otherImages', file)
        );
      }

      const response = await api.post('/menu-item', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create menu item';
      throw new Error(msg);
    }
  }

  // ✅ Fetch all Menu Items
  async getMenuItems() {
    try {
      const response = await api.get('/menu-item');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch menu items';
      throw new Error(msg);
    }
  }

  // ✅ Update Menu Item *(supports removing old images & uploading new ones)*
  async updateMenuItem(id, updatedData, mainImage, otherImages = []) {
    try {
      const formData = new FormData();

      Object.entries(updatedData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, v));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (mainImage) {
        formData.append('mainImage', mainImage);
      }

      if (otherImages.length > 0) {
        otherImages.forEach(file =>
          formData.append('otherImages', file)
        );
      }

      const response = await api.put(`/menu-item/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update menu item';
      throw new Error(msg);
    }
  }

  // ✅ Delete Menu Item
  async deleteMenuItem(id) {
    try {
      const response = await api.delete(`/menu-item/${id}`);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete menu item';
      throw new Error(msg);
    }
  }
}

const menuItemService = new MenuItemService();
export default menuItemService;

// Optional named exports (quick access)
export const {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem
} = menuItemService;
