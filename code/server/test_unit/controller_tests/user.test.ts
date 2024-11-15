import { describe, test, expect, jest } from "@jest/globals"
import { User, Role } from "../../src/components/user";
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { UserNotFoundError } from "../../src/errors/userError";

jest.mock("../../src/dao/userDAO")



describe('createUser', () => {
    //Example of a unit test for the createUser method of the UserController
    //The test checks if the method returns true when the DAO method returns true
    //The test also expects the DAO method to be called once with the correct parameters
    test("It should return true", async () => {
        const testUser = { //Define a test user object
            username: "test",
            name: "test",
            surname: "test",
            password: "test",
            role: "Manager"
        }
        jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(true); //Mock the createUser method of the DAO
        const controller = new UserController(); //Create a new instance of the controller
        //Call the createUser method of the controller with the test user object
        const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);

        //Check if the createUser method of the DAO has been called once with the correct parameters
        expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
        expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username,
            testUser.name,
            testUser.surname,
            testUser.password,
            testUser.role);
        expect(response).toBe(true); //Check if the response is true
    });

    // Test when DAO createUser throws an exception
    test("UserController.createUser should handle exceptions from DAO", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            password: "test",
            role: "Manager"
        };
        jest.spyOn(UserDAO.prototype, "createUser").mockRejectedValueOnce(new Error("Database error"));
        const controller = new UserController();
        await expect(controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role))
            .rejects.toThrow("Database error");
    });

    // Test when DAO createUser returns false
    test("It should return false when DAO createUser returns false", async () => {
        const testUser = {
            username: "testfail",
            name: "test",
            surname: "test",
            password: "test",
            role: "Manager"
        };
        jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(false);
        const controller = new UserController();
        const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);
        expect(response).toBe(false);
    });

    // Test when provided with null or invalid parameters
    test("UserController.createUser should handle invalid input", async () => {
        const controller = new UserController();
        await expect(controller.createUser("", "", "", "", ""))
            .rejects.toThrow("Invalid input"); // Assurez-vous que votre méthode gère et renvoie cette erreur
    });

    // Test with an unauthorized role
    test("UserController.createUser should handle unauthorized roles", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            password: "test",
            role: "UnknownRole" // Assuming 'UnknownRole' is not accepted
        };
        const controller = new UserController();
        await expect(controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role))
            .rejects.toThrow("Invalid role"); // Assuming the controller checks for valid roles
    });
});



describe('getUsers', () => {
    // Test for successful user retrieval
    test("UserController.getUsers should return a list of users", async () => {
        // Assuming User constructor takes all these parameters
        const users = [
            new User("user1", "First", "Last", Role.CUSTOMER, "password", "Admin"),
            new User("user2", "First2", "Last2", Role.CUSTOMER, "password", "User")
        ];
        jest.spyOn(UserDAO.prototype, "getUsers").mockResolvedValue(users);
        const controller = new UserController();
        const result = await controller.getUsers();
        expect(result).toEqual(users);
    });

    // Test for error propagation from DAO
    test("UserController.getUsers should handle errors from DAO", async () => {
        jest.spyOn(UserDAO.prototype, "getUsers").mockRejectedValue(new Error("Database error"));
        const controller = new UserController();
        await expect(controller.getUsers()).rejects.toThrow("Database error");
    });

    // Test for receiving an empty user list
    test("UserController.getUsers should handle empty user list", async () => {
        jest.spyOn(UserDAO.prototype, "getUsers").mockResolvedValue([]);
        const controller = new UserController();
        const result = await controller.getUsers();
        expect(result).toEqual([]);
    });

    // Test to ensure it handles various user roles correctly
    test("UserController.getUsers should correctly process users with various roles", async () => {
        const users = [
            new User("user1", "First", "Last", Role.ADMIN, "Some Address", "1990-01-01"),
            new User("user2", "First2", "Last2", Role.CUSTOMER, "Another Address", "1992-02-02")
        ];
        jest.spyOn(UserDAO.prototype, "getUsers").mockResolvedValue(users);
        const controller = new UserController();
        const result = await controller.getUsers();
        expect(result).toEqual(users);
    });

    // Test for data consistency
    test("UserController.getUsers should return users with consistent data formats", async () => {
        const users = [
            new User("user1", "First", "Last", Role.ADMIN, "Some Address", "1990-01-01"),
            new User("user2", "First2", "Last2", Role.CUSTOMER, "Another Address", "1992-02-02")
        ];
        jest.spyOn(UserDAO.prototype, "getUsers").mockResolvedValue(users);
        const controller = new UserController();
        const result = await controller.getUsers();
        result.forEach(user => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("surname");
            expect(user).toHaveProperty("role");
        });
    });
});



describe('getUsersByRole', () => {
    // Test for successful retrieval of users by role
    test("UserController.getUsersByRole should return users with a specific role", async () => {
        const users = [
            new User("user1", "First", "Last", Role.ADMIN, "Some Address", "1990-01-01"),
            new User("user2", "First2", "Last2", Role.CUSTOMER, "Another Address", "1992-02-02")
        ];
        jest.spyOn(UserDAO.prototype, "getUsersByRole").mockResolvedValue(users.filter(user => user.role === "Admin"));
        const controller = new UserController();
        const result = await controller.getUsersByRole("Admin");
        expect(result).toEqual([users[0]]);
        expect(result.every(user => user.role === "Admin")).toBe(true);
    });

    // Test for handling errors from DAO when retrieving users by role
    test("UserController.getUsersByRole should handle errors from DAO", async () => {
        jest.spyOn(UserDAO.prototype, "getUsersByRole").mockRejectedValue(new Error("Database error"));
        const controller = new UserController();
        await expect(controller.getUsersByRole("Admin")).rejects.toThrow("Database error");
    });

    // Test for receiving an empty list when no users match the role
    test("UserController.getUsersByRole should handle empty user list for specific role", async () => {
        jest.spyOn(UserDAO.prototype, "getUsersByRole").mockResolvedValue([]);
        const controller = new UserController();
        const result = await controller.getUsersByRole("NonexistentRole");
        expect(result).toEqual([]);
    });
});



// ========== getUserByUsername ==========
describe('getUserByUsername', () => {
    // Test for successful retrieval of a user by username
    test("UserController.getUserByUsername should return a user with the specified username", async () => {
        const requestingUser = new User("adminUser", "AdminFirst", "AdminLast", Role.ADMIN, "Admin Address", "1970-01-01");  // Assuming the user is an admin
        const user = new User("user1", "First", "Last", Role.CUSTOMER, "Some Address", "1990-01-01");
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValue(user);
        const controller = new UserController();
        const result = await controller.getUserByUsername(requestingUser, "user1");
        expect(result).toEqual(user);
        expect(result.username).toBe("user1");
    });

    // Test for handling errors from DAO when retrieving user by username
    test("UserController.getUserByUsername should handle errors from DAO", async () => {
        const notRequestingUser = new User("adminUser", "AdminFirst", "AdminLast", Role.ADMIN, "Admin Address", "1970-01-01");
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockRejectedValue(new Error("Database error"));
        const controller = new UserController();
        await expect(controller.getUserByUsername(notRequestingUser, "user1")).rejects.toThrow("Database error");
    });
});



describe('deleteUser', () => {
    // Test successful deletion of a user
    test("UserController.deleteUser should return true when the user is successfully deleted", async () => {
        const mockUser = new User("user1", "First", "Last", Role.ADMIN, "Address", "1990-01-01");
        jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValue(true);
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValue(mockUser);
        const controller = new UserController();
        const result = await controller.deleteUser(mockUser, mockUser.username);
        expect(result).toBe(true);
    });

    // Test failed deletion when user does not exist
    test("UserController.deleteUser should return false when the user does not exist", async () => {
        const mockUser = new User("nonexistentUser", "First", "Last", Role.ADMIN, "Address", "1990-01-01");
        jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValue(false);
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockRejectedValue(new UserNotFoundError());
        const controller = new UserController();
        const result = await controller.deleteUser(mockUser, mockUser.username);
        expect(result).toBe(false);
    });

    // Test for error handling on deletion failure
    test("UserController.deleteUser should handle errors from DAO", async () => {
        const mockUser = new User("user1", "First", "Last", Role.ADMIN, "Address", "1990-01-01");
        jest.spyOn(UserDAO.prototype, "deleteUser").mockRejectedValue(new Error("Database error"));
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValue(mockUser);
        const controller = new UserController();
        await expect(controller.deleteUser(mockUser, mockUser.username)).rejects.toThrow("Database error");
    });
});



describe('deleteAll', () => {
    // Test successful deletion of all non-admin users
    test("UserController.deleteAll should return true when all non-admin users are successfully deleted", async () => {
        jest.spyOn(UserDAO.prototype, "deleteNonAdmin").mockResolvedValue(true);
        const controller = new UserController();
        const result = await controller.deleteAll();
        expect(result).toBe(true);
    });

    // Test failed deletion when deleteNonAdmin fails
    test("UserController.deleteAll should return false when deleteNonAdmin fails", async () => {
        jest.spyOn(UserDAO.prototype, "deleteNonAdmin").mockResolvedValue(false);
        const controller = new UserController();
        const result = await controller.deleteAll();
        expect(result).toBe(false);
    });

    // Test for error handling on deleteAll failure
    test("UserController.deleteAll should handle errors from DAO", async () => {
        jest.spyOn(UserDAO.prototype, "deleteNonAdmin").mockRejectedValue(new Error("Database error"));
        const controller = new UserController();
        await expect(controller.deleteAll()).rejects.toThrow("Database error");
    });
});



describe('updateUserInfo', () => {
    // Helper function to insert a user into the mock database
    const insertUser = (user: User) => {
        jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValue(true);
        const dao = new UserDAO();
        return dao.createUser(user.username, user.name, user.surname, "password", user.role);
    };

    // Test successful update of user information
    test("UserController.updateUserInfo should return the updated user when the user information is successfully updated", async () => {
        const user = new User("user1", "First", "Last", Role.CUSTOMER, "Address1", "1990-01-01");
		const updated = new User("user1", "UpdatedFirst", "UpdatedLast", Role.CUSTOMER, "UpdatedAddress", "1990-01-01")
        await insertUser(user);

        jest.spyOn(UserDAO.prototype, "updateInfo").mockResolvedValue(true);
        const controller = new UserController();
        const result = await controller.updateUserInfo(user, "UpdatedFirst", "UpdatedLast", "UpdatedAddress", "1990-01-01", "user1");
        expect(result).toEqual(updated);
    });

    // Test failed update when user does not exist
    test("UserController.updateUserInfo should reject(UserNotFoundError) when the user does not exist", async () => {
        const nonExistentUser = new User("nonexistentUser", "First", "Last", Role.CUSTOMER, "Address1", "1990-01-01");

        jest.spyOn(UserDAO.prototype, "updateInfo").mockResolvedValue(false);
        jest.spyOn(UserController.prototype, "getUserByUsername").mockRejectedValue(new UserNotFoundError());
        const controller = new UserController();
        const result = controller.updateUserInfo(nonExistentUser, "UpdatedFirst", "UpdatedLast", "UpdatedAddress", "1990-01-01", "nonexistentUser");
        await expect(result).rejects.toBeInstanceOf(UserNotFoundError);
    });
});
