
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ServerTransferAPI.Data; // ???? ?? ???? ??? ?????
using ServerTransferAPI.Model;
using ServerTransferAPI.Services.AccountServices;
using ServerTransferAPI.Services.AppSettingService;
using ServerTransferAPI.Services.ClientService;
using ServerTransferAPI.Services.DriverPaymentService;
using ServerTransferAPI.Services.DriverService;
using ServerTransferAPI.Services.InstantOrderService;
using ServerTransferAPI.Services.SubscriptionService;
using System.Text;

namespace ServerTransferAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Enter: Bearer {your token}"
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
            });
            builder.Services.AddDbContext<TransferContext>();

            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

           builder.Services.AddCors(opt => {
               opt.AddPolicy("LoginOrgin", builder => {
                   builder.AllowAnyOrigin(); 
                   builder.AllowAnyMethod(); 
                   builder.AllowAnyHeader(); 
               });
           });

            builder.Services.AddScoped<IClientService, ClientService>();

            builder.Services.AddScoped<IDriverService, DriverService>();

            builder.Services.AddScoped< IInstantOrderService, InstantOrderService>();
            builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();

            builder.Services.AddScoped<IDriverPaymentService, DriverPaymentService>();
            builder.Services.AddScoped<IAppSettingService, AppSettingService>();
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
               .AddEntityFrameworkStores<TransferContext>();


            builder.Services.AddScoped<IAccountServices, AccountServices>();

            builder.Services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(

                options => {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidAudience = "User",
                        ValidIssuer = "http://localhost",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsAVeryLongAndSecureJWTSecretKey_123456789"))
                    };
                });
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            
            app.UseCors("LoginOrgin");

            app.UseHttpsRedirection();


            app.UseAuthorization();


            app.MapControllers();

            app.UseStaticFiles();


            app.Run();
        }
    }
}
