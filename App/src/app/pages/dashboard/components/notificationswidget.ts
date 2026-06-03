import { afterNextRender, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { LayoutService } from '@/app/layout/service/layout.service';
import { ReportsService } from '../../service/reports.service';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [CommonModule, ChartModule, ButtonModule, MenuModule],
    template: `
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <div class="font-semibold text-xl">توزيع الإيرادات</div>
                <div>
                    <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                    <p-menu #menu [popup]="true" [model]="items"></p-menu>
                </div>
            </div>

            <!-- Chart -->
            <p-chart type="doughnut" [data]="chartData()" [options]="chartOptions()" class="h-64 flex justify-center" />

            <!-- Legend -->
            <div class="flex flex-col gap-3 mt-6" *ngIf="summary">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-muted-color text-sm">طلبات فورية</span>
                    </div>
                    <span class="text-surface-900 dark:text-surface-0 font-bold text-sm">
                        {{ summary.instantOrders.revenue | currency: 'USD' : 'symbol' : '1.0-0' }}
                    </span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-muted-color text-sm">اشتراكات</span>
                    </div>
                    <span class="text-surface-900 dark:text-surface-0 font-bold text-sm">
                        {{ summary.subscriptions.revenue | currency: 'USD' : 'symbol' : '1.0-0' }}
                    </span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-muted-color text-sm">عمولات الشركة</span>
                    </div>
                    <span class="text-surface-900 dark:text-surface-0 font-bold text-sm">
                        {{ summary.totals.commission | currency: 'USD' : 'symbol' : '1.0-0' }}
                    </span>
                </div>
            </div>
        </div>
    `
})
export class NotificationsWidget {
    layoutService = inject(LayoutService);

    chartData = signal<any>(null);
    chartOptions = signal<any>(null);
    summary: any = null;

    items = [{ label: 'تحديث', icon: 'pi pi-fw pi-refresh', command: () => this.loadData() }];

    constructor(private reportsService: ReportsService) {
        afterNextRender(() => {
            this.loadData();
        });

        effect(() => {
            this.layoutService.layoutConfig().darkTheme;
            if (this.summary) {
                setTimeout(() => this.initChart(), 150);
            }
        });
    }

    loadData() {
        this.reportsService.getSummary().subscribe({
            next: (data) => {
                this.summary = data;
                setTimeout(() => this.initChart(), 150);
            }
        });
    }

    initChart() {
        if (!this.summary) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.chartData.set({
            labels: ['طلبات فورية', 'اشتراكات', 'عمولات'],
            datasets: [
                {
                    data: [this.summary.instantOrders.revenue, this.summary.subscriptions.revenue, this.summary.totals.commission],
                    backgroundColor: [documentStyle.getPropertyValue('--p-blue-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-emerald-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--p-blue-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-emerald-400')],
                    borderWidth: 2,
                    borderColor: documentStyle.getPropertyValue('--surface-card')
                }
            ]
        });

        this.chartOptions.set({
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => ` $${ctx.parsed.toLocaleString()}`
                    }
                }
            }
        });
    }
}
