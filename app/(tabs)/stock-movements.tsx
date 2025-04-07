import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, Button } from 'react-native-paper';
import { stockService, productService } from '../../services/api';
import { Stock, Product } from '../../types';
import { router } from 'expo-router';

export default function StockMovementsScreen() {
  const [stockMovements, setStockMovements] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stockResponse, productsResponse] = await Promise.all([
        stockService.getAll(),
        productService.getAll()
      ]);
      setStockMovements(stockResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
    }
  };

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Bilinmeyen Ürün';
  };

  const renderStockMovement = ({ item }: { item: Stock }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <Text variant="titleMedium">{getProductName(item.product_id)}</Text>
        <Text variant="bodyMedium">Miktar: {item.quantity}</Text>
        <Text variant="bodySmall">
          Tarih: {new Date(item.created_at).toLocaleDateString('tr-TR')}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={stockMovements}
        renderItem={renderStockMovement}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/stock-movement-form')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 