import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { Message } from 'primeng/message';
import { SelectModule } from 'primeng/select';

import { InstantOrderService } from '../../service/instantOrder.service';
import { Toolbar } from 'primeng/toolbar';
import { InstantOrderDTO } from '@/app/Model/InstantOrderDTO';
import { NotificationService } from '@/app/shared/services/notification.service';

type OrderStatus = 'بانتظار تأمين سائق' | 'تم تأمين سائق' | 'قيد المراجعة' | 'تم التوصيل' | 'ملغي';

@Component({
    selector: 'app-kanban-instant-order',
    standalone: true,
    imports: [CommonModule, ButtonModule, TagModule, InputTextModule, BadgeModule, TooltipModule, DialogModule, InputIconModule, IconFieldModule, ReactiveFormsModule, FormsModule, SelectModule, Toolbar],
    styles: [
        `
            /* ── Drag & Drop ── */
            .kanban-col-highlight {
                outline: 2px dashed #6366f1;
                outline-offset: -2px;
                background: rgba(13, 17, 239, 0.04) !important;
            }
            .card-dragging {
                opacity: 0.4;
                transform: scale(0.97);
            }
            .drop-zone-indicator {
                height: 3px;
                border-radius: 2px;
                background: #6366f1;
                margin: 2px 0;
                animation: pulse-bar 0.8s ease-in-out infinite alternate;
            }
            @keyframes pulse-bar {
                from {
                    opacity: 0.5;
                    transform: scaleX(0.95);
                }
                to {
                    opacity: 1;
                    transform: scaleX(1);
                }
            }

            /* ── FIX #2: make sure no child element swallows pointer events ── */
            .card-actions {
                position: relative;
                z-index: 20;
                pointer-events: all;
            }
            .card-actions p-button {
                pointer-events: all;
            }

            /* ── Status inline select ── */
            .status-select-wrap {
                position: relative;
                z-index: 30;
            }
        `
    ],
    template: `
        <!-- ══════════════════════════ TOOLBAR ══════════════════════════ -->
        <p-toolbar styleClass="mb-0">
            <ng-template #start>
                <div class="flex flex-col gap-2">
                    <span class="text-sm text-muted-color font-medium">إدارة الطلبات الفورية</span>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" [(ngModel)]="searchText" (ngModelChange)="applyFilter()" placeholder="بحث..." class="text-sm" style="width:200px" />
                    </p-iconfield>
                </div>
            </ng-template>
        </p-toolbar>

        <div
            class="flex gap-3 px-4 py-3
            border-b border-surface-200 dark:border-surface-700
            bg-surface-50 dark:bg-surface-800 overflow-x-auto"
        >
            <div
                *ngFor="let s of stats"
                class="flex-1 min-w-[100px] bg-surface-0 dark:bg-surface-900
               rounded-lg border border-surface-200 dark:border-surface-700
               p-3 text-center"
            >
                <div class="text-xl font-semibold text-color">{{ s.count }}</div>
                <div class="text-xs text-muted-color mt-1">{{ s.label }}</div>
            </div>
        </div>
        <!-- ══════════════════════════ STATS ══════════════════════════ -->

        <!-- ══════════════════════════ BOARD ══════════════════════════ -->
        <div class="flex gap-3 p-4 overflow-x-auto" style="min-height:520px">
            <div
                *ngFor="let col of columns"
                class="flex flex-col gap-2 flex-shrink-0 rounded-xl p-2"
                style="width:275px"
                [class.kanban-col-highlight]="dragOverColumn === col.label"
                (dragover)="$event.preventDefault()"
                (dragleave)="onColumnDragLeave($event)"
                (drop)="onColumnDrop($event, col.label)"
            >
                <!-- column header -->
                <div class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium mb-1" [ngStyle]="{ background: col.headerBg, color: col.headerColor }">
                    <span>{{ col.label }}</span>
                    <span class="text-xs font-semibold px-2 py-0.5 rounded-full" [ngStyle]="{ background: col.countBg, color: col.headerColor }">
                        {{ col.orders.length }}
                    </span>
                </div>

                <!-- empty-column drop zone -->
                <div *ngIf="dragOverColumn === col.label && col.orders.length === 0" class="drop-zone-indicator mx-2"></div>

                <!-- ── CARDS ── -->
                <ng-container *ngFor="let order of col.orders; let i = index">
                    <!-- drop indicator above card -->
                    <div *ngIf="dragOverColumn === col.label && dropTargetIndex === i" class="drop-zone-indicator mx-2"></div>

                    <div
                        class="bg-surface-0 dark:bg-surface-900
                            border border-surface-200 dark:border-surface-700
                            rounded-xl p-3 flex flex-col gap-2
                            hover:border-primary-400 transition-colors select-none"
                        [class.card-dragging]="draggedOrder?.id === order.id"
                        draggable="true"
                        (dragstart)="onCardDragStart($event, order)"
                        (dragend)="onCardDragEnd()"
                        (dragover)="onCardDragOver($event, i)"
                        (dragleave)="onCardDragLeave()"
                    >
                        <!-- top row: checkbox + time -->
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-muted-color">
                                {{ order.pickupTime | date: 'shortTime' }}
                            </span>
                        </div>

                        <!-- client name -->
                        <div class="font-medium text-sm text-color">{{ order.clientName }}</div>

                        <!-- driver -->
                        <div class="flex items-center gap-1">
                            <i class="pi pi-car text-xs text-muted-color"></i>
                            <span *ngIf="order.driverName" class="text-xs text-muted-color">
                                {{ order.driverName }}
                            </span>
                            <p-tag *ngIf="!order.driverName" value="لم يتم تعيين سائق" severity="warn" [style]="{ 'font-size': '10px', padding: '2px 6px' }"></p-tag>
                        </div>

                        <!-- route -->
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center gap-1.5 text-xs text-muted-color">
                                <span class="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></span>
                                <span class="truncate">{{ order.pickupAddress }}</span>
                            </div>
                            <div class="flex items-center gap-1.5 text-xs text-muted-color">
                                <span class="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></span>
                                <span class="truncate">{{ order.dropoffAddress }}</span>
                            </div>
                        </div>

                        <!--
                        ══════════════════════════════════════════════════
                        FIX #1 — Inline Status Dropdown
                        ══════════════════════════════════════════════════
                        • Uses native <select> — zero PrimeNG z-index conflicts
                        • (mousedown) stopPropagation prevents the card's drag
                          handler from intercepting the click
                        • (change) calls changeStatus() → optimistic UI update
                          + single UpdateOrder() API call (status only)
                        ══════════════════════════════════════════════════
                    -->

                        <!-- price + action buttons -->
                        <div
                            class="flex items-center justify-between pt-2
                                border-t border-surface-100 dark:border-surface-700"
                        >
                            <div>
                                <div class="text-sm font-semibold text-color">
                                    {{ order.price | currency: 'USD' }}
                                </div>
                                <div class="text-xs text-muted-color">عمولة: {{ order.companyCommission | currency: 'USD' }} · {{ order.passengerCount }} ركاب</div>
                            </div>

                            <!--
                            ══════════════════════════════════════════════════
                            FIX #2 — Single-click buttons
                            ══════════════════════════════════════════════════
                            • Wrapper div has (mousedown) stopPropagation so
                              the card drag handler never fires on button clicks.
                            • Each p-button uses (onClick) ONLY — no duplicate
                              (click) binding anywhere.
                            • [disabled] on trash removed — delete works for
                              any single card regardless of checkedIds count.
                            ══════════════════════════════════════════════════
                        -->
                        </div>
                    </div>
                </ng-container>

                <!-- drop indicator at end -->
                <div *ngIf="dragOverColumn === col.label && dropTargetIndex === col.orders.length && col.orders.length > 0" class="drop-zone-indicator mx-2"></div>
            </div>
        </div>
    `
})
export class KanbanInstantOrder implements OnInit {
    // ── data ─────────────────────────────────────────────
    allOrders: any[] = [];
    filteredOrders: any[] = [];
    searchText = '';

    // ── options ──────────────────────────────────────────
    driverOptions: any[] = [];
    clientOptions: any[] = [];
    statusOptions: { name: string; value: OrderStatus }[] = [
        { name: 'بانتظار تأمين سائق', value: 'بانتظار تأمين سائق' },
        { name: 'قيد المراجعة', value: 'قيد المراجعة' },
        { name: 'تم التوصيل', value: 'تم التوصيل' },
        { name: 'ملغي', value: 'ملغي' }
    ];

    // ── columns ──────────────────────────────────────────
    columnDefs: Array<{ label: OrderStatus; headerBg: string; headerColor: string; countBg: string }> = [
        { label: 'بانتظار تأمين سائق', headerBg: '#FCEBEB', headerColor: '#501313', countBg: '#F7C1C1' },
        { label: 'قيد المراجعة', headerBg: '#FAEEDA', headerColor: '#633806', countBg: '#FAC775' },
        { label: 'تم التوصيل', headerBg: '#EAF3DE', headerColor: '#173404', countBg: '#C0DD97' },
        { label: 'ملغي', headerBg: '#F5F5F5', headerColor: '#424242', countBg: '#E0E0E0' }
    ];

    get columns() {
        return this.columnDefs.map((def) => ({
            ...def,
            orders: this.filteredOrders.filter((o) => o.status === def.label)
        }));
    }

    get stats() {
        return [
            { label: 'إجمالي الطلبات', count: this.filteredOrders.length },
            ...this.columnDefs.map((d) => ({
                label: d.label,
                count: this.filteredOrders.filter((o) => o.status === d.label).length
            }))
        ];
    }

    // ── drag state ───────────────────────────────────────
    draggedOrder: any = null;
    dragOverColumn: OrderStatus | null = null;
    dropTargetIndex = -1;

    onCardDragStart(e: DragEvent, order: any) {
        this.draggedOrder = order;
        e.dataTransfer?.setData('text/plain', order.id);
        e.dataTransfer!.effectAllowed = 'move';
    }
    onCardDragEnd() {
        this.draggedOrder = null;
        this.dragOverColumn = null;
        this.dropTargetIndex = -1;
        this.cdr.detectChanges();
    }
    onCardDragOver(e: DragEvent, idx: number) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer!.dropEffect = 'move';
        this.dropTargetIndex = idx;
    }
    onCardDragLeave() {
        /* intentionally empty */
    }
    onColumnDragOver(e: DragEvent, col: OrderStatus) {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
        this.dragOverColumn = col;
        if (this.dropTargetIndex === -1) this.dropTargetIndex = this.filteredOrders.filter((o) => o.status === col).length;
        this.cdr.detectChanges();
    }
    onColumnDragLeave(e: DragEvent) {
        if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as HTMLElement)) {
            this.dragOverColumn = null;
            this.dropTargetIndex = -1;
            this.cdr.detectChanges();
        }
    }
    onColumnDrop(e: DragEvent, targetStatus: OrderStatus) {
        e.preventDefault();
        e.stopPropagation();

        console.log('🟢 DROP FIRED:', targetStatus);
        console.log('🟢 draggedOrder:', this.draggedOrder);

        this.dragOverColumn = null;
        this.dropTargetIndex = -1;

        const order = this.draggedOrder;

        // 🔴 حماية أساسية
        if (!order) return;

        // 🔴 إذا نفس الحالة
        if (order.status === targetStatus) {
            this.draggedOrder = null;
            return;
        }

        const ref = this.allOrders.find((o) => o.id === order.id);
        const oldStatus = ref?.status;

        if (!ref) {
            this.draggedOrder = null;
            return;
        }

        // 🟢 تحديث UI أولاً (Optimistic update)
        ref.status = targetStatus;
        this.applyFilter();

        this.draggedOrder = null;

        // 🟡 مهم جداً: تأجيل الـ detectChanges (حل zoneless + invalid state)
        setTimeout(() => {
            this.cdr.detectChanges();
        });

        // 🔵 API call منفصل عن الـ UI lifecycle
        const dto = Object.assign(new InstantOrderDTO(), order, {
            status: targetStatus
        });

        this.instantOrderService.UpdateOrder(dto).subscribe({
            next: () => {
                this.notificationService.update();
            },

            error: () => {
                this.notificationService.error('حدث خطأ أثناء التعديل');
                // 🔴 rollback
                if (ref && oldStatus) {
                    ref.status = oldStatus;
                    this.applyFilter();

                    setTimeout(() => {
                        this.cdr.detectChanges();
                    });
                }
            }
        });
    }
    // ── dialog / form state ──────────────────────────────
    orderDialog = false;

    orderForm!: FormGroup;

    constructor(
        private instantOrderService: InstantOrderService,
        private cdr: ChangeDetectorRef,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.loadAll();
    }

    // ── data loading ─────────────────────────────────────
    loadAll() {
        this.instantOrderService.loadAll().subscribe({
            next: (data) => {
                this.allOrders = data;
                this.applyFilter();
            },
            error: () => {}
        });
    }

    applyFilter() {
        const q = this.searchText.toLowerCase();
        this.filteredOrders = q ? this.allOrders.filter((o) => [o.clientName, o.driverName, o.pickupAddress, o.dropoffAddress, o.status].some((v) => (v || '').toLowerCase().includes(q))) : [...this.allOrders];
        this.cdr.detectChanges();
    }

    // ════════════════════════════════════════════════════
    // FIX #1 — Inline status change
    // Calls the SAME UpdateOrder endpoint the backend already has.
    // No backend changes needed.
    // ════════════════════════════════════════════════════
    changeStatus(order: any, newStatus: OrderStatus) {
        if (order.status === newStatus) return;

        const oldStatus = order.status;

        // ① Optimistic UI update — instant feedback
        order.status = newStatus;
        this.applyFilter();

        // Build full DTO (UpdateOrder needs all fields)
        const dto = Object.assign(new InstantOrderDTO(), order, { status: newStatus });

        // ② Send to backend
        this.instantOrderService.UpdateOrder(dto).subscribe({
            next: () => {
                this.notificationService.update();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء التعديل');
                // Rollback on failure
                order.status = oldStatus;
                this.applyFilter();
            }
        });
    }

    getStatusSeverity(status: string): 'warn' | 'info' | 'success' | 'danger' | 'secondary' {
        const map: Record<string, any> = {
            'بانتظار تأمين سائق': 'danger',
            'قيد المراجعة': 'warn',
            'تم التوصيل': 'success',
            ملغي: 'secondary'
        };
        return map[status] ?? 'secondary';
    }
}
