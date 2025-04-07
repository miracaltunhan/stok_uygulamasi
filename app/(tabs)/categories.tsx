import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, IconButton } from 'react-native-paper';
import { categoryService } from '../../services/api';
import { Category } from '../../types';
import { router } from 'expo-router';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata oluştu:', error);
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleLarge">{item.name}</Text>
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => router.push({
                pathname: '/category-form',
                params: { category: item }
              })}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteCategory(item.id)}
            />
          </View>
        </View>
        <Text variant="bodyMedium">{item.description}</Text>
      </Card.Content>
    </Card>
  );

  const handleDeleteCategory = async (id: number) => {
    try {
      await categoryService.delete(id);
      loadCategories();
    } catch (error) {
      console.error('Kategori silinirken hata oluştu:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/category-form')}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 