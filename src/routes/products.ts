import express, {NextFunction, Request, Response} from 'express';
import ProductInventoryService from '../service/productInventoryService';

const router = express.Router();

router.get('/productId/:productId', (req: Request, res: Response, next: NextFunction) => {

    const productInventoryService = new ProductInventoryService();
    productInventoryService.getInventoryCountByProductId(req.params.productId);

    res.status(200).json({"productId": req.params.productId});
    /* #swagger.security = [{
          "basicAuth": []
    }] */
});

export default router;

