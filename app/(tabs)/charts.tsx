import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, Menu, Divider } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useApp } from '../../context/AppContext';

const screenWidth = Dimensions.get('window').width;

export default function ChartsScreen() {
  const { products, stockMovements } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Stok durumu grafiği için veri
  const stockStatusData = {
    labels: ['Normal Stok', 'Kritik Stok'],
    datasets: [{
      data: [
        products.filter(p => Number(p.current_stock) > Number(p.minimum_stock)).length,
        products.filter(p => Number(p.current_stock) <= Number(p.minimum_stock)).length
      ]
    }]
  };

  // Stok takip türü grafiği için veri
  const stockTrackingData = {
    labels: ['Otomatik', 'Manuel'],
    datasets: [{
      data: [
        products.filter(p => p.stock_tracking_type === 'otomatik').length,
        products.filter(p => p.stock_tracking_type === 'manuel').length
      ]
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: '#e0e0e0',
    },
    propsForVerticalLabels: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    propsForHorizontalLabels: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  };

  const renderProductInfo = () => {
    if (!selectedProduct) return null;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return null;

    const avgMonthlyConsumption = product.stock_tracking_type === 'otomatik' 
      ? Number(product.weekly_consumption) * 4 
      : 'Hesaplanamadı';

    const monthsUntilCritical = product.stock_tracking_type === 'otomatik' && Number(product.weekly_consumption) > 0
      ? Math.floor(Number(product.current_stock) / (Number(product.weekly_consumption) * 4))
      : 'Hesaplanamadı';

    // Seçilen ürünün stok hareketlerini filtrele
    const productMovements = stockMovements.filter(m => m.product_id === selectedProduct);
    
    // Son 6 ayın tarihlerini oluştur
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' });
    }).reverse();

    // Stok durumu grafiği için veri
    const stockData = {
      labels: last6Months,
      datasets: [
        {
          data: last6Months.map(month => {
            const monthMovements = productMovements.filter(m => {
              const movementDate = new Date(m.created_at * 1000);
              return movementDate.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) === month;
            });
            return monthMovements.reduce((acc, m) => acc + Number(m.quantity), 0);
          }),
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Yeşil
          strokeWidth: 3,
          fillShadowGradient: '#2ecc71',
          fillShadowGradientOpacity: 0.4,
          fillColor: 'rgba(46, 204, 113, 0.2)', // Açık yeşil
        }
      ]
    };

    // Tahmin grafiği için veri
    const forecastData = {
      labels: [...last6Months, 'Tahmin'],
      datasets: [
        {
          data: [
            ...last6Months.map(month => {
              const monthMovements = productMovements.filter(m => {
                const movementDate = new Date(m.created_at * 1000);
                return movementDate.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) === month;
              });
              return monthMovements.reduce((acc, m) => acc + Number(m.quantity), 0);
            }),
            productMovements.length > 0 ? 
              productMovements[productMovements.length - 1].quantity : 
              Number(product.current_stock)
          ],
          color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`, // Mor
          strokeWidth: 3,
          fillShadowGradient: '#9b59b6',
          fillShadowGradientOpacity: 0.4,
          fillColor: 'rgba(155, 89, 182, 0.2)', // Açık mor
        }
      ]
    };

    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Seçili Ürün: {product.name}</Text>
        <Text style={styles.infoSubtitle}>Birim: {product.unit}</Text>
        
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statTitle}>Aylık Ortalama Tüketim</Text>
              <Text style={styles.statValue}>
                {typeof avgMonthlyConsumption === 'number' 
                  ? `${avgMonthlyConsumption} ${product.unit}/ay`
                  : avgMonthlyConsumption}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statTitle}>Mevcut Stok</Text>
              <Text style={styles.statValue}>{product.current_stock} {product.unit}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statTitle}>Kritik Seviyeye Kalan Süre</Text>
              <Text style={styles.statValue}>
                {typeof monthsUntilCritical === 'number'
                  ? `${monthsUntilCritical} ay`
                  : monthsUntilCritical}
              </Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.chartRow}>
          <Card style={styles.chartCard}>
            <Card.Title title="Stok Durumu ve Tahmin" />
            <Card.Content>
              <LineChart
                data={stockData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withDots={true}
                withShadow={true}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={true}
                withHorizontalLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                fromZero={true}
                renderDotContent={({ x, y, index, indexData }) => null}
                getDotColor={() => '#2ecc71'}
                segments={5}
                yAxisInterval={1}
                yAxisSuffix=""
                yAxisLabel=""
                xAxisLabel=""
                onDataPointClick={({ value, getColor }) => {}}
              />
            </Card.Content>
          </Card>

          <Card style={styles.chartCard}>
            <Card.Title title="Tüketim Tahmini" />
            <Card.Content>
              <LineChart
                data={forecastData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withDots={true}
                withShadow={true}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={true}
                withHorizontalLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                fromZero={true}
                renderDotContent={({ x, y, index, indexData }) => null}
                getDotColor={() => '#9b59b6'}
                segments={5}
                yAxisInterval={1}
                yAxisSuffix=""
                yAxisLabel=""
                xAxisLabel=""
                onDataPointClick={({ value, getColor }) => {}}
              />
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stok Analiz Grafikleri</Text>
      </View>

      <View style={styles.chartRow}>
        <Card style={styles.chartCard}>
          <Card.Title title="Stok Durumu" />
          <Card.Content>
            <PieChart
              data={[
                {
                  name: 'Normal Stok',
                  value: products.filter(p => Number(p.current_stock) > Number(p.minimum_stock)).length,
                  color: '#36A2EB',
                  legendFontColor: '#000000',
                  legendFontSize: 12
                },
                {
                  name: 'Kritik Stok',
                  value: products.filter(p => Number(p.current_stock) <= Number(p.minimum_stock)).length,
                  color: '#FF6384',
                  legendFontColor: '#000000',
                  legendFontSize: 12
                }
              ]}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend={true}
            />
          </Card.Content>
        </Card>

        <Card style={styles.chartCard}>
          <Card.Title title="Stok Takip Türü" />
          <Card.Content>
            <PieChart
              data={[
                {
                  name: 'Otomatik',
                  value: products.filter(p => p.stock_tracking_type === 'otomatik').length,
                  color: '#FF9F40',
                  legendFontColor: '#000000',
                  legendFontSize: 12
                },
                {
                  name: 'Manuel',
                  value: products.filter(p => p.stock_tracking_type === 'manuel').length,
                  color: '#9966FF',
                  legendFontColor: '#000000',
                  legendFontSize: 12
                }
              ]}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend={true}
            />
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <Card.Title 
          title="Stok Hareketleri Analizi"
          right={(props) => (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button 
                  mode="contained" 
                  onPress={() => setMenuVisible(true)}
                  style={styles.menuButton}
                >
                  Ürün Seçin
                </Button>
              }
            >
              {products.map((product) => (
                <Menu.Item
                  key={product.id}
                  onPress={() => {
                    setSelectedProduct(product.id);
                    setMenuVisible(false);
                  }}
                  title={product.name}
                />
              ))}
            </Menu>
          )}
        />
        <Card.Content>
          {renderProductInfo()}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartRow: {
    flexDirection: 'column',
    gap: 16,
  },
  chartCard: {
    marginBottom: 16,
  },
  menuButton: {
    marginRight: 16,
  },
  infoContainer: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  statCard: {
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 16,
    paddingTop: 8,
  },
}); 