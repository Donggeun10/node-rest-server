import express, {NextFunction, Request, Response} from 'express';
import OllamaService from '../service/ollamaService';
import {MultiModalData} from '../domain/Domains';

const router = express.Router();
const ollamaService = new OllamaService();

router.post('/multi-modal/:uuid', async (req: Request, res: Response, next: NextFunction) => {

    const uuid = req.params.uuid;
    const data : MultiModalData = new MultiModalData();

    data.model = req.body.model;
    data.system = req.body.system;
    data.prompt = req.body.prompt;
    data.image = req.body.image;
    
    const answer = await ollamaService.generateWithRetry(uuid, data, 3);

    res.status(201).json({uuid, answer});
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Some description...'

        }
        #swagger.security = [{
        "basicAuth": []
        }]
    */
});

export default router;