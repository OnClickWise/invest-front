import axios from 'axios';

const BRAPI_TOKEN = 'nqCTAyoKAbHLUAgPQzcyWn';
const BASE_URL = 'https://brapi.dev/api';

export interface BrapiQuoteData {
  symbol: string;
  name: string;
  price: string;
  changePercent: number;
}

// Busca cotação de múltiplas ações B3
export async function getStocks(symbols: string[]): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/quote/${symbols.join(',')}`, {
      params: {
        token: BRAPI_TOKEN,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Erro ao buscar ações:`, error);
    return null;
  }
}

// Busca cotação de criptomoedas
export async function getCrypto(coins: string[] = ['BTC', 'ETH']): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/v2/crypto`, {
      params: {
        coin: coins.join(','),
        currency: 'BRL',
        token: BRAPI_TOKEN,
      },
    });
    return response.data.coins;
  } catch (error) {
    console.error(`Erro ao buscar crypto:`, error);
    return null;
  }
}

// Busca moedas (câmbio)
export async function getCurrency(currencies: string[] = ['USD-BRL', 'EUR-BRL']): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/v2/currency`, {
      params: {
        currency: currencies.join(','),
        token: BRAPI_TOKEN,
      },
    });
    return response.data.currency;
  } catch (error) {
    console.error(`Erro ao buscar moedas:`, error);
    return null;
  }
}

// Busca índices (IBOVESPA, etc)
export async function getIndexes(indexes: string[] = ['IBOV', 'IFIX']): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/quote/${indexes.join(',')}`, {
      params: {
        token: BRAPI_TOKEN,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Erro ao buscar índices:`, error);
    return null;
  }
}

// Função principal para buscar todos os dados do mercado brasileiro
export async function getBrazilianMarketData() {
  try {
    // Busca dados em paralelo
    const [currencies, crypto, stocks] = await Promise.all([
      getCurrency(['USD-BRL', 'EUR-BRL']),
      getCrypto(['BTC', 'ETH']),
      getStocks(['PETR4', 'VALE3', 'ITUB4', 'BBDC4']),
    ]);

    const currenciesData: BrapiQuoteData[] = [];
    const cryptoData: BrapiQuoteData[] = [];
    const stocksData: BrapiQuoteData[] = [];

    // Formata moedas
    if (currencies && Array.isArray(currencies)) {
      currencies.forEach((curr: any) => {
        if (curr.name && curr.ask) {
          currenciesData.push({
            symbol: curr.name === 'USD' ? 'USD/BRL' : 'EUR/BRL',
            name: curr.name === 'USD' ? 'Dólar' : 'Euro',
            price: parseFloat(curr.ask).toFixed(2),
            changePercent: parseFloat(curr.pctChange || 0),
          });
        }
      });
    }

    // Formata crypto
    if (crypto && Array.isArray(crypto)) {
      crypto.forEach((coin: any) => {
        if (coin.coin && coin.coinName) {
          cryptoData.push({
            symbol: `${coin.coin}/BRL`,
            name: coin.coinName,
            price: parseFloat(coin.regularMarketPrice || 0).toLocaleString('pt-BR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }),
            changePercent: parseFloat(coin.regularMarketChangePercent || 0),
          });
        }
      });
    }

    // Formata ações
    if (stocks && Array.isArray(stocks)) {
      stocks.forEach((stock: any) => {
        if (stock.symbol && stock.longName) {
          stocksData.push({
            symbol: stock.symbol,
            name: stock.longName.split(' ')[0], // Pega apenas o primeiro nome
            price: parseFloat(stock.regularMarketPrice || 0).toFixed(2),
            changePercent: parseFloat(stock.regularMarketChangePercent || 0),
          });
        }
      });
    }

    // Combina moedas e crypto
    const allCurrencies = [...currenciesData, ...cryptoData];

    return { 
      currencies: allCurrencies,
      stocks: stocksData 
    };
  } catch (error) {
    console.error('Erro ao buscar dados do mercado brasileiro:', error);
    return null;
  }
}

// Função para buscar cotação de uma única ação
export async function getSingleStock(symbol: string): Promise<BrapiQuoteData | null> {
  try {
    const stocks = await getStocks([symbol]);
    if (stocks && stocks.length > 0) {
      const stock = stocks[0];
      return {
        symbol: stock.symbol,
        name: stock.longName?.split(' ')[0] || stock.symbol,
        price: parseFloat(stock.regularMarketPrice || 0).toFixed(2),
        changePercent: parseFloat(stock.regularMarketChangePercent || 0),
      };
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar ${symbol}:`, error);
    return null;
  }
}

// Busca informações detalhadas de uma ação (com dividendos, etc)
export async function getStockDetails(symbol: string): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/quote/${symbol}`, {
      params: {
        token: BRAPI_TOKEN,
        fundamental: true,
        dividends: true,
      },
    });
    return response.data.results[0];
  } catch (error) {
    console.error(`Erro ao buscar detalhes de ${symbol}:`, error);
    return null;
  }
}
