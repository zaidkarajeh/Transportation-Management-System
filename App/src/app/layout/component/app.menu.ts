import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    isAdmin = localStorage.getItem('userRole') === 'Admin'; // ✅ أضف هاد

    ngOnInit() {
        this.model = [
            {
                label: 'الرئيسية',
                items: [{ label: 'الرئيسية', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'مكونات الواجهة',
                items: [
                    { label: 'السائقين', icon: 'pi pi-car', routerLink: ['/uikit/app-drivers'] },
                    { label: 'العملاء', icon: 'pi pi-users', routerLink: ['/uikit/app-client'] },
                    { label: 'الطلبات الفورية', icon: 'pi pi-bolt', routerLink: ['/uikit/app-instant-order'] },
                    { label: 'ادارة الاشتراكات', icon: 'pi pi-sitemap', routerLink: ['/uikit/app-Subscription'] }
                ]
            },
            {
                label: 'المالية والمحاسبة',
                visible: this.isAdmin, // ✅ القسم كله مخفي للـ Employee
                items: [
                    { label: 'دفعات السائقين', icon: 'pi pi-fw pi-wallet', routerLink: ['/uikit/app-driver-payments'] },
                    { label: 'التقارير', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/app-reports'] }
                ]
            },
            {
                label: 'إدارة النظام',
                visible: this.isAdmin, // ✅ القسم كله مخفي للـ Employee
                items: [
                    { label: 'الإعدادات', icon: 'pi pi-fw pi-cog', routerLink: ['/uikit/app-settings'] },
                    { label: 'إدارة الحسابات', icon: 'pi pi-fw pi-users', routerLink: ['/uikit/app-account-management'] }
                ]
            }
        ];
    }
}
