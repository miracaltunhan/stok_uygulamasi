// services/api.ts
import axios from 'axios';

const API_URL = 'http://192.168.0.9:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Ürün servisi (Item işlemleri) için API fonksiyonları
export const productService = {
  // Tüm ürünleri al
  getAll: async () => {
    try {
      console.log('API İsteği Başlatılıyor:', `${API_URL}/items`);
      const response = await api.get('/items');
      console.log('API Yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Hatası:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return [];
    }
  },

  // ID ile belirli bir ürünü al
  getById: async (id: number) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error (getById):', error.response?.data || error.message);
      return null;
    }
  },

  // Yeni bir ürün oluştur
  create: async (data: { name: string, description: string, current_stock: number, minimum_stock: number, monthly_consumption: number }) => {
    try {
      const response = await api.post('/items', data);
      return response.data;
    } catch (error) {
      console.error('API Error (create):', error.response?.data || error.message);
      return null;
    }
  },

  // Var olan ürünü güncelle
  update: async (id: number, data: { name: string, description: string, current_stock: number, minimum_stock: number, monthly_consumption: number }) => {
    try {
      const response = await api.put(`/items/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error (update):', error.response?.data || error.message);
      return null;
    }
  },

  // Ürünü sil
  delete: async (id: number) => {
    try {
      await api.delete(`/items/${id}`);
      return true;
    } catch (error) {
      console.error('API Error (delete):', error.response?.data || error.message);
      return false;
    }
  },

  // Stok ekle
  addStock: async (id: number, data: { quantity: number, description: string }) => {
    try {
      const response = await api.post(`/items/${id}/add-stock`, data);
      return response.data;
    } catch (error) {
      console.error('Stok Ekleme Hatası:', error);
      throw error;
    }
  },

  // Stok tüket
  consumeStock: async (id: number, data: { quantity: number, description: string }) => {
    try {
      const response = await api.post(`/items/${id}/consume`, data);
      return response.data;
    } catch (error) {
      console.error('Stok Tüketme Hatası:', error);
      throw error;
    }
  }
};

// Stok hareketleri servisi için API fonksiyonları
export const stockMovementService = {
  // Tüm stok hareketlerini al
  getAll: async () => {
    try {
      const response = await api.get('/stock-movements');
      return response.data;
    } catch (error) {
      console.error('API Error (getAll Stock Movements):', error.response?.data || error.message);
      return [];
    }
  },

  // Belirli bir stok hareketini al
  getById: async (id: number) => {
    try {
      const response = await api.get(`/stock-movements/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error (getById Stock Movement):', error.response?.data || error.message);
      return null;
    }
  },

  // Yeni bir stok hareketi oluştur
  create: async (data: { item_id: number, quantity: number, type: string, date: string, notes: string | null }) => {
    try {
      const response = await api.post('/stock-movements', data);
      return response.data;
    } catch (error) {
      console.error('API Error (create Stock Movement):', error.response?.data || error.message);
      return null;
    }
  },

  // Stok hareketini güncelle
  update: async (id: number, data: { item_id: number, quantity: number, type: string, date: string, notes: string | null }) => {
    try {
      const response = await api.put(`/stock-movements/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error (update Stock Movement):', error.response?.data || error.message);
      return null;
    }
  },

  // Stok hareketini sil
  delete: async (id: number) => {
    try {
      await api.delete(`/stock-movements/${id}`);
      return true;
    } catch (error) {
      console.error('API Error (delete Stock Movement):', error.response?.data || error.message);
      return false;
    }
  }
};

// Stok analitik servisi
export const stockAnalyticsService = {
  // Stok analitik verilerini al
  getAnalytics: async () => {
    try {
      const response = await api.get('/stock-analytics');
      return response.data;
    } catch (error) {
      console.error('API Error (get Stock Analytics):', error.response?.data || error.message);
      return {};
    }
  }
};