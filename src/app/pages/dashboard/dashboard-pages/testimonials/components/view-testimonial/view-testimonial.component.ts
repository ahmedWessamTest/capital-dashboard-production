import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericViewComponent } from '../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import {
  Testimonial,
  TestimonialsService,
} from '../../services/testimonial.service';

@Component({
  selector: 'app-view-testimonial',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-testimonial.component.html',
  styleUrl: './view-testimonial.component.scss',
})
export class ViewTestimonialComponent implements OnInit {
  testimonial: Testimonial | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Testimonial ID', type: 'text' },
    { field: 'en_name', header: 'English Name', type: 'text' },
    { field: 'ar_name', header: 'Arabic Name', type: 'text' },
    { field: 'en_job', header: 'English Professional Title', type: 'text' },
    { field: 'ar_job', header: 'Arabic Professional Title', type: 'text' },
    { field: 'en_text', header: 'English Testimonial', type: 'text' },
    { field: 'ar_text', header: 'Arabic Testimonial', type: 'text' },
    { field: 'active_status', header: 'Active Status', type: 'text' },
    { field: 'created_at', header: 'Created At', type: 'text' },
    { field: 'updated_at', header: 'Updated At', type: 'text' },
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
    private testimonialsService: TestimonialsService
  ) {}

  ngOnInit(): void {
    console.log('ViewTestimonialComponent initialized');

    this.route.data.subscribe({
      next: (data) => {
        console.log('Route data received:', data);

        const testimonialData = data['data'];
        console.log('Testimonial resolver data:', testimonialData);

        if (testimonialData) {
          this.testimonial = testimonialData.data || testimonialData;
          console.log('Assigned testimonial:', this.testimonial);
        } else {
          console.warn('No testimonial data found in route data');
        }

        this.ngxSpinnerService.hide('actionsLoader');
      },
      error: (err) => {
        console.error('Failed to load testimonial:', err);
        this.ngxSpinnerService.hide('actionsLoader');
      },
    });
  }
}
