import { describe, test, expect, afterEach, beforeEach, beforeAll } from "@jest/globals";
import ProductDAO from "../src/dao/productDAO";
import { Product, Category } from "../src/components/product";
import db from "../src/db/db";
import {
	InvalidQuantityError,
	LowProductStockError,
	ProductAlreadyExistsError,
	ProductNotFoundError
} from "../src/errors/productError";
import { emptyDB, getDefaultProduct, insertDefaultProduct, query_db } from "./utils";
import { NegativeQuantityError } from "../src/errors/cartError";

beforeEach(insertDefaultProduct);
afterEach(emptyDB);
beforeAll(emptyDB);

describe("ProductDAO + db", () => {
	describe("registerProduct", () => {
		test("Successfully register new product", async () => {
			const prod = new Product(1, "product", Category.APPLIANCE, null, null, 1);
			const dao = new ProductDAO();

			const res = dao.registerProduct(prod);
			await expect(res).resolves.toBeUndefined();

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }, { model: "product" }]);
		});

		test("Successfully register 2 products", async () => {
			const prod1 = new Product(1, "prod1", Category.APPLIANCE, null, null, 1);
			const prod2 = new Product(1, "prod2", Category.APPLIANCE, null, null, 1);
			const dao = new ProductDAO();

			const res1 = dao.registerProduct(prod1);
			const res2 = dao.registerProduct(prod2);

			await expect(res1).resolves.toBeUndefined();
			await expect(res2).resolves.toBeUndefined();

			const dbRes = query_db("SELECT model FROM products ORDER BY model");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }, { model: "prod1" }, { model: "prod2" }]);
		});

		test("Register twice the same product", async () => {
			const prod1 = new Product(1, "prod1", Category.APPLIANCE, null, null, 1);
			const prod2 = new Product(1, "prod1", Category.APPLIANCE, null, null, 1);
			const dao = new ProductDAO();

			const res1 = dao.registerProduct(prod1);
			await expect(res1).resolves.toBeUndefined();

			const res2 = dao.registerProduct(prod2);
			await expect(res2).rejects.toBeInstanceOf(ProductAlreadyExistsError);

			const dbRes = query_db("SELECT model FROM products ORDER BY MODEL");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }, { model: "prod1" }]);
		});
	});

	describe("changeProductQuantity", () => {
		test("Change quantity of existing product", async () => {
			const dao = new ProductDAO();

			const res = dao.changeProductQuantity("prod", 20);
			await expect(res).resolves.toBe(30);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 30 }]);
		});

		test("Change quantity of non existing product", async () => {
			const dao = new ProductDAO();

			const res = dao.changeProductQuantity("test", 20);
			await expect(res).rejects.toBeDefined();

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 10 }]);
		});

		test("Change quantity to a negative value", async () => {
			const dao = new ProductDAO();

			const res = dao.changeProductQuantity("prod", -20);
			await expect(res).rejects.toBeDefined();

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 10 }]);
		});
	});

	describe("sellProduct", () => {
		test("Sell a correct amount of an existing product", async () => {
			const dao = new ProductDAO();

			const res = dao.sellProduct("prod", 5);
			await expect(res).resolves.toBe(5);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 5 }]);
		});

		test("Sell a negative amount of an existing product", async () => {
			const dao = new ProductDAO();

			const res = dao.sellProduct("prod", -5);
			await expect(res).rejects.toBeInstanceOf(InvalidQuantityError);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 10 }]);
		});

		test("Sell an amount of an existing product, greater than the available quantity", async () => {
			const dao = new ProductDAO();

			const res = dao.sellProduct("prod", 15);
			await expect(res).rejects.toBeInstanceOf(LowProductStockError);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 10 }]);
		});

		test("Sell an amount of a non-existing product", async () => {
			const dao = new ProductDAO();

			const res = dao.sellProduct("model", 5);
			await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

			const dbRes = query_db("SELECT quantity FROM products");
			await expect(dbRes).resolves.toEqual([{ quantity: 10 }]);
		});
	});

	describe("getProducts", () => {
		test("Successfully get all products", async () => {
			const dao = new ProductDAO();

			const res = dao.getProducts();
			await expect(res).resolves.toEqual([getDefaultProduct()]);

			const dbRes = query_db("SELECT model FROM products");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
		});
	});

	describe("getAvailableProducts", () => {
		test("Successfully get all available products", async () => {
			const dao = new ProductDAO();

			await db.run(
				`INSERT INTO products
					(sellingPrice, model, category, arrivalDate, details, quantity)
				VALUES
					(1, "prod2", "Laptop", null, null, 0)`
			);

			const res = dao.getAvailableProducts();
			await expect(res).resolves.toEqual([getDefaultProduct()]);

			const dbRes = query_db("SELECT model FROM products");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }, { model: "prod2" }]);
		});
	});

	describe("deleteAllProducts", () => {
		test("Successfully delete all products", async () => {
			const dao = new ProductDAO();

			const res = dao.deleteAllProducts();
			await expect(res).resolves.toBeUndefined();

			const dbRes = query_db("SELECT model FROM products");
			await expect(dbRes).resolves.toEqual([]);
		});
	});

	describe("deleteProduct", () => {
		test("Successfully delete a product", async () => {
			const dao = new ProductDAO();

			const res = dao.deleteProduct("prod");
			await expect(res).resolves.toBeUndefined();

			const dbRes = query_db("SELECT model FROM products");
			await expect(dbRes).resolves.toEqual([]);
		});

		test("Delete a non-existing product", async () => {
			const dao = new ProductDAO();

			const res = dao.deleteProduct("prod2");
			await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

			const dbRes = query_db("SELECT model FROM products");
			await expect(dbRes).resolves.toEqual([{ model: "prod" }]);
		});
	});

	describe("getProductByModel", () => {
		test("Product exists", async () => {
			const dao = new ProductDAO();

			const res = dao.getProductByModel("prod");
			await expect(res).resolves.toEqual(getDefaultProduct());
		});

		test("Product does not exist", async () => {
			const dao = new ProductDAO();

			const res = dao.getProductByModel("prod1");
			await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);
		});
	});
});
