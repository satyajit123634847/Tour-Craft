var express = require('express');
var router = express.Router();
var adminController = require("../controller/admin/adminController")
var auth = require("../helper/auth")
var uploadHelper = require("../helper/upload_helper")



const jwt = require('jsonwebtoken');
const User = require('../model/admin/adminUser.model');




// ------register admin --------------------//
router.post('/register', adminController.register);

// ------login --------------------------//
router.post('/login', adminController.login);

router.get('/profile', auth.auth, (req, res) => {
    res.send(req.user);
});

// -----list_admin------------------------//
router.get('/list_admin', adminController.list_admin);

// ------update_admin----------------------//
router.put('/update_admin/:id', adminController.update_admin);

// ---------delete_admin---------------------//
router.put('/delete_admin/:id', adminController.delete_admin);

// ---------list_admin_by_role--------------------------/
router.get('/list_admin_by_role/:id', adminController.list_admin_by_role);

// ------reset_password---------//
router.post('/reset_password', adminController.reset_password);








router.post("/upload-files", uploadHelper.upload_files, async (req, res) => {
    return res.json({
        status: true,
        "url": req.files
    })
})






module.exports = router;
