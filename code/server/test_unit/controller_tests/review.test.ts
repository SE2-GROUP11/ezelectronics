import { describe, test, jest, expect, afterEach } from "@jest/globals";
import db from "../../src/db/db";
import { Database } from "sqlite3";
import ReviewDAO from "../../src/dao/reviewDAO";
import { ProductReview } from "../../src/components/review";
import ReviewController from "../../src/controllers/reviewController";
import { promiseHooks } from "v8";
import { promises } from "dns";
import { User } from "../../src/components/user";
import { Role } from "../../src/components/user";
import ProductDAO from "../../src/dao/productDAO";
import { Category, Product } from "../../src/components/product";

afterEach(() => {
  jest.clearAllMocks();
});

describe("ReviewController ", () => {
  describe(" addReview ", () => {
    test("Correctly add a new Review", async () => {
      const mock = jest
        .spyOn(ReviewDAO.prototype, "userHasReview")
        .mockImplementation(
          (model: string, username: string): Promise<boolean> => {
            return Promise.resolve(false);
          }
        );

      const mock2 = jest
        .spyOn(ProductReview.prototype, "setReviewDate")
        .mockImplementation(() => {});

      const mock3 = jest
        .spyOn(ReviewDAO.prototype, "addReview")
        .mockImplementation((review: ProductReview): Promise<unknown> => {
          return Promise.resolve();
        });

        const mock4 = jest
        .spyOn(ProductDAO.prototype, "getProductByModel")
        .mockImplementation((model: string): Promise<Product> => {
          return Promise.resolve(new Product(9, "8086", Category.SMARTPHONE, "", "", 9));
        });

      const result = new ReviewController().addReview(
        "8086",
        new User("shz", "shamim ", "zare", Role.ADMIN, "dfghj", "8may"),
        3,
        "its really good buy it plz "
      );
      await expect(result).resolves.toBeUndefined();
      expect(mock).toBeCalledTimes(1);
      expect(mock2).toBeCalledTimes(1);
      expect(mock3).toBeCalledTimes(1);
    });

    test("Invalid review score", async () => {
      const mock = jest
        .spyOn(ReviewDAO.prototype, "userHasReview")
        .mockImplementation(
          (model: string, username: string): Promise<boolean> => {
            return Promise.resolve(false);
          }
        );

      const mock2 = jest
        .spyOn(ProductReview.prototype, "setReviewDate")
        .mockImplementation(() => {});

      const mock3 = jest
        .spyOn(ReviewDAO.prototype, "addReview")
        .mockImplementation((review: ProductReview): Promise<unknown> => {
          return Promise.resolve();
        });

        const mock4 = jest
        .spyOn(ProductDAO.prototype, "getProductByModel")
        .mockImplementation((model: string): Promise<Product> => {
          return Promise.resolve(new Product(9, "8086", Category.SMARTPHONE, "", "", 9));
        });

      const result = new ReviewController().addReview(
        "8086",
        new User("shz", "shamim ", "zare", Role.ADMIN, "dfghj", "8may"),
        6,
        "its really good buy it plz "
      );
      await expect(result).rejects.toBeDefined();
      expect(mock).toBeCalledTimes(0);
      expect(mock2).toBeCalledTimes(0);
      expect(mock3).toBeCalledTimes(0);
    });
  });

  describe("getProductReviews", () => {
    test(" returns all reviews for a product ", async () => {
      const mock = jest
        .spyOn(ReviewDAO.prototype, "getReviews")
        .mockImplementation((model: string): Promise<ProductReview[]> => {
          return Promise.resolve([]);
        });
      const mockGetProductByModel = jest
        .spyOn(ProductDAO.prototype, "getProductByModel")
        .mockImplementation((model: string): Promise<Product> => {
          return Promise.resolve(new Product(9, "8086", Category.SMARTPHONE, "", "", 9));
        });

      const result = new ReviewController().getProductReviews("8086");

      await expect(result).resolves.toEqual([]);
      expect(mock).toBeCalledTimes(1);
      expect(mockGetProductByModel).toBeCalledTimes(1);
    });
  });

  //

  describe(" deleteReview ", () => {
    test("deletes the review ", async () => {
      const mock = jest
        .spyOn(ReviewDAO.prototype, "userHasReview")
        .mockImplementation(
          (model: string, username: string): Promise<boolean> => {
            return Promise.resolve(true);
          }
        );
      const mock2 = jest
        .spyOn(ReviewDAO.prototype, "deleteUserReview")
        .mockImplementation(
          (model: string, username: string): Promise<unknown> => {
            return Promise.resolve();
          }
        );

        const mock4 = jest
        .spyOn(ProductDAO.prototype, "getProductByModel")
        .mockImplementation((model: string): Promise<Product> => {
          return Promise.resolve(new Product(9, "8086", Category.SMARTPHONE, "", "", 9));
        });

      const result = new ReviewController().deleteReview(
        "8086",
        new User("shz", "shamim ", "zare", Role.ADMIN, "dfghj", "8may")
      );
      await expect(result).resolves.toBeUndefined();
      expect(mock).toBeCalledTimes(1);
      expect(mock2).toBeCalledTimes(1);
    });
  });

  describe("  deleteReviewsOfProduct ", () => {
    test("deletes the review of product  ", async () => {
      const mock = jest
        .spyOn(ReviewDAO.prototype, "deleteModelReviews")
        .mockImplementation((model: string): Promise<boolean> => {
          return Promise.resolve(false);
        });

        const mock4 = jest
        .spyOn(ProductDAO.prototype, "getProductByModel")
        .mockImplementation((model: string): Promise<Product> => {
          return Promise.resolve(new Product(9, "8086", Category.SMARTPHONE, "", "", 9));
        });

      const result = new ReviewController().deleteReviewsOfProduct("8086");
      await expect(result).resolves.toBeUndefined();
      expect(mock).toBeCalledTimes(1);
    });
  });

  describe(" deleteAllReviews ", () => {
    test("deletes the review of  all products ", async () => {
      const mock = jest
        .spyOn(ReviewDAO.prototype, "deleteAllReviews")
        .mockImplementation((): Promise<unknown> => {
          return Promise.resolve(false);
        });

      const result = new ReviewController().deleteAllReviews();
      await expect(result).resolves.toBeUndefined();
      expect(mock).toBeCalledTimes(1);
    });
  });
});
