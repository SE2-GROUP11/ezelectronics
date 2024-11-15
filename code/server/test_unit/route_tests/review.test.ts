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
import ErrorHandler from "../../src/helper";
import Authenticator from "../../src/routers/auth";
import request from "supertest";
import { app } from "../../index";
jest.mock("../../src/controllers/reviewController");
jest.mock("../../src/routers/auth");
jest.mock("../../src/helper");

afterEach(() => {
  jest.clearAllMocks();
});

describe(" ReviewRoutes", () => {
  describe(" POST/:model  ", () => {
    test("add a new review ", async () => {
      const mock = jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req: any, res: any, next: () => void): void => {
          next();
        });

      const mock2 = jest
        .spyOn(Authenticator.prototype, "isCustomer")
        .mockImplementation((req: any, res: any, next: () => void): void => {
          next();
        });

      const mock3 = jest
        .spyOn(ReviewController.prototype, "addReview")
        .mockImplementation(
          (
            model: string,
            user: User,
            score: number,
            comment: string
          ): Promise<void> => {
            return Promise.resolve();
          }
        );
      const resault = await request(app)
        .post("/ezelectronics/reviews/8086")
        .send({ score: 4, comment: "goooood " });
      expect(resault.status).toBe(200);
    });
  });

  describe(" GET/:model  ", () => {
    test("retrieving all reviews of a product ", async () => {
      const mock = jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req: any, res: any, next: () => void): void => {
          next();
        });

      const mock2 = jest
        .spyOn(ReviewController.prototype, "getProductReviews")
        .mockImplementation((model: string): Promise<unknown> => {
          return Promise.resolve([new ProductReview("8086" , "shz" ,4 ,"23-6-2024" , "hbd" )]);
        });
      const resault = await request(app).get("/ezelectronics/reviews/8086");

      expect(resault.status).toBe(200);
      expect(resault.body).toEqual([new ProductReview("8086" , "shz" ,4 ,"23-6-2024" , "hbd" )]);
    });
  });

  describe(" DELETE/:model  ", () => {
    test("deleting the review made by a user for one product ", async () => {
      const mock2 = jest
        .spyOn(Authenticator.prototype, "isCustomer")
        .mockImplementation((req: any, res: any, next: () => void): void => {
          next();
        });

      const mock3 = jest
        .spyOn(ReviewController.prototype, "deleteReview")
        .mockImplementation((model: string, user: User): Promise<void> => {
          return Promise.resolve();
        });
      const resault = await request(app)
        .delete("/ezelectronics/reviews/8086")
        .send();
      expect(resault.status).toBe(200);
    });
  });

  describe(" DELETE/:model/all ", () => {
    test("deleting all reviews of a product ", async () => {
      const mock2 = jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req: any, res: any, next: () => void): void => {
          next();
        });

      const mock3 = jest
        .spyOn(ReviewController.prototype, "deleteReviewsOfProduct")
        .mockImplementation((model: string): Promise<void> => {
          return Promise.resolve();
        });
      const resault = await request(app).delete(
        "/ezelectronics/reviews/8086/all"
      );
      expect(resault.status).toBe(200);
    });
  });

  describe(" DELETE/  ", () => {
    test("deleting all reviews of all products ", async () => {
      const mock2 = jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req: any, res: any, next: () => void): void => {
          next();
        });

      const mock3 = jest
        .spyOn(ReviewController.prototype, "deleteAllReviews")
        .mockImplementation((): Promise<void> => {
          return Promise.resolve();
        });
      const resault = await request(app).delete("/ezelectronics/reviews/");
      expect(resault.status).toBe(200);
    });
  });
});
