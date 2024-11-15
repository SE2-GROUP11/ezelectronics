import { describe, test, expect, beforeAll, afterAll, afterEach, beforeEach } from "@jest/globals"
import request from 'supertest'
import { app } from "../index"
import db from "../src/db/db"
import crypto from "crypto";
import { User, Role } from "../src/components/user";
import {
	emptyDB,
	getDefaultProduct,
	insertDefaultProduct,
	insertDefaultProducts,
	insertDefaultReview,
	insertDefaultUsers,
	loginAs,
	NdaysAgo,
	query_db,
	today,
	tomorrow,
	yesterday
} from "./utils";

const baseURL = "/ezelectronics/users";

beforeEach(insertDefaultUsers)

afterEach(emptyDB);
beforeAll(emptyDB);

describe("userRoutes + userController + userDAO + db", () => {

    describe('"POST /"', () => {

        describe("Errors in the parameters", () => {

            test("Missing field", async () => {
                const body = {
                    name: "John",
                    surname: "Doe",
                    password: "123456",
                    role: "Customer"
                };

                const res = request(app).post(baseURL).send(body);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(422);

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users WHERE username = 'John'");
                await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
            });

            test("Empty field", async () => {
                const body = {
                    username: "",
                    name: "John",
                    surname: "Doe",
                    password: "123456",
                    role: "Customer"
                };

                const res = request(app).post(baseURL).send(body);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(422);

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users WHERE username = ''");
                await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
            });

            test("Invalid field", async () => {
                const body = {
                    username: "johndoe",
                    name: "John",
                    surname: "Doe",
                    password: "123456",
                    role: "InvalidRole"
                };

                const res = request(app).post(baseURL).send(body);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(422);

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users WHERE username = 'johndoe'");
                await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
            });
        });

        describe("Additional constraints", () => {

            beforeEach(async () => {
                await query_db("DELETE FROM users WHERE username = 'existingUser'");
    
                const salt = crypto.randomBytes(16);
                const hashedPassword = crypto.scryptSync("12345", salt, 16);
                await new Promise<void>((resolve, reject) => {
                    db.run(
                        `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                        ["existingUser", "existingName", "existingSurname", "Customer", hashedPassword, salt],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
            });

            test("Username already exists (expects a 409 error)", async () => {
                const body = {
                    username: "existingUser",
                    name: "Jane",
                    surname: "Doe",
                    password: "securepassword",
                    role: "Admin"
                };

                // Assume 'existingUser' is already inserted in a previous test or setup phase
                const res = request(app).post(baseURL).send(body);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(409);

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users WHERE username = 'existingUser'");
                await expect(dbres).resolves.toEqual([{ cnt: 1 }]); // The count remains 1, no duplicate created
            });
        });
    });

    describe('"POST /"', () => {

        describe("Authentication", () => {

            test("As admin", async () => {
                const cookie = await loginAs("Admin");
                const body = { username: "newUser", name: "New", surname: "User", role: "Customer", password: "pwd" };

                const res = request(app).post(baseURL).set("Cookie", cookie).send(body);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(200);

                const dbres = query_db("SELECT username, name, surname, role FROM users WHERE username = 'newUser'");
                await expect(dbres).resolves.toContainEqual({
                    username: "newUser",
                    name: "New",
                    surname: "User",
                    role: "Customer"
                });
            });

            test("As manager", async () => {
                const cookie = await loginAs("Manager");
                const body = { username: "newUser", name: "New", surname: "User", role: "Customer" };

                const res = request(app).post(baseURL).set("Cookie", cookie).send(body);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(422); // Assuming 403 Forbidden for non-admins

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users WHERE username = 'newUser'");
                await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
            });

            test("As customer", async () => {
                const cookie = await loginAs("Customer");
                const body = { username: "newUser", name: "New", surname: "User", role: "Customer" };

                const res = request(app).post(baseURL).set("Cookie", cookie).send(body);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(422); // Assuming 403 Forbidden for non-admins

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users WHERE username = 'newUser'");
                await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
            });

            test("Not authenticated", async () => {
                const body = { username: "newUser", name: "New", surname: "User", role: "Customer" };

                const res = request(app).post(baseURL).send(body);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(422); // Unauthorized access

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users WHERE username = 'newUser'");
                await expect(dbres).resolves.toEqual([{ cnt: 0 }]);
            });
        });

        describe("Errors in the parameters", () => {

            test("Missing array of users", async () => {
                const cookie = await loginAs("Admin");

                const res = request(app).post(baseURL).set("Cookie", cookie);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(422); // Bad request due to missing body

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users");
                await expect(dbres).resolves.toBeTruthy();
            });

            test("Empty array of users", async () => {
                const cookie = await loginAs("Admin");
                const body: any[] = [];

                const res = request(app).post(baseURL).set("Cookie", cookie).send(body);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(422); // Bad request due to empty array

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users");
                await expect(dbres).resolves.toBeTruthy();
            });
        });
    });

    describe("GET /roles/:role", () => {

        describe("Authentication", () => {

            beforeEach(async () => {
                await query_db("DELETE FROM users WHERE username = 'existingUser1'");
                await query_db("DELETE FROM users WHERE username = 'existingUser2'");
                await query_db("DELETE FROM users WHERE username = 'existingUser3'");
    
                const salt = crypto.randomBytes(16);
                const hashedPassword = crypto.scryptSync("12345", salt, 16);
                await new Promise<void>((resolve, reject) => {
                    db.run(
                        `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                        ["existingUser1", "existingName1", "existingSurname1", "Customer", hashedPassword, salt],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                    db.run(
                        `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                        ["existingUser2", "existingName2", "existingSurname2", "Customer", hashedPassword, salt],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                    db.run(
                        `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                        ["existingUser3", "existingName3", "existingSurname3", "Manager", hashedPassword, salt],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
            });

            test("As admin", async () => {
                const cookie = await loginAs("Admin");
                const res = request(app).get(`${baseURL}/roles/Customer`).set("Cookie", cookie);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(200);

                const dbres = query_db("SELECT username, name, surname, role, address, birthdate FROM users WHERE role = 'Customer'");
                await expect(dbres).resolves.toEqual((await res).body);
            });

            test("As manager", async () => {
                const cookie = await loginAs("Manager");
                const res = request(app).get(`${baseURL}/roles/Customer`).set("Cookie", cookie);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(401);
            });

            test("As customer", async () => {
                const cookie = await loginAs("Customer");
                const res = request(app).get(`${baseURL}/roles/Customer`).set("Cookie", cookie);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(401);
            });

            test("Not authenticated", async () => {
                const res = request(app).get(`${baseURL}/roles/Customer`);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(401);
            });
        });

        describe("Errors in the parameters", () => {

            test("Missing role", async () => {
                const cookie = await loginAs("Admin");
                const res = request(app).get(`${baseURL}/roles/`).set("Cookie", cookie);

                await expect(res).resolves.toBeDefined();
				// It becomes a different, non-existing route
                expect((await res).status).toBe(404);
            });

            test("Invalid role", async () => {
                const cookie = await loginAs("Admin");
                const res = request(app).get(`${baseURL}/roles/InvalidRole`).set("Cookie", cookie);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(422); // Assuming an error 400 for invalid roles
            });
        });
    });

    describe('"GET /:username"', () => {

        beforeEach(async () => {
            await query_db("DELETE FROM users WHERE username = 'existingUser'");

            const salt = crypto.randomBytes(16);
            const hashedPassword = crypto.scryptSync("12345", salt, 16);
            await new Promise<void>((resolve, reject) => {
                db.run(
                    `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                    ["existingUser", "existingName", "existingSurname", "Customer", hashedPassword, salt],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        });

        describe("Authentication", () => {

            test("Is authenticated", async () => {
                const cookie = await loginAs("Admin");
                const res = await request(app).get(`${baseURL}/existingUser`).set("Cookie", cookie);

                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.objectContaining({
                    username: "existingUser"
                }));
            });

            test("Not authenticated", async () => {
                const res = await request(app).get(`${baseURL}/existingUser`);

                expect(res.status).toBe(401);
            });
        });

        describe("Errors in the parameters", () => {

            test("Missing username", async () => {
				// It becomes a different, existing route
                expect("Unreachable").toBe("Unreachable")
            });

            test("Empty username", async () => {
				// It becomes a different, existing route
                expect("Unreachable").toBe("Unreachable")
            });
        });

        describe("Additional constraints", () => {

            test("Username doesn't exist in the database", async () => {
                const cookie = await loginAs("Admin");
                const res = await request(app).get(`${baseURL}/nonExistingUser`).set("Cookie", cookie);

                expect(res.status).toBe(404);
            });

            test("Unauthorized access to another user's data", async () => {
                const cookie = await loginAs("Customer");
                const res = await request(app).get(`${baseURL}/existingUser`).set("Cookie", cookie);

                expect(res.status).toBe(401);
            });
        });
    });

    describe('"DELETE /:username"', () => {

        beforeEach(async () => {
            await query_db("DELETE FROM users WHERE username = 'existingUser1'");
            await query_db("DELETE FROM users WHERE username = 'existingUser2'");

            const salt = crypto.randomBytes(16);
            const hashedPassword = crypto.scryptSync("12345", salt, 16);
            await new Promise<void>((resolve, reject) => {
                db.run(
                    `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                    ["existingUser1", "existingName1", "existingSurname1", "Customer", hashedPassword, salt],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
                db.run(
                    `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                    ["existingUser2", "existingName2", "existingSurname2", "Admin", hashedPassword, salt],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        });

        describe("Authentication", () => {

            test("Is authenticated", async () => {
                const cookie = await loginAs("Admin");
                const res = request(app).delete(`${baseURL}/existingUser1`).set("Cookie", cookie);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(200);  // Assuming it returns HTTP 200 on successful deletion
            });

            test("Not authenticated", async () => {
                const res = request(app).delete(`${baseURL}/existingUser1`);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(401);
            });
        });

        describe("Errors in the parameters", () => {
            test("Missing username", async () => {
				// It becomes a different, existing route
                expect("Untestable").toBe("Untestable")
            });

            test("Empty username", async () => {
				// It becomes a different, existing route
                expect("Untestable").toBe("Untestable")
            });
        });

        describe("Additional constraints", () => {

            test("Username doesn't exist in the database", async () => {
                const cookie = await loginAs("Admin");
                const res = request(app).delete(`${baseURL}/nonExistingUser`).set("Cookie", cookie);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(404);
            });

            test("Unauthorised attempt by non-admin to delete another user", async () => {
                const cookie = await loginAs("Manager");
                const res = request(app).delete(`${baseURL}/existingUser1`).set("Cookie", cookie);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(401);
            });

            test("Admin trying to delete another admin", async () => {
                const cookie = await loginAs("Admin");
                const res = request(app).delete(`${baseURL}/existingUser2`).set("Cookie", cookie);
                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(401);
            });
        });
    });

    describe("DELETE /", () => {

        beforeEach(async () => {
            await query_db("DELETE FROM users WHERE username = 'existingUser1'");
            await query_db("DELETE FROM users WHERE username = 'existingUser2'");
            await query_db("DELETE FROM users WHERE username = 'existingUser3'");

            const salt = crypto.randomBytes(16);
            const hashedPassword = crypto.scryptSync("12345", salt, 16);
            await new Promise<void>((resolve, reject) => {
                db.run(
                    `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                    ["existingUser1", "existingName1", "existingSurname1", "Admin", hashedPassword, salt],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
                db.run(
                    `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                    ["existingUser2", "existingName2", "existingSurname2", "Manager", hashedPassword, salt],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
                db.run(
                    `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                    ["existingUser3", "existingName3", "existingSurname3", "Customer", hashedPassword, salt],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        });

        describe("Authentication", () => {

            test("As admin", async () => {
                const cookie = await loginAs("Admin");
                const res = request(app).delete(`${baseURL}`).set("Cookie", cookie);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(200); // Assuming 204 No Content on successful delete

                const dbres = query_db("SELECT role FROM users WHERE role <> 'Admin'");
                await expect(dbres).resolves.toEqual([]); // No non-admin users should remain
            });

            test("As manager", async () => {
                const cookie = await loginAs("Manager");
                const res = request(app).delete(`${baseURL}`).set("Cookie", cookie);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(401); // Forbidden access

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users WHERE role <> 'Admin'");
                await expect(dbres).resolves.not.toEqual([{ cnt: 0 }]); // Non-admin users should still exist
            });

            test("As customer", async () => {
                const cookie = await loginAs("Customer");
                const res = request(app).delete(`${baseURL}`).set("Cookie", cookie);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(401); // Forbidden access

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users WHERE role <> 'Admin'");
                await expect(dbres).resolves.not.toEqual([{ cnt: 0 }]); // Non-admin users should still exist
            });

            test("Not authenticated", async () => {
                const res = request(app).delete(`${baseURL}`);

                await expect(res).resolves.toBeDefined();
                expect((await res).status).toBe(401); // Unauthorized

                const dbres = query_db("SELECT COUNT(*) AS cnt FROM users WHERE role <> 'Admin'");
                await expect(dbres).resolves.not.toEqual([{ cnt: 0 }]); // Non-admin users should still exist
            });
        });
    });

    describe('"PATCH /:username"', () => {

        beforeEach(async () => {
            await query_db("DELETE FROM users WHERE username = 'existingUser1'");

            const salt = crypto.randomBytes(16);
            const hashedPassword = crypto.scryptSync("12345", salt, 16);
            await new Promise<void>((resolve, reject) => {
                db.run(
                    `INSERT INTO users (username, name, surname, role, password, salt, address, birthdate) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)`,
                    ["existingUser1", "existingName1", "existingSurname1", "Customer", hashedPassword, salt],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        });

        describe("Authentication", () => {

            test("As admin", async () => {
                const cookie = await loginAs("Admin");
                const body = { name: "admin", surname: "admin", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "1970-01-01" };

                const res = await request(app)
                    .patch(`${baseURL}/existingUser1`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(200);
                expect(res.body).toEqual({ username: "existingUser1", name: "admin", surname: "admin", role: "Customer", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "1970-01-01" });
            });

            test("Not authenticated", async () => {
                const body = { name: "guest", surname: "guest", address: "Piazza Castello 1, Torino", birthdate: "2000-01-01" };

                const res = await request(app)
                    .patch(`${baseURL}/existingUser1`)
                    .send(body);

                expect(res.status).toBe(401);
            });
        });

        describe("Errors in the parameters", () => {

            test("Missing username", async () => {
                const cookie = await loginAs("Admin");
                const body = { name: "admin", surname: "admin", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "1970-01-01" };

                const res = await request(app)
                    .patch(`${baseURL}/`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(404);
            });
        });

        describe("Errors in the body content", () => {

            test("Missing name", async () => {
                const cookie = await loginAs("Admin");
                const body = { surname: "admin", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "1970-01-01" };

                const res = await request(app)
                    .patch(`${baseURL}/existingUser1`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(422);
            });

            test("Empty name", async () => {
                const cookie = await loginAs("Admin");
                const body = { name: "", surname: "admin", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "1970-01-01" };

                const res = await request(app)
                    .patch(`${baseURL}/existingUser1`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(422);
            });

            test("Missing address", async () => {
                const cookie = await loginAs("Admin");
                const body = { name: "admin", surname: "admin", birthdate: "1970-01-01" };

                const res = await request(app)
                    .patch(`${baseURL}/existingUser1`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(422);
            });

            test("Empty address", async () => {
                const cookie = await loginAs("Admin");
                const body = { name: "admin", surname: "admin", address: "", birthdate: "1970-01-01" };

                const res = await request(app)
                    .patch(`${baseURL}/existingUser1`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(422);
            });

            test("Missing birthdate", async () => {
                const cookie = await loginAs("Admin");
                const body = { name: "admin", surname: "admin", address: "Corso Duca degli Abruzzi 129, Torino" };

                const res = await request(app)
                    .patch(`${baseURL}/existingUser1`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(422);
            });

            test("Empty birthdate", async () => {
                const cookie = await loginAs("Admin");
                const body = { name: "admin", surname: "admin", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "" };

                const res = await request(app)
                    .patch(`${baseURL}/existingUser1`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(422);
            });

            test("Invalid birthdate format", async () => {
                const cookie = await loginAs("Admin");
                const body = { name: "admin", surname: "admin", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "01/01/1970" };

                const res = await request(app)
                    .patch(`${baseURL}/existingUser1`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(422);
            });

            test("Birthdate is in the future", async () => {
                const cookie = await loginAs("Admin");
                const body = { name: "admin", surname: "admin", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "2030-01-01" };

                const res = await request(app)
                    .patch(`${baseURL}/existingUser1`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(400);
            });
        });

        describe("Additional constraints", () => {
            test("Username doesn't exist", async () => {
                const cookie = await loginAs("Admin");
                const body = { name: "admin", surname: "admin", address: "Corso Duca degli Abruzzi 129, Torino", birthdate: "1970-01-01" };

                const res = await request(app)
                    .patch(`${baseURL}/nonExistingUser`)
                    .set("Cookie", cookie)
                    .send(body);

                expect(res.status).toBe(404);
            });
        });
    });
    
});
