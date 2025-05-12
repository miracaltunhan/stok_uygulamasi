export interface Item {
    id: number;
    name: string;
    description: string;
    current_stock: number;
    minimum_stock: number;
    monthly_consumption: number;
    created_at: string;
    updated_at: string;
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