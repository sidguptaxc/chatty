import { config } from './config';
import { Application, json ,urlencoded, Response, Request, NextFunction } from 'express';

import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import compression from 'compression';
import 'express-async-errors';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import Routes from './route';
import { CustomError, IErrorResponse } from './shared/globals/helpers/error-handler';
import Logger from 'bunyan';

const log: Logger = config.createLogger('server');
const SERVER_PORT = 5000;
export class ChattyServer {
   private app: Application;

   constructor(app: Application) {
     this.app = app;
   }

   public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routeMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
   }

   private securityMiddleware(app: Application) {
        app.use(
            cookieSession({
                name: 'Session',
                keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
                maxAge: 24 * 7 * 3600000,
                secure: config.NODE_ENV !== 'development'
            })
        );
        app.use(hpp());
        app.use(helmet());
        app.use(cors({
            origin: config.CLIENT_URL,
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }))
   }

   private standardMiddleware(app: Application) {
        app.use(compression());
        app.use(json({ limit: '50mb'}));
        app.use(urlencoded({ extended: true, limit: '50mb' }));
   }

   private routeMiddleware(app: Application) {
            Routes(app);
   }

   private globalErrorHandler(app: Application) {
        app.all('*', (req, res) => {
                res.status(HTTP_STATUS.NOT_FOUND).json({message: `${req.originalUrl} not found`});
        })

        app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
                log.error(error)
                if (error instanceof CustomError) {
                    return res.status(error.statusCode).json(error.serializeError());
                }
                next();
        })
   }

   private async startServer(app: Application) {
        try {
            const HttpServer: http.Server = new http.Server(app);
            const socket: Server = await this.createSocketIo(HttpServer);
            this.startHttpServer(HttpServer);
        } catch (error) {
            log.error(error);
        }
   }

   private async createSocketIo(httpServer: http.Server) {
        const server: Server = new Server(httpServer, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']   
            }
        });

        const pubClient = createClient({
            url: config.REDIS_URL,
        })
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);
        server.adapter(createAdapter(pubClient, subClient));
        return server;
   }

   private startHttpServer(httpServer: http.Server) {
        httpServer.listen(SERVER_PORT, () => {
            log.info(`http server listening on port ${SERVER_PORT}`)
        })
   }
}
