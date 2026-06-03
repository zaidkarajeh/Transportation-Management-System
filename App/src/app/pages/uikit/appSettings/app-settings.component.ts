import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

// Service
import { AppSettingService } from '../../service/app-setting.service';
import { AppSettingDTO } from '@/app/Model/AppSettingDTO';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputGroupModule, InputGroupAddonModule, ToastModule, SkeletonModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast position="top-right" />

        <div class="card">
            <!-- Header -->
            <div class="mb-6">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0 tracking-tight">إعدادات النظام</h1>
                </div>
                <p class="text-surface-500 dark:text-surface-400 text-sm mr-5">تحكم بنسب العمولة وإعدادات التطبيق</p>
            </div>

            <!-- Loading Skeleton -->
            <div *ngIf="loading" class="flex flex-col gap-4">
                <p-skeleton height="80px" styleClass="rounded-xl" *ngFor="let i of [1, 2]" />
            </div>

            <!-- Settings Cards -->
            <div *ngIf="!loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    *ngFor="let setting of settings"
                    class="bg-surface-0 dark:bg-surface-900 border rounded-xl p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
                    [ngClass]="editingId === setting.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-surface-200 dark:border-surface-700'"
                >
                    <div class="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-6">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
                                <i class="pi pi-cog text-blue-600 dark:text-blue-400 text-xl"></i>
                            </div>
                            <div>
                                <!-- الوصف -->
                                <div class="text-surface-900 dark:text-surface-0 text-base font-bold mb-1 leading-tight">{{ setting.description || setting.key }}</div>
                                <!-- المفتاح -->
                                <div class="text-xs text-surface-500 font-mono flex items-center gap-1"><i class="pi pi-key text-[10px]"></i> {{ setting.key }}</div>
                            </div>
                        </div>
                        <!-- آخر تحديث -->
                        <div
                            class="text-surface-500 dark:text-surface-400 text-[10px] flex items-center gap-1 bg-surface-50 dark:bg-surface-800 px-2 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 whitespace-nowrap xl:self-start"
                        >
                            <i class="pi pi-clock text-[10px]"></i>
                            {{ setting.updatedAt | date: 'dd/MM/yyyy hh:mm a' }}
                        </div>
                    </div>

                    <!-- القيمة -->
                    <div class="flex flex-col xl:flex-row xl:items-center gap-4 bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-100 dark:border-surface-700/50 mt-auto">
                        <div class="flex-1 w-full">
                            <p-inputgroup>
                                <p-inputgroup-addon>
                                    <i class="pi pi-percentage text-blue-500"></i>
                                </p-inputgroup-addon>
                                <input
                                    pInputText
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    [(ngModel)]="setting.value"
                                    [disabled]="editingId !== setting.id"
                                    class="font-mono text-center w-full"
                                    [ngClass]="editingId === setting.id ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-surface-900 dark:text-surface-0'"
                                />
                                <!-- عرض النسبة المئوية -->
                                <p-inputgroup-addon>
                                    <span class="text-blue-600 dark:text-blue-400 font-bold min-w-[3rem] text-center"> {{ (+setting.value * 100).toFixed(0) }}% </span>
                                </p-inputgroup-addon>
                            </p-inputgroup>
                        </div>

                        <!-- أزرار التعديل -->
                        <div class="flex gap-2 shrink-0 justify-end">
                            <!-- زر التعديل -->
                            <p-button *ngIf="editingId !== setting.id" icon="pi pi-pencil" label="تعديل" [outlined]="true" severity="info" (onClick)="startEdit(setting)" />

                            <!-- زر الحفظ -->
                            <p-button *ngIf="editingId === setting.id" icon="pi pi-check" label="حفظ" severity="success" [loading]="savingId === setting.id" (onClick)="save(setting)" />

                            <!-- زر الإلغاء -->
                            <p-button *ngIf="editingId === setting.id" icon="pi pi-times" label="إلغاء" [outlined]="true" severity="secondary" (onClick)="cancelEdit(setting)" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Refresh -->
            <div *ngIf="!loading" class="flex justify-end mt-6">
                <p-button icon="pi pi-refresh" label="تحديث البيانات" [outlined]="true" severity="secondary" (onClick)="loadData()" />
            </div>
        </div>
    `
})
export class AppSettingsComponent implements OnInit {
    settings: AppSettingDTO[] = [];
    originalValues: Map<string, string> = new Map(); // لحفظ القيمة القديمة عند الإلغاء
    loading = false;
    editingId: string | null = null;
    savingId: string | null = null;

    constructor(
        private settingService: AppSettingService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.settingService.loadAll().subscribe({
            next: (data) => {
                this.settings = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: 'فشل تحميل الإعدادات'
                });
                this.cdr.detectChanges();
            }
        });
    }

    startEdit(setting: AppSettingDTO) {
        // احفظ القيمة القديمة في حال الإلغاء
        this.originalValues.set(setting.id, setting.value);
        this.editingId = setting.id;
    }

    cancelEdit(setting: AppSettingDTO) {
        // رجّع القيمة القديمة
        const original = this.originalValues.get(setting.id);
        if (original !== undefined) setting.value = original;
        this.editingId = null;
    }
    save(setting: AppSettingDTO) {
        this.savingId = setting.id;

        const percentage = (+setting.value * 100).toFixed(0);

        const dtoToSend = {
            ...setting,
            value: String(setting.value),
            description: setting.description?.replace(/\d+%/, `${percentage}%`)
        };

        this.settingService.update(dtoToSend).subscribe({
            next: () => {
                // ✅ حدّث الوصف بالـ UI كمان
                setting.description = dtoToSend.description;
                setting.updatedAt = new Date().toISOString() as any;
                this.editingId = null;
                this.savingId = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'تم',
                    detail: 'تم تحديث الإعداد بنجاح'
                });
                this.cdr.detectChanges();
            },
            error: () => {
                this.savingId = null;
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: 'فشل تحديث الإعداد'
                });
                this.cdr.detectChanges();
            }
        });
    }
}
