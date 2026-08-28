import { AbstractControl, FormGroup } from '@angular/forms';

export class MyValidators {
  static validateEmail(control: AbstractControl): any | null {
    const value = control.value;
    if (control.errors && !control.errors['emailIsInvalid']) {
      return;
    }
    if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return { emailIsInvalid: true };
    }
    return null;
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

  static validateUrl(control: AbstractControl): any | null {
    const value = control.value;
    if (control.errors && !control.errors['urlIsInvalid']) {
      return;
    }
    if (
      !value.match(/^((https|http)?:\/\/)?([\w\d-_]+)\.([\w\d-_\.]+)\/?\??([^#\n\r]*)?#?([^\n\r]*)/)
    ) {
      return { urlIsInvalid: true };
    }
    return null;
  }

  static validateNumber(control: AbstractControl): any | null {
    const value = control.value;
    if (control.errors && !control.errors['numberIsInvalid']) {
      return;
    }
    if (!value.match(/^[0-9]*$/)) {
      return { numberIsInvalid: true };
    }
    return null;
  }

  static numberFormat(value: any) {
    // 1. CONTROL DE DAÑOS: Si el valor no existe o es nulo, retornar '0' de inmediato
    if (value === undefined || value === null || value === '') {
      return '0';
    }

    // 2. Aseguramos que sea un número (por si el backend lo mandó como texto)
    const numeroConvertido = Number(value);
    if (isNaN(numeroConvertido)) {
      return '0'; // Si no se pudo transformar a número válido, evita el colapso
    }

    // 3. Tu lógica original usando el número asegurado
    let val = numeroConvertido.toLocaleString('es-ES', { maximumFractionDigits: 0 });
    let valActual = val;

    // Eliminar cualquier carácter que no sea un número
    const numero = valActual.replace(/[^\d]/g, '');
    let numeroFormateado = '';
    let contadorPuntos = 0;

    // Iterar sobre los dígitos del número
    for (let i = numero.length - 1; i >= 0; i--) {
      // Insertar un punto cada tres dígitos, comenzando desde el final
      if (contadorPuntos === 3) {
        numeroFormateado = ',' + numeroFormateado;
        contadorPuntos = 0; // Reiniciar contador de puntos
      }
      numeroFormateado = numero[i] + numeroFormateado;
      contadorPuntos++;
    }

    return numeroFormateado;
  }

  static numberFormatDollar(value: any) {
    // Obtener el valor actual del input
    let valor = value;

    // Quitar caracteres no numéricos
    //valor = valor.replace(/[^0-9]/g, '');

    // Si el valor está vacío, salir de la función
    if (!valor) {
      return;
    }

    // Convertir el valor a un número y dividirlo por 100 para obtener el formato deseado
    //let numero = parseInt(valor) / 100;

    //console.log('El valor en la funcion es:', numero);

    // Formateado el valor con dos decimales (.) y separadores de miles (,)
    valor = valor.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    // Asignando el valor resultante al input
    let numberWithCommas = valor;

    return numberWithCommas;
  }

  static toNumber(value: string | number | null | undefined): number {
    if (value === null || value === undefined) return 0;

    if (typeof value === 'number') return value;

    return Number(value.replace(/\./g, '').replace(',', '.')) || 0;
  }
}
