import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DriverPaymentLogService {
    private apiUrl = 'https://localhost:7290/api/DriverPayment';

    constructor(private http: HttpClient) {}

    // GET: جيب كل السجلات

    loadAll(): Observable<any> {
        return this.http.get(`${this.apiUrl}/GetAll`);
    }
    // GET: جيب سجلات سائق معين
    getByDriver(driverId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/GetDriver/${driverId}`);
    }

    // GET: جيب السجلات الغير مدفوعة
    getUnpaid(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/unpaid`);
    }

    // PUT: سجل إن السائق دفع للشركة
    markAsPaid(id: string): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/markpaid/${id}`,
            {},
            {
                responseType: 'json'
            }
        );
    }
}
