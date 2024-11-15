| Test case name | Object(s) tested | Test level | Technique used |
| :------------- | :--------------- | :--------: | :------------: |
| ReviewRoutes > add a new review | POST ezelectronics/reviews/:model | Unit | WB |
| ReviewRoutes > retrieving all reviews of a product | GET ezelectronics/reviews/:model | Unit | WB |
| ReviewRoutes > deleting the review made by a user for one product | DELETE ezelectronics/reviews/:model | Unit | WB |
| ReviewRoutes > deleting all reviews of a product | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| ReviewRoutes > deleting all reviews of all products | DELETE ezelectronics/reviews/ | Unit | WB |
| ReviewDAO>Correctly add a new Review | ReviewDAO.addReview  | Unit | WB |
| ReviewDAO>user has 1 review | ReviewDAO.userHasReview | Unit | WB |
| ReviewDAO>user has  0 review | ReviewDAO.userHasReview | Unit | WB |
| ReviewDAO>get allreviews | ReviewDAO.getReviews  | Unit | WB |
| ReviewDAO>Correctly deleteUser Review | ReviewDAO.deleteUserReview | Unit | WB |
| ReviewDAO>Correctly  deleteModelReviews | ReviewDAO.deleteModelReviews | Unit | WB |
| ReviewDAO>Correctly deleteAllReviews | ReviewDAO.deleteAllReviews | Unit | WB |
| ReviewController>Correctly add a new Review | ReviewController.addReview | Unit | WB |
| ReviewController>Invalid review score | ReviewController.addReview | Unit | WB |
| ReviewController>returns all reviews for a product | ReviewController.getProductReviews | Unit | WB |
| ReviewController>deletes the review | ReviewController.deleteReview | Unit | WB |
| ReviewController>deletes the review of product | ReviewController.deleteReviewsOfProduct | Unit | WB |
| ReviewController>deletes the review of  all products | ReviewController.deleteAllReviews | Unit | WB |
| ProductDAO > registerProduct > * | ProductDAO.registerProduct | Unit | BB/equal partitioning, WB/statement coverage |
| ProductDAO > changeProductQuantity > * | ProductDAO.changeProductQuantity | Unit | BB/equal partitioning, BB/boundary |
| ProductDAO > sellProduct > * | ProductDAO.sellProduct | Unit | BB/equal partitioning, WB/statement coverage |
| ProductDAO > getProducts > * | ProductDAO.getProducts | Unit | BB/equal partitioning, WB/statement coverage |
| ProductDAO > getAvailableProducts > * | ProductDAO.getAvailableProducts | Unit | BB/equal partitioning, WB/statement coverage |
| ProductDAO > deleteAllProducts > * | ProductDAO.deleteAllProducts | Unit | BB/equal partitioning, WB/statement coverage |
| ProductDAO > deleteProduct > * | ProductDAO.deleteProduct | Unit | BB/equal partitioning, WB/statement coverage |
| ProductDAO > getProductByModel > * | ProductDAO.getProductByModel | Unit | BB/equal partitioning, WB/statement coverage |
| ProductController > registerProducts > * | ProductController.registerProducts | Unit | BB/equal partitioning |
| ProductController > changeProductQuantity > * | ProductController.changeProductQuantity | Unit | BB/equal partitioning |
| ProductController > sellProduct > * | ProductController.sellProduct | Unit | BB/equal partitioning |
| ProductController > getProducts > * | ProductController.getProducts | Unit | BB/equal partitioning |
| ProductController > getAvailableProducts > * | ProductController.getAvailableProducts | Unit | BB/equal partitioning |
| ProductController > deleteProduct > * | ProductController.deleteProduct | Unit | BB/equal partitioning, WB/statement coverage |
| ProductController > deleteAllProducts > * | ProductController.deleteAllProducts | Unit | BB/equal partitioning, WB/statement coverage |
| ProductRoutes > POST / > * | POST /ezelectronics/products/ | Unit | BB/equal partitioning |
| ProductRoutes > PATCH /:model > * | PATCH /ezelectronics/products/:model | Unit | BB/equal partitioning |
| ProductRoutes > PATCH /:model/sell > * | PATCH /ezelectronics/products/:model/sell | Unit | BB/equal partitioning |
| ProductRoutes > GET / > * | GET /ezelectronics/products/ | Unit | BB/equal partitioning |
| ProductRoutes > GET /available > * | GET /ezelectronics/products/available | Unit | BB/equal partitioning |
| ProductRoutes > DELETE / > * | DELETE /ezelectronics/products/ | Unit | BB/equal partitioning |
| ProductRoutes > DELETE /:model > * | DELETE /ezelectronics/products/:model | Unit | BB/equal partitioning |
| ProductDAO + db > registerProduct > * | ProductDAO.registerProduct | Integration | BB/equal partitioning |
| ProductDAO + db > changeProductQuantity > * | ProductDAO.changeProductQuantity | Integration | BB/equal partitioning |
| ProductDAO + db > sellProduct > * | ProductDAO.sellProduct | Integration | BB/equal partitioning |
| ProductDAO + db > getProducts > * | ProductDAO.getProducts | Integration | BB/equal partitioning |
| ProductDAO + db > getAvailableProducts > * | ProductDAO.getAvailableProducts | Integration | BB/equal partitioning |
| ProductDAO + db > deleteAllProducts > * | ProductDAO.deleteAllProducts | Integration | BB/equal partitioning |
| ProductDAO + db > deleteProduct > * | ProductDAO.deleteProduct | Integration | BB/equal partitioning |
| ProductDAO + db > getProductByModel > * | ProductDAO.getProductByModel | Integration | BB/equal partitioning |
| ProductController + ProductDAO + db > registerProducts > * | ProductController.registerProducts | Integration | BB/equal partitioning |
| ProductController + ProductDAO + db > changeProductQuantity > * | ProductController.changeProductQuantity | Integration | BB/equal partitioning |
| ProductController + ProductDAO + db > sellProduct > * | ProductController.sellProduct | Integration | BB/equal partitioning |
| ProductController + ProductDAO + db > getProducts > * | ProductController.getProducts | Integration | BB/equal partitioning |
| ProductController + ProductDAO + db > getAvailableProducts > * | ProductController.getAvailableProducts | Integration | BB/equal partitioning |
| ProductController + ProductDAO + db > deleteProduct > * | ProductController.deleteProduct | Integration | BB/equal partitioning |
| ProductController + ProductDAO + db > deleteAllProducts > * | ProductController.deleteAllProducts | Integration | BB/equal partitioning |
| ProductRoutes + ProductController + ProductDAO + db > "POST /" > * | POST /ezelectronics/products/ | API | BB/equal partitioning |
| ProductRoutes + ProductController + ProductDAO + db > "PATCH /:model" > * | PATCH /ezelectronics/products/:model | API | BB/equal partitioning |
| ProductRoutes + ProductController + ProductDAO + db > "PATCH /:model/sell" > * | PATCH /ezelectronics/products/:model/sell | API | BB/equal partitioning |
| ProductRoutes + ProductController + ProductDAO + db > "GET /" > * | GET /ezelectronics/products/ | API | BB/equal partitioning |
| ProductRoutes + ProductController + ProductDAO + db > "GET /available" > * | GET /ezelectronics/products/available | API | BB/equal partitioning |
| ProductRoutes + ProductController + ProductDAO + db > "DELETE /" > * | DELETE /ezelectronics/products/ | API | BB/equal partitioning |
| ProductRoutes + ProductController + ProductDAO + db > "DELETE /:model" > * | DELETE /ezelectronics/products/:model | API | BB/equal partitioning |
| ReviewRoutes + ReviewController + ReviewDAO + db > "POST /:model" > * | POST /ezelectronics/reviews/:model | API | BB/equal partitioning |
| ReviewRoutes + ReviewController + ReviewDAO + db > "GET /:model" > * | GET /ezelectronics/reviews/:model | API | BB/equal partitioning |
| ReviewRoutes + ReviewController + ReviewDAO + db > "DELETE /:model" > * | DELETE /ezelectronics/reviews/:model | API | BB/equal partitioning |
| ReviewRoutes + ReviewController + ReviewDAO + db > "DELETE /:model/all" > * | DELETE/ezelectronics/reviews/:model/all | API | BB/equal partitioning |
| ReviewRoutes + ReviewController + ReviewDAO + db > "DELETE /" > * | DELETE /ezelectronics/reviews/ | API | BB/equal partitioning |
| POST /carts > Should return status code 200 | POST ezelectronics/carts, GET ezelectronics/carts | Integration | BB/equal partitioning |
| POST /carts > Should return status code 409 when product stock is zero | POST ezelectronics/carts | Integration | BB/equal partitioning |
| PATCH /carts > Should return status code 200 when adding one item | PATCH ezelectronics/carts, GET ezelectronics/carts/history | Integration | BB/equal partitioning |
| PATCH /carts > Should return status code 200 when adding two items | PATCH ezelectronics/carts, GET ezelectronics/carts/history | Integration | BB/equal partitioning |
| PATCH /carts > Should return status code 404 when there is no cart to be paid | PATCH ezelectronics/carts | Integration | BB/equal partitioning |
| PATCH /carts > Should return status code 409 when there is one product in the cart which its quantity is higher than the available quantity | PATCH ezelectronics/carts | Integration | BB/equal partitioning |
| DELETE /carts/products/:model > Should return status code 200 | DELETE ezelectronics/carts/products/:model | Integration | BB/equal partitioning |
| DELETE /carts/products/:model > Should return status code 404 when there is no product in the cart | DELETE ezelectronics/carts/products/:model | Integration | BB/equal partitioning |
| DELETE /carts/products/:model > Should return status code 404 when product model not found | DELETE ezelectronics/carts/products/:model | Integration | BB/equal partitioning |
| DELETE /carts/current > Should return status code 200 | DELETE ezelectronics/carts/current | Integration | BB/equal partitioning |
| GET /carts/all > Should return status code 200 | GET ezelectronics/carts/all | Integration | BB/equal partitioning |
| getCart > Should resolve | CartController.getCart | Unit | WB |
| getCart > Should fail | CartController.getCart | Unit | WB |
| getCartId > Should resolve | CartController.getCartId | Unit | WB |
| getCartId > Should fail with CartNotFoundError | CartController.getCartId | Unit | WB |
| checkoutCart > Should resolve | CartController.checkoutCart | Unit | WB |
| checkoutCart > Should fail | CartController.checkoutCart | Unit | WB |
| getCustomerCarts > Should resolve | CartController.getCustomerCarts | Unit | WB |
| getCustomerCarts > Should fail | CartController.getCustomerCarts | Unit | WB |
| clearCart > Should resolve | CartController.clearCart | Unit | WB |
| clearCart > Should fail | CartController.clearCart | Unit | WB |
| deleteAllCarts > Should resolve | CartController.deleteAllCarts | Unit | WB |
| deleteAllCarts > Should fail | CartController.deleteAllCarts | Unit | WB |
| getAllCarts > Should resolve | CartController.getAllCarts | Unit | WB |
| getAllCarts > Should fail | CartController.getAllCarts | Unit | WB |
| getCart > Should resolve with cart | CartDAO.getCart | Unit | WB |
| getUserCartId > Should resolve with cart id | CartDAO.getUserCartId | Unit | WB |
| getCartProducts > Should resolve with cart products | CartDAO.getCartProducts | Unit | WB |
| createEmptyCart > Should resolve | CartDAO.createEmptyCart | Unit | WB |
| getProductInCart > Should resolve | CartDAO.getProductInCart | Unit | WB |
| increaseProductQuantityInCart > Should resolve with null | CartDAO.increaseProductQuantityInCart | Unit | WB |
| insertProductInCart > Should resolve with true | CartDAO.insertProductInCart | Unit | WB |
| decreaseProductQuantityInCart > Should resolve with null | CartDAO.decreaseProductQuantityInCart | Unit | WB |
| removeProductFromCart > Should resolve with true | CartDAO.removeProductFromCart | Unit | WB |
| getAllCarts > Should resolve with empty array | CartDAO.getAllCarts | Unit | WB |
| deleteAllCarts > Should resolve with true | CartDAO.deleteAllCarts | Unit | WB |
| deleteAllProductsInCarts > Should resolve with true | CartDAO.deleteAllProductsInCarts | Unit | WB |
| POST /carts > Should return status code 200 | POST /carts | Unit | WB |
| POST /carts > Should return status code 401 | POST /carts | Unit | WB |
| PATCH /carts/ > Should return status code 200 | PATCH /carts/ | Unit | WB |
| PATCH /carts/ > Should return status code 503 | PATCH /carts/ | Unit | WB |
| GET /carts/history > Should return status code 200 | GET /carts/history | Unit | WB |
| GET /carts/history > Should return status code 503 | GET /carts/history | Unit | WB |
| GET /carts/history > Should return status code 401 | GET /carts/history | Unit | WB |
| GET /carts/all > Should return status code 200 | GET /carts/all | Unit | WB |
| GET /carts/all > Should return status code 503 | GET /carts/all | Unit | WB |
| GET /carts/all > Should return status code 401 | GET /carts/all | Unit | WB |
| GET /carts/ > Should return status code 200 | GET /carts/ | Unit | WB |
| GET /carts/ Should return status code 503 | GET /carts/ | Unit | WB |
| GET /carts/ Should return status code 401 | GET /carts/ | Unit | WB |
| DELETE /carts/products/:model > Should return status code 200 | DELETE /carts/products/:model | Unit | WB |
| DELETE /carts/products/:model > Should return status code 503 | DELETE /carts/products/:model | Unit | WB |
| DELETE /carts/current > Should return status code 200 | DELETE /carts/current  | Unit | WB |
| DELETE /carts/current > Should return status code 503 | DELETE /carts/current  | Unit | WB |
| DELETE /carts/ > Should return status code 200 | DELETE /carts/ | Unit | WB |
| DELETE /carts/ > Should return status code 503 | DELETE /carts/ | Unit | WB |
| DELETE /carts/ > Should return status code 401 | DELETE /carts/ | Unit | WB |
| userController > createUser > * | userController.createUser | Unit | WB/statement coverage |
| userController > getUsers > * | userController.getUsers | Unit | WB/statement coverage |
| userController > getUsersByRole > * | userController.getUsersByRole | Unit | WB/statement coverage |
| userController > getUserByUsername > * | userController.getUserByUsername | Unit | WB/statement coverage |
| userController > deleteUser > * | userController.deleteUser | Unit | WB/statement coverage |
| userController > deleteAll > * | userController.deleteAll | Unit | WB/statement coverage |
| userController > updateUserInfo > * | userController.updateUserInfo | Unit | WB/statement coverage |
| userDAO > createUser > * | userDAO.createUser | Unit | WB/statement coverage |
| userDAO > getUsers > * | userDAO.getUsers | Unit | WB/statement coverage |
| userDAO > getUsersByRole > * | userDAO.getUsersByRole | Unit | WB/statement coverage |
| userDAO > getUserByUsername > * | userDAO.getUserByUsername | Unit | WB/statement coverage |
| userDAO > deleteUser > * | userDAO.deleteUser | Unit | WB/statement coverage |
| userDAO > deleteNonAdmin > * | userDAO.deleteNonAdmin | Unit | WB/statement coverage |
| userDAO > updateInfo > * | userDAO.updateInfo | Unit | WB/statement coverage |
| userDAO > getIsUserAuthenticated > * | userDAO.getIsUserAuthenticated | Unit | WB/statement coverage |
| userRoutes > POST /users > * | POST /ezelectronics/users | Unit | WB/statement coverage |
| userRoutes > GET /users > * | GET /ezelectronics/users | Unit | WB/statement coverage |
| userRoutes > GET /users/roles/:role > * | GET /ezelectronics/users/roles/:role | Unit | WB/statement coverage |
| userRoutes > GET /users/:username > * | GET /ezelectronics/users/:username | Unit | WB/statement coverage |
| userRoutes > DELETE /users/:username > * | DELETE /ezelectronics/users/:username | Unit | WB/statement coverage |
| userRoutes > DELETE /users > * | DELETE /ezelectronics/users | Unit | WB/statement coverage |
| userRoutes > PATCH /users/:username > * | PATCH /ezelectronics/users/:username | Unit | WB/statement coverage |
| userRoutes + userController + userDAO + db > POST / > * | POST /ezelectronics/users | API | BB/equal partitioning |
| userRoutes + userController + userDAO + db > GET /users > * | GET /ezelectronics/users | API | BB/equal partitioning |
| userRoutes + userController + userDAO + db > GET /users/roles/:role > * | GET /ezelectronics/users/roles/:role | API | BB/equal partitioning |
| userRoutes + userController + userDAO + db > GET /users/:username > * | GET /ezelectronics/users/:username | API | BB/equal partitioning |
| userRoutes + userController + userDAO + db > DELETE /users/:username > * | DELETE /ezelectronics/users/:username | API | BB/equal partitioning |
| userRoutes + userController + userDAO + db > DELETE /users > * | DELETE /ezelectronics/users | API | BB/equal partitioning |
| userRoutes + userController + userDAO + db > PATCH /users/:username > * | PATCH /ezelectronics/users/:username | API | BB/equal partitioning |
