import { AfterViewInit, Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	selector: '[appFormattedNumber]',
	standalone: true // 👈 ¡CLAVE! Esto permite importarla directamente en componentes standalone
})
export class FormattedNumberDirective implements AfterViewInit {

	constructor(
		private el: ElementRef<HTMLInputElement>,
		@Optional() @Self() private ngControl: NgControl
	) { }

	ngAfterViewInit(): void {
		const initialValue = this.ngControl?.value ?? this.el.nativeElement.value;
		if (initialValue !== null && initialValue !== undefined) {
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
		if (!value) {
			if (this.ngControl) {
				this.ngControl.control?.setValue(null, { emitEvent: false });
			}
			this.el.nativeElement.value = '';
			return;
		}

		// Extraer solo dígitos
		const cleanValue = value.toString().replace(/[^\d]/g, '');
		const numericValue = parseInt(cleanValue, 10);

		if (!isNaN(numericValue)) {
			// Formatear visualmente con comas (ej. 1,234,567)
			const formattedValue = numericValue.toLocaleString('en-US');

			// Actualizar el DOM directamente para el usuario
			this.el.nativeElement.value = formattedValue;

			// Actualizar el control del formulario (guardamos el número limpio o el texto según tu necesidad)
			if (this.ngControl) {
				this.ngControl.control?.setValue(formattedValue, { emitEvent: false });
			}
		} else {
			if (this.ngControl) {
				this.ngControl.control?.setValue(null, { emitEvent: false });
			}
			this.el.nativeElement.value = '';
		}
	}
}