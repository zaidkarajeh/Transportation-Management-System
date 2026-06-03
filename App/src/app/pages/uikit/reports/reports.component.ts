import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';

// Service
import { ReportsService, SummaryReport, MonthlyReport, DriverReport } from '../../service/reports.service';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, ToastModule, TooltipModule, TableModule, TagModule, SkeletonModule, ChartModule],
    providers: [MessageService],
    template: `
        <p-toast position="top-right"></p-toast>

        <div class="card">
            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <div class="flex items-center gap-3 mb-1">
                        <i class="pi pi-chart-bar text-primary-500 text-3xl"></i>
                        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0 tracking-tight">التقارير والإحصائيات</h1>
                    </div>
                    <p class="text-surface-500 dark:text-surface-400 text-sm">نظرة شاملة ومفصلة على أداء المنصة</p>
                </div>

                <div class="flex items-center gap-3">
                    <!-- Year Selector -->
                    <p-select [options]="yearOptions" [(ngModel)]="selectedYear" (onChange)="loadMonthly()" styleClass="text-sm"></p-select>
                    <!-- Refresh -->
                    <p-button icon="pi pi-refresh" [rounded]="true" severity="secondary" pTooltip="تحديث البيانات" (onClick)="loadAll()" [loading]="loading"></p-button>
                </div>
            </div>

            <!-- Loading -->
            <div *ngIf="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <p-skeleton *ngFor="let i of [1, 2, 3, 4]" height="120px" styleClass="rounded-xl"></p-skeleton>
            </div>

            <ng-container *ngIf="!loading && summary">
                <!-- ── Summary Cards ── -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <!-- إجمالي الإيرادات -->
                    <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-5 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                        <div>
                            <div class="text-surface-500 dark:text-surface-400 text-sm mb-1 font-medium">إجمالي الإيرادات</div>
                            <div class="text-emerald-500 text-2xl font-bold">{{ summary.totals.revenue | currency: 'USD' : 'symbol' : '1.0-0' }}</div>
                            <div class="text-surface-500 text-xs mt-1">طلبات + اشتراكات</div>
                        </div>
                        <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center text-xl shrink-0">
                            <i class="pi pi-dollar"></i>
                        </div>
                    </div>

                    <!-- إجمالي العمولات -->
                    <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-5 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                        <div>
                            <div class="text-surface-500 dark:text-surface-400 text-sm mb-1 font-medium">إجمالي العمولات</div>
                            <div class="text-orange-500 text-2xl font-bold">{{ summary.totals.commission | currency: 'USD' : 'symbol' : '1.0-0' }}</div>
                            <div class="text-surface-500 text-xs mt-1">حق الشركة الإجمالي</div>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-full flex items-center justify-center text-xl shrink-0">
                            <i class="pi pi-percentage"></i>
                        </div>
                    </div>

                    <!-- مدفوع للشركة -->
                    <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-5 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                        <div>
                            <div class="text-surface-500 dark:text-surface-400 text-sm mb-1 font-medium">مدفوع للشركة</div>
                            <div class="text-primary-500 text-2xl font-bold">{{ summary.payments.totalPaid | currency: 'USD' : 'symbol' : '1.0-0' }}</div>
                            <div class="text-surface-500 text-xs mt-1">من أصل {{ summary.payments.totalDue | currency: 'USD' : 'symbol' : '1.0-0' }}</div>
                        </div>
                        <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center text-xl shrink-0">
                            <i class="pi pi-check-circle"></i>
                        </div>
                    </div>

                    <!-- ديون غير مدفوعة -->
                    <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-5 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                        <div>
                            <div class="text-surface-500 dark:text-surface-400 text-sm mb-1 font-medium">ديون غير مدفوعة</div>
                            <div class="text-red-500 text-2xl font-bold">{{ summary.payments.totalUnpaid | currency: 'USD' : 'symbol' : '1.0-0' }}</div>
                            <div class="text-surface-500 text-xs mt-1">{{ summary.payments.unpaidDrivers }} سائق مدين للمنصة</div>
                        </div>
                        <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center text-xl shrink-0">
                            <i class="pi pi-exclamation-circle"></i>
                        </div>
                    </div>
                </div>

                <!-- ── Instant vs Subscription ── -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <!-- Instant Orders -->
                    <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-6">
                        <div class="flex items-center gap-3 mb-5">
                            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                                <i class="pi pi-bolt text-lg"></i>
                            </div>
                            <span class="text-surface-900 dark:text-surface-0 font-bold text-lg">الطلبات الفورية</span>
                        </div>
                        <div class="grid grid-cols-3 gap-3">
                            <div class="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                                <div class="text-surface-500 text-xs mb-1">الإجمالي</div>
                                <div class="text-surface-900 dark:text-surface-0 text-xl font-bold">{{ summary.instantOrders.total }}</div>
                            </div>
                            <div class="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                                <div class="text-surface-500 text-xs mb-1">مكتملة</div>
                                <div class="text-emerald-500 text-xl font-bold">{{ summary.instantOrders.completed }}</div>
                            </div>
                            <div class="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                                <div class="text-surface-500 text-xs mb-1">ملغية</div>
                                <div class="text-red-500 text-xl font-bold">{{ summary.instantOrders.cancelled }}</div>
                            </div>
                        </div>
                        <div class="border-t border-surface-200 dark:border-surface-700 mt-5 pt-5 flex justify-between px-2">
                            <div>
                                <div class="text-surface-500 text-xs mb-1">إجمالي الإيرادات</div>
                                <div class="text-emerald-500 font-bold text-lg">{{ summary.instantOrders.revenue | currency: 'USD' : 'symbol' : '1.2-2' }}</div>
                            </div>
                            <div class="text-left">
                                <div class="text-surface-500 text-xs mb-1">إجمالي العمولة</div>
                                <div class="text-orange-500 font-bold text-lg">{{ summary.instantOrders.commission | currency: 'USD' : 'symbol' : '1.2-2' }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Subscriptions -->
                    <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-6">
                        <div class="flex items-center gap-3 mb-5">
                            <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">
                                <i class="pi pi-calendar text-lg"></i>
                            </div>
                            <span class="text-surface-900 dark:text-surface-0 font-bold text-lg">الاشتراكات</span>
                        </div>
                        <div class="grid grid-cols-3 gap-3">
                            <div class="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                                <div class="text-surface-500 text-xs mb-1">الإجمالي</div>
                                <div class="text-surface-900 dark:text-surface-0 text-xl font-bold">{{ summary.subscriptions.total }}</div>
                            </div>
                            <div class="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                                <div class="text-surface-500 text-xs mb-1">نشط</div>
                                <div class="text-emerald-500 text-xl font-bold">{{ summary.subscriptions.active }}</div>
                            </div>
                            <div class="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                                <div class="text-surface-500 text-xs mb-1">مكتمل</div>
                                <div class="text-blue-500 text-xl font-bold">{{ summary.subscriptions.completed }}</div>
                            </div>
                        </div>
                        <div class="border-t border-surface-200 dark:border-surface-700 mt-5 pt-5 flex justify-between px-2">
                            <div>
                                <div class="text-surface-500 text-xs mb-1">إجمالي الإيرادات</div>
                                <div class="text-emerald-500 font-bold text-lg">{{ summary.subscriptions.revenue | currency: 'USD' : 'symbol' : '1.2-2' }}</div>
                            </div>
                            <div class="text-left">
                                <div class="text-surface-500 text-xs mb-1">إجمالي العمولة</div>
                                <div class="text-orange-500 font-bold text-lg">{{ summary.subscriptions.commission | currency: 'USD' : 'symbol' : '1.2-2' }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── Monthly Chart ── -->
                <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-6 mb-6" *ngIf="monthlyChartData">
                    <div class="flex items-center justify-between mb-5">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-chart-line text-primary-500 text-xl"></i>
                            <span class="text-surface-900 dark:text-surface-0 font-bold text-lg">الإيرادات الشهرية — {{ selectedYear }}</span>
                        </div>
                    </div>
                    <p-chart type="bar" [data]="monthlyChartData" [options]="chartOptions" height="320px"></p-chart>
                </div>

                <!-- ── Drivers Table ── -->
                <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl overflow-hidden" *ngIf="drivers.length > 0">
                    <div class="p-5 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2 bg-surface-50 dark:bg-surface-800/50">
                        <i class="pi pi-users text-primary-500 text-xl"></i>
                        <span class="text-surface-900 dark:text-surface-0 font-bold text-lg">تقرير السائقين</span>
                    </div>
                    <p-table [value]="drivers" [rowHover]="true" styleClass="p-datatable-sm" [tableStyle]="{ 'min-width': '50rem' }">
                        <ng-template #header>
                            <tr>
                                <th class="text-right py-4">السائق</th>
                                <th class="text-right py-4">إجمالي الجمع</th>
                                <th class="text-right py-4">عمولة الشركة</th>
                                <th class="text-right py-4">مدفوع</th>
                                <th class="text-right py-4">متبقي</th>
                                <th class="text-right py-4">الحالة</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-driver>
                            <tr>
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold shrink-0">
                                            <i class="pi pi-user text-sm"></i>
                                        </div>
                                        <span class="font-semibold text-surface-900 dark:text-surface-0">
                                            {{ driver.driverName }}
                                        </span>
                                    </div>
                                </td>
                                <td class="font-medium text-surface-900 dark:text-surface-0">{{ driver.totalCollected | currency: 'USD' : 'symbol' : '1.2-2' }}</td>
                                <td class="text-orange-500 font-bold">{{ driver.totalCommission | currency: 'USD' : 'symbol' : '1.2-2' }}</td>
                                <td class="text-emerald-500 font-medium">{{ driver.totalPaid | currency: 'USD' : 'symbol' : '1.2-2' }}</td>
                                <td>
                                    <span [class]="driver.totalUnpaid > 0 ? 'text-red-500 font-bold' : 'text-surface-500 font-medium'">
                                        {{ driver.totalUnpaid | currency: 'USD' : 'symbol' : '1.2-2' }}
                                    </span>
                                </td>
                                <td>
                                    <p-tag [value]="driver.totalUnpaid > 0 ? 'يوجد مبلغ مستحق' : 'لا توجد مستحقات'"
                                           [severity]="driver.totalUnpaid > 0 ? 'danger' : 'success'"
                                           [icon]="driver.totalUnpaid > 0 ? 'pi pi-exclamation-triangle' : 'pi pi-check-circle'"></p-tag>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </ng-container>
        </div>
    `
})
export class ReportsComponent implements OnInit {
    summary: SummaryReport | null = null;
    monthly: MonthlyReport | null = null;
    drivers: DriverReport[] = [];
    loading = false;

    selectedYear = new Date().getFullYear();
    yearOptions = [2024, 2025, 2026, 2027].map((y) => ({ label: y.toString(), value: y }));

    monthlyChartData: any = null;
    chartOptions: any = {};

    monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    constructor(
        private reportsService: ReportsService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.initChartOptions();
        this.loadAll();
    }

    initChartOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor, font: { size: 12, family: 'inherit' } } },
                tooltip: { mode: 'index' }
            },
            scales: {
                x: {
                    ticks: { color: textColorSecondary, font: { family: 'inherit' } },
                    grid: { color: surfaceBorder, drawBorder: false }
                },
                y: {
                    ticks: { color: textColorSecondary, font: { family: 'inherit' } },
                    grid: { color: surfaceBorder, drawBorder: false }
                }
            }
        };
    }

    loadAll() {
        this.loading = true;
        forkJoin({
            summary: this.reportsService.getSummary(),
            monthly: this.reportsService.getMonthly(this.selectedYear),
            drivers: this.reportsService.getDrivers()
        }).subscribe({
            next: (data) => {
                this.summary = data.summary;
                this.monthly = data.monthly;
                this.drivers = data.drivers;
                this.buildChart();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل التقارير' });
                this.cdr.detectChanges();
            }
        });
    }

    loadMonthly() {
        this.reportsService.getMonthly(this.selectedYear).subscribe({
            next: (data) => {
                this.monthly = data;
                this.buildChart();
                this.cdr.detectChanges();
            }
        });
    }

    buildChart() {
        if (!this.monthly) return;
        const months = this.monthly.months;
        this.monthlyChartData = {
            labels: months.map((m) => this.monthNames[m.month - 1]),
            datasets: [
                {
                    label: 'إيرادات فورية',
                    data: months.map((m) => m.instantRevenue),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
                    borderRadius: 6
                },
                {
                    label: 'إيرادات اشتراكات',
                    data: months.map((m) => m.subRevenue),
                    backgroundColor: 'rgba(168, 85, 247, 0.8)', // purple-500
                    borderRadius: 6
                },
                {
                    label: 'عمولات الشركة',
                    data: months.map((m) => m.totalCommission),
                    backgroundColor: 'rgba(249, 115, 22, 0.8)', // orange-500
                    borderRadius: 6
                }
            ]
        };
    }
}
