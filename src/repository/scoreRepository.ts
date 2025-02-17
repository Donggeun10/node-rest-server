// import SqliteClient from '../config/sqliteConfig';
// import sqlite3 from 'sqlite3';
import RedisClient from '../config/redisConfig';

class ScoreRepository {

    sqliteClient: any;
    redisClient: any;

    constructor() {
        // SQLite 데이터베이스 파일 생성 또는 연결
        // this.sqliteClient = new SqliteClient().getInstance();
        this.redisClient = new RedisClient().getInstance();
    }

    set(key: string, value: string) {
        console.log('key:', key, 'value:', value);
        this.redisClient.set(key, value);
    }

    async get(key: string) : Promise<string> {
        const value = this.redisClient.get(key);
        console.log('value:', value);
        return value;
    }

    saveScoreData(gameId: string, scoreData: string): void {
        console.log('gameId:', gameId, 'scoreData:', scoreData);

        // const stmt = this.sqliteClient.prepare('INSERT INTO tb_score (game_id, score) VALUES (?, ?)  ON CONFLICT(game_id) DO UPDATE SET score = ? ');
        // stmt.run(gameId, scoreData, scoreData, function (this: sqlite3.RunResult) {
        //     console.log(`새로운 사용자 생성됨: ${this.lastID}`);
        // });
        // stmt.finalize();
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