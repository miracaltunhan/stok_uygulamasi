import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView as RNScrollView, Dimensions, Alert } from 'react-native';
import { Text, Card, Button, Menu } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import StockService from '../../services/StockService';
import axios, { AxiosError } from 'axios';

interface StockMovement {
  dates: string[];
  stock: number[];
}

interface Product {
  id: number;
  name: string;
  unit: string;
  stock_quantity: number;
}

interface StockAnalytics {
  total_items: number;
  critical_items: number;
  stock_tracking_distribution: {
    otomatik: number;
    manuel: number;
  };
}

export default function ChartsScreen() {
  const [analytics, setAnalytics] = useState<StockAnalytics>({
    total_items: 0,
    critical_items: 0,
    stock_tracking_distribution: {
      otomatik: 0,
      manuel: 0
    }
  });
  const [activeItems, setActiveItems] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movementsData, setMovementsData] = useState<StockMovement | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('API çağrısı başlıyor...');
      
      const [productsResponse, analyticsResponse] = await Promise.all([
        StockService.getAllItems(),
        StockService.getStockAnalytics()
      ]);
      
      console.log('Ürünler:', productsResponse);
      console.log('Analitik veriler:', analyticsResponse);
      
      setActiveItems(productsResponse);
      setAnalytics(analyticsResponse);
    } catch (error: unknown) {
      console.error('Veri yüklenirken detaylı hata:', error);
      if (axios.isAxiosError(error)) {
        // Sunucudan gelen hata yanıtı
        console.error('Sunucu yanıtı:', error.response?.data);
        console.error('Durum kodu:', error.response?.status);
      } else if (error instanceof Error) {
        // İstek oluşturulurken hata oluştu
        console.error('İstek hatası:', error.message);
      }
      
      Alert.alert(
        'Hata',
        'Veriler yüklenirken bir hata oluştu: ' + (axios.isAxiosError(error) ? error.response?.data?.message : error instanceof Error ? error.message : 'Bilinmeyen hata')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = async (product: Product) => {
    setSelectedProduct(product);
    setMenuVisible(false);

    try {
      console.log('Ürün hareketleri yükleniyor:', product.id);
      const response = await StockService.getProductMovements(product.id);
      console.log('Ürün hareketleri:', response);
      setMovementsData(response);
    } catch (error: unknown) {
      console.error('Stok hareketleri yüklenirken detaylı hata:', error);
      Alert.alert(
        'Hata',
        'Stok hareketleri yüklenirken bir hata oluştu: ' + (axios.isAxiosError(error) ? error.response?.data?.message : error instanceof Error ? error.message : 'Bilinmeyen hata')
      );
    }
  };

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
  };

  const pieChartData = [
    {
      name: 'Normal Stok',
      population: analytics.total_items - analytics.critical_items,
      color: '#36A2EB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Kritik Stok',
      population: analytics.critical_items,
      color: '#FF6384',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ];

  const trackingPieData = [
    {
      name: 'Otomatik',
      population: analytics.stock_tracking_distribution.otomatik,
      color: '#FF9F40',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Manuel',
      population: analytics.stock_tracking_distribution.manuel,
      color: '#9966FF',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <Text>Veriler yükleniyor...</Text>
      </View>
    );
  }

  if (!analytics || !analytics.stock_tracking_distribution) {
    return (
      <View style={[styles.container, styles.loading]}>
        <Text>Veri bulunamadı veya hatalı format</Text>
        <Button mode="contained" onPress={loadData} style={styles.retryButton}>
          Yeniden Dene
        </Button>
      </View>
    );
  }

  return (
    <RNScrollView style={styles.container} scrollEnabled={true} nestedScrollEnabled={true}>
      <View>
        <Text variant="headlineMedium" style={styles.title}>Stok Analiz Grafikleri</Text>
        
        <Card style={styles.card}>
          <Card.Title title="Stok Durumu" />
          <Card.Content>
            <PieChart
              data={pieChartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Stok Takip Türü" />
          <Card.Content>
            <PieChart
              data={trackingPieData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Stok Hareketleri Analizi" />
          <Card.Content>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button onPress={() => setMenuVisible(true)}>
                  {selectedProduct ? selectedProduct.name : 'Ürün Seçin'}
                </Button>
              }
            >
              {activeItems.map((item) => (
                <Menu.Item
                  key={item.id}
                  onPress={() => handleProductSelect(item)}
                  title={`${item.name} ${item.unit}`}
                />
              ))}
            </Menu>

            {selectedProduct && (
              <View style={styles.productInfo}>
                <Text>Seçili Ürün: {selectedProduct.name}</Text>
                <Text>Birim: {selectedProduct.unit}</Text>
              </View>
            )}

            {movementsData && (
              <LineChart
                data={{
                  labels: movementsData.dates,
                  datasets: [{
                    data: movementsData.stock
                  }]
                }}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            )}
          </Card.Content>
        </Card>
      </View>
    </RNScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    padding: 16,
    textAlign: 'center',
  },
  card: {
    margin: 8,
  },
  productInfo: {
    marginVertical: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  retryButton: {
    marginTop: 16,
  }
}); 