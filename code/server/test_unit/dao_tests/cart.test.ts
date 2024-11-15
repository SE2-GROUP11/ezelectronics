import {describe, expect, jest, test} from "@jest/globals"

import db from "../../src/db/db"
import {Database} from "sqlite3"
import CartDAO from "../../src/dao/cartDAO";
import {Cart, ProductInCart} from "../../src/components/cart";
import {Category, Product} from "../../src/components/product";
import {CartNotFoundError} from "../../src/errors/cartError";

jest.mock("../../src/db/db.ts")
jest.mock("../../src/errors/cartError.ts")

afterEach(() => {
    jest.clearAllMocks()
})

const product = new Product(1000, 'iphon13', Category.SMARTPHONE, '2024-01-01', '', 10)
const productInCart = new ProductInCart(product.model, product.quantity, product.category, product.sellingPrice)
const cart = new Cart('', false, null, 1000, [productInCart])
const username = 'test'

describe("getCart", () => {
    test("Should resolve with cart", async () => {
        const cartId = 1
        jest.spyOn(db, "get").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, cart)
            return {} as Database
        })
        jest.spyOn(CartDAO.prototype, "getCartProducts").mockResolvedValueOnce(cart.products)

        const cartDAO = new CartDAO()
        const result = await cartDAO.getCart(cartId)

        expect(result).toStrictEqual(cart)
        expect(CartDAO.prototype.getCartProducts).toHaveBeenCalledTimes(1)
    })
})

describe("getUserCartId", () => {
    test("Should resolve with cart id", async () => {
        const cartId = 1
        jest.spyOn(db, "get").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, {
                id: cartId
            })
            return {} as Database
        })

        const cartDAO = new CartDAO()
        const result = await cartDAO.getUserCartId(username)

        expect(result).toStrictEqual(cartId)
    })
})

describe("getCartProducts", () => {
    test("Should resolve with cart products", async () => {
        const cartId = 1
        jest.spyOn(db, "all").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, cart.products)
            return {} as Database
        })

        const cartDAO = new CartDAO()
        const result = await cartDAO.getCartProducts(cartId)

        expect(result).toStrictEqual(cart.products)
    })
})

describe("createEmptyCart", () => {
    test("Should resolve", async () => {
        jest.spyOn(db, "run").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, {})
            return {} as Database
        })

        jest.spyOn(CartDAO.prototype, "getUserCartId").mockRejectedValueOnce(new CartNotFoundError())

        const cartDAO = new CartDAO()
        const result = await cartDAO.createEmptyCart(username)

        expect(result).toBe(true)
        expect(CartDAO.prototype.getUserCartId).toHaveBeenCalledTimes(1)
        expect(CartDAO.prototype.getUserCartId).toHaveBeenCalledWith(username)
    })
})

describe("getProductInCart", () => {
    test("Should resolve", async () => {
        const cartId = 1
        jest.spyOn(db, "get").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, productInCart)
            return {} as Database
        })

        const cartDAO = new CartDAO()
        const result = await cartDAO.getProductInCart(product, cartId)

        expect(result).toStrictEqual(productInCart)
    })
})

describe("increaseProductQuantityInCart", () => {
    test("Should resolve with null", async () => {
        const cartId = 1
        jest.spyOn(db, "run").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, {})
            return {} as Database
        })

        const cartDAO = new CartDAO()
        const result = await cartDAO.increaseProductQuantityInCart(product, cartId)

        expect(result).toBe(null)
    })
})

describe("insertProductInCart", () => {
    test("Should resolve with true", async () => {
        const cartId = 1
        jest.spyOn(db, "run").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, {})
            return {} as Database
        })

        const cartDAO = new CartDAO()
        const result = await cartDAO.insertProductInCart(product, cartId)

        expect(result).toBe(true)
    })
})

describe("checkoutCart", () => {
    // todo to be implemented when getProductByModel is implemented
    test("success", async () => {
    })
})

describe("getUserAllPaidCarts", () => {
    test("success", async () => {
    })
})

describe("decreaseProductQuantityInCart", () => {
    test("Should resolve with null", async () => {
        const cartId = 1
        jest.spyOn(db, "run").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, {})
            return {} as Database
        })

        const cartDAO = new CartDAO()
        const result = await cartDAO.decreaseProductQuantityInCart(product.model, cartId)

        expect(result).toBe(null)
    })
})

describe("removeProductFromCart", () => {
    test("Should resolve with true", async () => {
        const cartId = 1
        jest.spyOn(db, "run").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, {})
            return {} as Database
        })

        const cartDAO = new CartDAO()
        const result = await cartDAO.removeProductFromCart(product.model, cartId)

        expect(result).toBe(true)
    })
})

describe("getAllCarts", () => {
    test("Should resolve with empty array", async () => {
        jest.spyOn(db, "all").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, [])
            return {} as Database
        })

        const cartDAO = new CartDAO()
        const result = await cartDAO.getAllCarts()

        expect(result).toStrictEqual([])
    })
})

describe("deleteAllCarts", () => {
    test("Should resolve with true", async () => {
        jest.spyOn(db, "run").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, {})
            return {} as Database
        })

        const cartDAO = new CartDAO()
        const result = await cartDAO.deleteAllCarts()

        expect(result).toBe(true)
    })
})

describe("deleteAllProductsInCarts", () => {
    test("Should resolve with true", async () => {
        jest.spyOn(db, "run").mockImplementation((query: string, params: any, callback: (err: Error | null, res: any) => void) => {
            callback(null, {})
            return {} as Database
        })

        const cartDAO = new CartDAO()
        const result = await cartDAO.deleteAllProductsInCarts()

        expect(result).toBe(true)
    })
})


