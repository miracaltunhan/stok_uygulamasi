export interface Item {
  id: number;
  name: string;
  description: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  stock_tracking_type: string;
  weekly_consumption: number;
  created_at: string;
  updated_at: string;
  stock_quantity?: number;
  monthly_consumption?: number;
}

export interface StockMovement {
  id: number;
  item_id: number;
  quantity: number;
  type: 'in' | 'out';
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ConsumptionRecord {
  id: number;
  item_id: number;
  quantity: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  item_id: number;
  type: string;
  message: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}