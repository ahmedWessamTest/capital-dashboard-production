import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit, OnDestroy, Optional } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appFormError]',
  standalone: true,
})
export class FormErrorDirective implements OnInit, OnDestroy {
  @Input() displayName: string = '';
  private errorContainer: HTMLElement | null = null;
  private hasInteracted = false;
  private statusChangeSubscription?: Subscription;

  constructor(
    private el: ElementRef,
    @Optional() private control: NgControl,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Check if control exists before proceeding
    if (!this.control) {
      console.warn('FormErrorDirective: NgControl not found. Make sure the element has a form control.');
      return;
    }

    this.createErrorContainer();
    this.subscribeToStatusChanges();
  }

  ngOnDestroy() {
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
  }

  private createErrorContainer() {
    const parent = this.el.nativeElement.parentElement;
    if (!parent) return;

    const existingContainer = parent.querySelector('.error-container');
    if (!existingContainer) {
      this.errorContainer = this.renderer.createElement('div');
      this.renderer.addClass(this.errorContainer, 'error-container');
      this.renderer.appendChild(parent, this.errorContainer);
    } else {
      this.errorContainer = existingContainer as HTMLElement;
    }
  }

  private subscribeToStatusChanges() {
    if (this.control?.statusChanges) {
      this.statusChangeSubscription = this.control.statusChanges.subscribe(() => {
        this.showError();
      });
    }
  }

  @HostListener('focus') onFocus() {
    this.hasInteracted = true;
    this.showError();
  }

  @HostListener('blur') onBlur() {
    this.hasInteracted = true;
    this.showError();
  }

  @HostListener('input') onInput() {
    this.hasInteracted = true;
    this.showError();
  }

  private showError() {
    if (!this.control) return;

    const control = this.control.control as FormControl;
    if (!control) return;

    if (control.invalid && (this.hasInteracted || control.touched || control.dirty)) {
      this.renderer.addClass(this.el.nativeElement, 'error');
      if (this.errorContainer) {
        this.renderer.setProperty(
          this.errorContainer,
          'innerHTML',
          `<span class="error-message">${this.getErrorMessage()}</span>`
        );
      }
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'error');
      if (this.errorContainer) {
        this.renderer.setProperty(this.errorContainer, 'innerHTML', '');
      }
    }
  }

  private getErrorMessage(): string {
    if (!this.control?.control) return '';

    const control = this.control.control as FormControl;
    const fieldName = this.displayName || this.el.nativeElement.placeholder || 'Field';

    if (control.errors?.['required']) return `${fieldName} is required`;
    if (control.errors?.['email']) return 'Please enter a valid email address';
    if (control.errors?.['minlength']) return `${fieldName} is too short`;
    if (control.errors?.['pattern']) return 'Please enter a valid phone number';
    if (control.errors?.['negativeNumber']) return 'Negative numbers are not allowed';
    if (control.errors?.['invalidNumber']) return 'Please enter a valid positive number';
    
    return '';
  }
}