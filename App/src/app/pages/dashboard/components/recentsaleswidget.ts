import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ReportsService } from '../../service/reports.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule, TagModule],
    template: `
        <div class="card mb-8!">
            <div class="font-semibold text-xl mb-4">آخر الطلبات الفورية</div>
            <p-table [value]="orders" [paginator]="false" responsiveLayout="scroll" [loading]="loading">
                <ng-template #header>
                    <tr>
                        <th>العميل</th>
                        <th pSortableColumn="driverName">الكابتن <p-sortIcon field="driverName" /></th>
                        <th pSortableColumn="pickupAddress">الانطلاق <p-sortIcon field="pickupAddress" /></th>
                        <th pSortableColumn="price">السعر <p-sortIcon field="price" /></th>
                        <th>الحالة</th>
                    </tr>
                </ng-template>
                <ng-template #body let-order>
                    <tr>
                        <td style="min-width: 8rem;">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center font-bold text-sm shrink-0">
                                    {{ order.clientName?.charAt(0) }}
                                </div>
                                <span class="font-medium">{{ order.clientName }}</span>
                            </div>
                        </td>
                        <td style="min-width: 7rem;">
                            <span *ngIf="order.driverName">{{ order.driverName }}</span>
                            <span *ngIf="!order.driverName" class="text-muted-color text-sm">غير معين</span>
                        </td>
                        <td style="min-width: 8rem;">
                            <span class="text-sm truncate block max-w-32">{{ order.pickupAddress }}</span>
                        </td>
                        <td style="min-width: 6rem;">
                            <span class="font-bold text-green-600 dark:text-green-400">
                                {{ order.price | currency: 'USD' : 'symbol' : '1.2-2' }}
                            </span>
                        </td>
                        <td style="min-width: 8rem;">
                            <p-tag [value]="order.status" [severity]="getStatusSeverity(order.status)" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5" class="text-center py-6 text-muted-color">لا توجد طلبات</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class RecentSalesWidget implements OnInit {
    orders: any[] = [];
    loading = false;

    constructor(
        private reportsService: ReportsService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loading = true;
        this.reportsService.getRecentOrders().subscribe({
            next: (data) => {
                this.orders = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (status) {
            case 'تم التوصيل':
                return 'success';
            case 'تم تأمين سائق':
                return 'info';
            case 'قيد الانتظار':
                return 'warn';
            case 'بانتظار تأمين سائق':
                return 'warn';
            case 'ملغي':
                return 'danger';
            default:
                return 'secondary';
        }
    }
}
