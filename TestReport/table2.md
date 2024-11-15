<table>
	<thead>
		<tr>
			<th>Functional Requirement or scenario</th>
			<th>Test(s)</th>
		</tr>
	</thead>
	<tbody style='font-family:"Courier New"'>
		<tr>
			<td>FR1.1 Login</td>
			<td>-</td>
		</tr>
		<tr>
			<td>FR1.2 Logout</td>
			<td>-</td>
		</tr>
		<tr>
			<td>FR1.3 Create a new user account</td>
			<td>
				<ul>
					<li>userController > createUser > *</li>
					<li>userDAO > createUser > *</li>
					<li>userRoutes > POST /users > *</li>
					<li>userRoutes + userController + userDAO + db > POST /users > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR2.1 Show the list of all users</td>
			<td>
				<ul>
					<li>userController > getUsers > *</li>
					<li>userDAO > getUsers > *</li>
					<li>userRoutes >  GET /users > *</li>
					<li>userRoutes + userController + userDAO + db > GET /ezelectronics/users > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR2.2 Show the list of all users with a specific role</td>
			<td>
				<ul>
					<li>userController > getUsersByRole > *</li>
					<li>userDAO > getUsersByRole > *</li>
					<li>userRoutes > GET /users/roles/:role > *</li>
					<li>userRoutes + userController + userDAO + db > GET /ezelectronics/users/roles/:role > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR2.3 Show the information of a single user</td>
			<td>
				<ul>
					<li>userController > getUserByUsername > *</li>
					<li>userDAO > getUserByUsername > *</li>
					<li>userRoutes > GET /users/:username > *</li>
					<li>userRoutes + userController + userDAO + db > GET /ezelectronics/users/:username > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR2.4 Update the information of a single user</td>
			<td>
				<ul>
					<li>userController > updateUserInfo > *</li>
					<li>userDAO > updateInfo > *</li>
					<li>userRoutes > PATCH /users/:username > *</li>
					<li>userRoutes + userController + userDAO + db > PATCH /ezelectronics/users/:username > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR2.5 Delete a single non Admin user</td>
			<td>
				<ul>
					<li>userController > deleteUser > *</li>
					<li>userDAO > deleteUser > *</li>
					<li>userRoutes > DELETE /users/:username > *</li>
					<li>userRoutes + userController + userDAO + db > DELETE /ezelectronics/users/:username > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR2.6 Delete all non Admin users</td>
			<td>
				<ul>
					<li>userController > deleteAll > *</li>
					<li>userDAO > deleteNonAdmin > *</li>
					<li>userRoutes > DELETE /users > *</li>
					<li>userRoutes + userController + userDAO + db > DELETE /ezelectronics/users > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.1 Register a set of new products</td>
			<td>
				<ul>
					<li>ProductDAO > registerProduct > *</li>
					<li>ProductController > registerProducts > *</li>
					<li>ProductRoutes > POST / > *</li>
					<li>ProductDAO + db > registerProduct > *</li>
					<li>ProductController + ProductDAO + db > registerProducts > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "POST /" > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.2 Update the quantity of a product</td>
			<td>
				<ul>
					<li>ProductDAO > changeProductQuantity > *</li>
					<li>ProductController > changeProductQuantity > *</li>
					<li>ProductRoutes > PATCH /:model > *</li>
					<li>ProductDAO + db > changeProductQuantity > *</li>
					<li>ProductController + ProductDAO + db > changeProductQuantity > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "PATCH /:model" > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.3 Sell a product</td>
			<td>
				<ul>
					<li>ProductDAO > sellProduct > *</li>
					<li>ProductController > sellProduct > *</li>
					<li>ProductRoutes > PATCH /:model/sell > *</li>
					<li>ProductDAO + db > sellProduct > *</li>
					<li>ProductController + ProductDAO + db > sellProduct > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "PATCH /:model/sell" > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.4 Show the list of all products</td>
			<td>
				<ul>
					<li>ProductDAO > getProducts > Successfully get all available products</li>
					<li>ProductController > getProducts > No filtering > *</li>
					<li>ProductRoutes > GET / > *</li>
					<li>ProductDAO + db >  getProducts > *</li>
					<li>ProductController + ProductDAO + db > getProducts > No filtering > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "GET /" > Authentication > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "GET /" > No specific grouping > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "GET /" > Additional constraints > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.4.1 Show the list of all available products</td>
			<td>
				<ul>
					<li>ProductDAO > getAvailableProducts > Successfully get all available products</li>
					<li>ProductController > getAvailableProducts > No filtering > *</li>
					<li>ProductRoutes > GET /available > *</li>
					<li>ProductDAO + db > getAvailableProducts > *</li>
					<li>ProductController + ProductDAO + db > getAvailableProducts > No filtering > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "GET /available" > Authentication > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "GET /available" > No specific grouping > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "GET /available" > Additional constraints > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.5 Show the list of all products with the same category</td>
			<td>
				<ul>
					<li>ProductDAO > getProducts > Successfully filter by category</li>
					<li>ProductController > getProducts > Filter by category > *</li>
					<li>ProductController + ProductDAO + db > getProducts > Filter by category > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "GET /" > Grouping by category > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.5.1 Show the list of all available products with the same category</td>
			<td>
				<ul>
					<li>ProductDAO > getAvailableProducts > Successfully filter by category</li>
					<li>ProductController > getAvailableProducts > Filter by category > *</li>
					<li>ProductController + ProductDAO + db > getAvailableProducts > Filter by category > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "GET /available" > Grouping by category > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.5 Show the list of all products with the same model</td>
			<td>
				<ul>
					<li>ProductDAO > getProducts > Successfully filter by model</li>
					<li>ProductController > getProducts > Filter by model > *</li>
					<li>ProductController + ProductDAO + db > getProducts > Filter by model > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "GET /" > Grouping by model > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.5.1 Show the list of all available products with the same model</td>
			<td>
				<ul>
					<li>ProductDAO > getAvailableProducts > Successfully filter by model</li>
					<li>ProductController > getAvailableProducts > Filter by model > *</li>
					<li>ProductController + ProductDAO + db > getAvailableProducts > Filter by model > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "GET /available" > Grouping by model > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.7 Delete a product</td>
			<td>
				<ul>
					<li>ProductDAO > deleteProduct > *</li>
					<li>ProductController > deleteProduct > *</li>
					<li>ProductRoutes > DELETE /:model > *</li>
					<li>ProductDAO + db > deleteProduct > *</li>
					<li>ProductController + ProductDAO + db > deleteProduct > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "DELETE /:model" > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR3.8 Delete all products</td>
			<td>
				<ul>
					<li>ProductDAO > deleteAllProducts > *</li>
					<li>ProductController > deleteAllProducts > *</li>
					<li>ProductRoutes > DELETE / > *</li>
					<li>ProductDAO + db > deleteAllProducts > *</li>
					<li>ProductController + ProductDAO + db > deleteAllProducts > *</li>
					<li>ProductRoutes + ProductController + ProductDAO + db > "DELETE /" > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR4.1 Add a new review to a product</td>
			<td>
				<ul>
					<li>ReviewController > Correctly add a new Review</li>
					<li>ReviewController > Invalid review score</li>
					<li>ReviewRouter >POST/:model> add a new review</li>
					<li>ReviewDAO>Correctly add a new Review</li>
					<li>ReviewDAO>userHasReview</li>
					<li>ReviewRoutes + ReviewController + ReviewDAO + db > "POST /:model" > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR4.2 Get the list of all reviews assigned to a product</td>
			<td>
				<ul>
					<li>ReviewController > returns all reviews for a product</li>
					<li>ReviewRouter >GET/:model> retrieving all reviews of a product</li>
					<li>ReviewDAO>get allreviews</li>
					<li>ReviewRoutes + ReviewController + ReviewDAO + db > "GET /:model" > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR4.3 Delete a review given to a product</td>
			<td>
				<ul>
					<li>ReviewController > deletes the review</li>
					<li>ReviewRouter >DELETE/:model >deleting the review made by a user for one product</li>
					<li>ReviewDAO>Correctly deleteUser Review</li>
					<li>ReviewRoutes + ReviewController + ReviewDAO + db > "DELETE /:model" > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR4.4 Delete all reviews of a product</td>
			<td>
				<ul>
					<li>ReviewController > deletes the review of product</li>
					<li>ReviewRouter > DELETE/:model/all>deleting all reviews of a product</li>
					<li>ReviewDAO>Correctly  deleteModelReviews</li>
					<li>ReviewRoutes + ReviewController + ReviewDAO + db > "DELETE /:model/all" > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR4.5 Delete all reviews of all products</td>
			<td>
				<ul>
					<li>ReviewController > deletes the review of all products                                                                               </li>
					<li>ReviewRouter > DELETE/>deleting all reviews of all products</li>
					<li>ReviewDAO>Correctly deleteAllReviews</li>
					<li>ReviewRoutes + ReviewController + ReviewDAO + db > "DELETE /" > *</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR5.1 Show the information of the current cart</td>
			<td>
				<ul>
					<li>routes_tests > GET /carts/</li>
					<li>controller_tests > getCart </li>
					<li>dao tests > getCart</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR5.2 Add a product to the current cart</td>
			<td>
				<ul>
					<li>routes_tests > POST /carts</li>
					<li>controller_tests > addToCart </li>
					<li>dao tests > getProductInCart </li>
					<li>dao tests > insertProductInCart</li>
					<li>dao tests > increaseProductQuantityInCart</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR5.3 Checkout the current cart</td>
			<td>
				<ul>
					<li>routes_tests > PATCH /carts/</li>
					<li>controller_tests > checkoutCart </li>
					<li>dao tests > checkoutCart</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR5.4 Show the history of the paid carts</td>
			<td>
				<ul>
					<li>routes_tests > GET /carts/history </li>
					<li>controller_tests > getCustomerCarts</li>
					<li>dao tests > getUserAllPaidCarts</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR5.5 Remove a product from the current cart</td>
			<td>
				<ul>
					<li>routes_tests > DELETE /carts/products/:model  </li>
					<li>controller_tests > removeProductFromCart</li>
					<li>dao tests > getProductInCart</li>
					<li>dao tests > removeProductFromCart</li>
					<li>dao tests > decreaseProductQuantityInCart</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR5.6 Delete the current cart</td>
			<td>
				<ul>
					<li>routes_tests > DELETE /carts/current</li>
					<li>controller_tests > clearCart</li>
					<li>dao tests > removeProductFromCart</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR5.7 See the list of all carts of all users</td>
			<td>
				<ul>
					<li>routes_tests > GET /carts/all</li>
					<li>controller_tests > getAllCarts</li>
					<li>dao tests > getAllCarts</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>FR5.8 Delete all carts</td>
			<td>
				<ul>
					<li>routes_tests > DELETE /carts/</li>
					<li>controller_tests > deleteAllCarts</li>
					<li>dao tests > deleteAllCarts</li>
				</ul>
			</td>
		</tr>
	</tbody>
