import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignUpDTO {
    name: string;
    dob: string;
    email: string;
    password: string;
    roleName?: string;
    gender: string;
}

export interface RoleDTO {
    name: string;
}

export interface UserDTO {
    id: string;
    name: string;
    email: string;
    role?: string;
}
export interface SignInDTO {
    username: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
    private apiUrl = 'https://localhost:7290/api/Account';

    constructor(private http: HttpClient) {}

    // جيب كل المستخدمين
    getAllUsers(): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(`${this.apiUrl}/GetAllUsers`);
    }

    // أضف مستخدم جديد
    addAccount(dto: SignUpDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/AddAccount`, dto);
    }

    // جيب كل الأدوار
    getAllRoles(): Observable<RoleDTO[]> {
        return this.http.get<RoleDTO[]>(`${this.apiUrl}/GetAllRoles`);
    }

    // أضف دور جديد
    addRole(dto: RoleDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/AddRoles`, dto);
    }

    login(dto: SignInDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, dto);
    }

    deleteUser(userId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/DeleteUser/${userId}`);
    }
}
