import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ أضف هاد
import { AppSettingDTO } from '@/app/Model/AppSettingDTO';

@Injectable({
    providedIn: 'root'
})
export class AppSettingService {
    private apiUrl = 'https://localhost:7290/api/AppSetting';

    constructor(private http: HttpClient) {}

    // جيب كل الإعدادات
    loadAll(): Observable<AppSettingDTO[]> {
        return this.http.get<AppSettingDTO[]>(`${this.apiUrl}`);
    }

    // جيب إعداد معين بالـ Key
    getByKey(key: string): Observable<AppSettingDTO> {
        return this.http.get<AppSettingDTO>(`${this.apiUrl}/key/${key}`);
    }

    // عدّل إعداد
    update(dto: AppSettingDTO): Observable<any> {
        return this.http.put(`${this.apiUrl}`, dto, { responseType: 'json' });
    }
}
