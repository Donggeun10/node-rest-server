import sqlite3 from 'sqlite3';

class SqliteClient {

    private dbConn: any;

    constructor () {
        // SQLite 데이터베이스 파일 생성 또는 연결
        this.dbConn = new sqlite3.Database('./my-database.db'), (err: { message: any; }) => {
            if (err) {
                console.error('Failed to connect to the database:', err.message);
                return;
            }
            console.log('Connected to the SQLite database.');
        };

        // 테이블 생성
        this.dbConn.serialize(() => {
            this.dbConn.run('CREATE TABLE IF NOT EXISTS tb_score (game_id string PRIMARY KEY, score TEXT)');
        });
    }

    getInstance(){
        return this.dbConn;
    }
    
}

export default SqliteClient;