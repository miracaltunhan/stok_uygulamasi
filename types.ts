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

export interface Stock {
    id: number;
    product_id: number;
    quantity: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: string;
}

export interface StockMovementRequest {
    quantity: number;
    description: string;
}