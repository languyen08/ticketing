import { Ticket } from "../../models/ticket";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    return ticket;
}

it('marks an order as cancelled', async () => {
    // create a ticket with Ticket Model
    const ticket = await buildTicket();

    const user = global.signin();
    // make a request to create an order
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id})
        .expect(201);
    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);

    // expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED)
})

it('emits an order cancelled event', async () => {
    // create a ticket with Ticket Model
    const ticket = await buildTicket();

    const user = global.signin();
    // make a request to create an order
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id})
        .expect(201);
    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
