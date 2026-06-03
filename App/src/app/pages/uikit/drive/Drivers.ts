// Angular core imports
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG imports
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';

// model and service imports
import { DriveDTO } from '@/app/Model/driveDTO';
import { DriverService } from '../../service/driver.service';
import { NotificationService } from '@/app/shared/services/notification.service';
import { DataView } from 'primeng/dataview';
import { SelectButton } from 'primeng/selectbutton';
import { InputGroup } from 'primeng/inputgroup';
import { Message } from 'primeng/message';
import { InputGroupAddon } from 'primeng/inputgroupaddon';

@Component({
    selector: 'app-drivers',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        RippleModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        InputIconModule,
        CheckboxModule,
        IconFieldModule,
        TagModule,
        DataView,
        InputGroup,
        InputGroupAddon,
        SelectModule
    ],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">إدارة الكباتن</div>

            <p-dataview [value]="driveList" [layout]="layout" [paginator]="layout === 'grid'" [rows]="9" [showCurrentPageReport]="true" currentPageReportTemplate="عرض {first} إلى {last} من أصل {totalRecords} كابتن" [rowsPerPageOptions]="[9, 18, 27]">
                <ng-template #header>
                    <div class="flex justify-end mb-4">
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

                            <!-- زر الشبكة (Grid) -->
                            <button
                                type="button"
                                (click)="layout = 'grid'"
                                class="px-6 py-2 rounded-full transition-all duration-300 ease-out flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-95 group"
                                [ngClass]="
                                    layout === 'grid'
                                        ? 'bg-white dark:bg-surface-900 text-primary-600 dark:text-primary-400 shadow-sm border border-surface-100 dark:border-surface-700/50'
                                        : 'text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-100 hover:bg-surface-200/50 dark:hover:bg-surface-700/50 text-opacity-80'
                                "
                                title="عرض كشبكة"
                            >
                                <i class="pi pi-table text-lg transition-transform duration-300" [ngClass]="layout === 'grid' ? 'scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5'"></i>
                            </button>
                        </div>
                    </div>

                    <p-toolbar styleClass="mb-6">
                        <ng-template #start>
                            <!-- bulk delete button -->
                            <p-button
                                [severity]="!selectedDrives || selectedDrives.length < 2 ? 'secondary' : 'danger'"
                                [outlined]="!selectedDrives || selectedDrives.length < 2"
                                label="حذف المحدد"
                                icon="pi pi-trash"
                                (onClick)="deleteSelectedDrives()"
                                [disabled]="!selectedDrives || selectedDrives.length < 2"
                            />

                            <!-- add driver -->
                            <p-button label="اضافة كباتن" icon="pi pi-plus" severity="success" class="mr-2" (onClick)="openNew()" />
                        </ng-template>

                        <ng-template #end>
                            <!-- SEARCH (always last) -->
                            <p-iconfield class="w-full sm:w-64 md:w-80">
                                <p-inputicon styleClass="pi pi-search"></p-inputicon>
                                <input #filterInput type="text" pInputText placeholder="بحث شامل..." [(ngModel)]="searchQuery" (input)="onGlobalSearch()" class="w-full rounded-full" />
                                <p-inputicon *ngIf="searchQuery" styleClass="pi pi-times cursor-pointer text-gray-400 hover:text-red-500" (click)="clearSearch(undefined, filterInput)" />
                            </p-iconfield>
                        </ng-template>
                    </p-toolbar>
                </ng-template>

                <ng-template #list let-items>
                    <!-- drivers table -->
                    <p-table
                        #dt
                        [value]="driveList"
                        [(selection)]="selectedDrives"
                        [rows]="10"
                        [paginator]="true"
                        [globalFilterFields]="['name', 'phone', 'email', 'gender', 'carType', 'carNumber', 'status', 'totalSeats', 'availableSeats']"
                        [tableStyle]="{ 'min-width': '75rem' }"
                        [rowHover]="true"
                        dataKey="id"
                        currentPageReportTemplate="عرض {first} إلى {last} من أصل {totalRecords} كابتن"
                        [showCurrentPageReport]="true"
                        [rowsPerPageOptions]="[10, 20, 30]"
                    >
                        <!-- table caption with filter and search -->

                        <!-- table header -->
                        <ng-template #header>
                            <tr>
                                <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
                                <th style="min-width: 8rem">الصورة</th>
                                <th pSortableColumn="name" style="min-width: 14rem">الاسم <p-sortIcon field="name" /></th>
                                <th pSortableColumn="phone" style="min-width: 10rem">الهاتف <p-sortIcon field="phone" /></th>
                                <th pSortableColumn="email" style="min-width: 12rem">الإيميل <p-sortIcon field="email" /></th>
                                <th pSortableColumn="gender" style="min-width: 7rem">الجنس <p-sortIcon field="gender" /></th>
                                <th pSortableColumn="carType" style="min-width: 9rem">نوع السيارة <p-sortIcon field="carType" /></th>
                                <th pSortableColumn="carNumber" style="min-width: 9rem">رقم السيارة <p-sortIcon field="carNumber" /></th>
                                <th pSortableColumn="status" style="min-width: 9rem">حالة الكابتن <p-sortIcon field="status" /></th>
                                <th pSortableColumn="totalSeats" style="min-width: 8rem">عدد المقاعد <p-sortIcon field="totalSeats" /></th>
                                <th pSortableColumn="availableSeats" style="min-width: 10rem">المقاعد المتاحة <p-sortIcon field="availableSeats" /></th>
                                <th style="min-width: 10rem">العمليات</th>
                            </tr>
                        </ng-template>

                        <!-- table body -->
                        <ng-template #body let-Driver>
                            <tr>
                                <td><p-tableCheckbox [value]="Driver" /></td>
                                <td>
                                    <img [src]="'https://localhost:7290' + Driver.vehicleImage" style="width:40px; height:40px; border-radius:50%; object-fit:cover;" *ngIf="Driver.vehicleImage" />
                                    <i class="pi pi-user" *ngIf="!Driver.vehicleImage"></i>
                                </td>
                                <td pFrozenColumn>{{ Driver.name }}</td>
                                <td>{{ Driver.phone }}</td>
                                <td>{{ Driver.email }}</td>
                                <td>
                                    <span [ngClass]="Driver.gender === 'ذكر' ? 'text-blue-500' : 'text-pink-500'">
                                        <i [class]="Driver.gender === 'ذكر' ? 'pi pi-mars' : 'pi pi-venus'"></i>
                                        {{ Driver.gender }}
                                    </span>
                                </td>
                                <td>{{ Driver.carType }}</td>
                                <td>{{ Driver.carNumber }}</td>
                                <td>
                                    <p-tag [value]="Driver.status" [severity]="getStatusSeverity(Driver.status)"></p-tag>
                                </td>
                                <td>{{ Driver.totalSeats }}</td>
                                <td>
                                    <p-tag
                                        [value]="Driver.availableSeats == null || Driver.availableSeats === 0 ? 'لا يوجد مقاعد' : Driver.availableSeats + ' مقعد'"
                                        [severity]="Driver.availableSeats == null || Driver.availableSeats === 0 ? 'danger' : 'success'"
                                    >
                                    </p-tag>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (onClick)="openConfirmation(Driver.id)" [disabled]="selectedDrives && selectedDrives.length > 1" />
                                        <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" (onClick)="editDriver(Driver.id)" [disabled]="selectedDrives && selectedDrives.length > 1" />
                                    </div>
                                </td>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="loadingbody">
                            <tr>
                                <td colspan="12">جاري التحميل...</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </ng-template>

                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        <div *ngFor="let driver of items" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                            <!-- Modern Profile Card -->
                            <div
                                class="relative bg-surface-0 dark:bg-surface-900 border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer overflow-hidden h-full"
                                [ngClass]="
                                    isDriverSelected(driver)
                                        ? 'border-primary-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)] dark:shadow-[0_0_0_2px_rgba(96,165,250,0.2)] bg-primary-50/50 dark:bg-primary-900/10'
                                        : 'border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600'
                                "
                                (click)="toggleDriverSelection(driver)"
                            >
                                <!-- Top Elements -->
                                <div class="absolute z-20 right-4 top-4" (click)="$event.stopPropagation()">
                                    <p-checkbox [binary]="true" [ngModel]="isDriverSelected(driver)" (onChange)="toggleDriverSelection(driver)"></p-checkbox>
                                </div>
                                <div class="absolute z-20 left-4 top-4">
                                    <p-tag [value]="driver.status" [severity]="getStatusSeverity(driver.status)" [rounded]="true"></p-tag>
                                </div>

                                <!-- Cover Image Banner -->
                                <div class="relative w-full h-36 bg-surface-100 dark:bg-surface-800 overflow-hidden shrink-0">
                                    <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" *ngIf="driver.vehicleImage"></div>
                                    <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" [src]="'https://localhost:7290' + driver.vehicleImage" [alt]="driver.name" *ngIf="driver.vehicleImage" />

                                    <div *ngIf="!driver.vehicleImage" class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900 dark:to-primary-800">
                                        <i class="pi pi-car text-6xl text-primary-400 dark:text-primary-300 opacity-40"></i>
                                    </div>
                                </div>

                                <!-- Overlapping Avatar -->
                                <div class="flex justify-center -mt-12 relative z-20 shrink-0">
                                    <div class="w-24 h-24 rounded-full border-4 border-surface-0 dark:border-surface-900 bg-surface-100 dark:bg-surface-800 shadow-md flex items-center justify-center overflow-hidden">
                                        <i class="pi pi-user text-4xl text-surface-400"></i>
                                    </div>
                                </div>

                                <!-- Card Content -->
                                <div class="p-5 flex-1 flex flex-col items-center">
                                    <!-- Name and Identity -->
                                    <div class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-1 text-center truncate w-full flex items-center justify-center gap-2" [title]="driver.name">
                                        <span class="truncate">{{ driver.name }}</span>
                                        <i [class]="driver.gender === 'ذكر' ? 'pi pi-mars text-blue-500' : 'pi pi-venus text-pink-500'" class="text-lg"></i>
                                    </div>

                                    <span class="text-sm font-medium text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 px-4 py-1.5 rounded-full flex items-center gap-2 mb-5">
                                        <i class="pi pi-car text-orange-500"></i>
                                        {{ driver.carType }}
                                    </span>

                                    <!-- Contact Info Grid -->
                                    <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                                        <!-- Phone -->
                                        <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                                            <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                                <i class="pi pi-phone text-green-600 dark:text-green-400 text-sm"></i>
                                            </div>
                                            <span class="text-sm font-semibold text-surface-700 dark:text-surface-200 truncate" dir="ltr">{{ driver.phone }}</span>
                                        </div>

                                        <!-- Email -->
                                        <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                                            <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                                <i class="pi pi-envelope text-red-600 dark:text-red-400 text-sm"></i>
                                            </div>
                                            <span class="text-sm font-semibold text-surface-700 dark:text-surface-200 truncate" [title]="driver.email">{{ driver.email }}</span>
                                        </div>
                                    </div>

                                    <!-- Seats & Car Info -->
                                    <div class="w-full flex justify-between bg-surface-50 dark:bg-surface-800 rounded-xl p-4 mb-2 border border-surface-200 dark:border-surface-700 mt-auto">
                                        <div class="flex flex-col items-center flex-1">
                                            <span class="text-xs text-surface-500 mb-1 flex items-center gap-1"><i class="pi pi-id-card"></i> اللوحة</span>
                                            <span class="font-bold text-sm text-surface-900 dark:text-surface-0">{{ driver.carNumber }}</span>
                                        </div>
                                        <div class="w-px bg-surface-200 dark:bg-surface-700 my-1"></div>
                                        <div class="flex flex-col items-center flex-1">
                                            <span class="text-xs text-surface-500 mb-1 flex items-center gap-1"><i class="pi pi-users"></i> المقاعد</span>
                                            <span class="font-bold text-sm text-surface-900 dark:text-surface-0">{{ driver.totalSeats }}</span>
                                        </div>
                                        <div class="w-px bg-surface-200 dark:bg-surface-700 my-1"></div>
                                        <div class="flex flex-col items-center flex-1">
                                            <span class="text-xs text-surface-500 mb-1 flex items-center gap-1"><i class="pi pi-check-circle"></i> المتاح</span>
                                            <span class="font-bold text-sm" [ngClass]="driver.availableSeats > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'">{{ driver.availableSeats ?? 0 }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="p-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/30 flex gap-3 shrink-0" (click)="$event.stopPropagation()">
                                    <p-button icon="pi pi-pencil" label="تعديل" class="flex-1" styleClass="w-full p-button-sm" (onClick)="editDriver(driver.id)" [disabled]="selectedDrives && selectedDrives.length > 1"></p-button>
                                    <p-button icon="pi pi-trash" severity="danger" [outlined]="true" styleClass="w-auto px-4 p-button-sm" (onClick)="openConfirmation(driver.id)" [disabled]="selectedDrives && selectedDrives.length > 1"></p-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
        </div>

        <p-dialog [(visible)]="orderDialog" [style]="{ width: '560px' }" [header]="isEditMode ? 'تعديل بيانات الكابتن' : 'إضافة كابتن جديد'" [modal]="true" [draggable]="false" [resizable]="false">
            <ng-template #content>
                <form [formGroup]="driverForm" class="flex flex-col gap-4 mt-2">
                    <!-- الاسم -->
                    <p-inputgroup>
                        <p-inputgroup-addon><i class="pi pi-user"></i></p-inputgroup-addon>
                        <input
                            pInputText
                            formControlName="txtName"
                            [placeholder]="driverForm.get('txtName')?.touched && driverForm.get('txtName')?.hasError('required') ? 'الاسم مطلوب' : 'اسم الكابتن'"
                            class="w-full"
                            [ngClass]="{ 'p-invalid': driverForm.get('txtName')?.touched && driverForm.get('txtName')?.hasError('required') }"
                        />
                    </p-inputgroup>
                    <div class="grid grid-cols-12 gap-3">
                        <div class="col-span-6">
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-phone"></i></p-inputgroup-addon>
                                <input
                                    pInputText
                                    formControlName="txtPhone"
                                    [placeholder]="driverForm.get('txtPhone')?.touched && driverForm.get('txtPhone')?.hasError('required') ? 'رقم الهاتف مطلوب' : 'رقم الهاتف'"
                                    class="w-full"
                                    [ngClass]="{ 'p-invalid': driverForm.get('txtPhone')?.touched && driverForm.get('txtPhone')?.hasError('required') }"
                                />
                            </p-inputgroup>
                        </div>
                        <div class="col-span-6">
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-envelope"></i></p-inputgroup-addon>
                                <input
                                    pInputText
                                    formControlName="txtEmail"
                                    [placeholder]="
                                        driverForm.get('txtEmail')?.touched && driverForm.get('txtEmail')?.hasError('required')
                                            ? 'البريد الإلكتروني مطلوب'
                                            : driverForm.get('txtEmail')?.hasError('email')
                                              ? 'بريد إلكتروني غير صحيح'
                                              : 'البريد الإلكتروني'
                                    "
                                    class="w-full"
                                    [ngClass]="{ 'p-invalid': driverForm.get('txtEmail')?.touched && (driverForm.get('txtEmail')?.hasError('required') || driverForm.get('txtEmail')?.hasError('email')) }"
                                />
                            </p-inputgroup>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-3">
                        <div class="col-span-6">
                            <!-- الجنس -->
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-users"></i></p-inputgroup-addon>
                                <p-select
                                    formControlName="txtGender"
                                    [options]="genderOptions"
                                    optionLabel="name"
                                    optionValue="value"
                                    [styleClass]="driverForm.get('txtGender')?.touched && driverForm.get('txtGender')?.hasError('required') ? 'p-invalid w-full' : 'w-full'"
                                    [placeholder]="driverForm.get('txtGender')?.touched && driverForm.get('txtGender')?.hasError('required') ? 'الجنس مطلوب' : 'الجنس'"
                                >
                                </p-select>
                            </p-inputgroup>
                        </div>

                        <div class="col-span-6">
                            <!-- الحالة -->
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-info-circle"></i></p-inputgroup-addon>
                                <p-select
                                    formControlName="txtStatus"
                                    [options]="statusOptions"
                                    optionLabel="name"
                                    optionValue="value"
                                    [styleClass]="driverForm.get('txtStatus')?.touched && driverForm.get('txtStatus')?.hasError('required') ? 'p-invalid w-full' : 'w-full'"
                                    [placeholder]="driverForm.get('txtStatus')?.touched && driverForm.get('txtStatus')?.hasError('required') ? 'الحالة مطلوبة' : 'الحالة'"
                                >
                                </p-select>
                            </p-inputgroup>
                        </div>
                    </div>

                    <!-- السيارة -->
                    <div class="grid grid-cols-12 gap-3">
                        <div class="col-span-4">
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-car"></i></p-inputgroup-addon>
                                <input pInputText formControlName="txtCarType" placeholder="نوع السيارة" />
                            </p-inputgroup>
                        </div>
                        <div class="col-span-4">
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-id-card"></i></p-inputgroup-addon>
                                <input pInputText formControlName="txtCarNumber" placeholder="رقم السيارة" />
                            </p-inputgroup>
                        </div>
                        <div class="col-span-4">
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-users"></i></p-inputgroup-addon>
                                <input pInputText type="number" formControlName="txtTotalSeats" placeholder="عدد المقاعد" />
                            </p-inputgroup>
                        </div>
                    </div>

                    <!-- الصورة -->
                    <div class="col-span-8 flex flex-col gap-1">
                        <input #fileInput type="file" accept="image/*" style="display:none" (change)="onFileSelected($event)" />
                        <p-button [label]="selectedFileName || 'اختر صورة'" icon="pi pi-image" severity="info" class="w-full" styleClass="w-full" (onClick)="fileInput.click()"> </p-button>
                    </div>
                </form>
            </ng-template>

            <ng-template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <p-button label="إلغاء" icon="pi pi-times" text (click)="hideDialog()" />
                    <p-button *ngIf="!isEditMode" label="حفظ" icon="pi pi-check" (click)="saveDrive()" [disabled]="driverForm.invalid" />
                    <p-button *ngIf="isEditMode" label="تعديل" icon="pi pi-pencil" severity="info" (click)="updateDriver()" [disabled]="driverForm.invalid" />
                </div>
            </ng-template>
        </p-dialog>

        <!-- delete confirmation dialog -->
        <p-dialog [(visible)]="displayConfirmation" [style]="{ width: '350px' }" header="تأكيد الحذف" [modal]="true" [closable]="true">
            <div class="flex items-center justify-center p-4">
                <i class="pi pi-exclamation-triangle mr-4 text-orange-500" style="font-size: 2rem"></i>
                <span>هل أنت متأكد من حذف المختار؟</span>
            </div>
            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2">
                    <p-button label="إلغاء" icon="pi pi-times" (onClick)="closeConfirmation()" text severity="secondary" />
                    <p-button label="حذف" icon="pi pi-check" severity="danger" (onClick)="confirmDeleteAction()" />
                </div>
            </ng-template>
        </p-dialog>

    `
})
export class Drivers implements OnInit {
    // ── Dialog States ─────────────────────────────────
    orderDialog = false;
    displayConfirmation = false;

    // ── Form & Edit States ────────────────────────────
    driverForm!: FormGroup;
    isEditMode = false;
    selectedDriveId: string | null = null;
    selectedFile!: File;
    selectedFileName: string | null = null;

    // ── Data & Filter States ──────────────────────────
    driveList: any[] = [];
    originalList: any[] = [];
    selectedDrives: DriveDTO[] | null = null;
    loading = false;
    isFiltered = false;
    searchQuery: string = '';
    layout: 'list' | 'grid' = 'list';
    driveIdToDelete: string | null = null;

    // ── Options ───────────────────────────────────────
    statusOptions = [
        { name: 'متوفر', value: 'متوفر' },
        { name: 'غير متوفر', value: 'غير متوفر' }
    ];
    genderOptions = [
        { name: 'ذكر', value: 'ذكر' },
        { name: 'أنثى', value: 'أنثى' }
    ];

    constructor(
        private driverService: DriverService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.loadAll();
        this.buildForm();
    }

    hideDialog() {
        this.orderDialog = false;
        this.isEditMode = false;
        this.selectedDriveId = null;
        this.selectedFile = null!;
        this.selectedFileName = null;
        if (this.driverForm) this.driverForm.reset();
    }

    // build reactive form with validators
    buildForm() {
        this.driverForm = this.formBuilder.group({
            txtName: ['', Validators.required],
            txtGender: [null, Validators.required],
            txtPhone: ['', Validators.required],
            txtEmail: ['', [Validators.required, Validators.email]],
            txtCarType: ['', Validators.required],
            txtCarNumber: ['', Validators.required],
            txtStatus: [null, Validators.required],
            txtTotalSeats: ['', Validators.required],
            txtImage: [null]
        });
    }

    // load all drivers from API
    loadAll() {
        this.loading = true;
        this.driverService.loadAll().subscribe({
            next: (data) => {
                this.driveList = data;
                this.originalList = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => (this.loading = false)
        });
    }

    openNew() {
        this.hideDialog();
        this.orderDialog = true;
    }

    // navigate to add driver page

    // navigate to edit driver page

    // global search filter
    onGlobalSearch() {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            // Restore original list if query is empty
            this.driveList = this.isFiltered ? this.originalList.filter((d) => d.availableSeats > 0) : [...this.originalList];
        } else {
            const query = this.searchQuery.toLowerCase();
            const sourceList = this.isFiltered ? this.originalList.filter((d) => d.availableSeats > 0) : this.originalList;

            this.driveList = sourceList.filter(
                (driver) =>
                    driver.name?.toLowerCase().includes(query) ||
                    driver.phone?.toLowerCase().includes(query) ||
                    driver.email?.toLowerCase().includes(query) ||
                    driver.carType?.toLowerCase().includes(query) ||
                    driver.carNumber?.toLowerCase().includes(query) ||
                    driver.status?.toLowerCase().includes(query) ||
                    driver.gender?.toLowerCase().includes(query) ||
                    driver.totalSeats?.toString().includes(query) ||
                    driver.availableSeats?.toString().includes(query)
            );
        }

        // Let table also apply this filter to its paginator immediately
        this.cdr.detectChanges();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    // clear search input
    clearSearch(table?: Table, input?: HTMLInputElement) {
        if (input) input.value = '';
        this.searchQuery = '';
        if (table) table.filterGlobal('', 'contains');
        this.onGlobalSearch();
    }

    // toggle available drivers filter
    toggleFilter() {
        this.isFiltered = !this.isFiltered;
        this.driveList = this.isFiltered ? this.originalList.filter((d) => d.availableSeats > 0) : this.originalList;
    }
    // handle file selection
    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            // توليد اسم عشوائي من 6 أحرف/أرقام
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomName = '';
            for (let i = 0; i < 6; i++) {
                randomName += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            const extension = file.name.split('.').pop();
            const newFileName = `${randomName}.${extension}`;

            // إنشاء ملف جديد بالاسم الجديد
            const renamedFile = new File([file], newFileName, { type: file.type });

            this.selectedFile = renamedFile;
            this.selectedFileName = newFileName;

            this.driverForm.patchValue({ txtImage: renamedFile });
            this.driverForm.get('txtImage')?.markAsDirty();

            this.cdr.detectChanges();
        }
    }
    // get tag severity based on status
    getStatusSeverity(status: string) {
        return status === 'متوفر' ? 'success' : 'danger';
    }

    // open delete confirmation for single driver
    openConfirmation(id: string) {
        this.driveIdToDelete = id;
        this.displayConfirmation = true;
        this.cdr.detectChanges();
    }

    // open delete confirmation for bulk delete
    deleteSelectedDrives() {
        if (!this.selectedDrives || !this.selectedDrives.length) return;
        this.driveIdToDelete = null;
        this.displayConfirmation = true;
    }

    // confirm delete based on single or bulk
    confirmDeleteAction() {
        if (this.driveIdToDelete) {
            this.deleteSingle();
        } else if (this.selectedDrives && this.selectedDrives.length > 0) {
            this.deleteBulk();
        }
    }

    // Grid selection helpers
    isDriverSelected(driver: any): boolean {
        return this.selectedDrives ? this.selectedDrives.some((d) => d.id === driver.id) : false;
    }

    toggleDriverSelection(driver: any) {
        if (!this.selectedDrives) {
            this.selectedDrives = [];
        }

        const index = this.selectedDrives.findIndex((d) => d.id === driver.id);
        if (index > -1) {
            this.selectedDrives.splice(index, 1);
        } else {
            this.selectedDrives.push(driver);
        }

        // Reassign to trigger Angular change detection for p-table and buttons
        this.selectedDrives = [...this.selectedDrives];
    }

    // delete single driver
    private deleteSingle() {
        if (!this.driveIdToDelete) return;

        this.driverService.Delete(this.driveIdToDelete).subscribe({
            next: () => {
                this.handleSuccess('تم حذف الكابتن بنجاح!', 'delete');
                this.closeConfirmation();
            },
            error: (err) => {
                this.handleDeleteError(err);
                this.closeConfirmation();
            }
        });
    }

    private deleteBulk() {
        const requests = this.selectedDrives!.map((d) => this.driverService.Delete(d.id));

        forkJoin(requests).subscribe({
            next: () => {
                const count = this.selectedDrives?.length;
                this.selectedDrives = null;
                this.handleSuccess(`تم حذف ${count} كباتن بنجاح!`, 'delete');
                this.closeConfirmation();
            },
            error: (err) => {
                this.handleDeleteError(err);
                this.closeConfirmation();
            }
        });
    }

    // handle successful action and refresh
    private handleSuccess(msg: string, type: 'success' | 'update' | 'delete' = 'success') {
        if (type === 'success') this.notificationService.success();
        else if (type === 'update') this.notificationService.update();
        else if (type === 'delete') this.notificationService.delete();
        this.loadAll();
    }

    // handle delete error
    private handleDeleteError(error: any) {
        const msg = error?.error ? error.error : 'لا يمكن حذف الكابتن لأنه مرتبط بمشتركين';
        this.notificationService.error(msg);
    }

    // close delete confirmation dialog
    closeConfirmation() {
        this.displayConfirmation = false;
        this.driveIdToDelete = null;
        this.cdr.detectChanges();
    }
    saveDrive() {
        if (this.driverForm.invalid) return;

        const newDriver = this.buildDriverObject();

        this.driverService.insert(newDriver).subscribe({
            next: () => {
                this.notificationService.success();
                this.loadAll();
                this.hideDialog();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء الحفظ');
            }
        });
    }

    private buildDriverObject(): DriveDTO {
        const driver = new DriveDTO();
        const v = this.driverForm.value;

        if (this.isEditMode && this.selectedDriveId) {
            driver.id = this.selectedDriveId;
        }

        driver.name = v.txtName;
        driver.gender = v.txtGender;
        driver.phone = v.txtPhone;
        driver.email = v.txtEmail;
        driver.carType = v.txtCarType;
        driver.carNumber = v.txtCarNumber;
        driver.status = v.txtStatus;
        driver.totalSeats = v.txtTotalSeats;

        if (this.selectedFile) {
            driver.vehicleImageFile = this.selectedFile;
        }

        return driver;
    }

    editDriver(id: string) {
        const driver = this.driveList.find((d) => d.id === id);
        if (!driver) return;

        this.hideDialog(); // Reset state
        this.selectedDriveId = id;
        this.isEditMode = true;

        this.driverForm.patchValue({
            txtName: driver.name,
            txtGender: driver.gender,
            txtPhone: driver.phone,
            txtEmail: driver.email,
            txtCarType: driver.carType,
            txtCarNumber: driver.carNumber,
            txtStatus: driver.status,
            txtTotalSeats: driver.totalSeats,
            txtImage: null // Reset file input
        });

        // Show current image name if exists
        if (driver.vehicleImage) {
            const fullName = driver.vehicleImage.split('/').pop() || '';
            this.selectedFileName = fullName.length > 10 ? fullName.substring(0, 10) + '...' : fullName;
        }

        this.orderDialog = true;
        this.cdr.detectChanges();
    }

    updateDriver() {
        if (this.driverForm.invalid || !this.selectedDriveId) {
            this.driverForm.markAllAsTouched();
            return;
        }

        const updatedDriver = this.buildDriverObject();

        this.driverService.UpdateDriver(updatedDriver).subscribe({
            next: () => {
                this.notificationService.update();
                this.hideDialog();

                // ✅ حدّث البيانات محلياً فوراً
                const index = this.driveList.findIndex((d) => d.id === this.selectedDriveId);
                if (index !== -1) {
                    const old = this.driveList[index];
                    const newTotalSeats = updatedDriver.totalSeats;
                    const usedSeats = old.totalSeats - old.availableSeats;

                    this.driveList[index] = {
                        ...old,
                        name: updatedDriver.name,
                        gender: updatedDriver.gender,
                        phone: updatedDriver.phone,
                        email: updatedDriver.email,
                        carType: updatedDriver.carType,
                        carNumber: updatedDriver.carNumber,
                        status: updatedDriver.status,
                        totalSeats: newTotalSeats,
                        availableSeats: Math.max(0, newTotalSeats - usedSeats)
                    };
                    this.driveList = [...this.driveList];
                    this.originalList = [...this.driveList];
                }

                this.cdr.detectChanges();
                this.loadAll(); // ✅ بعدين reload للتأكد
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء التعديل');
            }
        });
    }
}
