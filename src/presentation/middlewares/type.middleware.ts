import { NextFunction, Request, Response } from "express";

export class TypeMiddleware {


    static validTypes(validTypes: string[]) {

        return (req: Request, res: Response, next: NextFunction) => {
            //* como todo esto es un middleware, no podemos acceder al params porque como tiene que pasar por aca primero, no llega hasta el controlador, por eso para que funcione, debemos hacer lo siguiente
                //! const type = req.params.type; 
            const type = req.url.split('/').at(2) ?? ''; // aca sale: /multiple/users, entonces lo que hacemos es cortar el string y obtener el users, si no existe, le asignamos un string vacio, claro, puede venir single/products, multiple/categories, etc....                        

            if (!validTypes.includes(type)) return res.status(400).json({ error: `Invalid type: ${type}, valid ones: ${validTypes}` });

            return next();
        }
    }

}