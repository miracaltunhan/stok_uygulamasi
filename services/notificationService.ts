import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Bildirim ayarlarını yapılandır
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return false;
    }
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return true;
  },

  async scheduleNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Hemen göster
    });
  },

  async checkAndNotifyCriticalStock(stockData: any) {
    const criticalItems = stockData.critical.filter((item: any) => item.current < item.minimum);
    
    if (criticalItems.length > 0) {
      const title = '⚠️ Kritik Stok Uyarısı';
      const body = `Kritik stok seviyesinin altında ${criticalItems.length} ürün bulunuyor:\n` +
        criticalItems.map((item: any) => 
          `${item.name}: ${item.current} adet (Minimum: ${item.minimum} adet)`
        ).join('\n');

      await this.scheduleNotification(title, body);
    }
  }
}; 