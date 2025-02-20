import Redis from 'ioredis';

class IoRedisClient {

    private redisClient: any;

    constructor () {
        const redisHost = process.env.REDIS_HOST || "localhost";
        const redisPort = process.env.REDIS_PORT || 7379;

        // Redis 클라이언트 생성
        this.redisClient = new Redis({
            host: redisHost,
            port: Number(redisPort),
        });

    }

    private LOCK_KEY = 'resource_lock';
    private LOCK_TIMEOUT = 10000; // 락 만료 시간 (밀리초)

    async acquireLock() {
        const lockValue = Date.now() + this.LOCK_TIMEOUT;
        const result = await this.redisClient.set(this.LOCK_KEY, lockValue, 'NX', 'PX', this.LOCK_TIMEOUT);
        return result === 'OK';
    }

    async releaseLock() {
        const lockValue = await this.redisClient.get(this.LOCK_KEY);
        if (lockValue && parseInt(lockValue) > Date.now()) {
            await this.redisClient.del(this.LOCK_KEY);
        }
    }

    setLockKey(lockKey: string) {
        this.LOCK_KEY = lockKey;
    }

    get(key: string) : Promise<string> {
        return this.redisClient.get(key);
    }

    delete(key: string) {
        this.redisClient.del(key);
    }

    set(key: string, value: string) {
        this.redisClient.set(key, value);
    }

}

export default IoRedisClient;