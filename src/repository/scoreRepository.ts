import SqliteClient from '../config/sqliteConfig';
import IoRedisClient from '../config/ioRedisConfig';

class ScoreRepository {

    sqliteClient: any;
    redisClient: any;

    constructor() {
        // SQLite 데이터베이스 파일 생성 또는 연결
        this.sqliteClient = new SqliteClient().getInstance();
        this.redisClient = new IoRedisClient();
    }

    async set(key: string, value: string) {

        let prevValue = await this.get(key);
        prevValue = JSON.parse(prevValue);
        let newValue = JSON.parse(value);
        if (Array.isArray(prevValue)) {
            prevValue.push(newValue[0]);
        } else {
            prevValue = newValue;
        }

        this.redisClient.set(key, JSON.stringify(prevValue));
        console.log('key:', key, 'value:', prevValue);
    }

    async setWithLock(key: string, value: string) {

        this.redisClient.setLockKey(key + '_lock');
        const lockAcquired = await this.redisClient.acquireLock();
        if (!lockAcquired) {
            console.log('다른 프로세스가 자원을 사용 중입니다.');
            return;
        }

        try {
            // 데이터 조회 및 갱신 작업 수행
            console.log('데이터를 처리 중입니다...', value);

            let prevValue = await this.redisClient.get(key);
            prevValue = JSON.parse(prevValue);
            let newValue = JSON.parse(value);
            if (Array.isArray(prevValue)) {
                prevValue.push(newValue);
            } else {
                prevValue = [];
                prevValue.push(newValue);
            }

            this.redisClient.set(key, JSON.stringify(prevValue));
            console.log('key:', key, 'value:', prevValue);
        } catch (error) {
            console.error('데이터 처리 중 오류 발생:', error);
        } finally {
            await this.redisClient.releaseLock();
            console.log('데이터 처리를 완료했습니다.');
        }

    }

    async get(key: string): Promise<string> {
        return this.redisClient.get(key);
    }

    remove(key: string) {
        this.redisClient.delete(key);
    }

    saveScoreData(gameId: string, scoreData: string) {

        const scoreDataJson = JSON.parse(scoreData);
        console.log('gameId:', gameId, 'scoreData:', scoreDataJson);

        const upsert = this.sqliteClient.transaction((input: any) => {
            const in_gameId = input["game_id"];
            const in_score = JSON.parse(input["score"]);
            let row = this.sqliteClient.prepare('SELECT game_id, score FROM tb_score WHERE game_id = ? ').get(in_gameId);
            if (row) {
                const rowScore = JSON.parse(row.score);
                rowScore.push(in_score[0]);
                row.score = JSON.stringify(rowScore);
            } else {
                row = input;
            }

            const insert = this.sqliteClient.prepare('INSERT INTO tb_score (game_id, score) VALUES (@game_id, @score)  ON CONFLICT(game_id) DO UPDATE SET score = @score ');
            insert.run(row);
        });

        try {
            upsert.exclusive({game_id: gameId, score: scoreData});
        } catch (error) {
            console.error('데이터 처리 중 오류 발생:', error);
            throw error;
        }
    }

    getScoreDataByGameId(gameId: String) {
        return this.sqliteClient.prepare('SELECT * FROM tb_score WHERE game_id = ?').get(gameId);
    }

    removeScoreDataByGameId(gameId: String) {
        return this.sqliteClient.prepare('DELETE FROM tb_score WHERE game_id = ?').run(gameId);
    }
}

export default ScoreRepository;