const express = require('express');
const { db } = require('../../database/db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();
router.get('/', requireAuth, (req, res) => {
  const sales = db.prepare("SELECT COALESCE(SUM(total),0) total, COALESCE(SUM(due),0) due, COUNT(*) count FROM invoices WHERE type='sale'").get();
  const expenses = db.prepare('SELECT COALESCE(SUM(amount),0) total FROM expenses').get();
  const lowStock = db.prepare('SELECT * FROM products WHERE stock <= low_stock ORDER BY stock ASC').all();
  const production = db.prepare('SELECT stage, SUM(target_qty) target, SUM(completed_qty) completed FROM production_jobs GROUP BY stage').all();
  const topProducts = db.prepare('SELECT p.name, SUM(ii.quantity) qty FROM invoice_items ii JOIN products p ON p.id=ii.product_id GROUP BY p.id ORDER BY qty DESC LIMIT 5').all();
  const workers = db.prepare('SELECT name, role, performance_score FROM employees ORDER BY performance_score DESC LIMIT 5').all();
  const monthly = db.prepare("SELECT substr(invoice_date,1,7) month, SUM(total) sales FROM invoices GROUP BY month ORDER BY month DESC LIMIT 6").all().reverse();
  res.json({ totalSales: sales.total, totalOrders: sales.count, pendingPayments: sales.due, monthlyProfit: sales.total - expenses.total, lowStock, production, topProducts, workers, monthly });
});
module.exports = router;
