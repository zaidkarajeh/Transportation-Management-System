// Import Angular modules and data models
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientDTO } from '@/app/Model/clientDTO';
import { DriveDTO } from '@/app/Model/driveDTO';
// Make this service available throughout the app
@Injectable({
    providedIn: 'root'
})
export class DriverService {
    // Base URL of the API
    private apiUrl = 'https://localhost:7290/api/Driver';

    // Inject HttpClient to make HTTP requests
    constructor(private http: HttpClient) {}

    insert(driver: DriveDTO): Observable<any> {
        const formData = new FormData();
        formData.append('name', driver.name);
        formData.append('gender', driver.gender);
        formData.append('phone', driver.phone);
        formData.append('email', driver.email);
        formData.append('carType', driver.carType);
        formData.append('carNumber', driver.carNumber);
        formData.append('status', driver.status);
        formData.append('totalSeats', driver.totalSeats.toString());
        if (driver.vehicleImageFile) {
            formData.append('vehicleImageFile', driver.vehicleImageFile);
        }
        return this.http.post(`${this.apiUrl}/AddDriver`, formData, {
            responseType: 'text'
        });
    }
    // Load all clients
    loadAll(): Observable<any> {
        return this.http.get(`${this.apiUrl}/LoadAllDrivers`);
    }

    // Delete a driver by ID
    Delete(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/DeleteDriver?id=` + id, {});
    }
    // Get a single driver by ID
    GetDriver(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/loadDriver?id=` + id, {});
    }

    UpdateDriver(driver: DriveDTO): Observable<any> {
        const formData = new FormData();
        formData.append('id', driver.id);
        formData.append('name', driver.name);
        formData.append('gender', driver.gender);
        formData.append('phone', driver.phone);
        formData.append('email', driver.email);
        formData.append('carType', driver.carType);
        formData.append('carNumber', driver.carNumber);
        formData.append('status', driver.status);
        formData.append('totalSeats', driver.totalSeats.toString());
        if (driver.vehicleImageFile) {
            formData.append('vehicleImageFile', driver.vehicleImageFile);
        } else if (driver.vehicleImage) {
            formData.append('vehicleImage', driver.vehicleImage);
        }
        return this.http.put(`${this.apiUrl}/UpdateDriver`, formData, {
            responseType: 'text'
        });
    }
}
