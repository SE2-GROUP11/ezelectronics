import { handleCartError, isCartError } from "./cartError";
import { isProductError, handleProductError } from "./productError";
import { isReviewError, handleReviewError } from "./reviewError";
import { isUserError, handleUserError } from "./userError";

const handleError = (res: any, err: Error | null, next: (_: any) => any) => {
	if (isCartError(err)) handleCartError(res, err, next);
	else if (isUserError(err)) handleUserError(res, err, next);
	else if (isReviewError(err)) handleReviewError(res, err, next);
	else if (isProductError(err)) handleProductError(res, err, next);
	else res.status(503).json(err.message);
};

export default handleError;
