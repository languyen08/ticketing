import { ExpirationCompleteEvent, Publisher, Subjects } from "@ntlantickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}