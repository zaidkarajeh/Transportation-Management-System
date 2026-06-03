import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SummaryReport {
    instantOrders: {
        total: number;
        completed: number;
        cancelled: number;
        revenue: number;
        commission: number;
    };
    subscriptions: {
        total: number;
        active: number;
        completed: number;
        cancelled: number;
        revenue: number;
        commission: number;
    };
    payments: {
        totalDue: number;
        totalPaid: number;
        totalUnpaid: number;
        unpaidDrivers: number;
    };
    totals: {
        revenue: number;
        commission: number;
    };
}

export interface MonthlyReport {
    year: number;
    months: {
        month: number;
        instantRevenue: number;
        instantCommission: number;
        instantCount: number;
        subRevenue: number;
        subCommission: number;
        subCount: number;
        totalRevenue: number;
        totalCommission: number;
    }[];
}

export interface DriverReport {
    driverId: string;
    driverName: string;
    totalCollected: number;
    totalCommission: number;
    totalPaid: number;
    totalUnpaid: number;
    logsCount: number;
    unpaidCount: number;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
    private apiUrl = 'https://localhost:7290/api/Reports';

    constructor(private http: HttpClient) {}

    getSummary(): Observable<SummaryReport> {
        return this.http.get<SummaryReport>(`${this.apiUrl}/summary`);
    }

    getMonthly(year: number): Observable<MonthlyReport> {
        return this.http.get<MonthlyReport>(`${this.apiUrl}/monthly?year=${year}`);
    }

    getDrivers(): Observable<DriverReport[]> {
        return this.http.get<DriverReport[]>(`${this.apiUrl}/drivers`);
    }

    getRecentOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/recentorders`);
    }

    getExpiringSubscriptions(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/expiringsubscriptions`);
    }

    getRecentActivity(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/recentactivity`);
    }
}
