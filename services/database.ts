import { database } from './firebase';
import { ref, set, get, update, remove, push } from 'firebase/database';

// Ürün ekleme
export const addProduct = async (product: any) => {
  try {
    const productsRef = ref(database, 'products');
    const newProductRef = push(productsRef);
    await set(newProductRef, product);
    return newProductRef.key;
  } catch (error) {
    console.error('Ürün eklenirken hata oluştu:', error);
    throw error;
  }
};

// Tüm ürünleri getirme
export const getProducts = async () => {
  try {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error('Ürünler getirilirken hata oluştu:', error);
    throw error;
  }
};

// Ürün güncelleme
export const updateProduct = async (productId: string, updates: any) => {
  try {
    const productRef = ref(database, `products/${productId}`);
    await update(productRef, updates);
  } catch (error) {
    console.error('Ürün güncellenirken hata oluştu:', error);
    throw error;
  }
};

// Ürün silme
export const deleteProduct = async (productId: string) => {
  try {
    const productRef = ref(database, `products/${productId}`);
    await remove(productRef);
  } catch (error) {
    console.error('Ürün silinirken hata oluştu:', error);
    throw error;
  }
}; 