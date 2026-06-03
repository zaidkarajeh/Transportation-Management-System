export class ClientDTO {
    id!: string; // في الـ C# هو Guid، وفي الـ TypeScript بنعامله كـ string
    name!: string; // Name
    gender!: string; // Gender
    phone!: string; // Phone
    email!: string; // Email
    createdAt?: Date; // CreatedAt (علامة الاستفهام لأنها nullable في الـ C#)
}
