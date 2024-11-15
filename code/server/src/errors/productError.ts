const PRODUCT_NOT_FOUND = "Product not found";
const PRODUCT_ALREADY_EXISTS = "The product already exists";
const PRODUCT_SOLD = "Product already sold";
const EMPTY_PRODUCT_STOCK = "Product stock is empty";
const LOW_PRODUCT_STOCK = "Product stock cannot satisfy the requested quantity";

/**
 * Represents an error that occurs when a product is not found.
 */
class ProductNotFoundError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = PRODUCT_NOT_FOUND;
		this.customCode = 404;
	}
}

/**
 * Represents an error that occurs when a product id already exists.
 */
class ProductAlreadyExistsError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = PRODUCT_ALREADY_EXISTS;
		this.customCode = 409;
	}
}

/**
 * Represents an error that occurs when a product is already sold.
 */
class ProductSoldError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = PRODUCT_SOLD;
		this.customCode = 409;
	}
}

class EmptyProductStockError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = EMPTY_PRODUCT_STOCK;
		this.customCode = 409;
	}
}

class LowProductStockError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = LOW_PRODUCT_STOCK;
		this.customCode = 409;
	}
}

class InvalidQuantityError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = "Quantity cannot be negative";
		this.customCode = 400;
	}
}

class ArrivalDateIsInTheFutureError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = "Arrival date cannot be after the current date";
		this.customCode = 400;
	}
}

class ChangeDateIsBeforeArrivaldate extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = "Change date cannot be before the arrival date";
		this.customCode = 400;
	}
}

type ProductError =
	| ProductNotFoundError
	| ProductAlreadyExistsError
	| ProductSoldError
	| EmptyProductStockError
	| LowProductStockError
	| InvalidQuantityError
	| ArrivalDateIsInTheFutureError
	| ChangeDateIsBeforeArrivaldate;

export const isProductError = (err: Error): err is ProductError => {
	return (
		err instanceof ProductNotFoundError ||
		err instanceof ProductAlreadyExistsError ||
		err instanceof ProductSoldError ||
		err instanceof EmptyProductStockError ||
		err instanceof LowProductStockError ||
		err instanceof InvalidQuantityError ||
		err instanceof ArrivalDateIsInTheFutureError ||
		err instanceof ChangeDateIsBeforeArrivaldate
	);
};

export const handleProductError = (res: any, err: Error | null, next: (_: any) => any) => {
	if (isProductError(err)) res.status(err.customCode).json(err.customMessage);
};

export {
	ProductNotFoundError,
	ProductAlreadyExistsError,
	ProductSoldError,
	EmptyProductStockError,
	LowProductStockError,
	InvalidQuantityError,
	ArrivalDateIsInTheFutureError,
	ChangeDateIsBeforeArrivaldate
};
