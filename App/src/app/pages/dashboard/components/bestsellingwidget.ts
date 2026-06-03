import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { ReportsService, DriverReport } from '../../service/reports.service';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule, SkeletonModule],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-6">
                <div class="font-semibold text-xl">أداء السائقين</div>
                <div>
                    <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                    <p-menu #menu [popup]="true" [model]="items"></p-menu>
                </div>
            </div>

            <!-- Loading -->
            <ng-container *ngIf="loading">
                <div *ngFor="let i of [1, 2, 3]" class="mb-6">
                    <p-skeleton height="20px" styleClass="mb-2" />
                </div>
            </ng-container>

            <!-- Data -->
            <ul class="list-none p-0 m-0" *ngIf="!loading">
                <li *ngFor="let driver of drivers" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                            {{ driver.driverName }}
                        </span>
                        <div class="mt-1 text-muted-color text-xs">{{ driver.logsCount }} رحلة · جمع {{ driver.totalCollected | currency: 'USD' : 'symbol' : '1.0-0' }}</div>
                    </div>
                    <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div class="h-full" [class]="driver.totalUnpaid > 0 ? 'bg-orange-500' : 'bg-green-500'" [style.width]="getPaidPercent(driver) + '%'"></div>
                        </div>
                        <span class="ml-4 font-medium" [class]="driver.totalUnpaid > 0 ? 'text-orange-500' : 'text-green-500'"> %{{ getPaidPercent(driver) }} </span>
                    </div>
                </li>

                <!-- Empty -->
                <li *ngIf="drivers.length === 0" class="text-center text-muted-color py-4">لا يوجد سائقون بعد</li>
            </ul>
        </div>
    `
})
export class BestSellingWidget implements OnInit {
    menu: any = null;
    drivers: DriverReport[] = [];
    loading = false;

    items = [{ label: 'تحديث', icon: 'pi pi-fw pi-refresh', command: () => this.loadData() }];

    constructor(
        private reportsService: ReportsService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.reportsService.getDrivers().subscribe({
            next: (data) => {
                this.drivers = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getPaidPercent(driver: DriverReport): number {
        if (driver.totalCommission === 0) return 100;
        return Math.round((driver.totalPaid / driver.totalCommission) * 100);
    }
}
