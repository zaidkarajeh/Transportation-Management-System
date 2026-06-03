export class DriverPaymentLogDTO {
    id!: string;
    driverId!: string;
    driverName?: string;
    paymentType!: string; // "Instant" | "Subscription"
    instantOrderId?: string;
    subscriptionId?: string;
    subscriptionMonth?: number;
    subscriptionYear?: number;
    totalCollected!: number;
    commissionAmount!: number;
    driverNet!: number;
    isPaid!: boolean;
    paidAt?: Date;
    createdAt!: Date;
}
