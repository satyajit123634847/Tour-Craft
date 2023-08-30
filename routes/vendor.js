var express = require('express');
var router = express.Router();
var vendorController = require("../controller/vendor/vendorController")
var auth = require("../helper/auth")



// ------register admin --------------------//
router.post('/register', vendorController.register);

// ------login --------------------------//
router.post('/login', vendorController.login);

router.get('/profile', auth.vendor_auth, (req, res) => {
    res.send(req.user);
});


// ---------list_vendor-----------------//
router.get('/list_vendor', vendorController.list_vendor);

// -------delete_vendor------------------//
router.put('/delete_vendor/:id', vendorController.delete_vendor);

// ---------new_list_vendor----------------------//
router.get('/new_list_vendor', vendorController.new_list_vendor);

// --------send_vendor_link-----------------------//
router.post('/send_vendor_link', vendorController.send_vendor_link);

// ---------save_vendor_data-----------------------//
router.post('/save_vendor_data', vendorController.save_vendor_data);

// ------------update_vendor_data--------------------
router.put('/update_vendor_data/:id', vendorController.update_vendor_data);

// --------------vendor_by_id-------------------------//
router.get('/vendor_by_id/:id', vendorController.vendor_by_id);

// -------list_vendor_by_status------------------------//
router.get('/list_vendor_by_status/:id/:id1', vendorController.list_vendor_by_status);

// --------list_vendor_by_approve_status---------------------//
router.get('/list_vendor_by_approve_status/:id/:id1', vendorController.list_vendor_by_approve_status);


// -------get_firm_data_by_vendor_id----------------------//
router.get('/get_firm_data_by_vendor_id/:id', vendorController.get_firm_data_by_vendor_id);

// -------revert_to_vendor-------------------------------//
router.post('/revert_to_vendor', vendorController.revert_to_vendor);

// --------forward_to_admin-------------------------//
router.post('/forward_to_admin', vendorController.forward_to_admin);

// ------------get_timeline_data_by_vendor_id-------------//
router.get('/get_timeline_data_by_vendor_id/:id', vendorController.get_timeline_data_by_vendor_id);

// ------resend_revert_to_vendor------------------------//
router.post('/resend_revert_to_vendor', vendorController.resend_revert_to_vendor);

// --------list_vendor_approved-----------------------------//
router.get('/list_vendor_approved', vendorController.list_vendor_approved);

// ------list_vendor_approved_by_cfo---------------------//
router.get('/list_vendor_approved_by_cfo', vendorController.list_vendor_approved_by_cfo);


// ------list_all_approval_by_id-------------------------//
router.get('/list_all_approval_by_id/:id', vendorController.list_all_approval_by_id);

// ----------------verify_pan-----------------------------//
router.get('/verify_pan/:id', vendorController.verify_pan);

// ----------verify_gst------------------------------//
router.get('/verify_gst/:id', vendorController.verify_gst);


// ---------downloaded_pdf-------------------------//
router.get('/download_pdf/:id', vendorController.download_pdf);

// ----------get_count------------------------------//
router.get('/get_count', vendorController.get_count);

// ----------download_pdf_it----------------//
router.get('/download_pdf_it/:id', vendorController.download_pdf_it);

// ------------download_pdf_it_csv---------------//
router.get('/download_pdf_it_csv/:id', vendorController.download_pdf_it_csv);

// ------------download_pdf_test-----------------//
router.get('/download_pdf_test', vendorController.download_pdf_test);

// ----------get_sign_section-------------------------//
router.get('/get_sign_section/:id', vendorController.get_sign_section);


// --------------test_api-----------------
router.get('/test_api/:id', vendorController.test_api);

// --------download_pdf_it_data---------//
router.get('/download_pdf_it_data/:id', vendorController.download_pdf_it_data);

// ----------save_data_baan----------//
router.post('/save_data_baan', vendorController.save_data_baan);
























module.exports = router;
