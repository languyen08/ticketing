import { OrderCancelledEvent, Publisher, Subjects } from "@ntlantickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}