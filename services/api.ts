import axios from 'axios';
import { Item, StockMovement } from '../types';

const API_URL = 'http://192.168.0.21:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const itemService = {
    getAll: () => api.get<Item[]>('/items'),
    getById: (id: number) => api.get<Item>(`/items/${id}`),
    create: (data: Partial<Item>) => api.post<Item>('/items', data),
    update: (id: number, data: Partial<Item>) => api.put<Item>(`/items/${id}`, data),
    delete: (id: number) => api.delete(`/items/${id}`),
    addStock: (id: number, data: { quantity: number; description: string }) =>
        api.post<Item>(`/items/${id}/add-stock`, data),
    consume: (id: number, data: { quantity: number; description: string }) =>
        api.post<Item>(`/items/${id}/consume`, data),
    getStockMovements: (id: number) =>
        api.get<StockMovement[]>(`/items/${id}/stock-movements`)
};

export default api;