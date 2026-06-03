import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { Message } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Tag, TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';

import { SubscriptionDTO } from '@/app/Model/subscriptionDTO';
import { SubscriptionService } from '../../service/subscription.service';
import { ClientService } from '../../service/client.service';
import { DriverService } from '../../service/driver.service';
import { DriveDTO } from '@/app/Model/driveDTO';
import { ClientDTO } from '@/app/Model/clientDTO';
import { NotificationService } from '@/app/shared/services/notification.service';

@Component({
    selector: 'app-subscription',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        DatePickerModule,
        MultiSelectModule,
        InputGroupAddon,
        InputGroup,
        ReactiveFormsModule,
        FormsModule,
        SelectModule,
        TagModule,
        DataViewModule,
        Message
    ],
    template: `
        <div class="card bg-surface-0 dark:bg-surface-900 p-4 border border-surface-200 dark:border-surface-700 rounded-xl shadow-sm">
            <p-dataview
                [value]="allOrders"
                [layout]="layout"
                [paginator]="layout === 'list'"
                [rows]="10"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="عرض {first} إلى {last} من أصل {totalRecords} اشتراك"
                [rowsPerPageOptions]="[10, 20, 30]"
            >
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
                                title="عرض كجدول"
                            >
                                <i class="pi pi-list text-lg transition-transform duration-300" [ngClass]="layout === 'list' ? 'scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5'"></i>
                            </button>

                            <!-- زر الشبكة (Grid - Kanban) -->
                            <button
                                type="button"
                                (click)="layout = 'grid'"
                                class="px-6 py-2 rounded-full transition-all duration-300 ease-out flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-95 group"
                                [ngClass]="
                                    layout === 'grid'
                                        ? 'bg-white dark:bg-surface-900 text-primary-600 dark:text-primary-400 shadow-sm border border-surface-100 dark:border-surface-700/50'
                                        : 'text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-100 hover:bg-surface-200/50 dark:hover:bg-surface-700/50 text-opacity-80'
                                "
                                title="عرض لوحة التعيين"
                            >
                                <i class="pi pi-arrows-alt text-lg transition-transform duration-300" [ngClass]="layout === 'grid' ? 'scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5'"></i>
                            </button>
                        </div>
                    </div>

                    <p-toolbar styleClass="ml-5">
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
                            <p-button label="اشتراك جديد" icon="pi pi-plus" severity="success" (onClick)="openNew()" />
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
                                <th pSortableColumn="pickupAddress" style="min-width:14rem">الانطلاق <p-sortIcon field="pickupAddress" /></th>
                                <th pSortableColumn="pickUpTime" style="min-width:10rem">وقت الانطلاق <p-sortIcon field="pickUpTime" /></th>
                                <th pSortableColumn="returnPickupAddress" style="min-width:14rem">العودة <p-sortIcon field="returnPickupAddress" /></th>
                                <th pSortableColumn="totalMonthlyPrice" style="min-width:10rem">الاشتراك <p-sortIcon field="totalMonthlyPrice" /></th>
                                <th pSortableColumn="status" style="min-width:12rem">الحالة <p-sortIcon field="status" /></th>
                                <th style="min-width: 8rem">العمليات</th>
                            </tr>
                        </ng-template>

                        <ng-template #body let-order>
                            <tr>
                                <td><p-tableCheckbox [value]="order" /></td>
                                <td class="font-bold">{{ order.clientName }}</td>
                                <td>
                                    <span *ngIf="order.driverName">{{ order.driverName }}</span>
                                    <p-tag *ngIf="!order.driverName" value="لم يتم التعيين" severity="warn"></p-tag>
                                </td>
                                <td>
                                    <span class="truncate max-w-[200px] inline-block" [title]="order.pickupAddress">{{ order.pickupAddress }}</span>
                                </td>
                                <td>{{ order.pickUpTime?.toString().slice(0, 5) }}</td>
                                <td>
                                    <span class="truncate max-w-[200px] inline-block" [title]="order.returnPickupAddress">{{ order.returnPickupAddress }}</span>
                                </td>
                                <td>
                                    <span class="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md text-sm border border-green-200 dark:border-green-800/50">
                                        {{ order.totalMonthlyPrice | currency: 'USD' }}
                                    </span>
                                </td>
                                <td>
                                    <p-tag [value]="order.status" [severity]="getStatusSeverity(order.status)"></p-tag>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" (onClick)="editOrder(order.id)" [disabled]="selectedOrders && selectedOrders.length > 1"></p-button>
                                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (onClick)="openConfirmation(order.id)" [disabled]="selectedOrders && selectedOrders.length > 1"></p-button>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>

                        <ng-template #empty>
                            <tr>
                                <td colspan="9" class="text-center p-4">لا توجد اشتراكات مطابقة للبحث.</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </ng-template>

                <!-- GRID TEMPLATE (KANBAN) -->
                <ng-template #grid let-items>
                    <div class="bg-surface-50 dark:bg-surface-900 min-h-screen p-4 sm:p-6 rounded-2xl border border-surface-200 dark:border-surface-700">
                        <!-- Dashboard Stats -->
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                            <div class="bg-surface-0 dark:bg-surface-900 p-4 border rounded-xl border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-between">
                                <div>
                                    <span class="block text-surface-500 text-sm font-medium mb-1">إجمالي الاشتراكات</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">{{ allOrders.length }}</div>
                                </div>
                                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <i class="pi pi-receipt text-blue-600 dark:text-blue-400 text-xl"></i>
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
                                    <span class="block text-surface-500 text-sm font-medium mb-1">اشتراكات نشطة</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">{{ getOrdersCountByStatus('الاشتراك نشط') }}</div>
                                </div>
                                <div class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <i class="pi pi-verified text-purple-600 dark:text-purple-400 text-xl"></i>
                                </div>
                            </div>
                            <div class="bg-surface-0 dark:bg-surface-900 p-4 border rounded-xl border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-between">
                                <div>
                                    <span class="block text-surface-500 text-sm font-medium mb-1">تمت المراجعة</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">{{ getOrdersCountByStatus('قيد المراجعة') }}</div>
                                </div>
                                <div class="w-12 h-12 flex items-center justify-center bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                                    <i class="pi pi-sync text-cyan-600 dark:text-cyan-400 text-xl"></i>
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
                                                order.totalMonthlyPrice | currency: 'USD'
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
                                                <span class="text-sm text-surface-700 dark:text-surface-200 truncate" [title]="order.returnPickupAddress">{{ order.returnPickupAddress }}</span>
                                            </div>
                                        </div>

                                        <!-- Info Grid (Start Date, PickUpTime, Seats) -->
                                        <div *ngIf="cardViewMode === 'expanded'" class="w-full flex justify-between bg-surface-50 dark:bg-surface-800 rounded-lg py-2 px-2 mb-3 border border-surface-200 dark:border-surface-700">
                                            <div class="flex flex-col items-center flex-1 overflow-hidden">
                                                <span class="text-[10px] text-surface-500 mb-1 flex items-center gap-1"><i class="pi pi-calendar"></i> البدء</span>
                                                <span class="font-bold text-[11px] text-surface-900 dark:text-surface-0 truncate">{{ order.startDate | date: 'yy-MM-dd' }}</span>
                                            </div>
                                            <div class="w-px bg-surface-200 dark:bg-surface-700 my-1 shrink-0"></div>
                                            <div class="flex flex-col items-center flex-1 overflow-hidden">
                                                <span class="text-[10px] text-surface-500 mb-1 flex items-center gap-1"><i class="pi pi-clock"></i> الانطلاق</span>
                                                <span class="font-bold text-[11px] text-surface-900 dark:text-surface-0 truncate">{{ order.pickUpTime?.toString().slice(0, 5) || 'N/A' }}</span>
                                            </div>
                                            <div class="w-px bg-surface-200 dark:bg-surface-700 my-1 shrink-0"></div>
                                            <div class="flex flex-col items-center flex-1 overflow-hidden">
                                                <span class="text-[10px] text-surface-500 mb-1 flex items-center gap-1"><i class="pi pi-users"></i> مقاعد</span>
                                                <span class="font-bold text-[11px] text-surface-900 dark:text-surface-0 truncate">{{ order.seatsCount }}</span>
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
                                                    dir="rtl"
                                                    [style]="{ direction: 'rtl', 'text-align': 'right' }"
                                                    class="w-full text-sm"
                                                    appendTo="body"
                                                    (onChange)="onDriverSelectedInCard($event, order)"
                                                >
                                                </p-select>
                                            </div>

                                            <!-- Static Info: For all other statuses -->
                                            <div *ngIf="order.status !== 'بانتظار تأمين سائق'" class="flex items-center gap-2 bg-surface-50 dark:bg-surface-800 p-2 rounded-lg">
                                                <div class="flex-1 min-w-0">
                                                    <div class="text-xs text-surface-500">الكابتن المعين</div>
                                                    <div class="text-sm font-bold text-surface-900 dark:text-surface-0 truncate">
                                                        {{ order.driverName || 'لا يوجد كابتن' }}
                                                    </div>
                                                </div>
                                                <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 border border-primary-200 dark:border-primary-800">
                                                    <i class="pi pi-car text-primary-600 dark:text-primary-400 text-sm"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Empty State per column -->
                                    <div
                                        *ngIf="getOrdersByStatus(items, col.status).length === 0"
                                        class="p-4 text-center border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl text-surface-400 text-sm bg-surface-0/50 dark:bg-surface-900/50"
                                    >
                                        اسحب هنا
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
        </div>

        <!-- SHARED: Add / Edit Dialog -->
        <p-dialog [(visible)]="orderDialog" [style]="{ width: '700px' }" [header]="isEditMode ? 'تعديل بيانات الاشتراك' : 'إضافة اشتراك جديد'" [modal]="true" [draggable]="false" [resizable]="false">
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
                            <label class="text-sm font-medium">الكابتن <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-car"></i></p-inputgroup-addon>
                                <p-select formControlName="txtDriverId" [showClear]="true" [options]="driverOptions" optionValue="id" [optionDisabled]="'disabled'" placeholder="اختر الكابتن" [filter]="true" class="w-full" appendTo="body">
                                    <ng-template let-driver pTemplate="item">
                                        <div class="flex items-center justify-between w-full" [ngClass]="{ 'opacity-50 cursor-not-allowed': driver.disabled }">
                                            <span>{{ driver.name }}</span>
                                            <p-tag *ngIf="driver.availableSeats === 0" value="لا يوجد مقاعد" severity="danger"></p-tag>
                                            <p-tag *ngIf="driver.availableSeats > 0" [value]="driver.availableSeats + ' متاح'" severity="success"></p-tag>
                                        </div>
                                    </ng-template>
                                    <ng-template let-driver pTemplate="selectedItem">
                                        <div class="flex items-center justify-between w-full">
                                            <span>{{ driver.name }}</span>
                                            <p-tag *ngIf="driver?.availableSeats === 0" value="لا يوجد مقاعد" severity="danger"></p-tag>
                                            <p-tag *ngIf="driver?.availableSeats > 0" [value]="driver.availableSeats + ' متاح'" severity="success"></p-tag>
                                        </div>
                                    </ng-template>
                                </p-select>
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtDriverId')?.touched && orderForm.get('txtDriverId')?.invalid">مطلوب</p-message>
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
                            <label class="text-sm font-medium">عنوان العودة <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-map-marker text-red-500"></i></p-inputgroup-addon>
                                <input pInputText formControlName="txtReturnPickupAddress" placeholder="من أين؟" />
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtReturnPickupAddress')?.touched && orderForm.get('txtReturnPickupAddress')?.invalid">مطلوب</p-message>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">وقت الانطلاق <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-clock"></i></p-inputgroup-addon>
                                <p-datepicker formControlName="txtPickUpTime" [timeOnly]="true" hourFormat="12" placeholder="00:00" appendTo="body" styleClass="w-full"></p-datepicker>
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtPickUpTime')?.touched && orderForm.get('txtPickUpTime')?.invalid">مطلوب</p-message>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">وقت العودة <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-clock"></i></p-inputgroup-addon>
                                <p-datepicker formControlName="txtReturnPickUpTime" [timeOnly]="true" hourFormat="12" placeholder="00:00" appendTo="body" styleClass="w-full"></p-datepicker>
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtReturnPickUpTime')?.touched && orderForm.get('txtReturnPickUpTime')?.invalid">مطلوب</p-message>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">تاريخ البدء <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-calendar text-blue-500"></i></p-inputgroup-addon>
                                <p-datepicker formControlName="txtStartDate" dateFormat="yy-mm-dd" placeholder="تاريخ البدء" appendTo="body" styleClass="w-full"></p-datepicker>
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtStartDate')?.touched && orderForm.get('txtStartDate')?.invalid">مطلوب</p-message>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">تاريخ الانتهاء <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-calendar text-red-500"></i></p-inputgroup-addon>
                                <p-datepicker formControlName="txtEndDate" dateFormat="yy-mm-dd" placeholder="تاريخ الانتهاء" appendTo="body" styleClass="w-full"></p-datepicker>
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtEndDate')?.touched && orderForm.get('txtEndDate')?.invalid">مطلوب</p-message>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">عدد المقاعد <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-users"></i></p-inputgroup-addon>
                                <input pInputText type="number" formControlName="txtSeatsCount" />
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtSeatsCount')?.touched && orderForm.get('txtSeatsCount')?.invalid">مطلوب</p-message>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">أيام العطلة <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-calendar-times"></i></p-inputgroup-addon>
                                <p-multiSelect
                                    formControlName="txtOffDays"
                                    [options]="OffDaysOptions"
                                    optionLabel="name"
                                    optionValue="value"
                                    placeholder="اختر أيام العطلة"
                                    display="chip"
                                    [maxSelectedLabels]="3"
                                    appendTo="body"
                                    styleClass="w-full"
                                ></p-multiSelect>
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtOffDays')?.touched && orderForm.get('txtOffDays')?.invalid">مطلوب</p-message>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">الاشتراك الشهري (USD) <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-dollar text-green-500"></i></p-inputgroup-addon>
                                <input pInputText type="number" formControlName="txtTotalMonthlyPrice" />
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="orderForm.get('txtTotalMonthlyPrice')?.touched && orderForm.get('txtTotalMonthlyPrice')?.invalid">مطلوب</p-message>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">حالة الاشتراك <span class="text-red-500">*</span></label>
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
                <i class="pi pi-exclamation-triangle mr-4 text-orange-500" style="font-size: 2rem"></i>
                <span class="text-surface-900 dark:text-surface-0">هل أنت متأكد من حذف المختار؟</span>
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
export class SubscriptionComponent implements OnInit {
    [x: string]: any;
    // Layout State
    layout: 'list' | 'grid' = 'list';

    // Data
    allOrders: SubscriptionDTO[] = [];
    originalOrders: SubscriptionDTO[] = [];
    driverOptions: DriveDTO[] = [];
    clientOptions: ClientDTO[] = [];
    loading = false;

    // Searches
    searchQuery = '';

    // Table State
    selectedOrders: SubscriptionDTO[] | null = null;

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
        { name: 'الاشتراك نشط', value: 'الاشتراك نشط' },
        { name: 'الاشتراك متوقف', value: 'الاشتراك متوقف' },
        { name: 'الاشتراك مكتمل', value: 'الاشتراك مكتمل' },
        { name: 'الاشتراك ملغي', value: 'الاشتراك ملغي' }
    ];

    kanbanColumns = [
        { title: 'بانتظار سائق', status: 'بانتظار تأمين سائق' },
        { title: 'المراجعة', status: 'قيد المراجعة' },
        { title: 'نشط', status: 'الاشتراك نشط' },
        { title: 'متوقف', status: 'الاشتراك متوقف' },
        { title: 'مكتمل', status: 'الاشتراك مكتمل' },
        { title: 'ملغي', status: 'الاشتراك ملغي' }
    ];

    OffDaysOptions = [
        { name: 'السبت', value: 'السبت' },
        { name: 'الأحد', value: 'الأحد' },
        { name: 'الاثنين', value: 'الاثنين' },
        { name: 'الثلاثاء', value: 'الثلاثاء' },
        { name: 'الأربعاء', value: 'الأربعاء' },
        { name: 'الخميس', value: 'الخميس' },
        { name: 'الجمعة', value: 'الجمعة' }
    ];

    constructor(
        private subscriptionService: SubscriptionService,
        private driverService: DriverService,
        private clientService: ClientService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.buildForm();
        this.loadAll();
        this.loadDrivers();
        this.loadClients();
    }

    buildForm() {
        this.orderForm = this.fb.group({
            txtDriverId: [null],
            txtClientId: [null, Validators.required],
            txtPickupAddress: ['', Validators.required],
            txtPickUpTime: [null, Validators.required],
            txtReturnPickupAddress: ['', Validators.required],
            txtReturnPickUpTime: [null, Validators.required],
            txtStartDate: [null, Validators.required],
            txtEndDate: [null, Validators.required],
            txtSeatsCount: ['', Validators.required],
            txtOffDays: [null, Validators.required],
            txtTotalMonthlyPrice: [0, [Validators.required, Validators.min(0)]],
            txtStatus: ['بانتظار تأمين سائق', Validators.required]
        });
    }

    // ── Data Loading ───────────────────────────────
    loadAll() {
        this.loading = true;
        this.subscriptionService.loadAll().subscribe({
            next: (data) => {
                this.allOrders = data;
                this.originalOrders = [...data];
                this.loading = false;
                this.onGlobalSearch();
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadDrivers() {
        this.driverService.loadAll().subscribe({
            next: (data: DriveDTO[]) => {
                this.driverOptions = data.map(
                    (d) =>
                        ({
                            id: d.id,
                            name: d.name,
                            availableSeats: d.availableSeats ?? 0,
                            disabled: (d.availableSeats ?? 0) === 0
                        }) as any
                );
                this.cdr.detectChanges();
            }
        });
    }

    loadClients() {
        this.clientService.loadAll().subscribe({
            next: (data: ClientDTO[]) => {
                this.clientOptions = data;
                this.cdr.detectChanges();
            }
        });
    }

    // ── Dialog & Form Handlers ────────────────────────
    openNew() {
        this.selectedOrderId = null;
        this.isEditMode = false;
        this.orderForm.reset();
        this.orderForm.patchValue({ txtStatus: 'بانتظار تأمين سائق', txtTotalMonthlyPrice: 0 });
        this.orderDialog = true;
    }

    editOrder(id: string) {
        const order = this.allOrders.find((o) => o.id === id);
        if (!order) return;

        this.selectedOrderId = id;
        this.isEditMode = true;

        this.orderForm.patchValue({
            txtDriverId: order.driverId,
            txtClientId: order.clientId,
            txtPickupAddress: order.pickupAddress,
            txtPickUpTime: this.parseTime(order.pickUpTime),
            txtReturnPickupAddress: order.returnPickupAddress,
            txtReturnPickUpTime: this.parseTime(order.returnPickUpTime),
            txtStartDate: this.parseDate(order.startDate),
            txtEndDate: this.parseDate(order.endDate),
            txtSeatsCount: order.seatsCount,
            txtOffDays: this.parseOffDays(order.offDays),
            txtTotalMonthlyPrice: order.totalMonthlyPrice,
            txtStatus: order.status
        });

        this.orderDialog = true;
    }

    hideDialog() {
        this.orderDialog = false;
        this.isEditMode = false;
        this.selectedOrderId = null;
    }

    saveOrder() {
        if (this.orderForm.invalid) {
            this.orderForm.markAllAsTouched();
            return;
        }

        const v = this.orderForm.value;
        const newOrder = new SubscriptionDTO();
        this.mapFormToDTO(v, newOrder);

        this.subscriptionService.insert(newOrder).subscribe({
            next: () => {
                this.notificationService.success();
                this.orderDialog = false;
                this.loadAll();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء الحفظ');
            }
        });
    }

    updateOrder() {
        if (this.orderForm.invalid) {
            this.orderForm.markAllAsTouched();
            return;
        }

        if (!this.selectedOrderId) {
            this.notificationService.error('لم يتم تحديد الاشتراك المراد تعديله');
            return;
        }

        const v = this.orderForm.value;
        const updatedOrder = new SubscriptionDTO();
        this.mapFormToDTO(v, updatedOrder);
        updatedOrder.id = this.selectedOrderId; // مهم: تعيين المعرف للتحديث

        this.subscriptionService.UpdateSubscription(updatedOrder).subscribe({
            next: () => {
                this.notificationService.update();
                this.orderDialog = false;
                this.loadAll(); // إعادة تحميل البيانات
            },
            error: (error) => {
                console.error('Update error:', error);
                this.notificationService.error('حدث خطأ أثناء التحديث');
            }
        });
    }

    private mapFormToDTO(v: any, dto: SubscriptionDTO) {
        dto.driverId = v.txtDriverId || undefined;
        dto.clientId = v.txtClientId;
        dto.pickupAddress = v.txtPickupAddress;
        dto.pickUpTime = this.formatTime(v.txtPickUpTime);
        dto.returnPickupAddress = v.txtReturnPickupAddress;
        dto.returnPickUpTime = this.formatTime(v.txtReturnPickUpTime);
        dto.offDays = Array.isArray(v.txtOffDays) ? v.txtOffDays.join(',') : v.txtOffDays;
        dto.startDate = this.formatDate(v.txtStartDate);
        dto.endDate = this.formatDate(v.txtEndDate);
        dto.seatsCount = v.txtSeatsCount;
        dto.totalMonthlyPrice = v.txtTotalMonthlyPrice;
        dto.status = v.txtStatus;
    }

    // ── Delete Handlers ───────────────────────────────
    openConfirmation(id: string) {
        this.orderIdToDelete = id;
        this.displayDelete = true;
    }

    deleteSelectedOrders() {
        if (!this.selectedOrders || !this.selectedOrders.length) return;
        this.orderIdToDelete = null;
        this.displayDelete = true;
    }

    confirmDelete() {
        if (this.orderIdToDelete) {
            this.subscriptionService.Delete(this.orderIdToDelete).subscribe({
                next: () => {
                    this.notificationService.delete();
                    this.displayDelete = false;
                    this.loadAll();
                },
                error: () => {
                    this.notificationService.error('حدث خطأ أثناء الحذف');
                    this.displayDelete = false;
                }
            });
        } else if (this.selectedOrders && this.selectedOrders.length > 0) {
            const requests = this.selectedOrders.map((o) => this.subscriptionService.Delete(o.id));
            forkJoin(requests).subscribe({
                next: () => {
                    this.notificationService.delete();
                    this.selectedOrders = null;
                    this.displayDelete = false;
                    this.loadAll();
                },
                error: () => {
                    this.notificationService.error('حدث خطأ أثناء الحذف الجماعي');
                    this.displayDelete = false;
                }
            });
        }
    }

    // ── Search & Filter ───────────────────────────────
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
                    order.returnPickupAddress?.toLowerCase().includes(query) ||
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

    // ── Kanban Helpers ────────────────────────────────
    getOrdersByStatus(items: any[], status: string) {
        if (!items) return [];
        return items.filter((o) => o.status === status);
    }

    getOrdersCountByStatus(status: string) {
        return this.allOrders.filter((o) => o.status === status).length;
    }

    getAvailableDrivers(): DriveDTO[] {
        return this.driverOptions.filter((d) => d.status === 'متاح' || d.status === 'متوفر' || (d as any).availableSeats > 0);
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'بانتظار تأمين سائق':
                return '#f97316'; // orange
            case 'قيد المراجعة':
                return '#3b82f6'; // blue
            case 'الاشتراك نشط':
                return '#8b5cf6'; // purple
            case 'الاشتراك متوقف':
                return '#94a3b8'; // slate
            case 'الاشتراك مكتمل':
                return '#22c55e'; // green
            case 'الاشتراك ملغي':
                return '#ef4444'; // red
            default:
                return '#94a3b8';
        }
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (status) {
            case 'بانتظار تأمين سائق':
                return 'warn';
            case 'قيد المراجعة':
                return 'info';
            case 'الاشتراك نشط':
                return 'success';
            case 'الاشتراك متوقف':
                return 'secondary';
            case 'الاشتراك مكتمل':
                return 'success';
            case 'الاشتراك ملغي':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    // ── Kanban Drag & Drop Logic ───────────────────────
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

        // Kanban Validation: Cannot move to active statuses without a driver
        if (!order.driverId && ['قيد المراجعة', 'الاشتراك نشط', 'الاشتراك متوقف', 'الاشتراك مكتمل'].includes(newStatus)) {
            this.notificationService.warn('الرجاء تعيين كابتن أولاً');
            this.draggedOrder = null;
            return;
        }

        const oldStatus = order.status;
        order.status = newStatus;

        const dto = Object.assign(new SubscriptionDTO(), order);

        this.subscriptionService.UpdateSubscription(dto).subscribe({
            next: () => {
                this.draggedOrder = null;
                this.cdr.detectChanges();
            },
            error: () => {
                order.status = oldStatus;
                this.draggedOrder = null;
                this.notificationService.error('فشل في تحديث الحالة');
                this.cdr.detectChanges();
            }
        });
    }

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
        order.status = 'قيد المراجعة'; // Automatically move to under review

        const dto = Object.assign(new SubscriptionDTO(), order);

        this.subscriptionService.UpdateSubscription(dto).subscribe({
            next: () => {
                this.cdr.detectChanges();
            },
            error: () => {
                order.driverId = oldDriverId;
                order.driverName = oldDriverName;
                order.status = oldStatus;
                this.notificationService.error('فشل في تعيين الكابتن');
                this.cdr.detectChanges();
            }
        });
    }

    // ── Form Helpers ──────────────────────────────────
    private parseTime(time: string | Date): Date | null {
        if (!time) return null;
        if (time instanceof Date) return time;
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(+hours);
        date.setMinutes(+minutes);
        date.setSeconds(0);
        return date;
    }

    private parseDate(date: string | Date): Date | null {
        if (!date) return null;
        if (date instanceof Date) return date;
        return new Date(date);
    }

    private parseOffDays(days: string): string[] {
        if (!days) return [];
        return days.split(',').map((d) => d.trim());
    }

    private formatTime(val: any): string {
        if (!val) return '';
        if (val instanceof Date) {
            const h = val.getHours().toString().padStart(2, '0');
            const m = val.getMinutes().toString().padStart(2, '0');
            return `${h}:${m}:00`;
        }
        return val;
    }

    private formatDate(val: any): string {
        if (!val) return '';
        if (val instanceof Date) {
            return val.toISOString().split('T')[0];
        }
        return val;
    }
}
