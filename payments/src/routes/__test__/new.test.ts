import { app } from "../../app";
import request from 'supertest';
import mongoose from "mongoose";
import { Order } from "../../model/order";
import { OrderStatus } from "@ntlantickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../model/payment";

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asd',
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.CREATED
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asd',
            orderId: order.id,
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.CANCELLED
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'asd',
            orderId: order.id,
        })
        .expect(400);
});

it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price,
        status: OrderStatus.CREATED
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'test',
            orderId: order.id,
        })
    .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find(charge => charge.amount === price * 100);

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id,
    })

    expect(payment).not.toBeNull();
});