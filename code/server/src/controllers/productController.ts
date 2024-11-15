import ProductDAO from "../dao/productDAO";
import { Product, Category } from "../components/product";
import {
	ProductAlreadyExistsError,
	ProductSoldError,
	EmptyProductStockError,
	LowProductStockError,
	ProductNotFoundError,
	ArrivalDateIsInTheFutureError,
	ChangeDateIsBeforeArrivaldate
} from "../errors/productError";

/**
 * Represents a controller for managing products.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class ProductController {
	private dao: ProductDAO;

	constructor() {
		this.dao = new ProductDAO();
	}

	/**
	 * Registers a new product concept (model, with quantity defining the number of units available) in the database.
	 * @param model The unique model of the product.
	 * @param category The category of the product.
	 * @param quantity The number of units of the new product.
	 * @param details The optional details of the product.
	 * @param sellingPrice The price at which one unit of the product is sold.
	 * @param arrivalDate The optional date in which the product arrived.
	 * @returns A Promise that resolves to nothing.
	 */
	async registerProducts(
		model: string,
		category: string,
		quantity: number,
		details: string | null,
		sellingPrice: number,
		arrivalDate: string | null
	): Promise<void> {
		// Validate the category
		if (!Object.values(Category).includes(category as Category)) {
			throw new Error("Invalid category");
		}
		// Validate the quantity
		if (quantity <= 0) {
			throw new Error("Quantity cannot be negative or zero");
		}
		// Validate the selling price
		if (sellingPrice <= 0) {
			throw new Error("Selling price cannot be negative or zero");
		}
		// Validate the arrival date
		if (arrivalDate) {
			const today = new Date().toISOString().split("T")[0];
			if (arrivalDate > today) {
				throw new ArrivalDateIsInTheFutureError();
			}
		}
		const product = new Product(sellingPrice, model, category as Category, arrivalDate, details, quantity);
		await this.dao.registerProduct(product);
	}

	/**
	 * Increases the available quantity of a product through the addition of new units.
	 * @param model The model of the product to increase.
	 * @param newQuantity The number of product units to add. This number must be added to the existing quantity, it is not a new total.
	 * @param changeDate The optional date in which the change occurred.
	 * @returns A Promise that resolves to the new available quantity of the product.
	 */
	async changeProductQuantity(model: string, newQuantity: number, changeDate: string | null): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			const today = new Date().toISOString().split("T")[0];
			if (changeDate && changeDate > today) return reject(new ArrivalDateIsInTheFutureError());

			this.dao
				.getProductByModel(model)
				.then((prod) => {
					if (changeDate && prod.arrivalDate > changeDate) return reject(new ChangeDateIsBeforeArrivaldate());

					this.dao.changeProductQuantity(model, newQuantity).then(resolve).catch(reject);
				})
				.catch(reject);
		});
	}

	/**
	 * Decreases the available quantity of a product through the sale of units.
	 * @param model The model of the product to sell
	 * @param quantity The number of product units that were sold.
	 * @param sellingDate The optional date in which the sale occurred.
	 * @returns A Promise that resolves to the new available quantity of the product.
	 */
	async sellProduct(model: string, quantity: number, sellingDate: string | null): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			const today = new Date().toISOString().split("T")[0];
			if (sellingDate && sellingDate > today) return reject(new ArrivalDateIsInTheFutureError());

			this.dao
				.getProductByModel(model)
				.then((prod) => {
					if (sellingDate && prod.arrivalDate > sellingDate)
						return reject(new ChangeDateIsBeforeArrivaldate());

					this.dao.sellProduct(model, quantity).then(resolve).catch(reject);
				})
				.catch(reject);
		});
	}

	/**
	 * Returns all products in the database, with the option to filter them by category or model.
	 * @param grouping An optional parameter. If present, it can be either "category" or "model".
	 * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
	 * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
	 * @returns A Promise that resolves to an array of Product objects.
	 */
	async getProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
		return new Promise<Product[]>((resolve, reject) => {
			if (grouping && grouping !== "category" && grouping !== "model") {
				return reject(new Error("Invalid grouping parameter"));
			}

			if (grouping === "category" && category && !Object.values(Category).includes(category as Category)) {
				return reject(new Error("Invalid category parameter. It must be one of 'Smartphone', 'Laptop', 'Appliance'."));
			}

			if (grouping === "model" && (!model || model.trim() === "")) {
				return reject(new Error("Invalid model parameter. It must be a non-empty string."));
			}

			if (grouping === "category") {
				this.dao.getProducts(grouping, category, null).then(resolve).catch(reject);
			} else if (grouping === "model") {
				this.dao
					.getProducts(grouping, null, model)
					.then((prod) => {
						prod.length === 0 ? reject(new ProductNotFoundError()) : resolve(prod);
					})
					.catch(reject);
			} else {
				return this.dao.getProducts().then(resolve).catch(reject);
			}
		});
	}

	/**
	 * Returns all available products (with a quantity above 0) in the database, with the option to filter them by category or model.
	 * @param grouping An optional parameter. If present, it can be either "category" or "model".
	 * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
	 * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
	 * @returns A Promise that resolves to an array of Product objects.
	 */
	async getAvailableProducts(
		grouping: string | null,
		category: string | null,
		model: string | null
	): Promise<Product[]> {
		return new Promise<Product[]>((resolve, reject) => {
			if (grouping && grouping !== "category" && grouping !== "model") {
				return reject(new Error("Invalid grouping parameter"));
			}

			if (grouping === "category" && category && !Object.values(Category).includes(category as Category)) {
				return reject(new Error("Invalid category parameter. It must be one of 'Smartphone', 'Laptop', 'Appliance'."));
			}

			if (grouping === "model" && (!model || model.trim() === "")) {
				return reject(new Error("Invalid model parameter. It must be a non-empty string."));
			}

			this.dao.getAvailableProducts(grouping, category, model)
				.then(resolve)
				.catch(reject);
		});
	}

	/**
	 * Deletes all products.
	 * @returns A Promise that resolves to `true` if all products have been successfully deleted.
	 */
	async deleteAllProducts(): Promise<boolean> {
		try {
			await this.dao.deleteAllProducts();
			return true;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 * Deletes one product, identified by its model
	 * @param model The model of the product to delete
	 * @returns A Promise that resolves to `true` if the product has been successfully deleted.
	 */
	async deleteProduct(model: string): Promise<boolean> {
		try {
			await this.dao.deleteProduct(model);
			return true;
		} catch (error) {
			//throw new Error("An unexpected error occurred while deleting the product");
			throw error;
		}
	}
}

export default ProductController;
