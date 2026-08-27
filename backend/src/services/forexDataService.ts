import axios from 'axios';
import { AppDataSource } from '../database/data-source';
import { ForexPair } from '../entities/ForexPair';
import { VolatilityData } from '../entities/VolatilityData';

export class ForexDataService {
  private forexPairRepository = AppDataSource.getRepository(ForexPair);
  private volatilityDataRepository = AppDataSource.getRepository(VolatilityData);

  // Simulated forex data fetching - replace with real API
  async fetchForexData(symbol: string) {
    try {
      // Using Alpha Vantage API (replace with your preferred provider)
      const apiKey = process.env.ALPHA_VANTAGE_KEY || 'demo';
      const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${symbol.split('/')[0]}&to_symbol=${symbol.split('/')[1]}&apikey=${apiKey}`;

      // For demo purposes, return mock data
      return this.getMockForexData(symbol);
    } catch (error) {
      console.error('Error fetching forex data:', error);
      return this.getMockForexData(symbol);
    }
  }

  private getMockForexData(symbol: string) {
    return {
      symbol,
      price: Math.random() * 2,
      bid: Math.random() * 2,
      ask: Math.random() * 2,
      volatility: Math.random() * 100,
      timestamp: new Date(),
    };
  }

  async updateForexPairData(symbol: string, data: any) {
    let forexPair = await this.forexPairRepository.findOne({ where: { symbol } });

    if (!forexPair) {
      forexPair = this.forexPairRepository.create({
        symbol,
        baseCurrency: symbol.split('/')[0],
        quoteCurrency: symbol.split('/')[1],
        currentPrice: data.price,
        bid: data.bid,
        ask: data.ask,
        historicalVolatility30d: data.volatility,
      });
    } else {
      forexPair.currentPrice = data.price;
      forexPair.bid = data.bid;
      forexPair.ask = data.ask;
      forexPair.historicalVolatility30d = data.volatility;
    }

    await this.forexPairRepository.save(forexPair);
    return forexPair;
  }

  async saveVolatilityData(forexPair: ForexPair, data: any) {
    const volatilityData = this.volatilityDataRepository.create({
      forexPair,
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close,
      volume: data.volume || 0,
      historicalVolatility: data.historicalVolatility || 0,
      impliedVolatility: data.impliedVolatility || 0,
      volatilityRank: data.volatilityRank || 0,
      bollingerBandUpper: data.bollingerBandUpper,
      bollingerBandLower: data.bollingerBandLower,
      movingAverage20: data.movingAverage20,
      movingAverage50: data.movingAverage50,
      rsi: data.rsi,
      macd: data.macd || { line: 0, signal: 0, histogram: 0 },
      timeframe: data.timeframe || '1h',
    });

    return await this.volatilityDataRepository.save(volatilityData);
  }

  async getForexPairs() {
    return await this.forexPairRepository.find({
      where: { isActive: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async getForexPairBySymbol(symbol: string) {
    return await this.forexPairRepository.findOne({
      where: { symbol },
      relations: ['volatilityData'],
    });
  }

  async getVolatilityHistory(forexPairId: string, limit: number = 100) {
    return await this.volatilityDataRepository.find({
      where: { forexPair: { id: forexPairId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}

export function initializeForexDataService(io: any) {
  const forexDataService = new ForexDataService();
  const updateInterval = parseInt(process.env.FOREX_DATA_UPDATE_INTERVAL || '60000');

  setInterval(async () => {
    try {
      const forexPairs = await forexDataService.getForexPairs();

      for (const pair of forexPairs) {
        const data = await forexDataService.fetchForexData(pair.symbol);
        const updatedPair = await forexDataService.updateForexPairData(pair.symbol, data);

        // Emit real-time updates via WebSocket
        io.emit(`pair_update_${pair.symbol}`, {
          symbol: pair.symbol,
          price: updatedPair.currentPrice,
          bid: updatedPair.bid,
          ask: updatedPair.ask,
          volatility: updatedPair.historicalVolatility30d,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Error updating forex data:', error);
    }
  }, updateInterval);
}
