import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@ntlantickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            id: data.id,
            version: data.version,
        });

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.CANCELLED });
        await order.save();

        msg.ack();
    }
}