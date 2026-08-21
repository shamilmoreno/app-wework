import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '@core/models/user.model';

/* export class LocalStorageService {
	public getValue(key: string): any {
		return localStorage.getItem(key);
	}

	public setValue(key: string, data: string): void {
		localStorage.setItem(key, data);
	}

	public getToken(): any {
		const currentUser = this.getValue('currentUser');
		const jwt = currentUser.token;
		const jwtData = jwt.split('.')[1];
		const decodedJwtJsonData = window.atob(jwtData);
		const decodedJwtData = JSON.parse(decodedJwtJsonData);
		return decodedJwtData;
	}

	public clearStorage(): void {
		localStorage.clear();
	}
}
 */

@Injectable({
	providedIn: 'root'
})

export class LocalStorageService {
	// El BehaviorSubject mantiene el estado del usuario en memoria para toda la app
	private userSubject = new BehaviorSubject<UserModel | null>(this.getStoredUser());
	public user$: Observable<UserModel | null> = this.userSubject.asObservable();

	public getValue(key: string): string | null {
		return localStorage.getItem(key);
	}

	private getStoredUser(): UserModel | null {
		const data = localStorage.getItem('currentUser');
		return data ? JSON.parse(data) : null;
	}

	/* public setValue(key: string, data: string): void {
		localStorage.setItem(key, data);
		if (key === 'currentUser') {
			this.userSubject.next(JSON.parse(data));
		}
	} */

	public setValue(key: string, data: string): void {
		localStorage.setItem(key, data);
		if (key === 'currentUser') {
			try {
				// Actualizamos el subject con el nuevo objeto para que toda la app se entere
				this.userSubject.next(JSON.parse(data));
			} catch (e) {
				console.error('Error parseando el usuario en setValue', e);
			}
		}
	}


	// Método para obtener el usuario actual de forma síncrona
	public getCurrentUser(): UserModel | null {
		console.log('El usuario en getCurrentUser', this.userSubject);
		return this.userSubject.value;
	}

	// Método para obtener almacenes específicamente
	public getWarehouses(): any[] {
		return this.userSubject.value?.warehouses || [];
	}

	public clearStorage(): void {
		localStorage.clear();
		this.userSubject.next(null);
	}
}
