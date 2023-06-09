var vendor = {
    base_url: null,
    init: function () {
        vendor.bind_events()
        vendor.list_vendor()





    },
    bind_events: function (e) {

        $('#vendor_register').submit(function (event) {
            event.preventDefault(); // Prevent default form submission
            $("#submit_data").attr("disabled", true);

            // Perform form validation using Parsley or other validation libraries
            if ($('#vendor_register').parsley().isValid()) {
                vendor.add_vendor()
            }
        })
    },
    list_vendor: function (e) {
        $('#vendor_table').DataTable({
            "ajax": {
                "url": this.base_url + "/vendor/new_list_vendor",
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
                // {
                //     'data': 'firm_type',
                //     'sTitle': 'Firm Type',
                //     'render': function (data, type, row) {

                //         if (data == null || data == "") {
                //             return '-';
                //         } else {
                //             if (data == 0) {

                //             } else if (data == 1) {
                //                 return "Proprietorship"
                //             } else if (data == 2) {
                //                 return "Partnership"
                //             } else if (data == 3) {
                //                 return "Private Ltd"
                //             } else {
                //                 return "Public Ltd"
                //             }
                //         }

                //     }

                // },
                {
                    'data': 'link_status',
                    'sTitle': 'Link Status',
                    'render': function (data, type, row) {


                        // return data;
                        if (data == 0) {
                            return "Not Send Yet."
                        } else {
                            return "Send Already send."
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
                            return data;
                        }

                    }

                },
                {
                    'data': '',
                    'sTitle': 'View',
                    'class': 'center',
                    'render': function (data, type, row) {
                        return ' <i class="mdi mdi-eye mx-2" title="View" onclick="vendor.view_vendor(this)"   style="font-size:24px;color:#4B49AC; cursor: pointer; display:none;"></i>  <i class="mdi mdi-timer mx-2" title="Timeline"  style="font-size:24px;color:#4B49AC;cursor: pointer;" onclick="vendor.view_time_line(this)"></i>'
                    }
                },
                {
                    'data': 'link_status',
                    'sTitle': 'Action',
                    //'class': 'center',
                    'render': function (data, type, row) {
                        if (data == 0) {
                            return '<a class="btn btn-success" onclick="vendor.send_link(this)" title="Send Link"> Send Link </a>'
                        } else {

                            return '<a class="btn btn-success" onclick="vendor.send_link(this)" title="Send Link"> Resend Link </a>'

                        }
                    }
                }





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
    send_link_after_register: function (data) {
       
        var obj = data
        obj.operator_by = sessionStorage.getItem("user_id")
        obj.operator_type = sessionStorage.getItem("user_status")

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
                       
                        </div>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                        </div>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                   
                    </div>`

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

                        </div>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                            </div>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                   
                    </div>`

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
                            
                            </div>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                        </div>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section noc_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                       
                        </div>`

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
                       
                        </div>`
                        } else if (ex == "pdf") {
                            img += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${info}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${info}'    width=100px alt="Img"></a>
                       
                        </div>`
                        }
                        else {
                            img += `<div class="mx-1 remove_img_section cheque_array_class"><img src="${vendor.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    
                    </div>`

                        }



                    })




                }
                $("#cheque_documents_section").html("")
                $("#cheque_documents_section").append(img)


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
                            
                              </div>`
                                } else if (ex == "pdf") {
                                    pan_section += `<div class="mx-1 remove_img_section gst_array_class"><a href="${vendor.base_url}/files/${img_url}" target="_blank"><img src="images/pdf.png" class="get_img_section" data-img='${img_url}'    width=100px alt="Img"></a>
                       
                        </div>`
                                }
                                else {
                                    pan_section += `<div class="mx-1 remove_img_section pan_array_class_property"><img src="${vendor.base_url}/files/${img_url}" class="get_img_section" data-img='${img_url}'   width=100px alt="Img">
                          
                          </div>`

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
                                data-parsley-required-message="Please Enter Name" value="${data.d_name}" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label d_designation_label">Designation</label>
                            <div class="col-sm-9">
                              <input type="text" class="form-control d_designation" placeholder="Enter Designation"
                                required="" data-parsley-required-message="Please Enter Designation" value="${data.d_designation}" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label d_contact_label">
                              Contact</label>
                            <div class="col-sm-9">
                              <input type="number" class="form-control d_contact " id="" placeholder="Enter Contact Number"
                                required="" data-parsley-required-message="Please Enter Contact" value="${data.d_contact}" />
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
                                data-parsley-required-message="Please Enter Contact" value="${data.d_contact_alternate}" />
                            </div>
                          </div>
                        </div>
  
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label d_email_label">
                              Email</label>
                            <div class="col-sm-9">
                              <input type="email" class="form-control d_email" id="" placeholder="Enter Email" required=""
                                data-parsley-required-message="Please Enter Email" value="${data.d_email}" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label d_email_alternate_label">
                              Alternate Email</label>
                            <div class="col-sm-9">
                              <input type="email" class="form-control d_email_alternate" id="" placeholder="Enter Email"
                                required="" data-parsley-required-message="Please Enter Email" value="${data.d_email_alternate}" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 pan_for_partnership" style="display: none;">

                        <div class="form-group row">
                          <label class="col-sm-3 col-form-label">Pan Card Number</label>
                          <div class="col-sm-9  pan_verify_btn_section_input">
                            <input type="text" class="form-control pan_verify_input" id=""
                              placeholder="Enter Pan Card Number" required=""
                              data-parsley-required-message="Please Enter Pan Number" value="${data.pan_number}"/>
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
                                data-parsley-required-message="Please Enter  Name" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Designation </label>
                            <div class="col-sm-9">
                              <input type="text" class="form-control s_designation" value="${data.s_designation}" id="" placeholder="Enter Designation" required=""
                                data-parsley-required-message="Please Enter Designation" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Contact </label>
                            <div class="col-sm-9">
                              <input type="number" class="form-control s_number" id="" value="${data.s_number}" placeholder="Enter Contact Number"
                                required="" data-parsley-required-message="Please Enter Contact" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Alternate Contact </label>
                            <div class="col-sm-9">
                              <input type="number" class="form-control s_number_alternate" value="${data.s_number_alternate}" id=""
                                placeholder="Enter Contact Number" required=""
                                data-parsley-required-message="Please Enter Contact" />
                            </div>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Email </label>
                            <div class="col-sm-9">
                              <input type="email" class="form-control s_email" id="" value="${data.s_email}" placeholder="Enter Email" required=""
                                data-parsley-required-message="Please Enter Email" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Sales/ Mkt Alternate Email </label>
                            <div class="col-sm-9">
                              <input type="email" class="form-control s_email_alternate" value="${data.s_email_alternate}" id="" placeholder="Enter Email" required=""
                                data-parsley-required-message="Please Enter Email" />
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
                $("#view_model_btn").click()





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
                                img += `
                                <img src="${vendor.base_url}/files/${info1}" onclick="vendor.show_img(this)" data-url="${vendor.base_url}/files/${info1}"    style="cursor: pointer;max-width="180px"" class="my-2 mx-2"
                                    alt="">
                            `
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
    add_vendor: function (e) {

        var obj = new Object()
       
        obj.name = $("#name").val()
        // obj.mobile_number = $("#mobile_number").val()
        obj.email = $("#email").val()
       

        var $request = $.ajax({
            url: `${vendor.base_url}/vendor/register`,
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(obj),
        });

        $request.done(function (data) {
            if (data.status) {

                console.log(data)
                vendor.send_link_after_register(data.data)

            } else {
                $("#submit_data").attr("disabled", false);

                toastr.options.positionClass = 'toast-bottom-right';
                toastr.error(data.message, '', { timeOut: 3000 })

            }
        })

    }











};





