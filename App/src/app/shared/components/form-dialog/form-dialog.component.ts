import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-form-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    template: `
        <p-dialog [(visible)]="visible" (visibleChange)="onVisibleChange($event)" [style]="{ width: width }" [header]="title" [modal]="true" [draggable]="false" [resizable]="false">
            <ng-template #content>
                <!-- Form Content injected here, hidden when showSuccess is true -->
                <div *ngIf="!showSuccess">
                    <ng-content></ng-content>
                </div>

                <!-- Success State -->
                <div class="flex flex-col items-center justify-center py-8" *ngIf="showSuccess">
                    <i class="pi pi-check-circle" [ngClass]="isEditMode ? 'text-blue-500' : 'text-green-500'" style="font-size: 5rem"></i>
                    <h2 class="text-2xl font-bold mt-4 text-surface-700 dark:text-surface-0">
                        {{ successMessage }}
                    </h2>
                </div>
            </ng-template>

            <ng-template #footer>
                <div class="flex justify-end gap-2 w-full" *ngIf="!showSuccess">
                    <p-button label="إلغاء" icon="pi pi-times" text (onClick)="handleCancel()" severity="secondary"></p-button>
                    <p-button *ngIf="!isEditMode" label="حفظ" icon="pi pi-check" (onClick)="handleSave()" [disabled]="!isValid"></p-button>
                    <p-button *ngIf="isEditMode" label="تعديل" icon="pi pi-pencil" severity="info" (onClick)="handleUpdate()" [disabled]="!isValid"></p-button>
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class FormDialogComponent {
    @Input() visible = false;
    @Input() isEditMode = false;
    @Input() showSuccess = false;
    @Input() title = '';
    @Input() successMessage = '';
    @Input() width = '560px';
    @Input() isValid = false;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<void>();
    @Output() onUpdate = new EventEmitter<void>();
    @Output() onCancel = new EventEmitter<void>();

    onVisibleChange(val: boolean) {
        this.visibleChange.emit(val);
        if (!val) {
            this.onCancel.emit();
        }
    }

    handleCancel() {
        this.visibleChange.emit(false);
        this.onCancel.emit();
    }

    handleSave() {
        this.onSave.emit();
    }

    handleUpdate() {
        this.onUpdate.emit();
    }
}
