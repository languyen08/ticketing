import { Publisher, Subjects, TicketCreatedEvent } from "@ntlantickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}