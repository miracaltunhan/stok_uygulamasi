import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, DataTable, Portal, Modal, TextInput, FAB } from 'react-native-paper';
import { stockService } from '../../services/api';
import { Stock } from '../../types';

export default function StockMovementsScreen() {
  const [movements, setMovements] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Stock | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await stockService.getAll();
      setMovements(response.data);
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovement = async (id: number) => {
    try {
      await stockService.delete(id);
      loadData();
    } catch (error) {
      console.error('Hareket silinirken hata oluştu:', error);
    }
  };

  const handleEditMovement = async () => {
    if (!selectedMovement) return;
    
    try {
      await stockService.update(selectedMovement.id, {
        description
      });
      setEditModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Hareket güncellenirken hata oluştu:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Stok Hareketleri" />
        <Card.Content>
          <ScrollView horizontal>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.column}>Ürün</DataTable.Title>
                <DataTable.Title style={styles.column}>Miktar</DataTable.Title>
                <DataTable.Title style={styles.column}>Tür</DataTable.Title>
                <DataTable.Title style={styles.column}>Tarih</DataTable.Title>
                <DataTable.Title style={styles.column}>Açıklama</DataTable.Title>
                <DataTable.Title style={styles.column}>İşlemler</DataTable.Title>
              </DataTable.Header>

              {movements.length > 0 ? (
                movements.map((movement) => (
                  <DataTable.Row key={movement.id}>
                    <DataTable.Cell style={styles.column}>{movement.product_id}</DataTable.Cell>
                    <DataTable.Cell style={styles.column}>{Math.abs(movement.quantity)}</DataTable.Cell>
                    <DataTable.Cell style={styles.column}>
                      <Text style={[
                        styles.statusBadge,
                        { backgroundColor: movement.quantity > 0 ? '#28a745' : '#dc3545' }
                      ]}>
                        {movement.quantity > 0 ? 'Giriş' : 'Çıkış'}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.column}>
                      {new Date(movement.created_at).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.column}>{movement.description || '-'}</DataTable.Cell>
                    <DataTable.Cell style={styles.column}>
                      <View style={styles.actionButtons}>
                        <Button
                          mode="contained"
                          buttonColor="#ffc107"
                          onPress={() => {
                            setSelectedMovement(movement);
                            setDescription(movement.description || '');
                            setEditModalVisible(true);
                          }}
                          style={styles.actionButton}
                        >
                          Düzenle
                        </Button>
                        <Button
                          mode="contained"
                          buttonColor="#dc3545"
                          onPress={() => handleDeleteMovement(movement.id)}
                          style={styles.actionButton}
                        >
                          Sil
                        </Button>
                      </View>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))
              ) : (
                <DataTable.Row>
                  <DataTable.Cell style={[styles.column, styles.emptyCell]}>
                    Henüz stok hareketi bulunmuyor.
                  </DataTable.Cell>
                </DataTable.Row>
              )}
            </DataTable>
          </ScrollView>
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Hareket Düzenle
          </Text>
          <TextInput
            label="Açıklama"
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button onPress={() => setEditModalVisible(false)}>İptal</Button>
            <Button mode="contained" onPress={handleEditMovement}>Kaydet</Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 8,
    flex: 1,
  },
  column: {
    width: 150,
    paddingHorizontal: 8,
  },
  emptyCell: {
    justifyContent: 'center',
    alignItems: 'center',
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
}); 