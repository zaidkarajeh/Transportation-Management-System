export class SubscriptionDTO {
    id!: string;

    // معلومات السائق والعميل
    driverId?: string;
    driverName?: string;

    clientId!: string;
    clientName?: string;

    // المواعيد
    pickupAddress!: string;
    pickUpTime!: string; // TimeSpan → string "HH:mm:ss"

    returnPickupAddress!: string;
    returnPickUpTime!: string; // TimeSpan → string "HH:mm:ss"

    offDays!: string;

    // التواريخ
    startDate!: string | Date;
    endDate!: string | Date;
    seatsCount!: number;
    // مالي وحالة
    totalMonthlyPrice!: number;
    companyCommission!: number;

    status!: string;
    CreatedAt!: string | Date;
}
