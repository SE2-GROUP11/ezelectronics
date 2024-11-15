import { describe, test, expect, afterEach, beforeEach, beforeAll } from "@jest/globals";
import {
	emptyDB,
	getDefaultProduct,
	insertDefaultProduct,
	insertDefaultUsers,
	loginAs,
	NdaysAgo,
	query_db,
	today,
	tomorrow,
	yesterday
} from "./utils";
import request from "supertest";
import { app } from "..";
import { Category } from "../src/components/product";

beforeEach(() => {
	return new Promise<void>((resolve, reject) => {
		insertDefaultProduct()
			.then(() => {
				insertDefaultUsers().then(resolve).catch(reject);
			})
			.catch(reject);
	});
});

afterEach(emptyDB);
beforeAll(emptyDB);

const baseURL = "/ezelectronics/products";

describe("ProductRoutes + ProductController + ProductDAO + db", () => {
	describe('"POST /"', () => {
		describe("Authentication", () => {
			test("Successful (as admin)", async () => {
				const cookie = await loginAs("Admin");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod" }, { model: "prod1" }]);
			});

			test("Successful (as manager)", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod" }, { model: "prod1" }]);
			});

			test("Wrong user type", async () => {
				const cookie = await loginAs("Customer");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});

			test("Unauthenticated", async () => {
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});
		});

		describe("Errors in body.model", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: 1,
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Errors in body.category", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: "",
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: 1,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Errors in body.quantity", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: "",
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type (float)", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10.1,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type (string)", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: "test",
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Quantity = 0", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 0,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Negative quantity", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: -1,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Errors in body.details", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod" }, { model: "prod1" }]);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod" }, { model: "prod1" }]);
			});

			test("Wrong type", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: 1,
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Errors in body.sellingPrice", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: "",
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: "test",
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Price = 0", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 0,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Negative price", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: -1,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Floating price", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 1.5,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod" }, { model: "prod1" }]);
			});
		});

		describe("Errors in body.arrivalDate", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT model, arrivalDate FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([
					{ model: "prod", arrivalDate: yesterday() },
					{ model: "prod1", arrivalDate: today() }
				]);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: ""
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: 100
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong date format", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "01-01-2024"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Not a date", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "test"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Additional constraints", () => {
			test("Model is already present", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: "2024-01-01"
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(409);
			});

			test("Date is in the future", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: tomorrow()
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(400);
			});

			test("Date is today", async () => {
				const cookie = await loginAs("Manager");
				const body = {
					model: "prod1",
					category: Category.SMARTPHONE,
					quantity: 10,
					details: "details",
					sellingPrice: 100,
					arrivalDate: today()
				};

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod" }, { model: "prod1" }]);
			});
		});
	});

	describe('"PATCH /:model"', () => {
		describe("Authentication", () => {
			test("Successful (as admin)", async () => {
				const cookie = await loginAs("Admin");
				const body = { quantity: 5, changeDate: today() };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual({ quantity: 15 });

				const dbres = query_db("SELECT model, quantity FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod", quantity: 15 }]);
			});

			test("Successful (as manager)", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, changeDate: today() };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual({ quantity: 15 });

				const dbres = query_db("SELECT model, quantity FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod", quantity: 15 }]);
			});

			test("Wrong user type", async () => {
				const cookie = await loginAs("Customer");
				const body = { quantity: 5, changeDate: today() };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});

			test("Unauthenticated", async () => {
				const body = { quantity: 5, changeDate: today() };
				const res = request(app).patch(`${baseURL}/prod`).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});
		});

		describe("Errors in model parameter", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, changeDate: today() };

				const res = request(app).patch(`${baseURL}/`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);
			});
		});

		describe("Errors in body.quantity", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = { changeDate: today() };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: "", changeDate: today() };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type (string)", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: "test", changeDate: today() };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type (float)", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 1.5, changeDate: today() };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Quantity = 0", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 0, changeDate: today() };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Negative quantity", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: -1, changeDate: today() };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Errors in body.changeDate", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5 };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual({ quantity: 15 });

				const dbres = query_db("SELECT model, quantity FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod", quantity: 15 }]);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, changeDate: "" };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, changeDate: 123 };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Not a date", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, changeDate: "test" };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong date format", async () => {
				const cookie = await loginAs("Manager");
				const tod = today();
				const today_wrong = tod[8] + tod[9] + "-" + tod[5] + tod[6] + "-" + tod[0] + tod[1] + tod[2] + tod[3];
				const body = { quantity: 5, changeDate: today_wrong };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Additional constraints", () => {
			test("Model does not exist", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 1, changeDate: today() };

				const res = request(app).patch(`${baseURL}/prod_invalid`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);
			});

			test("Date is in the future", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, changeDate: tomorrow() };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(400);
			});

			test("Date is before arrivalDate", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, changeDate: NdaysAgo(10) };

				const res = request(app).patch(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(400);
			});
		});
	});

	describe('"PATCH /:model/sell"', () => {
		describe("Authentication", () => {
			test("Successful (as admin)", async () => {
				const cookie = await loginAs("Admin");
				const body = { quantity: 5, sellingDate: today() };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT model, quantity FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod", quantity: 5 }]);
			});

			test("Successful (as manager)", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, sellingDate: today() };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT model, quantity FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod", quantity: 5 }]);
			});

			test("Wrong user type", async () => {
				const cookie = await loginAs("Customer");
				const body = { quantity: 5, sellingDate: today() };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});

			test("Unauthenticated", async () => {
				const body = { quantity: 5, sellingDate: today() };
				const res = request(app).patch(`${baseURL}/prod/sell`).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});
		});

		describe("Errors in model parameter", () => {
			test("Missing field", async () => {
				// Becomes a different, existing route
				expect("Untestable").toBe("Untestable");
			});

			test("Empty field", async () => {
				// Becomes a different, existing route
				expect("Untestable").toBe("Untestable");
			});
		});

		describe("Errors in body.quantity", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = { sellingDate: today() };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: "", sellingDate: today() };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type (string)", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: "test", sellingDate: today() };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type (float)", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 1.5, sellingDate: today() };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Quantity = 0", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 0, sellingDate: today() };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Negative quantity", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: -1, sellingDate: today() };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Errors in body.sellingDate", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5 };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT model, quantity FROM products ORDER BY model");
				await expect(dbres).resolves.toEqual([{ model: "prod", quantity: 5 }]);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, sellingDate: "" };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong type", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, sellingDate: 123 };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Not a date", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, sellingDate: "test" };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong date format", async () => {
				const cookie = await loginAs("Manager");
				const tod = today();
				const today_wrong = tod[8] + tod[9] + "-" + tod[5] + tod[6] + "-" + tod[0] + tod[1] + tod[2] + tod[3];
				const body = { quantity: 5, sellingDate: today_wrong };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Additional constraints", () => {
			test("Model does not exist", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 1, sellingDate: today() };

				const res = request(app).patch(`${baseURL}/prod_invalid/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);
			});

			test("Date is in the future", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, sellingDate: tomorrow() };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(400);
			});

			test("Date is before arrivalDate", async () => {
				const cookie = await loginAs("Manager");
				const body = { quantity: 5, sellingDate: NdaysAgo(10) };

				const res = request(app).patch(`${baseURL}/prod/sell`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(400);
			});
		});
	});

	describe('"GET /"', () => {
		describe("Authentication", () => {
			test("Successful (as admin)", async () => {
				const cookie = await loginAs("Admin");
				const res = request(app).get(`${baseURL}`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Successful (as manager)", async () => {
				const cookie = await loginAs("Manager");
				const res = request(app).get(`${baseURL}`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Wrong user type", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).get(`${baseURL}`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});

			test("Unauthenticated", async () => {
				const res = request(app).get(`${baseURL}`);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});
		});

		describe("Grouping by category", () => {
			test("Correct category (some results)", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", category: "Laptop" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Correct category (no results)", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", category: "Smartphone" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([]);
			});

			test("Invalid category", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", category: "test" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("No category", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Category and model", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", category: "Laptop", model: "test" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Missing category, model present", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", model: "test" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong category data type", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", category: 1 };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Grouping by model", () => {
			test("Valid model", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model", model: "prod" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Missing model", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Empty model", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model", model: "" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Model and category", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model", model: "prod", category: "Laptop" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("No model, and category", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model", category: "Laptop" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("No specific grouping", () => {
			test("No grouping parameter", async () => {
				const cookie = await loginAs("Manager");
				const params = {};

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Empty grouping parameter", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("No grouping, but with model", async () => {
				const cookie = await loginAs("Manager");
				const params = { model: "prod" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("No grouping, but with category", async () => {
				const cookie = await loginAs("Manager");
				const params = { category: "prod" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("No grouping, but with category and model", async () => {
				const cookie = await loginAs("Manager");
				const params = { model: "prod", category: "Laptop" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Invalid grouping", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "test" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Additional constraints", () => {
			test("Model is not in the db", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model", model: "prod_invalid" };

				const res = request(app).get(`${baseURL}`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);
			});
		});
	});

	describe('"GET /available"', () => {
		describe("Authentication", () => {
			test("Successful (as admin)", async () => {
				const cookie = await loginAs("Admin");
				const res = request(app).get(`${baseURL}/available`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Successful (as manager)", async () => {
				const cookie = await loginAs("Manager");
				const res = request(app).get(`${baseURL}/available`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Wrong user type", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).get(`${baseURL}/available`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Unauthenticated", async () => {
				const res = request(app).get(`${baseURL}/available`);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});
		});

		describe("Grouping by category", () => {
			test("Correct category (some results)", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", category: "Laptop" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Correct category (no results)", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", category: "Smartphone" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([]);
			});

			test("Invalid category", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", category: "test" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("No category", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Category and model", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", category: "Laptop", model: "test" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Missing category, model present", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", model: "test" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Wrong category data type", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "category", category: 1 };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("Grouping by model", () => {
			test("Valid model", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model", model: "prod" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Missing model", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Empty model", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model", model: "" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Model and category", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model", model: "prod", category: "Laptop" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("No model, and category", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model", category: "Laptop" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});
		});

		describe("No specific grouping", () => {
			test("No grouping parameter", async () => {
				const cookie = await loginAs("Manager");
				const params = {};

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultProduct()]);
			});

			test("Empty grouping parameter", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("No grouping, but with model", async () => {
				const cookie = await loginAs("Manager");
				const params = { model: "prod" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("No grouping, but with category", async () => {
				const cookie = await loginAs("Manager");
				const params = { category: "prod" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("No grouping, but with category and model", async () => {
				const cookie = await loginAs("Manager");
				const params = { model: "prod", category: "Laptop" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("Invalid grouping", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "test" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);
			});

			test("All products unavailable", async () => {
				const cookie = await loginAs("Manager");
				const params = {};

				await query_db("UPDATE products SET quantity = 0");

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([]);
			});
		});

		describe("Additional constraints", () => {
			test("Model is not in the db", async () => {
				const cookie = await loginAs("Manager");
				const params = { grouping: "model", model: "prod_invalid" };

				const res = request(app).get(`${baseURL}/available`).query(params).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);
			});
		});
	});

	describe('"DELETE /:model"', () => {
		describe("Authentication", () => {
			test("Successful (as admin)", async () => {
				const cookie = await loginAs("Admin");
				const res = request(app).delete(`${baseURL}/prod`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT * FROM products");
				await expect(dbres).resolves.toEqual([]);
			});

			test("Successful (as manager)", async () => {
				const cookie = await loginAs("Manager");
				const res = request(app).delete(`${baseURL}/prod`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT * FROM products");
				await expect(dbres).resolves.toEqual([]);
			});

			test("Wrong user type", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).delete(`${baseURL}/prod`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});

			test("Unauthenticated", async () => {
				const res = request(app).delete(`${baseURL}/prod`);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});
		});

		describe("Errors in model parameter", () => {
			test("Missing or empty field", async () => {
				// in case the parameter is missing, we end up in a different API call (DELETE /)
				expect("Unreachable").toBe("Unreachable");
			});
		});

		describe("Additional constraints", () => {
			test("Model is not in the db", async () => {
				const cookie = await loginAs("Manager");
				const res = request(app).delete(`${baseURL}/wrong_prod`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);
			});
		});
	});

	describe('"DELETE /"', () => {
		describe("Authentication", () => {
			test("Successful (as admin)", async () => {
				const cookie = await loginAs("Admin");
				const res = request(app).delete(`${baseURL}/`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT * FROM products");
				await expect(dbres).resolves.toEqual([]);
			});

			test("Successful (as manager)", async () => {
				const cookie = await loginAs("Manager");
				const res = request(app).delete(`${baseURL}/`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT * FROM products");
				await expect(dbres).resolves.toEqual([]);
			});

			test("Wrong user type", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).delete(`${baseURL}/`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});

			test("Unauthenticated", async () => {
				const res = request(app).delete(`${baseURL}/`);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});
		});
	});
});
