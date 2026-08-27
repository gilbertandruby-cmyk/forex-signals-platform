import { Router, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Portfolio } from '../entities/Portfolio';
import { PortfolioHolding } from '../entities/PortfolioHolding';
import { ForexPair } from '../entities/ForexPair';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const portfolioRepository = AppDataSource.getRepository(Portfolio);
const holdingRepository = AppDataSource.getRepository(PortfolioHolding);
const forexPairRepository = AppDataSource.getRepository(ForexPair);

// Get user portfolios
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const portfolios = await portfolioRepository.find({
      where: { user: { id: req.userId } },
      relations: ['holdings', 'holdings.forexPair'],
      order: { createdAt: 'DESC' },
    });

    res.json(portfolios);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create portfolio
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, cashBalance } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Portfolio name required' });
    }

    const portfolio = portfolioRepository.create({
      user: { id: req.userId },
      name,
      description,
      cashBalance: cashBalance || 10000,
      totalValue: cashBalance || 10000,
    });

    await portfolioRepository.save(portfolio);
    res.status(201).json(portfolio);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get portfolio details
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const portfolio = await portfolioRepository.findOne({
      where: { id, user: { id: req.userId } },
      relations: ['holdings', 'holdings.forexPair'],
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Calculate total value
    let totalValue = portfolio.cashBalance;
    for (const holding of portfolio.holdings) {
      totalValue += Number(holding.currentValue);
    }

    portfolio.totalValue = totalValue;

    res.json(portfolio);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update portfolio
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, cashBalance } = req.body;

    const portfolio = await portfolioRepository.findOne({
      where: { id, user: { id: req.userId } },
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (name) portfolio.name = name;
    if (description) portfolio.description = description;
    if (cashBalance !== undefined) portfolio.cashBalance = cashBalance;

    await portfolioRepository.save(portfolio);
    res.json(portfolio);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Add holding to portfolio
router.post('/:id/holdings', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { forexPairSymbol, quantity, entryPrice } = req.body;

    if (!forexPairSymbol || !quantity || !entryPrice) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const portfolio = await portfolioRepository.findOne({
      where: { id, user: { id: req.userId } },
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const forexPair = await forexPairRepository.findOne({
      where: { symbol: forexPairSymbol },
    });

    if (!forexPair) {
      return res.status(404).json({ message: 'Forex pair not found' });
    }

    const holding = holdingRepository.create({
      portfolio,
      forexPair,
      quantity,
      entryPrice,
      currentPrice: Number(forexPair.currentPrice),
      currentValue: quantity * Number(forexPair.currentPrice),
    });

    await holdingRepository.save(holding);
    res.status(201).json(holding);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Remove holding from portfolio
router.delete('/:id/holdings/:holdingId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id, holdingId } = req.params;

    const portfolio = await portfolioRepository.findOne({
      where: { id, user: { id: req.userId } },
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const holding = await holdingRepository.findOne({
      where: { id: holdingId, portfolio: { id } },
    });

    if (!holding) {
      return res.status(404).json({ message: 'Holding not found' });
    }

    await holdingRepository.remove(holding);
    res.json({ message: 'Holding removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export { router as portfolioRoutes };
