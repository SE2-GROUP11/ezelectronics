import {test, expect, jest} from "@jest/globals"
import request from 'supertest'
import {app} from "../../index"

import CartController from "../../src/controllers/cartController";
import Authenticator from "../../src/routers/auth";
import ErrorHandler from "../../src/helper";
import {Cart} from "../../src/components/cart";

const baseURL = "/ezelectronics"


jest.mock("../../src/controllers/productController")
jest.mock("../../src/routers/auth")

afterEach(() => {
    jest.clearAllMocks()
})

const cart = new Cart('',false,'',1000,[])
describe("POST /carts", () => {
    test("Should return status code 200", async () => {
        const model = "test"

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)
        const response = await request(app).post(baseURL + "/carts").send({
            "model": model
        })

        expect(response.status).toBe(200)
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1)

    })
    test("Should return status code 401", async () => {
        const model = "test"

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            res.status(401).json({ error: "Unauthenticated user", status: 401 })
        })

        const addToCart = jest.spyOn(CartController.prototype, "addToCart")
        const response = await request(app).post(baseURL + "/carts").send({
            "model": model
        })

        expect(response.status).toBe(401)
        expect(addToCart).toHaveBeenCalledTimes(0)

    })
})

describe("PATCH /carts/",()=>{
    test("Should return status code 200", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true)
        const response = await request(app).patch(baseURL + "/carts/").send()

        expect(response.status).toBe(200)
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 503", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new Error())
        const response = await request(app).patch(baseURL + "/carts/").send()

        expect(response.status).toBe(503)
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1)
    })
})

describe("GET /carts/history", ()=>{
    test("Should return status code 200", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce([cart])
        const response = await request(app).get(baseURL + "/carts/history").send()

        expect(response.status).toBe(200)
        expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 503", async () => {

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "getCustomerCarts").mockRejectedValueOnce(new Error())

        const response = await request(app).get(baseURL + "/carts/history").send()

        expect(response.status).toBe(503)
        expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 401", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return res.status(401).json({ error: "Unauthenticated user", status: 401 })
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "getCustomerCarts")
        const response = await request(app).get(baseURL + "/carts/history").send()

        expect(response.status).toBe(401)
        expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0)
    })
})

describe("GET /carts/all",()=>{
    test("Should return status code 200", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValueOnce([cart])
        const response = await request(app).get(baseURL + "/carts/all").send()

        expect(response.status).toBe(200)
        expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 503", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "getAllCarts").mockRejectedValueOnce(new Error())
        const response = await request(app).get(baseURL + "/carts/all").send()

        expect(response.status).toBe(503)
        expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 401", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
            return res.status(401).json({ error: "Unauthenticated user", status: 401 })
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "getAllCarts")
        const response = await request(app).get(baseURL + "/carts/all").send()

        expect(response.status).toBe(401)
        expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(0)
    })
})

describe("GET /carts/",()=>{
    test("Should return status code 200", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(cart)
        const response = await request(app).get(baseURL + "/carts/").send()

        expect(response.status).toBe(200)
        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 503", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "getCart").mockRejectedValueOnce(new Error())
        const response = await request(app).get(baseURL + "/carts/").send()

        expect(response.status).toBe(503)
        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 401", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return res.status(401).json({ error: "Unauthenticated user", status: 401 })
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "getCart")
        const response = await request(app).get(baseURL + "/carts/").send()

        expect(response.status).toBe(401)
        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0)
    })
})

describe("DELETE /carts/products/:model",()=>{
    test("Should return status code 200", async () => {
        const model = "test"

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true)
        const response = await request(app).delete(baseURL + "/carts/products/" + model).send()

        expect(response.status).toBe(200)
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 503", async () => {
        const model = "test"

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new Error())
        const response = await request(app).delete(baseURL + "/carts/products/" + model).send()

        expect(response.status).toBe(503)
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1)
    })
})

describe("DELETE /carts/current",()=>{
    test("Should return status code 200", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true)
        const response = await request(app).delete(baseURL + "/carts/current/").send()

        expect(response.status).toBe(200)
        expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 503", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "clearCart").mockRejectedValueOnce(new Error())
        const response = await request(app).delete(baseURL + "/carts/current/").send()

        expect(response.status).toBe(503)
        expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1)
    })
})

describe("DELETE /carts/",()=>{
    test("Should return status code 200", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
        const response = await request(app).delete(baseURL + "/carts/").send()

        expect(response.status).toBe(200)
        expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 503", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "deleteAllCarts").mockRejectedValueOnce(new Error())
        const response = await request(app).delete(baseURL + "/carts/").send()

        expect(response.status).toBe(503)
        expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1)
    })
    test("Should return status code 401", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
            return res.status(401).json({ error: "Unauthenticated user", status: 401 })
        })
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })

        jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true)
        const response = await request(app).delete(baseURL + "/carts/").send()

        expect(response.status).toBe(401)
        expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(0)
    })
})
