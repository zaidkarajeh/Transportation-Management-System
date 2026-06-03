import { Routes } from '@angular/router';

import { InstantOrderComponent } from './instantOrder/InstantOrder';
import { SubscriptionComponent } from './Subscription/Subscription';
import { Drivers } from './drive/Drivers';
import { Client } from './client/Client';
import { DriverPaymentsComponent } from './driverPaymentLog/driver-payments.component';
import { AppSettingsComponent } from './appSettings/app-settings.component';
import { ReportsComponent } from './reports/reports.component';
import { AccountManagementComponent } from './AccountManagement/account-management.component';
import { adminGuard } from '../auth/role.guard';

export default [
    { path: 'app-client', component: Client },
    { path: 'app-drivers', component: Drivers },
    { path: 'app-instant-order', component: InstantOrderComponent },
    { path: 'app-Subscription', component: SubscriptionComponent },

    // ✅ هاد بس للـ Admin
    { path: 'app-driver-payments', canActivate: [adminGuard], component: DriverPaymentsComponent },
    { path: 'app-settings', canActivate: [adminGuard], component: AppSettingsComponent },
    { path: 'app-reports', canActivate: [adminGuard], component: ReportsComponent },
    { path: 'app-account-management', canActivate: [adminGuard], component: AccountManagementComponent },

    { path: '**', redirectTo: '/notfound' }
] as Routes;
