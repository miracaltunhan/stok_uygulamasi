export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  stock_quantity: number;
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