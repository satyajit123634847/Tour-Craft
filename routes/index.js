var express = require('express');
var router = express.Router();

const firmDataModel = require('../model/vendor/frimDataModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', base_url: process.env.base_url });
});

// ------login----------------------//
router.get('/login', function(req, res, next) {
  res.render('admin/login', { title: 'Login', base_url: process.env.base_url });
});

// -----dashboard--------------------//
router.get('/dashboard', function(req, res, next) {
  res.render('admin/dashboard', { title: 'Dashboard', base_url: process.env.base_url });
});

// ---------vendor--------------------//
router.get('/vendor', function(req, res, next) {
  res.render('admin/vendor', { title: 'Vendor', base_url: process.env.base_url });
});

// ----------addAssistance.ejs-------------------//
router.get('/add-assistance', function(req, res, next) {
  res.render('admin/addAssistance', { title: 'Add-Assistance', base_url: process.env.base_url });
});


// ----------addAssistance.ejs-------------------//
router.get('/new-vendor', function(req, res, next) {
  res.render('admin/new_vendor', { title: 'New-Vendor', base_url: process.env.base_url });
});


// --------vendorRegister----------------------------//
router.get('/existing-vendor', function(req, res, next) {
  res.render('admin/existing_vendor', { title: 'Pending-Vendor', base_url: process.env.base_url });
});

// -------revert_vendors.ejs-----------------//
router.get('/revert-vendor', function(req, res, next) {
  res.render('admin/revert_vendors', { title: 'Revert-Vendors', base_url: process.env.base_url });
});

// ------------approvalVendors.ejs------------------//
router.get('/approval-vendors', function(req, res, next) {
  res.render('admin/approvalVendors', { title: 'Approval-Vendors', base_url: process.env.base_url });
});

// -----cfo_approval.ejs------------//

router.get('/cfo-approval-vendors', function(req, res, next) {
  res.render('admin/cfo_approval', { title: 'CFO-Approval-Vendors', base_url: process.env.base_url });
});





router.get('/pdf', async function(req, res, next) {
  var userData = await firmDataModel.findOne({ vendor_id: "6491d5ee3b04aea660bcee9e", status: true }).populate("vendor_id");
  userData.base_url = process.env.base_url

  console.log(userData)
  res.render('admin/pdf_it.ejs', { title: 'Approval-Vendors', base_url: process.env.base_url, userData:userData });
});








// -----------------------------vendor pages----------------------------------------------------------------//


// -------vendor_register---------------------//
router.get('/vendor-register', function(req, res, next) {
  res.render('vendor/vendor_register', { title: 'Vendor-Register', base_url: process.env.base_url });
});

// ------vendor_login.ejs-------------------------//
router.get('/vendor-login', function(req, res, next) {
  res.render('vendor/vendor_login', { title: 'Vendor-Login', base_url: process.env.base_url });
});


// --------vendorRegister----------------------------//
router.get('/vendor-register-form', function(req, res, next) {
  res.render('vendor/vendorRegister', { title: 'Vendor-Register-Form', base_url: process.env.base_url });
});




module.exports = router;
