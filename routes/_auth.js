import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function authRequired(req, res, next) {

  const auth = req.headers.authorization;

  if (!auth) 
    return res.status(401).json({ error: 'No token' });

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
