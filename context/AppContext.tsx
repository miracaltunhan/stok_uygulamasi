import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Stock } from '../types';
import { db } from '../services/firebase';

interface AppContextType {
    products: Product[];
    stockMovements: Stock[];
    loading: boolean;
    error: string | null;
    refreshProducts: () => Promise<void>;
    refreshStockMovements: () => Promise<void>;
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    addStockMovement: (movement: Stock) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [stockMovements, setStockMovements] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshProducts = async () => {
        try {
            setLoading(true);
            const itemsRef = db().ref('items');
            itemsRef.on('value', (snapshot: any) => {
                const data = snapshot.val();
                console.log('Firebase\'den gelen ham veri:', data);
                
                if (data) {
                    const productsArray = Object.entries(data).map(([id, item]: [string, any]) => {
                        console.log('İşlenen ürün:', { id, item });
                        
                        const product = {
                            id: Number(item.id),
                            name: item.name || '',
                            description: item.description || '',
                            unit: item.unit || '',
                            current_stock: String(item.current_stock || '0'),
                            minimum_stock: String(item.minimum_stock || '0'),
                            stock_tracking_type: item.stock_tracking_type || 'manuel',
                            weekly_consumption: String(item.weekly_consumption || '0'),
                            created_at: Number(item.created_at) || Math.floor(Date.now() / 1000),
                            updated_at: Number(item.updated_at) || Math.floor(Date.now() / 1000)
                        };
                        
                        console.log('Dönüştürülen ürün:', product);
                        return product;
                    });
                    console.log('Tüm dönüştürülen ürünler:', productsArray);
                    setProducts(productsArray);
                } else {
                    console.log('Firebase\'den veri gelmedi');
                    setProducts([]);
                }
                setError(null);
            });
        } catch (err) {
            console.error('Ürünler yüklenirken hata:', err);
            setError('Ürünler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const refreshStockMovements = async () => {
        try {
            setLoading(true);
            const movementsRef = db().ref('stock_movements');
            movementsRef.on('value', (snapshot: any) => {
                const data = snapshot.val();
                console.log('Firebase\'den gelen ham stok hareketleri:', data);
                
                if (data) {
                    const movementsArray = Object.entries(data).map(([id, item]: [string, any]) => {
                        console.log('İşlenen stok hareketi:', { id, item });
                        
                        const movement = {
                            id: Number(item.id),
                            product_id: Number(item.product_id),
                            quantity: String(item.quantity || '0'),
                            description: item.description || '',
                            created_at: Number(item.created_at) || Math.floor(Date.now() / 1000),
                            updated_at: Number(item.updated_at) || Math.floor(Date.now() / 1000)
                        };
                        
                        console.log('Dönüştürülen stok hareketi:', movement);
                        return movement;
                    });
                    console.log('Tüm dönüştürülen stok hareketleri:', movementsArray);
                    setStockMovements(movementsArray);
                } else {
                    console.log('Firebase\'den stok hareketi verisi gelmedi');
                    setStockMovements([]);
                }
                setError(null);
            });
        } catch (err) {
            console.error('Stok hareketleri yüklenirken hata:', err);
            setError('Stok hareketleri yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (product: Product) => {
        try {
            const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
            
            // Yeni bir sayısal ID oluştur (22'den başlayarak artan)
            const lastItemRef = db().ref('items').orderByChild('id').limitToLast(1);
            const snapshot = await lastItemRef.once('value');
            let newId = 22; // Varsayılan başlangıç ID'si
            
            if (snapshot.exists()) {
                const lastItem = Object.values(snapshot.val())[0] as any;
                newId = (lastItem.id || 21) + 1;
            }
            
            const newProduct = {
                id: newId,
                name: product.name,
                description: product.description || '',
                unit: product.unit,
                current_stock: String(product.current_stock),
                minimum_stock: String(product.minimum_stock),
                stock_tracking_type: product.stock_tracking_type || 'manuel',
                weekly_consumption: String(product.weekly_consumption),
                created_at: timestamp,
                updated_at: timestamp
            };
            
            console.log('Firebase\'e eklenecek ürün:', newProduct);
            // Doğrudan ID ile kaydet
            await db().ref(`items/${newId}`).set(newProduct);
            console.log('Ürün başarıyla eklendi');
        } catch (err) {
            console.error('Ürün eklenirken hata:', err);
            setError('Ürün eklenirken bir hata oluştu.');
            throw err;
        }
    };

    const updateProduct = async (product: Product) => {
        try {
            const itemRef = db().ref(`items/${product.id}`);
            await itemRef.update({
                name: product.name,
                description: product.description,
                unit: product.unit,
                current_stock: product.current_stock,
                minimum_stock: product.minimum_stock,
                stock_tracking_type: product.stock_tracking_type,
                weekly_consumption: product.weekly_consumption,
                updated_at: product.updated_at
            });
        } catch (err) {
            setError('Ürün güncellenirken bir hata oluştu.');
            console.error(err);
            throw err;
        }
    };

    const addStockMovement = async (movement: Stock) => {
        try {
            // Önce ürünün mevcut bilgilerini al
            const itemRef = db().ref(`items/${movement.product_id}`);
            const itemSnapshot = await itemRef.once('value');
            const currentItem = itemSnapshot.val();

            if (!currentItem) {
                throw new Error('Ürün bulunamadı');
            }

            // Mevcut stok miktarını ve hareket miktarını sayıya çevir
            const currentStock = Number(currentItem.current_stock || 0);
            const movementQuantity = Number(movement.quantity);

            // Hareket tipini belirle
            const description = movement.description.toLowerCase();
            const isGiris = description.includes('giriş') || description.includes('artış');
            const isCikis = description.includes('çıkış') || description.includes('tüketim');

            console.log('İşlem başlangıcı:', {
                ürün: currentItem.name,
                mevcutStok: currentStock,
                hareketMiktari: movementQuantity,
                hareketTipi: isGiris ? 'Giriş' : isCikis ? 'Çıkış' : 'Bilinmeyen'
            });

            // Yeni stok miktarını hesapla
            let newStock;
            if (isGiris) {
                newStock = currentStock + movementQuantity;
            } else if (isCikis) {
                newStock = Math.max(0, currentStock - movementQuantity);
            } else {
                throw new Error('Geçersiz hareket tipi');
            }

            // Stok hareketini kaydet
            const movementsRef = db().ref('stock_movements');
            const newMovementRef = movementsRef.push();
            const timestamp = Math.floor(Date.now() / 1000);

            const newMovement = {
                id: movement.id,
                product_id: movement.product_id,
                quantity: String(movement.quantity),
                description: movement.description,
                created_at: timestamp,
                updated_at: timestamp
            };

            // Önce stok hareketini kaydet
            await newMovementRef.set(newMovement);
            console.log('Stok hareketi kaydedildi:', newMovement);

            // Sonra ürün stok miktarını güncelle
            const updateData = {
                current_stock: String(newStock),
                updated_at: timestamp
            };

            await itemRef.update(updateData);
            console.log('Ürün stok miktarı güncellendi:', {
                ürün: currentItem.name,
                eskiStok: currentStock,
                yeniStok: newStock,
                değişim: isGiris ? '+' + movementQuantity : '-' + movementQuantity
            });

            // Güncelleme sonrası kontrol
            const updatedSnapshot = await itemRef.once('value');
            const updatedItem = updatedSnapshot.val();
            console.log('Güncelleme sonrası ürün durumu:', updatedItem);

        } catch (err) {
            console.error('Stok hareketi eklenirken hata:', err);
            setError('Stok hareketi eklenirken bir hata oluştu.');
            throw err;
        }
    };

    useEffect(() => {
        refreshProducts();
        refreshStockMovements();
        return () => {
            const itemsRef = db().ref('items');
            const movementsRef = db().ref('stock_movements');
            itemsRef.off();
            movementsRef.off();
        };
    }, []);

    return (
        <AppContext.Provider value={{ 
            products,
            stockMovements,
            loading, 
            error, 
            refreshProducts,
            refreshStockMovements,
            addProduct,
            updateProduct,
            addStockMovement
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