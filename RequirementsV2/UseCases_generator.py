from slugify import slugify

N_UC_before = 0


class UseCase:
    def __init__(self, name, actors, pre, post, nominal, variants, exceptions) -> None:
        self.name = name
        self.actors = actors
        self.pre = pre
        self.post = post
        self.nominal = nominal
        self.variants = variants
        self.exceptions = exceptions

    def fullName(self, index):
        return f"Use case {index}, UC{index}: {self.name}"

    def link(self, index):
        return f"[{self.fullName(index)}](#{slugify(self.fullName(index))})"

    def getScenarios(self):
        return self.nominal + self.variants + self.exceptions

    def details(self, index, f):
        f.write(f"### {self.fullName(index)}\n\n")
        f.write(f"|Actors involved|{self.actors}\n")
        f.write("|:-:|:-|\n")
        f.write(f"|Precondition|{self.pre}|\n")
        f.write(f"|Post condition|{self.post}|\n")
        f.write(
            f"|Nominal Scenario|{ ', '.join([ s.link(index, id+1) for (id, s) in enumerate(self.nominal)])}|\n"
        )
        f.write(
            f"|Variants|{ ', '.join([ s.link(index, id+1 + len(self.nominal)) for (id, s) in enumerate(self.variants)])}|\n"
        )
        f.write(
            f"|Exceptions|{ ', '.join([ s.link(index, id+1 + len(self.nominal+self.variants)) for (id, s) in enumerate(self.exceptions)])}|\n\n"
        )

        for id, s in enumerate(self.nominal):
            s.details(index, id + 1, f)
        for id, s in enumerate(self.variants):
            s.details(index, id + 1 + len(self.nominal), f)
        for id, s in enumerate(self.exceptions):
            s.details(index, id + 1 + len(self.nominal + self.variants), f)


class Scenario:
    def __init__(self, name: str, pre: str, post: str, steps: list[str]):
        self.name = name
        self.pre = pre
        self.post = post
        self.steps = steps

    def code(self, UCindex, index):
        return f"Scenario {UCindex}.{index}"

    def fullName(self, UCindex, index):
        return f"{self.code(UCindex, index)}: {self.name}"

    def link(self, UCindex, index):
        return f"[{self.fullName(UCindex, index)}](#{slugify(self.fullName(UCindex, index).replace('.', ''))})"

    def details(self, UCindex, index, f):
        f.write(f"##### {self.fullName(UCindex, index)}\n\n")
        f.write(f"|{self.code(UCindex, index)}|{self.name}\n")
        f.write("|:-:|:-|\n")
        f.write(f"|Precondition|{self.pre}|\n")
        f.write(f"|Post condition|{self.post}|\n")
        f.write("|Step#|Description|\n")
        for stepNo, step in enumerate(self.steps):
            f.write(f"|{stepNo+1}|{step}|\n")
        f.write("\n")


def UseCases(type, f):
    if type not in ["links", "text"]:
        print("UseCases type must be 'links' or 'text'")
        return

    for ucID, UC in enumerate(UCs):
        if type == "links":
            f.write(f"\t- {UC.link(ucID + 1 + N_UC_before)}\n")
            for sID, scenario in enumerate(UC.getScenarios()):
                f.write(f"\t\t- {scenario.link(ucID+1 + N_UC_before, sID+1)}\n")

        else:
            UC.details(ucID + 1 + N_UC_before, f)


UCs = [
    UseCase(
        "Sign up",
        "Customer",
        "Customer has no previous account",
        "",
        nominal=[
            Scenario(
                "Customer successfully creates account",
                "Customer has no previous account",
                "Customer has an account, then inserts the delivery and billing information",
                [
                    "Customer visits the website sign up page",
                    "Customer fills up the required fields (name, surname, username, password, repeat password)",
                    "Customer account passes necessary validations",
                    "Customer account is created",
                ],
            )
        ],
        variants=[],
        exceptions=[
            Scenario(
                "Username is already in use",
                "Customer has no previous account",
                "Customer doesn't have an account",
                [
                    "Customer visits the website sign up page",
                    "Customer fills up the required fields (name, surname, username, password, repeat password)",
                    "Customer account validation fails due to duplicate username",
                    "Customer is notified with proper error",
                ],
            ),
            Scenario(
                "Password and repeat password do not match",
                "Customer has no previous account",
                "Customer doesn't have an account",
                [
                    "Customer visits the website sign up page",
                    "Customer fills up the required fields (name, surname, username, password, repeat password)",
                    "Customer account validation fails due to the two password not matching",
                    "Customer is notified with proper error",
                ],
            ),
        ],
    ),
    UseCase(
        "Login",
        "User",
        "User has an account",
        "",
        nominal=[
            Scenario(
                "User logs in successfully",
                "User has an account",
                "User is logged in",
                [
                    "User visits the website sign in page",
                    "User enters their username & password",
                    "User credentials are correct",
                    "User is logged in",
                ],
            )
        ],
        variants=[
            Scenario(
                "Customer has not entered delivery address and billing information",
                "Customer has an account",
                "Customer redirected to insert delivery address and billing information",
                [
                    "Customer visits the website sign in page",
                    "Customer enters their username & password",
                    "Customer credentials are correct",
                    "Customer has not entered yet delivery address and billing information",
                    "Customer is redirected to the delivery address and billing page",
                ],
            )
        ],
        exceptions=[
            Scenario(
                "Username not present",
                "User has an account",
                "User is not logged in",
                [
                    "User visits the website sign in page",
                    "User enters their password and a wrong username",
                    "System does not find the username",
                    "User is notified with proper error",
                ],
            ),
            Scenario(
                "Wrong password",
                "User has an account",
                "User is not logged in",
                [
                    "User visits the website sign in page",
                    "User enters their username and a wrong password",
                    "System recognises that the password does not match",
                    "User is notified with proper error",
                ],
            ),
        ],
    ),
    UseCase(
        "Logout",
        "User",
        "User has an account and is logged in",
        "User is no longer logged in",
        nominal=[
            Scenario(
                "User logs out",
                "User has an account and is logged in",
                "User is no longer logged in",
                ["User clicks the logout button", "User is logged out"],
            )
        ],
        variants=[],
        exceptions=[],
    ),
    UseCase(
        "Manage products",
        "Manager",
        "Manager has an account and is logged in",
        "",
        nominal=[
            Scenario(
                "Manager adds a product",
                "Manager has an account and is logged in",
                "A new product is added to the system",
                [
                    'Manager visits the "add product" page',
                    "Manager fills up the required fields",
                    "The new product is added",
                ],
            )
        ],
        variants=[
            Scenario(
                "Manager deletes a product",
                "Manager has an account and is logged in",
                "A product is deleted from the system",
                [
                    "Manager browses product lists",
                    "Manager select a product to delete",
                    "The product is deleted",
                ],
            ),
            Scenario(
                "Manager marks a product as sold",
                "Manager has an account and is logged in",
                "The product cannot be purchased anymore",
                [
                    "Manager browses product lists",
                    "Manager select a product to mark as sold",
                    "The product is marked as sold",
                ],
            ),
        ],
        exceptions=[],
    ),
    UseCase(
        "View cart history",
        "Customer",
        "Customer has an account and is logged in",
        "Customer can view all their previous purchases",
        nominal=[
            Scenario(
                "Customer views the cart history",
                "Customer has an account and is logged in",
                "Customer can view all their previous purchases",
                [
                    'Customer visits "cart history" page',
                    "Customer browses among previous carts",
                ],
            )
        ],
        variants=[],
        exceptions=[],
    ),
    UseCase(
        "Retrieve products",
        "User",
        "User has an account and is logged in",
        "",
        nominal=[
            Scenario(
                "Retrieve products by category",
                "User has an account and is logged in",
                "A list of products in the specified category is returned",
                [
                    "User filters products by category",
                    "User browses among a list of products in that category",
                ],
            )
        ],
        variants=[
            Scenario(
                "Retrieve products by model",
                "User has an account and is logged in",
                "A list of products with the specified model is returned",
                [
                    "User filters products by model",
                    "User browses among a list of products with the specified model",
                ],
            ),
            Scenario(
                "Retrieve a specific product",
                "User has an account and is logged in",
                "The specific product is returned",
                [
                    "User searches for a specific product",
                    "The product detail is returned",
                ],
            ),
        ],
        exceptions=[
            Scenario(
                "No product matches the filters",
                "User has an account and is logged in",
                "An error is shown to the user",
                [
                    "User applies some filters (category, model and/or product)",
                    "System cannot find any product that matches all filters",
                    'System shows an error to the user, saying "no matching products found"',
                ],
            )
        ],
    ),
    UseCase(
        "Add products to the cart",
        "Customer",
        "Customer has an account, is logged in, and has retreived some products",
        "",
        nominal=[
            Scenario(
                "Product can be bought",
                "Customer has an account, is logged in, and has retreived some products",
                "Product is added to the cart",
                [
                    "Customer chooses a product from the search",
                    'Customer presses the "add to cart" button',
                ],
            )
        ],
        variants=[],
        exceptions=[
            Scenario(
                "Product cannot be bought",
                "Customer has an account, is logged in, and has retreived some products",
                "Product is not added to the cart, an error is displayed",
                [
                    "Customer chooses a product from the search",
                    'Customer presses the "add to cart" button',
                    "System checks that the product is not anymore on sale, or it is sold out",
                    "System shows an error to the customer",
                ],
            )
        ],
    ),
    UseCase(
        "Checkout",
        "Customer",
        "Customer has an account, is logged in, and has a cart",
        "",
        nominal=[
            Scenario(
                "Proceed to payment",
                "Customer has an account, is logged in, and has a cart",
                "Customer proceeds to payment",
                [
                    "Cart is not paid and has at least a product inside",
                    'Customer presses the "checkout" button',
                    "System displays the total cost of the cart",
                ],
            )
        ],
        variants=[],
        exceptions=[
            Scenario(
                "Cart is already checked out",
                "Customer has an account, is logged in, and has a cart",
                "An error is shown",
                [
                    "Cart is already paid",
                    'Customer presses the "checkout" button',
                    'System displays an error message "cart is already checked out"',
                ],
            ),
            Scenario(
                "Cart is empty",
                "Customer has an account, is logged in, and has a cart",
                "An error is shown",
                [
                    "Cart is empty",
                    'Customer presses the "checkout" button',
                    'System displays an error message "cart is empty"',
                ],
            ),
        ],
    ),
    UseCase(
        "Customer has finished paying",
        "Customer",
        "Customer has an account, is logged in, and has just paid the cart",
        "",
        nominal=[
            Scenario(
                "Payment was successful",
                "Customer has an account, is logged in, and has just paid the cart",
                "A confirmation message is shown",
                [
                    "Payment is successful",
                    "System logs payment date of the cart",
                    'A "Cart checkout confirmed" message is shown to the customer',
                ],
            )
        ],
        variants=[],
        exceptions=[
            Scenario(
                "Payment failed",
                "Customer has an account, is logged in, and has just paid the cart",
                "An error message is shown",
                [
                    "Payment fails",
                    "System leaves the cart as unpaid",
                    'A "Cart checkout not confirmed, payment failed" error message is shown to the customer',
                ],
            )
        ],
    ),
    # v2
    UseCase(
        "Customer starts payment",
        "Customer",
        "Customer is logged in and is paying for a checked-out cart",
        "",
        nominal=[
            Scenario(
                "Customer has no promotions",
                "Customer is logged in and is paying for a checked-out cart",
                "Customer procedes to the chosen payment system",
                [
                    "System shows that no promotions are available",
                    "System shows how many loyalty points will be awarded with the cart",
                    "System shows the final price of the cart",
                    "System shows the various delivery types (normal, express, collect in shop, ...)",
                    "System shows the insurances available on the delivery",
                    "Customer chooses a delivery type",
                    "System updates the cart price accordingly",
                    "Customer may select insurances",
                    "System updates the cart price accordingly",
                    "System displays all the available payment methods",
                    "Customer procedes to pay with the chosen payment method",
                ],
            ),
        ],
        variants=[
            Scenario(
                "Customer does not apply any promotion",
                "Customer is logged in and is paying for a checked-out cart",
                "Customer procedes to the chosen payment system",
                [
                    "System shows that some promotions are available",
                    "System shows how many loyalty points will be awarded with the cart",
                    "System shows the final price of the cart",
                    "System shows the various delivery types (normal, express, collect in shop, ...)",
                    "System shows the insurances available on the delivery",
                    "Customer chooses a delivery type",
                    "System updates the cart price accordingly",
                    "Customer may select insurances",
                    "System updates the cart price accordingly",
                    "Customer chooses not to apply any promotion",
                    "System displays all the available payment methods",
                    "Customer procedes to pay with the chosen payment method",
                ],
            ),
            Scenario(
                "Customer applies some promotions",
                "Customer is logged in and is paying for a checked-out cart",
                "Customer procedes to the chosen payment system",
                [
                    "System shows that some promotions are available",
                    "System shows how many loyalty points will be awarded with the cart",
                    "System shows the final price of the cart",
                    "System shows the various delivery types (normal, express, collect in shop, ...)",
                    "System shows the insurances available on the delivery",
                    "Customer chooses a delivery type",
                    "System updates the cart price accordingly",
                    "Customer may select insurances",
                    "System updates the cart price accordingly",
                    "Customer chooses to apply some promotions",
                    "System removes the promotions from the ones available to the customer",
                    "System shows the final price of the cart (with promotions applied)",
                    "System displays all the available payment methods",
                    "Customer procedes to pay with the chosen payment method",
                ],
            ),
        ],
        exceptions=[
            Scenario(
                "Customer does not proceed to payment",
                "Customer is logged in and is paying for a checked-out cart",
                "Customer undoes all the preparation of the payment",
                [
                    "System shows the available promotions",
                    "System shows how many loyalty points will be awarded with the cart",
                    "System shows the final price of the cart",
                    "System shows the various delivery types (normal, express, collect in shop, ...)",
                    "System shows the insurances available on the delivery",
                    "Customer chooses a delivery type",
                    "System updates the cart price accordingly",
                    "Customer may select insurances",
                    "System updates the cart price accordingly",
                    "Customer aborts the checkout",
                ],
            ),
        ],
    ),
    UseCase(
        "Customer pays with chosen payment system",
        "Customer",
        "Customer pays with chosen payment system",
        "",
        nominal=[
            Scenario(
                "Customer pays via card",
                'Customer starts payment with option "card"',
                "Order is sent",
                [
                    "Customer inserts the card details",
                    "System negotiates the payment with the bank",
                    "System receives payment from the bank",
                    "Order is sent",
                ],
            )
        ],
        variants=[
            Scenario(
                "Customer pays via PayPal",
                'Customer starts payment with option "PayPal"',
                "Order is sent",
                [
                    "Customer logs in with its PayPal account",
                    "System negotiates the payment with the PayPal API",
                    "System receives payment from PayPal",
                    "Order is sent",
                ],
            ),
            Scenario(
                "Customer pays in cash",
                'Customer starts payment with option "cash"',
                "Order is given to the customer",
                [
                    "System generates a QR code for the cart",
                    "Customer goes to the physical shop and pays for the order",
                    "Store owner gives the products to the customer",
                ],
            ),
        ],
        exceptions=[
            Scenario(
                "Payment fails",
                "Customer starts payment with a specific payment mode",
                "Cart payment is undone, all used discounts are restored, loyalty points from last cart are removed",
                ["Customer or payment system block the payment"],
            )
        ],
    ),
    UseCase(
        "Customer tracks and receives the order",
        "Customer",
        "Customer is logged in, and has a order which is being delivered",
        "",
        nominal=[
            Scenario(
                "Customer tracks and receives the order",
                "Customer is logged in, and has a order which is being delivered",
                "Customer receives its order",
                [
                    "Customer checks the expected delivery time",
                    "Customer checks where its order is",
                    "Order leaves the shop",
                    'System sends a message to the customer saying "order left the shop"',
                    "Order is delivered to the customer",
                    'System sends a message to the customer saying "order delivered"',
                    "Customer confirms to have received the order",
                ],
            )
        ],
        variants=[],
        exceptions=[
            Scenario(
                "Order is not delivered",
                "Customer is logged in, and has a order which is being delivered",
                "Order is not delivered, customer receives a refund",
                [
                    "The shipment company cannot deliver the order",
                    "Shipment company returns the order at the shop",
                    'System sends a message to the customer saying "order could not be delivered"',
                    "System refunds the customer",
                    'System sends a message to the customer saying "you have been refunded"',
                ],
            )
        ],
    ),
    UseCase(
        "Shop owner manages stock",
        "Shop owner",
        "Shop owner is logged in",
        "",
        nominal=[
            Scenario(
                "Shop owner analyzes statistics about sales",
                "Shop owner is logged in",
                "Shop owner has a clear view of the sales statistics",
                [
                    "Shop owner checks sales history for the most and least sold products",
                    "Shop owner checks sales predictions for the most and least sold products",
                ],
            )
        ],
        variants=[
            Scenario(
                "Shop owner checks stock and orders products",
                "Shop owner is logged in",
                "Shop owner has ordered some products",
                [
                    "Shop owner checks stock for all products sold on the website",
                    "Shop owner orders the products that are running low",
                    "Shop owner orders the products that are forcasted to run out in the next month",
                    "Shop owner sets up some recurrent products",
                ],
            )
        ],
        exceptions=[],
    ),
    UseCase(
        "Customer needs support",
        "Customer",
        "Customer is logged in",
        "",
        nominal=[
            Scenario(
                "Customer's problem is solved in the FAQ",
                "Customer is logged in",
                "Customer's problem is solved by FAQ",
                [
                    "Customer wants to know how much time he has for doing a return",
                    "Customer searches within the FAQ",
                    "The FAQ contain the answer: 30 days",
                ],
            )
        ],
        variants=[
            Scenario(
                "Customer's problem is solved by the AI chatbot",
                "Customer is logged in",
                "Customer's problem is solved by the chatbot",
                [
                    "Customer wants to buy a product in the shop, but cannot find it",
                    "Customer asks the AI chatbot where to find the product in the website",
                    "AI chatbot replies with the correct category",
                    "Customer adds the product to the cart",
                ],
            ),
            Scenario(
                "Customer wants ticket support",
                "Customer is logged in",
                "Customer's problem is solved via ticket",
                [
                    "Customer asks the AI chatbot if he can cancel a pending order",
                    "AI chatbot replies that it cannot handle cancellations",
                    "AI chatbot proposes to either open a ticket, or request a live chat",
                    "Customer opens a ticket",
                    "Shop owner cancels the order",
                    "Shop owner replies to the ticket to notify the customer",
                ],
            ),
            Scenario(
                "Customer wants live chat support",
                "Customer is logged in",
                "Customer's problem is solved via live chat",
                [
                    "Customer has received a faulty product",
                    "Customer asks the AI chatbot if he can return the product",
                    "AI chatbot replies that it cannot handle returns",
                    "AI chatbot proposes to either open a ticket, or request a live chat",
                    "Customer opens live chat, attaching pictures of the faulty product",
                    "Shop owner replies to the customer instructing how to return the product",
                ],
            ),
        ],
        exceptions=[],
    ),
    UseCase(
        "Insert delivery address and billing information",
        "Customer",
        "Customer has an account and is logged in",
        "",
        nominal=[
            Scenario(
                "Delivery address and billing information inserted correctly",
                "Customer has an account and is logged in",
                "Customer has finished the registration phase",
                [
                    "Customer inserts the billing information",
                    "Customer inserts the delivery address",
                    "Customer presses the confirmation button",
                    "System records the customer's data",
                    "Customer is redirected to the website's main page",
                ],
            )
        ],
        variants=[
            Scenario(
                "Logout without inserting delivery address and billing information",
                "Customer has an account and is logged in",
                "Customer is logged out",
                [
                    "Customer logs out",
                    "System records that delivery address and billing information are not set",
                ],
            )
        ],
        exceptions=[
            Scenario(
                "Delivery address missing",
                "Customer has an account and is logged in",
                "System displays an error message",
                [
                    "Customer inserts the billing information",
                    "Customer presses the confirmation button",
                    'System shows a "Missing delivery address" error',
                ],
            ),
            Scenario(
                "Billing information missing",
                "Customer has an account and is logged in",
                "System displays an error message",
                [
                    "Customer inserts the delivery address",
                    "Customer presses the confirmation button",
                    'System shows a "Missing billing information" error',
                ],
            ),
        ],
    ),
]


if __name__ == "__main__":
    with open("out.md", "w") as f:
        f.write("- tmp\n")
        UseCases("links", f)
        f.write("\n\n\n\n")
        UseCases("text", f)
