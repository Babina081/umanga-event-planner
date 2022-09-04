const express = require('express');
const {
  getAllGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
  getGalleryDetails,
  getAdminGalleries,
} = require('../controllers/galleryController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/galleries').get(getAllGalleries);
router
  .route('/admin/galleries')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminGalleries);
router
  .route('/admin/gallery/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createGallery);
router
  .route('/admin/gallery/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateGallery);
router
  .route('/gallery/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteGallery);
router.route('/gallery/:id').get(getGalleryDetails);

module.exports = router;
