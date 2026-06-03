import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ReportsService } from '@/app/pages/service/reports.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, PopoverModule, AppConfigurator, ButtonModule, TagModule, DividerModule],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo flex align-items-center gap-2" routerLink="/">
                    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 45px; height: 45px;">
                        <ellipse cx="250" cy="250" rx="75" ry="165" transform="rotate(0 250 250)" stroke="#0d5c43" stroke-width="12" stroke-linecap="round" />
                        <ellipse cx="250" cy="250" rx="75" ry="165" transform="rotate(45 250 250)" stroke="#0d5c43" stroke-width="12" stroke-linecap="round" />
                        <ellipse cx="250" cy="250" rx="75" ry="165" transform="rotate(90 250 250)" stroke="#0d5c43" stroke-width="12" stroke-linecap="round" />
                        <ellipse cx="250" cy="250" rx="75" ry="165" transform="rotate(135 250 250)" stroke="#0d5c43" stroke-width="12" stroke-linecap="round" />
                        <circle cx="250" cy="250" r="95" stroke="#0d5c43" stroke-width="14" fill="none" />
                    </svg>
                    <span class="makook-title">مكّوك</span>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                        <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                    </button>
                    <div class="relative">
                        <button
                            class="layout-topbar-action layout-topbar-action-highlight"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-palette"></i>
                        </button>
                        <app-configurator />
                    </div>
                </div>

                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <button type="button" class="layout-topbar-action" (click)="subPanel.toggle($event)">
                            <i class="pi pi-calendar"></i>
                            <span>Calendar</span>
                        </button>
                        <p-popover #subPanel [style]="{ width: '320px' }">
                            <div class="flex items-center justify-between mb-3">
                                <span class="font-semibold text-base">تنتهي هاد الشهر</span>
                                <p-tag [value]="expiringCount + ' اشتراك'" severity="danger" *ngIf="expiringCount > 0" />
                                <p-tag value="لا يوجد" severity="success" *ngIf="expiringCount === 0" />
                            </div>

                            <!-- ✅ تفاصيل كل اشتراك -->
                            <div *ngIf="expiringCount > 0" class="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                <div *ngFor="let sub of expiringSubs" class="flex items-center gap-3 p-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                                    <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                        <i class="pi pi-calendar-times text-red-500 text-sm"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="font-medium text-sm truncate">{{ sub.clientName }}</div>
                                        <div class="text-muted-color text-xs">
                                            ينتهي: {{ sub.endDate | date: 'dd/MM/yyyy' }}
                                            <span class="text-red-500 font-bold mr-1">({{ sub.daysLeft }} يوم)</span>
                                        </div>
                                    </div>
                                    <div class="text-green-600 text-xs font-bold shrink-0">
                                        {{ sub.price | currency: 'USD' : 'symbol' : '1.0-0' }}
                                    </div>
                                </div>
                            </div>

                            <div *ngIf="expiringCount === 0" class="text-center py-4 text-muted-color text-sm">
                                <i class="pi pi-check-circle text-green-500 text-2xl block mb-2"></i>
                                لا توجد اشتراكات تنتهي هاد الشهر
                            </div>

                            <div class="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                                <p-button label="عرض كل الاشتراكات" icon="pi pi-arrow-left" [text]="true" size="small" styleClass="w-full" (onClick)="router.navigate(['/uikit/app-Subscription']); subPanel.hide()" />
                            </div>
                        </p-popover>

                        <!-- ✅ زر Messages -->
                        <button type="button" class="layout-topbar-action relative" (click)="activityPanel.toggle($event)">
                            <i class="pi pi-bell"></i>
                            <span>التنبيهات</span>
                            <span *ngIf="activities.length > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {{ activities.length }}
                            </span>
                        </button>

                        <p-popover #activityPanel [style]="{ width: '320px' }">
                            <div class="flex items-center justify-between mb-3">
                                <span class="font-semibold text-base">آخر النشاطات</span>
                                <p-tag [value]="activities.length + ' إشعار'" severity="info" />
                            </div>

                            <div class="flex flex-col gap-2 max-h-64 overflow-y-auto">
                                <div *ngFor="let activity of activities" class="flex items-center gap-3 p-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                                    <div
                                        class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                        [ngClass]="{
                                            'bg-blue-100 dark:bg-blue-900/30': activity.color === 'blue',
                                            'bg-purple-100 dark:bg-purple-900/30': activity.color === 'purple',
                                            'bg-green-100 dark:bg-green-900/30': activity.color === 'green'
                                        }"
                                    >
                                        <i
                                            [class]="activity.icon + ' text-sm'"
                                            [ngClass]="{
                                                'text-blue-500': activity.color === 'blue',
                                                'text-purple-500': activity.color === 'purple',
                                                'text-green-500': activity.color === 'green'
                                            }"
                                        >
                                        </i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="font-medium text-sm">{{ activity.title }}</div>
                                        <div class="text-muted-color text-xs truncate">{{ activity.desc }}</div>
                                    </div>
                                    <div class="text-muted-color text-xs shrink-0">
                                        {{ activity.createdAt | date: 'hh:mm a' }}
                                    </div>
                                </div>
                            </div>
                        </p-popover>

                        <!-- ✅ Profile Button -->
                        <button type="button" class="layout-topbar-action" (click)="profilePanel.toggle($event)">
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>

                        <!-- ✅ Profile Overlay Panel -->
                        <p-popover #profilePanel [style]="{ width: '260px' }">
                            <!-- معلومات المستخدم -->
                            <div class="flex items-center gap-3 mb-4">
                                <!-- ✅ أيقونة شخص بدل Avatar -->
                                <div
                                    class="w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2"
                                    [ngClass]="userRole === 'Admin' ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' : 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'"
                                >
                                    <i class="pi pi-user text-2xl" [ngClass]="userRole === 'Admin' ? 'text-red-500' : 'text-blue-500'"></i>
                                </div>

                                <div class="flex-1 min-w-0">
                                    <!-- ✅ الدور فوق -->
                                    <p-tag [value]="userRole || 'مستخدم'" [severity]="userRole === 'Admin' ? 'danger' : 'info'" class="mb-1" />

                                    <!-- ✅ الاسم -->
                                    <div class="font-bold text-surface-900 dark:text-surface-0 truncate mt-1">{{ userName }}</div>
                                    <!-- ✅ الإيميل -->
                                    <div class="text-muted-color text-xs truncate">{{ userEmail }}</div>
                                </div>
                            </div>

                            <p-divider />

                            <p-button label="تسجيل الخروج" icon="pi pi-sign-out" severity="danger" [outlined]="true" styleClass="w-full" (onClick)="logout(); profilePanel.hide()" />
                        </p-popover>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];
    layoutService = inject(LayoutService);

    userName = '';
    userEmail = '';
    userRole = '';
    expiringSubs: any[] = [];
    expiringCount = 0;
    activities: any[] = [];

    constructor(
        public router: Router,
        private reportsService: ReportsService
    ) {}

    ngOnInit() {
        this.userName = localStorage.getItem('userName') || '';
        this.userEmail = localStorage.getItem('userEmail') || '';
        this.userRole = localStorage.getItem('userRole') || '';
        this.loadData();
    }
    loadData() {
        this.reportsService.getExpiringSubscriptions().subscribe({
            next: (data: any) => {
                this.expiringCount = data.count;
                this.expiringSubs = data.subscriptions; // ✅ احفظ التفاصيل
            }
        });
        this.reportsService.getRecentActivity().subscribe({
            next: (data) => {
                this.activities = data;
            }
        });
    }
    logout() {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }
}
