export interface Product {
  id: number;
  name: string;
  description: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  monthly_consumption: number;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  quantity: number;
  type: 'in' | 'out';
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ConsumptionRecord {
  id: number;
  product_id: number;
  quantity: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Stock {
  id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
} 