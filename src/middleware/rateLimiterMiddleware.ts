import { RateLimiterMemory } from "rate-limiter-flexible";
import { Response, Request } from 'express';

const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 15 * 60,
});

export const rateLimiterMiddleware = (req: Request, res: Response, next: Function) => {
  if (req.ip) {
    rateLimiter.consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).json({ message: 'Too many requests, please try again later.' });
      });
  } else {
    res.status(400).json({ message: 'IP address not found' });
  }
};