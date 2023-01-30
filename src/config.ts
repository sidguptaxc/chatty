import dotenv from 'dotenv';
import  bunyan from 'bunyan';
dotenv.config({}); 

class Config {
    public DATABASE_URL: string | undefined;
    public JWT_URL: string | undefined = '1234';
    public NODE_ENV: string | undefined = '';
    public SECRET_KEY_ONE: string | undefined  = '';
    public SECRET_KEY_TWO: string | undefined = '';
    public CLIENT_URL: string | undefined = '';
    public REDIS_URL: string | undefined = '';

    private readonly DEFAULT_DATABASE_URL =  "mongodb://localhost:27017/chatty-backend";

    constructor() {
        this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
        this.JWT_URL = process.env.JWT_URL || this.JWT_URL;
        this.NODE_ENV = process.env.NODE_ENV || this.NODE_ENV;
        this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || this.SECRET_KEY_ONE;
        this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || this.SECRET_KEY_TWO;
        this.CLIENT_URL = process.env.CLIENT_URL || this.CLIENT_URL;
        this.REDIS_URL = process.env.REDIS_URL || this.REDIS_URL;

    }

    public createLogger(name: string) {
        return bunyan.createLogger({name,level: 'debug'})
    }

    validateConfig(): void {
        for (let [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error('Configuration undefined' + key) 
            } 
        }
    }

}

export const config:  Config = new Config();