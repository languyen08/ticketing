import { Publisher, Subjects, TicketUpdatedEvent } from "@ntlantickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
