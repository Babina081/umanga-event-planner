const express = require('express');
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

//router for  creating a new order
router.route('/order/new').post(isAuthenticatedUser, newOrder);

//router for  getting single order
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);

//router for getting my orders
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

//router for getting all the orders for admin
router
  .route('/admin/orders')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);

//router for updating order
router
  .route('/admin/order/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder);
//router for deleting order
router
  .route('/admin/order/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;
