import { describe, test, expect, afterEach, beforeEach, beforeAll } from "@jest/globals";
import {
	emptyDB,
	getDefaultReview,
	insertDefaultProducts,
	insertDefaultReview,
	insertDefaultUsers,
	loginAs,
	query_db,
	today,
	yesterday
} from "./utils";
import request from "supertest";
import { app } from "..";

beforeEach(async () => {
	return new Promise<void>((resolve, reject) => {
		insertDefaultProducts()
			.then(() => {
				insertDefaultUsers()
					.then(() => {
						insertDefaultReview().then(resolve).catch(reject);
					})
					.catch(reject);
			})
			.catch(reject);
	});
});

afterEach(emptyDB);
beforeAll(emptyDB);

const baseURL = "/ezelectronics/reviews";

describe("ReviewRoutes + ReviewController + ReviewDAO + db", () => {
	describe('"POST /:model"', () => {
		describe("Authentication", () => {
			test("As admin", async () => {
				const cookie = await loginAs("Admin");
				const body = { score: 3, comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("As manager", async () => {
				const cookie = await loginAs("Manager");
				const body = { score: 3, comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("As customer", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: 3, comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT * FROM productreview ORDER BY date");
				await expect(dbres).resolves.toEqual([
					{ model: "prod", user: "Customer", score: 3, date: yesterday(), comment: "Ok" },
					{ model: "prod_review", user: "Customer", score: 3, date: today(), comment: "Ok" }
				]);
			});

			test("Unauthenticated", async () => {
				const body = { score: 3, comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_review`).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});

		describe("Errors in the model parameter", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: 3, comment: "Ok" };

				const res = request(app).post(`${baseURL}`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				// It becomes a different, non existing route
				expect((await res).status).toBe(404);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: 3, comment: "Ok" };

				const res = request(app).post(`${baseURL}/`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				// It becomes a different, non existing route
				expect((await res).status).toBe(404);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});

		describe("Errors in body.score", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Customer");
				const body = { comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: "", comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Wrong type (string)", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: "test", comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Wrong type (float)", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: 1.5, comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Value greater than 5", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: 6, comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Value lower than 1", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: 0, comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});

		describe("Errors in body.comment", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: 3 };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: 3, comment: "" };

				const res = request(app).post(`${baseURL}/prod_review`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(422);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});

		describe("Additional constraints", () => {
			test("Model does not exist", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: 3, comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod_invalid`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Review already exists", async () => {
				const cookie = await loginAs("Customer");
				const body = { score: 3, comment: "Ok" };

				const res = request(app).post(`${baseURL}/prod`).set("Cookie", cookie).send(body);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(409);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});
	});

	describe('"GET /:model"', () => {
		describe("Authentication", () => {
			test("As admin", async () => {
				const cookie = await loginAs("Admin");
				const res = request(app).get(`${baseURL}/prod`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultReview()]);
			});

			test("As manager", async () => {
				const cookie = await loginAs("Manager");
				const res = request(app).get(`${baseURL}/prod`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultReview()]);
			});

			test("As customer", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).get(`${baseURL}/prod`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);
				expect((await res).body).toEqual([getDefaultReview()]);
			});

			test("Unauthenticated", async () => {
				const res = request(app).get(`${baseURL}/prod`);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);
			});
		});

		describe("Errors in the model parameter", () => {
			test("Missing field", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).get(`${baseURL}`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				// It becomes a different, non existing route
				expect((await res).status).toBe(404);
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).get(`${baseURL}/`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				// It becomes a different, non existing route
				expect((await res).status).toBe(404);
			});

			test("Non existing product", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).get(`${baseURL}/prod_invalid`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);
			});
		});
	});

	describe('"DELETE /:model"', () => {
		describe("Authentication", () => {
			test("As admin", async () => {
				const cookie = await loginAs("Admin");
				const res = request(app).delete(`${baseURL}/prod`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("As manager", async () => {
				const cookie = await loginAs("Manager");
				const res = request(app).delete(`${baseURL}/prod`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("As customer", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).delete(`${baseURL}/prod`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
			});

			test("Unauthenticated", async () => {
				const res = request(app).delete(`${baseURL}/prod`);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});

		describe("Errors in the model parameter", () => {
			test("Missing field", async () => {
				// It becomes a different, existing route
				expect("Untestable").toBe("Untestable");
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).delete(`${baseURL}/`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});

		describe("Additional constraints", () => {
			test("Non existing product", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).delete(`${baseURL}/prod_invalid`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Non existing review", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).delete(`${baseURL}/prod_review`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});
	});

	describe('"DELETE /:model/all"', () => {
		describe("Authentication", () => {
			test("As admin", async () => {
				const cookie = await loginAs("Admin");
				const res = request(app).delete(`${baseURL}/prod/all`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
			});

			test("As manager", async () => {
				const cookie = await loginAs("Manager");
				const res = request(app).delete(`${baseURL}/prod/all`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
			});

			test("As customer", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).delete(`${baseURL}/prod/all`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Unauthenticated", async () => {
				const res = request(app).delete(`${baseURL}/prod/all`);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});

		describe("Errors in the model parameter", () => {
			test("Missing field", async () => {
				// It becomes a different, existing route
				expect("Untestable").toBe("Untestable");
			});

			test("Empty field", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).delete(`${baseURL}//all`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				// It becomes a different, non existing route
				expect((await res).status).toBe(404);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});

		describe("Additional constraints", () => {
			test("Non existing product", async () => {
				const cookie = await loginAs("Admin");
				const res = request(app).delete(`${baseURL}/prod_invalid/all`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(404);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});
	});

	describe('"DELETE /"', () => {
		describe("Authentication", () => {
			test("As admin", async () => {
				const cookie = await loginAs("Admin");
				const res = request(app).delete(`${baseURL}`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
			});

			test("As manager", async () => {
				const cookie = await loginAs("Manager");
				const res = request(app).delete(`${baseURL}`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(200);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
			});

			test("As customer", async () => {
				const cookie = await loginAs("Customer");
				const res = request(app).delete(`${baseURL}`).set("Cookie", cookie);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});

			test("Unauthenticated", async () => {
				const res = request(app).delete(`${baseURL}`);

				await expect(res).resolves.toBeDefined();
				expect((await res).status).toBe(401);

				const dbres = query_db("SELECT COUNT(*) AS cnt FROM productreview");
				await expect(dbres).resolves.toEqual([{ cnt: 1 }]);
			});
		});
	});
});
