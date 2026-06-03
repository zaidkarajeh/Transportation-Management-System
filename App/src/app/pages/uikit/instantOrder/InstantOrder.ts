import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { Message } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DataView } from 'primeng/dataview';
import { TableModule, Table } from 'primeng/table';

// Services & Models
import { InstantOrderDTO } from '@/app/Model/InstantOrderDTO';
import { InstantOrderService } from '../../service/instantOrder.service';
import { ClientService } from '../../service/client.service';
import { DriverService } from '../../service/driver.service';
import { DriveDTO } from '@/app/Model/driveDTO';
import { ClientDTO } from '@/app/Model/clientDTO';
import { NotificationService } from '@/app/shared/services/notification.service';

@Component({
    selector: 'app-instant-order',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        ToolbarModule,
        InputGroupAddon,
        InputGroup,
        Message,
        ReactiveFormsModule,
        FormsModule,
        SelectModule,
        TagModule,
        TooltipModule,
        InputIconModule,
        IconFieldModule,
        DataView,
        TableModule
    ],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">الطلبات الفورية</div>

            <p-dataview [value]="allOrders" [layout]="layout" [paginator]="layout === 'list'" [rows]="10" [showCurrentPageReport]="true" currentPageReportTemplate="عرض {first} إلى {last} من أصل {totalRecords} طلب" [rowsPerPageOptions]="[10, 20, 30]">
                <ng-template #header>
                    <div class="flex justify-between items-center mb-4">
                        <!-- Card Size Toggle (Only in Grid Layout) -->
                        <div class="flex items-center gap-1 bg-surface-100/70 dark:bg-surface-800/70 backdrop-blur-md p-1.5 rounded-full shadow-inner border border-surface-200 dark:border-surface-700" [class.invisible]="layout !== 'grid'">
                            <!-- Compact View -->
                            <button
                                type="button"
                                (click)="cardViewMode = 'compact'"
                                class="px-4 py-2 rounded-full transition-all duration-300 ease-out flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-95 group"
                                [ngClass]="
                                    cardViewMode === 'compact'
                                        ? 'bg-white dark:bg-surface-900 text-primary-600 dark:text-primary-400 shadow-sm border border-surface-100 dark:border-surface-700/50'
                                        : 'text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-100 hover:bg-surface-200/50 dark:hover:bg-surface-700/50 text-opacity-80'
                                "
                                title="عرض مدمج (بطاقات صغيرة)"
                            >
                                <i class="pi pi-th-large text-sm transition-transform duration-300" [ngClass]="cardViewMode === 'compact' ? 'scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5'"></i>
                            </button>

                            <!-- Expanded View -->
                            <button
                                type="button"
                                (click)="cardViewMode = 'expanded'"
                                class="px-4 py-2 rounded-full transition-all duration-300 ease-out flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-95 group"
                                [ngClass]="
                                    cardViewMode === 'expanded'
                                        ? 'bg-white dark:bg-surface-900 text-primary-600 dark:text-primary-400 shadow-sm border border-surface-100 dark:border-surface-700/50'
                                        : 'text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-100 hover:bg-surface-200/50 dark:hover:bg-surface-700/50 text-opacity-80'
                                "
                                title="عرض مفصل (بطاقات كبيرة)"
                            >
                                <i class="pi pi-list text-sm transition-transform duration-300" [ngClass]="cardViewMode === 'expanded' ? 'scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5'"></i>
                            </button>
                        </div>

                        <!-- حاوية الأزرار مع تأثير الزجاج وظل داخلي -->
                        <div class="flex items-center gap-1 bg-surface-100/70 dark:bg-surface-800/70 backdrop-blur-md p-1.5 rounded-full shadow-inner border border-surface-200 dark:border-surface-700">
                            <!-- زر القائمة (List) -->
                            <button
                                type="button"
                                (click)="layout = 'list'"
                                class="px-6 py-2 rounded-full transition-all duration-300 ease-out flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-95 group"
                                [ngClass]="
                                    layout === 'list'
                                        ? 'bg-white dark:bg-surface-900 text-primary-600 dark:text-primary-400 shadow-sm border border-surface-100 dark:border-surface-700/50'
                                        : 'text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-100 hover:bg-surface-200/50 dark:hover:bg-surface-700/50 text-opacity-80'
                                "
                                title="عرض كقائمة"
                            >
                                <i class="pi pi-bars text-lg transition-transform duration-300" [ngClass]="layout === 'list' ? 'scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5'"></i>
                            </button>

                            <!-- زر تعيين السائقين (Assign) -->
                            <button
                                type="button"
                                (click)="layout = 'grid'"
                                class="px-6 py-2 rounded-full transition-all duration-300 ease-out flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-95 group"
                                [ngClass]="
                                    layout === 'grid'
                                        ? 'bg-white dark:bg-surface-900 text-primary-600 dark:text-primary-400 shadow-sm border border-surface-100 dark:border-surface-700/50'
                                        : 'text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-100 hover:bg-surface-200/50 dark:hover:bg-surface-700/50 text-opacity-80'
                                "
                                title="تعيين السائقين"
                            >
                                <i class="pi pi-arrows-alt text-lg transition-transform duration-300" [ngClass]="layout === 'grid' ? 'scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5'"></i>
                            </button>
                        </div>
                    </div>

                    <p-toolbar styleClass="mb-6">
                        <ng-template #start>
                            <p-button
                                [severity]="!selectedOrders || selectedOrders.length < 2 ? 'secondary' : 'danger'"
                                [outlined]="!selectedOrders || selectedOrders.length < 2"
                                label="حذف المحدد"
                                icon="pi pi-trash"
                                class="ml-2"
                                (onClick)="deleteSelectedOrders()"
                                [disabled]="!selectedOrders || selectedOrders.length < 2"
                            />
                            <p-button label="طلب جديد" icon="pi pi-plus" severity="success" (onClick)="openNew()" />
                        </ng-template>

                        <ng-template #end>
                            <p-iconfield class="w-full sm:w-64 md:w-80">
                                <p-inputicon styleClass="pi pi-search"></p-inputicon>
                                <input #filterInput type="text" pInputText placeholder="بحث شامل..." [(ngModel)]="searchQuery" (input)="onGlobalSearch()" class="w-full rounded-full" />
                                <p-inputicon *ngIf="searchQuery" styleClass="pi pi-times cursor-pointer text-gray-400 hover:text-red-500" (click)="clearSearch(filterInput)" />
                            </p-iconfield>
                        </ng-template>
                    </p-toolbar>
                </ng-template>

                <!-- LIST TEMPLATE (TABLE) -->
                <ng-template #list let-items>
                    <p-table #dt [value]="allOrders" [(selection)]="selectedOrders" [paginator]="false" [rows]="10" [tableStyle]="{ 'min-width': '75rem' }" [rowHover]="true" dataKey="id">
                        <ng-template #header>
                            <tr>
                                <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
                                <th pSortableColumn="clientName" style="min-width:14rem">اسم العميل <p-sortIcon field="clientName" /></th>
                                <th pSortableColumn="driverName" style="min-width:12rem">الكابتن <p-sortIcon field="driverName" /></th>
                                <th pSortableColumn="pickupAddress" style="min-width:12rem">الانطلاق <p-sortIcon field="pickupAddress" /></th>
                                <th pSortableColumn="dropoffAddress" style="min-width:12rem">الوصول <p-sortIcon field="dropoffAddress" /></th>
                                <th pSortableColumn="pickupTime" style="min-width:12rem">الوقت <p-sortIcon field="pickupTime" /></th>
                                <th pSortableColumn="pickupTime" style="min-width:12rem">التاريخ <p-sortIcon field="pickupTime" /></th>

                                <th pSortableColumn="price" style="min-width:8rem">السعر <p-sortIcon field="price" /></th>
                                <th pSortableColumn="status" style="min-width:12rem">الحالة <p-sortIcon field="status" /></th>
                                <th style="min-width: 8rem">العمليات</th>
                            </tr>
                        </ng-template>

                        <ng-template #body let-order>
                            <tr>
                                <td><p-tableCheckbox [value]="order" /></td>
                                <td class="font-medium text-surface-900 dark:text-surface-0">{{ order.clientName }}</td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <span *ngIf="order.driverName">{{ order.driverName }}</span>
                                        <p-tag *ngIf="!order.driverName" value="غير معين" severity="warn"></p-tag>
                                    </div>
                                </td>
                                <td>
                                    <span class="truncate block max-w-[150px]">{{ order.pickupAddress }}</span>
                                </td>
                                <td>
                                    <span class="truncate block max-w-[150px]">{{ order.dropoffAddress }}</span>
                                </td>
                                <td class="text-sm text-surface-500">
                                    <span class="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-700">
                                        <i class="pi pi-clock text-xs text-primary-500"></i>
                                        {{ formatTime12h(order.pickupTime) }}
                                    </span>
                                </td>
                                <td class="text-sm text-surface-500">
                                    <span class="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-700">
                                        <i class="pi pi-calendar text-xs text-primary-500"></i>
                                        {{ order.pickupTime | date: 'yyyy-MM-dd' }}
                                    </span>
                                </td>
                                <td class="font-bold text-green-600 dark:text-green-400">{{ order.price | currency: 'USD' }}</td>
                                <td>
                                    <span [ngClass]="getStatusBadgeClass(order.status)" class="px-2 py-1 rounded-md text-xs">{{ order.status }}</span>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" severity="info" (onClick)="editOrder(order.id)"></p-button>
                                        <p-button icon="pi pi-trash" [rounded]="true" [outlined]="true" severity="danger" (onClick)="openDeleteConfirmation(order.id)"></p-button>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>

                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="9" class="text-center p-8 text-surface-500">لا توجد طلبات لعرضها.</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </ng-template>

                <!-- GRID TEMPLATE (KANBAN BOARD & DASHBOARD) -->
                <ng-template #grid let-items>
                    <div class="flex flex-col gap-6 p-2 w-full">
                        <!-- Lightweight Dashboard -->
                        <div class="grid grid-cols-1 md:grid-cols-5 gap-5">
                            <div class="bg-surface-0 dark:bg-surface-900 p-4 border rounded-xl border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-between">
                                <div>
                                    <span class="block text-surface-500 text-sm font-medium mb-1">إجمالي الطلبات</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">{{ allOrders.length }}</div>
                                </div>
                                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <i class="pi pi-list text-blue-600 dark:text-blue-400 text-xl"></i>
                                </div>
                            </div>
                            <div class="bg-surface-0 dark:bg-surface-900 p-4 border rounded-xl border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-between">
                                <div>
                                    <span class="block text-surface-500 text-sm font-medium mb-1">بانتظار سائق</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">{{ getOrdersCountByStatus('بانتظار تأمين سائق') }}</div>
                                </div>
                                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <i class="pi pi-clock text-orange-600 dark:text-orange-400 text-xl"></i>
                                </div>
                            </div>
                            <div class="bg-surface-0 dark:bg-surface-900 p-4 border rounded-xl border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-between">
                                <div>
                                    <span class="block text-surface-500 text-sm font-medium mb-1">قيد المراجعة</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">{{ getOrdersCountByStatus('قيد المراجعة') }}</div>
                                </div>
                                <div class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <i class="pi pi-clock text-purple-600 dark:text-purple-400 text-xl"></i>
                                </div>
                            </div>
                            <div class="bg-surface-0 dark:bg-surface-900 p-4 border rounded-xl border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-between">
                                <div>
                                    <span class="block text-surface-500 text-sm font-medium mb-1">تم التوصيل</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">{{ getOrdersCountByStatus('تم التوصيل') }}</div>
                                </div>
                                <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <i class="pi pi-check-circle text-green-600 dark:text-green-400 text-xl"></i>
                                </div>
                            </div>
                            <div class="bg-surface-0 dark:bg-surface-900 p-4 border rounded-xl border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-between">
                                <div>
                                    <span class="block text-surface-500 text-sm font-medium mb-1">ملغي</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">{{ getOrdersCountByStatus('ملغي') }}</div>
                                </div>
                                <div class="w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-lg">
                                    <i class="pi pi-times-circle text-red-600 dark:text-red-400 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <!-- Kanban Board -->
                        <div class="flex gap-4 overflow-x-auto pb-4 items-start w-full">
                            <div
                                *ngFor="let col of kanbanColumns"
                                class="min-w-[250px] w-[250px] bg-surface-50 dark:bg-surface-800 rounded-xl p-3 border border-surface-200 dark:border-surface-700 flex flex-col gap-3 transition-colors duration-200"
                                (dragover)="onColumnDragOver($event, col.status)"
                                (dragleave)="onColumnDragLeave($event)"
                                (drop)="onColumnDrop($event, col.status)"
                                [class.border-primary-500]="dragOverStatus === col.status"
                                [class.bg-primary-50]="dragOverStatus === col.status"
                            >
                                <!-- Column Header -->
                                <div class="flex items-center justify-between px-2 py-1">
                                    <div class="font-bold flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-full" [style.backgroundColor]="getStatusColor(col.status)"></div>
                                        {{ col.title }}
                                    </div>
                                    <p-tag [value]="getOrdersByStatus(items, col.status).length.toString()" [style]="{ 'background-color': getStatusColor(col.status), color: '#ffffff' }"></p-tag>
                                </div>

                                <!-- Cards Container -->
                                <div class="flex flex-col gap-2 flex-1 h-full min-h-[150px]">
                                    <div
                                        *ngFor="let order of getOrdersByStatus(items, col.status)"
                                        class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-3 transition-all hover:shadow-md cursor-grab active:cursor-grabbing relative group"
                                        [class.opacity-50]="draggedOrder?.id === order.id"
                                        draggable="true"
                                        (dragstart)="onOrderDragStart($event, order)"
                                        (dragend)="onOrderDragEnd()"
                                    >
                                        <!-- Order Main Details -->
                                        <div class="flex justify-between items-start mb-2">
                                            <div class="flex flex-col">
                                                <span class="text-[10px] text-surface-500 mb-0.5 flex items-center gap-1"><i class="pi pi-user text-primary-500 text-[10px]"></i> العميل</span>
                                                <span class="font-bold text-base text-surface-900 dark:text-surface-0 leading-tight">{{ order.clientName }}</span>
                                            </div>
                                            <span class="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded text-xs border border-green-200 dark:border-green-800/50">{{
                                                order.price | currency: 'USD'
                                            }}</span>
                                        </div>

                                        <!-- Locations -->
                                        <div *ngIf="cardViewMode === 'expanded'" class="flex flex-col gap-1 mb-2 relative pl-3">
                                            <div class="absolute right-1.5 top-2 bottom-2 w-[2px] bg-surface-200 dark:bg-surface-700 z-0"></div>
                                            <div class="flex items-center gap-2 z-10">
                                                <div class="w-3 h-3 rounded-full border-2 border-blue-500 bg-surface-0 shrink-0"></div>
                                                <span class="text-sm text-surface-700 dark:text-surface-200 truncate" [title]="order.pickupAddress">{{ order.pickupAddress }}</span>
                                            </div>
                                            <div class="flex items-center gap-2 z-10">
                                                <div class="w-3 h-3 rounded-full bg-red-500 shrink-0"></div>
                                                <span class="text-sm text-surface-700 dark:text-surface-200 truncate" [title]="order.dropoffAddress">{{ order.dropoffAddress }}</span>
                                            </div>
                                        </div>

                                        <!-- Info Grid (Time & Passengers) -->
                                        <div *ngIf="cardViewMode === 'expanded'" class="w-full flex justify-between bg-surface-50 dark:bg-surface-800 rounded-lg py-2 px-2 mb-3 border border-surface-200 dark:border-surface-700">
                                            <div class="flex flex-col items-center flex-1">
                                                <span class="text-xs text-surface-500 mb-1 flex items-center gap-1"><i class="pi pi-calendar"></i> التاريخ</span>
                                                <span class="font-bold text-xs text-surface-900 dark:text-surface-0">{{ order.pickupTime | date: 'MM/dd/yyyy' }}</span>
                                            </div>
                                            <div class="w-px bg-surface-200 dark:bg-surface-700 my-1"></div>
                                            <div class="flex flex-col items-center flex-1">
                                                <span class="text-xs text-surface-500 mb-1 flex items-center gap-1"><i class="pi pi-clock"></i> الوقت</span>
                                                <span class="font-bold text-xs text-surface-900 dark:text-surface-0">{{ order.pickupTime | date: 'shortTime' }}</span>
                                            </div>
                                            <div class="w-px bg-surface-200 dark:bg-surface-700 my-1"></div>
                                            <div class="flex flex-col items-center flex-1">
                                                <span class="text-xs text-surface-500 mb-1 flex items-center gap-1"><i class="pi pi-users"></i> الركاب</span>
                                                <span class="font-bold text-xs text-surface-900 dark:text-surface-0">{{ order.passengerCount || 1 }}</span>
                                            </div>
                                        </div>

                                        <!-- Driver Assignment Area -->
                                        <div class="border-surface-100 dark:border-surface-700 mt-auto" [class.border-t]="cardViewMode === 'expanded'" [class.pt-2]="cardViewMode === 'expanded'">
                                            <!-- Interactive Select: Only for Not Assigned -->
                                            <div *ngIf="order.status === 'بانتظار تأمين سائق'" class="flex flex-col gap-1" (mousedown)="$event.stopPropagation()">
                                                <label class="text-xs font-semibold text-surface-500">تعيين كابتن</label>
                                                <p-select
                                                    [options]="getAvailableDrivers()"
                                                    optionLabel="name"
                                                    optionValue="id"
                                                    placeholder="اختر كابتن للتعيين"
                                                    [filter]="true"
                                                    class="w-full text-sm"
                                                    appendTo="body"
                                                    (onChange)="onDriverSelectedInCard($event, order)"
                                                >
                                                </p-select>
                                            </div>

                                            <!-- Static Info: For all other statuses -->
                                            <div *ngIf="order.status !== 'بانتظار تأمين سائق'" class="flex items-center gap-2 bg-surface-50 dark:bg-surface-800 p-2 rounded-lg">
                                                <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 border border-primary-200 dark:border-primary-800">
                                                    <i class="pi pi-car text-primary-600 dark:text-primary-400 text-sm"></i>
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <div class="text-xs text-surface-500">الكابتن المعين</div>
                                                    <div class="text-sm font-bold text-surface-900 dark:text-surface-0 truncate">
                                                        {{ order.driverName || 'لا يوجد كابتن' }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Empty State per column -->
                                    <div
                                        *ngIf="getOrdersByStatus(items, col.status).length === 0"
                                        class="p-4 text-center border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl text-surface-400 text-sm bg-surface-0/50 dark:bg-surface-900/50"
                                    >
                                        اسحب الطلبات هنا
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
        </div>

        <p-dialog [(visible)]="orderDialog" [style]="{ width: '600px' }" [header]="isEditMode ? 'تعديل بيانات الطلب' : 'إضافة طلب جديد'" [modal]="true" [draggable]="false" [resizable]="false">
            <ng-template #content>
                <form [formGroup]="orderForm" class="flex flex-col gap-4 mt-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">العميل <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-user"></i></p-inputgroup-addon>
                                <p-select formControlName="txtClientId" [options]="clientOptions" optionLabel="name" optionValue="id" placeholder="اختر العميل" [filter]="true" class="w-full" appendTo="body" />
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtClientId')?.touched && orderForm.get('txtClientId')?.invalid">مطلوب</p-message>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">الكابتن</label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-car"></i></p-inputgroup-addon>
                                <p-select formControlName="txtDriverId" [showClear]="true" [options]="driverOptions" optionLabel="name" optionValue="id" placeholder="غير معين" [filter]="true" class="w-full" appendTo="body" />
                            </p-inputgroup>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">عنوان الانطلاق <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-map-marker text-blue-500"></i></p-inputgroup-addon>
                                <input pInputText formControlName="txtPickupAddress" placeholder="من أين؟" />
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtPickupAddress')?.touched && orderForm.get('txtPickupAddress')?.invalid">مطلوب</p-message>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">عنوان الوصول <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-map text-red-500"></i></p-inputgroup-addon>
                                <input pInputText formControlName="txtDropoffAddress" placeholder="إلى أين؟" />
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtDropoffAddress')?.touched && orderForm.get('txtDropoffAddress')?.invalid">مطلوب</p-message>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">وقت الانطلاق <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-clock"></i></p-inputgroup-addon>
                                <input pInputText type="datetime-local" formControlName="txtPickupTime" />
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtPickupTime')?.touched && orderForm.get('txtPickupTime')?.invalid">مطلوب</p-message>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">الركاب <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-users"></i></p-inputgroup-addon>
                                <input pInputText type="number" formControlName="txtPassengerCount" />
                            </p-inputgroup>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">السعر (USD) <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-dollar text-green-500"></i></p-inputgroup-addon>
                                <input pInputText type="number" formControlName="txtPrice" />
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtPrice')?.touched && orderForm.get('txtPrice')?.invalid">مطلوب</p-message>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">الحالة <span class="text-red-500">*</span></label>
                            <p-select formControlName="txtStatus" [options]="statusOptions" optionLabel="name" optionValue="value" class="w-full" appendTo="body" />
                        </div>
                    </div>
                </form>
            </ng-template>

            <ng-template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <p-button label="إلغاء" icon="pi pi-times" text (click)="hideDialog()"></p-button>
                    <p-button *ngIf="!isEditMode" label="حفظ" icon="pi pi-check" (click)="saveOrder()" [disabled]="orderForm.invalid"></p-button>
                    <p-button *ngIf="isEditMode" label="تعديل" icon="pi pi-pencil" severity="info" (click)="updateOrder()" [disabled]="orderForm.invalid"></p-button>
                </div>
            </ng-template>
        </p-dialog>

        <!-- SHARED: Delete Confirmation -->
        <p-dialog [(visible)]="displayDelete" [style]="{ width: '350px' }" header="تأكيد الحذف" [modal]="true" [closable]="true">
            <div class="flex items-center justify-center p-4">
                <i class="pi pi-exclamation-triangle mr-4 text-orange-500 text-3xl"></i>
                <span class="font-medium">هل أنت متأكد من الحذف؟</span>
            </div>
            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button label="إلغاء" icon="pi pi-times" text severity="secondary" (onClick)="displayDelete = false"></p-button>
                    <p-button label="حذف" icon="pi pi-trash" severity="danger" (onClick)="confirmDelete()"></p-button>
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class InstantOrderComponent implements OnInit {
    // Layout State
    layout: 'list' | 'grid' = 'list';

    // Data
    allOrders: any[] = [];
    originalOrders: any[] = [];
    driverOptions: DriveDTO[] = [];
    clientOptions: ClientDTO[] = [];
    loading = false;

    // Searches
    searchQuery = '';

    // Table State
    selectedOrders: InstantOrderDTO[] | null = null;

    // Dialog state
    orderDialog = false;
    isEditMode = false;
    selectedOrderId: string | null = null;
    orderForm!: FormGroup;

    // Delete state
    displayDelete = false;
    orderIdToDelete: string | null = null;

    // Drag and Drop (Kanban) state
    draggedOrder: any | null = null;
    dragOverStatus: string | null = null;

    cardViewMode: 'compact' | 'expanded' = 'expanded';

    statusOptions = [
        { name: 'بانتظار تأمين سائق', value: 'بانتظار تأمين سائق' },
        { name: 'قيد المراجعة', value: 'قيد المراجعة' },
        { name: 'تم التوصيل', value: 'تم التوصيل' },
        { name: 'ملغي', value: 'ملغي' }
    ];

    kanbanColumns = [
        { title: 'بانتظار سائق', status: 'بانتظار تأمين سائق' },
        { title: 'قيد المراجعة', status: 'قيد المراجعة' },
        { title: 'تم التوصيل', status: 'تم التوصيل' },
        { title: 'ملغي', status: 'ملغي' }
    ];

    constructor(
        private instantOrderService: InstantOrderService,
        private driverService: DriverService,
        private clientService: ClientService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private notificationService: NotificationService
    ) {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    buildForm() {
        this.orderForm = this.fb.group({
            txtDriverId: [null],
            txtClientId: [null, Validators.required],
            txtPickupAddress: ['', Validators.required],
            txtDropoffAddress: ['', Validators.required],
            txtPickupTime: ['', Validators.required],
            txtPassengerCount: [1, [Validators.required, Validators.min(1)]],
            txtPrice: [0, [Validators.required, Validators.min(0)]],
            txtStatus: ['بانتظار تأمين سائق', Validators.required]
        });
    }

    loadData() {
        this.loading = true;

        forkJoin({
            orders: this.instantOrderService.loadAll(),
            drivers: this.driverService.loadAll(),
            clients: this.clientService.loadAll()
        }).subscribe({
            next: (data) => {
                this.allOrders = data.orders;
                this.originalOrders = data.orders;
                this.driverOptions = data.drivers;
                this.clientOptions = data.clients;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // Global search matching Drivers.ts implementation
    onGlobalSearch() {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            this.allOrders = [...this.originalOrders];
        } else {
            const query = this.searchQuery.toLowerCase();
            this.allOrders = this.originalOrders.filter(
                (order) =>
                    order.clientName?.toLowerCase().includes(query) ||
                    order.driverName?.toLowerCase().includes(query) ||
                    order.pickupAddress?.toLowerCase().includes(query) ||
                    order.dropoffAddress?.toLowerCase().includes(query) ||
                    order.status?.toLowerCase().includes(query)
            );
        }
        this.cdr.detectChanges();
    }

    clearSearch(input?: HTMLInputElement) {
        if (input) input.value = '';
        this.searchQuery = '';
        this.onGlobalSearch();
    }

    // Kanban Helper Methods
    getOrdersByStatus(items: any[], status: string) {
        if (!items) return [];
        return items.filter((o) => o.status === status);
    }

    getOrdersCountByStatus(status: string) {
        return this.allOrders.filter((o) => o.status === status).length;
    }

    getAvailableDrivers(): DriveDTO[] {
        return this.driverOptions.filter((d) => d.status === 'متاح' || d.status === 'متوفر');
    }

    // Colors & Badges
    getStatusColor(status: string): string {
        switch (status) {
            case 'بانتظار تأمين سائق':
                return '#f97316'; // orange

            case 'قيد المراجعة':
                return '#3b82f6'; // blue
            case 'تم التوصيل':
                return '#22c55e'; // green
            case 'ملغي':
                return '#ef4444'; // red
            default:
                return '#94a3b8'; // slate
        }
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'بانتظار تأمين سائق':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-none font-bold';

            case 'قيد المراجعة':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none font-bold';
            case 'تم التوصيل':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none font-bold';
            case 'ملغي':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none font-bold';
            default:
                return 'bg-surface-100 text-surface-700 border-none font-bold';
        }
    }

    // --- Drag & Drop Assignment (Kanban Logic) ---
    onOrderDragStart(e: DragEvent, order: any) {
        this.draggedOrder = order;
        e.dataTransfer!.effectAllowed = 'move';
    }

    onOrderDragEnd() {
        this.draggedOrder = null;
        this.dragOverStatus = null;
    }

    onColumnDragOver(e: DragEvent, status: string) {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
        this.dragOverStatus = status;
    }

    onColumnDragLeave(e: DragEvent) {
        e.preventDefault();
        this.dragOverStatus = null;
    }

    onColumnDrop(e: DragEvent, newStatus: string) {
        e.preventDefault();
        this.dragOverStatus = null;

        if (!this.draggedOrder) return;
        const order = this.draggedOrder;

        if (order.status === newStatus) {
            this.draggedOrder = null;
            return;
        }

        // Kanban Validation: Cannot move to assigned/active statuses without a driver
        if (!order.driverId && (newStatus === 'قيد المراجعة' || newStatus === 'تم التوصيل')) {
            this.notificationService.warn('الرجاء تعيين كابتن أولاً');
            this.draggedOrder = null;
            return;
        }

        const oldStatus = order.status;
        order.status = newStatus;

        const dto = Object.assign(new InstantOrderDTO(), order);

        this.instantOrderService.UpdateOrder(dto).subscribe({
            next: () => {
                this.draggedOrder = null;
                this.cdr.detectChanges();
            },
            error: () => {
                order.status = oldStatus;
                this.draggedOrder = null;
                this.cdr.detectChanges();
            }
        });
    }

    // --- Driver Selection inside Kanban Card ---
    onDriverSelectedInCard(event: any, order: any) {
        const driverId = event.value;
        if (!driverId) return;

        const driver = this.driverOptions.find((d) => d.id === driverId);
        if (!driver) return;

        const oldDriverId = order.driverId;
        const oldDriverName = order.driverName;
        const oldStatus = order.status;

        order.driverId = driver.id;
        order.driverName = driver.name;
        // Automatically move to under review/secured status
        order.status = 'قيد المراجعة';

        const dto = Object.assign(new InstantOrderDTO(), order);

        this.instantOrderService.UpdateOrder(dto).subscribe({
            next: () => {
                this.cdr.detectChanges();
            },
            error: () => {
                // Revert on failure
                order.driverId = oldDriverId;
                order.driverName = oldDriverName;
                order.status = oldStatus;
                this.cdr.detectChanges();
            }
        });
    }

    // --- CRUD Operations ---
    openNew() {
        this.selectedOrderId = null;
        this.isEditMode = false;
        this.orderForm.reset();
        this.orderForm.patchValue({
            txtStatus: 'بانتظار تأمين سائق',
            txtPassengerCount: 1,
            txtPrice: 0
        });
        this.orderDialog = true;
    }

    editOrder(id: string) {
        this.selectedOrderId = id;
        const order = this.originalOrders.find((o) => o.id === id);
        if (order) {
            this.orderForm.patchValue({
                txtDriverId: order.driverId,
                txtClientId: order.clientId,
                txtPickupAddress: order.pickupAddress,
                txtDropoffAddress: order.dropoffAddress,
                txtPickupTime: order.pickupTime,
                txtPassengerCount: order.passengerCount,
                txtPrice: order.price,
                txtStatus: order.status
            });
            this.isEditMode = true;
            this.orderDialog = true;
        }
    }

    hideDialog() {
        this.orderDialog = false;
    }

    saveOrder() {
        if (this.orderForm.invalid) return;

        const val = this.orderForm.value;
        const dto = new InstantOrderDTO();
        dto.driverId = val.txtDriverId || null;
        dto.clientId = val.txtClientId;
        dto.pickupAddress = val.txtPickupAddress;
        dto.dropoffAddress = val.txtDropoffAddress;
        dto.pickupTime = val.txtPickupTime;
        dto.passengerCount = val.txtPassengerCount;
        dto.price = val.txtPrice;
        dto.status = val.txtStatus;

        if (dto.driverId && dto.status === 'بانتظار تأمين سائق') {
            dto.status = 'قيد المراجعة';
        }

        this.instantOrderService.insert(dto).subscribe({
            next: () => {
                this.notificationService.success();
                this.orderDialog = false;
                this.loadData();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء الإضافة');
            }
        });
    }

    updateOrder() {
        if (this.orderForm.invalid || !this.selectedOrderId) return;

        const val = this.orderForm.value;
        const dto = new InstantOrderDTO();
        dto.id = this.selectedOrderId;
        dto.driverId = val.txtDriverId || null;
        dto.clientId = val.txtClientId;
        dto.pickupAddress = val.txtPickupAddress;
        dto.dropoffAddress = val.txtDropoffAddress;
        dto.pickupTime = val.txtPickupTime;
        dto.passengerCount = val.txtPassengerCount;
        dto.price = val.txtPrice;
        dto.status = val.txtStatus;

        if (dto.driverId && dto.status === 'بانتظار تأمين سائق') {
            dto.status = 'قيد المراجعة';
        }

        this.instantOrderService.UpdateOrder(dto).subscribe({
            next: () => {
                this.notificationService.update();
                this.orderDialog = false;
                this.loadData();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء التعديل');
            }
        });
    }

    // Delete Logic
    openDeleteConfirmation(id: string) {
        this.orderIdToDelete = id;
        this.displayDelete = true;
    }

    deleteSelectedOrders() {
        if (!this.selectedOrders || this.selectedOrders.length === 0) return;
        this.orderIdToDelete = null;
        this.displayDelete = true;
    }

    confirmDelete() {
        if (this.orderIdToDelete) {
            this.instantOrderService.Delete(this.orderIdToDelete).subscribe({
                next: () => {
                    this.notificationService.delete();
                    this.displayDelete = false;
                    this.loadData();
                },
                error: () => {
                    this.notificationService.error('حدث خطأ أثناء الحذف');
                }
            });
        } else if (this.selectedOrders && this.selectedOrders.length > 0) {
            const requests = this.selectedOrders.map((o) => this.instantOrderService.Delete(o.id));
            forkJoin(requests).subscribe({
                next: () => {
                    this.selectedOrders = null;
                    this.notificationService.delete();
                    this.displayDelete = false;
                    this.loadData();
                },
                error: () => {
                    this.notificationService.error('حدث خطأ أثناء الحذف');
                }
            });
        }
    }

    formatTime12h(time: string): string {
        if (!time) return '';

        const date = new Date(time);

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const period = hours >= 12 ? 'مساءً' : 'صباحًا';

        hours = hours % 12;
        if (hours === 0) hours = 12;

        return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
    }
}
