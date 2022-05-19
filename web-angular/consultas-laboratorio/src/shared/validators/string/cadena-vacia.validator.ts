import { AbstractControl } from '@angular/forms';

export function CadenaVacia(control: AbstractControl): {
  [s: string]: boolean;
} {
  if (control.value.trim().length == 0) {
    return { invalidString: true };
  }

  return null;
}
