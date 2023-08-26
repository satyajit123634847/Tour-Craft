var vendor = {
    base_url: null,
    init: function () {
        vendor.bind_events()
        vendor.list_vendor()





    },
    bind_events: function (e) {
    },
    list_vendor: function (e) {
        $('#vendor_table').DataTable({
            "ajax": {
                "url": this.base_url + "/vendor/list_vendor_approved",
                "type": "GET",
                "datatype": "json"
            },
            "buttons": [
                {
                    extend: 'excelHtml5',
                    text: 'Export to Excel',
                    exportOptions: {
                        columns: [1, 2, 3, 4] // indexes of the columns to export
                    }
                }
            ], "columns": [
                {
                    'data': '_id',
                    'visible': false
                },
                {
                    'data': null,
                    'sTitle': 'Sr.no',

                },
                {
                    'data': 'name',
                    'sTitle': 'Name',
                    'render': function (data, type, row) {

                        if (data == null || data == "") {
                            return '-';
                        } else {
                            return data;
                        }

                    }

                },

                // {
                //     'data': 'username',
                //     'sTitle': 'Username',
                //     'render': function (data, type, row) {

                //         if (data == null || data == "") {
                //             return '-';
                //         } else {
                //             return data;
                //         }

                //     }

                // },
                // {
                //     'data': 'mobile_number',
                //     'sTitle': 'Mobile Number',
                //     'render': function (data, type, row) {

                //         if (data == null || data == "") {
                //             return '-';
                //         } else {
                //             return data;
                //         }

                //     }

                // },
                {
                    'data': 'email',
                    'sTitle': 'Email',
                    'render': function (data, type, row) {

                        if (data == null || data == "") {
                            return '-';
                        } else {
                            return data;
                        }

                    }

                },
                {
                    'data': 'firm_type',
                    'sTitle': 'Firm Type',
                    'render': function (data, type, row) {

                        if (data == null || data == "") {
                            return '-';
                        } else {
                            if (data == 0) {

                            } else if (data == 1) {
                                return "Proprietorship"
                            } else if (data == 2) {
                                return "Partnership"
                            } else if (data == 3) {
                                return "Private Ltd"
                            } else {
                                return "Public Ltd"
                            }
                        }

                    }

                },
                {
                    'data': 'download_attachment',
                    'visible': false,
                    'class': 'download_attachment',
                },
                {
                    'data': 'is_cfo',
                    'visible': false,
                    'class': 'is_cfo',
                },
                {
                    'data': 'final_approval',
                    'visible': false,
                    'class': 'final_approval',
                },

                {
                    'data': '_id',
                    'sTitle': 'View',
                    'class': 'center',
                    'render': function (data, type, row) {
                        var downloadAttachment = row['download_attachment'];

                        console.log("downloadAttachment", downloadAttachment)

                        if (downloadAttachment == "" || downloadAttachment == undefined) {
                            return ` <i class="mdi mdi-eye mx-2" title="View" onclick="vendor.view_vendor(this)"   style="font-size:24px;color:#4B49AC; cursor: pointer;"></i>  <i class="mdi mdi-timer mx-2" title="Timeline"  style="font-size:24px;color:#4B49AC;cursor: pointer;" onclick="vendor.view_time_line(this)"></i><a onclick="vendor.download_pdf(this)" ><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        } else {
                            return ` <i class="mdi mdi-eye mx-2" title="View" onclick="vendor.view_vendor(this)"   style="font-size:24px;color:#4B49AC; cursor: pointer;"></i>  <i class="mdi mdi-timer mx-2" title="Timeline"  style="font-size:24px;color:#4B49AC;cursor: pointer;" onclick="vendor.view_time_line(this)"></i><a href="${vendor.base_url}/files/${downloadAttachment}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`

                        }
                    }
                },

                {
                    'data': 'remark',
                    'sTitle': 'Status',
                    'render': function (data, type, row) {
                        var isCFO = row['is_cfo'];
                        var isFinal = row['final_approval'];
                        console.log(isCFO)
                        console.log(isFinal)


                        var t = '<a class="btn btn-success"> Approved </a>'
                        if(isCFO == true && isFinal == false ){
                            t = '<a class="btn btn-success"> CFO Verified </a>'

                        }


                        if (data == null || data == "") {
                            return '-';
                        } else {
                            return t;
                        }

                    }

                },

                // {
                //     'data': 'link_status',
                //     'sTitle': 'Action',
                //     //'class': 'center',
                //     'render': function (data, type, row) {
                //         if (data == 0) {
                //             return '<a class="btn btn-success" onclick="vendor.send_link(this)" title="Send Link"> Send Link </a>'
                //         } else {

                //             return '<a class="btn btn-success" onclick="vendor.send_link(this)" title="Send Link"> Resend Link </a>'

                //         }
                //     }
                // }





            ],
            "rowCallback": function (nRow, aData, iDisplayIndex) {
                var oSettings = this.fnSettings();
                $("td:first", nRow).html(oSettings._iDisplayStart + iDisplayIndex + 1);
                return nRow;
            },
        });

    },
    send_link: function (e) {
        let self = this;
        let row = $(e).closest('tr');
        let obj = $('#vendor_table').dataTable().fnGetData(row);



        console.log(obj)


        var id = obj._id
        obj.operator_by = sessionStorage.getItem("user_id")
        obj.operator_type = sessionStorage.getItem("user_status")

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Send it!'
        }).then((result) => {
            if (result.isConfirmed) {
                var $request = $.ajax({
                    url: `${vendor.base_url}/vendor/send_vendor_link`,
                    type: "Post",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(obj),

                });

                $request.done(function (data) {
                    if (data.status) {
                        toastr.options.positionClass = 'toast-bottom-right';
                        toastr.success(data.message, '', { timeOut: 3000 },)
                        setTimeout(() => {
                            window.location = '/new-vendor';
                        }, 1000);


                    }

                })

            }
        })

    },
    download_pdf: function (e) {

        let self = this;
        let row = $(e).closest('tr');
        let obj = $('#vendor_table').dataTable().fnGetData(row);
        var id = obj._id



        var $request = $.ajax({
            url: `${vendor.base_url}/vendor/download_pdf_it_data/${id}`,
            type: "GET",
            dataType: "json",
            contentType: "application/json",

        });

        $request.done(function (data) {

            if (data.status) {

                var userData = data.data

                console.log("userData", userData)

                const dateObj = new Date(userData.createdAt);

                const year = dateObj.getFullYear().toString();
                const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                const day = dateObj.getDate().toString().padStart(2, '0');

                const convertedDate = `${day}-${month}-${year}`;

                let hours = dateObj.getHours();
                const minutes = dateObj.getMinutes().toString().padStart(2, '0');

                let period = "AM";

                if (hours >= 12) {
                    period = "PM";
                    if (hours > 12) {
                        hours -= 12;
                    }
                } else if (hours === 0) {
                    hours = 12;
                }

                const convertedTime = `${hours}.${minutes}`;

                const desiredFormat = `${convertedDate}`;


                var value = userData.vendor_id.firm_type;
                var t3 = "-"
                if (value == 1) {
                    $("#firm_type").text("Proprietorship")
                    t3 = "Proprietorship"

                } else if (value == 2) {
                    $("#firm_type").text("Partnership")
                    t3 = "Partnership"



                } else if (value == 3) {

                    $("#firm_type").text("Private Ltd")
                    t3 = "Private Ltd"


                } else {
                    $("#firm_type").text("Public Ltd")
                    t3 = "Public Ltd"


                }

                var t = ""
                userData.contact_section_data.map(info => {

                    t += `<div class="row border">
                    <div class="col-3 border-right">
                        <p>${info.d_name}</p>
                    </div>
        
                    <div class="col-3 border-right">
        
                        <p> ${info.d_designation}</p>
                    </div>
                    <div class="col-3 border-right">
                        <p> ${info.d_contact}</p>
                    </div>
                    <div class="col-3 p-1">
                        <p>${info.d_email}</p>
                    </div>
        
                </div>`

                })

                var t2 = ""
                userData.sign_masters.map((info) => {
                    t2 += `<div class="col-2 text-center border">
                    <img src=" ${vendor.base_url}/files/${info.admin_users.sign}" width="100%" alt="logo">
                    <p>${info.admin_users.name} (${info.admin_users.user_status}) </p>
                </div>`

                })


                var invoice = `<!doctype html>
                <html lang="en">
                   <head>
                      <!-- Required meta tags -->
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                      <!-- Bootstrap CSS -->
                      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
                         integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                      <title>Vendor Registrations Format </title>
                      <style>
                         p {
                         margin-bottom: 0px;
                         font-size: 12px;
                         }
                      </style>
                   </head>
                   <body>
                      <div class="container my-1 border  ">
                         <div class="row ">
                            <div class="col-3 border-left border-right border-bottom ">
                               <img src="${vendor.base_url}/images/logo.jpg" width="100%" alt="logo">
                            </div>
                            <div class="col-6 text-center border-left border-right border-bottom ">
                               <h5><b>Vendor Registrations Format</b></h5>
                            </div>
                            <div class="col-3 border-left  border-bottom ">
                               <p><b>Reference:</b>-</p>
                               <p><b>Revision:</b>-</p>
                               <p><b>Date:</b>${desiredFormat}</p>
                               <p><b>Page:</b>1</p>
                               <p><b>Owner:</b>-</p>
                            </div>
                         </div>
                         <div class="row ">
                            <div class="col-9 border-right border-left border-bottom border-top">
                               <div class="row border">
                                  <div class="col-4 border-right border-left">
                                     <p><b>Request for</b></p>
                                  </div>
                                  <div class="col-8 border-left ">
                                     <p> &nbsp; New Code &nbsp; &nbsp; &nbsp; Modification &nbsp; &nbsp; &nbsp; Existing
                                        Code
                                     </p>
                                  </div>
                               </div>
                               <div class="row border">
                                  <div class="col-4 border-right border-left ">
                                     <p><b>Vendor Group</b></p>
                                  </div>
                                  <div class="col-8 border-left ">
                                     <p> &nbsp; Non AL Group(D) Non AL Group(I) AL Group(D) AL Group(I) </p>
                                  </div>
                               </div>
                               <div class="row border">
                                  <div class="col-4 border-right border-left ">
                                     <p><b>Scope Of Supply</b></p>
                                  </div>
                                  <div class="col-8 border-left">
                                     <p> &nbsp;Raw Materials &nbsp; &nbsp; &nbsp;Sub Contacting &nbsp; &nbsp; &nbsp;
                                        Other Services
                                     </p>
                                  </div>
                               </div>
                               <div class="row border">
                                  <div class="col-4 border-right border-left">
                                     <p><b>Inspection is required</b></p>
                                  </div>
                                  <div class="col-8 border-left ">
                                     <p> &nbsp;Yes &nbsp; &nbsp; &nbsp;No </p>
                                  </div>
                               </div>
                            </div>
                            <div class="col-3 border-right border-left border-bottom border-top">
                               <p>To be filed by Cryolor</p>
                            </div>
                         </div>
                         <div class="row border  bg-light">
                            <p><b>Vendor Name and Address Details</b></p>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Name</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>  ${userData.vendor_id.name ? userData.vendor_id.name : ''}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Address Line 1</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>  ${userData.address ? userData.address : '-'}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Address Line 2</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>${userData.address1 ? userData.address1 : '-'}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>City</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.city ? userData.city : '-'}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>State</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.state ? userData.state : '-'},</p>
                              
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Country, Zip Code</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.country ? userData.country : ''},  ${userData.zip_code ? userData.zip_code : ''}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Entity Type</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>${t3}</p>
                            </div>
                         </div>
                         <div class="row border  bg-light">
                            <p><b class="">Bank Details(Supporting document required)</b></p>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Mode of Payment</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>${userData.mode_of_payment}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Bank Name</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>${userData.bank_name ? userData.bank_name : '-'}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Bank Address Line 1</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.bank_address ? userData.bank_address : ''}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Bank Country</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>${userData.country ? userData.country : '-'}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Zip Code</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.zip_code ? userData.zip_code : '-'}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Bank Account No</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>  ${userData.account_no ? userData.account_no : '-'}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>IFSC Code</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.ifsc_code ? userData.ifsc_code : '-'}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>MICR Code</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.micr_code ? userData.micr_code : '-'}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Swift Code</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p></p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Cancelled Cheque</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p></p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>IBAN No.</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>${userData.vendor_id.ban_number_input ? userData.vendor_id.ban_number_input : ''}</p>
                            </div>
                         </div>



                         <div class="row border  bg-light">
                         <div class="col-3 border-right">
                             <p><b>Pro/Par/Dir Name</b></p>
                         </div>
             
                         <div class="col-3 border-right">
             
                             <p> <b>Pro/Par/Dir Designation</b></p>
                         </div>
                         <div class="col-3 border-right">
                             <p> <b>Pro/Par/Dir Mobile </b></p>
                         </div>
                         <div class="col-3">
                             <p><b>Pro/Par/Dir Email</b></p>
                         </div>
             
                     </div>
                     ${t}
                     <div class="row border  bg-light">
                         <div class="col-3 border-right">
                             <p><b>Sales/ Mkt Name</b></p>
                         </div>
             
                         <div class="col-3 border-right">
             
                             <p> <b>Sales/ Mkt Designation</b></p>
                         </div>
                         <div class="col-3 border-right">
                             <p> <b>Sales/ Mkt Mobile </b></p>
                         </div>
                         <div class="col-3">
                             <p><b>Sales/ Mkt Email</b></p>
                         </div>
             
                     </div>
                     <div class="row border">
                         <div class="col-3 border-right">
                             <p>${userData.sale_data[0].s_name}</p>
                         </div>
             
                         <div class="col-3 border-right">
             
                             <p> ${userData.sale_data[0].s_designation}</p>
                         </div>
                         <div class="col-3 border-right">
                             <p> ${userData.sale_data[0].s_number}</p>
                         </div>
                         <div class="col-3 p-1">
                             <p>${userData.sale_data[0].s_email}</p>
                         </div>
             
                     </div>
                     <div class="row border  bg-light">
                         <div class="col-3 border-right">
                             <p><b>Accounts Person Name</b></p>
                         </div>
             
                         <div class="col-3 border-right">
             
                             <p> <b>Accounts Person Designation</b></p>
                         </div>
                         <div class="col-3 border-right">
                             <p> <b>Accounts Person Mobile </b></p>
                         </div>
                         <div class="col-3">
                             <p><b>Accounts Person Email</b></p>
                         </div>
             
                     </div>
                     <div class="row border">
                         <div class="col-3 border-right">
                             <p> ${userData.p_name ? userData.p_name : ''}</p>
                         </div>
             
                         <div class="col-3 border-right">
             
                             <p> ${userData.p_designation ? userData.p_designation : ''}</p>
                         </div>
                         <div class="col-3 border-right ">
                         <p>${userData.p_contact ? userData.p_contact : ''}</p>
                         </div>
                         <div class="col-3 p-1">
                             <p>${userData.p_email ? userData.p_email : ''}</p>
                         </div>
             
                     </div>


                         


                         <div class="row border  bg-light">
                            <p><b class="">Purchasing Data</b></p>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Default Currency</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.default_currency ? userData.default_currency : ''}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Payment Terms </b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.payment_terms ? userData.payment_terms : ''}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Incoterms/Location </b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>${userData.incoterms_location ? userData.incoterms_location : ''}</p>
                            </div>
                         </div>
                         <div class="row border  bg-light">
                            <p><b class="">Control</b></p>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>GST Number </b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <div class="row">
                                  <div class="col-7">
                                     <p>  ${userData.gst_number ? userData.gst_number : ''}</p>
                                  </div>
                                  <div class="col-1 border"></div>
                                  <div class="col-4">
                                     <p><b>GST Regn Certificate </b></p>
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>GST Range </b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>${userData.gst_range ? userData.gst_range : ''}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>GST Division </b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.gst_division ? userData.gst_division : ''}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>GST Commissionerate </b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p> ${userData.gst_commissionerate ? userData.gst_commissionerate : ''}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>HSN Code/SAC Code </b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <p>${userData.hsn_sac ? userData.hsn_sac : ''}</p>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>PAN Number </b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <div class="row">
                                  <div class="col-7">
                                     <p> ${userData.pan_card_number ? userData.pan_card_number : ''}</p>
                                  </div>
                                  <div class="col-1 border"></div>
                                  <div class="col-4">
                                     <p><b>Copy of PAN attach</b></p>
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>MSME no.(if applicable) </b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <div class="row">
                                  <div class="col-7">
                                     <p>${userData.msme_no ? userData.msme_no : ''}</p>
                                  </div>
                                  <div class="col-1 border"></div>
                                  <div class="col-4">
                                     <p><b>MSME Regn Certificate </b></p>
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div class="row">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>SSI Reg no.(if applicable) </b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <div class="row">
                                  <div class="col-7">
                                     <p> ${userData.ssi_no ? userData.ssi_no : ''}</p>
                                  </div>
                                  <div class="col-1 border"></div>
                                  <div class="col-4">
                                     <p><b>SSI Regn Certificate </b></p>
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div class="row ">
                            <div class="col-3 border-left border-right border-bottom ">
                               <p><b>Supplier Code Conduct</b></p>
                            </div>
                            <div class="col-9  border-left border-right border-bottom  ">
                               <div class="row">
                                  <div class="col-7">
                                     <p>${userData.code_of_conduct ? userData.code_of_conduct : ''}</p>
                                  </div>
                                  <div class="col-1 border"></div>
                                  <div class="col-4">
                                     <p><b>acknowledgment attach</b></p>
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div class="row border">
                            <div class="col-12">
                               <p><span style="color: red;">*</span> Mandatory input</p>
                            </div>
                            <div class="col-12">
                               <p><span style="color: red;">***</span> Please Provide the cancelled cheque or bank details in latter
                                  head duly authorized by appropriate person
                               </p>
                            </div>
                         </div>
                         <div class="row border">
                         ${t2}
                            
                         </div>
                      </div>
                      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
                         integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
                         crossorigin="anonymous"></script>
                      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"
                         integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
                         crossorigin="anonymous"></script>
                      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js"
                         integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
                         crossorigin="anonymous"></script>
                   </body>
                </html>`

                var opt = {
                    margin: 0.2,
                    filename: `${userData.vendor_id.name}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 1 },  // Adjust the scale to fit all content on one page
                    jsPDF: {
                        unit: 'in',
                        format: 'letter',
                        orientation: 'portrait'
                    },
                    pagebreak: { mode: 'avoid-all' }
                };



                html2pdf().from(invoice).set(opt).save();

            }

        })


    },

    view_vendor: function (e) {
        let self = this;
        let row = $(e).closest('tr');
        let obj = $('#vendor_table').dataTable().fnGetData(row);
        var id = obj._id



        var $request = $.ajax({
            url: `${vendor.base_url}/vendor/get_firm_data_by_vendor_id/${id}`,
            type: "GET",
            dataType: "json",
            contentType: "application/json",

        });

        $request.done(function (data) {

            if (data.status) {


                var info = data.data[0]

                console.log(info)


                $("#vendor_name").text(info.vendor_id.name ? info.vendor_id.name : "-")
                $("#mobile_number").val(info.vendor_id.mobile_number ? info.vendor_id.mobile_number : "")
                $("#name").val(info.vendor_id.name ? info.vendor_id.name : "")

                $("#email").val(info.vendor_id.email ? info.vendor_id.email : "")
                $("#firm_type").val(info.vendor_id.firm_type ? info.vendor_id.firm_type : "")
                $("#address").val(info.address ? info.address : "")
                $("#state").val(info.state ? info.state : "")
                $("#address1").val(info.address1 ? info.address1 : "")
                $("#zip_code").val(info.zip_code ? info.zip_code : "")
                $("#city").val(info.city ? info.city : "")
                $("#city1").val(info.city1 ? info.city1 : "")
                $("#gst_number").val(info.gst_number ? info.gst_number : "")
                $("#pan_card_number").val(info.pan_card_number ? info.pan_card_number : "")
                $("#bank_name").val(info.bank_name ? info.bank_name : "")
                $("#account_no").val(info.account_no ? info.account_no : "")
                $("#bank_address").val(info.bank_address ? info.bank_address : "")
                $("#ifsc_code").val(info.ifsc_code ? info.ifsc_code : "")
                $("#d_name").val(info.d_name ? info.d_name : "")
                $("#d_contact").val(info.d_contact ? info.d_contact : "")
                $("#d_email").val(info.d_email ? info.d_email : "")
                $("#s_name").val(info.s_name ? info.s_name : "")
                $("#s_number").val(info.s_number ? info.s_number : "")
                $("#s_email").val(info.s_email ? info.s_email : "")
                $("#p_name").val(info.p_name ? info.p_name : "")
                $("#p_contact").val(info.p_contact ? info.p_contact : "")
                $("#p_email").val(info.p_email ? info.p_email : "")
                $("#p_designation").val(info.p_designation ? info.p_designation : "")
                $("#p_alternate_contact").val(info.p_alternate_contact ? info.p_alternate_contact : "")
                $("#p_alternate_email").val(info.p_alternate_email ? info.p_alternate_email : "")
                $("#country").val(info.country ? info.country : "")


                // -------new filed-------------------//
                $("#mode_of_payment").val(info.mode_of_payment ? info.mode_of_payment : "")
                $("#micr_code").val(info.micr_code ? info.micr_code : "")
                $("#default_currency").val(info.default_currency ? info.default_currency : "")
                $("#incoterms_location").val(info.incoterms_location ? info.incoterms_location : "")
                $("#gst_range").val(info.gst_range ? info.gst_range : "")
                $("#gst_division").val(info.gst_division ? info.gst_division : "")
                $("#gst_commissionerate").val(info.gst_commissionerate ? info.gst_commissionerate : "")
                $("#hsn_sac").val(info.hsn_sac ? info.hsn_sac : "")
                $("#msme_no").val(info.msme_no ? info.msme_no : "")
                $("#ssi_no").val(info.ssi_no ? info.ssi_no : "")
                $("#payment_terms").val(info.payment_terms ? info.payment_terms : "")

                $("#accounting_ref").val(info.accounting_ref ? info.accounting_ref : "")
                $("#sales_ref").val(info.sales_ref ? info.sales_ref : "")
                $("#delivery_terms").val(info.delivery_terms ? info.delivery_terms : "")
                $("#financial_supplier").val(info.financial_supplier ? info.financial_supplier : "")
                $("#s_name_as_per_name").val(info.s_name_as_per_name ? info.s_name_as_per_name : "")
                $("#supplier_type").val(info.supplier_type ? info.supplier_type : "")
                $("#type_of_item").val(info.type_of_item ? info.type_of_item : "")









                var value = info.country

                if (value != "") {
                    if (value == "India") {

                    } else {
                        $(".ifsc_label").text("Swift Code")
                    }

                }





                var img = ""


                if (info.gst_url.length > 0) {

                    info.gst_url.map(info => {
                        var ex = info.split('.').pop()

                        if (ex == "mp4") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                       
                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                   
                    </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`

                        }


                    })


                }
                $("#gst_documents_section").html("")
                $("#gst_documents_section").append(img)




                var img = ""


                if (info.pan_url.length > 0) {

                    info.pan_url.map(info => {
                        var ex = info.split('.').pop()

                        if (ex == "mp4") {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">

                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                            </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                   
                    </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`

                        }

                    })

                }
                $("#pan_documents_section").html("")
                $("#pan_documents_section").append(img)



                var img = ""
                if (info.noc_url.length > 0) {

                    info.noc_url.map(info => {
                        var ex = info.split('.').pop()
                        if (ex == "mp4") {
                            img += `<div class="mx-1 remove_img_section noc_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                            
                            </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section noc_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                       
                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`

                        }

                    })


                }
                $("#noc_documents_section").html("")
                $("#noc_documents_section").append(img)


                var img = ""

                var html = ""
                if (info.cheque_url.length > 0) {
                    info.cheque_url.map(info => {
                        var ex = info.split('.').pop()

                        if (ex == "mp4") {
                            img += `<div class="mx-1 remove_img_section cheque_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                       
                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section cheque_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    
                    </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`

                        }



                    })




                }
                $("#cheque_documents_section").html("")
                $("#cheque_documents_section").append(img)



                var img = ""


                if (info.msme_attachment.length > 0) {

                    info.msme_attachment.map(info => {
                        var ex = info.split('.').pop()

                        if (ex == "mp4") {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">

                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                            </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                   
                    </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`

                        }

                    })

                }
                $("#msme_documents_section").html("")
                $("#msme_documents_section").append(img)





                var img = ""


                if (info.ssi_attachment.length > 0) {

                    info.ssi_attachment.map(info => {
                        var ex = info.split('.').pop()

                        if (ex == "mp4") {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">

                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                            </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                   
                    </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`

                        }

                    })

                }
                $("#ssi_documents_section").html("")
                $("#ssi_documents_section").append(img)



                var img = ""


                if (info.code_of_conduct_attachment.length > 0) {

                    info.code_of_conduct_attachment.map(info => {
                        var ex = info.split('.').pop()

                        if (ex == "mp4") {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">

                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                            </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                   
                    </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`

                        }

                    })

                }
                $("#code_of_conduct_attachment").html("")
                $("#code_of_conduct_attachment").append(img)



                var img = ""


                if (info.it_deceleration_attachment.length > 0) {

                    info.it_deceleration_attachment.map(info => {
                        var ex = info.split('.').pop()

                        if (ex == "mp4") {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">

                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                            </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                   
                    </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`

                        }

                    })

                }
                $("#it_deceleration_attachment").html("")
                $("#it_deceleration_attachment").append(img)


                var html = ""
                var add_more = ""

                if (info.contact_section_data.length > 0) {

                    info.contact_section_data.map((data, i) => {

                        var pan_section = ""
                        if (data.pan_url.length > 0) {
                            data.pan_url.map(img_url => {
                                var ex = img_url.split('.').pop()

                                if (ex == "mp4") {
                                    pan_section += `<div class="mx-1 remove_img_section pan_array_class_property"><img src="images/video.jpg" class="get_img_section" data-img='${img_url}'   width=100px alt="Img">
                            
                              </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                                } else if (ex == "pdf") {
                                    pan_section += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${img_url}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${img_url}'    width=100px alt="Img"></a>
                       
                        </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`
                                }
                                else {
                                    pan_section += `<div class="mx-1 remove_img_section pan_array_class_property"><img src="${vendor.base_url}/files/${img_url}" class="get_img_section" data-img='${img_url}'   width=100px alt="Img">
                          
                          </div><a href="${vendor.base_url}/files/${info}" download><i class="mdi mdi-arrow-down mx-2" title="Download"  style="font-size:24px;color:#4B49AC;cursor: pointer;" ></i></a>`

                                }





                            })

                        }

                        if (i != 0) {
                            add_more = ` <div class="col-md-12 remove" style="text-align: end;">
                            <a class="btn btn-danger mb-3" onclick="vendor.remove_block(this)">Remove</a>
                          </div>`

                        }
                        html += ` <div class="row get_contact_section">
                       
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label d_name_label">
                              Name</label>
                            <div class="col-sm-9">
                              <input type="text" class="form-control d_name" placeholder="Enter Name" required=""
                                data-parsley-required-message="Please Enter Name" value="${data.d_name}" disabled />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label d_designation_label">Designation</label>
                            <div class="col-sm-9">
                              <input type="text" class="form-control d_designation" placeholder="Enter Designation"
                                required="" data-parsley-required-message="Please Enter Designation" value="${data.d_designation}" disabled />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label d_contact_label">
                              Contact</label>
                            <div class="col-sm-9">
                              <input type="number" class="form-control d_contact " id="" placeholder="Enter Contact Number"
                                required="" data-parsley-required-message="Please Enter Contact" value="${data.d_contact}" disabled />
                            </div>
                          </div>
                        </div>
  
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label d_contact_alternate_label">
                              Alternate Contact</label>
                            <div class="col-sm-9">
                              <input type="number" class="form-control d_contact_alternate" id=""
                                placeholder="Enter Contact Number" required=""
                                data-parsley-required-message="Please Enter Contact" value="${data.d_contact_alternate}" disabled />
                            </div>
                          </div>
                        </div>
  
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label d_email_label">
                              Email</label>
                            <div class="col-sm-9">
                              <input type="email" class="form-control d_email" id="" placeholder="Enter Email" required=""
                                data-parsley-required-message="Please Enter Email" value="${data.d_email}" disabled/>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label d_email_alternate_label">
                              Alternate Email</label>
                            <div class="col-sm-9">
                              <input type="email" class="form-control d_email_alternate" id="" placeholder="Enter Email"
                                required="" data-parsley-required-message="Please Enter Email" value="${data.d_email_alternate}"  disabled/>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 pan_for_partnership" style="display: none;">

                        <div class="form-group row">
                          <label class="col-sm-3 col-form-label">Pan Card Number</label>
                          <div class="col-sm-9  pan_verify_btn_section_input">
                            <input type="text" class="form-control pan_verify_input" id=""
                              placeholder="Enter Pan Card Number" required=""
                              data-parsley-required-message="Please Enter Pan Number" value="${data.pan_number}" disabled/>
                          </div>
                          
                        </div>  
  
  
                      </div>
                      <div class="col-md-6 pan_for_partnership"   style="display: none;">
                        <div class="form-group row">
                          <label class="col-sm-3 col-form-label">PAN Card</label>
                          <div class="col-sm-9">
                           
                            <div class="img_pre mt-2" id="pan_documents_section_1" style="display: flex;">

                            ${pan_section}
                            </div>
                          </div>
                        </div>
  
  
  
  
                      </div>
                      </div>`
                    })

                    $("#contact_section").html("")
                    $("#contact_section").append(html)

                }

                var html = ""
                var add_more = ""

                if (info.sale_data.length > 0) {

                    info.sale_data.map((data, i) => {

                        if (i != 0) {
                            add_more = ` <div class="col-md-12 remove" style="text-align: end;">
                            <a class="btn btn-danger mb-3" onclick="register.remove_block(this)">Remove</a>
                          </div>`

                        }
                        html += `  <div class="row get_sale_data">
                       
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Name </label>
                            <div class="col-sm-9">
                              <input type="text" class="form-control s_name" value="${data.s_name}" id="" placeholder="Enter Name" required=""
                                data-parsley-required-message="Please Enter  Name"  disabled/>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Designation </label>
                            <div class="col-sm-9">
                              <input type="text" class="form-control s_designation" value="${data.s_designation}" id="" placeholder="Enter Designation" required=""
                                data-parsley-required-message="Please Enter Designation"  disabled/>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Contact </label>
                            <div class="col-sm-9">
                              <input type="number" class="form-control s_number" id="" value="${data.s_number}" placeholder="Enter Contact Number"
                                required="" data-parsley-required-message="Please Enter Contact"  disabled/>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Alternate Contact </label>
                            <div class="col-sm-9">
                              <input type="number" class="form-control s_number_alternate" value="${data.s_number_alternate}" id=""
                                placeholder="Enter Contact Number" required=""
                                data-parsley-required-message="Please Enter Contact"  disabled/>
                            </div>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Email </label>
                            <div class="col-sm-9">
                              <input type="email" class="form-control s_email" id="" value="${data.s_email}" placeholder="Enter Email" required=""
                                data-parsley-required-message="Please Enter Email"  disabled/>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Alternate Email </label>
                            <div class="col-sm-9">
                              <input type="email" class="form-control s_email_alternate" value="${data.s_email_alternate}" id="" placeholder="Enter Email" required=""
                                data-parsley-required-message="Please Enter Email"  disabled/>
                            </div>
                          </div>
                        </div>
                      </div>`
                    })

                    $("#sales_section").html("")
                    $("#sales_section").append(html)

                }

                if (info.vendor_id.firm_type == 1) {

                    $(".add_more").css("display", "none")

                }


                var value = 0

                if (info.vendor_id != undefined) {
                    value = info.vendor_id.firm_type
                }


                if (value == 1) {
                    $(".d_name_label").text("Proprietor Name")
                    $(".d_designation_label").text("Proprietor Designation")
                    $(".d_contact_label").text("Proprietor Contact")
                    $(".d_contact_alternate_label").text("Proprietor Alternate Contact")
                    $(".d_email_label").text("Proprietor Email")
                    $(".d_email_alternate_label").text("Proprietor Alternate Email")


                } else if (value == 2) {

                    $(".d_name_label").text("Partner Name")
                    $(".d_designation_label").text("Partner Designation")
                    $(".d_contact_label").text("Partner Contact")
                    $(".d_contact_alternate_label").text("Partner Alternate Contact")
                    $(".d_email_label").text("Partner Email")
                    $(".d_email_alternate_label").text("Partner Alternate Email")
                    $(".pan_for_partnership").css("display", "block")

                } else if (value == 3 || value == 4) {

                    $(".d_name_label").text("Director Name")
                    $(".d_designation_label").text("Director Designation")
                    $(".d_contact_label").text("Director Contact")
                    $(".d_contact_alternate_label").text("Director Alternate Contact")
                    $(".d_email_label").text("Director Email")
                    $(".d_email_alternate_label").text("Director Alternate Email")
                }

                vendor.load_sign(info.vendor_id._id)
                $("#view_model_btn").click()





            }



        })



    },
    load_sign: function (id) {

        var $request = $.ajax({
            url: `${vendor.base_url}/vendor/get_sign_section/${id}`,
            type: "GET",
            dataType: "json",
            contentType: "application/json",

        });

        $request.done(function (data) {
            console.log(data)

            if (data.status) {

                var html = ""
                data.data.map(info => {

                    // Given timestamp
                    const timestamp = info.createdAt

                    // Convert timestamp to Date object
                    const date = new Date(timestamp);

                    // Extract date components
                    const day = date.getDate();
                    const month = date.getMonth() + 1; // Months are zero-based, so we add 1
                    const year = date.getFullYear();

                    // Extract time components
                    let hours = date.getHours();
                    const minutes = date.getMinutes();
                    let amOrPm = "AM";

                    // Adjust hours to 12-hour format and determine AM/PM
                    if (hours >= 12) {
                        amOrPm = "PM";
                        hours -= 12;
                    }

                    // Format hours with leading zero if necessary
                    const formattedHours = hours.toString().padStart(2, "0");

                    // Format date and time in the desired format
                    const formattedDate = `${day}-${month}-${year}`;
                    const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;

                    // Output the converted timestamp
                    const convertedTimestamp = `${formattedDate} ${formattedTime}`;
                    console.log(convertedTimestamp);


                    html += ` <div class="col-3 border mt-2">
                    <img src="${vendor.base_url}/files/${info.approved_user.sign}" width="100%" alt="">
                    <p class="text-center">${info.approved_user.name} (${info.approved_user.user_status})</p>
                    <p  class="text-center">${convertedTimestamp}</p>

                </div>`

                })


                $("#sign_section_area").html("")
                $("#sign_section_area").append(html)

            } else {

            }
        })

    },
    view_time_line: function (e) {
        let self = this;
        let row = $(e).closest('tr');
        let obj = $('#vendor_table').dataTable().fnGetData(row);
        var id = obj._id


        $("#timeline_btn").click()
        var $request = $.ajax({
            url: `${vendor.base_url}/vendor/get_timeline_data_by_vendor_id/${id}`,
            type: "GET",
            dataType: "json",
            contentType: "application/json",

        });

        $request.done(function (data) {

            if (data.status) {

                var html = ""

                $("#vendor_name_timeline").text(obj.name)
                data.data.map(info => {


                    var img = ""
                    if (info.attachment != undefined) {

                        if (info.attachment.length > 0) {
                            info.attachment.map(info1 => {
                                console.log("info1", info1)

                                var ex = info1.split('.').pop()
                                if (ex == "mp4") {
                                    img += `<div class="mx-1 remove_img_section revert_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info1}'   style="max-width:100%" alt="Img">
                                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info1}' onclick="vendor.remove_project_images(this)"></i></a>
                                    </div>`
                                } else if (ex == "pdf") {
                                    img += `<div class="mx-1 remove_img_section revert_array_class"><a class="a_tag" href="${vendor.base_url}/files/${info1}" target="_blank" download="new-filename"><img src="images/pdf.png" class="get_img_section" data-img='${info1}'  style="max-width:100%" alt="Img"></a>
                                    </div>`
                                } else if (ex == "mp3" || ex == "ogg") {
                                    img += `<div class="mx-1 remove_img_section revert_array_class" >
                          <audio controls class="get_img_section" data-img='${info1}'>
                          <source src="${vendor.base_url}/files/${info1}" type="audio/mpeg">
                         
                        </audio>
                                      <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="vendor.remove_project_images(this)"></i></a>
                                      </div>`
                                }
                                else {
                                    img += ` <img src="${vendor.base_url}/files/${info1}" onclick="vendor.show_img(this)" data-url="${vendor.base_url}/files/${info1}"    style="cursor: pointer;max-width:100%" class="my-2 mx-2"
                                    alt="">`

                                }

                            })


                        }

                    }

                    html += `    <div class="card1">
                    <div class="info">
                        <h3 class="title">${info.type ? info.type : "-"}</h3>
                        <ul>
                            <li><b>Date: </b> ${info.createdAt ? moment(info.createdAt).format('MMMM Do, YYYY') : "-"} </li>
                            <li><b>Operator: </b> ${info.operator_by ? info.operator_by.name : "-"} </li>
                            <li><b>Operator Type: </b> ${info.operator_type ? info.operator_type : "-"} </li>
                            <li><b>Forwarded: </b>${info.forwarded_to ? info.forwarded_to.name : "-"} </li>
                            <li><b>Forwarded User: </b> ${info.forwarded_to ? info.forwarded_to.user_status : "-"} </li>
                            <li><b>Comment: </b> ${info.comment ? info.comment : "-"} </li>
                            <li><b>Attachment: </b> <div> ${img}</div> </li>

                            
                        </ul>


                    </div>
                </div>`
                })


                $("#timeline_data").html("")
                $("#timeline_data").append(html)

            }
        })




    },
    show_img: function (e) {
        var url = $(e).attr("data-url")


        Swal.fire({
            imageUrl: `${url}`,
            imageAlt: 'Image',
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                image: 'mt-5'
            }
        });
    },












};





