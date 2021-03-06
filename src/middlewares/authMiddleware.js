import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: 'Token obrigatório.' });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).send({ message: 'Token error.' });
  }

  const [prefix, token] = parts;

  if (!/^Bearer$/i.test(prefix)) {
    return res.status(401).send({ message: 'Token mal formatado.' });
  }

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Token inválido.' });
    }

    next();
  });
}

export default authMiddleware;
