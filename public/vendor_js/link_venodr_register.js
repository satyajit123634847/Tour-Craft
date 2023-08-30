var register = {
  base_url: null,
  is_update: false,
  is_pan: false,
  is_gst: false,


  init: function () {
    register.bind_events()
    register.load_vendor_data()
    register.check_already_done()





  },
  bind_events: function (e) {



    // $('#register_btn').click(function (event) {
    //     $("#register_btn").attr("disabled", true);
    //     event.preventDefault(); // prevent default form submission
    //     $('#register_form').addClass('was-validated'); // trigger Parsley validation
    //     if ($('#register_form')[0].checkValidity() === false) {
    //         event.stopPropagation(); // prevent further propagation of the event
    //     }
    //     register.register_user()
    // });

    $('#register_form').submit(function (event) {
      event.preventDefault(); // Prevent default form submission

      // Perform form validation using Parsley or other validation libraries
      if ($('#register_form').parsley().isValid()) {

        if (register.is_pan && register.is_gst) {
          $("#register_btn").attr("disabled", true);

          register.register_user()
        } else {

          if (register.is_pan == false) {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error("Please verify pan number..", '', { timeOut: 3000 })

          }
          if (register.is_gst == false) {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error("Please verify gst number..", '', { timeOut: 3000 })

          }

        }
      }
    })








  },
  register_user: function (e) {


    if ($("#firm_type").val() == 0 || $("#firm_type").val() == "0") {

      toastr.options.positionClass = 'toast-bottom-right';
      toastr.error("Please select firm type..", '', { timeOut: 3000 })
      $("#register_btn").attr("disabled", false);

    } else if ($("#mode_of_payment").val() == 0 || $("#mode_of_payment").val() == "0") {

      toastr.options.positionClass = 'toast-bottom-right';
      toastr.error("Please select mode of payment..", '', { timeOut: 3000 })
      $("#register_btn").attr("disabled", false);

    } else {
      var obj = new Object()
      obj.address = $("#address").val()
      obj.state = $("#state").val()
      obj.address1 = $("#address1").val()
      obj.zip_code = $("#zip_code").val()
      obj.city = $("#city").val()
      obj.city1 = $("#city1").val()
      obj.gst_number = $("#gst_number").val()
      obj.pan_card_number = $("#pan_card_number").val()
      obj.bank_name = $("#bank_name").val()
      obj.account_no = $("#account_no").val()
      obj.bank_address = $("#bank_address").val()
      obj.bank_address2 = $("#bank_address2").val()
      obj.bank_address3 = $("#bank_address3").val()

      obj.ifsc_code = $("#ifsc_code").val()

      obj.p_name = $("#p_name").val()
      obj.p_contact = $("#p_contact").val()
      obj.p_email = $("#p_email").val()

      obj.name = $("#name").val()
      obj.mobile_number = $("#mobile_number").val()
      obj.email = $("#email").val()
      obj.firm_type = $("#firm_type").val()
      obj.p_designation = $("#p_designation").val()
      obj.p_alternate_email = $("#p_alternate_email").val()
      obj.p_alternate_contact = $("#p_alternate_contact").val()
      obj.country = $("#country").val()


      // -----------new filed----------------------
      obj.mode_of_payment = $("#mode_of_payment").val()
      obj.micr_code = $("#micr_code").val()
      obj.default_currency = $("#default_currency").val()
      obj.incoterms_location = $("#incoterms_location").val()
      obj.gst_range = $("#gst_range").val()
      obj.gst_division = $("#gst_division").val()
      obj.gst_commissionerate = $("#gst_commissionerate").val()
      obj.hsn_sac = $("#hsn_sac").val()
      obj.msme_no = $("#msme_no").val()
      obj.ssi_no = $("#ssi_no").val()
      obj.payment_terms = $("#payment_terms").val()

      obj.accounting_ref = $("#accounting_ref").val()
      obj.sales_ref = $("#sales_ref").val()
      obj.delivery_terms = $("#delivery_terms").val()
      obj.financial_supplier = $("#financial_supplier").val()
      obj.s_name_as_per_name = $("#s_name_as_per_name").val()
      obj.supplier_type = $("#supplier_type").val()
      obj.type_of_item = $("#type_of_item").val()














      var gst_url = []
      $(".gst_array_class").each(async function () {
        gst_url.push($(this).find(".get_img_section").attr("data-img"));

      })

      var pan_url = []
      $(".pan_array_class").each(async function () {
        pan_url.push($(this).find(".get_img_section").attr("data-img"));

      })




      var noc_url = []
      $(".noc_array_class").each(async function () {
        noc_url.push($(this).find(".get_img_section").attr("data-img"));

      })

      var cheque_url = []
      $(".cheque_array_class").each(async function () {
        cheque_url.push($(this).find(".get_img_section").attr("data-img"));

      })

      var msme_attachement = []
      $(".upload_msme_files").each(async function () {
        msme_attachement.push($(this).find(".get_img_section").attr("data-img"));

      })

      var ssi_attachment = []
      $(".upload_ssi_files").each(async function () {
        ssi_attachment.push($(this).find(".get_img_section").attr("data-img"));

      })

      var code_of_conduct_attachment = []
      $(".upload_code_files").each(async function () {
        code_of_conduct_attachment.push($(this).find(".get_img_section").attr("data-img"));

      })

      var it_deceleration_attachment = []
      $(".upload_it_files").each(async function () {
        it_deceleration_attachment.push($(this).find(".get_img_section").attr("data-img"));

      })


      let params = new URLSearchParams(location.search);
      var vendor_id = params.get('id')

      obj.gst_url = gst_url
      obj.pan_url = pan_url
      obj.noc_url = noc_url
      obj.cheque_url = cheque_url
      obj.vendor_id = vendor_id
      obj.msme_attachment = msme_attachement
      obj.ssi_attachment = ssi_attachment
      obj.it_deceleration_attachment = it_deceleration_attachment
      obj.code_of_conduct_attachment = code_of_conduct_attachment




      var pan_property_url = []


      let contact_section_data = [];
      $(".get_contact_section").each(async function () {


        $(this).find(".pan_array_class_property").each(async function () {
          pan_property_url.push($(this).find(".get_img_section").attr("data-img"));

        })

        contact_section_data.push({
          d_name: $(this).find(".d_name").val(),
          d_designation: $(this).find(".d_designation").val(),
          d_contact: $(this).find(".d_contact").val(),
          d_contact_alternate: $(this).find(".d_contact_alternate").val(),
          d_email: $(this).find(".d_email").val(),
          d_email_alternate: $(this).find(".d_email_alternate").val(),
          pan_url: pan_property_url,
          pan_number: $(this).find(".pan_verify_input").val()


        });
        pan_property_url = []

      })


      let sale_data = [];
      $(".get_sale_data").each(async function () {
        sale_data.push({
          s_name: $(this).find(".s_name").val(),
          s_designation: $(this).find(".s_designation").val(),
          s_number: $(this).find(".s_number").val(),
          s_number_alternate: $(this).find(".s_number_alternate").val(),
          s_email: $(this).find(".s_email").val(),
          s_email_alternate: $(this).find(".s_email_alternate").val(),

        });

      })

      obj.sale_data = sale_data
      obj.contact_section_data = contact_section_data


      console.log(obj)
      // return
      if (register.is_update == true) {
        var id = $("#firm_id").val()
        // return false;
        var $request = $.ajax({
          url: `${register.base_url}/vendor/update_vendor_data/${id}`,
          type: "PUT",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(obj),
        });

        $request.done(function (data) {
          $("#register_btn").attr("disabled", false);


          if (data.status) {

            Swal.fire(
              'Thanks for update the record.',
              'You get once your request verify we notified in email.',
              'success'
            ).then(() => {
              location.reload(true)
            })
          } else {
            $("#register_btn").attr("disabled", false);

            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error(data.message, '', { timeOut: 3000 })

          }
        })


      } else {

        // return false;
        var $request = $.ajax({
          url: `${register.base_url}/vendor/save_vendor_data`,
          type: "POST",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(obj),
        });

        $request.done(function (data) {
          $("#register_btn").attr("disabled", false);


          if (data.status) {

            Swal.fire(
              'Thanks for registration.',
              'You get once your request verify we notified in email.',
              'success'
            ).then(() => {
              location.reload(true)
            })
          } else {
            $("#register_btn").attr("disabled", false);

            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error(data.message, '', { timeOut: 3000 })

          }
        })

      }





    }

  },


  upload_gst_files: function (e) {
    // --------project banner img-----------------//
    var formData = new FormData();
    let media_length = $(e)[0].files.length

    for (let i = 0; i <= media_length; i++)
      formData.append('files', $(e)[0].files[i]);


    var $request = $.ajax({
      url: `${register.base_url}/admin/upload-files`,
      data: formData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
    });

    $request.done(async function (response) {
      if (response.status == true) {


        var project_img_array = []

        await response.url.map(info => {
          project_img_array.push(info.filename)
        })


        var img = ""
        project_img_array.map(info => {
          var ex = info.split('.').pop()

          if (ex == "mp4") {
            img += `<div class="mx-1 remove_img_section gst_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          } else if (ex == "pdf") {
            img += `<div class="mx-1 remove_img_section gst_array_class"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          }
          else {
            img += `<div class="mx-1 remove_img_section gst_array_class"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

          }



        })

        $(e).siblings(".img_pre").append(img)
      }
    })

  },
  upload_pan_files: function (e) {
    // --------project banner img-----------------//
    var formData = new FormData();
    let media_length = $(e)[0].files.length

    for (let i = 0; i <= media_length; i++)
      formData.append('files', $(e)[0].files[i]);


    var $request = $.ajax({
      url: `${register.base_url}/admin/upload-files`,
      data: formData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
    });

    $request.done(async function (response) {
      if (response.status == true) {


        var project_img_array = []

        await response.url.map(info => {
          project_img_array.push(info.filename)
        })


        var img = ""
        project_img_array.map(info => {

          var ex = info.split('.').pop()

          if (ex == "mp4") {
            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          } else if (ex == "pdf") {
            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          }
          else {
            img += `<div class="mx-1 remove_img_section pan_array_class"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

          }


        })

        $(e).siblings(".img_pre").append(img)
      }
    })

  },
  upload_pan_files1: function (e) {
    // --------project banner img-----------------//
    var formData = new FormData();
    let media_length = $(e)[0].files.length

    for (let i = 0; i <= media_length; i++)
      formData.append('files', $(e)[0].files[i]);


    var $request = $.ajax({
      url: `${register.base_url}/admin/upload-files`,
      data: formData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
    });

    $request.done(async function (response) {
      if (response.status == true) {


        var project_img_array = []

        await response.url.map(info => {
          project_img_array.push(info.filename)
        })


        var img = ""
        project_img_array.map(info => {

          var ex = info.split('.').pop()

          if (ex == "mp4") {
            img += `<div class="mx-1 remove_img_section pan_array_class_property"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          } else if (ex == "pdf") {
            img += `<div class="mx-1 remove_img_section pan_array_class_property"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          }
          else {
            img += `<div class="mx-1 remove_img_section pan_array_class_property"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

          }


        })

        // $(e).siblings(".img_pre").html("")
        $(e).siblings(".img_pre").append(img)

      }
    })

  },

  upload_noc_files: function (e) {
    // --------project banner img-----------------//
    var formData = new FormData();
    let media_length = $(e)[0].files.length

    for (let i = 0; i <= media_length; i++)
      formData.append('files', $(e)[0].files[i]);


    var $request = $.ajax({
      url: `${register.base_url}/admin/upload-files`,
      data: formData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
    });

    $request.done(async function (response) {
      if (response.status == true) {


        var project_img_array = []

        await response.url.map(info => {
          project_img_array.push(info.filename)
        })


        var img = ""
        project_img_array.map(info => {

          var ex = info.split('.').pop()

          if (ex == "mp4") {
            img += `<div class="mx-1 remove_img_section noc_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          } else if (ex == "pdf") {
            img += `<div class="mx-1 remove_img_section noc_array_class"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          }
          else {
            img += `<div class="mx-1 remove_img_section noc_array_class"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

          }



        })

        $(e).siblings(".img_pre").append(img)
      }
    })

  },



  upload_cheque_files: function (e) {
    // --------project banner img-----------------//
    var formData = new FormData();
    let media_length = $(e)[0].files.length

    for (let i = 0; i <= media_length; i++)
      formData.append('files', $(e)[0].files[i]);


    var $request = $.ajax({
      url: `${register.base_url}/admin/upload-files`,
      data: formData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
    });

    $request.done(async function (response) {
      if (response.status == true) {


        var project_img_array = []

        await response.url.map(info => {
          project_img_array.push(info.filename)
        })


        var img = ""
        project_img_array.map(info => {

          var ex = info.split('.').pop()

          if (ex == "mp4") {
            img += `<div class="mx-1 remove_img_section cheque_array_class"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          } else if (ex == "pdf") {
            img += `<div class="mx-1 remove_img_section cheque_array_class"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          }
          else {
            img += `<div class="mx-1 remove_img_section cheque_array_class"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

          }



        })

        $(e).siblings(".img_pre").append(img)
      }
    })

  },


  remove_project_images: async function (e) {

    Swal.fire({
      title: 'Are you sure to remove image?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        $(e).parent(".a_tag").parent(".remove_img_section").remove()
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.success("Images remove successfully...!", '', { timeOut: 3000 },)
      }
    })
  },

  load_vendor_data: function () {

    let params = new URLSearchParams(location.search);
    var id = params.get('id')

    var $request = $.ajax({
      url: `${register.base_url}/vendor/vendor_by_id/${id}`,
      type: "GET",
      dataType: "json",
      contentType: "application/json",

    });

    $request.done(function (data) {

      if (data.status) {
        var info = data.data

        $("#name").val(info.name)
        $("#email").val(info.email)
        $("#mobile_number").val(info.mobile_number)
        // $("#firm_type").val(info.firm_type)



      }



    })
  },

  check_already_done: function () {

    let params = new URLSearchParams(location.search);
    var id = params.get('id')

    var $request = $.ajax({
      url: `${register.base_url}/vendor/get_firm_data_by_vendor_id/${id}`,
      type: "GET",
      dataType: "json",
      contentType: "application/json",

    });

    $request.done(function (data) {



      if (data.status) {
        var info = data.data[0]

        console.log(info)


        if (info == undefined) {
          return
        } else {
          if (info.for_update == false) {
            $("#register_btn").css("display", "none")
          } else {
            register.is_update = true
            register.is_pan = true
            register.is_gst = true

            $("#old_bank_noc_section").css("display", "block")
          }
        }


        $("#firm_id").val(info._id)

        // ("#register_btn_text").html("Update")





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
        $("#bank_address2").val(info.bank_address2 ? info.bank_address2 : "")
        $("#bank_address3").val(info.bank_address3 ? info.bank_address3 : "")

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
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
            } else if (ex == "pdf") {
              img += `<div class="mx-1 remove_img_section gst_array_class"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
            }
            else {
              img += `<div class="mx-1 remove_img_section gst_array_class"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
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
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
            } else if (ex == "pdf") {
              img += `<div class="mx-1 remove_img_section pan_array_class"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
            }
            else {
              img += `<div class="mx-1 remove_img_section pan_array_class"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
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
                            <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                            </div>`
            } else if (ex == "pdf") {
              img += `<div class="mx-1 remove_img_section noc_array_class"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                            <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                            </div>`
            }
            else {
              img += `<div class="mx-1 remove_img_section noc_array_class"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
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
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
            } else if (ex == "pdf") {
              img += `<div class="mx-1 remove_img_section cheque_array_class"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
            }
            else {
              img += `<div class="mx-1 remove_img_section cheque_array_class"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

            }



          })




        }
        $("#cheque_documents_section").html("")
        $("#cheque_documents_section").append(img)


        var img = ""


        if (info.ssi_attachment.length > 0) {

          info.ssi_attachment.map(info => {
            var ex = info.split('.').pop()

            if (ex == "mp4") {
              img += `<div class="mx-1 remove_img_section upload_ssi_files"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
            } else if (ex == "pdf") {
              img += `<div class="mx-1 remove_img_section upload_ssi_files"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
            }
            else {
              img += `<div class="mx-1 remove_img_section upload_ssi_files"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

            }


          })


        }
        $("#ssi_attachement").html("")
        $("#ssi_attachement").append(img)



        var img = ""


        if (info.msme_attachment.length > 0) {

          info.msme_attachment.map(info => {
            var ex = info.split('.').pop()

            if (ex == "mp4") {
              img += `<div class="mx-1 remove_img_section upload_msme_files"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
            } else if (ex == "pdf") {
              img += `<div class="mx-1 remove_img_section upload_msme_files"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
            }
            else {
              img += `<div class="mx-1 remove_img_section upload_msme_files"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

            }


          })


        }
        $("#msme_attachement").html("")
        $("#msme_attachement").append(img)


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
                              <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${img_url}' onclick="register.remove_project_images(this)">X</i></a>
                              </div>`
                } else if (ex == "pdf") {
                  pan_section += `<div class="mx-1 remove_img_section pan_array_class_property"><img src="images/pdf.png" class="get_img_section" data-img='${img_url}'   width=100px alt="Img">
                              <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${img_url}' onclick="register.remove_project_images(this)">X</i></a>
                              </div>`
                }
                else {
                  pan_section += `<div class="mx-1 remove_img_section pan_array_class_property"><img src="${register.base_url}/files/${img_url}" class="get_img_section" data-img='${img_url}'   width=100px alt="Img">
                          <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${img_url}' onclick="register.remove_project_images(this)">X</i></a>
                          </div>`

                }





              })

            }


            var img = ""


            if (info.code_of_conduct_attachment.length > 0) {
    
              info.code_of_conduct_attachment.map(info => {
                var ex = info.split('.').pop()
    
                if (ex == "mp4") {
                  img += `<div class="mx-1 remove_img_section upload_code_files"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                            <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                            </div>`
                } else if (ex == "pdf") {
                  img += `<div class="mx-1 remove_img_section upload_code_files"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                            <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                            </div>`
                }
                else {
                  img += `<div class="mx-1 remove_img_section upload_code_files"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
    
                }
    
    
              })
    
    
            }
            $("#code_of_conduct_attachement").html("")
            $("#code_of_conduct_attachement").append(img)



            var img = ""


            if (info.it_deceleration_attachment.length > 0) {
    
              info.it_deceleration_attachment.map(info => {
                var ex = info.split('.').pop()
    
                if (ex == "mp4") {
                  img += `<div class="mx-1 remove_img_section upload_it_files"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                            <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                            </div>`
                } else if (ex == "pdf") {
                  img += `<div class="mx-1 remove_img_section upload_it_files"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                            <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                            </div>`
                }
                else {
                  img += `<div class="mx-1 remove_img_section upload_it_files"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
    
                }
    
    
              })
    
    
            }
            $("#it_attachement").html("")
            $("#it_attachement").append(img)

            if (i != 0) {
              add_more = ` <div class="col-md-12 remove" style="text-align: end;">
                            <a class="btn btn-danger mb-3" onclick="register.remove_block(this)">Remove</a>
                          </div>`

            }
            html += ` <div class="row get_contact_section">
                        ${add_more}
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
                                placeholder="Enter Contact Number" 
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
                                 data-parsley-required-message="Please Enter Email" value="${data.d_email_alternate}" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 pan_for_partnership" style="display: none;">

                        <div class="form-group row">
                          <label class="col-sm-3 col-form-label">Pan Card Number</label>
                          <div class="col-sm-6  pan_verify_btn_section_input">
                            <input type="text" class="form-control pan_verify_input" id=""
                              placeholder="Enter Pan Card Number" maxlength="10" oninput="convertToUppercase(this)" required=""
                              data-parsley-required-message="Please Enter Pan Number" value="${data.pan_number}"/>
                          </div>
                          <div class="col-sm-3 pan_verify_btn_section" id="pan_verify_btn_section">
                            <a class="btn btn-block btn-success  font-weight-medium"
                              onclick="register.verify_pan1(this)">Verify</a>
  
                          </div>
                        </div>  
  
  
                      </div>
                      <div class="col-md-6 pan_for_partnership"   style="display: none;">
                        <div class="form-group row">
                          <label class="col-sm-3 col-form-label">PAN Card</label>
                          <div class="col-sm-9">
                            <input type="file" class="form-control" 
                              onchange="register.upload_pan_files1(this)"  />
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
                        ${add_more}
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
                                placeholder="Enter Contact Number" 
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















      }



    })
  },

  append_contact_details: function () {


    var html = `  <div class="row get_contact_section">

        <div class="col-md-12 remove" style="text-align: end;">
        <a class="btn btn-danger mb-3" onclick="register.remove_block(this)">Remove</a>
      </div>
                      
        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label d_name_label">
              Name <span style="color: red;"> *</span></label>
            <div class="col-sm-9">
              <input type="text" class="form-control d_name"  placeholder="Enter Name" required=""
                data-parsley-required-message="Please Enter Name" />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label d_designation_label">Designation <span style="color: red;"> *</span></label>
            <div class="col-sm-9">
              <input type="text" class="form-control d_designation"  placeholder="Enter Designation" required=""
                data-parsley-required-message="Please Enter Designation" />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label d_contact_label">
              Contact <span style="color: red;"> *</span></label>
            <div class="col-sm-9">
              <input type="number" class="form-control d_contact" id="" placeholder="Enter Contact Number"
                required="" data-parsley-required-message="Please Enter Contact" />
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label d_contact_alternate_label">
              Alternate Contact</label>
            <div class="col-sm-9">
              <input type="number" class="form-control d_contact_alternate" id=""
                placeholder="Enter Contact Number" 
                data-parsley-required-message="Please Enter Contact" />
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label d_email_label">
              Email <span style="color: red;"> *</span></label>
            <div class="col-sm-9">
              <input type="email" class="form-control d_email" id="" placeholder="Enter Email" required=""
                data-parsley-required-message="Please Enter Email" />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label d_email_alternate_label">
              Alternate Email </label>
            <div class="col-sm-9">
              <input type="email" class="form-control d_email_alternate" id="" placeholder="Enter Email"
                 data-parsley-required-message="Please Enter Email" />
            </div>
          </div>
        </div>
        <div class="col-md-6 pan_for_partnership" style="display: none;">

        <div class="form-group row">
          <label class="col-sm-3 col-form-label">Pan Card Number <span style="color: red;"> *</span></label>
          <div class="col-sm-6  pan_verify_btn_section_input">
            <input type="text" class="form-control pan_verify_input" id=""
              placeholder="Enter Pan Card Number" maxlength="10" oninput="convertToUppercase(this)" required=""
              data-parsley-required-message="Please Enter Pan Number" />
          </div>
          <div class="col-sm-3 pan_verify_btn_section" id="pan_verify_btn_section">
            <a class="btn btn-block btn-success  font-weight-medium"
              onclick="register.verify_pan1(this)">Verify</a>

          </div>
        </div>


      </div>
      <div class="col-md-6 pan_for_partnership"   style="display: none;">
        <div class="form-group row">
          <label class="col-sm-3 col-form-label">PAN Card <span style="color: red;"> *</span></label>
          <div class="col-sm-9">
            <input type="file" class="form-control" 
              onchange="register.upload_pan_files1(this)"  />
            <div class="img_pre mt-2" id="pan_documents_section_1" style="display: flex;">
            </div>
          </div>
        </div>




      </div>
      </div>`

    $("#contact_section").append(html)

    var value = $("#firm_type").val()


    if (value == 1) {
      $(".d_name_label").html("Proprietor Name <span style='color: red;'> *</span>")
      $(".d_designation_label").html("Proprietor Designation <span style='color: red;'> *</span>")
      $(".d_contact_label").html("Proprietor Contact <span style='color: red;'> *</span>")
      $(".d_contact_alternate_label").html("Proprietor Alternate Contact")
      $(".d_email_label").html("Proprietor Email <span style='color: red;'> *</span>")
      $(".d_email_alternate_label").html("Proprietor Alternate Email")


    } else if (value == 2) {

      $(".d_name_label").html("Partner Name <span style='color: red;'> *</span>")
      $(".d_designation_label").html("Partner Designation <span style='color: red;'> *</span>")
      $(".d_contact_label").html("Partner Contact <span style='color: red;'> *</span>")
      $(".d_contact_alternate_label").html("Partner Alternate Contact")
      $(".d_email_label").html("Partner Email <span style='color: red;'> *</span>")
      $(".d_email_alternate_label").html("Partner Alternate Email")

      $(".pan_for_partnership").css("display", "block")
    } else if (value == 3 || value == 4) {

      $(".d_name_label").html("Director Name <span style='color: red;'> *</span>")
      $(".d_designation_label").html("Director Designation <span style='color: red;'> *</span>")
      $(".d_contact_label").html("Director Contact <span style='color: red;'> *</span>")
      $(".d_contact_alternate_label").html("Director Alternate Contact")
      $(".d_email_label").html("Director Email <span style='color: red;'> *</span>")
      $(".d_email_alternate_label").html("Director Alternate Email")
    }

  },
  append_sale: function () {

    var html = `  <div class="row get_sale_data">
        <div class="col-md-12 remove" style="text-align: end;">
        <a class="btn btn-danger mb-3" onclick="register.remove_block(this)">Remove</a>
      </div>
        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Sales/ Mkt Name </label>
            <div class="col-sm-9">
              <input type="text" class="form-control s_name" id="" placeholder="Enter Name" required=""
                data-parsley-required-message="Please Enter  Name" />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Sales/ Mkt Designation </label>
            <div class="col-sm-9">
              <input type="text" class="form-control s_designation" id="" placeholder="Enter Designation" required=""
                data-parsley-required-message="Please Enter Designation" />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Sales/ Mkt Contact </label>
            <div class="col-sm-9">
              <input type="number" class="form-control s_number" id="" placeholder="Enter Contact Number"
                required="" data-parsley-required-message="Please Enter Contact" />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Sales/ Mkt Alternate Contact </label>
            <div class="col-sm-9">
              <input type="number" class="form-control s_number_alternate" id=""
                placeholder="Enter Contact Number" 
                data-parsley-required-message="Please Enter Contact" />
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Sales/ Mkt Email </label>
            <div class="col-sm-9">
              <input type="email" class="form-control s_email" id="" placeholder="Enter Email" required=""
                data-parsley-required-message="Please Enter Email" />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Sales/ Mkt Alternate Email </label>
            <div class="col-sm-9">
              <input type="email" class="form-control s_email_alternate" id="" placeholder="Enter Email" 
                data-parsley-required-message="Please Enter Email" />
            </div>
          </div>
        </div>
      </div>`

    $("#sales_section").append(html)
  },
  remove_block: function (e) {

    $(e).parent(".remove").parent(".row").remove()

  },
  change_details: function (e) {

    var value = $(e).val()




    // $(".add_more_section").css("text-align","end")

    if (value == 1) {
      $(".d_name_label").html("Proprietor Name <span style='color:red'>*</span> ")
      $(".d_designation_label").html("Proprietor Designation <span style='color:red'>*</span>")
      $(".d_contact_label").html("Proprietor Contact <span style='color:red'>*</span>")
      $(".d_contact_alternate_label").html("Proprietor Alternate Contact")
      $(".d_email_label").html("Proprietor Email <span style='color:red'>*</span>")
      $(".d_email_alternate_label").html("Proprietor Alternate Email")

      $(".add_more").css("display", "none")
      $(".pan_for_partnership").css("display", "block")



    } else if (value == 2) {

      $(".d_name_label").html("Partner/Director Name <span style='color:red'>*</span>")
      $(".d_designation_label").html("Partner/Director Designation <span style='color:red'>*</span>")
      $(".d_contact_label").html("Partner/Director Contact <span style='color:red'>*</span>")
      $(".d_contact_alternate_label").html("Partner/Director Alternate Contact")
      $(".d_email_label").html("Partner/Director Email <span style='color:red'>*</span>")
      $(".d_email_alternate_label").html("Partner/Director Alternate Email")

      $(".add_more").css("display", "")
      $(".pan_for_partnership").css("display", "block")
    } else if (value == 3 || value == 4) {

      $(".d_name_label").html("Director Name <span style='color:red'>*</span>")
      $(".d_designation_label").html("Director Designation <span style='color:red'>*</span>")
      $(".d_contact_label").html("Director Contact <span style='color:red'>*</span>")
      $(".d_contact_alternate_label").html("Director Alternate Contact")
      $(".d_email_label").html("Director Email <span style='color:red'>*</span>")
      $(".d_email_alternate_label").html("Director Alternate Email")
      $(".add_more").css("display", "")
      $(".pan_for_partnership").css("display", "none")

    }

  },
  verify_pan: function (e) {

    var pan_number = $("#pan_card_number").val()

    if (pan_number == "") {

      toastr.options.positionClass = 'toast-bottom-right';
      toastr.error("Please enter pan number", '', { timeOut: 3000 })

    } else {

      var panNumber = pan_number
      var pattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;


      if (pattern.test(panNumber)) {

        var $request = $.ajax({
          url: `${register.base_url}/vendor/verify_pan/${pan_number}`,
          type: "GET",
          dataType: "json",
          contentType: "application/json",

        });

        $request.done(function (data) {

          if (data.status) {

            $(e).css("display", "none")
           
            $('#pan_card_number').prop('disabled', true);
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.success(data.message, '', { timeOut: 3000 })
            register.is_pan = true


          } else {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error(data.message, '', { timeOut: 3000 })
          }



        })



      } else {

        toastr.options.positionClass = 'toast-bottom-right';
        toastr.error("Invalid PAN card number.", '', { timeOut: 3000 })

      }





    }


  },
  verify_pan1: function (e) {

    var pan_number = $(e).parent(".pan_verify_btn_section").siblings(".pan_verify_btn_section_input").children(".pan_verify_input").val()

    if (pan_number == "") {

      toastr.options.positionClass = 'toast-bottom-right';
      toastr.error("Please enter pan number", '', { timeOut: 3000 })

    } else {
      var panNumber = pan_number
      var pattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;


      if (pattern.test(panNumber)) {

        var $request = $.ajax({
          url: `${register.base_url}/vendor/verify_pan/${pan_number}`,
          type: "GET",
          dataType: "json",
          contentType: "application/json",

        });

        $request.done(function (data) {

          if (data.status) {

            $(e).css("display", "none")
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.success(data.message, '', { timeOut: 3000 })
            register.is_pan = true

            $(e).parent(".pan_verify_btn_section").siblings(".pan_verify_btn_section_input").children(".pan_verify_input").prop('disabled', true);



          } else {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error(data.message, '', { timeOut: 3000 })
          }



        })



      } else {

        toastr.options.positionClass = 'toast-bottom-right';
        toastr.error("Invalid PAN card number.", '', { timeOut: 3000 })

      }





    }


  },
  verify_gst: function (e) {

    var gst_number = $("#gst_number").val()

    if (gst_number == "") {

      toastr.options.positionClass = 'toast-bottom-right';
      toastr.error("Please enter gst number", '', { timeOut: 3000 })

    } else {
      var $request = $.ajax({
        url: `${register.base_url}/vendor/verify_gst/${gst_number}`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",

      });

      $request.done(function (data) {

        if (data.status) {

          $("#gst_verify_btn_section").css("display", "none")

          $('#gst_number').prop('disabled', true);
          toastr.options.positionClass = 'toast-bottom-right';
          toastr.success(data.message, '', { timeOut: 3000 })
          register.is_gst = true


        } else {
          toastr.options.positionClass = 'toast-bottom-right';
          toastr.error(data.message, '', { timeOut: 3000 })
        }



      })

    }


  },
  check_ifsc: function () {
    var value = $("#country").val()

    if (value == "India") {
      $(".ifsc_label").html("IFSC Code <span style='color:red'>*</span>")

    } else {
      $(".ifsc_label").html("Swift Code <span style='color:red'>*</span>")
    }
  },
  upload_msme_files: function (e) {
    // --------project banner img-----------------//
    var formData = new FormData();
    let media_length = $(e)[0].files.length

    for (let i = 0; i <= media_length; i++)
      formData.append('files', $(e)[0].files[i]);


    var $request = $.ajax({
      url: `${register.base_url}/admin/upload-files`,
      data: formData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
    });

    $request.done(async function (response) {
      if (response.status == true) {


        var project_img_array = []

        await response.url.map(info => {
          project_img_array.push(info.filename)
        })


        var img = ""
        project_img_array.map(info => {

          var ex = info.split('.').pop()

          if (ex == "mp4") {
            img += `<div class="mx-1 remove_img_section upload_msme_files"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          } else if (ex == "pdf") {
            img += `<div class="mx-1 remove_img_section upload_msme_files"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          }
          else {
            img += `<div class="mx-1 remove_img_section upload_msme_files"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

          }



        })

        $(e).siblings(".img_pre").append(img)
      }
    })

  },
  upload_ssi_files: function (e) {
    // --------project banner img-----------------//
    var formData = new FormData();
    let media_length = $(e)[0].files.length

    for (let i = 0; i <= media_length; i++)
      formData.append('files', $(e)[0].files[i]);


    var $request = $.ajax({
      url: `${register.base_url}/admin/upload-files`,
      data: formData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
    });

    $request.done(async function (response) {
      if (response.status == true) {


        var project_img_array = []

        await response.url.map(info => {
          project_img_array.push(info.filename)
        })


        var img = ""
        project_img_array.map(info => {

          var ex = info.split('.').pop()

          if (ex == "mp4") {
            img += `<div class="mx-1 remove_img_section upload_ssi_files"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          } else if (ex == "pdf") {
            img += `<div class="mx-1 remove_img_section upload_ssi_files"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          }
          else {
            img += `<div class="mx-1 remove_img_section upload_ssi_files"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

          }



        })

        $(e).siblings(".img_pre").append(img)
      }
    })

  },

  upload_code_files: function (e) {
    // --------project banner img-----------------//
    var formData = new FormData();
    let media_length = $(e)[0].files.length

    for (let i = 0; i <= media_length; i++)
      formData.append('files', $(e)[0].files[i]);


    var $request = $.ajax({
      url: `${register.base_url}/admin/upload-files`,
      data: formData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
    });

    $request.done(async function (response) {
      if (response.status == true) {


        var project_img_array = []

        await response.url.map(info => {
          project_img_array.push(info.filename)
        })


        var img = ""
        project_img_array.map(info => {

          var ex = info.split('.').pop()

          if (ex == "mp4") {
            img += `<div class="mx-1 remove_img_section upload_code_files"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          } else if (ex == "pdf") {
            img += `<div class="mx-1 remove_img_section upload_code_files"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          }
          else {
            img += `<div class="mx-1 remove_img_section upload_code_files"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

          }



        })

        $(e).siblings(".img_pre").append(img)
      }
    })

  },
  upload_it_files: function (e) {
    // --------project banner img-----------------//
    var formData = new FormData();
    let media_length = $(e)[0].files.length

    for (let i = 0; i <= media_length; i++)
      formData.append('files', $(e)[0].files[i]);


    var $request = $.ajax({
      url: `${register.base_url}/admin/upload-files`,
      data: formData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
    });

    $request.done(async function (response) {
      if (response.status == true) {


        var project_img_array = []

        await response.url.map(info => {
          project_img_array.push(info.filename)
        })


        var img = ""
        project_img_array.map(info => {

          var ex = info.split('.').pop()

          if (ex == "mp4") {
            img += `<div class="mx-1 remove_img_section upload_it_files"><img src="images/video.jpg" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          } else if (ex == "pdf") {
            img += `<div class="mx-1 remove_img_section upload_it_files"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                        </div>`
          }
          else {
            img += `<div class="mx-1 remove_img_section upload_it_files"><img src="${register.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                    <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="register.remove_project_images(this)">X</i></a>
                    </div>`

          }



        })

        $(e).siblings(".img_pre").append(img)
      }
    })

  },














};





