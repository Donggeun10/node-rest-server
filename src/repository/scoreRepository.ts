import SqliteClient from '../config/sqliteConfig';
import sqlite3 from 'better-sqlite3';
import IoRedisClient from '../config/ioRedisConfig';

class ScoreRepository {

    sqliteClient: any;
    redisClient: any;

    constructor() {
        // SQLite 데이터베이스 파일 생성 또는 연결
        this.sqliteClient = new SqliteClient().getInstance();
        this.redisClient = new IoRedisClient();
    }

    async set(key: string, value: string)  {
        
        let prevValue = await this.get(key);
        prevValue = JSON.parse(prevValue);
        let newValue = JSON.parse(value);
        if(Array.isArray(prevValue)){
           prevValue.push(newValue[0]);
        }else{
            prevValue = newValue;
        }

        this.redisClient.set(key, JSON.stringify(prevValue));
        console.log('key:', key, 'value:', prevValue);
    }

    async setWithLock(key: string, value: string)  {

        this.redisClient.setLockKey(key+'_lock');
        const lockAcquired = await this.redisClient.acquireLock();
        if (!lockAcquired) {
            console.log('다른 프로세스가 자원을 사용 중입니다.');
            return;
        }

        try {
            // 데이터 조회 및 갱신 작업 수행
            console.log('데이터를 처리 중입니다...');

            let prevValue = await this.redisClient.get(key);
            prevValue = JSON.parse(prevValue);
            let newValue = JSON.parse(value);
            if(Array.isArray(prevValue)){
                prevValue.push(newValue[0]);
            }else{
                prevValue = newValue;
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

    async get(key: string) : Promise<string> {
        return this.redisClient.get(key);
    }

    remove(key: string) {
        this.redisClient.delete(key);
    }

    saveScoreData(gameId: string, scoreData: string): void {
        console.log('gameId:', gameId, 'scoreData:', scoreData);

        const stmt = this.sqliteClient.prepare('INSERT INTO tb_score (game_id, score) VALUES (?, ?)  ON CONFLICT(game_id) DO UPDATE SET score = ? ');
        stmt.run(gameId, scoreData, scoreData, function (this: sqlite3.RunResult) {
            console.log(`새로운 사용자 생성됨: ${this.lastInsertRowid}`);
        });
        stmt.finalize();
    }

    async getScoreDataByGameId(gameId: String) {
        return new Promise((resolve, reject) => {
            // SELECT 쿼리 실행
            this.sqliteClient.all('SELECT * FROM tb_score WHERE game_id = ? ', gameId, (err: any, rows: any) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    // 결과 처리
                    rows.forEach((row: any) => {
                        console.log(row);
                    });
                    resolve(rows);
                }

            });

        });
    }
}

export default ScoreRepository;