import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, DataTable } from 'react-native-paper';
import { useApp } from '../../context/AppContext';

export default function StockMovementsScreen() {
  const { products, stockMovements } = useApp();

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Bilinmeyen Ürün';
  };

  const getProductUnit = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.unit : '';
  };

  return (
      <View style={styles.container}>
        <ScrollView>
          <Card style={styles.card}>
            <Card.Title title="Stok Hareketleri" />
            <Card.Content>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Tarih</DataTable.Title>
                  <DataTable.Title>Ürün</DataTable.Title>
                  <DataTable.Title>Hareket</DataTable.Title>
                  <DataTable.Title>Miktar</DataTable.Title>
                  <DataTable.Title>Açıklama</DataTable.Title>
                </DataTable.Header>

                {stockMovements
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map(movement => (
                        <DataTable.Row key={movement.id}>
                          <DataTable.Cell>
                            {new Date(movement.created_at).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </DataTable.Cell>
                          <DataTable.Cell>{getProductName(movement.product_id)}</DataTable.Cell>
                          <DataTable.Cell>
                            <Text style={[
                              styles.movementType,
                              { color: movement.quantity > 0 ? '#4CAF50' : '#F44336' }
                            ]}>
                              {movement.quantity > 0 ? 'Giriş' : 'Çıkış'}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell>
                            {Math.abs(movement.quantity)} {getProductUnit(movement.product_id)}
                          </DataTable.Cell>
                          <DataTable.Cell>{movement.description}</DataTable.Cell>
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
  card: {
    marginBottom: 16,
  },
  movementType: {
    fontWeight: 'bold',
  },
}); 