/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */

import db from "../db/db";
import {
    ProductAlreadyExistsError,
    ProductSoldError,
    EmptyProductStockError,
    LowProductStockError,
	ProductNotFoundError,
	InvalidQuantityError
} from "../errors/productError";
import { Product, Category } from "../components/product";

class ProductDAO {

    /**
     * Registers a new product in the database.
     * @param product The product to register
     * @returns A Promise that resolves on successful registration or rejects with an error
     */
    async registerProduct(product: Product): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            db.get("SELECT model FROM products WHERE model = ?", [product.model], (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res) {
                    return reject(new ProductAlreadyExistsError());
                }
                db.run("INSERT INTO products (sellingPrice, model, category, arrivalDate, details, quantity) VALUES (?, ?, ?, ?, ?, ?)",
                    [product.sellingPrice, product.model, product.category, product.arrivalDate, product.details, product.quantity],
                    (error) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve();
                    }
                );
            });
        });
    }

    /**
     * Changes the quantity of an existing product.
     * @param model The model of the product
     * @param quantity The new quantity
     * @returns A Promise that resolves on successful update or rejects with an error
     */
    async changeProductQuantity(model: string, quantity: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            db.get("SELECT quantity FROM products WHERE model = ?", [model], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return reject(new ProductNotFoundError());
                }
                
                // Assert that row has a quantity property of type number
                const currentQuantity = (row as { quantity: number }).quantity;
                
                if (quantity < 0 || currentQuantity + quantity < 0) {
                    return reject(new InvalidQuantityError());
                }
                
                const newQuantity = currentQuantity + quantity;
                
                db.run("UPDATE products SET quantity = ? WHERE model = ?", [newQuantity, model], (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(newQuantity);
                });
            });
        });
    }

    /**
     * Sells a specified quantity of a product.
     * @param model The model of the product
     * @param quantity The quantity to sell
     * @returns A Promise that resolves on successful sale or rejects with an error
     */
    async sellProduct(model: string, quantity: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            if (quantity <= 0) {
                return reject(new InvalidQuantityError);
            }

            db.get("SELECT quantity FROM products WHERE model = ?", [model], async (err, res: any) => {
                if (err) {
                    return reject(err);
                }

                if (!res) {
                    //return reject(new Error("Product not found"));
                    return reject(new ProductNotFoundError());
                }

                if (res.quantity < quantity) {
                    return reject(new LowProductStockError());
                }

                await db.run("UPDATE products SET quantity = quantity - ? WHERE model = ?", [quantity, model],
                    (error) => error ? reject(error) : resolve(res.quantity - quantity));
            });
        });
    }

    /**
     * Retrieves all products from the database.
     * @returns A Promise that resolves to an array of Products or rejects with an error
     */
    async getProducts(grouping?: string, category?: string, model?: string): Promise<Product[]> {
        let query = "SELECT * FROM products";
        let params: any[] = [];

        if (grouping === 'category' && category) {
            query += ` WHERE category = ?`;
            params.push(category);
        } else if (grouping === 'model' && model) {
            query += ` WHERE model = ?`;
            params.push(model);
        }

        return new Promise<Product[]>((resolve, reject) => {
            db.all(query, params, (err, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    const products = rows.map(row => new Product(
                        row.sellingPrice,
                        row.model,
                        row.category as Category,
                        row.arrivalDate,
                        row.details,
                        row.quantity
                    ));
                    resolve(products);
                }
            });
        });
    }
    
    /**
     * Retrieves all available products (quantity > 0) from the database.
     * @returns A Promise that resolves to an array of Products or rejects with an error
     */
    async getAvailableProducts(grouping?: string, category?: string, model?: string): Promise<Product[]> {
        let query = "SELECT * FROM products WHERE quantity > 0";
		let params: string[] = [];

        if (grouping === 'category' && category) {
            query += ` AND category = ?`;
			params.push(category);
        } else if (grouping === 'model' && model) {
            const checkModelExists = `SELECT * FROM products WHERE model = ?`;
            const modelExistence = await new Promise<boolean>((resolve, reject) => {
                db.all(checkModelExists, [model], (err, result: Product[]) => {
                    if (err) {
                        reject(err);
                    } else if (result.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });

            if (!modelExistence) {
                throw new ProductNotFoundError();
            }

            query += ` AND model = ?`;
			params.push(model)
        }

        return new Promise<Product[]>((resolve, reject) => {
            db.all(query, params, (err, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    const products = rows.map(row => new Product(
                        row.sellingPrice,
                        row.model,
                        row.category as Category,
                        row.arrivalDate,
                        row.details,
                        row.quantity
                    ));
                    resolve(products);
                }
            });
        });
    }

    /**
     * Deletes all products from the database.
     * @returns A Promise that resolves on successful deletion or rejects with an error
     */
    async deleteAllProducts(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            db.run("DELETE FROM products", [], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Deletes a product by model from the database.
     * @param model The model of the product to delete
     * @returns A Promise that resolves on successful deletion or rejects with an error
     */
    async deleteProduct(model: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // Check if the product exists before attempting to delete
            db.get("SELECT * FROM products WHERE model = ?", [model], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!row) {
                    //reject(new Error(`Product with model ${model} not found`));
                    reject(new ProductNotFoundError());
                    return;
                }

                // Proceed to delete the product if it exists
                db.run("DELETE FROM products WHERE model = ?", [model], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    async getProductByModel(model: string): Promise<Product> {
        let query = "SELECT * FROM products WHERE model = ?";
        return new Promise<Product>((resolve, reject) => {
            db.get(query, [model], (err, row: any) => {
                if (err) return reject(err);
				if (!row ) return reject(new ProductNotFoundError());
                resolve(new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity));
            });
        });
    }

}

export default ProductDAO;
