import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('respond with a resource');
});

router.get('/id/:id', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ "id": req.params.id });
});

export default router;

