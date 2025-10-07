import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Column } from '../../../../../../shared/service/genereic-table.service';
import { GenericViewComponent } from '../../../../../../core/components/far-generic-view/far-generic-view/far-generic-view.component';
import { Slider, SlidersService } from '../../service/sliders.service';

@Component({
  selector: 'app-view-slider',
  standalone: true,
  imports: [GenericViewComponent],
  templateUrl: './view-slider.component.html',
  styleUrl: './view-slider.component.scss'
})
export class ViewSliderComponent implements OnInit {
  slider: Slider | null = null;
  columns: Column[] = [
    { field: 'id', header: 'Slider ID', type: 'text' },
    { field: 'en_title', header: 'English Title', type: 'text' },
    { field: 'ar_title', header: 'Arabic Title', type: 'text' },
    { field: 'en_description', header: 'English Description', type: 'text' },
    { field: 'ar_description', header: 'Arabic Description', type: 'text' },
    { field: 'image', header: 'Slider Image', type: 'image' },
    { field: 'active_status', header: 'Active Status', type: 'text' },
    { field: 'created_at', header: 'Created At', type: 'text' },
    { field: 'updated_at', header: 'Updated At', type: 'text' }
  ];

  constructor(
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
    private slidersService: SlidersService
  ) {}

  ngOnInit(): void {
    console.log('ViewSliderComponent initialized');
    
    this.route.data.subscribe({
      next: (data) => {
        console.log('Route data received:', data);
        
        const sliderData = data['data'];
        console.log('Slider resolver data:', sliderData);
        
        if (sliderData) {
          this.slider = sliderData.data || sliderData;
          console.log('Assigned slider:', this.slider);
        } else {
          console.warn('No slider data found in route data');
        }
        
        this.ngxSpinnerService.hide("actionsLoader");
      },
      error: (err) => {
        console.error('Failed to load slider:', err);
        this.ngxSpinnerService.hide("actionsLoader");
      }
    });
  }
}