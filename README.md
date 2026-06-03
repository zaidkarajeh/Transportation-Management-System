# Transportation Management System

Transportation Management System is a web-based application for managing all transit and logistics operations, built with ASP.NET Core Web API for the backend and Angular for the frontend.

## Features

* **Driver Management:** Create, view, update, and delete driver profiles with personal, vehicle, and licensing information.
* **Client Management:** Manage corporate and individual clients with active subscription tracking and history.
* **Subscriptions & Packages:** Schedule, track, and update client subscriptions with operational status handling.
* **Vehicle Logs & Uploads:** Maintain accurate records of fleet vehicles, including dynamic media and image uploads (`wwwroot/uploads/vehicles/`) linked via clean GUIDs.
* **Relational Data Mapping:** Store operational observations and logs linked directly to clients and drivers using optimized database constraints (`Reference_Id`).
* **User Accounts & Roles:** Secure access control with distinct system levels:
  * **Admin:** Full access to all modules (manage drivers, clients, subscriptions, vehicles, and database sync). 
    * **Email:** ZaidKarajah@gmail.com
    * **Password:** Za@0791831150
  * **Employee:** Limited access to relevant operational modules, daily trip updates, and client tracking.
    * **Email:** ahmad@gmail.com
    * **Password:** Za@0791831150
* **Authentication & Authorization:** Secure login and role-based access using JWT.
* **Responsive Design:** Works seamlessly on both desktop and mobile devices.

## Tech Stack

* **Backend:** ASP.NET Core Web API, Entity Framework Core
* **Frontend:** Angular, Bootstrap
* **Database:** SQL Server (Custom Triggers & Schema Optimization)
* **Authentication:** JWT

## Installation & Running Locally

```bash
git clone [https://github.com/zaidkarajeh/-Transportation-Management-System-.git](https://github.com/zaidkarajeh/-Transportation-Management-System-.git)
cd -Transportation-Management-System-/ServerTransferAPI
dotnet restore
dotnet run

cd ../Frontend
npm install
ng serve
