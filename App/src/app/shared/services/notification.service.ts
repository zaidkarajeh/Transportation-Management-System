import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(private messageService: MessageService) {}

    success(message: string = 'تم الحفظ بنجاح'): void {
        this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: message
        });
    }

    update(message: string = 'تم التعديل بنجاح'): void {
        this.messageService.add({
            severity: 'info',
            summary: 'معلومة',
            detail: message
        });
    }

    delete(message: string = 'تم الحذف بنجاح'): void {
        this.messageService.add({
            severity: 'error',
            summary: 'تم الحذف',
            detail: message
        });
    }

    error(message: string = 'حدث خطأ'): void {
        this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: message
        });
    }

    warn(message: string): void {
        this.messageService.add({
            severity: 'warn',
            summary: 'تحذير',
            detail: message
        });
    }
}
