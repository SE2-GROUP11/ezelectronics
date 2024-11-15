import { describe, test, expect, beforeAll, afterAll, afterEach } from "@jest/globals";
import request from "supertest";
import { app } from "../index";
import db from "../src/db/db";
import { emptyDB } from "./utils";

const routePath = "/ezelectronics";

const customer = {
	username: "customer",
	name: "customer",
	surname: "customer",
	password: "customer",
	role: "Customer"
};
const customer2 = {
	username: "customer2",
	name: "customer2",
	surname: "customer2",
	password: "customer2",
	role: "Customer"
};
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" };
const product = {
	model: "mac m2",
	category: "Laptop",
	quantity: 2,
	details: "details",
	sellingPrice: 10,
	arrivalDate: "2024-01-01"
};
const productWithOneQuantity = {
	model: "mac m2",
	category: "Laptop",
	quantity: 1,
	details: "details",
	sellingPrice: 10,
	arrivalDate: "2024-01-01"
};

let customerCookie: string;
let customerCookie2: string;
let adminCookie: string;

const postUser = async (userInfo: any) => {
	await request(app).post(`${routePath}/users`).send(userInfo).expect(200);
};

const postProduct = async (product: any) => {
	await request(app).post(`${routePath}/products`).set("Cookie", adminCookie).send(product).expect(200);
};

const login = async (userInfo: any) => {
	return new Promise<string>((resolve, reject) => {
		request(app)
			.post(`${routePath}/sessions`)
			.send(userInfo)
			.expect(200)
			.end((err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res.header["set-cookie"][0]);
			});
	});
};

const addToCart = async (customerCookie: string, model: string) => {
	return request(app).post(`${routePath}/carts/`).set("Cookie", customerCookie).send({ model: model });
};

const getCart = async (customerCookie: string) => {
	return request(app).get(`${routePath}/carts/`).set("Cookie", customerCookie);
};

const getCartsHistory = async (customerCookie: string) => {
	return request(app).get(`${routePath}/carts/history`).set("Cookie", customerCookie);
};

const getAllCarts = async (adminCookie: string) => {
	return request(app).get(`${routePath}/carts/all`).set("Cookie", adminCookie);
};

const checkoutCart = async (customerCookie: string) => {
	return request(app).patch(`${routePath}/carts/`).set("Cookie", customerCookie);
};

const deleteFromCart = async (customerCookie: string, model: string) => {
	return request(app)
		.delete(`${routePath}/carts/products/` + model)
		.set("Cookie", customerCookie);
};

const deleteAllFromCart = async (customerCookie: string) => {
	return request(app).delete(`${routePath}/carts/current/`).set("Cookie", customerCookie);
};

afterEach(emptyDB);
beforeAll(emptyDB);

describe("POST /carts", () => {
	test("Should return status code 200", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(product);
		await postUser(customer);
		customerCookie = await login(customer);

		const response = await addToCart(customerCookie, product.model);
		expect(response.status).toBe(200);

		const userCart = await getCart(customerCookie);
		expect(userCart.status).toBe(200);
		expect(userCart.body.customer).toEqual(customer.username);
		expect(userCart.body.total).toEqual(product.sellingPrice);
		expect(userCart.body.products).toHaveLength(1);
		let responseProduct = userCart.body.products.find((p: any) => p.model === product.model);
		expect(responseProduct).toBeDefined();
		expect(responseProduct.quantity).toBe(1);
	});
	test("Should return status code 409 when product stock is zero", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(productWithOneQuantity);
		await postUser(customer);
		customerCookie = await login(customer);

		await addToCart(customerCookie, product.model);
		await checkoutCart(customerCookie);

		const response = await addToCart(customerCookie, product.model);
		expect(response.status).toBe(409);
	});
});

describe("PATCH /carts", () => {
	test("Should return status code 200 when adding one item", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(product);
		await postUser(customer);
		customerCookie = await login(customer);
		await addToCart(customerCookie, product.model);

		await checkoutCart(customerCookie);
		const userCartsHistory = await getCartsHistory(customerCookie);
		expect(userCartsHistory.status).toBe(200);
		let userCart = userCartsHistory.body.find((c: any) => c.customer === customer.username);
		expect(userCart.paid).toBe(1);
		expect(userCart.total).toBe(product.sellingPrice);
		expect(userCart.products).toHaveLength(1);
		let responseProduct = userCart.products.find((p: any) => p.model === product.model);
		expect(responseProduct).toBeDefined();
		expect(responseProduct.quantity).toBe(1);
	});
	test("Should return status code 200 when adding two items", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(product);
		await postUser(customer);
		customerCookie = await login(customer);
		await addToCart(customerCookie, product.model);
		await addToCart(customerCookie, product.model);

		const checkoutResponse = await checkoutCart(customerCookie);
		expect(checkoutResponse.status).toBe(200);
		const userCartsHistory = await getCartsHistory(customerCookie);
		expect(userCartsHistory.status).toBe(200);
		let userCart = userCartsHistory.body.find((c: any) => c.customer === customer.username);
		expect(userCart.paid).toBe(1);
		expect(userCart.total).toBe(2 * product.sellingPrice);
		expect(userCart.products).toHaveLength(1);
		let responseProduct = userCart.products.find((p: any) => p.model === product.model);
		expect(responseProduct).toBeDefined();
		expect(responseProduct.quantity).toBe(2);
	});
	test("Should return status code 404 when there is no cart to be paid", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(product);
		await postUser(customer);
		customerCookie = await login(customer);

		const checkoutResponse = await checkoutCart(customerCookie);
		expect(checkoutResponse.status).toBe(404);
	});
	test("Should return status code 409 when there is one product in the cart which its quantity is higher than the available quantity", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(product);
		await postUser(customer);
		customerCookie = await login(customer);
		await addToCart(customerCookie, product.model);
		await addToCart(customerCookie, product.model);
		await addToCart(customerCookie, product.model);

		const checkoutResponse = await checkoutCart(customerCookie);
		expect(checkoutResponse.status).toBe(409);
	});
});

describe("DELETE /carts/products/:model", () => {
	test("Should return status code 200", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(product);
		await postUser(customer);
		customerCookie = await login(customer);
		await addToCart(customerCookie, product.model);
		await addToCart(customerCookie, product.model);

		const response = await deleteFromCart(customerCookie, product.model);
		expect(response.status).toBe(200);
		const userCart = await getCart(customerCookie);
		expect(userCart.status).toBe(200);
		expect(userCart.body.customer).toEqual(customer.username);
		expect(userCart.body.total).toEqual(product.sellingPrice);
		expect(userCart.body.products).toHaveLength(1);
		let responseProduct = userCart.body.products.find((p: any) => p.model === product.model);
		expect(responseProduct).toBeDefined();
		expect(responseProduct.quantity).toBe(1);
	});
	test("Should return status code 404 when there is no product in the cart", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(product);
		await postUser(customer);
		customerCookie = await login(customer);

		const response = await deleteFromCart(customerCookie, product.model);
		expect(response.status).toBe(404);
	});
	test("Should return status code 404 when product model not found", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(product);
		await postUser(customer);
		customerCookie = await login(customer);

		const response = await deleteFromCart(customerCookie, "random");
		expect(response.status).toBe(404);
	});
});

describe("DELETE /carts/current", () => {
	test("Should return status code 200", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(product);
		await postUser(customer);
		customerCookie = await login(customer);
		await addToCart(customerCookie, product.model);
		await addToCart(customerCookie, product.model);

		const response = await deleteAllFromCart(customerCookie);
		expect(response.status).toBe(200);
	});
});

describe("GET /carts/all", () => {
	test("Should return status code 200", async () => {
		await postUser(admin);
		adminCookie = await login(admin);
		await postProduct(product);
		await postUser(customer);
		customerCookie = await login(customer);
		await addToCart(customerCookie, product.model);
		await postUser(customer2);
		customerCookie2 = await login(customer2);
		await addToCart(customerCookie2, product.model);

		const response = await getAllCarts(adminCookie);
		expect(response.status).toBe(200);
		expect(response.body).toHaveLength(2);

		let customerCart = response.body.find((c: any) => c.customer === customer.username);
		expect(customerCart.paid).toBe(0);
		expect(customerCart.total).toBe(product.sellingPrice);
		expect(customerCart.products).toHaveLength(1);
		let responseProduct = customerCart.products.find((p: any) => p.model === product.model);
		expect(responseProduct).toBeDefined();
		expect(responseProduct.quantity).toBe(1);

		let customer2Cart = response.body.find((c: any) => c.customer === customer2.username);
		expect(customer2Cart.paid).toBe(0);
		expect(customer2Cart.total).toBe(product.sellingPrice);
		expect(customer2Cart.products).toHaveLength(1);
	});
});
