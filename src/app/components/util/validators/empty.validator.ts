import { FormControl } from "@angular/forms";

export function noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

export function noNumericOrSymbolValidator(control: FormControl) {
    const value = control.value;
    const hasNumericOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    return hasNumericOrSymbol ? { numericOrSymbol: true } : null;
  }
