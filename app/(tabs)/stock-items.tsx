import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Button, DataTable, Portal, Modal, TextInput, FAB } from 'react-native-paper';
import { productService } from '../../services/api';
import { Product } from '../../types';

export default function StockItemsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [consumeModalVisible, setConsumeModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async () => {
    if (!selectedProduct || !quantity) return;

    try {
      await productService.addStock(selectedProduct.id, {
        quantity: parseInt(quantity),
        description
      });
      setAddModalVisible(false);
      setQuantity('');
      setDescription('');
      loadData();
    } catch (error) {
      console.error('Stok eklenirken hata oluştu:', error);
    }
  };

  const handleConsumeStock = async () => {
    if (!selectedProduct || !quantity) return;

    try {
      await productService.consumeStock(selectedProduct.id, {
        quantity: parseInt(quantity),
        description
      });
      setConsumeModalVisible(false);
      setQuantity('');
      setDescription('');
      loadData();
    } catch (error) {
      console.error('Stok tüketilirken hata oluştu:', error);
    }
  };

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Yükleniyor...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={loadData}>
            Yeniden Dene
          </Button>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Ürünler" />
          <Card.Content>
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={styles.column}>Ürün Adı</DataTable.Title>
                  <DataTable.Title style={styles.column}>Birim</DataTable.Title>
                  <DataTable.Title style={styles.column}>Mevcut Stok</DataTable.Title>
                  <DataTable.Title style={styles.column}>Minimum Stok</DataTable.Title>
                  <DataTable.Title style={styles.column}>Aylık Tüketim</DataTable.Title>
                  <DataTable.Title style={styles.column}>Durum</DataTable.Title>
                  <DataTable.Title style={styles.column}>İşlemler</DataTable.Title>
                </DataTable.Header>

                {products.length > 0 ? (
                    products.map((item) => (
                        <DataTable.Row key={item.id}>
                          <DataTable.Cell style={styles.column}>{item.name}</DataTable.Cell>
                          <DataTable.Cell style={styles.column}>{item.unit}</DataTable.Cell>
                          <DataTable.Cell style={styles.column}>{item.stock_quantity} {item.unit}</DataTable.Cell>
                          <DataTable.Cell style={styles.column}>{item.minimum_stock} {item.unit}</DataTable.Cell>
                          <DataTable.Cell style={styles.column}>{item.monthly_consumption} {item.unit}</DataTable.Cell>
                          <DataTable.Cell style={styles.column}>
                            <Text style={[
                              styles.statusBadge,
                              { backgroundColor: item.stock_quantity <= item.minimum_stock ? '#dc3545' : '#28a745' }
                            ]}>
                              {item.stock_quantity <= item.minimum_stock ? 'Kritik Seviye' : 'Normal'}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.column}>
                            <View style={styles.actionButtons}>
                              <Button
                                  mode="contained"
                                  buttonColor="#28a745"
                                  onPress={() => {
                                    setSelectedProduct(item);
                                    setAddModalVisible(true);
                                  }}
                                  style={styles.actionButton}
                              >
                                +
                              </Button>
                              <Button
                                  mode="contained"
                                  buttonColor="#007bff"
                                  onPress={() => {
                                    setSelectedProduct(item);
                                    setConsumeModalVisible(true);
                                  }}
                                  style={styles.actionButton}
                              >
                                -
                              </Button>
                            </View>
                          </DataTable.Cell>
                        </DataTable.Row>
                    ))
                ) : (
                    <DataTable.Row>
                      <DataTable.Cell>Henüz ürün bulunmamaktadır.</DataTable.Cell>
                    </DataTable.Row>
                )}
              </DataTable>
            </ScrollView>
          </Card.Content>
        </Card>

        <Portal>
          <Modal
              visible={addModalVisible}
              onDismiss={() => setAddModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
          >
            <Text variant="titleLarge" style={styles.modalTitle}>
              {selectedProduct?.name} - Stok Artışı
            </Text>
            <TextInput
                label="Eklenecek Miktar"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                label="Açıklama"
                value={description}
                onChangeText={setDescription}
                multiline
                style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button onPress={() => setAddModalVisible(false)}>İptal</Button>
              <Button mode="contained" onPress={handleAddStock}>Stok Ekle</Button>
            </View>
          </Modal>

          <Modal
              visible={consumeModalVisible}
              onDismiss={() => setConsumeModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
          >
            <Text variant="titleLarge" style={styles.modalTitle}>
              {selectedProduct?.name} - Stok Tüketimi
            </Text>
            <TextInput
                label="Tüketim Miktarı"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                label="Açıklama"
                value={description}
                onChangeText={setDescription}
                multiline
                style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button onPress={() => setConsumeModalVisible(false)}>İptal</Button>
              <Button mode="contained" onPress={handleConsumeStock}>Tüketimi Kaydet</Button>
            </View>
          </Modal>
        </Portal>

        <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => {
              // Yeni ürün ekleme sayfasına yönlendir
            }}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    margin: 8,
    flex: 1,
  },
  column: {
    width: 150,
    paddingHorizontal: 8,
  },
  statusBadge: {
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginHorizontal: 2,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});