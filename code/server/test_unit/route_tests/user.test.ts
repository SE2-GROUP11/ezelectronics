import { describe, test, expect, jest, beforeAll, beforeEach, afterEach } from "@jest/globals";
import request from "supertest";
import express from "express";
import { app } from "../../index";

import UserController from "../../src/controllers/userController";
import Authenticator from "../../src/routers/auth";
import ErrorHandler from "../../src/helper";
import { User, Role } from "../../src/components/user";

import { Request, Response, NextFunction } from "express";

import {
	Middleware_authentication_mockGenerator,
	Middleware_validateRequest_mockGenerator
} from "../test_unit_utils/mock_classes";
import { CannotDeleteOtherAdminError, UserAlreadyExistsError, UserNotAdminError, UserNotFoundError } from "../../src/errors/userError";

const baseURL = "/ezelectronics/users";

let mockAdmin = new User("adminUsername", "adminName", "adminSurname", Role.ADMIN, "adminAddress", "adminBirthdate");
let mockManager = new User(
	"managerUsername",
	"managerName",
	"managerSurname",
	Role.MANAGER,
	"managerAddress",
	"managerBirthdate"
);
let mockCustomer = new User(
	"customerUsername",
	"customerName",
	"customerSurname",
	Role.CUSTOMER,
	"customerAddress",
	"customerBirthdate"
);

declare module "express-serve-static-core" {
	interface Request {
		user?: User;
	}
}

//Example of a unit test for the POST ezelectronics/users route
//The test checks if the route returns a 200 success code
//The test also expects the createUser method of the controller to be called once with the correct parameters

test("It should return a 200 success code", async () => {
	new Middleware_validateRequest_mockGenerator().mockAll(null);
	const testUser = {
		//Define a test user object sent to the route
		username: "test",
		name: "test",
		surname: "test",
		password: "test",
		role: "Manager"
	};
	jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true); //Mock the createUser method of the controller
	const response = await request(app).post(baseURL).send(testUser); //Send a POST request to the route
	expect(response.status).toBe(200); //Check if the response status is 200
	expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1); //Check if the createUser method has been called once
	//Check if the createUser method has been called with the correct parameters
	expect(UserController.prototype.createUser).toHaveBeenCalledWith(
		testUser.username,
		testUser.name,
		testUser.surname,
		testUser.password,
		testUser.role
	);
});

jest.mock("../../src/routers/auth");
jest.mock("../../src/helper");

afterEach(async () => jest.clearAllMocks());

describe("UserRoutes", () => {
	describe("POST /users", () => {
		const validUser = {
			username: "test",
			name: "test",
			surname: "test",
			password: "test",
			role: "Manager"
		};

		test("It should create a user and return a 200 status code", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true);
			const response = await request(app).post(baseURL).send(validUser);
			expect(response.status).toBe(200);
			expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1);
			expect(UserController.prototype.createUser).toHaveBeenCalledWith(
				validUser.username,
				validUser.name,
				validUser.surname,
				validUser.password,
				validUser.role
			);
		});

		test("It should return a 422 status code if username is missing", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(new Error());
			const invalidUser = { ...validUser, username: "" };
			const response = await request(app).post(baseURL).send(invalidUser);
			expect(response.status).toBe(422);
		});

		test("It should return a 422 status code if name is missing", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(new Error());
			const invalidUser = { ...validUser, name: "" };
			const response = await request(app).post(baseURL).send(invalidUser);
			expect(response.status).toBe(422);
		});

		test("It should return a 422 status code if surname is missing", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(new Error());
			const invalidUser = { ...validUser, surname: "" };
			const response = await request(app).post(baseURL).send(invalidUser);
			expect(response.status).toBe(422);
		});

		test("It should return a 422 status code if password is missing", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(new Error());
			const invalidUser = { ...validUser, password: "" };
			const response = await request(app).post(baseURL).send(invalidUser);
			expect(response.status).toBe(422);
		});

		test("It should return a 422 status code if role is missing", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(new Error());
			const invalidUser = { ...validUser, role: "" };
			const response = await request(app).post(baseURL).send(invalidUser);
			expect(response.status).toBe(422);
		});

		test("It should return a 422 status code if role is invalid", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(new Error());
			const invalidUser = { ...validUser, role: "InvalidRole" };
			const response = await request(app).post(baseURL).send(invalidUser);
			expect(response.status).toBe(422);
		});

		test("It should return a 409 status code if username already exists", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			jest.spyOn(UserController.prototype, "createUser").mockRejectedValueOnce(new UserAlreadyExistsError());
			const response = await request(app).post(baseURL).send(validUser);
			expect(response.status).toBe(409);
		});
	});

	describe("GET /users", () => {
		test("It should return 401 if the user is not logged in", async () => {
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("err");
			const response = await request(app).get(baseURL);
			expect(response.status).toBe(401);
		});

		test("It should return 401 if the user is not an admin", async () => {
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			new Middleware_authentication_mockGenerator("isAdmin").mockAll("err");
			const response = await request(app).get(baseURL);
			expect(response.status).toBe(401);
		});

		test("It should retrieve all users and return a 200 status code if the user is an admin", async () => {
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			new Middleware_authentication_mockGenerator("isAdmin").mockAll("ok");

			const users = [mockAdmin, mockManager, mockCustomer];
			jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce(users);
			const response = await request(app).get(baseURL);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(users);
			expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(1);
		});
	});

	describe("GET /users/roles/:role", () => {
		test("It should validate the role parameter", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(new Error());
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			new Middleware_authentication_mockGenerator("isAdmin").mockAll("ok");
			const invalidRoles = ["InvalidRole", "", null];

			for (const role of invalidRoles) {
				const response = await request(app).get(`${baseURL}/roles/${role}`);
				expect(response.status).toBe(422);
			}
		});

		test("It should retrieve users by role and return a 200 status code", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			new Middleware_authentication_mockGenerator("isAdmin").mockAll("ok");
			const role = "Manager";
			jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce([mockManager]);

			const response = await request(app).get(`${baseURL}/roles/${role}`);
			expect(response.status).toBe(200);
			expect(response.body).toEqual([mockManager]);
			expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
			expect(UserController.prototype.getUsersByRole).toHaveBeenCalledWith(role);
		});

		test("It should return an empty array if no users with the specified role are found", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			new Middleware_authentication_mockGenerator("isAdmin").mockAll("ok");
			const role = "Manager";
			jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce([]);

			const response = await request(app).get(`${baseURL}/roles/${role}`);
			expect(response.status).toBe(200);
			expect(response.body).toEqual([]);
			expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
			expect(UserController.prototype.getUsersByRole).toHaveBeenCalledWith(role);
		});
	});

	describe("GET /users/:username", () => {
		// Mock Authenticator middleware
		jest.mock("../../src/routers/auth", () => {
			return jest.fn().mockImplementation(() => {
				return {
					isLoggedIn: jest.fn((req: Request, res: Response, next: NextFunction) => {
						req.user = mockAdmin; // Mock logged in user
						next();
					}),
					isAdmin: jest.fn((req: Request, res: Response, next: NextFunction) => {
						if (req.user && req.user.role === "Admin") next();
						else res.status(403).end();
					})
				};
			});
		});
	});

	describe("DELETE /users/:username", () => {
		const adminUser = { username: "admin", role: "Admin" };
		const managerUser = { username: "manager", role: "Manager" };

		test("It should delete any user if the requester is an Admin and return a 200 status code", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			const usernameToDelete = "user1";
			jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true);
			const response = await request(app)
				.delete(`${baseURL}/${usernameToDelete}`)
				.set("user", JSON.stringify(adminUser));
			expect(response.status).toBe(200);
			expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1);
		});

		test("It should not delete another Admin and return a 401 status code", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			const anotherAdmin = { username: "admin2", role: "Admin" };
			jest.spyOn(UserController.prototype, "deleteUser").mockImplementationOnce(() => {
				return Promise.reject(new CannotDeleteOtherAdminError());
			});
			const response = await request(app)
				.delete(`${baseURL}/${anotherAdmin.username}`)
				.set("user", JSON.stringify(adminUser));
			expect(response.status).toBe(401);
			expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1);
		});

		test("It should delete own data if the requester is not an Admin and return a 200 status code", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true);
			const response = await request(app)
				.delete(`${baseURL}/${managerUser.username}`)
				.set("user", JSON.stringify(managerUser));
			expect(response.status).toBe(200);
			expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1);
		});

		test("It should not delete another user's data if the requester is not an Admin and return a 401 status code", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			const usernameToDelete = "user2";
			const nonAdminUser = { username: "user1", role: "Manager" };
			jest.spyOn(UserController.prototype, "deleteUser").mockImplementationOnce(() => {
				return Promise.reject(new UserNotAdminError());
			});
			const response = await request(app)
				.delete(`${baseURL}/${usernameToDelete}`)
				.set("user", JSON.stringify(nonAdminUser));
			expect(response.status).toBe(401);
			expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1);
		});

		test("It should return a 404 status code if the username does not exist", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			const nonExistingUser = "nonExistingUser";
			const mock = jest.spyOn(UserController.prototype, "deleteUser").mockImplementationOnce(() => {
				return Promise.reject(new UserNotFoundError())
			});
			const response = await request(app)
				.delete(`${baseURL}/${nonExistingUser}`)
				.set("user", JSON.stringify(adminUser));
			expect(response.status).toBe(404);
			expect(mock).toHaveBeenCalledTimes(1);
		});
	});

	describe("DELETE /users", () => {
		test("It should delete all users and return a 200 status code if user is logged in and admin", async () => {
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			new Middleware_authentication_mockGenerator("isAdmin").mockAll("ok");
			jest.spyOn(UserController.prototype, "deleteAll").mockResolvedValueOnce(true);
			const response = await request(app).delete(`${baseURL}`);
			expect(response.status).toBe(200);
			expect(UserController.prototype.deleteAll).toHaveBeenCalledTimes(1);
		});

		test("It should return a 401 status code if user is not logged in", async () => {
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("err");
			new Middleware_authentication_mockGenerator("isAdmin").mockAll("ok");

			const response = await request(app).delete(`${baseURL}`);
			expect(response.status).toBe(401);
			expect(UserController.prototype.deleteAll).not.toHaveBeenCalled();
		});

		test("It should return a 401 status code if user is not an admin", async () => {
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			new Middleware_authentication_mockGenerator("isAdmin").mockAll("err");

			const response = await request(app).delete(`${baseURL}`);
			expect(response.status).toBe(401);
			expect(UserController.prototype.deleteAll).not.toHaveBeenCalled();
		});

		test("It should handle errors gracefully", async () => {
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			new Middleware_authentication_mockGenerator("isAdmin").mockAll("ok");

			jest.spyOn(UserController.prototype, "deleteAll").mockImplementation(() =>
				Promise.reject(new Error("Deletion failed"))
			);
			const response = await request(app).delete(`${baseURL}`);
			expect(response.status).toBe(503);
			expect(response.text).toContain("Deletion failed");
		});
	});

	describe("PATCH /users/:username", () => {
		test("It should update user information and return a 200 status code when user is authenticated", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			const username = "testUser";
			const updateUser = {
				name: "newName",
				surname: "newSurname",
				address: "newAddress",
				birthdate: "2000-01-01"
			};
			let mockUpdatedUser = new User(
				"testUser",
				"newName",
				"newSurname",
				Role.CUSTOMER,
				"newAddress",
				"2000-01-01"
			);

			jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(mockUpdatedUser);
			const response = await request(app).patch(`${baseURL}/${username}`).send(updateUser);

			expect(response.status).toBe(200);
			expect(response.body).toEqual(mockUpdatedUser);
			expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
		});

		test("It should return 401 if non-admin user tries to update another user's info", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => {
				req.user = { role: "Customer", username: "nonAdminUser" };
				next();
			});

			const username = "testUser";
			const updateUser = {
				name: "newName",
				surname: "newSurname",
				address: "newAddress",
				birthdate: "2000-01-01"
			};

			const response = await request(app).patch(`${baseURL}/${username}`).send(updateUser);
			expect(response.status).toBe(401);
			expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
		});

		test("It should return 422 if any required field is missing", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(new Error());
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			const username = "testUser";
			const invalidUpdateUser = {
				name: "",
				surname: "newSurname",
				address: "newAddress",
				birthdate: "2000-01-01"
			};

			const response = await request(app).patch(`${baseURL}/${username}`).send(invalidUpdateUser);
			expect(response.status).toBe(422);
			expect(UserController.prototype.updateUserInfo).not.toHaveBeenCalled();
		});

		test("It should return 422 if birthdate is invalid", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(new Error());
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			const username = "testUser";
			const invalidUpdateUser = {
				name: "newName",
				surname: "newSurname",
				address: "newAddress",
				birthdate: "invalid-date"
			};

			const response = await request(app).patch(`${baseURL}/${username}`).send(invalidUpdateUser);
			expect(response.status).toBe(422);
			expect(UserController.prototype.updateUserInfo).not.toHaveBeenCalled();
		});

		test("It should allow admin user to update another user's info", async () => {
			new Middleware_validateRequest_mockGenerator().mockAll(null);
			new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok");
			const username = "testUser";
			const updateUser = {
				name: "newName",
				surname: "newSurname",
				address: "newAddress",
				birthdate: "2000-01-01"
			};
			let mockUpdatedUser = new User(
				"testUser",
				"newName",
				"newSurname",
				Role.CUSTOMER,
				"newAddress",
				"2000-01-01"
			);

			jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(mockUpdatedUser);
			const response = await request(app).patch(`${baseURL}/${username}`).send(updateUser);

			expect(response.status).toBe(200);
			expect(response.body).toEqual(mockUpdatedUser);
			expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
		});
	});
});
