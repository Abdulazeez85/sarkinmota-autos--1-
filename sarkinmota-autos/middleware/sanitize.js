const xss = require('xss');

const sanitizeObject = (obj) => {
  if (typeof obj === 'string') return xss(obj.trim());
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (obj && typeof obj === 'object') {
    const cleaned = {};
    for (const key in obj) {
      cleaned[key] = sanitizeObject(obj[key]);
    }
    return cleaned;
  }
  return obj;
};

const sanitize = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  next();
};

module.exports = sanitize;
