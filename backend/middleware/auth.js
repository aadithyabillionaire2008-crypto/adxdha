const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'campuscompany-local-secret-change-before-distribution';
function sign(user) { return jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET, { expiresIn: '12h' }); }
function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Login required' });
  try { req.user = jwt.verify(token, SECRET); next(); } catch { res.status(401).json({ error: 'Session expired' }); }
}
function permit(...roles) { return (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ error: 'Permission denied' }); }
module.exports = { sign, requireAuth, permit };
