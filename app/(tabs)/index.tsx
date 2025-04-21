import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Card, Button, DataTable, List } from 'react-native-paper';
import { productService, stockService } from '../../services/api';
import { Product, Stock } from '../../types';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Test verileri
      const testProducts = [
        { id: 1, name: 'Test Ürün 1', stock_quantity: 5, price: 100 },
        { id: 2, name: 'Test Ürün 2', stock_quantity: 15, price: 200 },
      ];
      const testStocks = [
        { id: 1, product_id: 1, quantity: 10, created_at: new Date().toISOString() },
        { id: 2, product_id: 2, quantity: -5, created_at: new Date().toISOString() },
      ];

      setProducts(testProducts);
      setStockMovements(testStocks);
      
      // Gerçek API çağrıları
      // const [productsResponse, stockResponse] = await Promise.all([
      //   productService.getAll(),
      //   stockService.getAll()
      // ]);
      // setProducts(productsResponse.data);
      // setStockMovements(stockResponse.data);
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => products.length;
  const getCriticalItems = () => products.filter(p => p.stock_quantity < 10).length;
  const getTotalValue = () => products.reduce((total, product) => total + (product.price * product.stock_quantity), 0);
  const getActiveNotifications = () => getCriticalItems() + stockMovements.length;

  const renderStatsCard = (title: string, value: string | number, color: string) => (
    <Card style={[styles.statsCard, { backgroundColor: color }]}>
      <Card.Content style={styles.statsCardContent}>
        <Text variant="titleMedium" style={styles.statsTitle}>{title}</Text>
        <Text variant="headlineMedium" style={styles.statsValue}>{value}</Text>
      </Card.Content>
    </Card>
  );

  const renderStockMovement = ({ item }: { item: Stock }) => (
    <DataTable.Row>
      <DataTable.Cell style={styles.productCell}>Ürün {item.product_id}</DataTable.Cell>
      <DataTable.Cell style={styles.movementCell}>{item.quantity > 0 ? 'Giriş' : 'Çıkış'}</DataTable.Cell>
      <DataTable.Cell numeric style={styles.quantityCell}>{Math.abs(item.quantity)}</DataTable.Cell>
      <DataTable.Cell style={styles.dateCell}>
        {new Date(item.created_at).toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </DataTable.Cell>
    </DataTable.Row>
  );

  const renderCriticalAlert = ({ item }: { item: Product }) => (
    <List.Item
      title={item.name}
      description={`Mevcut Stok: ${item.stock_quantity}`}
      right={() => (
        <Text style={styles.criticalText}>
          Minimum Stok: 10
        </Text>
      )}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          {renderStatsCard('Toplam Stok Kalemi', getTotalItems(), '#2196F3')}
          {renderStatsCard('Kritik Stok Sayısı', getCriticalItems(), '#FFC107')}
        </View>
        <View style={styles.statsRow}>
          {renderStatsCard('Toplam Stok Değeri', `₺${getTotalValue().toFixed(2)}`, '#4CAF50')}
          {renderStatsCard('Aktif Bildirimler', getActiveNotifications(), '#00BCD4')}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Title title="Son Stok Hareketleri" />
          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Ürün</DataTable.Title>
                <DataTable.Title>Hareket</DataTable.Title>
                <DataTable.Title>Miktar</DataTable.Title>
                <DataTable.Title>Tarih</DataTable.Title>
              </DataTable.Header>
              <FlatList
                data={stockMovements.slice(0, 5)}
                renderItem={renderStockMovement}
                keyExtractor={item => item.id.toString()}
              />
            </DataTable>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Kritik Stok Uyarıları" />
          <Card.Content>
            <FlatList
              data={products.filter(p => p.stock_quantity < 10)}
              renderItem={renderCriticalAlert}
              keyExtractor={item => item.id.toString()}
            />
          </Card.Content>
        </Card>
      </View>

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
  statsContainer: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 4,
    minWidth: '45%',
    margin: 4,
  },
  statsCardContent: {
    padding: 16,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  statsValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 8,
  },
  card: {
    marginBottom: 16,
  },
  criticalText: {
    color: '#f44336',
    alignSelf: 'center',
  },
  refreshButton: {
    margin: 16,
  },
  productCell: {
    flex: 1.5,
    paddingRight: 10,
  },
  movementCell: {
    flex: 1,
    paddingRight: 10,
  },
  quantityCell: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 15,
  },
  dateCell: {
    flex: 2,
    paddingLeft: 10,
  },
});
