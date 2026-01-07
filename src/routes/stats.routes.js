const express = require('express');
const router = express.Router();
const cache = require('../middlewares/cache.middleware');
const redis = require('../config/redis');

// Simulation d'une base de données de ventes
let fakeSalesData = {
  totalSales: 150000,
  topProduct: "Café",
  lastUpdated: new Date()
};

/**
 * GET /stats
 * Simule un calcul lourd de 2 secondes.
 * On applique le middleware de cache pour 60 secondes.
 */
router.get('/stats', cache(60), async (req, res) => {
  // Simulation de lenteur (DB query complexe)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // On renvoie une donnée avec un timestamp pour prouver la fraîcheur
  res.json({
    ...fakeSalesData,
    generatedAt: new Date().toISOString()
  });
});

/**
 * POST /sales
 * Ajoute une vente + invalide le cache Redis
 */
router.post('/sales', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "amount is required" });
    }

    // 1. Mise à jour des ventes
    fakeSalesData.totalSales += Number(amount);
    fakeSalesData.lastUpdated = new Date();

    // 2. Invalidation du cache
    await redis.del('cache:/api/stats');

    return res.json({
      status: "success",
      message: "Sale added and cache invalidated",
      newTotal: fakeSalesData.totalSales
    });

  } catch (err) {
    console.error("Error in POST /sales:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
