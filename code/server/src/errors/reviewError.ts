const EXISTING_REVIEW = "You have already reviewed this product";
const NO_REVIEW = "You have not reviewed this product";

class ExistingReviewError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = EXISTING_REVIEW;
		this.customCode = 409;
	}
}

class NoReviewProductError extends Error {
	customMessage: string;
	customCode: number;

	constructor() {
		super();
		this.customMessage = NO_REVIEW;
		this.customCode = 404;
	}
}

type ReviewError = ExistingReviewError | NoReviewProductError;

export const isReviewError = (err: Error): err is ReviewError => {
	return err instanceof ExistingReviewError || err instanceof NoReviewProductError;
};

export const handleReviewError = (res: any, err: Error | null, next: (_: any) => any) => {
	if (isReviewError(err)) res.status(err.customCode).json(err.customMessage);
};

export { ExistingReviewError, NoReviewProductError };
