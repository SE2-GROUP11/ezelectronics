import { Product } from "../components/product";
import { Cart } from "../components/cart";
import { User } from "../components/user";
import CartDAO from "../dao/cartDAO";
import { CartNotFoundError, ProductNotInCartError, NegativeQuantityError, EmptyCartError } from "../errors/cartError";
import ProductController from "./productController";
import ProductDAO from "../dao/productDAO";

/**
 * Represents a controller for managing shopping carts.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class CartController {
	private dao: CartDAO;

	constructor() {
		this.dao = new CartDAO();
	}

	/**
	 * Adds a product to the user's cart. If the product is already in the cart, the quantity should be increased by 1.
	 * If the product is not in the cart, it should be added with a quantity of 1.
	 * If there is no current unpaid cart in the database, then a new cart should be created.
	 * @param user - The user to whom the product should be added.
	 * @param model (formerly called productId)  - The model of the product to add.
	 * @returns A Promise that resolves to `true` if the product was successfully added.
	 */
	async addToCart(user: User, model: string): Promise<Boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			let id: number;
			let product: Product;

			try {
				id = await this.getCartId(user);
				product = await new ProductDAO().getProductByModel(model);

				if (product.quantity <= 0) return reject(new NegativeQuantityError());

				await this.dao.getProductInCart(product, id);
				this.dao.increaseProductQuantityInCart(product, id);
			} catch (e) {
				if (e instanceof ProductNotInCartError)
					try {
						this.dao.insertProductInCart(product, id);
					} catch (err) {
						return reject(e);
					}
				else return reject(e);
			}

			resolve(true);
		});
	}

	/**
	 * Retrieves the current cart for a specific user.
	 * @param user - The user for whom to retrieve the cart.
	 * @returns A Promise that resolves to the user's cart (creates an empty one if there is none)
	 */
	async getCart(user: User): Promise<Cart> {
		return new Promise<Cart>(async (resolve, reject) => {
			this.getCartId(user, true)
				.then((id) => this.dao.getCart(id).then(resolve).catch(reject))
				.catch((err) =>
					err instanceof CartNotFoundError ? resolve(new Cart(user.username, false, "", 0, [])) : reject(err)
				);
		});
	}

	/**
	 * Retrieves the id of the current cart for a specific user.
	 * @param user - The user for whom to retrieve the cart.
	 * @returns A Promise that resolves to the user's cart (creates an empty one if there is none)
	 */
	async getCartId(user: User, avoidCreatingNew?: boolean): Promise<number> {
		return new Promise<number>(async (resolve, reject) => {
			this.dao
				.getUserCartId(user.username)
				.then(resolve)
				.catch((getUserCartError) => {
					if (avoidCreatingNew || !(getUserCartError instanceof CartNotFoundError))
						return reject(getUserCartError);
					this.dao
						.createEmptyCart(user.username)
						.then(() => {
							this.dao.getUserCartId(user.username).then(resolve).catch(reject);
						})
						.catch(reject);
				});
		});
	}

	/**
	 * Checks out the user's cart. We assume that payment is always successful, there is no need to implement anything related to payment.
	 * @param user - The user whose cart should be checked out.
	 * @returns A Promise that resolves to `true` if the cart was successfully checked out.
	 */
	async checkoutCart(user: User): Promise<Boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			this.getCartId(user, true)
				.then((cartID) => {
					this.getCart(user).then((cart) => {
						if (cart.products.length === 0) return reject(new EmptyCartError());
						this.dao.checkoutCart(cartID).then(resolve).catch(reject);
					});
				})
				.catch(reject);
		});
	}

	/**
	 * Retrieves all paid carts for a specific customer.
	 * @param user - The customer for whom to retrieve the carts.
	 * @returns A Promise that resolves to an array of carts belonging to the customer.
	 * Only the carts that have been checked out should be returned, the current cart should not be included in the result.
	 */
	async getCustomerCarts(user: User): Promise<Cart[]> {
		return new Promise<Cart[]>((resolve, reject) => {
			this.dao.getUserAllPaidCarts(user.username).then(resolve).catch(reject);
		});
	}

	/**
	 * Removes one product unit from the current cart. In case there is more than one unit in the cart, only one should be removed.
	 * @param user The user who owns the cart.
	 * @param model (formerly called product) The model of the product to remove.
	 * @returns A Promise that resolves to `true` if the product was successfully removed.
	 */
	async removeProductFromCart(user: User, model: string): Promise<Boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			let id: number;
			let product: Product;

			try {
				id = await this.getCartId(user, true);
				product = await new ProductDAO().getProductByModel(model);

				const productInCart = await this.dao.getProductInCart(product, id);
				if (productInCart.quantity <= 1) this.dao.removeProductFromCart(product.model, id);
				else this.dao.decreaseProductQuantityInCart(product.model, id);
			} catch (e) {
				return reject(e);
			}

			resolve(true);
		});
	}

	/**
	 * Removes all products from the current cart.
	 * @param user - The user who owns the cart.
	 * @returns A Promise that resolves to `true` if the cart was successfully cleared.
	 */
	async clearCart(user: User): Promise<Boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			try {
				const id = await this.getCartId(user, true);
				const products = (await this.getCart(user)).products;

				for (const prod of products) this.dao.removeProductFromCart(prod.model, id);
				resolve(true);
			} catch (e) {
				return reject(e);
			}
		});
	}

	/**
	 * Deletes all carts of all users.
	 * @returns A Promise that resolves to `true` if all carts were successfully deleted.
	 */
	async deleteAllCarts(): Promise<Boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			try {
				await this.dao.deleteAllProductsInCarts();
				await this.dao.deleteAllCarts();
				resolve(true);
			} catch (e) {
				reject(e);
			}
		});
	}

	/**
	 * Retrieves all carts in the database.
	 * @returns A Promise that resolves to an array of carts.
	 */
	async getAllCarts(): Promise<Cart[]> {
		return new Promise<Cart[]>((resolve, reject) => {
			this.dao.getAllCarts().then(resolve).catch(reject);
		});
	}
}

export default CartController;
