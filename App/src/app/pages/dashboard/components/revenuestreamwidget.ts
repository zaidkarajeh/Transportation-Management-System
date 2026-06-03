import { afterNextRender, Component, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/app/layout/service/layout.service';
import { ReportsService } from '../../service/reports.service';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule],
    template: `<div class="card mb-8!">
        <div class="font-semibold text-xl mb-4">الإيرادات الشهرية</div>
        <p-chart type="bar" [data]="chartData()" [options]="chartOptions()" class="h-100" />
    </div>`
})
export class RevenueStreamWidget {
    layoutService = inject(LayoutService);

    chartData = signal<any>(null);
    chartOptions = signal<any>(null);

    // البيانات الحقيقية من السيرفر
    monthlyData: any[] = [];

    monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    constructor(private reportsService: ReportsService) {
        afterNextRender(() => {
            this.loadAndInit();
        });

        effect(() => {
            this.layoutService.layoutConfig().darkTheme;
            if (this.monthlyData.length > 0) {
                setTimeout(() => this.initChart(), 150);
            }
        });
    }

    loadAndInit() {
        const year = new Date().getFullYear();
        this.reportsService.getMonthly(year).subscribe({
            next: (data) => {
                this.monthlyData = data.months;
                setTimeout(() => this.initChart(), 150);
            }
        });
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        const labels = this.monthlyData.map((m) => this.monthNames[m.month - 1]);
        const instant = this.monthlyData.map((m) => m.instantRevenue);
        const sub = this.monthlyData.map((m) => m.subRevenue);
        const comm = this.monthlyData.map((m) => m.totalCommission);

        this.chartData.set({
            labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'طلبات فورية',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                    data: instant,
                    barThickness: 32
                },
                {
                    type: 'bar',
                    label: 'اشتراكات',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                    data: sub,
                    barThickness: 32
                },
                {
                    type: 'bar',
                    label: 'عمولات',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                    data: comm,
                    borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
                    borderSkipped: false,
                    barThickness: 32
                }
            ]
        });

        this.chartOptions.set({
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: { color: textMutedColor },
                    grid: { color: 'transparent', borderColor: 'transparent' }
                },
                y: {
                    stacked: true,
                    ticks: { color: textMutedColor },
                    grid: { color: borderColor, borderColor: 'transparent', drawTicks: false }
                }
            }
        });
    }
}
