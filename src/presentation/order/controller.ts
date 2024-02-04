import { Request, Response } from "express";
import { CreateOrder, CreateOrderDto, OrderRepository, ReceiveWebHook } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";



export class OrderController {
    constructor(
        private readonly repository: OrderRepository
    ) { }


    createOrder = (req: Request, res: Response) => {

        const userId = req.body.user.id

        const [error, createOrderDto] = CreateOrderDto.create({ orderBy: userId, userId, ...req.body });
        if (error) return res.status(400).json({ error });

        new CreateOrder(this.repository).execute(createOrderDto!)
            .then(order => { res.status(201).json(order) })
            .catch(error => handleErrors(error, res));

        return;
    }

    receiveWebHook = (req: Request, res: Response) => {
        console.log(req.query, 'que traigo en query - recibi hook'); //* -> con morgan veo esto en consola: POST /api/v1/users/order/webhook?id=14997114611&topic=merchant_order 200 1.788 ms - 2 { 'data.id': '1320692183', type: 'payment' }, son lo que envia mercado pago al crear la orden y en este webhook lo recibo

        const dataId = req.query['data.id'];
        const type = req.query.type;


        if (typeof dataId !== 'string' || typeof type !== 'string') {
            return res.status(400).send('data.id and type are required');
        }

        new ReceiveWebHook(this.repository).execute(dataId, type)
            .then(order => { res.status(200).json(order) })
            .catch(error => handleErrors(error, res));

        return;
    }

    successOrder = (req: Request, res: Response) => {

        console.log(req.query)
        req.query;
        try {
            const order = 'La transaccion fue exitosa';

            return res.json({ order });
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    failureOrder = async (req: Request, res: Response) => {

        console.log(req.query)
        console.log(req.body);
        req.query;
        try {
            const order = 'La transaccion falló';

            return res.json({ order });
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    pendingOrder = async (req: Request, res: Response) => {

        console.log(req.query)
        req.query;
        try {
            const order = 'La transaccion esta pendiente de pago';

            return res.json({ order });
        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }
}