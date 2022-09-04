//importing express
const express = require('express');

const {
  createService,
  getAllServices,
  updateService,
  deleteService,
  getServiceDetails,
  getAdminServices,
} = require('../controllers/serviceController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

//pulling getAllservices from serviceController(get)
router.route('/services').get(getAllServices);

//router for getting products in admin page
router
  .route('/admin/services')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminServices);

//router to create new service(post)
router
  .route('/admin/service/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createService);

//router to update service(put)
router
  .route('/admin/service/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateService);

//router to delete service(delete)
router
  .route('/admin/service/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteService);

//router to get service details(get)
router.route('/service/:id').get(getServiceDetails);

//exporting router
module.exports = router;
