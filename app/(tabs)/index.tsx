import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, DataTable } from 'react-native-paper';
import { useApp } from '../../context/AppContext';

export default function HomeScreen() {
  const { products } = useApp();

  const getTotalItems = () => products.length;
  const getCriticalItems = () => products.filter(p => p.current_stock <= p.minimum_stock).length;
  const getTotalValue = () => products.reduce((total, product) => total + (product.current_stock * product.monthly_consumption), 0);

  return (
      <View style={styles.container}>
        <ScrollView>
          {/* İstatistik Kartları */}
          <View style={styles.statsContainer}>
            <Card style={styles.statsCard}>
              <Card.Content>
                <Text variant="titleLarge">Toplam Ürün</Text>
                <Text variant="headlineMedium">{getTotalItems()}</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statsCard}>
              <Card.Content>
                <Text variant="titleLarge">Kritik Stok</Text>
                <Text variant="headlineMedium">{getCriticalItems()}</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statsCard}>
              <Card.Content>
                <Text variant="titleLarge">Toplam Değer</Text>
                <Text variant="headlineMedium">{getTotalValue()} TL</Text>
              </Card.Content>
            </Card>
          </View>

          {/* Kritik Stokta Olan Ürünler */}
          <Card style={styles.card}>
            <Card.Title title="Kritik Stokta Olan Ürünler" />
            <Card.Content>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Ürün Adı</DataTable.Title>
                  <DataTable.Title>Mevcut Stok</DataTable.Title>
                  <DataTable.Title>Minimum Stok</DataTable.Title>
                </DataTable.Header>

                {products
                    .filter(product => product.current_stock <= product.minimum_stock)
                    .map(product => (
                        <DataTable.Row key={product.id}>
                          <DataTable.Cell>{product.name}</DataTable.Cell>
                          <DataTable.Cell>{product.current_stock} {product.unit}</DataTable.Cell>
                          <DataTable.Cell>{product.minimum_stock} {product.unit}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
              </DataTable>
            </Card.Content>
          </Card>

          {/* Son Eklenen Ürünler */}
          <Card style={styles.card}>
            <Card.Title title="Son Eklenen Ürünler" />
            <Card.Content>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Ürün Adı</DataTable.Title>
                  <DataTable.Title>Mevcut Stok</DataTable.Title>
                  <DataTable.Title>Birim</DataTable.Title>
                </DataTable.Header>

                {products
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
                    .map(product => (
                        <DataTable.Row key={product.id}>
                          <DataTable.Cell>{product.name}</DataTable.Cell>
                          <DataTable.Cell>{product.current_stock}</DataTable.Cell>
                          <DataTable.Cell>{product.unit}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
              </DataTable>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    width: '30%',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
});
