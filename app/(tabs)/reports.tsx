import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, DataTable } from 'react-native-paper';
import { productService, stockService } from '../../services/api';
import { Product, Stock } from '../../types';

export default function ReportsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsResponse, stockResponse] = await Promise.all([
        productService.getAll(),
        stockService.getAll()
      ]);
      setProducts(productsResponse.data);
      setStockMovements(stockResponse.data);
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalStockValue = () => {
    return products.reduce((total, product) => {
      return total + (product.price * product.stock_quantity);
    }, 0);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock_quantity < 10);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Stok Durumu Özeti</Text>
          <View style={styles.summaryItem}>
            <Text variant="titleMedium">Toplam Ürün Sayısı:</Text>
            <Text variant="bodyLarge">{products.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text variant="titleMedium">Toplam Stok Değeri:</Text>
            <Text variant="bodyLarge">₺{getTotalStockValue().toFixed(2)}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Kritik Stok Seviyesi</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Ürün</DataTable.Title>
              <DataTable.Title numeric>Stok</DataTable.Title>
            </DataTable.Header>

            {getLowStockProducts().map(product => (
              <DataTable.Row key={product.id}>
                <DataTable.Cell>{product.name}</DataTable.Cell>
                <DataTable.Cell numeric>{product.stock_quantity}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={loadData}
        loading={loading}
        style={styles.refreshButton}
      >
        Yenile
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  refreshButton: {
    margin: 16,
  },
}); 