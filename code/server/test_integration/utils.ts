import { app } from "..";
import { Product, Category } from "../src/components/product";
import { ProductReview } from "../src/components/review";
import db from "../src/db/db";
import crypto from "crypto";
import request from "supertest";

export const query_db = (query: string): Promise<any[]> => {
	return new Promise<any[]>((resolve, reject) => {
		db.all(query, [], (err, res) => {
			if (err) reject(err);
			else resolve(res);
		});
	});
};

export const emptyDB = (): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
		db.run("DELETE FROM productreview", (err: any, _: any) => {
			if (err) return reject();
			db.run("DELETE FROM productincart", (err: any, _: any) => {
				if (err) return reject();
				db.run("DELETE FROM cart", (err: any, _: any) => {
					if (err) return reject();
					db.run("DELETE FROM products", (err: any, _: any) => {
						if (err) return reject();
						db.run("DELETE FROM users", (err: any, _: any) => {
							if (err) return reject();
							resolve();
						});
					});
				});
			});
		});
	});
};

export const getDefaultProduct = () => new Product(1, "prod", Category.LAPTOP, yesterday(), null, 10);

export const insertDefaultProduct = async () => {
	return new Promise<void>((resolve, reject) => {
		db.run(
			`INSERT INTO products
			(sellingPrice, model, category, arrivalDate, details, quantity)
			VALUES
			(1, "prod", "Laptop", ?, null, 10)`,
			[yesterday()],
			(err) => (err ? reject(err) : resolve())
		);
	});
};

export const getDefaultProducts = () => [
	new Product(1, "prod", Category.LAPTOP, yesterday(), null, 10),
	new Product(1, "prod_review", Category.LAPTOP, yesterday(), null, 10)
];

export const insertDefaultProducts = async () => {
	return new Promise<void>((resolve, reject) => {
		db.run(
			`INSERT INTO products
			(sellingPrice, model, category, arrivalDate, details, quantity)
			VALUES
			(1, "prod", "Laptop", ?, null, 10),
			(1, "prod_review", "Laptop", ?, null, 10)`,
			[yesterday()],
			(err) => (err ? reject(err) : resolve())
		);
	});
};

export const getDefaultReview = () => new ProductReview("prod", "Customer", 3, yesterday(), "Ok");

export const insertDefaultReview = () => {
	return new Promise<void>((resolve, reject) => {
		db.run(
			`INSERT INTO productreview
			(model, user, score, date, comment)
			VALUES
			("prod", "Customer", 3, ?, "Ok")`,
			[yesterday()],
			(err) => (err ? reject(err) : resolve())
		);
	});
};

export const insertDefaultUsers = async () => {
	return new Promise<void>((resolve, reject) => {
		["Admin", "Manager", "Customer"].forEach(async (type) => {
			const salt = crypto.randomBytes(16);
			const hashedPassword = crypto.scryptSync(type, salt, 16);

			await db.run(
				`INSERT INTO users
				(username, name, surname, role, password, salt, address, birthdate)
				VALUES
				(?, ?, ?, ?, ?, ?, NULL, NULL)`,
				[type, type, type, type, hashedPassword, salt],
				(err) => (err ? reject(err) : resolve())
			);
		});
	});
};

export const loginAs = async (type: "Admin" | "Manager" | "Customer"): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		request(app)
			.post(`/ezelectronics/sessions`)
			.send({
				username: type,
				name: type,
				surname: type,
				password: type,
				role: type
			})
			.expect(200)
			.end((err, res) => {
				if (err) reject(err);
				else resolve(res.header["set-cookie"][0]);
			});
	});
};

export const NdaysAgo = (n: number) => new Date(Date.now() - n * 60 * 60 * 24 * 1000).toISOString().split("T")[0];
export const yesterday = () => new Date(Date.now() - 60 * 60 * 24 * 1000).toISOString().split("T")[0];
export const today = () => new Date().toISOString().split("T")[0];
export const tomorrow = () => new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString().split("T")[0];
