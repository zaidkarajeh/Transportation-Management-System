export class InstantOrderDTO {
    id!: string;
    driverId?: string;
    clientId!: string;
    pickupAddress!: string;
    pickupTime?: Date;
    dropoffAddress!: string;
    passengerCount!: number;
    price!: number;
    companyCommission!: number;
    status!: string;
    createdAt?: Date;
    driverName?: string;
    clientName?: string;
}
