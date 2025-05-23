import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from "@ntlantickets/common";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const {orderId} = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.CANCELLED;
    await order.save();

    // Publish an event saying that an order was cancelled
    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    })
    res.status(204).send(order);
});

export { router as deleteOrderRouter };
