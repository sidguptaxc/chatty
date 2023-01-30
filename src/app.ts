import express, {Express} from 'express';
import { ChattyServer } from './setupServer';
import DatabaseConnection from './setupDatabase';
import { config } from './config';

class Application {
        public init() {
            this.loadConfig();
            DatabaseConnection();
            const app: Express = express();
            const server: ChattyServer = new ChattyServer(app);
            server.start();
        }

        private loadConfig(): void {
            config.validateConfig();
        }
}

const app = new Application();
app.init();