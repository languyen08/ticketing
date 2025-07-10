import { PaymentCreatedEvent, Publisher, Subjects } from "@ntlantickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}