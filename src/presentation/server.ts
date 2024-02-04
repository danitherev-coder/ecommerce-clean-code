import express, { Application, NextFunction, Request, Response, Router } from 'express';
import compression from 'compression';
import brotli from 'brotli';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';

interface Options {
    port: number;
    public_path: string;
    routes: Router;
}


export class Server {
    private readonly app: Application = express();
    private readonly port: number;
    private readonly public_path: string;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port, public_path, routes } = options;
        this.port = port;
        this.public_path = public_path;
        this.routes = routes;
    }

    public start(): void {
        // Middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(compression({ brotliCompress: brotli.compress }));
        this.app.use(morgan('dev'));
        // mensaje de error si el json que envias no es valido, o si no envia datos
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            req.body = {};
            if (err instanceof SyntaxError && 'body' in err) {
                return res.status(400).send({ message: err.message, err: "Json que envias no es valido o esta vacio" }); // Bad request
            }
            return next();
        });
        // file upload
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

        // Static files
        this.app.use(express.static(this.public_path));

        // Routes
        this.app.use(this.routes);

        // Listen
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        })
    }
}