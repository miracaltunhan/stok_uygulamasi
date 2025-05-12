import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, DataTable } from 'react-native-paper';
import { useApp } from '../../context/AppContext';

export default function ItemsScreen() {
    const { products } = useApp();

    return (
        <View style={styles.container}>
            <ScrollView>
                <Card style={styles.card}>
                    <Card.Title title="Tüm Ürünler" />
                    <Card.Content>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Ürün Adı</DataTable.Title>
                                <DataTable.Title>Birim</DataTable.Title>
                                <DataTable.Title>Mevcut Stok</DataTable.Title>
                                <DataTable.Title>Minimum Stok</DataTable.Title>
                                <DataTable.Title>Aylık Tüketim</DataTable.Title>
                                <DataTable.Title>Durum</DataTable.Title>
                            </DataTable.Header>

                            {products.map(product => (
                                <DataTable.Row key={product.id}>
                                    <DataTable.Cell>{product.name}</DataTable.Cell>
                                    <DataTable.Cell>{product.unit}</DataTable.Cell>
                                    <DataTable.Cell>{product.current_stock}</DataTable.Cell>
                                    <DataTable.Cell>{product.minimum_stock}</DataTable.Cell>
                                    <DataTable.Cell>{product.monthly_consumption}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={[
                                            styles.statusBadge,
                                            { backgroundColor: product.current_stock <= product.minimum_stock ? '#dc3545' : '#28a745' }
                                        ]}>
                                            {product.current_stock <= product.minimum_stock ? 'Kritik' : 'Normal'}
                                        </Text>
                                    </DataTable.Cell>
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
    statusBadge: {
        color: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
    },
});

export interface Item {
    id: number;
    name: string;
    description: string;
    unit: string;
    current_stock: number;
    minimum_stock: number;
    stock_tracking_type: string;
    weekly_consumption: number;
    created_at: string;
    updated_at: string;
    stock_quantity?: number; // React Native uygulamasında kullanılan alan
    monthly_consumption?: number; // React Native uygulamasında kullanılan alan
}

// Stok hareketi için interface
export interface StockMovement {
    id: number;
    item_id: number;
    quantity: number;
    type: 'in' | 'out';
    description: string;
    created_at: string;
    updated_at: string;
}

// Stok tüketim kaydı için interface
export interface ConsumptionRecord {
    id: number;
    item_id: number;
    quantity: number;
    date: string;
    created_at: string;
    updated_at: string;
}

// Bildirim için interface
export interface Notification {
    id: number;
    item_id: number;
    type: string;
    message: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}