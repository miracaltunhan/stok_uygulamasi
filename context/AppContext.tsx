import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Stock } from '../types';
import { productService, stockService } from '../services/api';

interface AppContextType {
    products: Product[];
    stockMovements: Stock[];
    loading: boolean;
    error: string | null;
    addProduct: (product: Product) => Promise<void>;
    addStockMovement: (movement: Stock) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [stockMovements, setStockMovements] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [productsResponse, stockResponse] = await Promise.all([
                productService.getAll(),
                stockService.getAll()
            ]);

            setProducts(productsResponse.data);
            setStockMovements(stockResponse.data);
        } catch (err) {
            setError('Veriler yüklenirken bir hata oluştu');
            console.error('Veri yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const addProduct = async (product: Product) => {
        try {
            const response = await productService.create(product);
            setProducts(prev => [...prev, response.data]);
        } catch (err) {
            console.error('Ürün ekleme hatası:', err);
            throw err;
        }
    };

    const addStockMovement = async (movement: Stock) => {
        try {
            const response = await stockService.addStock(movement.product_id, {
                quantity: movement.quantity,
                description: movement.description
            });
            setStockMovements(prev => [...prev, response.data]);
        } catch (err) {
            console.error('Stok hareketi ekleme hatası:', err);
            throw err;
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        try {
            const response = await productService.update(updatedProduct.id, updatedProduct);
            setProducts(prev =>
                prev.map(product =>
                    product.id === updatedProduct.id ? response.data : product
                )
            );
        } catch (err) {
            console.error('Ürün güncelleme hatası:', err);
            throw err;
        }
    };

    return (
        <AppContext.Provider value={{
            products,
            stockMovements,
            loading,
            error,
            addProduct,
            addStockMovement,
            updateProduct,
            refreshData: loadData
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}