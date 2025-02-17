import ScoreRepository from '../repository/scoreRepository';

class ScoreManagerService {

    scoreRepository: any;

    constructor() {
        this.scoreRepository = new ScoreRepository();
    }
    
    async getScore(key: string) : Promise<string> {
        return await this.scoreRepository.get(key);
    }
    
    setScore(key: string, value: string) {
        this.scoreRepository.set(key, value);
    }
    
    saveScore(gameId: string, scoreData: string) {
        this.scoreRepository.saveScoreData(gameId, scoreData);
    }

    async getScoreByGameId(gameId: String) {
        return this.scoreRepository.getScoreDataByGameId(gameId);
    }
}

export default ScoreManagerService;