import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostListener, Optional, Self } from '@angular/core'; // 👈 Importamos AfterViewInit
import { NgControl } from '@angular/forms';

@Directive({
	selector: '[appCurrencyFormat]',
	standalone: true, // 👈 ¡CLAVE! Habilita el modo Standalone
	providers: [DecimalPipe]
})
export class CurrencyFormatDirective implements AfterViewInit { // 👈 Implementamos la interfaz

	constructor(
		private el: ElementRef<HTMLInputElement>,
		@Optional() @Self() private ngControl: NgControl
	) { }

	ngAfterViewInit(): void {
		const initialValue = this.ngControl?.value ?? this.el.nativeElement.value;
		if (initialValue) {
			setTimeout(() => {
				this.formatValue(initialValue.toString());
			});
		}
	}

	@HostListener('input', ['$event.target.value'])
	onInput(value: string) {
		this.formatValue(value);
	}

	private formatValue(value: string): void {
		// Si no hay valor o está vacío
		if (!value) {
			if (this.ngControl) {
				this.ngControl.control?.setValue(null, { emitEvent: false });
			}
			this.el.nativeElement.value = '';
			return;
		}

		// Extraer solo dígitos
		const numericValue = parseInt(value.replace(/[^\d]/g, ''), 10);

		if (!isNaN(numericValue)) {
			// Convertir y formatear a dos decimales con separador de miles
			const numero = numericValue / 100;
			const formattedValue = numero.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

			// Actualizar vista y control
			if (this.ngControl) {
				this.ngControl.control?.setValue(formattedValue, { emitEvent: false });
			}
			this.el.nativeElement.value = formattedValue;
		} else {
			if (this.ngControl) {
				this.ngControl.control?.setValue(null, { emitEvent: false });
			}
			this.el.nativeElement.value = '';
		}
	}
}