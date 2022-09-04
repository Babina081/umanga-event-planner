const express = require('express');

const {
  createDecoration,
  deleteDecoration,
  getAdminDecorations,
  getAllDecorations,
  getDecorationDetails,
  updateDecoration,
} = require('../controllers/decorationController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/decorations').get(getAllDecorations);
router
  .route('/admin/decorations')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminDecorations);

router
  .route('/admin/decoration/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createDecoration);

router
  .route('/admin/decoration/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateDecoration);

router
  .route('/admin/decoration/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteDecoration);

router
  .route('/decoration/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getDecorationDetails);

module.exports = router;
