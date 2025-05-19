export interface Product {
    id: number;
    name: string;
    description: string;
    unit: string;
    current_stock: string;
    minimum_stock: string;
    stock_tracking_type: 'manuel' | 'otomatik';
    weekly_consumption: string;
    created_at: number;
    updated_at: number;
}

export interface Stock {
    id: number;
    product_id: number;
    quantity: number;
    description: string;
    created_at: number;
    updated_at: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: string;
}

export interface StockMovementRequest {
    quantity: string;
    description: string;
}