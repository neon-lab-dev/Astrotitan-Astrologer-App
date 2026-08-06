
export type TConsultation = {
    _id: string;
    user: any;           // User who requested
    astrologer: any;      // Astrologer who received the request
    method: "chat" | "call";         // Consultation method
    status: "pending" | "scheduled" | "ended";
    consultationFor: string;
    requestMessage?: string; // if user wants to write a short message about his issue
    acceptedAt?: Date;
    declinedAt?: Date;
    endedAt?: Date;
    endedBy?: any;
    startedAt?: Date;                // When chat actually started
    rating?: number;
    review?: string;

    // If method is call, then meeting link will be generated and stored here
    slotId?: any;
    bookedSlotId?: any;
    recommendations?: string;
    meeting: {
        link: string;
        scheduledAt: Date;

        rescheduleRequest?: {
            requestedTime: Date;
            reason: string;
            isRescheduled: boolean;
        }
    };
    createdAt?: Date;
    updatedAt?: Date;
};