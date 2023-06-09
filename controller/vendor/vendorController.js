
const bcrypt = require('bcryptjs');
const vendorsModel = require('../../model/vendor/vendorsModel');
const adminModel = require('../../model/admin/adminUser.model');

const firmDataModel = require('../../model/vendor/frimDataModel');

const timelineVendor = require('../../model/admin/timeline_vendor');
const jwt = require('jsonwebtoken');
const helper = require("../../helper/emailHelper")
require('dotenv').config();

const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;


const ejs = require('ejs');
const puppeteer = require('puppeteer');
const fs = require('fs');


// ---------register---------------------//
exports.register = async (req, res) => {


    console.log("here")
    const { name, email } = req.body;
    // const existingUser = await vendorsModel.findOne({ email: email, status: true });
    // if (existingUser) {
    //     return res.json({
    //         status: false,
    //         message: "Email already exists"
    //     })
    // }


    new vendorsModel({ name, email })
        .save()
        .then(async (data) => {
            await new timelineVendor({ vendor_id: data._id, type: "Registered", action_status: 0 }).save()

            // var email = email
            var cc = ""
            var subject = "Welcome to Cryolor asia pacific!"

            var url = process.env.base_url
            var html = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Welcome to Cryolor asia pacific!</title>
            </head>
            <body>
                <p>Dear ${name},</p>
                <p>Welcome to Cryolor asia pacific! We're excited to have you as part of our community. </p>
                <p>Explore our website and take advantage of the features we offer. If you have any questions or concerns, please don't hesitate to contact us at info@gmail.com.</p>
                <p>Thank you for joining us, and we look forward to seeing you around the website!</p>
                <p>Best regards,</p>
                <p>Cryolor asia pacific!</p>
            </body>
            </html>
            
                        `
            // await helper.sendmail(email, cc, subject, html)
            return res.json({
                status: true,
                data: data,
                message: "Vendor register successfully..!"
            })
        })
        .catch(err => {
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })



}

// ---------login ----------------------//
exports.login = async (req, res) => {

    const { username, password } = req.body;
    const vendorsModel_data = await vendorsModel.findOne({ username: username, status: true });
    console.log("vendorsModel_data", vendorsModel_data)
    if (!vendorsModel_data) {
        return res.json({
            status: true,
            message: "Invalid username or password",
            data: vendorsModel_data
        })
    }
    const isMatch = await bcrypt.compare(password, vendorsModel_data.password);
    if (!isMatch) {
        return res.json({
            status: false,
            message: "Invalid username or password",
            data: vendorsModel_data
        })
    }
    const token = jwt.sign({ userId: vendorsModel_data._id }, 'secret-key', { expiresIn: '1d' });

    return res.json({
        status: true,
        data: vendorsModel_data,
        message: "Vendor login successfully..!",
        token: token
    })


}



// ----------list all admin-------------//
exports.list_vendor = async (req, res) => {

    vendorsModel.find({ status: true })
        .then((data) => {
            return res.json({
                status: true,
                data: data,
                message: "Vendor list"
            })
        })
        .catch(err => {
            console.log(err)
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })

}


// -----------delete_vendor------------//
exports.delete_vendor = async (req, res) => {

    vendorsModel.findByIdAndUpdate({ _id: req.params.id }, {
        status: false
    })
        .then(async (data) => {
            await firmDataModel.findOneAndUpdate({ vendor_id: req.params.id, status: true }, {
                status: false

            })
            return res.json({
                status: true,
                data: data,
                message: "Vendor delete successfully..!"
            })
        })
        .catch(err => {
            console.log(err)
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })

}



// ---------- new_list_vendor -------------//
exports.new_list_vendor = async (req, res) => {

    vendorsModel.find({ $and: [{ status: true }, { level_status: 0 }] })
        .then((data) => {
            return res.json({
                status: true,
                data: data,
                message: "Vendor list"
            })
        })
        .catch(err => {
            console.log(err)
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })

}

// ---------list_vendor_approved--------------//
exports.list_vendor_approved = async (req, res) => {

    vendorsModel.find({ $and: [{ status: true }, { final_approval: true }] })
        .then((data) => {
            return res.json({
                status: true,
                data: data,
                message: "Vendor list"
            })
        })
        .catch(err => {
            console.log(err)
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })

}


// -------send vendor register email-------------//
exports.send_vendor_link = async (req, res) => {

    var email = req.body.email
    var cc = ""
    var subject = "Vendor Information Request"

    var url = process.env.base_url
    var html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Vendor Information Request</title>
    </head>
    <body>
        <p>Dear ${req.body.name},</p>
        <p>I hope this email finds you well. I am reaching out to request your assistance with some important information that will help us improve our business relationship.</p>
        <p>As a valued vendor for our organization, we kindly request that you take a few minutes to complete the Vendor Information Request form. This form will help us update our records and ensure that we have the most accurate information for our vendors.</p>
        <p>To access the form, please click on the link provided below:</p>
        <p><a href="${url}/vendor-register-form?id=${req.body._id}">Vendor Information Request Form</a></p>
        <p>We appreciate your prompt attention to this matter and we thank you for your continued support as a valued vendor for our organization.</p>
        <p>If you have any questions or concerns, please do not hesitate to contact us at info@gmail.com.</p>
        <p>Best regards,</p>
        <p>Cryolor asia pacific</p>
    </body>
    </html>
    `
    await helper.sendmail(email, cc, subject, html)

    await vendorsModel.findByIdAndUpdate({ _id: req.body._id }, {
        link_status: 1,
        operator_by: req.body.operator_by,
        operator_type: req.body.operator_type
    })

    await new timelineVendor({ vendor_id: req.body._id, type: "Send Registered Link.", action_status: 1, operator_by: req.body.operator_by, operator_type: req.body.operator_type }).save()

    return res.json({
        status: true,
        message: "Link send to email successfully ..!",
        data: []
    })

}



// ---------save_vendor_data------------------------//
exports.save_vendor_data = async (req, res) => {

    console.log(req.body)

    const { mode_of_payment, accounting_ref, delivery_terms, financial_supplier, type_of_item, s_name_as_per_name, supplier_type, sales_ref, micr_code, payment_terms, default_currency, gst_range, msme_no, ssi_no, gst_division, gst_commissionerate, hsn_sac, incoterms_location, name, mobile_number, email, country, p_alternate_email, p_alternate_contact, vendor_id, address, state, zip_code, address1, city, city1, gst_number, pan_card_number, bank_name, account_no, bank_address, ifsc_code, p_name, p_contact, p_email, gst_url, pan_url, noc_url, cheque_url, sale_data, contact_section_data, firm_type, p_designation } = req.body;

    const existingUser = await firmDataModel.findOne({ pan_card_number: pan_card_number, status: true });

    new firmDataModel({ mode_of_payment, accounting_ref, supplier_type, type_of_item, sales_ref, delivery_terms, financial_supplier, s_name_as_per_name, micr_code, payment_terms, hsn_sac, msme_no, ssi_no, incoterms_location, gst_range, gst_division, gst_commissionerate, default_currency, vendor_id, address, state, country, zip_code, p_alternate_email, p_alternate_contact, address1, city, city1, gst_number, pan_card_number, bank_name, account_no, bank_address, ifsc_code, p_name, p_contact, p_email, gst_url, pan_url, noc_url, cheque_url, sale_data, contact_section_data, p_designation })
        .save()
        .then(async (data) => {
            await new timelineVendor({ vendor_id: vendor_id, type: "Vendor Fill The Form.", action_status: 2 }).save()
            var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {
                level_status: 1,
                remark: "Fil Form",
                name: name,
                mobile_number: mobile_number,
                email: email,
                firm_type: firm_type
            })
            await firmDataModel.findByIdAndUpdate({ _id: data._id }, {
                for_update: false
            })


            var admin_data = await adminModel.findById({ _id: vendor_data.operator_by })
            var email = admin_data.email
            var cc = ""
            var subject = "Vendor Form Submission Notification"

            var url = process.env.base_url
            var html = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Vendor Form Submission Notification</title>
            </head>
            <body>
                <h2>Vendor Form Submission Notification</h2>
            
                <p>Dear ${admin_data.name},</p>
            
                <p>I hope this email finds you well. I wanted to inform you that we have received a vendor form submission for your review and action. Please find the details of the submission below:</p>
            
                <table>
                    <tr>
                        <th>Vendor Name:</th>
                        <td>${vendor_data.name}</td>
                    </tr>
                    <tr>
                        <th>Vendor Contact:</th>
                        <td>${vendor_data.mobile_number}</td>
                    </tr>
                    <tr>
                        <th>Vendor Email:</th>
                        <td>${vendor_data.email}</td>
                    </tr>
                </table>
            
                
            </body>
            </html>
            
            `
            await helper.sendmail(email, cc, subject, html)


            return res.json({
                status: true,
                data: data,
                message: "Vendor register successfully..!"
            })
        })
        .catch(err => {
            console.log(err)
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })



}

// ---------update_vendor_data----------------------//
exports.update_vendor_data = async (req, res) => {

    const { mode_of_payment, accounting_ref, delivery_terms, financial_supplier, type_of_item, s_name_as_per_name, supplier_type, sales_ref, micr_code, payment_terms, default_currency, gst_range, msme_no, ssi_no, gst_division, gst_commissionerate, hsn_sac, incoterms_location, name, mobile_number, email, country, p_alternate_email, p_alternate_contact, vendor_id, address, state, zip_code, address1, city, city1, gst_number, pan_card_number, bank_name, account_no, bank_address, ifsc_code, p_name, p_contact, p_email, gst_url, pan_url, noc_url, cheque_url, sale_data, contact_section_data, firm_type, p_designation } = req.body;

    firmDataModel.findByIdAndUpdate({ _id: req.params.id }, { mode_of_payment, accounting_ref, supplier_type, type_of_item, sales_ref, delivery_terms, financial_supplier, s_name_as_per_name, micr_code, payment_terms, hsn_sac, msme_no, ssi_no, incoterms_location, gst_range, gst_division, gst_commissionerate, default_currency, vendor_id, address, state, country, zip_code, p_alternate_email, p_alternate_contact, address1, city, city1, gst_number, pan_card_number, bank_name, account_no, bank_address, ifsc_code, p_name, p_contact, p_email, gst_url, pan_url, noc_url, cheque_url, sale_data, contact_section_data, p_designation })
        .then(async (data) => {
            await new timelineVendor({ vendor_id: vendor_id, type: " Update Vendor Form.", action_status: 2 }).save()
            var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {
                approve_status: 0,
                remark: "Update Form",
                name: name,
                mobile_number: mobile_number,
                email: email,
                firm_type: firm_type,
                level_status: 1
            })
            await firmDataModel.findByIdAndUpdate({ _id: data._id }, {
                for_update: false
            })


            var admin_data = await adminModel.findById({ _id: vendor_data.operator_by })
            var email = admin_data.email
            var cc = ""
            var subject = "Vendor Form Updated Notification"

            var url = process.env.base_url
            var html = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Vendor Form Updated Notification</title>
            </head>
            <body>
                <h2>Vendor Form Updated Notification</h2>
            
                <p>Dear ${admin_data.name},</p>
            
                <p>I hope this email finds you well. I wanted to inform you that we have received a vendor form Updated for your review and action. Please find the details of the Updated below:</p>
            
                <table>
                    <tr>
                        <th>Vendor Name:</th>
                        <td>${vendor_data.name}</td>
                    </tr>
                    <tr>
                        <th>Vendor Contact:</th>
                        <td>${vendor_data.mobile_number}</td>
                    </tr>
                    <tr>
                        <th>Vendor Email:</th>
                        <td>${vendor_data.email}</td>
                    </tr>
                </table>
            
                
            </body>
            </html>
            
            `
            await helper.sendmail(email, cc, subject, html)


            return res.json({
                status: true,
                data: data,
                message: "Vendor register successfully..!"
            })
        })
        .catch(err => {
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })



}

// ------------vendor_by_id--------------------//
exports.vendor_by_id = async (req, res) => {

    vendorsModel.findById({ _id: req.params.id })
        .then((data) => {
            return res.json({
                status: true,
                data: data,
                message: "Vendor list"
            })
        })
        .catch(err => {
            console.log(err)
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })

}



exports.list_vendor_by_status = async (req, res) => {

    var query = ""
    if (req.params.id == 0) {
        query = { $and: [{ status: true }, { final_approval: false }, { approve_status: req.params.id1 }] }

    } else {

        query = { $and: [{ status: true }, { level_status: req.params.id }, { final_approval: false }, { approve_status: req.params.id1 }] }

    }

    vendorsModel.find(query)
        .populate("operator_by")
        .then((data) => {
            return res.json({
                status: true,
                data: data,
                message: "Vendor list"
            })
        })
        .catch(err => {
            console.log(err)
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })

}

// ----------list_vendor_by_approve_status=======//
exports.list_vendor_by_approve_status = async (req, res) => {


    console.log(req.body)

    var query = ""
    if (req.params.id1 == 1) {
        query = { $and: [{ status: true }, { final_approval: false }, { approve_status: req.params.id }] }
    } else {
        query = { $and: [{ status: true }, { final_approval: false }, { approve_status: req.params.id }, { level_status: req.params.id1 }] }
    }
    vendorsModel.find(query)
        .then((data) => {
            return res.json({
                status: true,
                data: data,
                message: "Vendor list"
            })
        })
        .catch(err => {
            console.log(err)
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })

}


// ---------get_firm_data_by_vendor_id--------------------//
exports.get_firm_data_by_vendor_id = async (req, res) => {

    firmDataModel.find({ vendor_id: req.params.id })
        .populate("vendor_id")
        .then((data) => {
            return res.json({
                status: true,
                data: data,
                message: "Vendor list"
            })
        })
        .catch(err => {
            console.log(err)
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })

}


// --------revert_to_vendor-----------------------//
exports.revert_to_vendor = async (req, res) => {

    var { comment_revert, vendor_id, attachment_revert, operator_by, operator_type, remark, is_ban } = req.body


    if (operator_type == "IT Team") {

        var reject_data = await timelineVendor.find({ vendor_id: vendor_id, operator_type: "Finance Compliance Verification" })

        var reject_data_id = null
        if (reject_data.length > 0) {
            reject_data_id = reject_data[0].operator_by

        }
        var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {

            comment: comment_revert,
            attachment: attachment_revert,
            remark: remark,
            operator_by: reject_data_id,
            level_status: 4,
            is_revert: true
        })

        await new timelineVendor({ vendor_id: vendor_id, type: "Revert Back To Finance.", action_status: 1, operator_by: operator_by, operator_type: operator_type, comment: comment_revert, attachment: attachment_revert, remark: remark }).save()

        var admin_data = ""
        if (reject_data_id != undefined) {

            admin_data = await adminModel.findById({ _id: reject_data_id })

        }


        var email = admin_data.email
        var cc = ""
        var subject = "IT Team Rejects Vendor Form – Notification to Finance Team"

        var url = process.env.base_url
        var html = `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>IT Team Rejects Vendor Form – Notification to Finance Team</title>
        </head>
        <body>
          <h2>IT Team Rejects Vendor Form – Notification to Finance Team</h2>
        
          <p>Dear ${admin_data.name},</p>
        
          <p>I hope this email finds you well. I am writing to inform you that the IT team has rejected a vendor form submitted for approval. The details of the rejected vendor form are as follows:</p>
        
          <ul>
            <li><strong>Vendor Name:</strong> ${vendor_data.name}</li>
            <li><strong>Vendor Contact:</strong> ${vendor_data.mobile_number}</li>
            <li><strong>Reason for Rejection:</strong> ${comment_revert}</li>
          </ul>
        
          
        
          <p>Thank you for your attention to this matter.</p>
        
          <p>Best regards,</p>
        
         
        </body>
        </html>
        `
        await helper.sendmail(email, cc, subject, html)

    } else if (operator_type == "Finance Compliance Verification" && is_ban == true) {

        var reject_data = await timelineVendor.find({ vendor_id: vendor_id, operator_type: "IT Team" })

        var reject_data_id = null
        if (reject_data.length > 0) {
            reject_data_id = reject_data[0].operator_by

        }
        var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {

            comment: comment_revert,
            attachment: attachment_revert,
            remark: remark,
            operator_by: reject_data_id,
            level_status: 5,
            is_revert: true
        })

        await new timelineVendor({ vendor_id: vendor_id, type: "Revert Back To IT Team.", action_status: 1, operator_by: operator_by, operator_type: operator_type, comment: comment_revert, attachment: attachment_revert, remark: remark }).save()

        var admin_data = ""
        if (reject_data_id != undefined) {

            admin_data = await adminModel.findById({ _id: reject_data_id })

        }


        var email = admin_data.email
        var cc = ""
        var subject = "Finance Team Rejects Vendor Form – Notification to IT Team"

        var url = process.env.base_url
        var html = `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Finance TeamRejects Vendor Form – Notification to  IT Team</title>
        </head>
        <body>
          <h2>Finance Team Rejects Vendor Form – Notification to  IT Team</h2>
        
          <p>Dear ${admin_data.name},</p>
        
          <p>I hope this email finds you well. I am writing to inform you that the Finance Team has rejected a vendor form submitted for approval. The details of the rejected vendor form are as follows:</p>
        
          <ul>
            <li><strong>Vendor Name:</strong> ${vendor_data.name}</li>
            <li><strong>Vendor Contact:</strong> ${vendor_data.mobile_number}</li>
            <li><strong>Reason for Rejection:</strong> ${comment_revert}</li>
          </ul>
        
          
        
          <p>Thank you for your attention to this matter.</p>
        
          <p>Best regards,</p>
        
         
        </body>
        </html>
        `
        await helper.sendmail(email, cc, subject, html)

    } else if (operator_type == "Finance Compliance Verification") {
        var reject_data = await timelineVendor.find({ vendor_id: vendor_id, operator_type: "Initiator Login" })

        var reject_data_id = null
        if (reject_data.length > 0) {
            reject_data_id = reject_data[0].operator_by

        }
        var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {

            comment: comment_revert,
            attachment: attachment_revert,
            remark: remark,
            operator_by: reject_data_id,
            level_status: 1,
            is_revert: true
        })

        await new timelineVendor({ vendor_id: vendor_id, type: "Revert Back To Initiator Login.", action_status: 1, operator_by: operator_by, operator_type: operator_type, comment: comment_revert, attachment: attachment_revert, remark: remark }).save()

        var admin_data = ""
        if (reject_data_id != undefined) {

            admin_data = await adminModel.findById({ _id: reject_data_id })

        }


        var email = admin_data.email
        var cc = ""
        var subject = "Finance Team Rejects Vendor Form – Notification to Initiator Login"

        var url = process.env.base_url
        var html = `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Finance TeamRejects Vendor Form – Notification to  Initiator Login</title>
        </head>
        <body>
          <h2>Finance Team Rejects Vendor Form – Notification to  Initiator Login</h2>
        
          <p>Dear ${admin_data.name},</p>
        
          <p>I hope this email finds you well. I am writing to inform you that the Finance Team has rejected a vendor form submitted for approval. The details of the rejected vendor form are as follows:</p>
        
          <ul>
            <li><strong>Vendor Name:</strong> ${vendor_data.name}</li>
            <li><strong>Vendor Contact:</strong> ${vendor_data.mobile_number}</li>
            <li><strong>Reason for Rejection:</strong> ${comment_revert}</li>
          </ul>
        
          
        
          <p>Thank you for your attention to this matter.</p>
        
          <p>Best regards,</p>
        
         
        </body>
        </html>
        `
        await helper.sendmail(email, cc, subject, html)


    }
    else if (operator_type == "CFO") {

        var reject_data = await timelineVendor.find({ vendor_id: vendor_id, operator_type: "Initiator Login" })

        var reject_data_id = null
        if (reject_data.length > 0) {
            reject_data_id = reject_data[0].operator_by

        }
        var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {

            comment: comment_revert,
            attachment: attachment_revert,
            remark: remark,
            operator_by: reject_data_id,
            level_status: 1,
            is_revert: true
        })

        await new timelineVendor({ vendor_id: vendor_id, type: "Revert Back To Initiator Form CFO.", action_status: 1, operator_by: operator_by, operator_type: operator_type, comment: comment_revert, attachment: attachment_revert, remark: remark }).save()

        var admin_data = ""
        if (reject_data_id != undefined) {

            admin_data = await adminModel.findById({ _id: reject_data_id })

        }


        var email = admin_data.email
        var cc = ""
        var subject = "CFO Rejects Vendor Form – Notification to Initiator"

        var url = process.env.base_url
        var html = `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>CFO Rejects Vendor Form – Notification to  Initiator</title>
        </head>
        <body>
          <h2>CFO Rejects Vendor Form – Notification to  Initiator</h2>
        
          <p>Dear ${admin_data.name},</p>
        
          <p>I hope this email finds you well. I am writing to inform you that the CFO has rejected a vendor form submitted for approval. The details of the rejected vendor form are as follows:</p>
        
          <ul>
            <li><strong>Vendor Name:</strong> ${vendor_data.name}</li>
            <li><strong>Vendor Contact:</strong> ${vendor_data.mobile_number}</li>
            <li><strong>Reason for Rejection:</strong> ${comment_revert}</li>
          </ul>
        
          
        
          <p>Thank you for your attention to this matter.</p>
        
          <p>Best regards,</p>
        
         
        </body>
        </html>
        `
        await helper.sendmail(email, cc, subject, html)

    }
    else {

        var reject_data = await timelineVendor.find({ vendor_id: vendor_id, operator_type: "Initiator Login" })

        var reject_data_id = null
        if (reject_data.length > 0) {
            reject_data_id = reject_data[0].operator_by

        }
        var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {
            approve_status: 1,
            comment: comment_revert,
            attachment: attachment_revert,
            remark: remark,
            operator_by: reject_data_id, is_revert: true
        })

        await new timelineVendor({ vendor_id: vendor_id, type: "Revert Back.", action_status: 1, operator_by: operator_by, operator_type: operator_type, comment: comment_revert, attachment: attachment_revert, remark: remark }).save()
        await firmDataModel.findOneAndUpdate({ vendor_id: vendor_id }, {
            for_update: true
        })




        // var attachment_text = ""
        // if(attachment_revert.length > 0){
        //     attachment_text = "Please check the below attachment for understanding. "
        // }

        var email = vendor_data.email
        var cc = ""
        var subject = "Correction Required - Vendor Form Submission"

        var url = process.env.base_url
        var html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Correction Required - Vendor Form Submission</title>
    </head>
    <body>
        <h2>Correction Required - Vendor Form Submission</h2>
    
        <p>Dear ${vendor_data.name},</p>
    
        <p>We hope this email finds you well. We recently received your vendor form submission; however, we noticed that there is a mismatch, missing, or incorrect information in the form. We kindly request your assistance in rectifying the following details:</p>
    
        <p><strong>${comment_revert}</strong></p>

        <p>To access the form, please click on the link provided below:</p>
        <p><a href="${url}/vendor-register-form?id=${vendor_id}">Vendor Information Request Form</a></p>

        
    
        <p>To ensure that our records are accurate and up to date, we kindly request you to provide the correct information or complete the missing fields as soon as possible. This will help us expedite the vendor evaluation process and avoid any delays in potential collaborations.</p>
    
        <p>If you have any questions or need further clarification regarding the correction process, please feel free to reach out to our vendor management team at info@gmail.com. They will be happy to assist you.</p>
    
        <p>We apologize for any inconvenience this may cause and appreciate your prompt attention to this matter. Thank you for your cooperation.</p>
    
        <p>Best regards,</p>
       
    
    </body>
    </html>
    
    </html>
    
    `
        await helper.sendmail(email, cc, subject, html)


    }




    return res.json({
        status: true,
        message: "Request Submitted Successfully...!"
    })




}

// --------resend_revert_to_vendor-----------------------//
exports.resend_revert_to_vendor = async (req, res) => {

    var { vendor_id, operator_by, operator_type, email, name, attachment, comment, } = req.body


    await new timelineVendor({ vendor_id: vendor_id, type: "Resend Revert Back.", action_status: 1, operator_by: operator_by, operator_type: operator_type }).save()







    // var attachment_text = ""
    // if(attachment_revert.length > 0){
    //     attachment_text = "Please check the below attachment for understanding. "
    // }

    var email = email
    var cc = ""
    var subject = "Correction Required - Vendor Form Submission"

    var url = process.env.base_url
    var html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Correction Required - Vendor Form Submission</title>
    </head>
    <body>
        <h2>Correction Required - Vendor Form Submission</h2>
    
        <p>Dear ${name},</p>
    
        <p>We hope this email finds you well. We recently received your vendor form submission; however, we noticed that there is a mismatch, missing, or incorrect information in the form. We kindly request your assistance in rectifying the following details:</p>
    
        <p><strong>${comment}</strong></p>

        <p>To access the form, please click on the link provided below:</p>
        <p><a href="${url}/vendor-register-form?id=${vendor_id}">Vendor Information Request Form</a></p>

        
    
        <p>To ensure that our records are accurate and up to date, we kindly request you to provide the correct information or complete the missing fields as soon as possible. This will help us expedite the vendor evaluation process and avoid any delays in potential collaborations.</p>
    
        <p>If you have any questions or need further clarification regarding the correction process, please feel free to reach out to our vendor management team at info@gmail.com. They will be happy to assist you.</p>
    
        <p>We apologize for any inconvenience this may cause and appreciate your prompt attention to this matter. Thank you for your cooperation.</p>
    
        <p>Best regards,</p>
       
    
    </body>
    </html>
    
    </html>
    
    `
    await helper.sendmail(email, cc, subject, html)


    return res.json({
        status: true,
        message: "Request Submitted Successfully...!"
    })




}


// --------forward_to_admin-----------------------//
exports.forward_to_admin = async (req, res) => {

    var { comment_forword, vendor_id, attachment_forword, operator_by, operator_type, forwarded_to, remark, ban_number_input, is_final } = req.body
    var level_status = 0



    var final = false

    if (is_final == true) {
        final = true
    }


    console.log(req.body)

    var admin_data = await adminModel.findById({ _id: forwarded_to })

    if (admin_data.user_status == "Initiator Login") {
        level_status = 1
    }

    else if (admin_data.user_status == "SCM Head") {
        level_status = 2
    } else if (admin_data.user_status == "Finance Compliance Verification") {
        level_status = 3
    } else if (admin_data.user_status == "IT Team") {
        level_status = 4
    } else if (admin_data.user_status == "CFO") {
        level_status = 5

    }

    if (operator_type == "IT Team") {

        var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {
            level_status: level_status,
            comment: comment_forword,
            attachment: attachment_forword,
            operator_by: forwarded_to,
            is_ban: true,
            remark: remark,
            ban_number_input: ban_number_input,
            final_approval: final,
            download_attachment: attachment_forword[0]
        })




    } if (operator_type == "CFO") {
        var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {
            level_status: level_status,
            comment: comment_forword,
            attachment: attachment_forword,
            operator_by: forwarded_to,
            remark: remark,
            is_cfo: true,
            final_approval: final,
            download_attachment: attachment_forword[0]
        })






    }
    else {
        var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {
            level_status: level_status,
            comment: comment_forword,
            attachment: attachment_forword,
            operator_by: forwarded_to,
            remark: remark,
            final_approval: final,
            download_attachment: attachment_forword[0]
        })

    }




    await new timelineVendor({ vendor_id: vendor_id, type: "Forwarded To.", action_status: 1, operator_by: operator_by, operator_type: operator_type, comment: comment_forword, attachment: attachment_forword, forwarded_to: forwarded_to, remark: remark }).save()



    var forwarded_form = await adminModel.findById({ _id: operator_by })


    // var attachment_text = ""
    // if(attachment_revert.length > 0){
    //     attachment_text = "Please check the below attachment for understanding. "
    // }

    var email = admin_data.email
    var cc = ""
    var subject = `Vendor Approval Request - ${vendor_data.name}`

    var url = process.env.base_url
    var html = `<!DOCTYPE html>
    <html>
    <head>
        <title>Vendor Approval Request - ${vendor_data.name}</title>
    </head>
    <body>
        <p>Dear ${admin_data.name},</p>
    
        <p>I hope this email finds you well. I am writing to bring to your attention a vendor approval request that requires your attention and authorization. The following details are provided for your review:</p>
    
        <p><strong>Vendor Name:</strong> ${vendor_data.name}<br>
        <strong>Vendor Contact:</strong> ${vendor_data.mobile_number}<br>
        <strong>Vendor Email:</strong> ${vendor_data.email}</p>
    
       
    
        <p>Please review the vendor's information and the provided request details. If you approve this vendor for engagement, kindly proceed with the necessary steps to complete the vendor onboarding process. If there are any concerns or additional requirements, please let me know, and I will relay the message to the vendor accordingly.</p>
    
        <p>Your prompt attention to this matter is greatly appreciated, as it will allow us to proceed with the necessary arrangements in a timely manner. Should you have any questions or require further information, please don't hesitate to reach out to me.</p>
    
        <p>Thank you for your cooperation.</p>
    
        <p>Best regards,<br>
        ${forwarded_form.name}<br>
        ${forwarded_form.user_status}<br>
        ${forwarded_form.email}</p>

    </body>
    </html>
    
    `
    await helper.sendmail(email, cc, subject, html)


    return res.json({
        status: true,
        message: "Request Submitted Successfully...!"
    })




}

// --------get_timeline_data_by_vendor_id---------------//

exports.get_timeline_data_by_vendor_id = async (req, res) => {

    timelineVendor.find({ vendor_id: req.params.id })
        .populate("vendor_id")
        .populate("operator_by")
        .populate("forwarded_to")

        .then((data) => {
            return res.json({
                status: true,
                data: data,
                message: "Vendor list"
            })
        })
        .catch(err => {
            console.log(err)
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })

}


// ---------list_all_approval_by_id------------------------//
exports.list_all_approval_by_id = async (req, res) => {

    timelineVendor.find({ vendor_id: req.params.id, action_status: 1 })
        .populate("vendor_id")
        .populate("operator_by")
        .populate("forwarded_to")

        .then(data => {
            return res.json({
                status: true,
                message: "data list",
                data: data
            })
        })
        .catch(err => {
            return res.json({
                status: false,
                data: err,
                message: "Somethings went wrong...!"
            })
        })
}



exports.verify_pan = async (req, res) => {

    const existingUser = await firmDataModel.findOne({ pan_card_number: req.params.id, status: true });
    if (existingUser) {
        return res.json({
            status: false,
            message: "Pan number already exists..!"
        })
    } else {
        return res.json({
            status: true,
            message: "Pan verify successfully..!"
        })

    }



}


exports.download_pdf = async (req, res) => {


    var firm_data = await firmDataModel.findOne({ vendor_id: req.params.id, status: true }).populate("vendor_id");
    firm_data.base_url = process.env.base_url

    try {
        // Retrieve dynamic data from the database or generate it dynamically
        var userData = firm_data

        console.log("userData", userData)

        // res.render('admin/pdf.ejs', { userData });
        // return
        // Render the template with dynamic data
        const templatePath = 'views/admin/pdf.ejs';
        ejs.renderFile(templatePath, { userData }, async (err, renderedHtml) => {
            if (err) {
                console.error('Error rendering template:', err);
                res.status(500).send('Error rendering template');
                return;
            }

            // Generate PDF from the rendered HTML
            const pdfBuffer = await generatePDF(renderedHtml);

            // Set response headers for file download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${userData.vendor_id.name}.pdf`);

            // Send the PDF buffer as the response
            res.send(pdfBuffer);
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }


}


async function generatePDF(htmlData) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(htmlData);

    // Set CSS styles for PDF pages
    await page.addStyleTag({
        content: `
        @page {
          margin-top: 2cm; /* Adjust the margin value as per your requirement */
          margin-bottom: 2cm; /* Adjust the margin value as per your requirement */
        }
      `,
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Close the browser
    await browser.close();

    return pdfBuffer;
}




exports.get_count = async (req, res) => {

    var total = await vendorsModel.find({ status: true }).countDocuments()

    var pending_total = await vendorsModel.find({ final_approval: false, status: true }).countDocuments()
    var approval_total = await vendorsModel.find({ final_approval: true, status: true }).countDocuments()
    var revert_total = await vendorsModel.find({ is_revert: true, status: true }).countDocuments()

    var new_total = await vendorsModel.find({ status: true, level_status: 0 }).countDocuments()

    return res.json({
        status: true,
        total: total,
        pending_total: pending_total,
        approval_total: approval_total,
        revert_total: revert_total,
        new_total: new_total


    })







}


exports.download_pdf_it = async (req, res) => {


    var firm_data = await firmDataModel.findOne({ vendor_id: req.params.id, status: true }).populate("vendor_id");
    firm_data.base_url = process.env.base_url

    try {
        // Retrieve dynamic data from the database or generate it dynamically
        var userData = firm_data

        console.log("userData", userData)

        // res.render('admin/pdf.ejs', { userData });
        // return
        // Render the template with dynamic data
        const templatePath = 'views/admin/pdf_it.ejs';
        ejs.renderFile(templatePath, { userData }, async (err, renderedHtml) => {
            if (err) {
                console.error('Error rendering template:', err);
                res.status(500).send('Error rendering template');
                return;
            }

            // Generate PDF from the rendered HTML
            const pdfBuffer = await generatePDF(renderedHtml);

            // Set response headers for file download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${userData.vendor_id.name}.pdf`);

            // Send the PDF buffer as the response
            res.send(pdfBuffer);
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }


}


