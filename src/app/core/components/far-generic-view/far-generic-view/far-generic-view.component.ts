import { Component, Input, inject, OnInit, OnChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule, DatePipe } from '@angular/common';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { Column } from '../../../../shared/service/genereic-table.service';
import { IMAGE_BASE_URL } from '../../../../core/constants/WEB_SITE_BASE_UTL';
import { SimpleChanges } from '@angular/core';
interface BaseEntity {
  id: number;
  [key: string]: any;
}

@Component({
  selector: 'app-generic-view',
  standalone: true,
  imports: [
    ButtonModule,
    ToastModule,
    NgxSpinnerModule,
    LoadingDataBannerComponent,
    CommonModule,
  ],
  templateUrl: './far-generic-view.component.html',
  styleUrl: './far-generic-view.component.scss',
  providers: [MessageService, DatePipe],
})
export class GenericViewComponent<T extends BaseEntity> implements OnInit,OnChanges {
  private router = inject(Router);
  private messageService = inject(MessageService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private datePipe = inject(DatePipe);

  @Input() data: T | null = null;
  @Input() columns: Column[] = [];
  @Input() title: string = 'Details';
  @Input() editRoute: string = '';
  @Input() backRoute: string = '';
  @Input() imageBaseUrl: string = IMAGE_BASE_URL;

  isLoading: boolean = false;
  imageLoaded: boolean = false;

  ngOnInit() {
    if (!this.data) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No data provided',
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.isLoading = false;
    }
  }

  navigateToEdit() {
    if (this.editRoute && this.data?.id) {
      this.router.navigate([this.editRoute, this.data.id]);
    }
  }

  navigateBack() {
    this.router.navigate([this.backRoute]);
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  getImageUrl(image: string): string {
    return this.imageBaseUrl ? `${this.imageBaseUrl}${image}` : image;
  }

  formatValue(item: T, col: Column): string {
    const value = col.displayFn ? col.displayFn(item) : item[col.field];
    if (!value) return 'N/A';
    switch (col.type) {
      case 'date':
        return this.datePipe.transform(value, 'medium') || 'N/A';
      case 'boolean':
        return value ? 'Active' : 'Inactive';
      default:
        return value.toString();
    }
  }
}