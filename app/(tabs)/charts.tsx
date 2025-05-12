import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useApp } from '../../context/AppContext';

const screenWidth = Dimensions.get('window').width;

export default function ChartsScreen() {
  const { products } = useApp();

  // Stok durumu grafiği için veri
  const stockData = {
    labels: products.map(p => p.name),
    datasets: [{
      data: products.map(p => p.current_stock)
    }]
  };

  // Tüketim grafiği için veri
  const consumptionData = {
    labels: products.map(p => p.name),
    datasets: [{
      data: products.map(p => p.monthly_consumption)
    }]
  };

  return (
      <View style={styles.container}>
        <ScrollView>
          <Card style={styles.card}>
            <Card.Title title="Stok Durumu" />
            <Card.Content>
              <BarChart
                  data={stockData}
                  width={screenWidth - 32}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    }
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Aylık Tüketim" />
            <Card.Content>
              <LineChart
                  data={consumptionData}
                  width={screenWidth - 32}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    }
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Kritik Stok Durumu" />
            <Card.Content>
              {products
                  .filter(product => product.current_stock <= product.minimum_stock)
                  .map(product => (
                      <View key={product.id} style={styles.criticalItem}>
                        <Text style={styles.criticalItemName}>{product.name}</Text>
                        <Text style={styles.criticalItemStock}>
                          Mevcut: {product.current_stock} {product.unit} / Minimum: {product.minimum_stock} {product.unit}
                        </Text>
                      </View>
                  ))}
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
  criticalItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  criticalItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  criticalItemStock: {
    fontSize: 14,
    color: '#666',
  },
}); 