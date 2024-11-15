import db from "../db/db";
import { Cart, ProductInCart } from "../components/cart";
import {
	CartNotFoundError,
	EmptyCartError,
	ProductInCartError,
	ProductNotInCartError,
	WrongUserCartError,
	CartAlreadyExistsError
} from "../errors/cartError";
import { Product } from "../components/product";
import ProductController from "../controllers/productController";
import { NegativeQuantityError } from "../errors/cartError";
import ProductDAO from "./productDAO";

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {
	/**
	 *	Given a cart ID, returns the corresponding Cart object
	 * @param id The cart id to retreive
	 * @returns A Promise that either resolves to the cart item, or rejects telling that the user has no active cart
	 */
	getCart(id: number): Promise<Cart> {
		return new Promise<Cart>((resolve, reject) => {
			const query = "SELECT * FROM cart WHERE id = ?";
			db.get(query, [id], (err: Error | null, res: any) => {
				if (err) return reject(err);
				if (!res) return reject(new CartNotFoundError());

				this.getCartProducts(id)
					.then((vec) =>
						resolve(
							new Cart(
								res.customer,
								res.paid,
								res.paymentDate === "" ? null : res.paymentDate,
								res.total,
								vec
							)
						)
					)
					.catch(reject);
			});
		});
	}

	/**
	 *	Retreives id of the cart of a given user
	 * @param username The username of the user whose cart to retreive
	 * @returns A Promise that either resolves to the cart id, or rejects telling that the user has no active cart
	 */
	getUserCartId(username: string): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			const query = "SELECT id FROM cart WHERE customer = ? AND paid = 0";
			db.get(query, [username], (err: Error | null, res: any) => {
				if (err) return reject(err);
				if (!res) return reject(new CartNotFoundError());
				resolve(res.id);
			});
		});
	}

	/**
	 *	Retreives the content of a cart
	 * @param cartID The id cart to retreive
	 * @returns A Promise that resolves to the array of cart products
	 */
	getCartProducts(cartID: number): Promise<ProductInCart[]> {
		return new Promise<ProductInCart[]>((resolve, reject) => {
			const query = "SELECT * FROM productincart WHERE cartId = ?";
			db.all(query, [cartID], (err: Error | null, res: any[]) => {
				if (err) return reject(err);

				let vec: ProductInCart[] = [];

				res?.forEach((row: any) => {
					vec.push(new ProductInCart(row.model, row.quantity, row.category, row.price));
				});

				resolve(vec);
			});
		});
	}

	/**
	 *	Creates an empty cart for a given user
	 * @param username The username of the user whose cart to create
	 * @returns A Promise that resolves to true if the user has been created, or rejects telling that the user already has a cart
	 */
	createEmptyCart(username: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.getUserCartId(username)
				.then(() => reject(CartAlreadyExistsError))
				.catch((getUserCartError) => {
					if (!(getUserCartError instanceof CartNotFoundError)) reject(getUserCartError);
					const query = 'INSERT INTO cart(customer, paid, paymentDate, total) VALUES (?, 0, "", 0)';
					db.run(query, [username], (err: Error | null, res: any) => {
						if (err) return reject(err);
						resolve(true);
					});
				});
		});
	}

	/**
	 *	Retreives a product in the cart
	 * @param product The model of the product
	 * @param cartID The ID of the cart where to search
	 * @returns A Promise that resolves to the item in the cart.
	 */
	getProductInCart(product: Product, cartID: number): Promise<ProductInCart> {
		return new Promise<ProductInCart>((resolve, reject) => {
			const query = "SELECT * FROM productincart WHERE cartId = ? AND model = ?";
			db.get(query, [cartID, product.model], (err: Error | null, res: any) => {
				if (err) return reject(err);
				if (!res) return reject(new ProductNotInCartError());
				resolve(new ProductInCart(res.model, res.quantity, res.category, res.price));
			});
		});
	}

	/**
	 *	Increases the quantity of a product in a given cart
	 * @param product The model of the product
	 * @param cartID The ID of the cart where to search
	 * @returns A Promise that resolves when the quantity is updated.
	 */
	increaseProductQuantityInCart(product: Product, cartID: number): Promise<null> {
		return new Promise<null>((resolve, reject) => {
			const query = "UPDATE productincart SET quantity = quantity + 1 WHERE cartId = ? AND model = ?";
			db.run(query, [cartID, product.model], (err: Error | null, res: any) => {
				if (err) reject(err);
				resolve(null);
			});
		});
	}

	/**
	 *	Inserts a new product inside a given cart
	 * @param product The model of the product
	 * @param cartID The ID of the cart where to search
	 * @returns A Promise that resolves when the product is inserted.
	 */
	insertProductInCart(product: Product, cartID: number): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			const query = "INSERT INTO productincart(cartId, model, quantity, category, price) VALUES (?, ?, ?, ?, ?)";

			db.run(
				query,
				[cartID, product.model, 1, product.category, product.sellingPrice],
				(err: Error | null, res: any) => {
					if (err) reject(err);
					resolve(true);
				}
			);
		});
	}

	/**
	 * 	Marks a cart as paid
	 * @param cardID - the id of the cart to be checked out
	 * @returns A Promise that resolves to `true` if the cart was successfully checked out.
	 */
	checkoutCart(cartID: number): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			try {
				const products = await this.getCartProducts(cartID);
				const prodContr = new ProductController();
				const today = new Date().toISOString().split("T")[0];

				for (const order of products) {
					const product = await new ProductDAO().getProductByModel(order.model);
					if (product.quantity < order.quantity) return reject(new NegativeQuantityError());
				}

				for (const order of products) await prodContr.sellProduct(order.model, order.quantity, today);

				const query = "UPDATE cart SET paid = 1, paymentDate = ? WHERE id = ?";
				db.run(query, [today, cartID], (err: Error | null, res: any) => {
					if (err) return reject(err);
					resolve(true);
				});
			} catch (e) {
				return reject(e);
			}
		});
	}

	/**
	 *	Given a username, returns all the carts that that user has ever paid
	 * @param id The username of the user being considered
	 * @returns A Promise that resolves to the array of paid carts
	 */
	getUserAllPaidCarts(username: string): Promise<Cart[]> {
		return new Promise<Cart[]>((resolve, reject) => {
			const query = "SELECT id FROM cart WHERE customer = ? AND paid = 1";
			let returnVal: Cart[] = [];

			db.all(query, [username], async (err: Error | null, res: any[]) => {
				if (err) return reject(err);

				for (const cart of res)
					try {
						returnVal.push(await this.getCart(cart.id));
					} catch (e) {
						return reject(e);
					}

				resolve(returnVal);
			});
		});
	}

	/**
	 *	Decreases the quantity of a product in a given cart
	 * @param product The model of the product
	 * @param cartID The ID of the cart where to search
	 * @returns A Promise that resolves when the quantity is updated.
	 */
	decreaseProductQuantityInCart(product: string, cartID: number): Promise<null> {
		return new Promise<null>((resolve, reject) => {
			const query = "UPDATE productincart SET quantity = quantity - 1 WHERE cartId = ? AND model = ?";
			db.run(query, [cartID, product], (err: Error | null, res: any) => {
				if (err) reject(err);
				resolve(null);
			});
		});
	}

	/**
	 *	Inserts a new product inside a given cart
	 * @param product The model of the product
	 * @param cartID The ID of the cart where to search
	 * @returns A Promise that resolves when the product is inserted.
	 */
	removeProductFromCart(product: string, cartID: number): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			const query = "DELETE FROM productincart WHERE model = ? AND cartId = ?";

			db.run(query, [product, cartID], (err: Error | null, res: any) => {
				if (err) reject(err);
				resolve(true);
			});
		});
	}

	/**
	 *	Returns all the carts existing in the database (both paid an unpaid)
	 * @returns A Promise that resolves to the array of paid carts
	 */
	getAllCarts(): Promise<Cart[]> {
		return new Promise<Cart[]>((resolve, reject) => {
			const query = "SELECT id FROM cart";
			let returnVal: Cart[] = [];

			db.all(query, [], async (err: Error | null, res: any[]) => {
				if (err) return reject(err);

				for (const cart of res)
					try {
						returnVal.push(await this.getCart(cart.id));
					} catch (e) {
						return reject(e);
					}

				resolve(returnVal);
			});
		});
	}

	/**
	 *	Deletes all the existing carts
	 * @returns A Promise that resolves to true
	 */
	deleteAllCarts(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const query = "DELETE FROM cart;";

			db.run(query, [], async (err: Error | null, res: any) => {
				if (err) return reject(err);
				resolve(true);
			});
		});
	}

	/**
	 *	Deletes all the products existing in any cart
	 * @returns A Promise that resolves to true
	 */
	deleteAllProductsInCarts(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const query = "DELETE FROM productincart";

			db.run(query, [], async (err: Error | null, res: any) => {
				if (err) return reject(err);
				resolve(true);
			});
		});
	}
}

export default CartDAO;
