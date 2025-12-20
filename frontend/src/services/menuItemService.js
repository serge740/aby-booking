// src/services/menuItemService.js
import api from '../api/api'; // your Axios instance configured with credentials

class MenuItemService {
    /** ============================
     * ✅ Create Menu Item
     * ============================ */
    async createMenuItem(data, mainImage, otherImages = []) {
        try {
            const formData = new FormData();

            // Append all fields properly
            Object.entries(data).forEach(([key, value]) => {
                if (value === undefined || value === null) return;

                // Handle arrays or JSON objects (like ingredients)
                if (typeof value === 'object' && !Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (Array.isArray(value)) {
                    // For JSON arrays (like ingredients) serialize them
                    formData.append(key, JSON.stringify(value));
                } else {

                    formData.append(key, value);
                }
            });

            // Add images
            if (mainImage) formData.append('mainImage', mainImage);
            if (otherImages.length > 0)
                otherImages.forEach((file) => formData.append('otherImages', file));

            const response = await api.post('/menu-item', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return response.data;
        } catch (error) {
            const msg =
                error.response.data.message || 'Failed to create menu item';
            throw new Error(msg);
        }
    }

    /** ============================
     * ✅ Fetch Menu Items (Company)
     * ============================ */
    async getMenuItems() {
        try {
            const response = await api.get('/menu-item');
            return response.data;
        } catch (error) {
            const msg =
                error.response.data.message || 'Failed to fetch menu items';
            throw new Error(msg);
        }
    }

    /** ✅ Fetch All Menu Items (Admin use) */
    async getAllMenuItems() {
        try {
            const response = await api.get('/menu-item/all');
            return response.data;
        } catch (error) {
            const msg =
                error.response.data.message || 'Failed to fetch all menu items';
            throw new Error(msg);
        }
    }
    async getOneMenuItem(id) {
        try {
            const response = await api.get(`/menu-item/${id}`);
            return response.data;
        } catch (error) {
            const msg =
                error.response.data.message || 'Failed to fetch all menu items';
            throw new Error(msg);
        }
    }

    /** ✅ Fetch Menu Items by Company ID */
    async getMenuItemsByCompanyId(id) {
        try {
            const response = await api.get(`/menu-item/company/${id}`);
            return response.data;
        } catch (error) {
            const msg =
                error.response.data.message || 'Failed to fetch menu items by company';
            throw new Error(msg);
        }
    }

    /** ============================
     * ✅ Update Menu Item
     * ============================ */
    async updateMenuItem(id, updatedData, mainImage, otherImages = []) {
        try {
            const formData = new FormData();

            Object.entries(updatedData).forEach(([key, value]) => {
                if (value === undefined || value === null) return;

                if (typeof value === 'object' && !Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            if (mainImage) formData.append('mainImage', mainImage);
            if (otherImages.length > 0)
                otherImages.forEach((file) => formData.append('otherImages', file));

            const response = await api.put(`/menu-item/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return response.data;
        } catch (error) {
            const msg =
                error.response.data.message || 'Failed to update menu item';
            throw new Error(msg);
        }
    }

    /** ============================
     * ✅ Delete Menu Item
     * ============================ */
    async deleteMenuItem(id) {
        try {
            const response = await api.delete(`/menu-item/${id}`);
            return response.data;
        } catch (error) {
            const msg =
                error.response.data.message || 'Failed to delete menu item';
            throw new Error(msg);
        }
    }

    /** ============================
     * 🧠 Helper: Validate Frontend Data Before Send
     * ============================ */
    validateMenuItem(data) {
        if (!data.name || !data.sellingPrice) {
            throw new Error('Name and Selling Price are required.');
        }

        if (data.purpose === 'DRINKING') {
            if (!data.drinkState)
                throw new Error('Drink State is required for drink items.');
            if (data.drinkState === 'ALCOHOLIC' && !data.alcoholicType)
                throw new Error('Alcoholic Type is required for alcoholic drinks.');
        }

        if (data.purpose === 'EATING') {
            if (!data.ingredients || !data.recipe) {
                throw new Error('Ingredients and Recipe are required for eating items.');
            }
        }

        return true;
    }
}

const menuItemService = new MenuItemService();
export default menuItemService;