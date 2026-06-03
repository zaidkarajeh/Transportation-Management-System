// Import Angular modules and data models
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientDTO } from '@/app/Model/clientDTO';
// Make this service available throughout the app
@Injectable({
    providedIn: 'root'
})
export class ClientService {
    // Base URL of the API
    private apiUrl = 'https://localhost:7290/api/Client';

    // Inject HttpClient to make HTTP requests
    constructor(private http: HttpClient) {}

    // Insert a new client
    insert(client: ClientDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/AddClient`, client);
    }

    // Load all clients
    loadAll(): Observable<any> {
        return this.http.get(`${this.apiUrl}/LoadAllClients`);
    }

    // Delete a client by ID
    Delete(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/DeleteClients?id=` + id, {});
    }

    // Update an existing client
    UpdateClient(client: ClientDTO): Observable<any> {
        return this.http.put(`${this.apiUrl}/UpdateClient`, client, {
            responseType: 'text'
        });
    }
}
