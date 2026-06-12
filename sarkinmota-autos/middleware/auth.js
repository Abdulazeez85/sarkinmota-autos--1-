const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
