import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Button, DataTable, Portal, Modal, TextInput, FAB } from 'react-native-paper';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

// Test verileri
const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Kalem',
    description: 'Siyah tükenmez kalem',
    unit: 'adet',
    current_stock: 50,
    minimum_stock: 10,
    monthly_consumption: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'A4 Kağıt',
    description: '80 gr A4 kağıt',
    unit: 'paket',
    current_stock: 15,
    minimum_stock: 5,
    monthly_consumption: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function StockItemsScreen() {
  const { products, addProduct, updateProduct, addStockMovement } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [consumeModalVisible, setConsumeModalVisible] = useState(false);
  const [newProductModalVisible, setNewProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  // Yeni ürün için state'ler
  const [newProductName, setNewProductName] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('');
  const [newProductCurrentStock, setNewProductCurrentStock] = useState('');
  const [newProductMinimumStock, setNewProductMinimumStock] = useState('');
  const [newProductMonthlyConsumption, setNewProductMonthlyConsumption] = useState('');

  const handleAddStock = () => {
    if (!selectedProduct || !quantity) return;

    const updatedProduct = {
      ...selectedProduct,
      current_stock: selectedProduct.current_stock + parseInt(quantity),
      updated_at: new Date().toISOString()
    };

    updateProduct(updatedProduct);

    addStockMovement({
      id: Date.now(),
      product_id: selectedProduct.id,
      quantity: parseInt(quantity),
      description: description || 'Stok girişi',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    setAddModalVisible(false);
    setQuantity('');
    setDescription('');
  };

  const handleConsumeStock = () => {
    if (!selectedProduct || !quantity) return;

    const updatedProduct = {
      ...selectedProduct,
      current_stock: selectedProduct.current_stock - parseInt(quantity),
      updated_at: new Date().toISOString()
    };

    updateProduct(updatedProduct);

    addStockMovement({
      id: Date.now(),
      product_id: selectedProduct.id,
      quantity: -parseInt(quantity),
      description: description || 'Stok çıkışı',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    setConsumeModalVisible(false);
    setQuantity('');
    setDescription('');
  };

  const handleAddNewProduct = () => {
    if (!newProductName || !newProductUnit || !newProductCurrentStock || !newProductMinimumStock || !newProductMonthlyConsumption) {
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: newProductName,
      description: newProductDescription,
      unit: newProductUnit,
      current_stock: parseInt(newProductCurrentStock),
      minimum_stock: parseInt(newProductMinimumStock),
      monthly_consumption: parseInt(newProductMonthlyConsumption),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addProduct(newProduct);
    setNewProductModalVisible(false);
    setNewProductName('');
    setNewProductDescription('');
    setNewProductUnit('');
    setNewProductCurrentStock('');
    setNewProductMinimumStock('');
    setNewProductMonthlyConsumption('');
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
          <Button mode="contained" onPress={() => setError(null)}>
            Yeniden Dene
          </Button>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Card>
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
                          <DataTable.Cell style={styles.column}>{item.current_stock} {item.unit}</DataTable.Cell>
                          <DataTable.Cell style={styles.column}>{item.minimum_stock} {item.unit}</DataTable.Cell>
                          <DataTable.Cell style={styles.column}>{item.monthly_consumption} {item.unit}</DataTable.Cell>
                          <DataTable.Cell style={styles.column}>
                            <Text style={[
                              styles.statusBadge,
                              { backgroundColor: item.current_stock <= item.minimum_stock ? '#dc3545' : '#28a745' }
                            ]}>
                              {item.current_stock <= item.minimum_stock ? 'Kritik Seviye' : 'Normal'}
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
          {/* Stok Ekleme Modalı */}
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

          {/* Stok Tüketim Modalı */}
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

          {/* Yeni Ürün Ekleme Modalı */}
          <Modal
              visible={newProductModalVisible}
              onDismiss={() => setNewProductModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
          >
            <Text variant="titleLarge" style={styles.modalTitle}>Yeni Ürün Ekle</Text>
            <TextInput
                label="Ürün Adı"
                value={newProductName}
                onChangeText={setNewProductName}
                style={styles.input}
            />
            <TextInput
                label="Birim (kg, adet, lt vb.)"
                value={newProductUnit}
                onChangeText={setNewProductUnit}
                style={styles.input}
            />
            <TextInput
                label="Açıklama"
                value={newProductDescription}
                onChangeText={setNewProductDescription}
                multiline
                style={styles.input}
            />
            <TextInput
                label="Mevcut Stok"
                value={newProductCurrentStock}
                onChangeText={setNewProductCurrentStock}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                label="Minimum Stok"
                value={newProductMinimumStock}
                onChangeText={setNewProductMinimumStock}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                label="Aylık Tüketim"
                value={newProductMonthlyConsumption}
                onChangeText={setNewProductMonthlyConsumption}
                keyboardType="numeric"
                style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button onPress={() => setNewProductModalVisible(false)}>İptal</Button>
              <Button mode="contained" onPress={handleAddNewProduct}>Ürün Ekle</Button>
            </View>
          </Modal>
        </Portal>

        <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => setNewProductModalVisible(true)}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    padding: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  column: {
    width: 150,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    minWidth: 40,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  statusBadge: {
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
});