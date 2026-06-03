import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DriverPaymentLogDTO } from '@/app/Model/driverPaymentLogDTO';
import { DriverPaymentLogService } from '../../service/driverPaymentLog.service';

@Component({
    selector: 'app-driver-payments',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule, ToolbarModule, InputTextModule, InputIconModule, IconFieldModule, SelectModule, TooltipModule, SkeletonModule],
    providers: [MessageService, ConfirmationService, CurrencyPipe, DatePipe],
    template: `
        <p-toast position="top-right"></p-toast>
        <p-confirmDialog></p-confirmDialog>

        <div class="card">
            <!-- Header -->
            <div class="font-semibold text-xl mb-4 flex items-center gap-2">
                <i class="pi pi-wallet text-primary-500 text-2xl"></i>
                سجل مدفوعات السائقين
            </div>
            <p class="text-surface-500 dark:text-surface-400 mb-6">تتبع العمولات والمدفوعات المستحقة بطريقة سهلة ومنظمة</p>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <!-- إجمالي السجلات -->
                <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-4 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                    <div>
                        <div class="text-surface-500 dark:text-surface-400 text-sm mb-1 font-medium">إجمالي السجلات</div>
                        <div class="text-surface-900 dark:text-surface-0 text-2xl font-bold">{{ allLogs.length }}</div>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center text-xl">
                        <i class="pi pi-list"></i>
                    </div>
                </div>

                <!-- غير مدفوعة -->
                <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-4 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                    <div>
                        <div class="text-surface-500 dark:text-surface-400 text-sm mb-1 font-medium">غير مدفوعة</div>
                        <div class="text-red-500 text-2xl font-bold">{{ getUnpaidCount() }}</div>
                    </div>
                    <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center text-xl">
                        <i class="pi pi-clock"></i>
                    </div>
                </div>

                <!-- إجمالي العمولات -->
                <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-4 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                    <div>
                        <div class="text-surface-500 dark:text-surface-400 text-sm mb-1 font-medium">إجمالي العمولات</div>
                        <div class="text-emerald-500 text-xl font-bold">{{ getTotalCommission() | currency: 'USD' : 'symbol' : '1.2-2' }}</div>
                    </div>
                    <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center text-xl">
                        <i class="pi pi-money-bill"></i>
                    </div>
                </div>

                <!-- مدفوع للشركة -->
                <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm rounded-xl p-4 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                    <div>
                        <div class="text-surface-500 dark:text-surface-400 text-sm mb-1 font-medium">مدفوع للشركة</div>
                        <div class="text-primary-500 text-xl font-bold">{{ getPaidCommission() | currency: 'USD' : 'symbol' : '1.2-2' }}</div>
                    </div>
                    <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center text-xl">
                        <i class="pi pi-check-circle"></i>
                    </div>
                </div>
            </div>

            <!-- Toolbar -->
            <p-toolbar styleClass="mb-6">
                <ng-template #start>
                    <div class="flex flex-wrap items-center gap-3">
                        <p-select [options]="typeOptions" [(ngModel)]="selectedType" optionLabel="name" optionValue="value" placeholder="كل الأنواع" [showClear]="true" (onChange)="applyFilters()" styleClass="w-full sm:w-48"></p-select>
                        <p-select [options]="statusOptions" [(ngModel)]="selectedStatus" optionLabel="name" optionValue="value" placeholder="كل الحالات" [showClear]="true" (onChange)="applyFilters()" styleClass="w-full sm:w-48"></p-select>
                    </div>
                </ng-template>
                <ng-template #end>
                    <div class="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
                        <p-iconfield class="w-full sm:w-64">
                            <p-inputicon styleClass="pi pi-search" />
                            <input pInputText type="text" [(ngModel)]="searchQuery" (input)="applyFilters()" placeholder="بحث بالسائق..." class="w-full rounded-full" />
                        </p-iconfield>
                        <p-button icon="pi pi-refresh" [rounded]="true" severity="secondary" pTooltip="تحديث البيانات" (onClick)="loadData()" [loading]="loading"></p-button>
                    </div>
                </ng-template>
            </p-toolbar>

            <!-- Table -->
            <p-table
                #dt
                [value]="filteredLogs"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[10, 20, 50]"
                [rowHover]="true"
                [loading]="loading"
                dataKey="id"
                [tableStyle]="{ 'min-width': '75rem' }"
                currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords}"
                [showCurrentPageReport]="true"
            >
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="driverName" class="text-right">السائق <p-sortIcon field="driverName"></p-sortIcon></th>
                        <th pSortableColumn="paymentType" class="text-right">النوع <p-sortIcon field="paymentType"></p-sortIcon></th>
                        <th pSortableColumn="totalCollected" class="text-right">المبلغ الكلي <p-sortIcon field="totalCollected"></p-sortIcon></th>
                        <th pSortableColumn="commissionAmount" class="text-right">عمولة الشركة <p-sortIcon field="commissionAmount"></p-sortIcon></th>
                        <th pSortableColumn="driverNet" class="text-right">صافي السائق <p-sortIcon field="driverNet"></p-sortIcon></th>
                        <th pSortableColumn="createdAt" class="text-right">التاريخ <p-sortIcon field="createdAt"></p-sortIcon></th>
                        <th pSortableColumn="isPaid" class="text-right">الحالة <p-sortIcon field="isPaid"></p-sortIcon></th>
                        <th class="text-center">إجراء</th>
                    </tr>
                </ng-template>

                <ng-template #body let-log>
                    <tr>
                        <!-- السائق -->
                        <td>
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold shrink-0">
                                    {{ log.driverName?.charAt(0) || '?' }}
                                </div>
                                <span class="font-semibold text-surface-900 dark:text-surface-0">{{ log.driverName || '—' }}</span>
                            </div>
                        </td>

                        <!-- النوع -->
                        <td>
                            <p-tag [value]="log.paymentType === 'Instant' ? 'طلب فوري' : 'اشتراك' + (log.subscriptionMonth ? ' — ' + log.subscriptionMonth + '/' + log.subscriptionYear : '')" [severity]="getTypeSeverity(log.paymentType)"></p-tag>
                        </td>

                        <!-- المبلغ الكلي -->
                        <td>
                            <span class="font-semibold text-surface-900 dark:text-surface-0">
                                {{ log.totalCollected | currency: 'USD' : 'symbol' : '1.2-2' }}
                            </span>
                        </td>

                        <!-- عمولة الشركة -->
                        <td>
                            <span class="text-emerald-500 font-bold block mb-1">
                                {{ log.commissionAmount | currency: 'USD' : 'symbol' : '1.2-2' }}
                            </span>
                            <span class="text-surface-500 text-xs bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded">
                                {{ getCommissionPercent(log) }}
                            </span>
                        </td>

                        <!-- صافي السائق -->
                        <td>
                            <span class="text-surface-600 dark:text-surface-300 font-medium">
                                {{ log.driverNet | currency: 'USD' : 'symbol' : '1.2-2' }}
                            </span>
                        </td>

                        <!-- التاريخ -->
                        <td>
                            <div class="text-surface-900 dark:text-surface-0 mb-1 font-medium">{{ log.createdAt | date: 'dd/MM/yyyy' }}</div>
                            <div class="text-surface-500 text-xs">{{ log.createdAt | date: 'hh:mm a' }}</div>
                        </td>

                        <!-- الحالة -->
                        <td>
                            <p-tag [value]="log.isPaid ? 'مدفوع' : 'غير مدفوع'" [severity]="getStatusSeverity(log.isPaid)" [icon]="log.isPaid ? 'pi pi-check-circle' : 'pi pi-clock'"></p-tag>
                            <div *ngIf="log.isPaid && log.paidAt" class="text-surface-500 text-xs mt-2">
                                {{ log.paidAt | date: 'dd/MM/yyyy' }}
                            </div>
                        </td>

                        <!-- إجراء -->
                        <td class="text-center">
                            <p-button *ngIf="!log.isPaid" label="تسجيل الدفع" icon="pi pi-check" size="small" severity="success" [outlined]="true" [rounded]="true" (onClick)="confirmMarkAsPaid(log)" pTooltip="تسجيل دفع السائق للشركة"></p-button>
                            <span *ngIf="log.isPaid" class="text-surface-400 text-sm font-medium">—</span>
                        </td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="8" class="text-center py-16">
                            <div class="flex flex-col items-center justify-center">
                                <i class="pi pi-inbox text-4xl text-surface-400 mb-4"></i>
                                <span class="text-surface-500">لا توجد سجلات سلعرضها</span>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class DriverPaymentsComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    allLogs: DriverPaymentLogDTO[] = [];
    filteredLogs: DriverPaymentLogDTO[] = [];
    loading = false;

    // Filters
    searchQuery = '';
    selectedType: string | null = null;
    selectedStatus: string | null = null;

    typeOptions = [
        { name: 'طلب فوري', value: 'Instant' },
        { name: 'اشتراك', value: 'Subscription' }
    ];

    statusOptions = [
        { name: 'مدفوع', value: 'paid' },
        { name: 'غير مدفوع', value: 'unpaid' }
    ];

    constructor(
        private paymentService: DriverPaymentLogService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.paymentService.loadAll().subscribe({
            next: (data: any) => {
                this.allLogs = data;
                this.applyFilters();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: 'فشل تحميل البيانات'
                });
                this.cdr.detectChanges();
            }
        });
    }

    applyFilters() {
        let result = [...this.allLogs];

        if (this.searchQuery.trim()) {
            const q = this.searchQuery.toLowerCase();
            result = result.filter((l) => l.driverName?.toLowerCase().includes(q));
        }

        if (this.selectedType) {
            result = result.filter((l) => l.paymentType === this.selectedType);
        }

        if (this.selectedStatus === 'paid') {
            result = result.filter((l) => l.isPaid);
        } else if (this.selectedStatus === 'unpaid') {
            result = result.filter((l) => !l.isPaid);
        }

        this.filteredLogs = result;
        this.cdr.detectChanges();
    }

    confirmMarkAsPaid(log: DriverPaymentLogDTO) {
        this.confirmationService.confirm({
            message: `هل تريد تسجيل دفع عمولة ${log.commissionAmount.toFixed(2)}$ من ${log.driverName}؟`,
            header: 'تأكيد الدفع',
            icon: 'pi pi-check-circle',
            acceptLabel: 'نعم، تأكيد',
            rejectLabel: 'إلغاء',

            accept: () => this.markAsPaid(log)
        });
    }

    markAsPaid(log: DriverPaymentLogDTO) {
        this.paymentService.markAsPaid(log.id).subscribe({
            next: () => {
                // ✅ تحديث السجل مباشرة بدون reload كامل
                const index = this.allLogs.findIndex((l) => l.id === log.id);
                if (index !== -1) {
                    this.allLogs[index].isPaid = true;
                    this.allLogs[index].paidAt = new Date();
                }
                this.applyFilters();
                this.messageService.add({
                    severity: 'success',
                    summary: 'تم',
                    detail: `تم تسجيل دفع ${log.driverName} بنجاح`
                });
            },
            error: (err: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: err?.error?.message || 'فشلت عملية الدفع'
                });
            }
        });
    }

    // Stats helpers
    getUnpaidCount(): number {
        return this.allLogs.filter((l) => !l.isPaid).length;
    }

    getTotalCommission(): number {
        return this.allLogs.reduce((sum, l) => sum + l.commissionAmount, 0);
    }

    getPaidCommission(): number {
        return this.allLogs.filter((l) => l.isPaid).reduce((sum, l) => sum + l.commissionAmount, 0);
    }

    getCommissionPercent(log: DriverPaymentLogDTO): string {
        if (!log.totalCollected || log.totalCollected === 0) return '0%';
        return ((log.commissionAmount / log.totalCollected) * 100).toFixed(0) + '%';
    }

    // UI Helpers for Tags
    getTypeSeverity(type: string): 'info' | 'secondary' | 'success' | 'warn' | 'danger' | 'contrast' {
        return type === 'Instant' ? 'info' : 'success';
    }

    getStatusSeverity(isPaid: boolean): 'success' | 'danger' {
        return isPaid ? 'success' : 'danger';
    }
}
