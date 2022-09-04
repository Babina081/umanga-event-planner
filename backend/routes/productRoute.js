//importing express
const express = require('express');

//importing functions from productController to modify the product database
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAdminProducts,

  createProductReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/productController');

//importing authentication function for authenticating the user who is logged in
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

//using router from express function
const router = express.Router();

// making routes

//checking for the authentication and role authorization
/*
router
.route('/products')
.get(isAuthenticatedUser, authorizeRoles('admin'), getAllProducts);
*/

//pulling getAllProducts from productController(get)
router.route('/products').get(getAllProducts);

//router for getting products in admin page
router
  .route('/admin/products')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);

//router to create new Product(post)
router
  .route('/admin/product/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);

//router to update product(put)
router
  .route('/admin/product/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct);

//router to delete product(delete)
router
  .route('/admin/product/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

//router to get product details(get)
router.route('/product/:id').get(getProductDetails);

//router to update and create
router.route('/review').put(isAuthenticatedUser, createProductReview);

//router used for getting all reviews of a single product
router.route('/reviews').get(getProductReviews);

//router used for deleting review
router.route('/reviews').delete(isAuthenticatedUser, deleteReview);

//exporting router
module.exports = router;
