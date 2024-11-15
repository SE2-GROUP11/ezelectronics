import {User} from "../components/user";
import ReviewDAO from "../dao/reviewDAO";
import {ProductReview} from "../components/review"
import {NoReviewProductError, ExistingReviewError} from "../errors/reviewError";
import {Role} from "../components/user";
import ProductDAO from "../dao/productDAO";

class ReviewController {
    private dao: ReviewDAO
    private productDAO: ProductDAO

    constructor() {
        this.dao = new ReviewDAO
        this.productDAO = new ProductDAO()
    }

    /**
     * Adds a new review for a product
     * @param model The model of the product to review
     * @param user The username of the user who made the review
     * @param score The score assigned to the product, in the range [1, 5]
     * @param comment The comment made by the user
     * @returns A Promise that resolves to nothing
     */
    async addReview(model: string, user: User, score: number, comment: string) :Promise<void>  {
        try {
			if(score < 1 || score > 5) return Promise.reject(new Error("Invalid score"));
			
            await this.productDAO.getProductByModel(model)
            if (await this.dao.userHasReview(model, user.username)){
                return Promise.reject(new ExistingReviewError());
            }
            const productReview = new ProductReview(model, user.username, score, '', comment)
            productReview.setReviewDate();
            await this.dao.addReview(productReview);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Returns all reviews for a product
     * @param model The model of the product to get reviews from
     * @returns A Promise that resolves to an array of ProductReview objects
     */
    async getProductReviews(model: string) /**:Promise<ProductReview[]> */ {
        try {
            await this.productDAO.getProductByModel(model)
            const reviews = await this.dao.getReviews(model);
            return Promise.resolve(reviews);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Deletes the review made by a user for a product
     * @param model The model of the product to delete the review from
     * @param user The user who made the review to delete
     * @returns A Promise that resolves to nothing
     */
    async deleteReview(model: string, user: User) /**:Promise<void> */ {
        try {
            await this.productDAO.getProductByModel(model)
            if (!await this.dao.userHasReview(model, user.username)){
                return Promise.reject(new NoReviewProductError())
            }
            await this.dao.deleteUserReview(model, user.username);
            return Promise.resolve();
        }  catch (error) {
            return Promise.reject(error);
        }
    }


    
    /**
     * Deletes all reviews for a product
     * @param model The model of the product to delete the reviews from
     * @returns A Promise that resolves to nothing
     */
    async deleteReviewsOfProduct(model: string) /**:Promise<void> */ {
        try {
            await this.productDAO.getProductByModel(model)
            await this.dao.deleteModelReviews(model);
            return Promise.resolve();
        }  catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Deletes all reviews of all products
     * @returns A Promise that resolves to nothing
     */
    async deleteAllReviews() /**:Promise<void> */ {
        try {
            await this.dao.deleteAllReviews();
            return Promise.resolve();
        }  catch (error) {
            return Promise.reject(error);
        }
    }
}

export default ReviewController;
