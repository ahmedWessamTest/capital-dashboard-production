import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor() { }

  positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (!control.value) {
        return null;
      }
      
      const value = control.value.toString();
      
      if (value.includes('-')) {
        return { negativeNumber: true };
      }
      
      if (!/^\d*\.?\d*$/.test(value)) {
        return { invalidNumber: true };
      }
      
      return null;
    };
  }

  numericOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 46 && (event.target as HTMLInputElement).value.includes('.')) {
      return false;
    }
    return (charCode >= 48 && charCode <= 57) || 
           charCode === 8 || 
           charCode === 9 || 
           charCode === 13 || 
           charCode === 46;
  }

  // Prevent paste of non-numeric values
  preventInvalidPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    
    if (!/^\d*\.?\d*$/.test(pastedText) || pastedText.includes('-')) {
      event.preventDefault();
    }
  }
  // Prevent pasting styled or special characters in text inputs
cleanPastedText(event: ClipboardEvent): void {
  const clipboardData = event.clipboardData || (window as any).clipboardData;
  let pastedText = clipboardData.getData('text');

  // Remove non-printable or styled characters (e.g. emojis, zero-width, smart quotes)
  pastedText = pastedText
    .replace(/[^\x20-\x7E]/g, '')         // ASCII printable characters only
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'") // Replace smart quotes with normal
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width spaces, etc.

  event.preventDefault();

  const target = event.target as HTMLInputElement;
  const start = target.selectionStart || 0;
  const end = target.selectionEnd || 0;
  const originalValue = target.value;

  // Insert cleaned text where the cursor was
  const newValue = originalValue.slice(0, start) + pastedText + originalValue.slice(end);
  target.value = newValue;

  // Optionally trigger input or FormControl update
  target.dispatchEvent(new Event('input', { bubbles: true }));
}


  // Sanitize input by removing unwanted characters
  sanitizeInput(input: string): string {
    return input.replace(/[<>'"&]/g, ''); // Basic XSS protection
  }

  // Sanitize numeric input
  sanitizeNumericInput(input: string): string {
    return input.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  }
}