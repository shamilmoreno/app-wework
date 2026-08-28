import { AbstractControl, FormGroup } from '@angular/forms';
import moment from 'moment';

export class MyValidators {
  static validateEmail(control: AbstractControl) {
    const value = control.value;
    if (control.errors && !control.errors['emailIsInvalid']) {
      return;
    }
    if (value) {
      if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return { emailIsInvalid: true };
      }
    }
    return null;
  }

  static validateNumberWithParam(min: number, max: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (control.errors && !control.errors['numberIsInvalid']) {
        return;
      }
      if (String(value).toString().length < min || String(value).toString().length > max) {
        return { numberIsInvalid: true };
      } else if (!value.match(/^[0-9]+$/)) {
        return { numberIsInvalid: true };
      }
      return null;
    };
  }

  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      // Set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ notmatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  static validateDate(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const start = formGroup.controls[controlName];
      const end = formGroup.controls[matchingControlName];
      if (end.errors && !end.errors['endDateIsInvalid']) {
        return;
      }

      // Set dates
      const startData = moment(start.value);
      const endData = moment(end.value);

      // Validar las fechas
      if (!endData.isAfter(startData)) {
        end.setErrors({ endDateIsInvalid: true });
      } else {
        end.setErrors(null);
      }
    };
  }

  static decimalNumberFormat(value: string, decimal: number | undefined) {
    return Number.parseFloat(value).toFixed(decimal);
  }
}
