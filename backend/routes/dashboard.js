const express = require('express');
const { db } = require('../../database/db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const sales = db.prepare("SELECT COALESCE(SUM(total),0) total, COALESCE(SUM(due),0) due, COUNT(*) count FROM invoices WHERE type='sale'").get();
  const fees = db.prepare("SELECT COALESCE(SUM(amount),0) total, COUNT(*) count FROM fee_payments WHERE status='Paid'").get();
  const feeDue = db.prepare('SELECT COALESCE(SUM(fee_due),0) total FROM students').get();
  const expenses = db.prepare('SELECT COALESCE(SUM(amount),0) total FROM expenses').get();
  const students = db.prepare('SELECT COUNT(*) count FROM students').get();
  const projects = db.prepare('SELECT status, COUNT(*) count, COALESCE(SUM(budget),0) budget, COALESCE(SUM(spent),0) spent FROM projects GROUP BY status').all();
  const courseLoad = db.prepare('SELECT code, title, capacity, enrolled FROM courses ORDER BY enrolled DESC LIMIT 5').all();
  const admissions = db.prepare('SELECT stage, COUNT(*) count FROM admissions GROUP BY stage').all();
  const assets = db.prepare('SELECT category, COUNT(*) count, COALESCE(SUM(purchase_value),0) value FROM assets GROUP BY category').all();
  const lowStock = db.prepare('SELECT * FROM products WHERE stock <= low_stock ORDER BY stock ASC').all();
  const teams = db.prepare('SELECT name, role, performance_score FROM employees ORDER BY performance_score DESC LIMIT 5').all();
  const monthly = db.prepare("SELECT payment_date month, SUM(amount) sales FROM fee_payments GROUP BY payment_date ORDER BY payment_date DESC LIMIT 6").all().reverse();
  res.json({ totalSales: sales.total + fees.total, totalOrders: sales.count + fees.count, pendingPayments: sales.due + feeDue.total, monthlyProfit: sales.total + fees.total - expenses.total, students: students.count, projects, courseLoad, admissions, assets, lowStock, workers: teams, monthly });
});

module.exports = router;
