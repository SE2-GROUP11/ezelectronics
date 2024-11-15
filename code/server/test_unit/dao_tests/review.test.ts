import { describe, test, jest, expect, afterEach } from "@jest/globals";
import db from "../../src/db/db";
import { Database } from "sqlite3";
import ReviewDAO from "../../src/dao/reviewDAO";
import { ProductReview } from "../../src/components/review";
import { promiseHooks } from "v8";

afterEach(() => {
  jest.clearAllMocks();
});

describe("ReviewDAO ", () => {
  describe(" addReview ", () => {
    test("Correctly add a new Review", async () => {
      const mock = jest
        .spyOn(db, "run")
        .mockImplementation(
          (
            sql: string,
            param: any[],
            callback: (err: Error | null) => void
          ): Database => {
            callback(null);
            return {} as Database;
          }
        );
      const result = new ReviewDAO().addReview(
        new ProductReview(
          "8086",
          "shz",
          3,
          "2022-02-02",
          "its really good buy it "
        )
      );
      await expect(result).resolves.toBe(true);
      expect(mock).toBeCalledTimes(1);
    });
  });

  describe(" userHasReview ", () => {
    // user has 1 review
    // user has 0 review -> false
    // user has 2 reviews -> true
    test(" user has 1 review ", async () => {
      const mock = jest
        .spyOn(db, "get")
        .mockImplementation(
          (
            sql: string,
            param: any[],
            callback: (err: Error | null, res: any) => void
          ): Database => {
            callback(null, { cnt: 1 });
            return {} as Database;
          }
        );
      const result = new ReviewDAO().userHasReview("8086", "shz");
      await expect(result).resolves.toBe(true);
      expect(mock).toBeCalledTimes(1);
    });

    test(" user has  0 review ", async () => {
      const mock = jest
        .spyOn(db, "get")
        .mockImplementation(
          (
            sql: string,
            param: any[],
            callback: (err: Error | null, res: any) => void
          ): Database => {
            callback(null, { cnt: 0 });
            return {} as Database;
          }
        );
      const result = new ReviewDAO().userHasReview("8086", "shz");
      await expect(result).resolves.toBe(false);
      expect(mock).toBeCalledTimes(1);
    });
  });

  describe("getReviews ", () => {
    test("get allreviews ", async () => {
      const mock = jest
        .spyOn(db, "all")
        .mockImplementation(
          (
            sql: string,
            param: any[],
            callback: (err: Error | null , res:any[]) => void
          ): Database => {
            callback(null, []);
            return {} as Database;
          }
        );
      const result = new ReviewDAO().getReviews("8086");
      await expect(result).resolves.toBeDefined();
      expect(mock).toBeCalledTimes(1);
    });
  });

  describe("deleteUserReview  ", () => {
    test("Correctly deleteUser Review", async () => {
      const mock = jest
        .spyOn(db, "run")
        .mockImplementation(
          (
            sql: string,
            param: any[],
            callback: (err: Error | null) => void
          ): Database => {
            callback(null);
            return {} as Database;
          }
        );
      const result = new ReviewDAO().deleteUserReview("8086", "shz");
      await expect(result).resolves.toBe(true);
      expect(mock).toBeCalledTimes(1);
    });
  });





  describe(" deleteModelReviews ", () => {
    test("Correctly  deleteModelReviews", async () => {
      const mock = jest
        .spyOn(db, "run")
        .mockImplementation(
          (
            sql: string,
            param: any[],
            callback: (err: Error | null) => void
          ): Database => {
            callback(null);
            return {} as Database;
          }
        );
      const result = new ReviewDAO().deleteModelReviews("8086");
      await expect(result).resolves.toBe(true);
      expect(mock).toBeCalledTimes(1);
    });
  });



  describe("deleteAllReviews ", () => {
    test("Correctly deleteAllReviews", async () => {
      const mock = jest
        .spyOn(db, "run")
        .mockImplementation(
          (
            sql: string,
            callback: (err: Error | null) => void
          ): Database => {
            callback(null);
            return {} as Database;
          }
        );
      const result = new ReviewDAO().deleteAllReviews();
      await expect(result).resolves.toBe(true);
      expect(mock).toBeCalledTimes(1);
    });
  });


});
