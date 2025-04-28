import axios from 'axios';

// API URL'ini belirleyin (laravel backend'inizin URL'si)
const API_URL = 'http://192.168.0.9:8000/api'; // API'nizin URL'sini buraya yazın

// Axios örneğini oluşturun
export const api = axios.create({
  baseURL: 'http://192.168.0.9:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ürün servisi (Item işlemleri) için API fonksiyonları
export const productService = {
  // Tüm ürünleri al
  getAll: async () => {
    try {
      const response = await api.get('/items');
      return response.data;  // Ürünlerin listesini döndür
    } catch (error) {
      console.error('API Error (getAll):', error.response?.data || error.message);
      return [];  // Hata durumunda boş dizi döndür
    }
  },

  // ID ile belirli bir ürünü al
  getById: async (id: number) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;  // Belirli ürünü döndür
    } catch (error) {
      console.error('API Error (getById):', error.response?.data || error.message);
      return null;  // Hata durumunda null döndür
    }
  },

  // Yeni bir ürün oluştur
  create: async (data: { name: string, description: string, current_stock: number, minimum_stock: number, monthly_consumption: number }) => {
    try {
      const response = await api.post('/items', data);
      return response.data;  // Yeni oluşturulan ürünü döndür
    } catch (error) {
      console.error('API Error (create):', error.response?.data || error.message);
      return null;  // Hata durumunda null döndür
    }
  },

  // Var olan ürünü güncelle
  update: async (id: number, data: { name: string, description: string, current_stock: number, minimum_stock: number, monthly_consumption: number }) => {
    try {
      const response = await api.put(`/items/${id}`, data);
      return response.data;  // Güncellenmiş ürünü döndür
    } catch (error) {
      console.error('API Error (update):', error.response?.data || error.message);
      return null;  // Hata durumunda null döndür
    }
  },

  // Ürünü sil
  delete: async (id: number) => {
    try {
      await api.delete(`/items/${id}`);
      return true;  // Silme işlemi başarılı ise true döndür
    } catch (error) {
      console.error('API Error (delete):', error.response?.data || error.message);
      return false;  // Hata durumunda false döndür
    }
  },
};

// Stok hareketleri servisi için API fonksiyonları
export const stockMovementService = {
  // Tüm stok hareketlerini al
  getAll: async () => {
    try {
      const response = await api.get('/stock-movements');
      return response.data;  // Stok hareketlerini döndür
    } catch (error) {
      console.error('API Error (getAll Stock Movements):', error.response?.data || error.message);
      return [];  // Hata durumunda boş dizi döndür
    }
  },

  // Belirli bir stok hareketini al
  getById: async (id: number) => {
    try {
      const response = await api.get(`/stock-movements/${id}`);
      return response.data;  // Belirli stok hareketini döndür
    } catch (error) {
      console.error('API Error (getById Stock Movement):', error.response?.data || error.message);
      return null;  // Hata durumunda null döndür
    }
  },

  // Yeni bir stok hareketi oluştur
  create: async (data: { item_id: number, quantity: number, type: string, date: string, notes: string | null }) => {
    try {
      const response = await api.post('/stock-movements', data);
      return response.data;  // Yeni oluşturulan stok hareketini döndür
    } catch (error) {
      console.error('API Error (create Stock Movement):', error.response?.data || error.message);
      return null;  // Hata durumunda null döndür
    }
  },

  // Stok hareketini güncelle
  update: async (id: number, data: { item_id: number, quantity: number, type: string, date: string, notes: string | null }) => {
    try {
      const response = await api.put(`/stock-movements/${id}`, data);
      return response.data;  // Güncellenmiş stok hareketini döndür
    } catch (error) {
      console.error('API Error (update Stock Movement):', error.response?.data || error.message);
      return null;  // Hata durumunda null döndür
    }
  },

  // Stok hareketini sil
  delete: async (id: number) => {
    try {
      await api.delete(`/stock-movements/${id}`);
      return true;  // Silme işlemi başarılı ise true döndür
    } catch (error) {
      console.error('API Error (delete Stock Movement):', error.response?.data || error.message);
      return false;  // Hata durumunda false döndür
    }
  },
};

// Diğer API servisleri eklenebilir, örneğin 'StockAnalytics' servisi gibi
export const stockAnalyticsService = {
  // Stok analitik verilerini al
  getAnalytics: async () => {
    try {
      const response = await api.get('/stock-analytics');
      return response.data;  // Stok analitik verilerini döndür
    } catch (error) {
      console.error('API Error (get Stock Analytics):', error.response?.data || error.message);
      return {};  // Hata durumunda boş obje döndür
    }
  },
};
