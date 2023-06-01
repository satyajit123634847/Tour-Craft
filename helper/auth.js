const jwt = require('jsonwebtoken');
const User = require('../model/admin/adminUser.model');
const vendorsModel = require('../model/vendor/vendorsModel');


exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secret-key');
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.json({
                status: false,
                message: "Username is not authenticate. Please login again"
            })
        }
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        return res.json({
            status: false,
            message: "Username is not authenticate. Please login again"
        })
    }
};


exports.vendor_auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secret-key');
        const vendorsModel_data = await vendorsModel.findById(decoded.userId);
        if (!vendorsModel_data) {
            return res.json({
                status: false,
                message: "Username is not authenticate. Please login again"
            })
        }
        req.user = vendorsModel_data;
        req.token = token;
        next();
    } catch (e) {
        return res.json({
            status: false,
            message: "Username is not authenticate. Please login again"
        })
    }
};
