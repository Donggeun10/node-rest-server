import express, {Request, Response, NextFunction} from 'express';
import OllamaService from '../service/ollamaService';
import {MultiModalData, MultiModalTrainData} from '../domain/Domains';

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

router.post('/multi-modal/:trainId/train-data/:uuid', (req: Request, res: Response, next: NextFunction) => {

    const trainId = req.params.trainId;
    const uuid = req.params.uuid;
    const data : MultiModalTrainData = new MultiModalTrainData();

    data.instructionId = uuid;
    data.response = req.body.response;
    data.instruction = req.body.instruction;
    data.image = req.body.image;

    ollamaService.addTrainData(trainId, data);

    res.status(201).json({uuid});
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Some description...'

        }
        #swagger.security = [{
        "basicAuth": []
        }]
    */
});

router.get('/multi-modal/:trainId/train-data', async (req: Request, res: Response, next: NextFunction) => {

    const trainId = req.params.trainId;
    const value = await ollamaService.getTrainData(trainId);

    if (value) {
        res.status(200).json(JSON.parse(value));
    } else {
        res.status(404).json({[trainId]: "Not found"});
    }
    
    /*  
        #swagger.security = [{
        "basicAuth": []
        }]
    */
});

export default router;