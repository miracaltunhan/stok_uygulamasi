import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Button, DataTable, Portal, Modal, TextInput, FAB, SegmentedButtons } from 'react-native-paper';
import { Product, Stock } from '../../types';
import { useApp } from '../../context/AppContext';

// Test verileri
const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Kalem',
    description: 'Siyah tükenmez kalem',
    unit: 'adet',
    current_stock: '50',
    minimum_stock: '10',
    stock_tracking_type: 'manuel',
    weekly_consumption: '0',
    created_at: Math.floor(Date.now() / 1000),
    updated_at: Math.floor(Date.now() / 1000)
  },
  {
    id: 2,
    name: 'A4 Kağıt',
    description: '80 gr A4 kağıt',
    unit: 'paket',
    current_stock: '15',
    minimum_stock: '5',
    stock_tracking_type: 'manuel',
    weekly_consumption: '0',
    created_at: Math.floor(Date.now() / 1000),
    updated_at: Math.floor(Date.now() / 1000)
  }
];

export default function StockItemsScreen() {
  const { products, addProduct, updateProduct, addStockMovement, loading, error, refreshProducts } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('adet');
  const [currentStock, setCurrentStock] = useState('');
  const [minimumStock, setMinimumStock] = useState('');
  const [stockTrackingType, setStockTrackingType] = useState<'manuel' | 'otomatik'>('manuel');
  const [weeklyConsumption, setWeeklyConsumption] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [consumeModalVisible, setConsumeModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setFormError('');

      if (!name || !unit || !currentStock || !minimumStock) {
        setFormError('Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      if (stockTrackingType === 'otomatik' && !weeklyConsumption) {
        setFormError('Otomatik stok takibi için haftalık tüketim miktarı gereklidir.');
        return;
      }

      const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp

      const product: Omit<Product, 'id'> = {
        name,
        description: description || '',
        unit,
        current_stock: String(currentStock),
        minimum_stock: String(minimumStock),
        stock_tracking_type: stockTrackingType,
        weekly_consumption: String(stockTrackingType === 'otomatik' ? weeklyConsumption : '0'),
        created_at: timestamp,
        updated_at: timestamp
      };

      await addProduct(product as Product);
      setModalVisible(false);
      resetForm();
      refreshProducts();
    } catch (err) {
      setFormError('Ürün eklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setUnit('adet');
    setCurrentStock('');
    setMinimumStock('');
    setStockTrackingType('manuel');
    setWeeklyConsumption('');
    setFormError('');
  };

  const handleAddStock = async () => {
    if (!selectedProduct || !quantity) return;

    try {
      const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
      const movement: Stock = {
        id: 0, // ID AppContext'te otomatik oluşturulacak
        product_id: selectedProduct.id,
        quantity: String(quantity),
        description: description || 'Stok artışı',
        created_at: timestamp,
        updated_at: timestamp
      };
      await addStockMovement(movement);
      setAddModalVisible(false);
      refreshProducts();
    } catch (err) {
      console.error('Stok eklenirken hata oluştu:', err);
      setFormError('Stok eklenirken bir hata oluştu.');
    }
  };

  const handleConsumeStock = async () => {
    if (!selectedProduct || !quantity) return;

    try {
      const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
      const movement: Stock = {
        id: 0, // ID AppContext'te otomatik oluşturulacak
        product_id: selectedProduct.id,
        quantity: String(-Number(quantity)), // Negatif değer olarak string
        description: description || 'Stok tüketimi',
        created_at: timestamp,
        updated_at: timestamp
      };
      await addStockMovement(movement);
      setConsumeModalVisible(false);
      refreshProducts();
    } catch (err) {
      console.error('Stok tüketilirken hata oluştu:', err);
      setFormError('Stok tüketilirken bir hata oluştu.');
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
          <Button mode="contained" onPress={refreshProducts}>
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
                <DataTable.Title style={styles.column}>Takip Tipi</DataTable.Title>
                <DataTable.Title style={styles.column}>Haftalık Tüketim</DataTable.Title>
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
                    <DataTable.Cell style={styles.column}>
                      {item.stock_tracking_type === 'otomatik' ? 'Otomatik' : 'Manuel'}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.column}>
                      {item.stock_tracking_type === 'otomatik' ? `${item.weekly_consumption} ${item.unit}` : '-'}
                    </DataTable.Cell>
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
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            resetForm();
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView>
            <Card>
              <Card.Title title="Yeni Ürün Ekle" />
              <Card.Content>
                <TextInput
                  label="Ürün Adı"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  mode="outlined"
                />

                <TextInput
                  label="Açıklama"
                  value={description}
                  onChangeText={setDescription}
                  style={styles.input}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                />

                <TextInput
                  label="Birim"
                  value={unit}
                  onChangeText={setUnit}
                  style={styles.input}
                  mode="outlined"
                  placeholder="adet, kg, lt, paket"
                />

                <TextInput
                  label="Mevcut Stok"
                  value={currentStock}
                  onChangeText={setCurrentStock}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                />

                <TextInput
                  label="Minimum Stok"
                  value={minimumStock}
                  onChangeText={setMinimumStock}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Stok Takip Tipi</Text>
                <SegmentedButtons
                  value={stockTrackingType}
                  onValueChange={(value) => setStockTrackingType(value as 'manuel' | 'otomatik')}
                  buttons={[
                    { value: 'manuel', label: 'Manuel' },
                    { value: 'otomatik', label: 'Otomatik' }
                  ]}
                  style={styles.segmentedButtons}
                />

                {stockTrackingType === 'otomatik' && (
                  <TextInput
                    label="Haftalık Tüketim"
                    value={weeklyConsumption}
                    onChangeText={setWeeklyConsumption}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="numeric"
                  />
                )}

                {formError ? <Text style={styles.error}>{formError}</Text> : null}

                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                    style={styles.button}
                  >
                    İptal
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    style={styles.button}
                  >
                    Kaydet
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </Modal>
      </Portal>

      <Button
        mode="contained"
        onPress={() => setModalVisible(true)}
        style={styles.fab}
        icon="plus"
      >
        Yeni Ürün Ekle
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    marginLeft: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
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
});