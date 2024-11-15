import { describe, test, expect, afterEach, beforeEach, beforeAll } from "@jest/globals";
import { emptyDB, getDefaultProduct, insertDefaultProduct, query_db } from "./utils";
import ProductController from "../src/controllers/productController";
import { LowProductStockError, ProductAlreadyExistsError, ProductNotFoundError } from "../src/errors/productError";
import db from "../src/db/db";
import { Category, Product } from "../src/components/product";

beforeEach(insertDefaultProduct);
afterEach(emptyDB);
beforeAll(emptyDB);

const availableProducts = [
	getDefaultProduct(),
	new Product(1, "prod1", Category.SMARTPHONE, null, null, 10),
	new Product(1, "prod2", Category.APPLIANCE, null, null, 10),
	new Product(1, "prod3", Category.LAPTOP, null, null, 0),
	new Product(1, "prod4", Category.SMARTPHONE, null, null, 0),
	new Product(1, "prod5", Category.APPLIANCE, null, null, 0)
];

describe("ProductController + ProductDAO + db", () => {
	describe("registerProducts", () => {
		test("Correctly register new product", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", 1, "description", 1, today);
			await expect(res).resolves.toBeUndefined();

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "model" }, { model: "prod" }]);
		});

		test("Model already exists", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("prod", "Smartphone", 1, "description", 1, today);
			await expect(res).rejects.toBeInstanceOf(ProductAlreadyExistsError);

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
		});

		test("Invalid category", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Wrong_Category", 1, "description", 1, today);
			await expect(res).rejects.toBeDefined();

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
		});

		test("Negative quantity", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", -1, "description", 1, today);
			await expect(res).rejects.toBeDefined();

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
		});

		test("Empty description", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", 1, null, 1, today);
			await expect(res).resolves.toBeUndefined();

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "model" }, { model: "prod" }]);
		});

		test("Negative price", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", 1, "description", -1, today);
			await expect(res).rejects.toBeDefined();

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
		});

		test("Arrival date is in the future", async () => {
			const controller = new ProductController();
			const tomorrow = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", 1, "description", 1, tomorrow);
			await expect(res).rejects.toBeDefined();

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
		});

		test("Missing arrival date", async () => {
			const controller = new ProductController();

			const res = controller.registerProducts("model", "Smartphone", 1, "description", 1, null);
			await expect(res).resolves.toBeUndefined();

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "model" }, { model: "prod" }]);
		});
	});

	describe("changeProductQuantity", () => {
		test("Change quantity correctly", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.changeProductQuantity("prod", 10, today);
			await expect(res).resolves.toBe(20);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 20 }]);
		});

		test("Change quantity of a non-existing product", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.changeProductQuantity("invalid_prod", 10, today);
			await expect(res).rejects.toBeDefined();

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 10 }]);
		});

		test("Date is not present", async () => {
			const controller = new ProductController();

			const res = controller.changeProductQuantity("prod", 10, null);
			await expect(res).resolves.toBe(20);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 20 }]);
		});

		test("Date is in the future", async () => {
			const controller = new ProductController();
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

			const res = controller.changeProductQuantity("prod", 10, tomorrow);
			await expect(res).rejects.toBeDefined();

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 10 }]);
		});
	});

	describe("sellProduct", () => {
		test("Correctly sell a product", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.sellProduct("prod", 5, today);
			await expect(res).resolves.toBe(5);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 5 }]);
		});

		test("Sell a non-existing product", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.sellProduct("invalid_prod", 10, today);
			await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 10 }]);
		});

		test("Sell more than the available quantity", async () => {
			const controller = new ProductController();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.sellProduct("prod", 20, today);
			await expect(res).rejects.toBeInstanceOf(LowProductStockError);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 10 }]);
		});

		test("Date is not present", async () => {
			const controller = new ProductController();

			const res = controller.sellProduct("prod", 5, null);
			await expect(res).resolves.toBe(5);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 5 }]);
		});

		test("Date is in the future", async () => {
			const controller = new ProductController();
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

			const res = controller.changeProductQuantity("prod", 10, tomorrow);
			await expect(res).rejects.toBeDefined();

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 10 }]);
		});
	});

	describe("getProducts", () => {
		describe("No filtering", () => {
			test("Get all products (with all null parameters)", async () => {
				const controller = new ProductController();

				const res = controller.getProducts(null, null, null);
				await expect(res).resolves.toEqual([getDefaultProduct()]);

				const dbRes = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
			});

			test("Get all products (with non-null category)", async () => {
				const controller = new ProductController();

				const res = controller.getProducts(null, "test", null);
				await expect(res).resolves.toEqual([getDefaultProduct()]);

				const dbRes = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
			});

			test("Get all products (with non-null model)", async () => {
				const controller = new ProductController();

				const res = controller.getProducts(null, null, "test");
				await expect(res).resolves.toEqual([getDefaultProduct()]);

				const dbRes = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
			});
		});

		describe("Filter by category", () => {
			test("Filter (with results) by category", async () => {
				const controller = new ProductController();

				const res = controller.getProducts("category", "Laptop", null);
				await expect(res).resolves.toEqual([getDefaultProduct()]);

				const dbRes = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
			});

			test("Filter (without results) by category", async () => {
				const controller = new ProductController();

				const res = controller.getProducts("category", "Smartphone", null);
				await expect(res).resolves.toEqual([]);

				const dbRes = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
			});

			test("Filter by category (with non-null model)", async () => {
				const controller = new ProductController();

				const res = controller.getProducts("category", "Laptop", "model");
				await expect(res).resolves.toEqual([getDefaultProduct()]);

				const dbRes = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
			});

			test("Filter by invalid category", async () => {
				const controller = new ProductController();

				const res = controller.getProducts("category", "test", null);
				await expect(res).rejects.toBeDefined();

				const dbRes = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
			});
		});

		describe("Filter by model", () => {
			test("Filter (with results) by model", async () => {
				const controller = new ProductController();

				const res = controller.getProducts("model", null, "prod");
				await expect(res).resolves.toEqual([getDefaultProduct()]);

				const dbRes = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
			});

			test("Filter (without results) by model", async () => {
				const controller = new ProductController();

				const res = controller.getProducts("model", null, "model");
				await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

				const dbRes = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
			});

			test("Filter by model (with non-null category)", async () => {
				const controller = new ProductController();

				const res = controller.getProducts("model", "category", "prod");
				await expect(res).resolves.toEqual([getDefaultProduct()]);

				const dbRes = query_db("SELECT model FROM products ORDER BY model");
				await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
			});
		});

		test("Invalid grouping setting", async () => {
			const controller = new ProductController();

			const res = controller.getProducts("test", null, null);
			await expect(res).rejects.toBeDefined();

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
		});
	});

	describe("getAvailableProducts", () => {
		beforeEach(async () => {
			await db.run(
				`INSERT INTO products
				(sellingPrice, model, category, arrivalDate, details, quantity)
				VALUES
				(1, "prod1", "Smartphone", null, null, 10),
				(1, "prod2", "Appliance", null, null, 10),
				(1, "prod3", "Laptop", null, null, 0),
				(1, "prod4", "Smartphone", null, null, 0),
				(1, "prod5", "Appliance", null, null, 0)`
			);
		});

		describe("No filtering", () => {
			test("Get all available products (with all null parameters)", async () => {
				const controller = new ProductController();

				const res = controller.getAvailableProducts(null, null, null);
				await expect(res).resolves.toEqual(availableProducts.filter((prod) => prod.quantity > 0));
			});

			test("Get all available products (with non-null category)", async () => {
				const controller = new ProductController();

				const res = controller.getAvailableProducts(null, "test", null);
				await expect(res).resolves.toEqual(availableProducts.filter((prod) => prod.quantity > 0));
			});

			test("Get all available products (with non-null model)", async () => {
				const controller = new ProductController();

				const res = controller.getAvailableProducts(null, null, "test");
				await expect(res).resolves.toEqual(availableProducts.filter((prod) => prod.quantity > 0));
			});
		});

		describe("Filter by category", () => {
			test("Filter by category", async () => {
				const controller = new ProductController();

				const res = controller.getAvailableProducts("category", "Laptop", null);
				await expect(res).resolves.toEqual(
					availableProducts.filter((prod) => prod.quantity > 0 && prod.category == Category.LAPTOP)
				);
			});

			test("Filter by category (with non-null model)", async () => {
				const controller = new ProductController();

				const res = controller.getAvailableProducts("category", "Laptop", "model");
				await expect(res).resolves.toEqual(
					availableProducts.filter((prod) => prod.quantity > 0 && prod.category === Category.LAPTOP)
				);
			});

			test("Filter by invalid category", async () => {
				const controller = new ProductController();

				const res = controller.getAvailableProducts("category", "test", null);
				await expect(res).rejects.toBeDefined();
			});
		});

		describe("Filter by model", () => {
			test("Filter (with results) by model", async () => {
				const controller = new ProductController();

				const res = controller.getAvailableProducts("model", null, "prod");
				await expect(res).resolves.toEqual([getDefaultProduct()]);
			});

			test("Filter (without results) by model", async () => {
				const controller = new ProductController();

				const res = controller.getAvailableProducts("model", null, "model");
				await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);
			});

			test("Filter by model (with non-null category)", async () => {
				const controller = new ProductController();

				const res = controller.getAvailableProducts("model", "category", "prod");
				await expect(res).resolves.toEqual([getDefaultProduct()]);
			});
		});

		test("Invalid grouping setting", async () => {
			const controller = new ProductController();

			const res = controller.getAvailableProducts("test", null, null);
			await expect(res).rejects.toBeDefined();
		});
	});

	describe("deleteAllProducts", () => {
		test("Successfully delete all products", async () => {
			const controller = new ProductController();

			const res = controller.deleteAllProducts();
			await expect(res).resolves.toBe(true);

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([]);
		});
	});

	describe("deleteProduct", () => {
		test("Successfully delete an existing product", async () => {
			const controller = new ProductController();

			const res = controller.deleteProduct("prod");
			await expect(res).resolves.toBe(true);

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([]);
		});

		test("Delete a non-existing product", async () => {
			const controller = new ProductController();

			const res = controller.deleteProduct("test");
			await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
		});
	});
});
