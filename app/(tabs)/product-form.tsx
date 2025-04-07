import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { productService, categoryService } from '../../services/api';
import { Product, Category } from '../../types';

export default function ProductFormScreen({ route, navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    if (route.params?.product) {
      const product = route.params.product;
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCategoryId(product.category_id.toString());
    }
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata oluştu:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const productData = {
        name,
        description,
        price: parseFloat(price),
        category_id: parseInt(categoryId),
      };

      if (route.params?.product) {
        await productService.update(route.params.product.id, productData);
      } else {
        await productService.create(productData);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Ürün kaydedilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Ürün Adı"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          label="Açıklama"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.input}
        />
        <TextInput
          label="Fiyat"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <View style={styles.pickerContainer}>
          <Text>Kategori</Text>
          <Picker
            selectedValue={categoryId}
            onValueChange={setCategoryId}
            style={styles.picker}
          >
            <Picker.Item label="Kategori Seçin" value="" />
            {categories.map(category => (
              <Picker.Item
                key={category.id}
                label={category.name}
                value={category.id.toString()}
              />
            ))}
          </Picker>
        </View>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        >
          {route.params?.product ? 'Güncelle' : 'Kaydet'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  button: {
    marginTop: 16,
  },
}); 