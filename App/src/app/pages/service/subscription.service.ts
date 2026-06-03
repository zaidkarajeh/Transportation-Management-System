// Import Angular modules and data models
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstantOrderDTO } from '@/app/Model/InstantOrderDTO';
import { SubscriptionDTO } from '@/app/Model/subscriptionDTO';
// Make this service available throughout the app
@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    // Base URL of the API
    private apiUrl = 'https://localhost:7290/api/Subscription';

    // Inject HttpClient to make HTTP requests
    constructor(private http: HttpClient) {}

    // Insert a new instant order
    insert(subscription: SubscriptionDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/AddSubscription`, subscription, {
            responseType: 'text'
        });
    }

    // Load all instant orders
    loadAll(): Observable<any> {
        return this.http.get(`${this.apiUrl}/LoadAllSubscription`);
    }

    // Delete an instant order by ID
    Delete(Id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/DeleteSubscription?id=` + Id, {
            responseType: 'text'
        });
    }

    // Update an existing instant order
    UpdateSubscription(updatedSub: SubscriptionDTO): Observable<any> {
        return this.http.put(`${this.apiUrl}/UpdateSubscription`, updatedSub, {
            responseType: 'text'
        });
    }
}
