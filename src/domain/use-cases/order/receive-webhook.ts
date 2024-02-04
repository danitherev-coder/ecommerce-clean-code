import { OrderRepository } from "../../index";


export interface ReceiveWebHookUseCase {
    execute(dataId: string, status: string): Promise<{ msg: string }>
}

export class ReceiveWebHook implements ReceiveWebHookUseCase {

    constructor(
        private readonly repository: OrderRepository
    ) { }

    execute(dataId: string, status: string): Promise<{ msg: string }> {
        return this.repository.receiveWebHook(dataId, status);
    }

}