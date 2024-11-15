import {
	CannotDeleteOtherAdminError,
	FutureBirthdateError,
	UserNotAdminError,
	UserNotFoundError
} from "../errors/userError";
import { Role, User } from "../components/user";
import UserDAO from "../dao/userDAO";

/**
 * Represents a controller for managing users.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class UserController {
	private dao: UserDAO;

	constructor() {
		this.dao = new UserDAO();
	}

	/**
	 * Creates a new user.
	 * @param username - The username of the new user. It must not be null and it must not be already taken.
	 * @param name - The name of the new user. It must not be null.
	 * @param surname - The surname of the new user. It must not be null.
	 * @param password - The password of the new user. It must not be null.
	 * @param role - The role of the new user. It must not be null and it can only be one of the three allowed types ("Manager", "Customer", "Admin")
	 * @returns A Promise that resolves to true if the user has been created.
	 */
	async createUser(
		username: string,
		name: string,
		surname: string,
		password: string,
		role: string
	): Promise<Boolean> {
		if (!username || !name || !surname || !password || !role) return Promise.reject(new Error("Invalid input"));
		if (!["Manager", "Customer", "Admin"].includes(role)) return Promise.reject(new Error("Invalid role"));
		return this.dao.createUser(username, name, surname, password, role);
	}

	/**
	 * Returns all users.
	 * @returns A Promise that resolves to an array of users.
	 */
	async getUsers(): Promise<User[]> {
		return this.dao.getUsers();
	}

	/**
	 * Returns all users with a specific role.
	 * @param role - The role of the users to retrieve. It can only be one of the three allowed types ("Manager", "Customer", "Admin")
	 * @returns A Promise that resolves to an array of users with the specified role.
	 */
	async getUsersByRole(role: string): Promise<User[]> {
		return this.dao.getUsersByRole(role);
	}

	/**
	 * Returns a specific user.
	 * The function has different behavior depending on the role of the user calling it:
	 * - Admins can retrieve any user
	 * - Other roles can only retrieve their own information
	 * @param username - The username of the user to retrieve. The user must exist.
	 * @returns A Promise that resolves to the user with the specified username.
	 */
	async getUserByUsername(user: User, username: string): Promise<User> {
		return new Promise<User>((resolve, reject) => {
			if (user.role === "Admin") return resolve(this.dao.getUserByUsername(username));
			else if (user.username === username) return resolve(user);
			else return reject(new UserNotAdminError());
		});
	}

	/**
	 * Deletes a specific user
	 * The function has different behavior depending on the role of the user calling it:
	 * - Admins can delete any non-Admin user
	 * - Other roles can only delete their own account
	 * @param username - The username of the user to delete. The user must exist.
	 * @returns A Promise that resolves to true if the user has been deleted.
	 */
	async deleteUser(user: User, username: string): Promise<Boolean> {
		return new Promise<boolean>((resolve, reject) => {
			if (user.role !== Role.ADMIN && user.username !== username) return reject(new UserNotAdminError());

			this.dao
				.getUserByUsername(username)
				.then((userToDelete) => {
					if (userToDelete.role === Role.ADMIN && user.username !== userToDelete.username)
						return reject(new CannotDeleteOtherAdminError());
					return resolve(this.dao.deleteUser(username));
				})
				.catch((err) => (err instanceof UserNotFoundError ? resolve(false) : reject(err)));
		});
	}

	/**
	 * Deletes all non-Admin users
	 * @returns A Promise that resolves to true if all non-Admin users have been deleted.
	 */
	async deleteAll(): Promise<boolean> {
		return this.dao.deleteNonAdmin();
	}

	/**
	 * Updates the personal information of one user. The user can only update their own information.
	 * @param user The user who wants to update their information
	 * @param name The new name of the user
	 * @param surname The new surname of the user
	 * @param address The new address of the user
	 * @param birthdate The new birthdate of the user
	 * @param username The username of the user to update. It must be equal to the username of the user parameter.
	 * @returns A Promise that resolves to the updated user
	 */
	async updateUserInfo(
		user: User,
		name: string,
		surname: string,
		address: string,
		birthdate: string,
		username: string
	): Promise<User> {
		return new Promise<User>((resolve, reject) => {
			if (Date.parse(birthdate) > Date.now()) return reject(new FutureBirthdateError());

			this.getUserByUsername(user, username)
				.then((oldUser) => {
					const newUser = new User(username, name, surname, oldUser.role, address, birthdate);
					if (oldUser.username !== user.username && oldUser.role === Role.ADMIN)
						return reject(new CannotDeleteOtherAdminError());
					this.dao
						.updateInfo(newUser)
						.then(() => resolve(newUser))
						.catch(reject);
				})
				.catch(reject);
		});
	}
}

export default UserController;
