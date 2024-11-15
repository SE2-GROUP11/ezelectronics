import {test, expect, jest} from "@jest/globals"


import CartDAO from "../../src/dao/cartDAO";
import CartController from "../../src/controllers/cartController";
import {Role, User} from "../../src/components/user";
import {CartNotFoundError} from "../../src/errors/cartError";
import {Cart, ProductInCart} from "../../src/components/cart";
import { Category } from "../../src/components/product";

jest.mock("../../src/dao/userDAO")

const user = new User('test', 'test', 'test', Role.CUSTOMER, 'test', '');
const cart = new Cart('', false, '', 1000, [])

afterEach(() => {
    jest.clearAllMocks()
})

describe('addToCart', () => {
    // todo to be implemented when getProductByModel is implemented
    test("success", async () => {
    });
    test("", async () => {
    });
})

describe('getCart', () => {
    test("Should resolve", async () => {
        const cartId = 1
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(cart)
        jest.spyOn(CartController.prototype, "getCartId").mockResolvedValueOnce(cartId)

        const cartController = new CartController();
        await cartController.getCart(user)

        expect(CartController.prototype.getCartId).toHaveBeenCalledTimes(1)
        expect(CartController.prototype.getCartId).toHaveBeenCalledWith(user, true)
        expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(1)
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(cartId)
    });
    test("Should fail", async () => {
        jest.spyOn(CartDAO.prototype, "getCart")
        jest.spyOn(CartController.prototype, "getCartId").mockRejectedValueOnce(new Error());

        const cartController = new CartController();
        try {
            await cartController.getCart(user)
            fail()
        } catch (err) {
            expect(CartController.prototype.getCartId).toHaveBeenCalledTimes(1)
            expect(CartController.prototype.getCartId).toHaveBeenCalledWith(user, true)

            expect(CartDAO.prototype.getCart).toHaveBeenCalledTimes(0)
        }
    });
})

describe('getCartId', () => {
    test("Should resolve", async () => {
        const cartId = 1

        jest.spyOn(CartDAO.prototype, "getUserCartId").mockResolvedValueOnce(cartId);

        const cartController = new CartController();
        await cartController.getCartId(user)

        expect(CartDAO.prototype.getUserCartId).toHaveBeenCalledTimes(1)
        expect(CartDAO.prototype.getUserCartId).toHaveBeenCalledWith(user.username)
    });
    test("Should fail with CartNotFoundError", async () => {
        const model = "test"
        const cartId = 1

        jest.spyOn(CartDAO.prototype, "getUserCartId").mockRejectedValue(new CartNotFoundError());
        jest.spyOn(CartDAO.prototype, "createEmptyCart");

        const cartController = new CartController();
        try {
            await cartController.getCartId(user)
            fail()
        } catch (err) {
            expect(CartDAO.prototype.getUserCartId).toHaveBeenCalledTimes(2)
            expect(CartDAO.prototype.getUserCartId).toHaveBeenCalledWith(user.username)
            expect(CartDAO.prototype.createEmptyCart).toHaveBeenCalledTimes(1)
        }
    });
})

describe('checkoutCart', () => {
    test("Should resolve", async () => {
        const cartId = 1;
		const cart = new Cart("customer", false, "", 100, [ new ProductInCart("prod", 1, Category.APPLIANCE, 100) ])
        jest.spyOn(CartController.prototype, "getCartId").mockResolvedValueOnce(cartId);
        jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(cart);
        jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);

        const cartController = new CartController();
        await cartController.checkoutCart(user)

        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(1)
        expect(CartController.prototype.getCartId).toHaveBeenCalledTimes(1)
        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)

        expect(CartController.prototype.getCartId).toHaveBeenCalledWith(user, true)
    });
    test("Should fail", async () => {
        jest.spyOn(CartController.prototype, "getCartId").mockRejectedValueOnce(new Error());
        jest.spyOn(CartDAO.prototype, "checkoutCart")

        const cartController = new CartController();
        try {
            await cartController.checkoutCart(user)
            fail()
        } catch (err) {
            expect(CartController.prototype.getCartId).toHaveBeenCalledTimes(1)
			
            expect(CartController.prototype.getCartId).toHaveBeenCalledWith(user, true)
            expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(0)
        }
    });
})

describe('getCustomerCarts', () => {
    test("Should resolve", async () => {
        jest.spyOn(CartDAO.prototype, "getUserAllPaidCarts").mockResolvedValueOnce([cart]);

        const cartController = new CartController();
        await cartController.getCustomerCarts(user)

        expect(CartDAO.prototype.getUserAllPaidCarts).toHaveBeenCalledTimes(1)
        expect(CartDAO.prototype.getUserAllPaidCarts).toHaveBeenCalledWith(user.username)
    });
    test("Should fail", async () => {
        jest.spyOn(CartDAO.prototype, "getUserAllPaidCarts").mockRejectedValueOnce(new Error());

        const cartController = new CartController();
        try {
            await cartController.getCustomerCarts(user)
            fail()
        } catch (err) {
            expect(CartDAO.prototype.getUserAllPaidCarts).toHaveBeenCalledTimes(1)
            expect(CartDAO.prototype.getUserAllPaidCarts).toHaveBeenCalledWith(user.username)
        }
    });
})

describe('removeProductFromCart', () => {
    // todo to be implemented when getProductByModel is implemented
    test("success", async () => {
    });
    test("", async () => {
    });
})

describe('clearCart', () => {
    test("Should resolve", async () => {
        const cartId = 1;
        jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(cart);
        jest.spyOn(CartController.prototype, "getCartId").mockResolvedValueOnce(cartId);
        jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockResolvedValueOnce(true);

        const cartController = new CartController();
        await cartController.clearCart(user)

        expect(CartController.prototype.getCartId).toHaveBeenCalledTimes(1)

        expect(CartController.prototype.getCartId).toHaveBeenCalledWith(user, true)

        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
        expect(CartController.prototype.getCart).toHaveBeenCalledWith(user)

        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledTimes(0)
    });
    test("Should fail", async () => {
        const cartId = 1;
        jest.spyOn(CartController.prototype, "getCart").mockRejectedValueOnce(new Error());
        jest.spyOn(CartController.prototype, "getCartId")
        jest.spyOn(CartDAO.prototype, "removeProductFromCart")

        const cartController = new CartController();
        try {
            await cartController.clearCart(user)
            fail()
        } catch (err) {
            expect(CartController.prototype.getCartId).toHaveBeenCalledTimes(1)
			
            expect(CartController.prototype.getCartId).toHaveBeenCalledWith(user, true)

            expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0)

            expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledTimes(0)
        }
    });
})

describe('deleteAllCarts', () => {
    test("Should resolve", async () => {
        jest.spyOn(CartDAO.prototype, "deleteAllProductsInCarts").mockResolvedValueOnce(true);
        jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockResolvedValueOnce(true);

        const cartController = new CartController();
        await cartController.deleteAllCarts()

        expect(CartDAO.prototype.deleteAllProductsInCarts).toHaveBeenCalledTimes(1)
        expect(CartDAO.prototype.deleteAllProductsInCarts).toHaveBeenCalledWith()

        expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalledTimes(1)
        expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalledWith()
    });
    test("Should fail", async () => {
        jest.spyOn(CartDAO.prototype, "deleteAllProductsInCarts").mockRejectedValueOnce(new Error())
        jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockResolvedValueOnce(true)

        const cartController = new CartController();
        try {
            await cartController.deleteAllCarts()
            fail()
        } catch (err) {
            expect(CartDAO.prototype.deleteAllProductsInCarts).toHaveBeenCalledTimes(1)
            expect(CartDAO.prototype.deleteAllProductsInCarts).toHaveBeenCalledWith()

            expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalledTimes(0)
        }

    });
})

describe('getAllCarts', () => {
    test("Should resolve", async () => {
        jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValueOnce([cart]);

        const cartController = new CartController();
        await cartController.getAllCarts()

        expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledTimes(1)
    });
    test("Should fail", async () => {
        jest.spyOn(CartDAO.prototype, "getAllCarts").mockRejectedValueOnce(new Error());

        const cartController = new CartController();
        try {
            await cartController.getAllCarts()
            fail()
        } catch (err) {
            expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledWith()
            expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledTimes(1)
        }

    });
})
