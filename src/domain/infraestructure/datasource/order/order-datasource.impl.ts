import { Items } from "mercadopago/dist/clients/commonTypes";
import { CartModel, OrderModel, UserModel } from "../../../../data";
import { CreateOrderDto, CustomError, OrderDatasource, OrderEntity } from "../../../index";
import MercadoPago, { Payment, Preference } from 'mercadopago';

interface Order {
    initPointURL?: string | null,
    order_status?: string,
    isCompleted?: boolean,
    payment_intent?: any,
    save(): Promise<void>,
}

export class OrderDatasourceImpl implements OrderDatasource {


    async updateOrderStatus(object: { [key: string]: any; }): Promise<OrderEntity> {

        const order = await OrderModel.findById(object.external_reference) as Order;
        if (!order) throw CustomError.notFound('Order not found');

        if (object.status === 'approved') {
            order.initPointURL = null;
        }

        order.order_status = object.status;
        order.isCompleted = object.status === 'approved' ? true : false;
        order.payment_intent = object.id;
        try {
            await order.save();
        } catch (error) {
            console.log(error);
        }

        return OrderEntity.fromObject(order);
    }

    async createOrder(createOrderDto: CreateOrderDto): Promise<{ order: OrderEntity, url: string }> {

        try {
            const user = await UserModel.findById(createOrderDto.userId);
            if (!user) throw CustomError.notFound('User not found');

            let userCart = await CartModel.findOne({ orderBy: user._id }).populate('products').exec();
            if (!userCart) throw CustomError.notFound('Cart not found for this user i know');

            //* PASO 1. Initialize the client object
            const client = new MercadoPago({
                accessToken: 'TEST-4294775390481965-011615-ab896cb202bce7d3902449c04cdcb736-1640035341',
                options: { timeout: 5000 }
            });


            const preference = new Preference(client);

            const items: Items[] = userCart.products.map(product => {
                return {
                    id: product._id.toString(),
                    title: product.name,
                    currency_id: 'PEN',
                    picture_url: product.images,
                    quantity: product.count,
                    unit_price: product.price,
                }
            });



            const newOrder = new OrderModel({
                products: items,
                order_status: 'Processing',
                orderBy: user.id.toString(),
            })

            const order = await newOrder.save();

            const result = await preference.create({
                body: {
                    items: items,
                    external_reference: order.id.toString(),
                    auto_return: 'all',
                    back_urls: {
                        success: 'http://localhost:8081/api/v1/orders/success',
                        failure: 'http://localhost:8081/api/v1/orders/failure',
                        pending: 'http://localhost:8081/api/v1/orders/pending',
                    },
                    notification_url: "https://ee0a-2001-1388-7829-4087-1637-853-4c49-922d.ngrok-free.app/api/v1/orders/webhook",
                    payer: {
                        name: user.firstname.toString(),
                        surname: user.lastname.toString(),
                        email: "test_user_811609550@testuser.com",
                    },
                    payment_methods: {
                        excluded_payment_methods: [
                            {
                                id: "amex"
                            }
                        ],
                        excluded_payment_types: [
                            {
                                id: "atm"
                            }
                        ],
                        installments: 6
                    }
                }
            })

            // guardar el enlace de pago para la order creada     
            if (result.init_point) {
                order.initPointURL = result.init_point;
                await newOrder.save();
            }

            console.log(result);

            if (result && result.init_point) {
                console.log(result.init_point, 'que me trae en result');
                return { order: OrderEntity.fromObject(order), url: result.init_point };
            } else {
                console.log('No se pudo crear la preferencia de pago');
                throw CustomError.badRequest('No se pudo crear la preferencia de pago');
            }


        } catch (error) {
            console.log(error);
            throw error;
        }

    }


    async receiveWebHook(dataId: string, status: string): Promise<{ msg: string }> {

        //* PASO 1. Initialize the client object
        const client = new MercadoPago({
            accessToken: 'TEST-4294775390481965-011615-ab896cb202bce7d3902449c04cdcb736-1640035341'
        });

        const payment = new Payment(client);

        console.log(dataId, 'que dataId me trae en receiveWebHook');
        console.log(status, 'que status me trae en receiveWebHook');
        if (status === 'payment') {
            const data = await payment.get({ id: dataId });
            // si el status de data es approved, entonces actualizar el estado de la orden
            if (data.status === 'approved') {
                console.log(data, 'que envio en data a mi update order');
                await this.updateOrderStatus(data);
                // si se aprobo el pago, entonces podemos borra el carrito de compras
                const userOrder = await OrderModel.findById(data.external_reference);
                if (!userOrder) throw CustomError.notFound('Order not found');
                // ahora, buscar el carrito del usuario y borrarlo
                await CartModel.findOneAndDelete({ orderBy: userOrder.orderBy });
                return { msg: 'Pago se realizó con exito' }
            }

            // si el status de data es rejected, entonces actualizar el estado de la orden
            if (data.status === 'rejected') {
                await this.updateOrderStatus(data);
                return { msg: 'Pago rechazado' }
            }

            // si el status de data es pending, entonces actualizar el estado de la orden
            if (data.status === 'pending') {
                await this.updateOrderStatus(data);
                return { msg: 'Pago pendiente' }
            }

            // si el status de data es in_process, entonces actualizar el estado de la orden
            if (data.status === 'in_process') {
                await this.updateOrderStatus(data);
                return { msg: 'Pago en proceso' }
            }

        }
        return { msg: 'Pago no realizado' }

    }

}