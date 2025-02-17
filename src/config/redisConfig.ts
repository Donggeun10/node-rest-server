import { createClient } from 'redis';

class RedisClient {

    private redisClient: any;

    constructor () {
        // Redis 클라이언트 생성
        this.redisClient = createClient({
            socket: {
                host: 'localhost',
                port: 7379,
            },
        });

        // 연결 시도
        (async () => {
            await this.redisClient.connect();
        })();

        this.redisClient.on('connect', () => {
            console.log('Redis에 연결되었습니다.');
        });

        this.redisClient.on('error', (err : any) => {
            console.error('Redis 오류:', err);
        });
    }
    
    getInstance(){
        return this.redisClient;
    }

}

export default RedisClient;