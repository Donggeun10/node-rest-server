import ScoreRepository from '../repository/scoreRepository';

class ScoreManagerService {

    scoreRepository: any;

    constructor() {
        this.scoreRepository = new ScoreRepository();
    }

    async getScore(key: string): Promise<string> {
        return await this.scoreRepository.get(key);
    }

    setScore(key: string, value: string) {
        this.scoreRepository.setWithLock(key, value);
    }

    removeScore(key: string) {
        this.scoreRepository.remove(key);
    }

    saveScore(gameId: string, scoreData: string) {
        this.scoreRepository.saveScoreData(gameId, scoreData);
    }

    getScoreByGameId(gameId: String) {
        return this.scoreRepository.getScoreDataByGameId(gameId);
    }

    removeScoreByGameId(gameId: String) {
        return this.scoreRepository.removeScoreDataByGameId(gameId);
    }
}

export default ScoreManagerService;