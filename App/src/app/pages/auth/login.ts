import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AccountService } from '../service/account.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    template: `
        <!-- مكون الـ Toast لعرض التنبيه الاحترافي الذي يختفي تلقائياً -->
        <p-toast position="top-center" [life]="4000"></p-toast>

        <!-- الـ Configurator موجود وبأول سطر، أضفنا له كلاس z-index مخصص ليظل متاحاً دائماً -->
        <div class="relative z-[60]">
            <app-floating-configurator />
        </div>

        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden relative">
            <!-- شاشة الـ Loading والـ Blur المضافة حديثاً في منتصف الشاشة -->
            <div *ngIf="isLoading" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-surface-900/10 dark:bg-surface-950/20 backdrop-blur-sm animate-fade-in">
                <div class="flex flex-col items-center gap-4 bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-800">
                    <svg class="animate-spin h-10 w-10 text-[#0d5c43]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-surface-700 dark:text-surface-200 font-medium text-sm">جاري التحقق من البيانات...</span>
                </div>
            </div>

            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-8 w-30 shrink-0 mx-auto">
                                <ellipse cx="250" cy="250" rx="75" ry="165" transform="rotate(0 250 250)" stroke="#0d5c43" stroke-width="12" stroke-linecap="round" />
                                <ellipse cx="250" cy="250" rx="75" ry="165" transform="rotate(45 250 250)" stroke="#0d5c43" stroke-width="12" stroke-linecap="round" />
                                <ellipse cx="250" cy="250" rx="75" ry="165" transform="rotate(90 250 250)" stroke="#0d5c43" stroke-width="12" stroke-linecap="round" />
                                <ellipse cx="250" cy="250" rx="75" ry="165" transform="rotate(135 250 250)" stroke="#0d5c43" stroke-width="12" stroke-linecap="round" />
                                <circle cx="250" cy="250" r="95" stroke="#0d5c43" stroke-width="14" fill="none" />
                            </svg>
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">نظام إدارة مكّوك</div>
                            <span class="text-muted-color font-medium">سجّل دخولك لمتابعة لوحة التحكم والعمليات</span>
                        </div>
                        <form [formGroup]="loginForm" (ngSubmit)="login()">
                            <div>
                                <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">الايميل</label>
                                <input
                                    formControlName="txtUsername"
                                    pInputText
                                    id="email1"
                                    type="email"
                                    autocomplete="username"
                                    [placeholder]="loginForm.get('txtUsername')?.touched && loginForm.get('txtUsername')?.hasError('required') ? 'الايميل المستخدم مطلوب' : 'الايميل المستخدم'"
                                    class="w-full md:w-120 mb-2"
                                    [ngClass]="{ 'p-invalid': loginForm.get('txtUsername')?.touched && loginForm.get('txtUsername')?.hasError('required') }"
                                />
                                <label for="password1" class="block text-surface-900 dark:text-surface-0 text-sm font-semibold mb-2">كلمة السر</label>
                                <p-password
                                    formControlName="txtPassword"
                                    id="password1"
                                    [toggleMask]="true"
                                    [feedback]="false"
                                    [fluid]="true"
                                    autocomplete="current-password"
                                    [placeholder]="loginForm.get('txtPassword')?.touched && loginForm.get('txtPassword')?.hasError('required') ? 'كلمة السر مطلوبة' : '••••••••'"
                                    [styleClass]="'w-full mb-1 '"
                                    [inputStyleClass]="
                                        'w-full p-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-transparent text-surface-900 dark:text-surface-0 focus:border-[#0d5c43] ' +
                                        (loginForm.get('txtPassword')?.touched && loginForm.get('txtPassword')?.hasError('required') ? 'p-invalid border-red-500' : '')
                                    "
                                />
                                <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                    <div class="flex items-center gap-2">
                                        <input type="checkbox" id="rememberme1" formControlName="rememberMe" class="cursor-pointer" />
                                        <label for="rememberme1" class="text-surface-600 dark:text-surface-200 cursor-pointer select-none">تذكرني</label>
                                    </div>
                                </div>

                                <p-button type="submit" label="تسجيل الدخول" styleClass="w-full" [loading]="isLoading" [disabled]="isLoading"></p-button>

                                <div *ngIf="errorMsg" class="mt-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                                    <i class="pi pi-exclamation-circle text-red-500"></i>
                                    <span class="text-red-600 dark:text-red-400 text-sm font-medium">{{ errorMsg }}</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .animate-fade-in {
                animation: fadeIn 0.2s ease-out forwards;
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        `
    ]
})
export class Login implements OnInit {
    loginForm!: FormGroup;
    errorMsg = '';
    isLoading = false;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.buildForms();
        const savedUsername = localStorage.getItem('makook_remembered_user');
        if (savedUsername) {
            this.loginForm.patchValue({
                txtUsername: savedUsername,
                rememberMe: true
            });
        }
    }

    buildForms() {
        this.loginForm = this.formBuilder.group({
            txtUsername: ['', Validators.required],
            txtPassword: ['', Validators.required],
            rememberMe: [false]
        });
    }

    login() {
        if (this.loginForm.valid) {
            this.errorMsg = '';
            this.isLoading = true;

            const dto = { username: this.loginForm.value.txtUsername, password: this.loginForm.value.txtPassword };

            this.accountService.login(dto).subscribe({
                next: (response) => {
                    console.log('Login successful:', response);

                    localStorage.setItem('APITocken', response.token);
                    localStorage.setItem('userRole', response.role);
                    localStorage.setItem('userEmail', response.email);
                    localStorage.setItem('userName', response.name);

                    const isRememberMeChecked = this.loginForm.value.rememberMe;
                    if (isRememberMeChecked) {
                        localStorage.setItem('makook_remembered_user', this.loginForm.value.txtUsername);
                    } else {
                        localStorage.removeItem('makook_remembered_user');
                    }

                    this.isLoading = false;
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    this.isLoading = false;

                    this.messageService.add({
                        severity: 'error',
                        summary: 'خطأ في الدخول',
                        detail: 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى',
                        icon: 'pi pi-exclamation-circle'
                    });
                }
            });
        }
    }
}
