# Requirements Document - current EZElectronics

Date: 05/05/2024

Version: V1 - description of EZElectronics in CURRENT form (as received by teachers)

| Version number |                 Change                  |
| :------------: | :-------------------------------------: |
|       v1       | Requirements about the received project |

# Contents

-   [Requirements Document - current EZElectronics](#requirements-document---current-ezelectronics)
-   [Contents](#contents)
-   [Informal description](#informal-description)
-   [Stakeholders](#stakeholders)
-   [Context Diagram and interfaces](#context-diagram-and-interfaces)
    -   [Context Diagram](#context-diagram)
    -   [Interfaces](#interfaces)
-   [Stories and personas](#stories-and-personas)
-   [Functional and non functional requirements](#functional-and-non-functional-requirements)
    -   [Functional Requirements](#functional-requirements)
    -   [Non Functional Requirements](#non-functional-requirements)
-   [Use case diagram and use cases](#use-case-diagram-and-use-cases)
    -   [Use case 1, UC1: Sign up](#use-case-1-uc1-sign-up)
        -   [Scenario 1.1: Customer successfully creates account](#scenario-11-customer-successfully-creates-account)
        -   [Scenario 1.2: Username is already in use](#scenario-12-username-is-already-in-use)
        -   [Scenario 1.3: Password and repeat password do not match](#scenario-13-password-and-repeat-password-do-not-match)
    -   [Use case 2, UC2: Login](#use-case-2-uc2-login)
        -   [Scenario 2.1: User logs in successfully](#scenario-21-user-logs-in-successfully)
        -   [Scenario 2.2: Username not present](#scenario-22-username-not-present)
        -   [Scenario 2.3: Wrong password](#scenario-23-wrong-password)
    -   [Use case 3, UC3: Logout](#use-case-3-uc3-logout)
        -   [Scenario 3.1: User logs out](#scenario-31-user-logs-out)
    -   [Use case 4, UC4: Manage products](#use-case-4-uc4-manage-products)
        -   [Scenario 4.1: Manager adds a product](#scenario-41-manager-adds-a-product)
        -   [Scenario 4.2: Manager deletes a product](#scenario-42-manager-deletes-a-product)
        -   [Scenario 4.3: Manager marks a product as sold](#scenario-43-manager-marks-a-product-as-sold)
    -   [Use case 5, UC5: View cart history](#use-case-5-uc5-view-cart-history)
        -   [Scenario 5.1: Customer views the cart history](#scenario-51-customer-views-the-cart-history)
    -   [Use case 6, UC6: Retrieve products](#use-case-6-uc6-retrieve-products)
        -   [Scenario 6.1: Retrieve products by category](#scenario-61-retrieve-products-by-category)
        -   [Scenario 6.2: Retrieve products by model](#scenario-62-retrieve-products-by-model)
        -   [Scenario 6.3: Retrieve a specific product](#scenario-63-retrieve-a-specific-product)
        -   [Scenario 6.4: No product matches the filters](#scenario-64-no-product-matches-the-filters)
    -   [Use case 7, UC7: Add products to the cart](#use-case-7-uc7-add-products-to-the-cart)
        -   [Scenario 7.1: Product can be bought](#scenario-71-product-can-be-bought)
        -   [Scenario 7.2: Product cannot be bought](#scenario-72-product-cannot-be-bought)
    -   [Use case 8, UC8: Checkout](#use-case-8-uc8-checkout)
        -   [Scenario 8.1: Proceed to payment](#scenario-81-proceed-to-payment)
        -   [Scenario 8.2: Cart is already checked out](#scenario-82-cart-is-already-checked-out)
        -   [Scenario 8.3: Cart is empty](#scenario-83-cart-is-empty)
    -   [Use case 9, UC9: Customer has finished paying](#use-case-9-uc9-customer-has-finished-paying)
        -   [Scenario 9.1: Payment was successful](#scenario-91-payment-was-successful)
        -   [Scenario 9.2: Payment failed](#scenario-92-payment-failed)
-   [Glossary](#glossary)
-   [System Design](#system-design)
-   [Deployment Diagram](#deployment-diagram)

# Informal description

EZElectronics (read EaSy Electronics) is a software application designed to help managers of electronics stores to manage their products and offer them to customers through a dedicated website. Managers can assess the available products, record new ones, and confirm purchases. Customers can see available products, add them to a cart and see the history of their past purchases.

# Stakeholders

| Stakeholder name | Description                                                          |
| :--------------: | :------------------------------------------------------------------- |
|     Customer     | The person who interacts with the website in order to order items    |
|     Manager      | The person who manages the website products, stocks and orders       |
|   Store owner    | The person who owns an electronic store                              |
|    Developer     | The person who develops features, maintains the website and fix bugs |

# Context Diagram and interfaces

## Context Diagram

![ContextDiagram.png](RequirementsV1%2FContextDiagram.png)

## Interfaces

|    Actor    | Logical Interface |     Physical Interface     |
| :---------: | :---------------: | :------------------------: |
|  Customer   |      Website      | Screen, mouse and keyboard |
|   Manager   |      Website      | Screen, mouse and keyboard |
| Store owner |      Website      | Screen, mouse and keyboard |

# Stories and personas

1. Maria Rossi, Store Manager
    - Maria Rossi is accountable for managing inventory by adding or removing products.
    - Maria Rossi wants an easy-to-use application that allows them to quickly monitor and edit stock status.
    - Maria Rossi wants to easily manage customer transactions and monitor the store's performance.
2. Luca Bianchi, Customer
    - Luca Bianchi is looking for an online shopping experience.
    - Luca Bianchi wants to be able to easily navigate through products and read detailed descriptions.
    - Luca Bianchi also wants to search products with different filters such as model and category.
    - Luca Bianchi wants to view their purchase history.

# Functional and non functional requirements

## Functional Requirements

| ID                                         | Description                                  |
| ------------------------------------------ | -------------------------------------------- |
| FR1                                        | Manage products                              |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR1.1 | Add a product                                |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR1.2 | Delete a product                             |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR1.3 | Retrieve specific product                    |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR1.4 | Retrieve all products                        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR1.5 | Retrieve products of a specific category     |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR1.6 | Retrieve products of a specific model        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR1.7 | Increase products in the inventory           |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR1.8 | Decrease products in the inventory           |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR1.9 | Delete all products                          |
| FR2                                        | Manage user's account                        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR2.1 | Create a user for each role                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR2.2 | Delete a user for each role                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR2.3 | Retrieve specific user information (session) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR2.4 | Retrieve all users                           |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR2.5 | Retrieve users of a specific role            |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR2.6 | Perform login                                |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR2.7 | Perform logout                               |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR2.8 | Delete all users                             |
| FR3                                        | Manage user's cart                           |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR3.1 | Add product to user's cart                   |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR3.2 | Remove product from user's cart              |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR3.3 | Retrieve history for all purchased carts     |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR3.4 | Compute cart cost and perform checkout       |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR3.5 | Retrieve current cart details                |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FR3.6 | Delete all carts                             |

## Non Functional Requirements

|  ID   | Type (efficiency, reliability, ..) | Description                                                                                                                                                 | Refers to  |
| :---: | :--------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- |
| NFR1  |             Efficiency             | Requests should not take than more than 1 second to complete                                                                                                | FR 1, 2, 3 |
| NFR2  |             Efficiency             | The percentage of errors for API calls should not exceed 0.5% over a span of one week                                                                       | FR 1, 2, 3 |
| NFR3  |            Portability             | The web-based interface should be compatible with popular web browsers such as Chrome, Safari, Mozilla and Edge                                             | FR 1, 2, 3 |
| NFR4  |            Reliability             | Website uptime should be 99%                                                                                                                                | FR 1, 2, 3 |
| NFR5  |            Scalability             | The system should be designed to scale horizontally by adding more servers to handle increased load as the user base grows                                  | FR 1, 2, 3 |
| NFR6  |              Security              | User's credentials should be stored with proper encryption                                                                                                  | FR 2.1     |
| NFR7  |             Usability              | The user interface should be user-friendly, requiring less than 2 hours training for managers and zero training for customers to navigate and perform tasks | FR 1, 2, 3 |
| NFR8  |             Usability              | The application should be accessible to users with disabilities                                                                                             | FR 3       |
| NFR9  |          Maintainability           | The code should be well-documented                                                                                                                          | FR 1, 2, 3 |
| NFR10 |          Maintainability           | The APIs should use proper versioning                                                                                                                       | FR 1, 2, 3 |

# Use case diagram and use cases

## Use case diagram

![UsecaseDiagram.png](RequirementsV1%2FUsecaseDiagram.png)

### Use case 1, UC1: Sign up

| Actors involved  | Customer                                                                                                                                                                                               |
| :--------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   Precondition   | Customer has no previous account                                                                                                                                                                       |
|  Post condition  |                                                                                                                                                                                                        |
| Nominal Scenario | [Scenario 1.1: Customer successfully creates account](#scenario-11-customer-successfully-creates-account)                                                                                              |
|     Variants     |                                                                                                                                                                                                        |
|    Exceptions    | [Scenario 1.2: Username is already in use](#scenario-12-username-is-already-in-use), [Scenario 1.3: Password and repeat password do not match](#scenario-13-password-and-repeat-password-do-not-match) |

##### Scenario 1.1: Customer successfully creates account

|  Scenario 1.1  | Customer successfully creates account                                                      |
| :------------: | :----------------------------------------------------------------------------------------- |
|  Precondition  | Customer has no previous account                                                           |
| Post condition | Customer has an account                                                                    |
|     Step#      | Description                                                                                |
|       1        | Customer visits the website sign up page                                                   |
|       2        | Customer fills up the required fields (name, surname, username, password, repeat password) |
|       3        | Customer account passes necessary validations                                              |
|       4        | Customer account is created                                                                |

##### Scenario 1.2: Username is already in use

|  Scenario 1.2  | Username is already in use                                                                 |
| :------------: | :----------------------------------------------------------------------------------------- |
|  Precondition  | Customer has no previous account                                                           |
| Post condition | Customer doesn't have an account                                                           |
|     Step#      | Description                                                                                |
|       1        | Customer visits the website sign up page                                                   |
|       2        | Customer fills up the required fields (name, surname, username, password, repeat password) |
|       3        | Customer account validation fails due to duplicate username                                |
|       4        | Customer is notified with proper error                                                     |

##### Scenario 1.3: Password and repeat password do not match

|  Scenario 1.3  | Password and repeat password do not match                                                  |
| :------------: | :----------------------------------------------------------------------------------------- |
|  Precondition  | Customer has no previous account                                                           |
| Post condition | Customer doesn't have an account                                                           |
|     Step#      | Description                                                                                |
|       1        | Customer visits the website sign up page                                                   |
|       2        | Customer fills up the required fields (name, surname, username, password, repeat password) |
|       3        | Customer account validation fails due to the two password not matching                     |
|       4        | Customer is notified with proper error                                                     |

### Use case 2, UC2: Login

| Actors involved  | User                                                                                                                                 |
| :--------------: | :----------------------------------------------------------------------------------------------------------------------------------- |
|   Precondition   | User has an account                                                                                                                  |
|  Post condition  |                                                                                                                                      |
| Nominal Scenario | [Scenario 2.1: User logs in successfully](#scenario-21-user-logs-in-successfully)                                                    |
|     Variants     |                                                                                                                                      |
|    Exceptions    | [Scenario 2.2: Username not present](#scenario-22-username-not-present), [Scenario 2.3: Wrong password](#scenario-23-wrong-password) |

##### Scenario 2.1: User logs in successfully

|  Scenario 2.1  | User logs in successfully             |
| :------------: | :------------------------------------ |
|  Precondition  | User has an account                   |
| Post condition | User is logged in                     |
|     Step#      | Description                           |
|       1        | User visits the website sign in page  |
|       2        | User enters their username & password |
|       3        | User credentials is correct           |
|       4        | User is logged in                     |

##### Scenario 2.2: Username not present

|  Scenario 2.2  | Username not present                            |
| :------------: | :---------------------------------------------- |
|  Precondition  | User has an account                             |
| Post condition | User is not logged in                           |
|     Step#      | Description                                     |
|       1        | User visits the website sign in page            |
|       2        | User enters their password and a wrong username |
|       3        | System does not find the username               |
|       4        | User is notified with proper error              |

##### Scenario 2.3: Wrong password

|  Scenario 2.3  | Wrong password                                     |
| :------------: | :------------------------------------------------- |
|  Precondition  | User has an account                                |
| Post condition | User is not logged in                              |
|     Step#      | Description                                        |
|       1        | User visits the website sign in page               |
|       2        | User enters their username and a wrong password    |
|       3        | System recognises that the password does not match |
|       4        | User is notified with proper error                 |

### Use case 3, UC3: Logout

| Actors involved  | User                                                      |
| :--------------: | :-------------------------------------------------------- |
|   Precondition   | User has an account and is logged in                      |
|  Post condition  | User is no longer logged in                               |
| Nominal Scenario | [Scenario 3.1: User logs out](#scenario-31-user-logs-out) |
|     Variants     |                                                           |
|    Exceptions    |                                                           |

##### Scenario 3.1: User logs out

|  Scenario 3.1  | User logs out                        |
| :------------: | :----------------------------------- |
|  Precondition  | User has an account and is logged in |
| Post condition | User is no longer logged in          |
|     Step#      | Description                          |
|       1        | User clicks the logout button        |
|       2        | User is logged out                   |

### Use case 4, UC4: Manage products

| Actors involved  | Manager                                                                                                                                                                          |
| :--------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   Precondition   | Manager has an account and is logged in                                                                                                                                          |
|  Post condition  |                                                                                                                                                                                  |
| Nominal Scenario | [Scenario 4.1: Manager adds a product](#scenario-41-manager-adds-a-product)                                                                                                      |
|     Variants     | [Scenario 4.2: Manager deletes a product](#scenario-42-manager-deletes-a-product), [Scenario 4.3: Manager marks a product as sold](#scenario-43-manager-marks-a-product-as-sold) |
|    Exceptions    |                                                                                                                                                                                  |

##### Scenario 4.1: Manager adds a product

|  Scenario 4.1  | Manager adds a product                  |
| :------------: | :-------------------------------------- |
|  Precondition  | Manager has an account and is logged in |
| Post condition | A new product is added to the system    |
|     Step#      | Description                             |
|       1        | Manager visits the "add product" page   |
|       2        | Manager fills up the required fields    |
|       3        | The new product is added                |

##### Scenario 4.2: Manager deletes a product

|  Scenario 4.2  | Manager deletes a product               |
| :------------: | :-------------------------------------- |
|  Precondition  | Manager has an account and is logged in |
| Post condition | A product is deleted from the system    |
|     Step#      | Description                             |
|       1        | Manager browses product lists           |
|       2        | Manager select a product to delete      |
|       3        | The product is deleted                  |

##### Scenario 4.3: Manager marks a product as sold

|  Scenario 4.3  | Manager marks a product as sold          |
| :------------: | :--------------------------------------- |
|  Precondition  | Manager has an account and is logged in  |
| Post condition | The product cannot be purchased anymore  |
|     Step#      | Description                              |
|       1        | Manager browses product lists            |
|       2        | Manager select a product to mark as sold |
|       3        | The product is marked as sold            |

### Use case 5, UC5: View cart history

| Actors involved  | Customer                                                                                      |
| :--------------: | :-------------------------------------------------------------------------------------------- |
|   Precondition   | Customer has an account and is logged in                                                      |
|  Post condition  | Customer can view all their previous purchases                                                |
| Nominal Scenario | [Scenario 5.1: Customer views the cart history](#scenario-51-customer-views-the-cart-history) |
|     Variants     |                                                                                               |
|    Exceptions    |                                                                                               |

##### Scenario 5.1: Customer views the cart history

|  Scenario 5.1  | Customer views the cart history                |
| :------------: | :--------------------------------------------- |
|  Precondition  | Customer has an account and is logged in       |
| Post condition | Customer can view all their previous purchases |
|     Step#      | Description                                    |
|       1        | Customer visits "cart history" page            |
|       2        | Customer browses among previous carts          |

### Use case 6, UC6: Retrieve products

| Actors involved  | Customer                                                                                                                                                                   |
| :--------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   Precondition   | Customer has an account and is logged in                                                                                                                                   |
|  Post condition  |                                                                                                                                                                            |
| Nominal Scenario | [Scenario 6.1: Retrieve products by category](#scenario-61-retrieve-products-by-category)                                                                                  |
|     Variants     | [Scenario 6.2: Retrieve products by model](#scenario-62-retrieve-products-by-model), [Scenario 6.3: Retrieve a specific product](#scenario-63-retrieve-a-specific-product) |
|    Exceptions    | [Scenario 6.4: No product matches the filters](#scenario-64-no-product-matches-the-filters)                                                                                |

##### Scenario 6.1: Retrieve products by category

|  Scenario 6.1  | Retrieve products by category                              |
| :------------: | :--------------------------------------------------------- |
|  Precondition  | Customer has an account and is logged in                   |
| Post condition | A list of products in the specified category is returned   |
|     Step#      | Description                                                |
|       1        | Customer filters products by category                      |
|       2        | Customer browses among a list of products in that category |

##### Scenario 6.2: Retrieve products by model

|  Scenario 6.2  | Retrieve products by model                                         |
| :------------: | :----------------------------------------------------------------- |
|  Precondition  | Customer has an account and is logged in                           |
| Post condition | A list of products with the specified model is returned            |
|     Step#      | Description                                                        |
|       1        | Customer filters products by model                                 |
|       2        | Customer browses among a list of products with the specified model |

##### Scenario 6.3: Retrieve a specific product

|  Scenario 6.3  | Retrieve a specific product              |
| :------------: | :--------------------------------------- |
|  Precondition  | Customer has an account and is logged in |
| Post condition | The specific product is returned         |
|     Step#      | Description                              |
|       1        | Customer searches for a specific product |
|       2        | The product detail is returned           |

##### Scenario 6.4: No product matches the filters

|  Scenario 6.4  | No product matches the filters                                         |
| :------------: | :--------------------------------------------------------------------- |
|  Precondition  | Customer has an account and is logged in                               |
| Post condition | An error is shown to the customer                                      |
|     Step#      | Description                                                            |
|       1        | Customer applies some filters (category, model and/or product)         |
|       2        | System cannot find any product that matches all filters                |
|       3        | System shows an error to the user, saying "no matching products found" |

### Use case 7, UC7: Add products to the cart

| Actors involved  | Customer                                                                        |
| :--------------: | :------------------------------------------------------------------------------ |
|   Precondition   | Customer has an account, is logged in, and has retreived some products          |
|  Post condition  |                                                                                 |
| Nominal Scenario | [Scenario 7.1: Product can be bought](#scenario-71-product-can-be-bought)       |
|     Variants     |                                                                                 |
|    Exceptions    | [Scenario 7.2: Product cannot be bought](#scenario-72-product-cannot-be-bought) |

##### Scenario 7.1: Product can be bought

|  Scenario 7.1  | Product can be bought                                                  |
| :------------: | :--------------------------------------------------------------------- |
|  Precondition  | Customer has an account, is logged in, and has retreived some products |
| Post condition | Product is added to the cart                                           |
|     Step#      | Description                                                            |
|       1        | Customer chooses a product from the search                             |
|       2        | Customer presses the "add to cart" button                              |

##### Scenario 7.2: Product cannot be bought

|  Scenario 7.2  | Product cannot be bought                                                 |
| :------------: | :----------------------------------------------------------------------- |
|  Precondition  | Customer has an account, is logged in, and has retreived some products   |
| Post condition | Product is not added to the cart, an error is displayed                  |
|     Step#      | Description                                                              |
|       1        | Customer chooses a product from the search                               |
|       2        | Customer presses the "add to cart" button                                |
|       3        | System checks that the product is not anymore on sale, or it is sold out |
|       4        | System shows an error to the customer                                    |

### Use case 8, UC8: Checkout

| Actors involved  | Customer                                                                                                                                         |
| :--------------: | :----------------------------------------------------------------------------------------------------------------------------------------------- |
|   Precondition   | Customer has an account, is logged in, and has a cart                                                                                            |
|  Post condition  |                                                                                                                                                  |
| Nominal Scenario | [Scenario 8.1: Proceed to payment](#scenario-81-proceed-to-payment)                                                                              |
|     Variants     |                                                                                                                                                  |
|    Exceptions    | [Scenario 8.2: Cart is already checked out](#scenario-82-cart-is-already-checked-out), [Scenario 8.3: Cart is empty](#scenario-83-cart-is-empty) |

##### Scenario 8.1: Proceed to payment

|  Scenario 8.1  | Proceed to payment                                    |
| :------------: | :---------------------------------------------------- |
|  Precondition  | Customer has an account, is logged in, and has a cart |
| Post condition | Customer proceeds to payment                          |
|     Step#      | Description                                           |
|       1        | Cart is not paid and has at least a product inside    |
|       2        | Customer presses the "checkout" button                |
|       3        | System displays the total cost of the cart            |

##### Scenario 8.2: Cart is already checked out

|  Scenario 8.2  | Cart is already checked out                                    |
| :------------: | :------------------------------------------------------------- |
|  Precondition  | Customer has an account, is logged in, and has a cart          |
| Post condition | An error is shown                                              |
|     Step#      | Description                                                    |
|       1        | Cart is already paid                                           |
|       2        | Customer presses the "checkout" button                         |
|       3        | System displays an error message "cart is already checked out" |

##### Scenario 8.3: Cart is empty

|  Scenario 8.3  | Cart is empty                                         |
| :------------: | :---------------------------------------------------- |
|  Precondition  | Customer has an account, is logged in, and has a cart |
| Post condition | An error is shown                                     |
|     Step#      | Description                                           |
|       1        | Cart is empty                                         |
|       2        | Customer presses the "checkout" button                |
|       3        | System displays an error message "cart is empty"      |

### Use case 9, UC9: Customer has finished paying

| Actors involved  | Customer                                                                    |
| :--------------: | :-------------------------------------------------------------------------- |
|   Precondition   | Customer has an account, is logged in, and has just paid the cart           |
|  Post condition  |                                                                             |
| Nominal Scenario | [Scenario 9.1: Payment was successful](#scenario-91-payment-was-successful) |
|     Variants     |                                                                             |
|    Exceptions    | [Scenario 9.2: Payment failed](#scenario-92-payment-failed)                 |

##### Scenario 9.1: Payment was successful

|  Scenario 9.1  | Payment was successful                                            |
| :------------: | :---------------------------------------------------------------- |
|  Precondition  | Customer has an account, is logged in, and has just paid the cart |
| Post condition | A confirmation message is shown                                   |
|     Step#      | Description                                                       |
|       1        | Payment is successful                                             |
|       2        | System logs payment date of the cart                              |
|       3        | A "Cart checkout confirmed" message is shown to the customer      |

##### Scenario 9.2: Payment failed

|  Scenario 9.2  | Payment failed                                                                         |
| :------------: | :------------------------------------------------------------------------------------- |
|  Precondition  | Customer has an account, is logged in, and has just paid the cart                      |
| Post condition | An error message is shown                                                              |
|     Step#      | Description                                                                            |
|       1        | Payment fails                                                                          |
|       2        | System leaves the cart as unpaid                                                       |
|       3        | A "Cart checkout not confirmed, payment failed" error message is shown to the customer |

# Glossary

![Glossary.png](RequirementsV1%2FGlossary.png)

# Deployment Diagram

![DeploymentDiagram.png](RequirementsV1%2FDeploymentDiagram.png)
