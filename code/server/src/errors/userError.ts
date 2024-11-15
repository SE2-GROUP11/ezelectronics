const USER_NOT_FOUND = "The user does not exist";
const USER_NOT_MANAGER = "This operation can be performed only by a manager";
const USER_ALREADY_EXISTS = "The username already exists";
const USER_NOT_CUSTOMER = "This operation can be performed only by a customer";
const USER_NOT_ADMIN = "This operation can be performed only by an admin";
const USER_IS_ADMIN = "Admins cannot be deleted";
const UNAUTHORIZED_USER = "You cannot access the information of other users";

/**
 * Represents an error that occurs when a user is not found.
 */
class UserNotFoundError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = USER_NOT_FOUND;
		this.customCode = 404;
	}
}

/**
 * Represents an error that occurs when a user is not a manager.
 */
class UserNotManagerError extends Error {
	customMessage: String;
	customCode: Number;

	constructor() {
		super();
		this.customMessage = USER_NOT_MANAGER;
		this.customCode = 401;
	}
}

/**
 * Represents an error that occurs when a user is not a customer.
 */
class UserNotCustomerError extends Error {
	customMessage: String;
	customCode: Number;

	constructor() {
		super();
		this.customMessage = USER_NOT_CUSTOMER;
		this.customCode = 401;
	}
}

/**
 * Represents an error that occurs when a username is already in use.
 */
class UserAlreadyExistsError extends Error {
	customMessage: String;
	customCode: Number;

	constructor() {
		super();
		this.customMessage = USER_ALREADY_EXISTS;
		this.customCode = 409;
	}
}

class UserNotAdminError extends Error {
	customMessage: String;
	customCode: Number;

	constructor() {
		super();
		this.customMessage = USER_NOT_ADMIN;
		this.customCode = 401;
	}
}

class UserIsAdminError extends Error {
	customMessage: String;
	customCode: Number;

	constructor() {
		super();
		this.customMessage = USER_IS_ADMIN;
		this.customCode = 401;
	}
}

class UnauthorizedUserError extends Error {
	customMessage: String;
	customCode: Number;

	constructor() {
		super();
		this.customMessage = UNAUTHORIZED_USER;
		this.customCode = 401;
	}
}

class CannotDeleteOtherAdminError extends Error {
	customMessage: String;
	customCode: Number;

	constructor() {
		super();
		this.customMessage = "An admin cannot delete another admin";
		this.customCode = 401;
	}
}

class CannotEditOtherAdminError extends Error {
	customMessage: String;
	customCode: Number;

	constructor() {
		super();
		this.customMessage = "An admin cannot edit another admin";
		this.customCode = 401;
	}
}

class FutureBirthdateError extends Error {
	customMessage: String;
	customCode: Number;

	constructor() {
		super();
		this.customMessage = "Birthdate is in the future";
		this.customCode = 400;
	}
}

type UserError =
	| UserNotFoundError
	| UserNotManagerError
	| UserNotCustomerError
	| UserAlreadyExistsError
	| UserNotAdminError
	| UserIsAdminError
	| UnauthorizedUserError
	| CannotDeleteOtherAdminError
	| CannotEditOtherAdminError
	| FutureBirthdateError;

export const isUserError = (err: Error): err is UserError => {
	return (
		err instanceof UserNotFoundError ||
		err instanceof UserNotManagerError ||
		err instanceof UserNotCustomerError ||
		err instanceof UserAlreadyExistsError ||
		err instanceof UserNotAdminError ||
		err instanceof UserIsAdminError ||
		err instanceof UnauthorizedUserError ||
		err instanceof CannotDeleteOtherAdminError ||
		err instanceof CannotEditOtherAdminError ||
		err instanceof FutureBirthdateError
	);
};

export const handleUserError = (res: any, err: Error | null, next: (_: any) => any) => {
	if (isUserError(err)) res.status(err.customCode).json(err.customMessage);
};

export {
	UserNotFoundError,
	UserNotManagerError,
	UserNotCustomerError,
	UserAlreadyExistsError,
	UserNotAdminError,
	UserIsAdminError,
	UnauthorizedUserError,
	CannotDeleteOtherAdminError,
	CannotEditOtherAdminError,
	FutureBirthdateError
};
