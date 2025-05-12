import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Sistem mesajını burada tanımlıyoruz
const systemMessage = `Sen bir ürün danışmanısın. Aşağıdaki ürünler hakkında bilgi veriyorsun:
- Stok yönetimi
- Ürün takibi
- Envanter yönetimi
Lütfen kullanıcıların sorularına bu konular çerçevesinde yardımcı ol.`;

export const chatWithBot = async (userMessage: string, apiKey: string) => {
    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('ChatGPT API Hatası:', error);
        throw new Error('Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.');
    }
};