using AutoMapper;
using ServerTransferAPI.Data;
using System.ComponentModel.DataAnnotations.Schema;
[Table("Clients")]
public class Client : Person
{

    // Relationships (Navigation Properties)
    public List<Subscription> Subscriptions { get; set; }
    public List<InstantOrder> InstantOrders { get; set; }
    public List<DriverPaymentLog> DriverPaymentLogs { get; set; }
}