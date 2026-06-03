import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { Message } from 'primeng/message';
import { DataView } from 'primeng/dataview';
import { CheckboxModule } from 'primeng/checkbox';

// model and service imports
import { ClientDTO } from '@/app/Model/clientDTO';
import { ClientService } from '../../service/client.service';
import { NotificationService } from '@/app/shared/services/notification.service';

@Component({
    selector: 'app-client',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        RippleModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        InputGroupAddon,
        InputGroup,
        Message,
        ReactiveFormsModule,
        FormsModule,
        RadioButtonModule,
        DataView,
        CheckboxModule
    ],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">إدارة العملاء</div>

            <p-dataview
                [value]="clientList"
                [layout]="layout"
                [paginator]="layout === 'grid'"
                [rows]="9"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="عرض {first} إلى {last} من أصل {totalRecords} عملاء"
                [rowsPerPageOptions]="[9, 18, 27]"
            >
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
                            <p-button label="جديد" icon="pi pi-plus" severity="secondary" class="ml-2" (onClick)="openNew()" />
                            <p-button
                                [severity]="!selectedClients || selectedClients.length < 2 ? 'secondary' : 'danger'"
                                [outlined]="!selectedClients || selectedClients.length < 2"
                                label="حذف المحدد"
                                icon="pi pi-trash"
                                (onClick)="deleteSelectedClients()"
                                [disabled]="!selectedClients || selectedClients.length < 2"
                            />
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

                <ng-template #list let-items>
                    <!-- clients table -->
                    <p-table
                        #dt
                        [value]="clientList"
                        [(selection)]="selectedClients"
                        [rows]="10"
                        [paginator]="true"
                        [globalFilterFields]="['name', 'phone', 'email', 'gender']"
                        [tableStyle]="{ 'min-width': '75rem' }"
                        [rowHover]="true"
                        dataKey="id"
                        currentPageReportTemplate="عرض {first} إلى {last} من أصل {totalRecords} عملاء"
                        [showCurrentPageReport]="true"
                        [rowsPerPageOptions]="[10, 20, 30]"
                    >
                        <ng-template #header>
                            <tr>
                                <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
                                <th pSortableColumn="name" style="min-width:16rem">الاسم <p-sortIcon field="name" /></th>
                                <th pSortableColumn="phone" style="min-width:12rem">الهاتف <p-sortIcon field="phone" /></th>
                                <th pSortableColumn="email" style="min-width:14rem">الإيميل <p-sortIcon field="email" /></th>
                                <th pSortableColumn="gender" style="min-width:8rem">الجنس <p-sortIcon field="gender" /></th>
                                <th style="min-width:8rem">تواصل</th>
                                <th style="min-width: 10rem">العمليات</th>
                            </tr>
                        </ng-template>

                        <ng-template #body let-Client>
                            <tr>
                                <td><p-tableCheckbox [value]="Client" /></td>
                                <td>{{ Client.name }}</td>
                                <td>{{ Client.phone }}</td>
                                <td>{{ Client.email }}</td>
                                <td>
                                    <span [ngClass]="Client.gender === 'ذكر' ? 'text-blue-500' : 'text-pink-500'">
                                        <i [class]="Client.gender === 'ذكر' ? 'pi pi-mars' : 'pi pi-venus'"></i>
                                        {{ Client.gender }}
                                    </span>
                                </td>
                                <td>
                                    <a [href]="'https://wa.me/' + Client.phone" target="_blank" rel="noopener noreferrer">
                                        <p-button icon="pi pi-whatsapp" [rounded]="true" [outlined]="true" severity="success" [disabled]="selectedClients && selectedClients.length > 1" />
                                    </a>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" (onClick)="editClient(Client.id)" [disabled]="selectedClients && selectedClients.length > 1" />
                                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (onClick)="openConfirmation(Client.id)" [disabled]="selectedClients && selectedClients.length > 1" />
                                    </div>
                                </td>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="loadingbody">
                            <tr>
                                <td colspan="7">جاري التحميل...</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </ng-template>

                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        <div *ngFor="let client of items" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                            <!-- Modern Profile Card -->
                            <div
                                class="relative bg-surface-0 dark:bg-surface-900 border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer overflow-hidden h-full"
                                [ngClass]="
                                    isClientSelected(client)
                                        ? 'border-primary-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)] dark:shadow-[0_0_0_2px_rgba(96,165,250,0.2)] bg-primary-50/50 dark:bg-primary-900/10'
                                        : 'border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600'
                                "
                                (click)="toggleClientSelection(client)"
                            >
                                <!-- Top Elements -->
                                <div class="absolute z-20 right-4 top-4" (click)="$event.stopPropagation()">
                                    <p-checkbox [binary]="true" [ngModel]="isClientSelected(client)" (onChange)="toggleClientSelection(client)"></p-checkbox>
                                </div>
                                <div class="absolute z-20 left-4 top-4" (click)="$event.stopPropagation()">
                                    <a [href]="'https://wa.me/' + client.phone" target="_blank" rel="noopener noreferrer">
                                        <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center hover:scale-110 transition-transform">
                                            <i class="pi pi-whatsapp text-green-600 dark:text-green-400"></i>
                                        </div>
                                    </a>
                                </div>

                                <!-- Cover Gradient Banner -->
                                <div class="relative w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden shrink-0">
                                    <div class="absolute inset-0 bg-black/10"></div>
                                </div>

                                <!-- Overlapping Avatar -->
                                <div class="flex justify-center -mt-12 relative z-20 shrink-0">
                                    <div class="w-24 h-24 rounded-full border-4 border-surface-0 dark:border-surface-900 bg-surface-100 dark:bg-surface-800 shadow-md flex items-center justify-center overflow-hidden">
                                        <span class="text-3xl font-bold text-surface-500">{{ getInitials(client.name) }}</span>
                                    </div>
                                </div>

                                <!-- Card Content -->
                                <div class="p-5 flex-1 flex flex-col items-center">
                                    <!-- Name and Identity -->
                                    <div class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-1 text-center truncate w-full flex items-center justify-center gap-2" [title]="client.name">
                                        <span class="truncate">{{ client.name }}</span>
                                        <i [class]="client.gender === 'ذكر' ? 'pi pi-mars text-blue-500' : 'pi pi-venus text-pink-500'" class="text-lg"></i>
                                    </div>

                                    <span class="text-sm font-medium text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 px-4 py-1 rounded-full mb-5"> عميل </span>

                                    <!-- Contact Info Grid -->
                                    <div class="w-full flex flex-col gap-3 mb-5 mt-auto">
                                        <!-- Phone -->
                                        <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                                            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                                <i class="pi pi-phone text-blue-600 dark:text-blue-400 text-sm"></i>
                                            </div>
                                            <span class="text-sm font-semibold text-surface-700 dark:text-surface-200 truncate" dir="ltr">{{ client.phone }}</span>
                                        </div>

                                        <!-- Email -->
                                        <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                                            <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                                                <i class="pi pi-envelope text-orange-600 dark:text-orange-400 text-sm"></i>
                                            </div>
                                            <span class="text-sm font-semibold text-surface-700 dark:text-surface-200 truncate" [title]="client.email">{{ client.email }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="p-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/30 flex gap-3 shrink-0" (click)="$event.stopPropagation()">
                                    <p-button icon="pi pi-pencil" label="تعديل" class="flex-1" styleClass="w-full p-button-sm" (onClick)="editClient(client.id)" [disabled]="selectedClients && selectedClients.length > 1"></p-button>
                                    <p-button icon="pi pi-trash" severity="danger" [outlined]="true" styleClass="w-auto px-4 p-button-sm" (onClick)="openConfirmation(client.id)" [disabled]="selectedClients && selectedClients.length > 1"></p-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
        </div>

        <!-- add / edit dialog -->
        <p-dialog [(visible)]="clientDialog" [style]="{ width: '450px' }" [header]="isEditMode ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'" [modal]="true" [draggable]="false" [resizable]="false">
            <ng-template #content>
                <!-- client form -->
                <form [formGroup]="clientForm" class="flex flex-col gap-4 mt-2">
                    <div class="flex flex-col gap-1">
                        <p-inputgroup>
                            <p-inputgroup-addon><i class="pi pi-user"></i></p-inputgroup-addon>
                            <input pInputText placeholder="اسم العميل" formControlName="txtName" />
                        </p-inputgroup>
                        <p-message severity="error" variant="simple" size="small" *ngIf="clientForm.get('txtName')?.touched && clientForm.get('txtName')?.hasError('required')"> الاسم مطلوب </p-message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <p-inputgroup>
                            <p-inputgroup-addon><i class="pi pi-at"></i></p-inputgroup-addon>
                            <input pInputText placeholder="البريد الإلكتروني" formControlName="txtEmail" />
                        </p-inputgroup>
                        <p-message severity="error" variant="simple" size="small" *ngIf="clientForm.get('txtEmail')?.touched && clientForm.get('txtEmail')?.hasError('required')"> البريد الإلكتروني مطلوب </p-message>
                        <p-message severity="error" variant="simple" size="small" *ngIf="clientForm.get('txtEmail')?.touched && clientForm.get('txtEmail')?.hasError('email') && !clientForm.get('txtEmail')?.hasError('required')">
                            يرجى إدخال بريد إلكتروني صحيح
                        </p-message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <p-inputgroup>
                            <p-inputgroup-addon><i class="pi pi-phone"></i></p-inputgroup-addon>
                            <input pInputText placeholder="رقم الهاتف" formControlName="txtPhone" />
                        </p-inputgroup>
                        <p-message severity="error" variant="simple" size="small" *ngIf="clientForm.get('txtPhone')?.touched && clientForm.get('txtPhone')?.hasError('required')"> رقم الهاتف مطلوب </p-message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <p-inputgroup>
                            <p-inputgroup-addon><i class="pi pi-users"></i></p-inputgroup-addon>
                            <p-inputgroup-addon class="flex-1 bg-white border-r-0">
                                <div class="flex items-center gap-2">
                                    <p-radioButton id="male" name="txtGender" value="ذكر" formControlName="txtGender"></p-radioButton>
                                    <label for="male" class="cursor-pointer">ذكر</label>
                                </div>
                            </p-inputgroup-addon>
                            <p-inputgroup-addon class="flex-1 bg-white">
                                <div class="flex items-center gap-2">
                                    <p-radioButton id="female" name="txtGender" value="أنثى" formControlName="txtGender"></p-radioButton>
                                    <label for="female" class="cursor-pointer">أنثى</label>
                                </div>
                            </p-inputgroup-addon>
                        </p-inputgroup>
                        <p-message severity="error" variant="simple" size="small" *ngIf="clientForm.get('txtGender')?.touched && clientForm.get('txtGender')?.hasError('required')"> الجنس مطلوب </p-message>
                    </div>
                </form>
            </ng-template>

            <ng-template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <p-button label="إلغاء" icon="pi pi-times" text (click)="hideDialog()" />
                    <p-button *ngIf="!isEditMode" label="حفظ" icon="pi pi-check" (click)="saveClient()" [disabled]="clientForm.invalid" />
                    <p-button *ngIf="isEditMode" label="تعديل" icon="pi pi-pencil" severity="info" (click)="updateClient()" [disabled]="clientForm.invalid" />
                </div>
            </ng-template>
        </p-dialog>

        <!-- delete confirmation dialog -->
        <p-dialog [(visible)]="displayConfirmation" [style]="{ width: '350px' }" header="تأكيد الحذف" [modal]="true">
            <div class="flex items-center justify-center p-4">
                <i class="pi pi-exclamation-triangle mr-4 text-orange-500" style="font-size: 2rem"></i>
                <span>هل أنت متأكد من حذف المختار؟</span>
            </div>
            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button label="إلغاء" icon="pi pi-times" (onClick)="closeConfirmation()" text severity="secondary" />
                    <p-button label="حذف" icon="pi pi-check" severity="danger" (onClick)="confirmDeleteAction()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class Client implements OnInit {
    // data and state
    clientList: any[] = [];
    originalList: any[] = [];
    selectedClients: ClientDTO[] | null = null;
    selectedClientId: string | null = null;
    loading = false;
    searchQuery: string = '';
    layout: 'list' | 'grid' = 'list';

    // dialog flags
    clientDialog = false;
    isEditMode = false;
    showSuccess = false;
    showError = false;

    // delete dialog flags
    displayConfirmation = false;
    clientIdToDelete: string | null = null;

    // reactive form
    clientForm!: FormGroup;

    constructor(
        private clientService: ClientService,
        private cdr: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.loadAll();
        this.buildForm();
    }

    // build reactive form with validators
    buildForm() {
        this.clientForm = this.formBuilder.group({
            txtName: ['', Validators.required],
            txtGender: ['', Validators.required],
            txtPhone: ['', Validators.required],
            txtEmail: ['', [Validators.required, Validators.email]]
        });
    }

    // load all clients
    loadAll() {
        this.loading = true;
        this.clientService.loadAll().subscribe({
            next: (data) => {
                this.clientList = data;
                this.originalList = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => (this.loading = false)
        });
    }

    // open add dialog
    openNew() {
        this.selectedClientId = null;
        this.isEditMode = false;
        this.clientForm.reset();
        this.clientDialog = true;
    }

    // open edit dialog
    editClient(id: string) {
        this.selectedClientId = id;
        const client = this.originalList.find((c) => c.id === id);
        if (client) {
            this.clientForm.patchValue({
                txtName: client.name,
                txtEmail: client.email,
                txtPhone: client.phone,
                txtGender: client.gender
            });
            this.isEditMode = true;
            this.clientDialog = true;
            this.cdr.detectChanges();
        }
    }

    // hide dialog
    hideDialog() {
        this.clientDialog = false;
        this.isEditMode = false;
        this.selectedClientId = null;
    }

    // save new client
    saveClient() {
        if (this.clientForm.valid) {
            const newClient = new ClientDTO();
            newClient.name = this.clientForm.value['txtName'];
            newClient.gender = this.clientForm.value['txtGender'];
            newClient.phone = this.clientForm.value['txtPhone'];
            newClient.email = this.clientForm.value['txtEmail'];

            this.clientService.insert(newClient).subscribe({
                next: () => {
                    this.notificationService.success();
                    this.clientDialog = false;
                    this.clientForm.reset();
                    this.loadAll();
                },
                error: () => {
                    this.notificationService.error();
                    this.cdr.detectChanges();
                }
            });
        }
    }

    // update existing client
    updateClient() {
        if (this.clientForm.valid && this.selectedClientId) {
            const updatedClient = new ClientDTO();
            updatedClient.id = this.selectedClientId;
            updatedClient.name = this.clientForm.value['txtName'];
            updatedClient.email = this.clientForm.value['txtEmail'];
            updatedClient.phone = this.clientForm.value['txtPhone'];
            updatedClient.gender = this.clientForm.value['txtGender'];

            this.clientService.UpdateClient(updatedClient).subscribe({
                next: () => {
                    this.notificationService.update();
                    this.clientDialog = false;
                    this.isEditMode = false;
                    this.selectedClientId = null;
                    this.loadAll();
                },
                error: () => {
                    this.notificationService.error();
                    this.cdr.detectChanges();
                }
            });
        }
    }

    // global search
    onGlobalSearch() {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            this.clientList = [...this.originalList];
        } else {
            const query = this.searchQuery.toLowerCase();
            this.clientList = this.originalList.filter(
                (client) => client.name?.toLowerCase().includes(query) || client.phone?.toLowerCase().includes(query) || client.email?.toLowerCase().includes(query) || client.gender?.toLowerCase().includes(query)
            );
        }
        this.cdr.detectChanges();
    }

    // clear search
    clearSearch(input?: HTMLInputElement) {
        if (input) input.value = '';
        this.searchQuery = '';
        this.onGlobalSearch();
    }

    // grid selection helpers
    isClientSelected(client: any): boolean {
        return this.selectedClients ? this.selectedClients.some((c) => c.id === client.id) : false;
    }

    toggleClientSelection(client: any) {
        if (!this.selectedClients) {
            this.selectedClients = [];
        }

        const index = this.selectedClients.findIndex((c) => c.id === client.id);
        if (index > -1) {
            this.selectedClients.splice(index, 1);
        } else {
            this.selectedClients.push(client);
        }

        this.selectedClients = [...this.selectedClients];
    }

    // open delete confirmation
    openConfirmation(id: string) {
        this.clientIdToDelete = id;
        this.displayConfirmation = true;
        this.cdr.detectChanges();
    }

    // confirm delete action
    confirmDeleteAction() {
        if (this.clientIdToDelete) {
            this.confirmSingleDelete();
        } else if (this.selectedClients && this.selectedClients.length > 0) {
            this.executeBulkDelete();
        }
    }

    // delete single client
    private confirmSingleDelete() {
        if (!this.clientIdToDelete) return;
        this.clientService.Delete(this.clientIdToDelete).subscribe({
            next: () => {
                this.notificationService.delete();
                this.closeConfirmation();
                this.loadAll();
            },
            error: () => this.notificationService.error()
        });
    }

    // open bulk delete confirmation
    deleteSelectedClients() {
        if (!this.selectedClients || !this.selectedClients.length) return;
        this.clientIdToDelete = null;
        this.displayConfirmation = true;
    }

    // delete multiple clients
    private executeBulkDelete() {
        const requests = this.selectedClients!.map((c) => this.clientService.Delete(c.id));
        forkJoin(requests).subscribe({
            next: () => {
                this.selectedClients = null;
                this.notificationService.delete();
                this.closeConfirmation();
                this.loadAll();
            },
            error: () => this.notificationService.error()
        });
    }

    closeConfirmation() {
        this.displayConfirmation = false;
        this.clientIdToDelete = null;
        this.cdr.detectChanges();
    }

    // helper to get initials for avatar
    getInitials(name: string): string {
        if (!name) return 'C';
        const parts = name.trim().split(' ');
        if (parts.length > 1) {
            return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
}
