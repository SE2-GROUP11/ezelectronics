import { jest } from "@jest/globals";
import { Database } from "sqlite3";
import ProductDAO from "../../src/dao/productDAO";
import { Product } from "../../src/components/product";
import ProductController from "../../src/controllers/productController";
import Authenticator from "../../src/routers/auth";
import ErrorHandler from "../../src/helper";

// #region general mock

class mockGenerator<implType extends (...p: any[]) => any> {
	mockItem;
	impl: implType;

	constructor(object: any, funcName: string, impl: implType) {
		this.impl = impl;
		this.mockItem = jest.spyOn(object, funcName);
	}

	mockAll(...params: Parameters<implType>) {
		this.mockItem.mockImplementation(this.impl(...params));
		return this;
	}

	mockSequence(paramsArray: Parameters<implType>[]) {
		paramsArray.forEach((params) => this.mockItem.mockImplementationOnce(this.impl(...params)));
		return this;
	}

	getMock() {
		return this.mockItem;
	}
}

// #region database mocks

export class DBmockGenerator extends mockGenerator<(mockErr: Error | null, mockRes: any) => Function> {
	constructor(object: any, funcName: string) {
		super(
			object,
			funcName,
			(mockErr, mockRes) =>
				(query: string, params: any[], callback: (err: Error | null, res: any) => void): Database => {
					callback(mockErr, mockRes);
					return {} as Database;
				}
		);
	}
}

// #region ProductDAO mocks

export class ProdDAO_registerProduct_MockGenerator extends mockGenerator<
	(ok: boolean, rej: Error | null) => (product: Product) => Promise<void>
> {
	constructor() {
		super(
			ProductDAO.prototype,
			"registerProduct",
			(ok: boolean, rej: Error | null) => (product: Product) =>
				new Promise<void>((resolve, reject) => {
					if (ok) resolve();
					else reject(rej);
				})
		);
	}
}

export class ProdDAO_sellProduct_MockGenerator extends mockGenerator<
	(ok: number, rej: Error | null) => (model: string, quantity: number) => Promise<number>
> {
	constructor() {
		super(
			ProductDAO.prototype,
			"sellProduct",
			(ok: number, rej: Error | null) => (model: string, quantity: number) =>
				new Promise<number>((resolve, reject) => {
					if (rej === null) resolve(ok);
					else reject(rej);
				})
		);
	}
}

export class ProdDAO_getProducts_MockGenerator extends mockGenerator<
	(ok: Product[] | null, rej: Error | null) => () => Promise<Product[]>
> {
	constructor() {
		super(
			ProductDAO.prototype,
			"getProducts",
			(ok: Product[] | null, rej: Error | null) => () =>
				new Promise<Product[]>((resolve, reject) => {
					if (ok) resolve(ok);
					else reject(rej);
				})
		);
	}
}

export class ProdDAO_getAvailableProducts_MockGenerator extends mockGenerator<
	(ok: Product[] | null, rej: Error | null) => () => Promise<Product[]>
> {
	constructor() {
		super(
			ProductDAO.prototype,
			"getAvailableProducts",
			(ok: Product[] | null, rej: Error | null) => () =>
				new Promise<Product[]>((resolve, reject) => {
					if (ok) resolve(ok);
					else reject(rej);
				})
		);
	}
}

export class ProdDAO_deleteAllProducts_MockGenerator extends mockGenerator<
	(ok: boolean, rej: Error | null) => () => Promise<void>
> {
	constructor() {
		super(
			ProductDAO.prototype,
			"deleteAllProducts",
			(ok: boolean, rej: Error | null) => () =>
				new Promise<void>((resolve, reject) => {
					if (ok) resolve();
					else reject(rej);
				})
		);
	}
}

export class ProdDAO_deleteProduct_MockGenerator extends mockGenerator<
	(ok: boolean, rej: Error | null) => (model: string) => Promise<void>
> {
	constructor() {
		super(
			ProductDAO.prototype,
			"deleteProduct",
			(ok: boolean, rej: Error | null) => (model: string) =>
				new Promise<void>((resolve, reject) => {
					if (ok) resolve();
					else reject(rej);
				})
		);
	}
}

export class ProdDAO_changeProductQuantity_MockGenerator extends mockGenerator<
	(ok: number, rej: Error | null) => (model: string, quantity: number) => Promise<number>
> {
	constructor() {
		super(
			ProductDAO.prototype,
			"changeProductQuantity",
			(ok: number, rej: Error | null) => (model: string, quantity: number) =>
				new Promise<number>((resolve, reject) => {
					if (rej === null) resolve(ok);
					else reject(rej);
				})
		);
	}
}

export class ProdDAO_getProductByModel_MockGenerator extends mockGenerator<
	(ok: Product | null, rej: Error | null) => (model: string) => Promise<Product>
> {
	constructor() {
		super(
			ProductDAO.prototype,
			"getProductByModel",
			(ok: Product | null, rej: Error | null) => (model: string) =>
				new Promise<Product>((resolve, reject) => {
					if (ok) resolve(ok);
					else reject(rej);
				})
		);
	}
}

// #region productController mocks

export class ProdContr_registerProducts_MockGenerator extends mockGenerator<
	(
		rej: Error | null
	) => (
		model: string,
		category: string,
		quantity: number,
		details: string | null,
		sellingPrice: number,
		arrivalDate: string | null
	) => Promise<void>
> {
	constructor() {
		super(
			ProductController.prototype,
			"registerProducts",
			(rej: Error | null) =>
				(
					model: string,
					category: string,
					quantity: number,
					details: string | null,
					sellingPrice: number,
					arrivalDate: string | null
				) =>
					new Promise<void>((resolve, reject) => {
						if (!rej) resolve();
						else reject(rej);
					})
		);
	}
}

export class ProdContr_changeProductQuantity_MockGenerator extends mockGenerator<
	(
		ok: number | null,
		rej: Error | null
	) => (model: string, quantity: number, changeDate: string | null) => Promise<number>
> {
	constructor() {
		super(
			ProductController.prototype,
			"changeProductQuantity",
			(ok: number | null, rej: Error | null) => (model: string, quantity: number, changeDate: string | null) =>
				new Promise<number>((resolve, reject) => {
					if (ok) resolve(ok);
					else reject(rej);
				})
		);
	}
}

export class ProdContr_sellProduct_MockGenerator extends mockGenerator<
	(
		ok: number | null,
		rej: Error | null
	) => (model: string, quantity: number, sellingDate: string | null) => Promise<number>
> {
	constructor() {
		super(
			ProductController.prototype,
			"sellProduct",
			(ok: number | null, rej: Error | null) => (model: string, quantity: number, sellingDate: string | null) =>
				new Promise<number>((resolve, reject) => {
					if (ok) resolve(ok);
					else reject(rej);
				})
		);
	}
}

export class ProdContr_getProducts_MockGenerator extends mockGenerator<
	(
		ok: Product[] | null,
		rej: Error | null
	) => (grouping: string | null, category: string | null, model: string | null) => Promise<Product[]>
> {
	constructor() {
		super(
			ProductController.prototype,
			"getProducts",
			(ok: Product[] | null, rej: Error | null) =>
				(grouping: string | null, category: string | null, model: string | null) =>
					new Promise<Product[]>((resolve, reject) => {
						if (ok) resolve(ok);
						else reject(rej);
					})
		);
	}
}

export class ProdContr_getAvailableProducts_MockGenerator extends mockGenerator<
	(
		ok: Product[] | null,
		rej: Error | null
	) => (grouping: string | null, category: string | null, model: string | null) => Promise<Product[]>
> {
	constructor() {
		super(
			ProductController.prototype,
			"getAvailableProducts",
			(ok: Product[] | null, rej: Error | null) =>
				(grouping: string | null, category: string | null, model: string | null) =>
					new Promise<Product[]>((resolve, reject) => {
						if (ok) resolve(ok);
						else reject(rej);
					})
		);
	}
}

export class ProdContr_deleteAllProducts_MockGenerator extends mockGenerator<
	(ok: boolean, rej: Error | null) => () => Promise<boolean>
> {
	constructor() {
		super(
			ProductController.prototype,
			"deleteAllProducts",
			(ok: boolean, rej: Error | null) => () =>
				new Promise<boolean>((resolve, reject) => {
					if (ok) resolve(ok);
					else reject(rej);
				})
		);
	}
}

export class ProdContr_deleteProduct_MockGenerator extends mockGenerator<
	(ok: boolean, rej: Error | null) => (model: string) => Promise<boolean>
> {
	constructor() {
		super(
			ProductController.prototype,
			"deleteProduct",
			(ok: boolean, rej: Error | null) => (model: string) =>
				new Promise<boolean>((resolve, reject) => {
					if (ok) resolve(ok);
					else reject(rej);
				})
		);
	}
}

// #region Middleware mocks

type authFuncts = "isAdmin" | "isAdminOrManager" | "isCustomer" | "isLoggedIn" | "isManager";

export class Middleware_authentication_mockGenerator extends mockGenerator<(mockErr: "ok" | "err") => Function> {
	constructor(funcName: authFuncts) {
		super(Authenticator.prototype, funcName, (mockErr) => (req: any, res: any, next: () => void) => {
			if (mockErr === "err") res.status(401).json({ error: "Unauthenticated user", status: 401 });
			else return next();
		});
	}
}

export class Middleware_validateRequest_mockGenerator extends mockGenerator<(mockErr: Error | null) => Function> {
	constructor() {
		super(ErrorHandler.prototype, "validateRequest", (mockErr) => (req: any, res: any, next: () => void) => {
			if (mockErr) res.status(422).json({ error: mockErr.message, status: 422 });
			else return next();
		});
	}
}
