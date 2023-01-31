import express, {Express} from 'express';
import { ChattyServer } from '@root/setupServer';
import DatabaseConnection from '@root/setupDatabase';
import { config } from '@root/config';

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
						config.cloudinaryConfig();
        }
}

const app = new Application();
app.init();
