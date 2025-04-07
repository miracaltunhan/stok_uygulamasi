import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, Searchbar, IconButton } from 'react-native-paper';
import { productService } from '../../services/api';
import { Product } from '../../types';
import { router } from 'expo-router';

export default function StockItemsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata oluştu:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleLarge">{item.name}</Text>
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => router.push({
                pathname: '/product-form',
                params: { product: item }
              })}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteProduct(item.id)}
            />
          </View>
        </View>
        <Text variant="bodyMedium">Stok: {item.stock_quantity}</Text>
        <Text variant="bodyMedium">Fiyat: ₺{item.price}</Text>
        <Text variant="bodySmall" style={styles.description}>
          {item.description}
        </Text>
      </Card.Content>
    </Card>
  );

  const handleDeleteProduct = async (id: number) => {
    try {
      await productService.delete(id);
      loadProducts();
    } catch (error) {
      console.error('Ürün silinirken hata oluştu:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Ürün ara..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/product-form')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    elevation: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  description: {
    marginTop: 8,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 