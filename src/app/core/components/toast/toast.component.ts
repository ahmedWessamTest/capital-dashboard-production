// toast.component.ts
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ToastComponent implements AfterViewInit, OnDestroy {
  @ViewChild('Toast', { read: TemplateRef }) toastTemplate!: TemplateRef<any>;
  @ViewChild('topLeft', { read: ViewContainerRef }) topLeft!: ViewContainerRef;
  @ViewChild('topRight', { read: ViewContainerRef }) topRight!: ViewContainerRef;
  @ViewChild('bottomLeft', { read: ViewContainerRef }) bottomLeft!: ViewContainerRef;
  @ViewChild('bottomRight', { read: ViewContainerRef }) bottomRight!: ViewContainerRef;

  private subscription: Subscription;

  constructor(private toastService: ToastService) {
    this.subscription = this.toastService.toasts$.subscribe((config) => {
      if (config) {
        // This is where you receive the config from the service
        console.log('ToastComponent received config:', config); // <-- ADD THIS LOG
        this.showToast(config.position, config.type, config.msg);
      }
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showToast(
    position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' = 'topRight',
    type: string,
    msg: string
  ) {
    // These logs will show what's being passed into the function that creates the toast
    console.log('showToast arguments - Type:', type, 'Message:', msg, 'Position:', position); // <-- ADD THIS LOG

    const container = this[position]; // Get the container based on position
    if (!container || !this.toastTemplate) {
      console.error('Container or toast template is not available.');
      return;
    }

    // Create the toast
    const toastRef = container.createEmbeddedView(this.toastTemplate, {
      $implicit: {
        title: type.toUpperCase(),
        msg: msg,
        type: type,
        close: () => {
          this.closeToast(toastRef);
        },
      },
    });
    // This log will show what's being passed to the template context
    console.log('Toast template context ($implicit):', toastRef.context.$implicit); // <-- ADD THIS LOG

    this.animateIn(toastRef);

    setTimeout(() => {
      this.closeToast(toastRef);
    }, 3000000); // 3,000,000 ms = 50 minutes? This is a very long duration! You might want to reduce this for testing.
  }

  animateIn(toastRef: any) {
    const toastElement = toastRef.rootNodes[0];
    gsap.from(toastElement, {
      opacity: 0,
      y: -20, // Slide-in from above
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  closeToast(toastRef: any) {
    const toastElement = toastRef.rootNodes[0];
    gsap.to(toastElement, {
      opacity: 0,
      y: 40,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        toastRef.destroy();
      },
    });
  }
}