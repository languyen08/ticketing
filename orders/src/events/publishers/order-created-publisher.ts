import { OrderCreatedEvent, Publisher, Subjects } from "@ntlantickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}