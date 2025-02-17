import { createClient } from 'redis';

class RedisClient {

    private redisClient: any;

    constructor () {
        const redisHost = process.env.REDIS_HOST || "localhost";
        const redisPort = process.env.REDIS_PORT || 7379;

        // Redis 클라이언트 생성
        this.redisClient = createClient({
            socket: {
                host: redisHost,
                port: Number(redisPort),
            },
        });

        // 연결 시도
        (async () => {
            await this.redisClient.connect();
        })();

        this.redisClient.on('connect', () => {
            console.log(redisHost, redisPort, 'Redis에 연결되었습니다.');
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