import { NextFunction, Request, Response } from "express";

export class FileUploadMiddleware {


    static containFile(req: Request, res: Response, next: NextFunction) {                          
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were selected.' });
            // return next();
        }        

        // converitmos a array si no lo es, ya que si enviamos solo un archivo, viene como objeto
        // pero si enviamos varios archivos, viene como array
        // para poder manejar uno solo, entonces convertimos a array a todos.
        if (!Array.isArray(req.files.file)) {
            req.body.files = [req.files.file];
        } else {
            req.body.files = req.files.file; // recordemos que files es el nombre del campo en el form-data
        }        
        return next();
    }

}