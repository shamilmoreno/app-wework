import { Repository, getRepository, DeleteResult } from "typeorm";
import { User } from "../../database/entities/user";
import { JWTService } from "./jwt.service";
import { RefreshToken } from "../../database/entities/refresh-token";
import config from "../helpers/jwt-secret";
import * as jwt from "jsonwebtoken";

export class UserService {
	private userRepository: Repository<User>;

	constructor() {
		this.userRepository = getRepository(User);
	}

	public async list(): Promise<User[]> {
		return await this.userRepository.find({
			relations: ["userWarehouses", "userWarehouses.warehouse", "userRoles", "userRoles.role", "gender"],
			order: { id: "DESC" },
		});
	}

	/**
	 * Obtiene un Usuario por su Id
	 * @param userId id del usuario
	 */
	public async getOne(userId: number): Promise<User | null> {
		return await this.userRepository.findOne({
			relations: ["userWarehouses", "userWarehouses.warehouse", "userRoles", "userRoles.role", "gender"], // 'roles' se refiere a la relación UserRole
			where: { id: userId },
		});
	}

	/**
	 * Verificar si correo electrónico existe
	 * @param userEmail Correo electronico del usuario
	 */
	public async verifyEmail(userEmail: string): Promise<User | null> {
		return await this.userRepository.findOne({
			relations: ["userWarehouses", "userWarehouses.warehouse", "userRoles", "userRoles.role"],
			where: { email: userEmail },
		});
	}

	/**
	 * Guardar token en la base de datos
	 * @param user Objeto de tipo usuario
	 */
	public async saveUser(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}

	/**
	 * Validar token
	 * @param userToken Token actual
	 */
	public async validateToken(userToken: string): Promise<User | null> {
		return await this.userRepository.findOne({ where: { token: userToken } });
	}

	/**
	 * Validar token
	 * @param userId Id del usuario
	 * @param userToken Token actual
	 */
	/* public async searchUserByIdAndToken(userId: number, userToken: string): Promise<User> {
		  return await this.userRepository.findOne({ where: { id: userId, token: userToken } });
	  } */

	public async searchUserByIdAndToken(userId: number, userToken: string): Promise<User | null> {
		return await this.userRepository
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.userWarehouses", "userWarehouse")
			.leftJoinAndSelect("userWarehouse.warehouse", "warehouse")
			.leftJoinAndSelect("user.userRoles", "userRole")
			.leftJoinAndSelect("userRole.role", "role")
			.leftJoinAndSelect("role.rolePermissions", "rolePermission")
			.leftJoinAndSelect("rolePermission.permission", "permission")
			.where("user.id = :id", { id: userId })
			.andWhere("user.token = :token", { token: userToken })
			.getOne();
	}

	/**
	 * Cerrar sesión del usuario actual
	 * @param userToken Token actual
	 */
	/* public async logout(userToken: string): Promise<boolean> {
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
	  return userFound && deleteToken ? true : false;
	} */

	public async logout(userToken: string): Promise<boolean> {
		try {
			// 1. Buscamos al usuario usando el nuevo método validateToken
			const userFound = await this.validateToken(userToken);

			if (userFound) {
				// 2. Limpiamos el token (esto ya no da error por el cambio en la Entity)
				userFound.token = null;

				// 3. Guardamos el cambio (TypeORM hará el UPDATE en Postgres)
				await this.userRepository.save(userFound);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error en logout:", error);
			return false;
		}
	}

	/**
	 * Valida un refresh token y devuelve un nuevo access token
	 */
	public async refreshUserToken(refreshTokenStr: string): Promise<string | null> {
		const rtRepo = getRepository(RefreshToken);
		const jwtService = new JWTService(); // <--- Ahora sí lo usamos

		// 1. Buscamos el token en la DB con su usuario
		const storedToken = await rtRepo.findOne({
			where: { token: refreshTokenStr },
			relations: ["user"],
		});

		// 2. Verificamos si existe y si no ha pasado su fecha de expiración
		if (!storedToken || storedToken.expiresAt < new Date()) {
			return null;
		}

		// 3. REUTILIZAMOS tu método existente de JWTService
		// (Asegúrate de que generateToken sea público en tu JWTService)
		const newAccessToken = jwtService.generateToken(storedToken.user);

		return newAccessToken;
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
		return userFound && userChangePass ? true : false;
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
		return userFound && userChangePass ? true : false;
	}

	public async saveChanges(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}

	public async remove(userId: number): Promise<DeleteResult> {
		return await this.userRepository.delete(userId);
	}

	public async update(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}

	public async getOneOnlyObject(userId: number): Promise<User | null> {
		return await this.userRepository.findOne({ where: { id: userId } });
	}

	/* public async listByUserId(userId: number): Promise<Role[]> {
		  return await getManager().getRepository(Role).find({
			  where: { user: { id: userId } },
			  order: { id: 'DESC' },
		  });
	  } */
}
