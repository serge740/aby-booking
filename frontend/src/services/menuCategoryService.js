import api from '../api/api';

class MenuCategoryService {
  // ✅ Create new category
  async createCategory(name) {
    try {
      const response = await api.post('/menu-category', { name });
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

  // ✅ Update a category name
  async updateCategory(id, name) {
    try {
      const response = await api.put(`/menu-category/${id}`, { name });
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
  deleteCategory
} = menuCategoryService;
