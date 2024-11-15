import {
	ProdDAO_registerProduct_MockGenerator,
	ProdDAO_changeProductQuantity_MockGenerator,
	ProdDAO_sellProduct_MockGenerator,
	ProdDAO_getProducts_MockGenerator,
	ProdDAO_getAvailableProducts_MockGenerator,
	ProdDAO_deleteAllProducts_MockGenerator,
	ProdDAO_deleteProduct_MockGenerator,
	ProdDAO_getProductByModel_MockGenerator
} from "../test_unit_utils/mock_classes";
import { describe, test, expect, jest, afterEach } from "@jest/globals";
import ProductController from "../../src/controllers/productController";
import ProductDAO from "../../src/dao/productDAO";
import { LowProductStockError, ProductAlreadyExistsError, ProductNotFoundError } from "../../src/errors/productError";
import { Category, Product } from "../../src/components/product";
import { getRandomProduct, getRandomProductObj, productObjToClass } from "../test_unit_utils/product_utils";
import { error } from "console";

test("", () => {
	expect(1).toEqual(1);
});

jest.mock("../../src/db/db.ts");
jest.mock("../../src/dao/productDAO");

afterEach(() => {
	jest.clearAllMocks();
});

describe("ProductController", () => {
	describe("registerProducts", () => {
		test("Correctly register new product", async () => {
			const controller = new ProductController();
			const registerMock = new ProdDAO_registerProduct_MockGenerator().mockAll(true, null).getMock();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", 1, "description", 1, today);
			await expect(res).resolves.toBeUndefined();

			expect(registerMock).toHaveBeenCalledTimes(1);
		});

		test("Model already exists", async () => {
			const controller = new ProductController();
			const registerMock = new ProdDAO_registerProduct_MockGenerator()
				.mockAll(false, new ProductAlreadyExistsError())
				.getMock();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", 1, "description", 1, today);
			await expect(res).rejects.toBeInstanceOf(ProductAlreadyExistsError);

			expect(registerMock).toHaveBeenCalledTimes(1);
		});

		test("Invalid category", async () => {
			const controller = new ProductController();
			const registerMock = new ProdDAO_registerProduct_MockGenerator().mockAll(true, null).getMock();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Wrong_Category", 1, "description", 1, today);
			await expect(res).rejects.toBeDefined();

			expect(registerMock).toHaveBeenCalledTimes(0);
		});

		test("Negative quantity", async () => {
			const controller = new ProductController();
			const registerMock = new ProdDAO_registerProduct_MockGenerator().mockAll(true, null).getMock();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", -1, "description", 1, today);
			await expect(res).rejects.toBeDefined();

			expect(registerMock).toHaveBeenCalledTimes(0);
		});

		test("Empty description", async () => {
			const controller = new ProductController();
			const registerMock = new ProdDAO_registerProduct_MockGenerator().mockAll(true, null).getMock();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", 1, null, 1, today);
			await expect(res).resolves.toBeUndefined();

			expect(registerMock).toHaveBeenCalledTimes(1);
		});

		test("Negative price", async () => {
			const controller = new ProductController();
			const registerMock = new ProdDAO_registerProduct_MockGenerator().mockAll(true, null).getMock();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", 1, "description", -1, today);
			await expect(res).rejects.toBeDefined();

			expect(registerMock).toHaveBeenCalledTimes(0);
		});

		test("Arrival date is in the future", async () => {
			const controller = new ProductController();
			const registerMock = new ProdDAO_registerProduct_MockGenerator().mockAll(true, null).getMock();
			const tomorrow = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString().split("T")[0];

			const res = controller.registerProducts("model", "Smartphone", 1, "description", 1, tomorrow);
			await expect(res).rejects.toBeDefined();

			expect(registerMock).toHaveBeenCalledTimes(0);
		});

		test("Missing arrival date", async () => {
			const controller = new ProductController();
			const registerMock = new ProdDAO_registerProduct_MockGenerator().mockAll(true, null).getMock();

			const res = controller.registerProducts("model", "Smartphone", 1, "description", 1, null);
			await expect(res).resolves.toBeUndefined();

			expect(registerMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("changeProductQuantity", () => {
		test("Change quantity correctly", async () => {
			const controller = new ProductController();
			const prod = new Product(1, "prod", Category.APPLIANCE, "", "", 10);
			
			const mock1 = new ProdDAO_getProductByModel_MockGenerator().mockAll(prod, null).getMock();
			const mock2 = new ProdDAO_changeProductQuantity_MockGenerator().mockAll(15, null).getMock();
			const today = new Date().toISOString().split("T")[0];

			// assuming the current product quantity is 5
			const res = controller.changeProductQuantity("model", 10, today);
			await expect(res).resolves.toBe(15);

			expect(mock1).toHaveBeenCalledTimes(1);
			expect(mock2).toHaveBeenCalledTimes(1);
		});

		test("Change quantity of a non-existing product", async () => {
			const controller = new ProductController();
			
			const mock1 = new ProdDAO_getProductByModel_MockGenerator().mockAll(null, Error()).getMock();
			const mock2 = new ProdDAO_changeProductQuantity_MockGenerator().mockAll(0, Error()).getMock();
			const today = new Date().toISOString().split("T")[0];

			const res = controller.changeProductQuantity("model", 10, today);
			await expect(res).rejects.toBeDefined();

			expect(mock1).toHaveBeenCalledTimes(1);
			expect(mock2).toHaveBeenCalledTimes(0);
		});

		test("Date is not present", async () => {
			const controller = new ProductController();
			const prod = new Product(1, "prod", Category.APPLIANCE, "", "", 10);
			
			const mock1 = new ProdDAO_getProductByModel_MockGenerator().mockAll(prod, null).getMock();
			const mock2 = new ProdDAO_changeProductQuantity_MockGenerator().mockAll(15, null).getMock();

			// assuming the current product quantity is 5
			const res = controller.changeProductQuantity("model", 10, null);
			await expect(res).resolves.toBe(15);

			expect(mock1).toHaveBeenCalledTimes(1);
			expect(mock2).toHaveBeenCalledTimes(1);
		});

		test("Date is in the future", async () => {
			const controller = new ProductController();
			const mock = new ProdDAO_changeProductQuantity_MockGenerator().mockAll(15, null).getMock();
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

			const res = controller.changeProductQuantity("model", 10, tomorrow);
			await expect(res).rejects.toBeDefined();

			expect(mock).toHaveBeenCalledTimes(0);
		});
	});

	describe("sellProduct", () => {
		test("Correctly sell a product", async () => {
			const controller = new ProductController();
			const prod = new Product(1, "prod", Category.APPLIANCE, "", "", 10);

			const mock1 = new ProdDAO_getProductByModel_MockGenerator().mockAll(prod, null).getMock();
			const mock2 = new ProdDAO_sellProduct_MockGenerator().mockAll(5, null).getMock();

			// assuming there is 15 in stock
			const res = controller.sellProduct("model", 10, null);
			await expect(res).resolves.toBe(5);

			expect(mock1).toHaveBeenCalledTimes(1);
			expect(mock2).toHaveBeenCalledTimes(1);
		});

		test("Sell a non-existing product", async () => {
			const controller = new ProductController();

			const mock1 = new ProdDAO_getProductByModel_MockGenerator()
				.mockAll(null, new ProductNotFoundError())
				.getMock();
			const mock2 = new ProdDAO_sellProduct_MockGenerator().mockAll(5, null).getMock();

			const res = controller.sellProduct("model", 10, null);
			await expect(res).rejects.toBeDefined();

			expect(mock1).toHaveBeenCalledTimes(1);
			expect(mock2).toHaveBeenCalledTimes(0);
		});

		test("Sell more than the available quantity", async () => {
			const controller = new ProductController();
			const prod = new Product(1, "prod", Category.APPLIANCE, "", "", 10);

			const mock1 = new ProdDAO_getProductByModel_MockGenerator().mockAll(prod, null).getMock();
			const mock2 = new ProdDAO_sellProduct_MockGenerator().mockAll(0, new LowProductStockError()).getMock();

			// assuming there is 15 in stock
			const res = controller.sellProduct("model", 10, null);
			await expect(res).rejects.toBeInstanceOf(LowProductStockError);

			expect(mock1).toHaveBeenCalledTimes(1);
			expect(mock2).toHaveBeenCalledTimes(1);
		});

		test("Date is not present", async () => {
			const controller = new ProductController();
			const prod = new Product(1, "prod", Category.APPLIANCE, "", "", 10);

			const mock1 = new ProdDAO_getProductByModel_MockGenerator().mockAll(prod, null).getMock();
			const mock2 = new ProdDAO_sellProduct_MockGenerator().mockAll(5, null).getMock();

			// assuming there is 15 in stock
			const res = controller.sellProduct("model", 10, null);
			await expect(res).resolves.toBe(5);

			expect(mock1).toHaveBeenCalledTimes(1);
			expect(mock2).toHaveBeenCalledTimes(1);
		});

		test("Date is in the future", async () => {
			const controller = new ProductController();
			const prod = new Product(1, "prod", Category.APPLIANCE, "", "", 10);
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

			const mock1 = new ProdDAO_getProductByModel_MockGenerator().mockAll(prod, null).getMock();
			const mock2 = new ProdDAO_sellProduct_MockGenerator().mockAll(15, null).getMock();

			// assuming there is 15 in stock
			const res = controller.sellProduct("model", 10, tomorrow);
			await expect(res).rejects.toBeDefined();

			expect(mock1).toHaveBeenCalledTimes(0);
			expect(mock2).toHaveBeenCalledTimes(0);
		});
	});

	describe("getProducts", () => {
		describe("No filtering", () => {
			test("Get all products (with all null parameters)", async () => {
				const controller = new ProductController();
				const array = new Array(5).fill(0).map(getRandomProduct);
				const mock = new ProdDAO_getProducts_MockGenerator().mockAll(array, null).getMock();

				const res = controller.getProducts(null, null, null);
				await expect(res).resolves.toEqual(array);

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Get all products (with non-null category)", async () => {
				const controller = new ProductController();
				const array = new Array(5).fill(0).map(getRandomProduct);
				const mock = new ProdDAO_getProducts_MockGenerator().mockAll(array, null).getMock();

				const res = controller.getProducts(null, "test", null);
				await expect(res).resolves.toEqual(array);

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Get all products (with non-null model)", async () => {
				const controller = new ProductController();
				const array = new Array(5).fill(0).map(getRandomProduct);
				const mock = new ProdDAO_getProducts_MockGenerator().mockAll(array, null).getMock();

				const res = controller.getProducts(null, null, "test");
				await expect(res).resolves.toEqual(array);

				expect(mock).toHaveBeenCalledTimes(1);
			});
		});

		describe("Filter by category", () => {
			test("Filter by category", async () => {
				const controller = new ProductController();
				const array = new Array(5).fill(0).map(getRandomProduct);
				const mock = new ProdDAO_getProducts_MockGenerator()
					.mockAll(
						array.filter((prod) => prod.category === Category.LAPTOP),
						null
					)
					.getMock();

				const res = controller.getProducts("category", "Laptop", null);
				await expect(res).resolves.toEqual(array.filter((prod) => prod.category === Category.LAPTOP));

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Filter by category (with non-null model)", async () => {
				const controller = new ProductController();
				const array = new Array(5).fill(0).map(getRandomProduct);
				const mock = new ProdDAO_getProducts_MockGenerator()
					.mockAll(
						array.filter((prod) => prod.category === Category.LAPTOP),
						null
					)
					.getMock();

				const res = controller.getProducts("category", "Laptop", "model");
				await expect(res).resolves.toEqual(array.filter((prod) => prod.category === Category.LAPTOP));

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Filter by invalid category", async () => {
				const controller = new ProductController();

				const array = new Array(5).fill(0).map(getRandomProduct);
				const mock = new ProdDAO_getProducts_MockGenerator().mockAll(array, null).getMock();

				const res = controller.getProducts("category", "test", null);
				await expect(res).rejects.toBeDefined();

				expect(mock).toHaveBeenCalledTimes(0);
			});
		});

		describe("Filter by model", () => {
			test("Filter (with results) by model", async () => {
				const controller = new ProductController();
				const array = new Array(5).fill(0).map(getRandomProductObj);
				const mock = new ProdDAO_getProducts_MockGenerator()
					.mockAll([productObjToClass(array[0])], null)
					.getMock();

				const res = controller.getProducts("model", null, array[0].model);
				await expect(res).resolves.toEqual([productObjToClass(array[0])]);

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Filter (without results) by model", async () => {
				const controller = new ProductController();
				const mock = new ProdDAO_getProducts_MockGenerator().mockAll([], null).getMock();

				const res = controller.getProducts("model", null, "model");
				await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Filter by model (with non-null category)", async () => {
				const controller = new ProductController();
				const array = new Array(5).fill(0).map(getRandomProductObj);
				const mock = new ProdDAO_getProducts_MockGenerator()
					.mockAll([productObjToClass(array[0])], null)
					.getMock();

				const res = controller.getProducts("model", "category", array[0].model);
				await expect(res).resolves.toEqual([productObjToClass(array[0])]);

				expect(mock).toHaveBeenCalledTimes(1);
			});
		});

		test("Invalid grouping setting", async () => {
			const controller = new ProductController();
			const array = new Array(5).fill(0).map(getRandomProduct);
			const mock = new ProdDAO_getProducts_MockGenerator().mockAll(array, null).getMock();

			const res = controller.getProducts("test", null, null);
			await expect(res).rejects.toBeDefined();

			expect(mock).toHaveBeenCalledTimes(0);
		});
	});

	describe("getAvailableProducts", () => {
		describe("No filtering", () => {
			test("Get all available products (with all null parameters)", async () => {
				const controller = new ProductController();

				const array = new Array(5)
					.fill(0)
					.map(getRandomProduct)
					.filter((prod) => prod.quantity > 0);

				const mock = new ProdDAO_getAvailableProducts_MockGenerator().mockAll(array, null).getMock();

				const res = controller.getAvailableProducts(null, null, null);
				await expect(res).resolves.toEqual(array);

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Get all available products (with non-null category)", async () => {
				const controller = new ProductController();

				const array = new Array(5)
					.fill(0)
					.map(getRandomProduct)
					.filter((prod) => prod.quantity > 0);

				const mock = new ProdDAO_getAvailableProducts_MockGenerator().mockAll(array, null).getMock();

				const res = controller.getAvailableProducts(null, "test", null);
				await expect(res).resolves.toEqual(array);

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Get all available products (with non-null model)", async () => {
				const controller = new ProductController();

				const array = new Array(5)
					.fill(0)
					.map(getRandomProduct)
					.filter((prod) => prod.quantity > 0);

				const mock = new ProdDAO_getAvailableProducts_MockGenerator().mockAll(array, null).getMock();

				const res = controller.getAvailableProducts(null, null, "test");
				await expect(res).resolves.toEqual(array);

				expect(mock).toHaveBeenCalledTimes(1);
			});
		});

		describe("Filter by category", () => {
			test("Filter by category", async () => {
				const controller = new ProductController();

				const array = new Array(5)
					.fill(0)
					.map(getRandomProduct)
					.filter((prod) => prod.quantity > 0 && prod.category === Category.LAPTOP);

				const mock = new ProdDAO_getAvailableProducts_MockGenerator().mockAll(array, null).getMock();

				const res = controller.getAvailableProducts("category", "Laptop", null);
				await expect(res).resolves.toEqual(array.filter((prod) => prod.category === Category.LAPTOP));

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Filter by category (with non-null model)", async () => {
				const controller = new ProductController();

				const array = new Array(5)
					.fill(0)
					.map(getRandomProduct)
					.filter((prod) => prod.quantity > 0 && prod.category === Category.LAPTOP);

				const mock = new ProdDAO_getAvailableProducts_MockGenerator().mockAll(array, null).getMock();

				const res = controller.getAvailableProducts("category", "Laptop", "model");
				await expect(res).resolves.toEqual(array.filter((prod) => prod.category === Category.LAPTOP));

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Filter by invalid category", async () => {
				const controller = new ProductController();

				const array = new Array(5)
					.fill(0)
					.map(getRandomProduct)
					.filter((prod) => prod.quantity > 0);

				const mock = new ProdDAO_getAvailableProducts_MockGenerator().mockAll(array, null).getMock();

				const res = controller.getAvailableProducts("category", "test", null);
				await expect(res).rejects.toBeDefined();

				expect(mock).toHaveBeenCalledTimes(0);
			});
		});

		describe("Filter by model", () => {
			test("Filter (with results) by model", async () => {
				const controller = new ProductController();

				const array = new Array(5)
					.fill(0)
					.map(getRandomProduct)
					.filter((prod) => prod.quantity > 0);

				const mock = new ProdDAO_getAvailableProducts_MockGenerator().mockAll([array[0]], null).getMock();

				const res = controller.getAvailableProducts("model", null, array[0].model);
				await expect(res).resolves.toEqual([array[0]]);

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Filter (without results) by model", async () => {
				const controller = new ProductController();
				const mock = new ProdDAO_getAvailableProducts_MockGenerator().mockAll([], null).getMock();

				const res = await controller.getAvailableProducts("model", null, "model");
				await expect(res).toEqual([]);

				expect(mock).toHaveBeenCalledTimes(1);
			});

			test("Filter by model (with non-null category)", async () => {
				const controller = new ProductController();

				const array = new Array(5)
					.fill(0)
					.map(getRandomProduct)
					.filter((prod) => prod.quantity > 0);

				const mock = new ProdDAO_getAvailableProducts_MockGenerator().mockAll([array[0]], null).getMock();

				const res = controller.getAvailableProducts("model", "category", array[0].model);
				await expect(res).resolves.toEqual([array[0]]);

				expect(mock).toHaveBeenCalledTimes(1);
			});
		});

		test("Invalid grouping setting", async () => {
			const controller = new ProductController();

			const array = new Array(5)
				.fill(0)
				.map(getRandomProduct)
				.filter((prod) => prod.quantity > 0);

			const mock = new ProdDAO_getAvailableProducts_MockGenerator().mockAll(array, null).getMock();

			const res = controller.getAvailableProducts("test", null, null);
			await expect(res).rejects.toBeDefined();

			expect(mock).toHaveBeenCalledTimes(0);
		});
	});

	describe("deleteAllProducts", () => {
		test("Successfully delete all products", async () => {
			const controller = new ProductController();
			const mock = new ProdDAO_deleteAllProducts_MockGenerator().mockAll(true, null).getMock();

			const res = controller.deleteAllProducts();
			await expect(res).resolves.toBe(true);

			expect(mock).toHaveBeenCalledTimes(1);
		});

		test("Db errors occurred", async () => {
			const controller = new ProductController();
			const mock = new ProdDAO_deleteAllProducts_MockGenerator().mockAll(false, Error()).getMock();

			const res = controller.deleteAllProducts();
			await expect(res).rejects.toBeDefined();

			expect(mock).toHaveBeenCalledTimes(1);
		});
	});

	describe("deleteProduct", () => {
		test("Successfully delete an existing product", async () => {
			const controller = new ProductController();
			const mock = new ProdDAO_deleteProduct_MockGenerator().mockAll(true, null).getMock();

			const res = controller.deleteProduct("test");
			await expect(res).resolves.toBe(true);

			expect(mock).toHaveBeenCalledTimes(1);
		});

		test("Delete a non-existing product", async () => {
			const controller = new ProductController();
			const mock = new ProdDAO_deleteProduct_MockGenerator().mockAll(false, new ProductNotFoundError()).getMock();

			const res = controller.deleteProduct("test");
			await expect(res).rejects.toBeInstanceOf(ProductNotFoundError);

			expect(mock).toHaveBeenCalledTimes(1);
		});
	});
});
