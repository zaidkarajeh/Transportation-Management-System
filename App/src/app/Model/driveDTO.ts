export class DriveDTO {
    id!: string;
    name!: string;
    gender!: string;
    phone!: string;
    email!: string;
    carType!: string;
    carNumber!: string;
    vehicleImage?: string;
    vehicleImageFile?: File;
    status!: string;
    joinDate?: Date;
    totalSeats!: number;
    availableSeats?: number;
    createdAt?: Date;
}
