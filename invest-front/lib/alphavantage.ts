import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = 'XV4BUBASLA5P2X5F';
const BASE_URL = 'https://www.alphavantage.co/query';

export interface QuoteData {
  symbol: string;
  name: string;
  price: string;
  changePercent: number;
}

// Busca cotação de ação/moeda
export async function getQuote(symbol: string): Promise<any> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });
    return response.data['Global Quote'];
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${symbol}:`, error);
    return null;
  }
}

// Busca taxa de câmbio
export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<any> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: fromCurrency,
        to_currency: toCurrency,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });
    return response.data['Realtime Currency Exchange Rate'];
  } catch (error) {
    console.error(`Erro ao buscar câmbio ${fromCurrency}/${toCurrency}:`, error);
    return null;
  }
}

// Busca cotação de criptomoeda
export async function getCryptoQuote(symbol: string, market: string = 'USD'): Promise<any> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: symbol,
        to_currency: market,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });
    return response.data['Realtime Currency Exchange Rate'];
  } catch (error) {
    console.error(`Erro ao buscar crypto ${symbol}:`, error);
    return null;
  }
}

// Formata dados para o componente MarketOverview
export async function getMarketData() {
  try {
    // Busca dados em paralelo (cuidado com rate limit da API)
    const [usdBrl, eurBrl, btcUsd, aapl, googl, msft] = await Promise.all([
      getExchangeRate('USD', 'BRL'),
      getExchangeRate('EUR', 'BRL'),
      getCryptoQuote('BTC', 'USD'),
      getQuote('AAPL'),
      getQuote('GOOGL'),
      getQuote('MSFT'),
    ]);

    const currencies: QuoteData[] = [];
    const stocks: QuoteData[] = [];

    // USD/BRL
    if (usdBrl) {
      currencies.push({
        symbol: 'USD/BRL',
        name: 'Dólar',
        price: parseFloat(usdBrl['5. Exchange Rate']).toFixed(2),
        changePercent: 0, // AlphaVantage free não fornece variação para Forex
      });
    }

    // EUR/BRL
    if (eurBrl) {
      currencies.push({
        symbol: 'EUR/BRL',
        name: 'Euro',
        price: parseFloat(eurBrl['5. Exchange Rate']).toFixed(2),
        changePercent: 0,
      });
    }

    // BTC/USD
    if (btcUsd) {
      currencies.push({
        symbol: 'BTC/USD',
        name: 'Bitcoin',
        price: parseFloat(btcUsd['5. Exchange Rate']).toFixed(0),
        changePercent: 0,
      });
    }

    // AAPL
    if (aapl && aapl['05. price']) {
      stocks.push({
        symbol: 'AAPL',
        name: 'Apple',
        price: parseFloat(aapl['05. price']).toFixed(2),
        changePercent: parseFloat(aapl['10. change percent']?.replace('%', '') || '0'),
      });
    }

    // GOOGL
    if (googl && googl['05. price']) {
      stocks.push({
        symbol: 'GOOGL',
        name: 'Google',
        price: parseFloat(googl['05. price']).toFixed(2),
        changePercent: parseFloat(googl['10. change percent']?.replace('%', '') || '0'),
      });
    }

    // MSFT
    if (msft && msft['05. price']) {
      stocks.push({
        symbol: 'MSFT',
        name: 'Microsoft',
        price: parseFloat(msft['05. price']).toFixed(2),
        changePercent: parseFloat(msft['10. change percent']?.replace('%', '') || '0'),
      });
    }

    return { currencies, stocks };
  } catch (error) {
    console.error('Erro ao buscar dados do mercado:', error);
    return null;
  }
}

// Função para buscar um único símbolo (útil para atualizações individuais)
export async function getSingleQuote(symbol: string, type: 'stock' | 'forex' | 'crypto' = 'stock'): Promise<QuoteData | null> {
  try {
    let data;
    
    if (type === 'forex') {
      const [from, to] = symbol.split('/');
      data = await getExchangeRate(from, to);
      if (data) {
        return {
          symbol,
          name: from,
          price: parseFloat(data['5. Exchange Rate']).toFixed(2),
          changePercent: 0,
        };
      }
    } else if (type === 'crypto') {
      const [crypto, market] = symbol.split('/');
      data = await getCryptoQuote(crypto, market || 'USD');
      if (data) {
        return {
          symbol,
          name: crypto,
          price: parseFloat(data['5. Exchange Rate']).toFixed(2),
          changePercent: 0,
        };
      }
    } else {
      data = await getQuote(symbol);
      if (data && data['05. price']) {
        return {
          symbol,
          name: symbol,
          price: parseFloat(data['05. price']).toFixed(2),
          changePercent: parseFloat(data['10. change percent']?.replace('%', '') || '0'),
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Erro ao buscar ${symbol}:`, error);
    return null;
  }
}
