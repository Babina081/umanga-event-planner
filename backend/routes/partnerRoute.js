const express = require('express');
const {
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner,
  getPartnerDetails,
  getAdminPartners,
} = require('../controllers/partnerController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/partners').get(getAllPartners);
router
  .route('/admin/partners')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminPartners);
router
  .route('/admin/partner/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createPartner);
router
  .route('/admin/partner/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updatePartner);
router
  .route('/admin/partner/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deletePartner);
router.route('/partner/:id').get(getPartnerDetails);

module.exports = router;
