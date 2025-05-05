import axios from 'axios';

// Bilgisayarınızın IP adresini buraya yazın
const API_URL = 'http://192.168.0.9:8000/api';

class StockService {
    // Ürünleri getir
    async getAllItems() {
        try {
            console.log('API URL:', `${API_URL}/items`);
            const response = await axios.get(`${API_URL}/items`);
            console.log('Ürünler yanıtı:', response.data);
            return response.data;
        } catch (error) {
            console.error('Ürünler alınırken hata:', error);
            console.error('Hata detayı:', error.response?.data || error.message);
            throw error;
        }
    }

    // Stok analitiğini getir
    async getStockAnalytics() {
        try {
            console.log('API URL:', `${API_URL}/stock-analytics`);
            const response = await axios.get(`${API_URL}/stock-analytics`);
            console.log('Analitik yanıtı:', response.data);
            return response.data;
        } catch (error) {
            console.error('Analitik alınırken hata:', error);
            console.error('Hata detayı:', error.response?.data || error.message);
            throw error;
        }
    }

    // Ürün hareketlerini getir
    async getProductMovements(id) {
        try {
            const response = await axios.get(`${API_URL}/items/${id}/movements`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Stok hareketlerini getir
    async getStockMovements() {
        try {
            const response = await axios.get(`${API_URL}/stock-movements-list`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Yeni ürün ekle
    async createItem(itemData) {
        try {
            const response = await axios.post(`${API_URL}/items`, itemData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Ürün güncelle
    async updateItem(id, itemData) {
        try {
            const response = await axios.put(`${API_URL}/items/${id}`, itemData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Ürün sil
    async deleteItem(id) {
        try {
            const response = await axios.delete(`${API_URL}/items/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Stok ekle
    async addStock(id, stockData) {
        try {
            const response = await axios.post(`${API_URL}/items/${id}/add-stock`, stockData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Stok tüket
    async consumeStock(id, consumeData) {
        try {
            const response = await axios.post(`${API_URL}/items/${id}/consume`, consumeData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new StockService(); 