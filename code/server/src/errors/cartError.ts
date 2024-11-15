const CART_NOT_FOUND = "Cart not found";
const PRODUCT_IN_CART = "Product already in cart";
const PRODUCT_NOT_IN_CART = "Product not in cart";
const WRONG_USER_CART = "Cart belongs to another user";
const EMPTY_CART = "Cart is empty";
const CART_EXIST = "The user already has a cart";
const NEGATIVE_QUANTITY = "There is not enough availability for a product";

/**
 * Represents an error that occurs when a cart is not found.
 */
class CartNotFoundError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = CART_NOT_FOUND;
		this.customCode = 404;
	}
}

/**
 * Represents an error that occurs when a product is already in a cart.
 */
class ProductInCartError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = PRODUCT_IN_CART;
		this.customCode = 409;
	}
}

/**
 * Represents an error that occurs when a product is not in a cart.
 */
class ProductNotInCartError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = PRODUCT_NOT_IN_CART;
		this.customCode = 404;
	}
}

/**
 * Represents an error that occurs when a cart belongs to another user.
 */
class WrongUserCartError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = WRONG_USER_CART;
		this.customCode = 403;
	}
}

class EmptyCartError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = EMPTY_CART;
		this.customCode = 400;
	}
}

class CartAlreadyExistsError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = CART_EXIST;
		this.customCode = 400;
	}
}

class NegativeQuantityError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = NEGATIVE_QUANTITY;
		this.customCode = 409;
	}
}

type CartError =
	| CartNotFoundError
	| ProductInCartError
	| ProductNotInCartError
	| WrongUserCartError
	| EmptyCartError
	| CartAlreadyExistsError
	| NegativeQuantityError;

export const isCartError = (err: Error): err is CartError => {
	return (
		err instanceof CartNotFoundError ||
		err instanceof ProductInCartError ||
		err instanceof ProductNotInCartError ||
		err instanceof WrongUserCartError ||
		err instanceof EmptyCartError ||
		err instanceof CartAlreadyExistsError ||
		err instanceof NegativeQuantityError
	);
};

export const handleCartError = (res: any, err: Error | null, next: (_: any) => any) => {
	if (isCartError(err)) res.status(err.customCode).json(err.customMessage);
};

export {
	CartNotFoundError,
	ProductInCartError,
	ProductNotInCartError,
	WrongUserCartError,
	EmptyCartError,
	CartAlreadyExistsError,
	NegativeQuantityError
};
