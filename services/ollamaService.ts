import axios from 'axios';

const OLLAMA_API_URL = 'http://localhost:11434/api';

// Axios instance oluştur
const axiosInstance = axios.create({
  baseURL: OLLAMA_API_URL,
  timeout: 60000, // 60 saniye timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Örnek stok verileri (Bu veriler gerçek veritabanından gelmeli)
const stockData = {
  critical: [
    { name: 'un', current: 15, minimum: 20 },
    { name: 'şeker', current: 22, minimum: 20 }
  ],
  normal: [
    { name: 'tuz', current: 30, minimum: 10 }
  ],
  total: 3
};

export const ollamaService = {
  async generateResponse(prompt: string) {
    try {
      const systemPrompt = `Sen bir stok takip asistanısın. Her zaman Türkçe yanıt ver ve yanıtlarını detaylı ve açıklayıcı yap. 
Aşağıdaki stok verilerini kullanarak kullanıcıya yardımcı ol:

Mevcut Stok Durumu:
- Toplam Ürün Sayısı: ${stockData.total}
- Kritik Stok Altındaki Ürünler: ${JSON.stringify(stockData.critical, null, 2)}
- Normal Stok Seviyesindeki Ürünler: ${JSON.stringify(stockData.normal, null, 2)}

Yanıt verirken şu kurallara uy:
1. Her zaman detaylı ve açıklayıcı yanıtlar ver
2. Sayısal verileri mutlaka belirt (mevcut miktar, minimum miktar, fark)
3. Kritik stok durumunda olan ürünler için uyarı ver
4. Normal stok seviyesindeki ürünler için bilgilendirme yap
5. Genel durumu özetle
6. Gerekirse önerilerde bulun
7. Birim olarak "adet" kullan

Örnek yanıt formatı:
"Kritik stok durumunda 1 ürün bulunmaktadır:
1. Un: Mevcut stok 15 adet, minimum seviye 20 adet. 5 adet eksik.

Bu ürünün stok seviyesi minimum seviyenin altında olduğu için acil olarak sipariş verilmesi önerilir."

Kullanıcı sorusu: ${prompt}

Lütfen yanıtını Türkçe olarak ver, stok verilerini kullan ve yukarıdaki kurallara uygun olarak detaylı bir şekilde açıkla.`;

      console.log('Gönderilen prompt:', systemPrompt);

      const response = await axiosInstance.post('/generate', {
        model: 'mistral',
        prompt: systemPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000
        }
      });

      console.log('API Yanıtı:', response.data);

      if (!response.data || !response.data.response) {
        throw new Error('API yanıtı geçersiz format içeriyor');
      }

      return response.data.response;
    } catch (error) {
      console.error('Ollama API Hatası:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Yanıt süresi çok uzun. Lütfen daha sonra tekrar deneyin.');
        }
        
        console.error('Hata detayları:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            timeout: error.config?.timeout
          }
        });

        if (error.response?.status === 404) {
          throw new Error('Ollama servisi bulunamadı. Lütfen servisin çalıştığından emin olun.');
        }
      }

      throw new Error('Üzgünüm, şu anda stok bilgilerine erişemiyorum. Lütfen daha sonra tekrar deneyin.');
    }
  }
}; 