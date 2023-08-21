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

                        if (data == null || data == "") {
                            return '-';
                        } else {
                            return  `<a class="btn btn-success"> Approved </a>`;
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
                console.log(data)

                var userData = data.data

                var t = ""

                userData.contact_section_data.map(info => {

                    t += `<div class="row">
                    <div class="col-3" style="margin-bottom: -15px !important;">
                       <p>&nbsp;&nbsp;Prop/Partner Name</p>
                    </div>
                    <div class="col-9" style="margin-bottom: -15px !important;">
                       <b>:&nbsp;</b> <span>
                       ${info.d_name}
                       </span>
                    </div>
                    <div class="col-3" style="margin-bottom: -15px !important;">
                       <p>&nbsp;&nbsp;Prop/Partner Contact</p>
                    </div>
                    <div class="col-9" style="margin-bottom: -15px !important;">
                       <b>:&nbsp;</b> <span>
                      
                       ${info.d_contact}
                       </span>
                    </div>
                    <div class="col-3" style="margin-bottom: -15px !important;">
                       <p> &nbsp;&nbsp;Prop/Partner Alt </p>
                    </div>
                    <div class="col-9" style="margin-bottom: -15px !important;">
                       <b>:&nbsp;</b> <span>
                       
                       ${info.d_contact_alternate}
                       </span>
                    </div>
                    <div class="col-3" style="margin-bottom: -15px !important;">
                       <p>&nbsp;&nbsp;Prop/Partner Email</p>
                    </div>
                    <div class="col-9" style="margin-bottom: -15px !important;">
                       <b>:&nbsp;</b> <span>
                     
                       ${info.d_email}
                       </span>
                    </div>
                    <div class="col-3" style="margin-bottom: -15px !important;">
                       <p>&nbsp;&nbsp;Prop/Partner Alt Email</p>
                    </div>
                    <div class="col-9" style="margin-bottom: -15px !important;">
                       <b>:&nbsp;</b> <span>
                     
                       ${info.d_email_alternate}
                       </span>
                    </div>
                 </div>
                 <hr>`

                })


                var t2 = ""

                userData.sign_masters.map((info) => {
                    t2 += `<div class="col-4 border mt-3">
                    <img src=" ${userData.base_url}/files/${info.admin_users.sign}" width="100%" alt="">
                    <p class="text-center">${info.admin_users.name} (${info.admin_users.user_status})</p>
                    <p class="text-center">${info.admin_users.name}></p>
                 </div>`

                })

                var value = "${userData.vendor_id.firm_type ? userData.vendor_id.firm_type : ''}";
                var t3 = ""
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



                

                const dateObj = new Date();

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

                console.log(desiredFormat);

                const invoice = `<!doctype html>
                <html lang="en">
                   <head>
                      <!-- Required meta tags -->
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                      <!-- Bootstrap CSS -->
                      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
                         integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                      <link rel="preconnect" href="https://fonts.googleapis.com">
                      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500&display=swap" rel="stylesheet">
                      <title>Vendor Register Form</title>
                      <style>
                         body {
                         font-family: 'Rajdhani', sans-serif;
                         font-weight: 500;
                         }
                         p {
                         font-size: 18px;
                         }
                         span {
                         font-size: 16px;
                         }
                      </style>
                   </head>
                   <body>
                      <div class="container mt-3 ">
                         <div class="row">
                            <div class="col-4">
                               <p style="margin: 0px;"><b>Date : <span id="date_text">${desiredFormat}</span></b></p>
                               <p style="margin: 0px;">Cryolor Asia Pacific Pvt Ltd</p>
                            </div>
                            <div class="col-5">
                               <h5> <b>Vendor Registration Details</b></h5>
                            </div>
                            <div class="col-3" id="logo_section">
                            <img src="${userData.base_url}/images/logo.jpg" width="100%" alt="logo">
                            </div>
                         </div>
                         <hr>
                         <div class="row border p-2">
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>BAAN Number</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.vendor_id.ban_number_input ? userData.vendor_id.ban_number_input : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Supplier</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b><span>
                               <b>
                               ${userData.vendor_id.name ? userData.vendor_id.name : ''}
                               </b>
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Address</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.address ? userData.address : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Address2</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.address1 ? userData.address1 : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>City</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.city ? userData.city : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>City2</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.city1 ? userData.city1 : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Zip Code</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.zip_code ? userData.zip_code : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Accounting Reference</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.accounting_ref ? userData.accounting_ref : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Sales Reference</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.sales_ref ? userData.sales_ref : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Terms of Payment</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.payment_terms ? userData.payment_terms : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Terms of Delivery</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.delivery_terms ? userData.delivery_terms : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Country</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.country ? userData.country : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Currency</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.default_currency ? userData.default_currency : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Financial Supplier Group </p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.vendor_id.financial_supplier ? userData.vendor_id.financial_supplier : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Email </p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.vendor_id.email ? userData.vendor_id.email : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Telephone </p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.vendor_id.mobile_number ? userData.vendor_id.mobile_number : ''}
                               </span>
                            </div>
                         </div>
                         <div class="row border p-2 mt-3">
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Sup. Name as per Bank</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.s_name_as_per_name ? userData.s_name_as_per_name : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Bank Name</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.bank_name  ? userData.bank_name  : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Bank Account No</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.account_no ? userData.account_no : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Bank Address</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.bank_address ? userData.bank_address : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Country</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.country ? userData.country : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>IFSC Code</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.ifsc_code ? userData.ifsc_code : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>IBAN No.</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.account_no ? userData.account_no : '' }
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>MICR</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.micr_code ? userData.micr_code : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Vendor Callback</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span></span>
                            </div>
                         </div>
                         <div class="row border p-2 ">
                                ${t}
                         </div>
                         <div class="row border p-2 ">
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Sale Name</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.sale_data[0].s_name ? userData.sale_data[0].s_name : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Sale Contact</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              

                               ${userData.sale_data[0].s_number ? userData.sale_data[0].s_number : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Sale Alternate Contact</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.sale_data[0].s_number_alternate ? userData.sale_data[0].s_number_alternate : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Sale Email</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.sale_data[0].s_email ? userData.sale_data[0].s_email : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Sale Alternate Email</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.sale_data[0].s_email_alternate ? userData.sale_data[0].s_email_alternate : ''}
                               </span>
                            </div>
                         </div>
                         <div class="row border p-2 ">
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Account Person Name</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.p_name ? userData.p_name : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Account Person Contact</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               
                               ${userData.p_contact ? userData.p_contact : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Account Person Alternate Contact</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.p_alternate_contact ? userData.p_alternate_contact : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Account Person Email</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.p_email ? userData.p_email : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Account Person Alternate Email</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.p_alternate_email ? userData.p_alternate_email : ''}
                               </span>
                            </div>
                         </div>
                         <div class="row border p-2 ">
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>GST Registration No.</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               
                               ${userData.gst_number ? userData.gst_number : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Range</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.gst_range ? userData.gst_range : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Supplier Type</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                             
                               ${userData.supplier_type ? userData.supplier_type : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>HSN/SAC</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.hsn_sac ? userData.hsn_sac : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>GST Division</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                              
                               ${userData.gst_division ? userData.gst_division : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Pan Number</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.pan_card_number ? userData.pan_card_number : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>GST Commissionerate</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.gst_commissionerate ? userData.gst_commissionerate : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Type of Item</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.type_of_item ? userData.type_of_item : ''}
                               </span>
                            </div>
                         </div>
                         <div class="row border p-2 ">
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>MSME Registered</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.msme_no ? userData.msme_no : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>SSI Registered</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.ssi_no ? userData.ssi_no : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Entity Type</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span id="firm_type">${t3} </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Name Of Owner</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.vendor_id.name ? userData.vendor_id.name : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Owner Contact</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.vendor_id.mobile_number ? userData.vendor_id.mobile_number : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Date Of Entry</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.type_of_item ? userData.type_of_item : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Created by</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span>
                               ${userData.type_of_item ? userData.type_of_item : ''}
                               </span>
                            </div>
                            <div class="col-3" style="margin-bottom: -15px !important;">
                               <p>Code of Conduct Ack.Done</p>
                            </div>
                            <div class="col-9" style="margin-bottom: -15px !important;">
                               <b>:&nbsp;</b> <span></span>
                            </div>
                         </div>
                         <hr>
                         <div class="row" id="sign_section_area">
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
                      <script>
                         $(document).ready(function () {
                             $(function () {
                                 
                         
                         
                         
                              
                         
                                
                         
                         
                                
                         
                         
                         
                         
                         
                         
                         
                         
                             });
                         });
                      </script>
                   </body>
                </html>`

                var opt = {
                    margin: 1,
                    filename: `${userData.vendor_id.name}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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





