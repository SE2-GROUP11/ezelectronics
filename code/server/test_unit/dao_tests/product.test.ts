import { describe, test, expect, jest, afterEach } from "@jest/globals";
import ProductDAO from "../../src/dao/productDAO";
import { Product, Category } from "../../src/components/product";
import db from "../../src/db/db";
import {
	InvalidQuantityError,
	LowProductStockError,
	ProductAlreadyExistsError,
	ProductNotFoundError
} from "../../src/errors/productError";
import { DBmockGenerator } from "../test_unit_utils/mock_classes";
import { getRandomProduct, getRandomProductObj, productObjToClass } from "../test_unit_utils/product_utils";

test("", () => {
	expect(1).toEqual(1);
});

jest.mock("../../src/db/db.ts");

afterEach(() => {
	jest.clearAllMocks();
});

describe("ProductDAO", () => {
	describe("registerProduct", () => {
		test("Successfully register new product", async () => {
			const prod = new Product(1, "prod", Category.APPLIANCE, null, null, 1);
			const dao = new ProductDAO();

			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, null).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.registerProduct(prod);
			await expect(res).resolves.toBeUndefined();
			expect(dbGetMock).toHaveBeenCalledTimes(1);
		});

		test("Successfully register 2 products", async () => {
			const prod1 = new Product(1, "prod1", Category.APPLIANCE, null, null, 1);
			const prod2 = new Product(1, "prod2", Category.APPLIANCE, null, null, 1);
			const dao = new ProductDAO();

			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, null).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res1 = dao.registerProduct(prod1);
			const res2 = dao.registerProduct(prod2);

			await expect(res1).resolves.toBeUndefined();
			await expect(res2).resolves.toBeUndefined();
			expect(dbGetMock).toHaveBeenCalledTimes(2);
			expect(dbRunMock).toHaveBeenCalledTimes(2);
		});

		test("Register twice the same product", async () => {
			const prod1 = new Product(1, "prod1", Category.APPLIANCE, null, null, 1);
			const prod2 = new Product(1, "prod1", Category.APPLIANCE, null, null, 1);
			const dao = new ProductDAO();

			const dbGetMock = new DBmockGenerator(db, "get")
				.mockSequence([
					[null, null],
					[null, JSON.stringify({ model: "prod1" })]
				])
				.getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res1 = dao.registerProduct(prod1);
			const res2 = dao.registerProduct(prod2);

			await expect(res1).resolves.toBeUndefined();
			await expect(res2).rejects.toBeInstanceOf(ProductAlreadyExistsError);
			expect(dbGetMock).toHaveBeenCalledTimes(2);
			expect(dbRunMock).toHaveBeenCalledTimes(1);
		});

		test("Error in the db during db.get", async () => {
			const prod = new Product(1, "prod", Category.APPLIANCE, null, null, 1);
			const dao = new ProductDAO();

			const dbGetMock = new DBmockGenerator(db, "get").mockAll(Error(), null).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.registerProduct(prod);
			await expect(res).rejects.toBeDefined();

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(0);
		});

		test("Error in the db during db.run", async () => {
			const prod = new Product(1, "prod", Category.APPLIANCE, null, null, 1);
			const dao = new ProductDAO();

			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, null).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(Error(), null).getMock();

			const res = dao.registerProduct(prod);
			await expect(res).rejects.toBeDefined();

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("changeProductQuantity", () => {
		test("Change quantity of existing product", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, { quantity: 15 }).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.changeProductQuantity("model", 5);
			await expect(res).resolves.toBe(20);

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(1);
		});

		test("Change quantity of non existing product", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, null).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.changeProductQuantity("model", 10);
			await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(0);
		});

		test("Change quantity to a negative value", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, { quantity: 15}).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.changeProductQuantity("model", -20);
			await expect(res).rejects.toBeDefined();

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(0);
		});

		test("Error in db.get", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(new Error(), null).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.changeProductQuantity("model", 10);
			await expect(res).rejects.toBeDefined();

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(0);
		});

		test("Error in db.run", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, { quantity: 15}).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(new Error(), null).getMock();

			const res = dao.changeProductQuantity("model", 10);
			await expect(res).rejects.toBeDefined();

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("sellProduct", () => {
		test("Sell a correct amount of an existing product", async () => {
			jest.clearAllMocks();
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, { quantity: 10 }).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.sellProduct("model", 5);
			await expect(res).resolves.toBe(5);

			expect(dbRunMock).toHaveBeenCalledTimes(1);
			expect(dbGetMock).toHaveBeenCalledTimes(1);
		});

		test("Sell a negative amount of an existing product", async () => {
			jest.clearAllMocks();
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, { quantity: 10 }).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.sellProduct("model", -5);
			await expect(res).rejects.toBeInstanceOf(InvalidQuantityError);

			expect(dbRunMock).toHaveBeenCalledTimes(0);
			expect(dbGetMock).toHaveBeenCalledTimes(0);
		});

		test("Sell an amount of an existing product, greater than the available quantity", async () => {
			jest.clearAllMocks();
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, { quantity: 10 }).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.sellProduct("model", 15);
			await expect(res).rejects.toBeInstanceOf(LowProductStockError);

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(0);
		});

		test("Sell an amount of a non-existing product", async () => {
			jest.clearAllMocks();
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, null).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.sellProduct("model", 15);
			await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(0);
		});

		test("Error in the db during db.get", async () => {
			jest.clearAllMocks();
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(Error(), null).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.sellProduct("model", 5);
			await expect(res).rejects.toBeDefined();

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(0);
		});

		test("Error in the db during db.get", async () => {
			jest.clearAllMocks();
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, { quantity: 10 }).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(Error(), null).getMock();

			const res = dao.sellProduct("model", 5);
			await expect(res).rejects.toBeDefined();

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("getProducts", () => {
		test("Successfully get all products", async () => {
			const dao = new ProductDAO();

			const products_asObj = new Array(5).fill(0).map(getRandomProductObj);
			const products_asProd = products_asObj.map(productObjToClass);

			const dbAllMock = new DBmockGenerator(db, "all").mockAll(null, products_asObj).getMock();

			const res = dao.getProducts();
			await expect(res).resolves.toEqual(products_asProd);

			expect(dbAllMock).toHaveBeenCalledTimes(1);
		});

		test("Successfully filter by category", async () => {
			const dao = new ProductDAO();

			const products_asObj = new Array(15)
				.fill(0)
				.map(getRandomProductObj)
				.filter((prod) => prod.category === Category.LAPTOP);

			const products_asProd = products_asObj.map(productObjToClass);

			const dbAllMock = new DBmockGenerator(db, "all").mockAll(null, products_asObj).getMock();

			const res = dao.getProducts("category", "Laptop");
			await expect(res).resolves.toEqual(products_asProd);

			expect(dbAllMock).toHaveBeenCalledTimes(1);
		});

		test("Successfully filter by model", async () => {
			const dao = new ProductDAO();

			const prod_asObj = getRandomProductObj();
			const prod_asProd = productObjToClass(prod_asObj);

			const dbAllMock = new DBmockGenerator(db, "all").mockAll(null, [prod_asObj]).getMock();

			const res = dao.getProducts("model", undefined, prod_asObj.model);
			await expect(res).resolves.toEqual([prod_asProd]);

			expect(dbAllMock).toHaveBeenCalledTimes(1);
		});

		test("Error in the db during db.all", async () => {
			const dao = new ProductDAO();
			const dbAllMock = new DBmockGenerator(db, "all").mockAll(Error(), null).getMock();

			const res = dao.getProducts();
			await expect(res).rejects.toBeDefined();

			expect(dbAllMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("getAvailableProducts", () => {
		test("Successfully get all available products", async () => {
			const dao = new ProductDAO();

			const products_asObj = new Array(5)
				.fill(0)
				.map(getRandomProductObj)
				.filter((prod) => prod.quantity > 0);

			const products_asProd = products_asObj.map(productObjToClass);

			const dbAllMock = new DBmockGenerator(db, "all").mockAll(null, products_asObj).getMock();

			const res = dao.getAvailableProducts();
			await expect(res).resolves.toEqual(products_asProd);

			expect(dbAllMock).toHaveBeenCalledTimes(1);
		});

		test("Successfully filter by category", async () => {
			const dao = new ProductDAO();

			const products_asObj = new Array(15)
				.fill(0)
				.map(getRandomProductObj)
				.filter((prod) => prod.category === Category.LAPTOP && prod.quantity > 0);

			const products_asProd = products_asObj.map(productObjToClass);

			const dbAllMock = new DBmockGenerator(db, "all").mockAll(null, products_asObj).getMock();

			const res = dao.getAvailableProducts("category", "Laptop");
			await expect(res).resolves.toEqual(products_asProd);

			expect(dbAllMock).toHaveBeenCalledTimes(1);
		});

		test("Successfully filter by model", async () => {
			const dao = new ProductDAO();

			const prod_asObj = getRandomProductObj();
			prod_asObj.quantity = 100;
			const prod_asProd = productObjToClass(prod_asObj);

			const dbAllMock = new DBmockGenerator(db, "all").mockAll(null, [prod_asObj]).getMock();

			const res = dao.getAvailableProducts("model", undefined, prod_asObj.model);
			await expect(res).resolves.toEqual([prod_asProd]);

			expect(dbAllMock).toHaveBeenCalledTimes(2);
		});

		test("Error in the db during db.all", async () => {
			const dao = new ProductDAO();
			const dbAllMock = new DBmockGenerator(db, "all").mockAll(Error(), null).getMock();

			const res = dao.getAvailableProducts();
			await expect(res).rejects.toBeDefined();

			expect(dbAllMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("deleteAllProducts", () => {
		test("Successfully delete all products", async () => {
			const dao = new ProductDAO();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.deleteAllProducts();
			await expect(res).resolves.toBeUndefined();

			expect(dbRunMock).toHaveBeenCalledTimes(1);
		});

		test("Error in the db during db.run", async () => {
			const dao = new ProductDAO();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(Error(), null).getMock();

			const res = dao.deleteAllProducts();
			await expect(res).rejects.toBeDefined();

			expect(dbRunMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("deleteProduct", () => {
		test("Successfully delete a product", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, { model: "test" }).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.deleteProduct("prod");
			await expect(res).resolves.toBeUndefined();

			expect(dbRunMock).toHaveBeenCalledTimes(1);
			expect(dbGetMock).toHaveBeenCalledTimes(1);
		});

		test("Delete a non-existing product", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, null).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.deleteProduct("prod");
			await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(0);
		});

		test("Error in the db during db.get", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(Error(), null).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(null, null).getMock();

			const res = dao.deleteProduct("prod");
			await expect(res).rejects.toBeDefined();

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(0);
		});

		test("Error in the db during db.run", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, { model: "test" }).getMock();
			const dbRunMock = new DBmockGenerator(db, "run").mockAll(Error(), null).getMock();

			const res = dao.deleteProduct("prod");
			await expect(res).rejects.toBeDefined();

			expect(dbGetMock).toHaveBeenCalledTimes(1);
			expect(dbRunMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("getProductByModel", () => {
		test("Product exists", async () => {
			const dao = new ProductDAO();
			const prod = getRandomProduct();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, prod).getMock();

			const res = dao.getProductByModel("prod");
			await expect(res).resolves.toEqual(prod);

			expect(dbGetMock).toHaveBeenCalledTimes(1);
		});

		test("Product does not exist", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(null, null).getMock();

			const res = dao.getProductByModel("prod");
			await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

			expect(dbGetMock).toHaveBeenCalledTimes(1);
		});

		test("Error in db.get", async () => {
			const dao = new ProductDAO();
			const dbGetMock = new DBmockGenerator(db, "get").mockAll(Error(), null).getMock();

			const res = dao.getProductByModel("prod");
			await expect(res).rejects.toBeInstanceOf(Error);

			expect(dbGetMock).toHaveBeenCalledTimes(1);
		});
	});
});
