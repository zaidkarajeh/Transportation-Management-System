import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService, SummaryReport } from '../../service/reports.service';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">الطلبات الفورية</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ summary?.instantOrders?.total ?? '...' }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-car text-blue-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ summary?.instantOrders?.completed ?? 0 }} </span>
                <span class="text-muted-color">تم التوصيل</span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">إجمالي الإيرادات</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ summary?.totals?.revenue ?? 0 | currency: 'USD' : 'symbol' : '1.0-0' }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ summary?.totals?.commission ?? 0 | currency: 'USD' : 'symbol' : '1.0-0' }} </span>
                <span class="text-muted-color">عمولة الشركة</span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">الاشتراكات</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ summary?.subscriptions?.total ?? '...' }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-calendar text-cyan-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ summary?.subscriptions?.active ?? 0 }} </span>
                <span class="text-muted-color">اشتراك نشط</span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">المدفوعات</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ summary?.payments?.totalUnpaid ?? 0 | currency: 'USD' : 'symbol' : '1.0-0' }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-wallet text-purple-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ summary?.payments?.unpaidDrivers ?? 0 }} </span>
                <span class="text-muted-color">سائق مدين</span>
            </div>
        </div>
    `
})
export class StatsWidget implements OnInit {
    summary: SummaryReport | null = null;

    constructor(
        private reportsService: ReportsService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.reportsService.getSummary().subscribe({
            next: (data) => {
                this.summary = data;
                this.cdr.detectChanges();
            }
        });
    }
}
