import api from '../api/api';

class MenuCategoryService {
  // ✅ Create new category with optional image upload
  async createCategory(name, imageFile = null) {
    try {
      const formData = new FormData();
      formData.append('name', name);

      if (imageFile) {
        formData.append('category_image', imageFile); // Must match backend field name
      }

      const response = await api.post('/menu-category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to create category';
      throw new Error(msg);
    }
  }

  // ✅ Get all categories
  async getCategories() {
    try {
      const response = await api.get('/menu-category');
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch categories';
      throw new Error(msg);
    }
  }

  // ✅ Update a category with optional new image
  async updateCategory(id, name, imageFile = null) {
    try {
      const formData = new FormData();
      formData.append('name', name);

      if (imageFile) {
        formData.append('category_image', imageFile); // Must match backend field name
      }

      const response = await api.put(`/menu-category/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to update category';
      throw new Error(msg);
    }
  }

  // ✅ Delete a category
  async deleteCategory(id) {
    try {
      const response = await api.delete(`/menu-category/${id}`);
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete category';
      throw new Error(msg);
    }
  }
}

const menuCategoryService = new MenuCategoryService();
export default menuCategoryService;

// Optional named exports
export const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = menuCategoryService;
