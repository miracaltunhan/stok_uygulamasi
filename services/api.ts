import axios from 'axios';
import { Product, Stock, ApiResponse, StockMovementRequest } from '../types';

// Laravel backend'in çalıştığı URL
const API_URL = 'http://192.168.0.21:8000/';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 saniye timeout
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true
});


// Hata yakalama
api.interceptors.response.use(
    response => response,
    error => {
      console.error('API Hatası:', error);
      console.error('Yanıt:', error.response?.data);
      if (error.code === 'ERR_NETWORK') {
        console.error('Backend sunucusuna bağlanılamıyor. Lütfen sunucunun çalıştığından emin olun.');
      }
      return Promise.reject(error);
    }
);

// Ürün servisi
export const productService = {
  getAll: async () => {
    const response = await api.get('/items');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post('/items', product);
    return response.data;
  },

  update: async (id: number, product: Partial<Product>) => {
    const response = await api.put(`/items/${id}`, product);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  addStock: async (id: number, data: { quantity: number; description: string }) => {
    const response = await api.post(`/items/${id}/add-stock`, data);
    return response.data;
  },

  consume: async (id: number, data: { quantity: number; description: string }) => {
    const response = await api.post(`/items/${id}/consume`, data);
    return response.data;
  }
};

// Stok hareketleri servisi
export const stockService = {
  getAll: async () => {
    const response = await api.get('/stock-movements');
    return response.data;
  },

  getByItemId: async (itemId: number) => {
    const response = await api.get(`/items/${itemId}/stock-movements`);
    return response.data;
  },

  create: async (data: {
    item_id: number;
    quantity: number;
    type: 'in' | 'out';
    description: string;
  }) => {
    const response = await api.post('/stock-movements', data);
    return response.data;
  }
};

// Tüketim kayıtları
export const consumptionService = {
  getAll: () => api.get('/consumption-records'),
  getByProductId: (productId: number) => api.get(`/consumption-records/product/${productId}`),
  create: (data: any) => api.post('/consumption-records', data),
};

export default api;