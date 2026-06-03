// Import Angular modules and data models
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstantOrderDTO } from '@/app/Model/InstantOrderDTO';
// Make this service available throughout the app
@Injectable({
    providedIn: 'root'
})
export class InstantOrderService {
    // Base URL of the API
    private apiUrl = 'https://localhost:7290/api/InstantOrder';

    // Inject HttpClient to make HTTP requests
    constructor(private http: HttpClient) {}

    // Insert a new instant order
    insert(instantOrder: InstantOrderDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/AddOrder`, instantOrder, {
            responseType: 'text'
        });
    }

    // Load all instant orders
    loadAll(): Observable<any> {
        return this.http.get(`${this.apiUrl}/LoadAllOrders`);
    }

    // Delete an instant order by ID
    Delete(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/DeleteOrder?id=` + id, {
            responseType: 'text'
        });
    }

    // Update an existing instant order
    UpdateOrder(OrderDTO: InstantOrderDTO): Observable<any> {
        return this.http.put(`${this.apiUrl}/UpdateOrder`, OrderDTO, {
            responseType: 'text'
        });
    }
}
