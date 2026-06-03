import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/message';
import { AccountService, UserDTO, RoleDTO, SignUpDTO } from '../../service/account.service';

@Component({
    selector: 'app-account-management',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TagModule, ToastModule, SkeletonModule, PasswordModule, InputGroupModule, InputGroupAddonModule, Message],
    providers: [MessageService],
    template: `
        <p-toast position="top-right" />

        <div class="card">
            <!-- Header -->
            <div class="flex items-center gap-3 mb-8">
                <div class="w-1 h-8 bg-primary rounded-full"></div>
                <div>
                    <div class="font-semibold text-xl">إدارة الحسابات والصلاحيات</div>
                    <div class="text-muted-color text-sm mt-0.5">تحكم بالمستخدمين وأدوارهم</div>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <!-- ── الأدوار ── -->
                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-shield text-primary"></i>
                            <span class="font-semibold text-lg">الأدوار</span>
                            <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                                {{ roles.length }}
                            </span>
                        </div>
                        <p-button label="إضافة دور" icon="pi pi-plus" severity="success" [outlined]="true" size="small" (onClick)="openRoleDialog()" />
                    </div>

                    <div class="border border-surface rounded-xl overflow-hidden">
                        <p-table [value]="roles" [loading]="loadingRoles" [rowHover]="true" styleClass="p-datatable-sm">
                            <ng-template #header>
                                <tr>
                                    <th class="text-muted-color text-xs font-semibold uppercase">#</th>
                                    <th class="text-muted-color text-xs font-semibold uppercase">الدور</th>
                                    <th class="text-muted-color text-xs font-semibold uppercase">المستخدمين</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-role let-i="rowIndex">
                                <tr>
                                    <td class="text-muted-color text-sm w-12">{{ i + 1 }}</td>
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" [ngClass]="getRoleIconBg(role.name)">
                                                <i [class]="getRoleIcon(role.name) + ' text-base'"></i>
                                            </div>
                                            <div>
                                                <div class="font-semibold text-sm">{{ role.name }}</div>
                                                <div class="text-muted-color text-xs">{{ getRoleDesc(role.name) }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="bg-surface-100 dark:bg-surface-800 text-sm font-medium px-2 py-0.5 rounded-full">
                                            {{ getUserCountByRole(role.name) }}
                                        </span>
                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template #emptymessage>
                                <tr>
                                    <td colspan="3" class="text-center py-8 text-muted-color">
                                        <i class="pi pi-shield text-3xl block mb-2 opacity-30"></i>
                                        لا توجد أدوار
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </div>

                <!-- ── المستخدمين ── -->
                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-users text-primary"></i>
                            <span class="font-semibold text-lg">المستخدمين</span>
                            <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                                {{ users.length }}
                            </span>
                        </div>
                        <p-button label="إضافة مستخدم" icon="pi pi-user-plus" severity="success" [outlined]="true" size="small" (onClick)="openUserDialog()" />
                    </div>

                    <div class="border border-surface rounded-xl overflow-hidden">
                        <p-table [value]="users" [loading]="loadingUsers" [rowHover]="true" styleClass="p-datatable-sm">
                            <ng-template #header>
                                <tr>
                                    <th class="text-muted-color text-xs font-semibold uppercase">المستخدم</th>
                                    <th class="text-muted-color text-xs font-semibold uppercase">الإيميل</th>
                                    <th class="text-muted-color text-xs font-semibold uppercase">الدور</th>
                                    <th class="text-muted-color text-xs font-semibold uppercase">العمليات</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-user>
                                <tr>
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" [ngClass]="getRoleIconBg(user.role)">
                                                <span [ngClass]="getAvatarTextColor(user.role)">
                                                    {{ user.name?.charAt(0)?.toUpperCase() }}
                                                </span>
                                            </div>
                                            <span class="font-medium text-sm">{{ user.name }}</span>
                                        </div>
                                    </td>
                                    <td class="text-muted-color text-sm">{{ user.email }}</td>
                                    <td>
                                        <div class="flex items-center gap-1.5">
                                            <i [class]="getRoleIcon(user.role) + ' text-xs'"></i>
                                            <p-tag [value]="user.role || 'بدون دور'" [severity]="getRoleSeverity(user.role)" />
                                        </div>
                                    </td>
                                    <td>
                                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" size="small" pTooltip="حذف المستخدم" (onClick)="openDeleteConfirm(user)" />
                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template #emptymessage>
                                <tr>
                                    <td colspan="3" class="text-center py-8 text-muted-color">
                                        <i class="pi pi-users text-3xl block mb-2 opacity-30"></i>
                                        لا يوجد مستخدمون
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </div>
            </div>
        </div>
        <p-dialog [(visible)]="deleteDialog" header="تأكيد الحذف" [modal]="true" [style]="{ width: '350px' }" [draggable]="false">
            <div *ngIf="!isDeleted" class="flex items-center gap-3 p-2">
                <i class="pi pi-exclamation-triangle text-orange-500 text-3xl"></i>
                <span
                    >هل أنت متأكد من حذف <strong>{{ userToDelete?.name }}</strong
                    >؟</span
                >
            </div>
            <div *ngIf="isDeleted" class="flex flex-col items-center justify-center py-6">
                <i class="pi pi-check-circle text-green-500" style="font-size: 4rem"></i>
                <h2 class="text-xl font-bold mt-4">تم الحذف بنجاح</h2>
            </div>
            <ng-template #footer>
                <div class="flex justify-end gap-2" *ngIf="!isDeleted">
                    <p-button label="إلغاء" icon="pi pi-times" text (click)="deleteDialog = false" />
                    <p-button label="حذف" icon="pi pi-trash" severity="danger" [loading]="deletingUser" (click)="confirmDelete()" />
                </div>
            </ng-template>
        </p-dialog>
        <!-- Dialog إضافة دور -->
        <p-dialog [(visible)]="roleDialog" header="إضافة دور جديد" [modal]="true" [style]="{ width: '400px' }" [draggable]="false" [resizable]="false">
            <ng-template #content>
                <form [formGroup]="roleForm" class="flex flex-col gap-4 mt-2" *ngIf="!showRoleSuccess">
                    <div class="flex flex-col gap-1">
                        <label class="text-sm font-medium">اسم الدور <span class="text-red-500">*</span></label>
                        <p-inputgroup>
                            <p-inputgroup-addon><i class="pi pi-shield"></i></p-inputgroup-addon>
                            <input pInputText formControlName="name" placeholder="مثال: Admin" />
                        </p-inputgroup>
                        <p-message severity="error" variant="simple" size="small" *ngIf="roleForm.get('name')?.touched && roleForm.get('name')?.invalid">مطلوب</p-message>
                    </div>
                </form>
                <div class="flex flex-col items-center justify-center py-8" *ngIf="showRoleSuccess">
                    <i class="pi pi-check-circle text-green-500" style="font-size: 5rem"></i>
                    <h2 class="text-xl font-bold mt-4">تم إضافة الدور بنجاح</h2>
                </div>
            </ng-template>
            <ng-template #footer>
                <div class="flex justify-end gap-2" *ngIf="!showRoleSuccess">
                    <p-button label="إلغاء" icon="pi pi-times" text (click)="roleDialog = false" />
                    <p-button label="حفظ" icon="pi pi-check" severity="success" (click)="saveRole()" [disabled]="roleForm.invalid" [loading]="savingRole" />
                </div>
            </ng-template>
        </p-dialog>

        <!-- Dialog إضافة مستخدم -->
        <p-dialog [(visible)]="userDialog" header="إضافة مستخدم جديد" [modal]="true" [style]="{ width: '500px' }" [draggable]="false" [resizable]="false">
            <ng-template #content>
                <form [formGroup]="userForm" class="flex flex-col gap-4 mt-2" *ngIf="!showUserSuccess">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">الاسم <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-user"></i></p-inputgroup-addon>
                                <input pInputText formControlName="name" placeholder="الاسم الكامل" />
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="userForm.get('name')?.touched && userForm.get('name')?.invalid">مطلوب</p-message>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">تاريخ الميلاد <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-calendar"></i></p-inputgroup-addon>
                                <input pInputText type="date" formControlName="dob" />
                            </p-inputgroup>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">الإيميل <span class="text-red-500">*</span></label>
                            <p-inputgroup>
                                <p-inputgroup-addon><i class="pi pi-envelope"></i></p-inputgroup-addon>
                                <input pInputText type="email" formControlName="email" placeholder="example@email.com" />
                            </p-inputgroup>
                            <p-message severity="error" variant="simple" size="small" *ngIf="userForm.get('email')?.touched && userForm.get('email')?.invalid">إيميل غير صحيح</p-message>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">الجنس</label>
                            <p-select formControlName="gender" [options]="genderOptions" optionLabel="name" optionValue="value" placeholder="اختر الجنس" class="w-full" appendTo="body" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-sm font-medium">كلمة المرور <span class="text-red-500">*</span></label>
                        <p-inputgroup>
                            <p-inputgroup-addon><i class="pi pi-lock"></i></p-inputgroup-addon>
                            <input pInputText [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="كلمة المرور" />
                            <p-inputgroup-addon>
                                <i class="cursor-pointer" [class]="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" (click)="showPassword = !showPassword"> </i>
                            </p-inputgroup-addon>
                        </p-inputgroup>
                        <p-message severity="error" variant="simple" size="small" *ngIf="userForm.get('password')?.touched && userForm.get('password')?.invalid">مطلوب</p-message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-sm font-medium">الدور</label>
                        <p-select formControlName="roleName" [options]="roles" optionLabel="name" optionValue="name" placeholder="اختر الدور" [showClear]="true" class="w-full" appendTo="body" />
                    </div>
                </form>
                <div class="flex flex-col items-center justify-center py-8" *ngIf="showUserSuccess">
                    <i class="pi pi-check-circle text-green-500" style="font-size: 5rem"></i>
                    <h2 class="text-xl font-bold mt-4">تم إضافة المستخدم بنجاح</h2>
                </div>
            </ng-template>
            <ng-template #footer>
                <div class="flex justify-end gap-2" *ngIf="!showUserSuccess">
                    <p-button label="إلغاء" icon="pi pi-times" text (click)="userDialog = false" />
                    <p-button label="حفظ" icon="pi pi-check" severity="success" (click)="saveUser()" [disabled]="userForm.invalid" [loading]="savingUser" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class AccountManagementComponent implements OnInit {
    users: UserDTO[] = [];
    roles: RoleDTO[] = [];
    loadingUsers = false;
    loadingRoles = false;
    roleDialog = false;
    showRoleSuccess = false;
    savingRole = false;
    roleForm!: FormGroup;
    userDialog = false;
    showUserSuccess = false;
    savingUser = false;
    userForm!: FormGroup;
    showPassword = false;
    deleteDialog = false;
    isDeleted = false;
    deletingUser = false;
    userToDelete: UserDTO | null = null;

    constructor(
        private accountService: AccountService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this.buildForms();
    }

    ngOnInit() {
        this.loadAll();
    }

    buildForms() {
        this.roleForm = this.fb.group({ name: ['', Validators.required] });
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            dob: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            roleName: [null],
            gender: [null]
        });
    }

    loadAll() {
        this.loadingUsers = true;
        this.loadingRoles = true;
        forkJoin({ users: this.accountService.getAllUsers(), roles: this.accountService.getAllRoles() }).subscribe({
            next: (data) => {
                this.users = data.users;
                this.roles = data.roles;
                this.loadingUsers = false;
                this.loadingRoles = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loadingUsers = false;
                this.loadingRoles = false;
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل البيانات' });
                this.cdr.detectChanges();
            }
        });
    }

    openRoleDialog() {
        this.roleForm.reset();
        this.showRoleSuccess = false;
        this.roleDialog = true;
    }

    saveRole() {
        if (this.roleForm.invalid) return;
        this.savingRole = true;
        this.accountService.addRole({ name: this.roleForm.value.name }).subscribe({
            next: () => {
                this.showRoleSuccess = true;
                this.savingRole = false;
                setTimeout(() => {
                    this.roleDialog = false;
                    this.loadAll();
                }, 1500);
            },
            error: (err) => {
                this.savingRole = false;
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: err?.error?.message || 'فشل إضافة الدور' });
                this.cdr.detectChanges();
            }
        });
    }

    openUserDialog() {
        this.userForm.reset();
        this.showUserSuccess = false;
        this.userDialog = true;
    }

    saveUser() {
        if (this.userForm.invalid) return;
        this.savingUser = true;
        const val = this.userForm.value;
        const dto: SignUpDTO = { name: val.name, dob: val.dob, email: val.email, password: val.password, roleName: val.roleName || null, gender: val.gender || null };
        this.accountService.addAccount(dto).subscribe({
            next: () => {
                this.showUserSuccess = true;
                this.savingUser = false;
                setTimeout(() => {
                    this.userDialog = false;
                    this.loadAll();
                }, 1500);
            },
            error: (err) => {
                this.savingUser = false;
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: err?.error?.message || 'فشل إضافة المستخدم' });
                this.cdr.detectChanges();
            }
        });
    }

    getRoleIcon(role?: string): string {
        switch (role) {
            case 'Admin':
                return 'pi pi-crown text-red-500';
            case 'Manager':
                return 'pi pi-briefcase text-orange-500';
            default:
                return 'pi pi-user text-blue-500';
        }
    }

    getRoleIconBg(role?: string): string {
        switch (role) {
            case 'Admin':
                return 'bg-red-100 dark:bg-red-900/30';
            case 'Manager':
                return 'bg-orange-100 dark:bg-orange-900/30';
            default:
                return 'bg-blue-100 dark:bg-blue-900/30';
        }
    }

    getAvatarTextColor(role?: string): string {
        switch (role) {
            case 'Admin':
                return 'text-red-600 dark:text-red-400';
            case 'Manager':
                return 'text-orange-600 dark:text-orange-400';
            default:
                return 'text-blue-600 dark:text-blue-400';
        }
    }

    getRoleDesc(role?: string): string {
        switch (role) {
            case 'Admin':
                return 'صلاحيات كاملة';
            case 'Employee':
                return 'إدارة العمليات';
            default:
                return 'مستخدم عادي';
        }
    }

    getRoleSeverity(role?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (role) {
            case 'Admin':
                return 'danger';
            case 'Employee':
                return 'info';
            default:
                return 'info';
        }
    }
    genderOptions = [
        { name: 'ذكر', value: 'Male' },
        { name: 'أنثى', value: 'Female' }
    ];
    getUserCountByRole(roleName: string): number {
        return this.users.filter((u) => u.role === roleName).length;
    }
    openDeleteConfirm(user: UserDTO) {
        this.userToDelete = user;
        this.isDeleted = false;
        this.deleteDialog = true;
    }

    confirmDelete() {
        if (!this.userToDelete) return;
        this.deletingUser = true;

        this.accountService.deleteUser(this.userToDelete.id).subscribe({
            next: () => {
                this.isDeleted = true;
                this.deletingUser = false;
                setTimeout(() => {
                    this.deleteDialog = false;
                    this.loadAll();
                }, 1500);
            },
            error: (err) => {
                this.deletingUser = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: err?.error?.message || 'فشل حذف المستخدم'
                });
                this.cdr.detectChanges();
            }
        });
    }
}
