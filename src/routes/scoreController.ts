import express, { Request, Response, NextFunction } from 'express';
import ScoreManagerService from '../service/scoreManagerService';

const router = express.Router();
const scoreManagerService = new ScoreManagerService();

/* GET Redis Test Page */
router.get('/redis/:key', async (req: Request, res: Response, next: NextFunction) => {

    const key = req.params.key;
    const value = await scoreManagerService.getScore(key);

    if(value){
        res.status(200).json({[key] : value});
    }else{
        res.status(404).json({[key] : "Not found"});
    }

    /*
        #swagger.security = [{
        "basicAuth": []
        }]
    */
});

router.post('/redis/:key', (req: Request, res: Response, next: NextFunction) => {

    const key = req.params.key;
    const body = JSON.stringify(req.body);

    scoreManagerService.setScore(key, body);

    res.status(201).send();
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Some description...'

        }
        #swagger.security = [{
        "basicAuth": []
        }]
    */
});

router.post('/redis/:key/lock', (req: Request, res: Response, next: NextFunction) => {

    const key = req.params.key;
    const body = JSON.stringify(req.body);

    scoreManagerService.setScore(key, body);
    console.log('POST /redis/:key');
    res.status(201).send();
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Some description...'

        }
        #swagger.security = [{
        "basicAuth": []
        }]
    */
});

router.delete('/redis/:key', (req: Request, res: Response, next: NextFunction) => {

    const key = req.params.key;    
    
    scoreManagerService.removeScore(key);

    res.status(200).send();
    /*
        #swagger.security = [{
        "basicAuth": []
        }]
    */
});

/* GET Sqlite Test Page */
router.get('/sqlite/:id', async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;
    const row =  await scoreManagerService.getScoreByGameId(id);

    res.status(200).json(row);
    /*
        #swagger.security = [{
        "basicAuth": []
        }]
    */
});

router.post('/sqlite/:id', async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;
    const body = JSON.stringify(req.body);

    scoreManagerService.saveScore(id, body);

    res.status(201).send();
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

