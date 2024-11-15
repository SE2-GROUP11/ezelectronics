import db from "../db/db";
import crypto from "crypto";
import {ProductReview} from "../components/review";
import {UserAlreadyExistsError} from "../errors/userError";

/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ReviewDAO {

    addReview(review: ProductReview) {
        return new Promise((resolve, reject)=>{
            try {
                const sql = "INSERT INTO productreview VALUES(?,?,?,?,?)"
                db.run(sql, [review.model, review.user, review.score, review.date, review.comment], (err: Error | null) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(true)
                })
            } catch (error) {
                reject(error)
            }
        });
    }

    userHasReview(model: string, username: string) {
        return new Promise((resolve, reject)=>{
            try {
                //const stmt = db.prepare().bind(model, username);
                db.get("SELECT COUNT(*) AS cnt FROM productreview WHERE model=? AND user=?", [model, username], (err: Error | null, res: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res['cnt'] === 1);
                });
                //stmt.finalize();
            } catch (error) {
                reject(error)
            }
        });
    }

    getReviews(model: string) {
        return new Promise((resolve, reject)=>{
            try {

             //   const stmt = db.prepare("SELECT * FROM productreview WHERE model=?").bind(model);
             db.all("SELECT * FROM productreview WHERE model=?", [model], (err: Error | null, res: any) => { 
            // stmt.all((err: Error | null, res: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res);
                });
                //stmt.finalize();
            } catch (error) {
                reject(error)
            }
        });
    }

    deleteUserReview(model: string, username: string) {
        return new Promise((resolve, reject)=>{
            try {
               // const stmt = db.prepare("DELETE FROM productreview WHERE model=? AND user=?").bind(model, username);
               db.run("DELETE FROM productreview WHERE model=? AND user=?",[model, username],(err :Error )=>{
              // stmt.run((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
               // stmt.finalize();
            } catch (error) {
                reject(error)
            }
        });
    }

    deleteModelReviews(model: string) {
        return new Promise((resolve, reject)=>{
            try {
                
                //const stmt = db.prepare("DELETE FROM productreview WHERE model=?").bind(model);
                db.run("DELETE FROM productreview WHERE model=?",[model],(err :Error )=>{
                //stmt.run((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
               // stmt.finalize();
            } catch (error) {
                reject(error)
            }
        });
    }

    deleteAllReviews() {
        return new Promise((resolve, reject)=>{
            try {
               // const stmt = db.prepare("DELETE FROM productreview");
                db.run("DELETE FROM productreview" ,(err:Error)=>{
              //  stmt.run((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
              //  stmt.finalize();
            } catch (error) {
                reject(error)
            }
        });
    }

}

export default ReviewDAO;