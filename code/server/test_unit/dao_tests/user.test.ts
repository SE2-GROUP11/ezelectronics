import { describe, test, expect, beforeAll, afterAll, jest, afterEach } from "@jest/globals";

import { User, Role } from "../../src/components/user";
import UserController from "../../src/controllers/userController";
import UserDAO from "../../src/dao/userDAO";
import crypto from "crypto";
import db from "../../src/db/db";
import { Database } from "sqlite3";
import { UserAlreadyExistsError, UserNotFoundError } from "../../src/errors/userError";

jest.mock("crypto");
jest.mock("../../src/db/db.ts");

afterEach(async () => jest.clearAllMocks());

describe("createUser", () => {
	//Example of unit test for the createUser method
	//It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods to simulate the hashing of the password
	//It then calls the createUser method and expects it to resolve true
	test("It should resolve true", async () => {
		const userDAO = new UserDAO();
		const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			callback(null);
			return {} as Database;
		});
		const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
			return Buffer.from("salt");
		});
		const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
			return Buffer.from("hashedPassword");
		});
		const result = await userDAO.createUser("username", "name", "surname", "password", "role");
		expect(result).toBe(true);
		mockRandomBytes.mockRestore();
		mockDBRun.mockRestore();
		mockScrypt.mockRestore();
	});

	// Test to handle database error on insertion
	test("UserDAO.createUser should handle database errors", async () => {
		const userDAO = new UserDAO();
		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			callback(new Error("Failed to insert user"));
			return {} as Database;
		});
		await expect(userDAO.createUser("username", "name", "surname", "password", "role")).rejects.toThrow(
			"Failed to insert user"
		);
	});

	// Test for username collision
	test("UserDAO.createUser should handle username collisions", async () => {
		const userDAO = new UserDAO();
		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			callback(new Error("UNIQUE constraint failed: users.username"));
			return {} as Database;
		});
		await expect(
			userDAO.createUser("existingusername", "name", "surname", "password", "role")
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});

	// Test for data integrity
	test("UserDAO.createUser should ensure data integrity", async () => {
		const userDAO = new UserDAO();
		jest.spyOn(crypto, "randomBytes").mockImplementation((_) => 1);
		jest.spyOn(crypto, "scryptSync").mockImplementation((_, __, ___) => Buffer.from("password"));
		const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			// Check if all necessary parameters are provided and properly formatted
			const hasAllParams = params.every((param: any) => param !== null && param !== undefined);
			const correctSQL = sql.includes("INSERT INTO users");
			if (hasAllParams && correctSQL) {
				callback(null);
			} else {
				callback(new Error("Data integrity error"));
			}
			return {} as Database; // Assurez-vous que cela correspond au type Database attendu.
		});
		const result = await userDAO.createUser("username", "name", "surname", "password", "role");
		expect(result).toBe(true);
		expect(mockDBRun.mock.calls[0][1]).toEqual(["username", "name", "surname", "role", Buffer.from("password"), 1]);
	});
});

describe("getUsers", () => {
	// Test for successful user retrieval
	test("UserDAO.getUsers should retrieve and format user data correctly", async () => {
		const userRows = [
			{
				username: "user1",
				name: "First",
				surname: "Last",
				role: Role.ADMIN,
				address: "Some Address",
				birthdate: "1990-01-01"
			},
			{
				username: "user2",
				name: "First2",
				surname: "Last2",
				role: Role.CUSTOMER,
				address: "Another Address",
				birthdate: "1992-02-02"
			}
		];
		jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
			callback(null, userRows); // Ensure correct callback usage
			return {} as Database;
		});
		const dao = new UserDAO();
		const result = await dao.getUsers();
		expect(result).toEqual(
			userRows.map((row) => new User(row.username, row.name, row.surname, row.role, row.address, row.birthdate))
		);
	});

	// Test for handling database errors
	test("UserDAO.getUsers should handle database errors", async () => {
		jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
			callback(new Error("Failed to retrieve users"), null);
			return {} as Database;
		});
		const dao = new UserDAO();
		await expect(dao.getUsers()).rejects.toThrow("Failed to retrieve users");
	});

	// Test for incorrect data format from the database
	test("UserDAO.getUsers should handle incorrect data formats", async () => {
		const incorrectData: { username: string; name: string | null; surname: string }[] = [
			{ username: "user1", name: null, surname: "Last" }
		];
		jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
			callback(null, incorrectData);
			return {} as Database;
		});
		const dao = new UserDAO();
		await expect(dao.getUsers()).rejects.toThrow("Data format error");
	});

	// Test for handling large amounts of users
	test("UserDAO.getUsers should efficiently handle large user lists", async () => {
		const largeUsersList = Array.from({ length: 1000 }, (v, i) => ({
			username: `user${i}`,
			name: `First${i}`,
			surname: `Last${i}`,
			role: `Role${i % 3}`,
			address: `Address${i}`,
			birthdate: `1990-01-01`
		}));
		jest.spyOn(db, "all").mockImplementation((sql, [], callback) => {
			callback(null, largeUsersList);
			return {} as Database;
		});
		const dao = new UserDAO();
		const result = await dao.getUsers();
		expect(result.length).toEqual(1000);
	});
});

describe("getUsersByRole", () => {
	// Test for successful retrieval of users by role from the database
	test("UserDAO.getUsersByRole should retrieve and format user data correctly by role", async () => {
		const userRows = [
			{
				username: "user1",
				name: "First",
				surname: "Last",
				role: Role.ADMIN,
				address: "Some Address",
				birthdate: "1990-01-01"
			},
			{
				username: "user2",
				name: "First2",
				surname: "Last2",
				role: Role.CUSTOMER,
				address: "Another Address",
				birthdate: "1992-02-02"
			}
		];
		jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
			const filteredRows = userRows.filter((user) => user.role === params[0]);
			callback(null, filteredRows);
			return {} as Database;
		});
		const dao = new UserDAO();
		const result = await dao.getUsersByRole("Admin");
		expect(result).toEqual([userRows[0]]);
		expect(result.every((user) => user.role === "Admin")).toBe(true);
	});

	// Test for handling database errors during retrieval by role
	test("UserDAO.getUsersByRole should handle database errors", async () => {
		jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
			callback(new Error("Failed to retrieve users"), null);
			return {} as Database;
		});
		const dao = new UserDAO();
		await expect(dao.getUsersByRole("Admin")).rejects.toThrow("Failed to retrieve users");
	});

	// Test for handling large amounts of users by role
	test("UserDAO.getUsersByRole should efficiently handle large user lists for a specific role", async () => {
		const largeUsersList = Array.from({ length: 1000 }, (v, i) => ({
			username: `user${i}`,
			name: `First${i}`,
			surname: `Last${i}`,
			role: `Role${i % 3}`,
			address: `Address${i}`,
			birthdate: `1990-01-01`
		}));
		jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
			const filteredUsers = largeUsersList.filter((user) => user.role === "Role1");
			callback(null, filteredUsers);
			return {} as Database;
		});
		const dao = new UserDAO();
		const result = await dao.getUsersByRole("Role1");
		expect(result.length).toBe(333); // Assuming even distribution of roles
	});
});

describe("getUserByUsername", () => {
	// Test for successful retrieval of user by username from the database
	test("UserDAO.getUserByUsername should retrieve user data correctly by username", async () => {
		const user = {
			username: "user1",
			name: "First",
			surname: "Last",
			role: Role.ADMIN,
			address: "Some Address",
			birthdate: "1990-01-01"
		};
		jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
			callback(null, user);
			return {} as Database;
		});
		const dao = new UserDAO();
		const result = await dao.getUserByUsername("user1");
		expect(result).toEqual(
			new User(user.username, user.name, user.surname, user.role, user.address, user.birthdate)
		);
		expect(result.username).toBe("user1");
	});

	// Test for handling database errors during retrieval by username
	test("UserDAO.getUserByUsername should handle database errors", async () => {
		jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
			callback(new Error("Failed to retrieve user"), null);
			return {} as Database;
		});
		const dao = new UserDAO();
		await expect(dao.getUserByUsername("user1")).rejects.toThrow("Failed to retrieve user");
	});

	// Test for null result when user does not exist
	test("UserDAO.getUserByUsername should reject with UserNotFoundError when the user does not exist", async () => {
		jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
			callback(null, null);
			return {} as Database;
		});
		const dao = new UserDAO();
		const result = dao.getUserByUsername("nonexistent");
		await expect(result).rejects.toBeInstanceOf(UserNotFoundError);
	});
});

describe("deleteUser", () => {
	// Test for successful deletion of a user from the database
	test("UserDAO.deleteUser should return true when the user is successfully deleted", async () => {
		const mockUser = new User("user1", "First", "Last", Role.ADMIN, "Address", "1990-01-01");

		jest.spyOn(UserDAO.prototype, "getUserByUsername").mockImplementation((username): Promise<User> => {
			return Promise.resolve(new User("user", "user", "user", Role.ADMIN, "user", ""));
		});

		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			expect(params[0]).toBe(mockUser.username); // Ensure correct username is passed
			callback(null, { changes: 1 }); // Simulate one row changed
			return {} as Database;
		});

		const dao = new UserDAO();
		const result = await dao.deleteUser(mockUser.username);
		expect(result).toBe(true);
	});

	// Test for unsuccessful deletion when the user does not exist
	test("UserDAO.deleteUser should return false when no user is deleted", async () => {
		const mockUser = new User("nonexistentUser", "First", "Last", Role.ADMIN, "Address", "1990-01-01");

		jest.spyOn(UserDAO.prototype, "getUserByUsername").mockImplementation((username): Promise<User> => {
			return Promise.reject(new UserNotFoundError());
		});

		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			expect(params[0]).toBe(mockUser.username); // Ensure correct username is passed
			callback(null, { changes: 0 }); // Simulate no rows changed
			return {} as Database;
		});

		const dao = new UserDAO();
		const result = await dao.deleteUser(mockUser.username);
		expect(result).toBe(false);
	});

	// Test for handling database errors during deletion
	test("UserDAO.deleteUser should handle database errors", async () => {
		const mockUser = new User("user1", "First", "Last", Role.ADMIN, "Address", "1990-01-01");

		jest.spyOn(UserDAO.prototype, "getUserByUsername").mockImplementation((username): Promise<User> => {
			return Promise.resolve(new User("user", "user", "user", Role.ADMIN, "user", ""));
		});

		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			expect(params[0]).toBe(mockUser.username); // Ensure correct username is passed
			callback(new Error("Failed to delete user"), null);
			return {} as Database;
		});

		const dao = new UserDAO();
		await expect(dao.deleteUser(mockUser.username)).rejects.toThrow("Failed to delete user");
	});
});

describe("deleteNonAdmin", () => {
	// Helper function to insert users into the mock database
	const insertUsers = (users: any) => {
		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			callback(null);
			return {} as Database;
		});
	};

	// Test for successful deletion of all non-admin users from the database
	test("UserDAO.deleteNonAdmin should return true when all non-admin users are successfully deleted", async () => {
		const users = [
			new User("admin1", "First", "Last", Role.ADMIN, "Address1", "1990-01-01"),
			new User("customer1", "First", "Last", Role.CUSTOMER, "Address2", "1990-01-01"),
			new User("customer2", "First", "Last", Role.CUSTOMER, "Address3", "1990-01-01")
		];

		insertUsers(users);

		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			if (sql.includes('DELETE FROM users WHERE role != "Admin"')) {
				callback(null, { changes: 2 }); // Simulate successful deletion of 2 customers
			}
			return {} as Database;
		});

		const dao = new UserDAO();
		const result = await dao.deleteNonAdmin();
		expect(result).toBe(true);
	});

	// Test for unsuccessful deletion when there is an error
	test("UserDAO.deleteNonAdmin should return false when there is a deletion error", async () => {
		const users = [
			new User("admin1", "First", "Last", Role.ADMIN, "Address1", "1990-01-01"),
			new User("customer1", "First", "Last", Role.CUSTOMER, "Address2", "1990-01-01"),
			new User("customer2", "First", "Last", Role.CUSTOMER, "Address3", "1990-01-01")
		];

		insertUsers(users);

		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			if (sql.includes('DELETE FROM users WHERE role != "Admin"')) {
				callback(new Error("Failed to delete users"), null);
			}
			return {} as Database;
		});

		const dao = new UserDAO();
		await expect(dao.deleteNonAdmin()).rejects.toThrow("Failed to delete users");
	});
});

describe("updateInfo", () => {
	// Helper function to insert a user into the mock database
	const insertUser = (user: any) => {
		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			callback(null);
			return {} as Database;
		});
		const dao = new UserDAO();
		return dao.createUser(user.username, user.name, user.surname, user.password, user.role);
	};

	// Test for successful update of user information in the database
	test("UserDAO.updateInfo should return true when the user information is successfully updated", async () => {
		const user = new User("user1", "First", "Last", Role.CUSTOMER, "Address1", "1990-01-01");
		await insertUser(user);

		const updatedUser = new User(
			"user1",
			"UpdatedFirst",
			"UpdatedLast",
			Role.CUSTOMER,
			"UpdatedAddress",
			"1990-01-01"
		);

		jest.spyOn(UserDAO.prototype, "getUserByUsername").mockImplementation((username): Promise<User> => {
			return Promise.resolve(new User("user", "user", "user", Role.ADMIN, "user", ""));
		});

		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			expect(params).toEqual([
				updatedUser.name,
				updatedUser.surname,
				updatedUser.address,
				updatedUser.birthdate,
				updatedUser.username
			]);
			callback(null);
			return {} as Database;
		});
		const dao = new UserDAO();
		const result = await dao.updateInfo(updatedUser);
		expect(result).toBe(true);
	});

	// Test for unsuccessful update when user does not exist
	test("UserDAO.updateInfo should return false when the user does not exist", async () => {
		const nonExistentUser = new User("nonexistentUser", "First", "Last", Role.CUSTOMER, "Address1", "1990-01-01");

		jest.spyOn(UserDAO.prototype, "getUserByUsername").mockImplementation((username): Promise<User> => {
			return Promise.reject(new UserNotFoundError());
		});

		jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
			callback(null, null); // Simulate no rows changed
			return {} as Database;
		});

		const dao = new UserDAO();
		const result = await dao.updateInfo(nonExistentUser);
		expect(result).toBe(false);
	});
});

describe("getIsUserAuthenticated", () => {
	// Helper function to compare passwords
	const comparePassword = (
		password: string,
		hashedPassword: string,
		callback: (err: Error | null, isMatch: boolean) => void
	) => {
		// Simulate password comparison (for example purposes)
		if (password === "password" && hashedPassword === "hashedPassword") {
			callback(null, true);
		} else {
			callback(null, false);
		}
	};

	// Test for successful authentication
	test("UserDAO.getIsUserAuthenticated should return true for valid credentials", async () => {
		jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
			callback(null, { password: "hashedPassword", username: "username", salt: 1 }); // Mocking the hashed password
			return {} as Database;
		});

		jest.spyOn(crypto, "scryptSync").mockImplementation((_, __, ___) => Buffer.from("hashedPassword", "hex"));
		jest.spyOn(crypto, "timingSafeEqual").mockImplementation((_, __) => true);

		const dao = new UserDAO();
		const result = await dao.getIsUserAuthenticated("username", "password");
		expect(result).toBe(true);
	});

	// Test for failed authentication when the password is incorrect
	test("UserDAO.getIsUserAuthenticated should return false for invalid credentials", async () => {
		jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
			callback(null, { password: "hashedPassword", username: "username", salt: 1 }); // Mocking the hashed password
			return {} as Database;
		});

		jest.spyOn(crypto, "scryptSync").mockImplementation((_, __, ___) => Buffer.from("hashedPassword", "hex"));
		jest.spyOn(crypto, "timingSafeEqual").mockImplementation((_, __) => false);

		const dao = new UserDAO();
		const result = await dao.getIsUserAuthenticated("username", "wrongPassword");
		expect(result).toBe(false);
	});

	// Test for failed authentication when the user does not exist
	test("UserDAO.getIsUserAuthenticated should return false when the user does not exist", async () => {
		jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
			callback(null, null); // Mocking the hashed password
			return {} as Database;
		});

		jest.spyOn(crypto, "scryptSync").mockImplementation((_, __, ___) => Buffer.from("hashedPassword", "hex"));
		jest.spyOn(crypto, "timingSafeEqual").mockImplementation((_, __) => true);

		const dao = new UserDAO();
		const result = await dao.getIsUserAuthenticated("nonexistentUser", "password");
		expect(result).toBe(false);
	});
});
