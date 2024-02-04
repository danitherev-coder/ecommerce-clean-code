import { Request, Response } from "express";
import { CreateOrderDto, OrderRepository } from "../../domain";
import { handleErrors } from "../errorHandler/errorHandler";



export class OrderController {
    constructor(
        private readonly repository: OrderRepository
    ) { }


    createOrder = async (req: Request, res: Response) => {

        const userId = req.body.user.id
        try {
            const [error, createOrderDto] = CreateOrderDto.create({ orderBy: userId, userId, ...req.body });
            if (error) return res.status(400).json({ error });

            const order = await this.repository.createOrder(createOrderDto!);


            return res.status(201).json(order);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    receiveWebHook = async (req: Request, res: Response) => {
        console.log(req.query, 'que traigo en query - recibi hook'); //* -> con morgan veo esto en consola: POST /api/v1/users/order/webhook?id=14997114611&topic=merchant_order 200 1.788 ms - 2 { 'data.id': '1320692183', type: 'payment' }, son lo que envia mercado pago al crear la orden y en este webhook lo recibo

        const dataId = req.query['data.id'];
        const type = req.query.type;

        try {
            if (typeof dataId !== 'string' || typeof type !== 'string') {
                return res.status(400).send('data.id and type are required');
            }

            const dataWebhook = await this.repository.receiveWebHook(dataId, type);

            console.log(dataWebhook, 'data webHook');


            return res.json(dataWebhook);

        } catch (error) {
            console.log(error);
            return handleErrors(error, res);
        }
    }

    successOrder = async (req: Request, res: Response) => {

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