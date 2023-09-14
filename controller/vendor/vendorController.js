
const bcrypt = require('bcryptjs');
const vendorsModel = require('../../model/vendor/vendorsModel');
const adminModel = require('../../model/admin/adminUser.model');

const firmDataModel = require('../../model/vendor/frimDataModel');
const sign_master = require('../../model/vendor/signeModel');


const timelineVendor = require('../../model/admin/timeline_vendor');
const jwt = require('jsonwebtoken');
const helper = require("../../helper/emailHelper")
require('dotenv').config();
const { createObjectCsvWriter } = require('csv-writer');

const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;


const ejs = require('ejs');
// const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');



// ---------register---------------------//
exports.register = async (req, res) => {


    console.log("here")
    const { name, email, code_of_conduct, it_deceleration } = req.body;
    // const existingUser = await vendorsModel.findOne({ email: email, status: true });
    // if (existingUser) {
    //     return res.json({
    //         status: false,
    //         message: "Email already exists"
    //     })
    // }


    new vendorsModel({ name, email, code_of_conduct, it_deceleration })
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

// ---------list_vendor_approved--------------//
exports.list_vendor_approved_by_cfo = async (req, res) => {

    vendorsModel.find({ $and: [{ status: true }, { is_cfo: true }, { final_approval: false }] })
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

    console.log(req.body)

    console.log("s...")

    var initiator_data = await adminModel.findById({ _id: req.body.operator_by })
    var form = initiator_data.email
    var app_password = initiator_data.app_password


    console.log("initiator_data", initiator_data)

    var email = req.body.email
    var cc = ""
    var subject = "Vendor Information Request"

    var url = process.env.base_url


    const attachments = [];


    if (req.body.code_of_conduct.length == 0) {

        attachments.push({
            filename: 'code of conduct.pdf',
            path: `${url}/images/CodeofConduct.pdf`
        })

    } else {

        req.body.code_of_conduct.map(info => {
            attachments.push({
                filename: `${info}`,
                path: `${url}/files/${info}`
            })
        })


    }

    if (req.body.it_deceleration.length == 0) {

        attachments.push({
            filename: 'it declaration.pdf',
            path: `${url}/images/ITDeclaration.pdf`
        })



    } else {



        req.body.it_deceleration.map(info => {
            attachments.push({
                filename: `${info}`,
                path: `${url}/files/${info}`
            })
        })

    }






    // return



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

    await helper.sendmail1(email, cc, subject, html, attachments, form, app_password)

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

    const { mode_of_payment, msme_attachment, ssi_attachment, it_deceleration_attachment, code_of_conduct_attachment, accounting_ref, delivery_terms, financial_supplier, type_of_item, s_name_as_per_name, supplier_type, sales_ref, micr_code, payment_terms, default_currency, gst_range, msme_no, ssi_no, gst_division, gst_commissionerate, hsn_sac, incoterms_location, name, mobile_number, email, country, p_alternate_email, p_alternate_contact, vendor_id, address, state, zip_code, address1, city, city1, gst_number, pan_card_number, bank_name, account_no, bank_address, bank_address2, bank_address3, ifsc_code, p_name, p_contact, p_email, gst_url, pan_url, noc_url, cheque_url, sale_data, contact_section_data, firm_type, p_designation } = req.body;


    const existingUser = await firmDataModel.findOne({ pan_card_number: pan_card_number, status: true });

    new firmDataModel({ mode_of_payment, msme_attachment, ssi_attachment, accounting_ref, it_deceleration_attachment, code_of_conduct_attachment, supplier_type, type_of_item, sales_ref, delivery_terms, financial_supplier, s_name_as_per_name, micr_code, payment_terms, hsn_sac, msme_no, ssi_no, incoterms_location, gst_range, gst_division, gst_commissionerate, default_currency, vendor_id, address, state, country, zip_code, p_alternate_email, p_alternate_contact, address1, city, city1, gst_number, pan_card_number, bank_name, account_no, bank_address, bank_address2, bank_address3, ifsc_code, p_name, p_contact, p_email, gst_url, pan_url, noc_url, cheque_url, sale_data, contact_section_data, p_designation })
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

    console.log(req.body)

    const { mode_of_payment, accounting_ref, it_deceleration_attachment, code_of_conduct_attachment, delivery_terms, msme_attachment, ssi_attachment, financial_supplier, type_of_item, s_name_as_per_name, supplier_type, sales_ref, micr_code, payment_terms, default_currency, gst_range, msme_no, ssi_no, gst_division, gst_commissionerate, hsn_sac, incoterms_location, name, mobile_number, email, country, p_alternate_email, p_alternate_contact, vendor_id, address, state, zip_code, address1, city, city1, gst_number, pan_card_number, bank_name, account_no, bank_address, bank_address2, bank_address3, ifsc_code, p_name, p_contact, p_email, gst_url, pan_url, noc_url, cheque_url, sale_data, contact_section_data, firm_type, p_designation } = req.body;

    firmDataModel.findByIdAndUpdate({ _id: req.params.id }, { mode_of_payment, msme_attachment, it_deceleration_attachment, code_of_conduct_attachment, ssi_attachment, accounting_ref, supplier_type, type_of_item, sales_ref, delivery_terms, financial_supplier, s_name_as_per_name, micr_code, payment_terms, hsn_sac, msme_no, ssi_no, incoterms_location, gst_range, gst_division, gst_commissionerate, default_currency, vendor_id, address, state, country, zip_code, p_alternate_email, p_alternate_contact, address1, city, city1, gst_number, pan_card_number, bank_name, account_no, bank_address, bank_address2, bank_address3, ifsc_code, p_name, p_contact, p_email, gst_url, pan_url, noc_url, cheque_url, sale_data, contact_section_data, p_designation })
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
        query = { $and: [{ status: true }, { final_approval: false }] }

    } else {

        query = { $and: [{ status: true }, { level_status: req.params.id }, { final_approval: false }] }

    }

    console.log(query)

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


    console.log(req.body)
    var { comment_revert, vendor_id, attachment_revert, operator_by, operator_type, remark, is_ban } = req.body

    var initiator_data = await adminModel.findById({ _id: operator_by })
    var form = initiator_data.email
    var app_password = initiator_data.app_password
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
            <li><strong>Vendor Email:</strong> ${vendor_data.email}</li>
            <li><strong>Reason for Rejection:</strong> ${comment_revert}</li>
          </ul>
        
          
        
          <p>Thank you for your attention to this matter.</p>
        
          <p>Best regards,</p>
        
         
        </body>
        </html>
        `
        const emailAttachments = attachment_revert.map((filename) => {
            let attachment = {};

            if (filename.endsWith('.pdf')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.gif')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            } else if (filename.endsWith('.mp3')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            }

            return attachment;
        });

        await helper.sendmail1(email, cc, subject, html, emailAttachments, form, app_password )

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
            level_status: 4,
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
            <li><strong>Vendor Email:</strong> ${vendor_data.email}</li>
            <li><strong>Reason for Rejection:</strong> ${comment_revert}</li>
          </ul>
        
          
        
          <p>Thank you for your attention to this matter.</p>
        
          <p>Best regards,</p>
        
         
        </body>
        </html>
        `
        const emailAttachments = attachment_revert.map((filename) => {
            let attachment = {};

            if (filename.endsWith('.pdf')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.gif')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            } else if (filename.endsWith('.mp3')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            }

            return attachment;
        });

        await helper.sendmail1(email, cc, subject, html, emailAttachments, form, app_password)

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

        await sign_master.updateMany({ vendor_id: vendor_id }, {
            status: false
        })

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
            <li><strong>Vendor Email:</strong> ${vendor_data.email}</li>
            <li><strong>Reason for Rejection:</strong> ${comment_revert}</li>
          </ul>
        
          
        
          <p>Thank you for your attention to this matter.</p>
        
          <p>Best regards,</p>
        
         
        </body>
        </html>
        `
        const emailAttachments = attachment_revert.map((filename) => {
            let attachment = {};

            if (filename.endsWith('.pdf')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.gif')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            } else if (filename.endsWith('.mp3')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            }

            return attachment;
        });

        await helper.sendmail1(email, cc, subject, html, emailAttachments, form, app_password)


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
            is_revert: true,
            is_ban: false,
            // ban_number_input: null,
            // financial_supplier: ""
        })

        await new timelineVendor({ vendor_id: vendor_id, type: "Revert Back To Initiator Form CFO.", action_status: 1, operator_by: operator_by, operator_type: operator_type, comment: comment_revert, attachment: attachment_revert, remark: remark }).save()

        var admin_data = ""
        if (reject_data_id != undefined) {

            admin_data = await adminModel.findById({ _id: reject_data_id })

        }

        await sign_master.updateMany({ vendor_id: vendor_id }, {
            status: false
        })

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
            <li><strong>Vendor Email:</strong> ${vendor_data.email}</li>
            <li><strong>Reason for Rejection:</strong> ${comment_revert}</li>
          </ul>
        
          
        
          <p>Thank you for your attention to this matter.</p>
        
          <p>Best regards,</p>
        
         
        </body>
        </html>
        `
        const emailAttachments = attachment_revert.map((filename) => {
            let attachment = {};

            if (filename.endsWith('.pdf')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.gif')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            } else if (filename.endsWith('.mp3')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            }

            return attachment;
        });

        await helper.sendmail1(email, cc, subject, html, emailAttachments, form, app_password)
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


        await sign_master.updateMany({ vendor_id: vendor_id }, {
            status: false
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
        const emailAttachments = attachment_revert.map((filename) => {
            let attachment = {};

            if (filename.endsWith('.pdf')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.gif')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            } else if (filename.endsWith('.mp3')) {
                attachment = {
                    filename: filename,
                    path: `${url}/files/${filename}`
                };
            }

            return attachment;
        });

        await helper.sendmail1(email, cc, subject, html, emailAttachments, form, app_password)



    }




    return res.json({
        status: true,
        message: "Request Submitted Successfully...!"
    })




}

// --------resend_revert_to_vendor-----------------------//
exports.resend_revert_to_vendor = async (req, res) => {

    var { vendor_id, operator_by, operator_type, email, name, attachment, comment, } = req.body

    var initiator_data = await adminModel.findById({ _id: operator_by })
    var form = initiator_data.email
    var app_password = initiator_data.app_password
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
    var attachments = []
    await helper.sendmail1(email, cc, subject, html, attachments, form, app_password)


    return res.json({
        status: true,
        message: "Request Submitted Successfully...!"
    })




}


// --------forward_to_admin-----------------------//
exports.forward_to_admin = async (req, res) => {


    console.log(req.body)

    var { comment_forword, vendor_id, is_cfo_is_done_or_not, attachment_forword, operator_by, operator_type, forwarded_to, remark, ban_number_input, is_final, financial_supplier } = req.body
    var level_status = 0

    var initiator_data = await adminModel.findById({ _id: req.body.operator_by })
    var form = initiator_data.email
    var app_password = initiator_data.app_password



    var final = false

    if (is_final == true) {
        final = true
    }


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

        var query = {
            level_status: level_status,
            comment: comment_forword,
            attachment: attachment_forword,
            operator_by: forwarded_to,
            is_ban: true,
            remark: remark,
            ban_number_input: ban_number_input,
            financial_supplier: financial_supplier,
            final_approval: final,
            download_attachment: attachment_forword
        }

        if (final) {

            query = {
                level_status: level_status,
                comment: comment_forword,
                attachment: attachment_forword,
                operator_by: forwarded_to,
                is_ban: true,
                remark: remark,
                ban_number_input: ban_number_input,
                financial_supplier: financial_supplier,
                final_approval: final,

            }

        }
        var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, query)




    } if (operator_type == "CFO") {
        var vendor_data = await vendorsModel.findByIdAndUpdate({ _id: vendor_id }, {
            level_status: level_status,
            comment: comment_forword,
            attachment: attachment_forword,
            operator_by: forwarded_to,
            remark: remark,
            is_cfo: true,
            final_approval: final,
            // download_attachment: attachment_forword
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
            // download_attachment: attachment_forword
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
    
        <p>I hope this email finds you well. I am writing to bring to your attention a vendor approval request that requires your attention and authorization. The following details and attachment are provided for your review:</p>
    
        <p><strong>Vendor Name:</strong> ${vendor_data.name}<br>
        <strong>Vendor Email:</strong> ${vendor_data.email}<br>
       
    
       
    
        <p>Please review the vendor's information and the provided request details. If you approve this vendor for engagement, kindly proceed with the necessary steps to complete the vendor onboarding process. If there are any concerns or additional requirements, please let me know, and I will relay the message to the vendor accordingly.</p>
    
        <p>Your prompt attention to this matter is greatly appreciated, as it will allow us to proceed with the necessary arrangements in a timely manner. Should you have any questions or require further information, please don't hesitate to reach out to me.</p>
    
        <p>Thank you for your cooperation.</p>
    
        <p>Best regards,<br>
        ${forwarded_form.name}<br>
      
        ${forwarded_form.email}</p>

    </body>
    </html>
    
    `
    const emailAttachments = attachment_forword.map((filename) => {
        let attachment = {};

        if (filename.endsWith('.pdf')) {
            attachment = {
                filename: filename,
                path: `${url}/files/${filename}`
            };
        } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.gif')) {
            attachment = {
                filename: filename,
                path: `${url}/files/${filename}`
            };
        } else if (filename.endsWith('.mp3')) {
            attachment = {
                filename: filename,
                path: `${url}/files/${filename}`
            };
        }

        return attachment;
    });

    await helper.sendmail1(email, cc, subject, html, emailAttachments, form, app_password)


    var sign_data = await sign_master.find({ vendor_id: vendor_id, operator_type: operator_type, status: true })



    if (sign_data.length > 0) {

    } else {
        await new sign_master({ vendor_id: vendor_id, approved_user: operator_by, operator_type: operator_type }).save()
    }






    return res.json({
        status: true,
        message: "Request Submitted Successfully...!"
    })




}

exports.save_data_baan = async (req, res) => {


    vendorsModel.findByIdAndUpdate({ _id: req.body.vendor_id }, {
        ban_number_input: req.body.ban_number_input,
        financial_supplier: req.body.financial_supplier,
        is_download_pdf: true


    }).then(data => {
        return res.json({
            status: true,
            data: data,
            message: "Updated"
        })
    }).catch(err => {

        return res.json({
            status: false,
            err: err,
            message: "Somethings went wrong...!"
        })

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

// ------------verify_gst-----------
exports.verify_gst = async (req, res) => {

    const existingUser = await firmDataModel.findOne({ gst_number: req.params.id, status: true });
    if (existingUser) {
        return res.json({
            status: false,
            message: "GST number already exists..!"
        })
    } else {
        return res.json({
            status: true,
            message: "GST number  successfully..!"
        })

    }



}


exports.download_pdf = async (req, res) => {


    var firm_data = await firmDataModel.findOne({ vendor_id: req.params.id, status: true }).populate("vendor_id");



    // Your aggregation query
    var test = await firmDataModel.aggregate([
        {
            $lookup: {
                from: 'vendors',
                localField: 'vendor_id',
                foreignField: '_id',
                as: 'vendor_id'
            }
        },
        {
            $unwind: '$vendor_id'
        },
        {
            $lookup: {
                from: 'sign_masters',
                localField: 'vendor_id',
                foreignField: 'vendor_id',
                as: 'sign_masters'
            }
        },
        {
            $unwind: '$sign_masters'
        },
        {
            $lookup: {
                from: 'adminusers',
                localField: 'sign_masters.approved_user',
                foreignField: '_id',
                as: 'sign_masters.approved_user'
            }
        },
        {
            $unwind: '$sign_masters.approved_user'
        },
        // {
        //     $project: {
        //         _id: 1,
        //         vendor_id: {
        //             _id: '$vendor._id',
        //             name: '$vendor.name'
        //         },
        //         sign_master: {
        //             admin_data: {
        //                 _id: '$sign_master.admin_data._id',
        //                 name: '$sign_master.admin_data.name'
        //             }
        //         }
        //     }
        // }
    ])


    console.log("here")

    console.log("test", test)


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
    // const browser = await puppeteer.launch({ headless: 'new' });
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





exports.download_pdf_test = async (req, res) => {


    // var firm_data = await firmDataModel.findOne({ vendor_id: req.params.id, status: true }).populate("vendor_id");
    // firm_data.base_url = process.env.base_url

    try {
        // Retrieve dynamic data from the database or generate it dynamically
        var userData = []

        console.log("userData", userData)

        // res.render('admin/pdf.ejs', { userData });
        // return
        // Render the template with dynamic data
        const templatePath = 'views/admin/pdf1.ejs';
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
            res.setHeader('Content-Disposition', `attachment; filename=test.pdf`);

            // Send the PDF buffer as the response
            res.send(pdfBuffer);
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }


}




exports.download_pdf_it_csv = async (req, res) => {
    var data = await firmDataModel.find({ vendor_id: req.params.id }).populate("vendor_id");
    console.log(data);

    if (data[0].vendor_id.is_cfo == false) {

        const filePath = path.join(__dirname, 'enquiry.csv');
        // Create CSV writer
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'header', title: 'Header' },
                { id: 'value', title: 'Value' }
            ]
        });

        var records = [];

        data.forEach((item) => {
            var BAAN_Number = item.vendor_id ? item.vendor_id.ban_number_input : "-";
            var Supplier = item.vendor_id ? item.vendor_id.name : "-";
            var Address = item.address ? item.address : "-";
            var Address2 = item.address1 ? item.address1 : "-";
            var City = item.city ? item.city : "-";
            var City1 = item.city1 ? item.city1 : "-";
            var ZipCode = item.zip_code ? item.zip_code : "-";
            var accounting_ref = item.accounting_ref ? item.accounting_ref : "-";
            var sales_ref = item.sales_ref ? item.sales_ref : "-";
            var payment_terms = item.payment_terms ? item.payment_terms : "-";
            var delivery_terms = item.delivery_terms ? item.delivery_terms : "-";
            var Country = item.country ? item.country : "-";
            var default_currency = item.default_currency ? item.default_currency : "-";
            var financial_supplier = item.vendor_id ? item.vendor_id.financial_supplier : "-";
            var Email = item.vendor_id ? item.vendor_id.email : "-";
            var mobile_number = item.vendor_id.mobile_number ? item.vendor_id.mobile_number : "-";
            var s_name_as_per_name = item.s_name_as_per_name ? item.s_name_as_per_name : "-";
            var bank_name = item.bank_name ? item.bank_name : "-";
            var account_no = item.account_no ? item.account_no : "-";
            var bank_address = item.bank_address ? item.bank_address : "-";
            var ifsc_code = item.ifsc_code ? item.ifsc_code : "-";
            var micr_code = item.micr_code ? item.micr_code : "-";

            var s_name = item.sale_data[0].s_name ? item.sale_data[0].s_name : "-";
            var s_number = item.sale_data[0].s_number ? item.sale_data[0].s_number : "-";
            var s_number_alternate = item.sale_data[0].s_number_alternate ? item.sale_data[0].s_number_alternate : "-";
            var s_email = item.sale_data[0].s_email ? item.sale_data[0].s_email : "-";
            var s_email_alternate = item.sale_data[0].s_email_alternate ? item.sale_data[0].s_email_alternate : "-";
            var p_name = item.p_name ? item.p_name : "-";
            var p_contact = item.p_contact ? item.p_contact : "-";
            var p_alternate_contact = item.p_alternate_contact ? item.p_alternate_contact : "-";
            var p_email = item.p_email ? item.p_email : "-";
            var p_alternate_email = item.p_alternate_email ? item.p_alternate_email : "-";
            var gst_number = item.gst_number ? item.gst_number : "-";
            var gst_range = item.gst_range ? item.gst_range : "-";
            var supplier_type = item.supplier_type ? item.supplier_type : "-";
            var hsn_sac = item.hsn_sac ? item.hsn_sac : "-";
            var gst_division = item.gst_division ? item.gst_division : "-";
            var pan_card_number = item.pan_card_number ? item.pan_card_number : "-";
            var type_of_item = item.type_of_item ? item.type_of_item : "-";
            var gst_commissionerate = item.gst_commissionerate ? item.gst_commissionerate : "-";
            var msme_no = item.msme_no ? item.msme_no : "-";
            var ssi_no = item.ssi_no ? item.ssi_no : "-";
            var value = item.vendor_id.firm_type ? item.vendor_id.firm_type : "-";

            if (value == 1) {


                var firm_type = "Proprietorship"

            } else if (value == 2) {


                var firm_type = "Partnership"


            } else if (value == 3) {


                var firm_type = "Private Ltd"

            } else {

                var firm_type = "Public Ltd"


            }







            records.push(
                { header: 'Supplier', value: Supplier },
                { header: 'Address', value: Address },
                { header: 'Address2', value: Address2 },
                { header: 'City', value: City },
                { header: 'City1', value: City1 },
                { header: 'Zip Code', value: ZipCode },
                { header: 'Accounting Reference', value: accounting_ref },
                { header: 'Sales Reference', value: sales_ref },
                { header: 'Terms of Payment', value: payment_terms },
                { header: 'Terms of Delivery', value: delivery_terms },
                { header: 'Country', value: Country },
                { header: 'Currency', value: default_currency },
                { header: 'Financial Supplier Group', value: financial_supplier },
                { header: 'Email', value: Email },
                { header: 'Telephone', value: mobile_number },
                { header: 'Sup. Name as per Bank', value: s_name_as_per_name },
                { header: 'Bank Name', value: bank_name },
                { header: 'Bank Account No', value: account_no },
                { header: 'Bank Address', value: bank_address },
                { header: 'Country', value: Country },
                { header: 'IFSC Code', value: ifsc_code },
                { header: 'IBAN No.', value: account_no },
                { header: 'MICR', value: micr_code },
                { header: 'Vendor Callback', value: "" }
            );

            // Map contact_section_data
            item.contact_section_data.forEach((contact, i) => {
                records.push(
                    { header: `Prop/Partner/Director Name ${i + 1} `, value: contact.d_name },
                    { header: `Prop/Partner/Director Designation ${i + 1}`, value: contact.d_designation },
                    { header: `Prop/Partner/Director Contact ${i + 1}`, value: contact.d_contact },
                    { header: `Prop/Partner/Director Alternate Contact ${i + 1}`, value: contact.d_contact_alternate },
                    { header: `Prop/Partner/Director Email ${i + 1}`, value: contact.d_email },
                    { header: `Prop/Partner/Director Alternate Email ${i + 1}`, value: contact.d_email_alternate }
                );
            });


            records.push(
                { header: 'BAAN Number', value: BAAN_Number },
                { header: 'Sale Name', value: s_name },

                { header: 'Sale Contact', value: s_number },
                { header: 'Sale Alternate Contact', value: s_number_alternate },
                { header: 'Sale Email', value: s_email },
                { header: 'Sale Alternate Email', value: s_email_alternate },
                { header: 'Account Person Name', value: p_name },
                { header: 'Account Person Contact', value: p_contact },
                { header: 'Account Person Alternate Contact', value: p_alternate_contact },
                { header: 'Account Person Email', value: p_email },
                { header: 'Account Person Alternate Email', value: p_alternate_email },
                { header: 'GST Registration No.', value: gst_number },
                { header: 'Range', value: gst_range },
                { header: 'Supplier Type', value: supplier_type },
                { header: 'HSN/SAC', value: hsn_sac },
                { header: 'GST Division', value: gst_division },
                { header: 'Pan Number', value: pan_card_number },
                { header: 'GST Commissionerate', value: gst_commissionerate },
                { header: 'Type of Item', value: type_of_item },
                { header: 'MSME Registered', value: msme_no },
                { header: 'SSI Registered', value: ssi_no },
                { header: 'Entity Type', value: firm_type },



                // { header: 'Sup. Name as per Bank', value: s_name_as_per_name },
                // { header: 'Bank Name', value: bank_name },
                // { header: 'Bank Account No', value: account_no },
                // { header: 'Bank Address', value: bank_address },
                // { header: 'Country', value: Country },
                // { header: 'IFSC Code', value: ifsc_code },
                // { header: 'IBAN No.', value: account_no },
                // { header: 'MICR', value: micr_code },
                // { header: 'Vendor Callback', value: "" }
            );

        });

        // Write headers and records to CSV file
        await csvWriter.writeRecords(records);

        // Set response headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${data[0].vendor_id.name}.csv`);

        // Send the CSV file as the response
        return res.sendFile(filePath);

    } else {

        const filePath = path.join(__dirname, 'enquiry.csv');
        // Create CSV writer
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'header', title: 'Header' },
                { id: 'value', title: 'Value' }
            ]
        });

        var records = [];

        data.forEach((item) => {

            var s_name_as_per_name = item.s_name_as_per_name ? item.s_name_as_per_name : "-";
            var bank_name = item.bank_name ? item.bank_name : "-";
            var account_no = item.account_no ? item.account_no : "-";
            var bank_address = item.bank_address ? item.bank_address : "-";
            var ifsc_code = item.ifsc_code ? item.ifsc_code : "-";
            var micr_code = item.micr_code ? item.micr_code : "-";
            var Country = item.country ? item.country : "-";

            records.push(
                { header: 'Sup. Name as per Bank', value: s_name_as_per_name },
                { header: 'Bank Name', value: bank_name },
                { header: 'Bank Account No', value: account_no },
                { header: 'Bank Address', value: bank_address },
                { header: 'Country', value: Country },
                { header: 'IFSC Code', value: ifsc_code },
                { header: 'IBAN No.', value: account_no },
                { header: 'MICR', value: micr_code },
                { header: 'Vendor Callback', value: "" }
            );



        });

        // Write headers and records to CSV file
        await csvWriter.writeRecords(records);

        // Set response headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${data[0].vendor_id.name}_bank_details.csv`);

        // Send the CSV file as the response
        return res.sendFile(filePath);
    }


};



exports.get_sign_section = async (req, res) => {

    sign_master.find({ vendor_id: req.params.id, status: true })
        .populate("vendor_id")
        .populate("approved_user")
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


exports.test_api = async (req, res) => {

    // var firm_data = await firmDataModel.findOne({ vendor_id: req.params.id, status: true }).populate("vendor_id");

    firmDataModel.aggregate([
        {
            $match: { $and: [{ vendor_id: new ObjectId(req.params.id) }, { status: true }] }
        },
        {
            $lookup: {
                from: "vendors",
                localField: "vendor_id",
                foreignField: "_id",
                as: "vendor_id"

            }
        },

        {
            $unwind: {
                path: "$vendor_id",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "sign_masters",
                let: {
                    vendor_id: '$vendor_id._id',//Main table value
                    status: true
                },
                pipeline: [

                    {
                        $match: {
                            $and: [
                                { $expr: { $eq: ["$vendor_id", "$$vendor_id"] } },
                                { $expr: { $eq: ["$status", "$$status"] } },

                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: "adminusers",
                            localField: "approved_user",
                            foreignField: "_id",
                            as: "admin_users"
                        }
                    },
                    {
                        $unwind: {
                            path: "$admin_users",
                            preserveNullAndEmptyArrays: true
                        }
                    },



                ],
                as: "sign_masters"
            }
        },
    ])
        .then(data => {
            return res.json({
                status: true,
                data: data,

            });

        })
        .catch(err => {
            return res.json({
                status: false,
                data: err,
                message: "Something Went Wrong..!",
            });

        })


}

exports.download_pdf_it = async (req, res) => {



    var firm_data1 = await firmDataModel.aggregate([
        {
            $match: { $and: [{ vendor_id: new ObjectId(req.params.id) }, { status: true }] }
        },
        {
            $lookup: {
                from: "vendors",
                localField: "vendor_id",
                foreignField: "_id",
                as: "vendor_id"

            }
        },

        {
            $unwind: {
                path: "$vendor_id",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "sign_masters",
                let: {
                    vendor_id: '$vendor_id._id',//Main table value
                    status: true
                },
                pipeline: [

                    {
                        $match: {
                            $and: [
                                { $expr: { $eq: ["$vendor_id", "$$vendor_id"] } },
                                { $expr: { $eq: ["$status", "$$status"] } },

                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: "adminusers",
                            localField: "approved_user",
                            foreignField: "_id",
                            as: "admin_users"
                        }
                    },
                    {
                        $unwind: {
                            path: "$admin_users",
                            preserveNullAndEmptyArrays: true
                        }
                    },



                ],
                as: "sign_masters"
            }
        },
    ])


    var firm_data = firm_data1[0]



    firm_data.base_url = process.env.base_url

    var userData = firm_data

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








exports.download_pdf_it_data = async (req, res) => {

    console.log("skds")
    try {
        var firm_data1 = await firmDataModel.aggregate([
            {
                $match: { $and: [{ vendor_id: new ObjectId(req.params.id) }, { status: true }] }
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendor_id",
                    foreignField: "_id",
                    as: "vendor_id"

                }
            },

            {
                $unwind: {
                    path: "$vendor_id",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "vendor_timelines",
                    localField: "vendor_id._id",
                    foreignField: "vendor_id",
                    as: "vendor_timelines_data"

                }
            },

            // {
            //     $unwind: {
            //         path: "$vendor_timelines_data",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },

            {
                $lookup: {
                    from: "sign_masters",
                    let: {
                        vendor_id: '$vendor_id._id',//Main table value
                        status: true
                    },
                    pipeline: [

                        {
                            $match: {
                                $and: [
                                    { $expr: { $eq: ["$vendor_id", "$$vendor_id"] } },
                                    { $expr: { $eq: ["$status", "$$status"] } },

                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: "adminusers",
                                localField: "approved_user",
                                foreignField: "_id",
                                as: "admin_users"
                            }
                        },
                        {
                            $unwind: {
                                path: "$admin_users",
                                preserveNullAndEmptyArrays: true
                            }
                        },



                    ],
                    as: "sign_masters"
                }
            },
        ]).then((data) => {

            var firm_data = data[0];
            firm_data.base_url = process.env.base_url;

            const userData = firm_data;
            return res.json({
                status: true,
                data: firm_data
            })
        })
            .catch(err => {
                return res.json({
                    status: false,
                    data: err
                })

            })


    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
};

