import { describe, test, afterEach, jest, expect } from "@jest/globals";
import {
	Middleware_authentication_mockGenerator,
	Middleware_validateRequest_mockGenerator,
	ProdContr_changeProductQuantity_MockGenerator,
	ProdContr_deleteAllProducts_MockGenerator,
	ProdContr_deleteProduct_MockGenerator,
	ProdContr_getAvailableProducts_MockGenerator,
	ProdContr_getProducts_MockGenerator,
	ProdContr_registerProducts_MockGenerator,
	ProdContr_sellProduct_MockGenerator
} from "../test_unit_utils/mock_classes";
import request from "supertest";
import { app } from "../../index";
import { Category, Product } from "../../src/components/product";

const baseURL = "/ezelectronics";

jest.mock("../../src/controllers/productController");
jest.mock("../../src/routers/auth");
jest.mock("../../src/helper");

afterEach(async () => jest.clearAllMocks());

describe("ProductRoutes", () => {
	describe("POST /", () => {
		test("Success", async () => {
			const registerMock = new ProdContr_registerProducts_MockGenerator().mockAll(null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const isManagerMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).post(`${baseURL}/products`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(200);

			expect(registerMock).toBeCalledTimes(1);
			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(isManagerMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
		});

		test("Not logged", async () => {
			const registerMock = new ProdContr_registerProducts_MockGenerator().mockAll(null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("err").getMock();
			const isManagerMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).post(`${baseURL}/products`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);

			expect(registerMock).toBeCalledTimes(0);
			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(isManagerMock).toBeCalledTimes(0);
			expect(paramMock).toBeCalledTimes(0);
		});

		test("Not manager", async () => {
			const registerMock = new ProdContr_registerProducts_MockGenerator().mockAll(null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const isManagerMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("err")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).post(`${baseURL}/products`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);

			expect(registerMock).toBeCalledTimes(0);
			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(isManagerMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(0);
		});

		test("Invalid param", async () => {
			const registerMock = new ProdContr_registerProducts_MockGenerator().mockAll(null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const isManagerMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(Error("Invalid param")).getMock();

			const res = request(app).post(`${baseURL}/products`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(422);

			expect(registerMock).toBeCalledTimes(0);
			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(isManagerMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
		});
	});

	describe("PATCH /:model", () => {
		test("Ok", async () => {
			const controllerMock = new ProdContr_changeProductQuantity_MockGenerator().mockAll(5, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).patch(`${baseURL}/products/model`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(200);
			expect((await res).body).toEqual({ quantity: 5 });

			expect(controllerMock).toBeCalledTimes(1);
			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
		});

		test("Not logged", async () => {
			const controllerMock = new ProdContr_changeProductQuantity_MockGenerator().mockAll(5, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("err").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).patch(`${baseURL}/products/model`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(0);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong user type", async () => {
			const controllerMock = new ProdContr_changeProductQuantity_MockGenerator().mockAll(5, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("err")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).patch(`${baseURL}/products/model`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong params", async () => {
			const controllerMock = new ProdContr_changeProductQuantity_MockGenerator().mockAll(5, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator()
				.mockAll(Error("Parameters error"))
				.getMock();

			const res = request(app).patch(`${baseURL}/products/model`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(422);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
			expect(controllerMock).toBeCalledTimes(0);
		});
	});

	describe("PATCH /:model/sell", () => {
		test("Ok", async () => {
			const controllerMock = new ProdContr_sellProduct_MockGenerator().mockAll(5, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).patch(`${baseURL}/products/model/sell`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(200);
			expect((await res).body).toEqual({ quantity: 5 });

			expect(controllerMock).toBeCalledTimes(1);
			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
		});

		test("Not logged", async () => {
			const controllerMock = new ProdContr_sellProduct_MockGenerator().mockAll(5, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("err").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).patch(`${baseURL}/products/model/sell`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(0);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong user type", async () => {
			const controllerMock = new ProdContr_sellProduct_MockGenerator().mockAll(5, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("err")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).patch(`${baseURL}/products/model/sell`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong params", async () => {
			const controllerMock = new ProdContr_sellProduct_MockGenerator().mockAll(5, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator()
				.mockAll(Error("Parameters error"))
				.getMock();

			const res = request(app).patch(`${baseURL}/products/model/sell`).send({});
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(422);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
			expect(controllerMock).toBeCalledTimes(0);
		});
	});

	describe("GET /", () => {
		test("Ok", async () => {
			const prod = new Product(1, "model", Category.APPLIANCE, null, null, 1);

			const controllerMock = new ProdContr_getProducts_MockGenerator().mockAll([prod], null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).get(`${baseURL}/products/`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(200);
			expect((await res).body).toEqual([prod]);

			expect(controllerMock).toBeCalledTimes(1);
			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
		});

		test("Not logged", async () => {
			const controllerMock = new ProdContr_getProducts_MockGenerator().mockAll([], null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("err").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).get(`${baseURL}/products/`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(0);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong user type", async () => {
			const controllerMock = new ProdContr_getProducts_MockGenerator().mockAll([], null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("err")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).get(`${baseURL}/products/`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong params", async () => {
			const controllerMock = new ProdContr_getProducts_MockGenerator().mockAll([], null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator()
				.mockAll(Error("Parameters error"))
				.getMock();

			const res = request(app).get(`${baseURL}/products/`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(422);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
			expect(controllerMock).toBeCalledTimes(0);
		});
	});

	describe("GET /available", () => {
		test("Ok", async () => {
			const prod = new Product(1, "model", Category.APPLIANCE, null, null, 1);

			const controllerMock = new ProdContr_getAvailableProducts_MockGenerator().mockAll([prod], null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).get(`${baseURL}/products/available`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(200);
			expect((await res).body).toEqual([prod]);

			expect(controllerMock).toBeCalledTimes(1);
			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
		});

		test("Not logged", async () => {
			const controllerMock = new ProdContr_getAvailableProducts_MockGenerator().mockAll([], null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("err").getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).get(`${baseURL}/products/available`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong params", async () => {
			const controllerMock = new ProdContr_getAvailableProducts_MockGenerator().mockAll([], null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(Error("Wrong params")).getMock();

			const res = request(app).get(`${baseURL}/products/available`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(422);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
			expect(controllerMock).toBeCalledTimes(0);
		});
	});

	describe("DELETE /", () => {
		test("Ok", async () => {
			const controllerMock = new ProdContr_deleteAllProducts_MockGenerator().mockAll(true, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).delete(`${baseURL}/products`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(200);
			expect((await res).body).toBeDefined();

			expect(controllerMock).toBeCalledTimes(1);
			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
		});

		test("Not logged", async () => {
			const controllerMock = new ProdContr_deleteAllProducts_MockGenerator().mockAll(true, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("err").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).delete(`${baseURL}/products`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(0);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong user type", async () => {
			const controllerMock = new ProdContr_deleteAllProducts_MockGenerator().mockAll(true, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("err")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).delete(`${baseURL}/products`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong params", async () => {
			const controllerMock = new ProdContr_deleteAllProducts_MockGenerator().mockAll(true, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator()
				.mockAll(Error("Parameters error"))
				.getMock();

			const res = request(app).delete(`${baseURL}/products`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(422);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
			expect(controllerMock).toBeCalledTimes(0);
		});
	});

	describe("DELETE /:model", () => {
		test("Ok", async () => {
			const controllerMock = new ProdContr_deleteProduct_MockGenerator().mockAll(true, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).delete(`${baseURL}/products/model1`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(200);
			expect((await res).body).toBeDefined();

			expect(controllerMock).toBeCalledTimes(1);
			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
		});

		test("Not logged", async () => {
			const controllerMock = new ProdContr_deleteProduct_MockGenerator().mockAll(true, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("err").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).delete(`${baseURL}/products/model1`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(0);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong user type", async () => {
			const controllerMock = new ProdContr_deleteProduct_MockGenerator().mockAll(true, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("err")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator().mockAll(null).getMock();

			const res = request(app).delete(`${baseURL}/products/model1`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(401);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(0);
			expect(controllerMock).toBeCalledTimes(0);
		});

		test("Wrong params", async () => {
			const controllerMock = new ProdContr_deleteProduct_MockGenerator().mockAll(true, null).getMock();
			const isLoggedInMock = new Middleware_authentication_mockGenerator("isLoggedIn").mockAll("ok").getMock();
			const authLevelMock = new Middleware_authentication_mockGenerator("isAdminOrManager")
				.mockAll("ok")
				.getMock();
			const paramMock = new Middleware_validateRequest_mockGenerator()
				.mockAll(Error("Parameters error"))
				.getMock();

			const res = request(app).delete(`${baseURL}/products/model1`);
			await expect(res).resolves.toBeDefined();
			expect((await res).status).toBe(422);
			expect((await res).body).toBeDefined();

			expect(isLoggedInMock).toBeCalledTimes(1);
			expect(authLevelMock).toBeCalledTimes(1);
			expect(paramMock).toBeCalledTimes(1);
			expect(controllerMock).toBeCalledTimes(0);
		});
	});
});
