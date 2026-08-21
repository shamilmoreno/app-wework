import { DeleteResult, getManager } from 'typeorm';
import { User } from '../../database/entities/user';

export class UserService {
	public async list(): Promise<User[]> {
		return await getManager().getRepository(User).find({
			relations: ['roles', 'roles.role', 'gender'],
			order: { id: 'DESC' },
		});
	}

	/**
	 * Obtiene un Usuario por su Id
	 * @param userId id del usuario
	 */
	/* 	public async getOne(userId: number): Promise<User> {
			return await getManager().getRepository(User).findOne({
				relations: ['roles', 'roles.role', 'gender'],
				where: { id: userId }
			});
		}
	 */
	public async getOne(userId: number): Promise<User> {
		return await getManager().getRepository(User).findOne({
			relations: ['roles', 'roles.role', 'gender'], // 'roles' se refiere a la relación UserRole
			where: { id: userId }
		});
	}


	/**
	 * Verificar si correo electrónico existe
	 * @param userEmail Correo electronico del usuario
	 */
	public async verifyEmail(userEmail: string): Promise<User> {
		return await getManager().getRepository(User).findOne({
			relations: ['roles', 'roles.role',],
			where: { email: userEmail }
		});
	}

	/**
	 * Guardar token en la base de datos
	 * @param user Objeto de tipo usuario
	 */
	public async saveUser(user: User): Promise<User> {
		return await getManager().getRepository(User).save(user);
	}

	/**
	 * Validar token
	 * @param userToken Token actual
	 */
	public async validateToken(userToken: string): Promise<User> {
		return await getManager().getRepository(User).findOne({ where: { token: userToken } });
	}

	/**
	 * Validar token
	 * @param userId Id del usuario
	 * @param userToken Token actual
	 */
	public async searchUserByIdAndToken(userId: number, userToken: string): Promise<User> {
		return await getManager().getRepository(User).findOne({ where: { id: userId, token: userToken } });
	}

	/**
	 * Cerrar sesión del usuario actual
	 * @param userToken Token actual
	 */
	public async logout(userToken: string): Promise<boolean> {
		let deleteToken;
		const userFound = await this.validateToken(userToken);

		// Delete token of the database
		if (userFound) {
			userFound.token = null;
			deleteToken = await this.saveUser(userFound);
		} else {
			deleteToken = false;
		}

		// Return result
		return (userFound && deleteToken) ? true : false;
	}

	/**
	 * Cambio de contraseña
	 * @param userToken Token del usuario
	 * @param newPassword Nueva contraseña
	 */
	public async changePassword(userToken: string, newPassword: string): Promise<boolean> {
		let userChangePass;
		const userFound = await this.validateToken(userToken);

		// Delete token of the database
		if (userFound) {
			userFound.password = newPassword;
			userFound.hashPassword();
			userChangePass = await this.saveUser(userFound);
		} else {
			userChangePass = false;
		}

		// Return result
		return (userFound && userChangePass) ? true : false;
	}

	/**
	 * Creación de contraseña
	 * @param userToken Token del usuario
	 * @param newPassword Nueva contraseña
	 */
	public async createPassword(userToken: string, newPassword: string): Promise<boolean> {
		let userChangePass;
		const userFound = await this.validateToken(userToken);

		// Delete token of the database
		if (userFound) {
			userFound.password = newPassword;
			userFound.hashPassword();
			userChangePass = await this.saveUser(userFound);
		} else {
			userChangePass = false;
		}

		// Return result
		return (userFound && userChangePass) ? true : false;
	}

	public async saveChanges(user: User): Promise<User> {
		return await getManager().getRepository(User).save(user);
	}

	public async remove(userId: number): Promise<DeleteResult> {
		return await getManager().getRepository(User).delete(userId);
	}

	public async update(user: User): Promise<User> {
		return await getManager().getRepository(User).save(user);
	}

	public async getOneOnlyObject(userId: number): Promise<User> {
		return await getManager().getRepository(User).findOne({ where: { id: userId } });
	}

	/* public async listByUserId(userId: number): Promise<Role[]> {
		return await getManager().getRepository(Role).find({
			where: { user: { id: userId } },
			order: { id: 'DESC' },
		});
	} */
}
