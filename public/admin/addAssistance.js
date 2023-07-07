var assistance = {
    base_url: null,
    init: function () {
        assistance.bind_events()
        assistance.list_assistance()





    },
    bind_events: function (e) {



        // $('#submit_data').click(function (event) {
        //     $("#submit_data").attr("disabled", true);
        //     event.preventDefault(); // prevent default form submission
        //     $('#addAssistance').addClass('was-validated'); // trigger Parsley validation
        //     if ($('#addAssistance')[0].checkValidity() === false) {
        //         event.stopPropagation(); // prevent further propagation of the event
        //     }
        //     assistance.add_assistance()
        // });



        $('#addAssistance').submit(function(event) {
            event.preventDefault(); // Prevent default form submission
            $("#submit_data").attr("disabled", true);
        
            // Perform form validation using Parsley or other validation libraries
            if ($('#addAssistance').parsley().isValid()) {
                assistance.add_assistance()
            }
        })



    },
    list_assistance: function (e) {
        $('#add_assistance_table').DataTable({
            "ajax": {
                "url": this.base_url + "/admin/list_admin",
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

                {
                    'data': 'username',
                    'sTitle': 'Username',
                    'render': function (data, type, row) {

                        if (data == null || data == "") {
                            return '-';
                        } else {
                            return data;
                        }

                    }

                },
                {
                    'data': 'mobile_number',
                    'sTitle': 'Mobile Number',
                    'render': function (data, type, row) {

                        if (data == null || data == "") {
                            return '-';
                        } else {
                            return data;
                        }

                    }

                },
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
                    'data': 'user_status',
                    'sTitle': 'User role',
                    'render': function (data, type, row) {
                        if(data == null || data == ""){
                            return "-"
                        }else{
                            return data
                        }

                    }
                },
               
                {
                    'data': 'null',
                    'sTitle': 'Action',
                    //'class': 'center',
                    'render': function (data, type, row) {
                        return '<a class="btn btn-warning mx-2" onclick="assistance.edit_assistance(this)" title="Edit"> Edit </a><a class="btn btn-danger" onclick="assistance.delete_assistance(this)" title="Edit"> Delete </a>'
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
    add_assistance: function (e) {

        var obj = new Object()
        obj.username = $("#username").val()
        obj.password = $("#password").val()
        obj.name = $("#name").val()
        obj.mobile_number = $("#mobile_number").val()
        obj.email = $("#email").val()
        obj.user_status = $("#user_status").val()

        var sign = []
        $(".gst_array_class").each(async function () {
            sign.push($(this).find(".get_img_section").attr("data-img"));
  
        })

        obj.sign = sign[0]

  

      
        console.log(obj)
        // return
        var id = $("#id").val()

        if (id == null || id == "") {
            
            var $request = $.ajax({
                url: `${assistance.base_url}/admin/register`,
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(obj),
            });

            $request.done(function (data) {
                if (data.status) {
                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.success(data.message, '', { timeOut: 3000 },)

                    setTimeout(() => {
                        window.location = '/add-assistance';

                    }, 1000);

                } else {
                    $("#submit_data").attr("disabled", false);

                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.error(data.message, '', { timeOut: 3000 })

                }
            })

        } else {

            var $request = $.ajax({
                url: `${assistance.base_url}/admin/update_admin/${id}`,
                type: "PUT",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(obj),
            });

            $request.done(function (data) {
                if (data.status) {
                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.success(data.message, '', { timeOut: 3000 },)

                    setTimeout(() => {
                        window.location = '/add-assistance';

                    }, 1000);

                } else {
                    $("#submit_data").attr("disabled", false);

                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.error(data.message, '', { timeOut: 3000 })

                }
            })

        }



    },

    edit_assistance: function (e) {
        let self = this;
        let row = $(e).closest('tr');
        let obj = $('#add_assistance_table').dataTable().fnGetData(row);
        console.log(obj)

        $("#name").val(obj.name)
        $("#id").val(obj._id)
        $("#username").val(obj.username)
        $("#email").val(obj.email)
        $("#mobile_number").val(obj.mobile_number)
        $("#password").val(obj.password)
        $('#user_status').val(obj.user_status);
        

        
        // $("#password").prop("disabled", true);


        $("#submit_data").text("Update")

        if(obj.sign == ""){

        }else{
            var img = `<div class="mx-1 remove_img_section gst_array_class"><img src="${assistance.base_url}/files/${obj.sign}" class="get_img_section" data-img='${obj.sign}'   width=100px alt="Img">
            <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${obj.sign}' onclick="assistance.remove_project_images(this)">X</i></a>
            </div>`

            $("#sign_section").html("")
            $("#sign_section").append(img)

        }
       

    },
    delete_assistance: function (e) {
        let self = this;
        let row = $(e).closest('tr');
        let obj = $('#add_assistance_table').dataTable().fnGetData(row);
        
        var id = obj._id
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                var $request = $.ajax({
                    url: `${assistance.base_url}/admin/delete_admin/${id}`,
                    type: "PUT",
                    dataType: "json",
                    contentType: "application/json",

                });

                $request.done(function (data) {
                    if (data.status) {
                        toastr.options.positionClass = 'toast-bottom-right';
                        toastr.success(data.message, '', { timeOut: 3000 },)
                        setTimeout(() => {
                            window.location = '/add-assistance';
                        }, 1000);


                    }

                })

            }
        })

    },

    upload_gst_files: function (e) {
        // --------project banner img-----------------//
        var formData = new FormData();
        let media_length = $(e)[0].files.length
    
        for (let i = 0; i <= media_length; i++)
          formData.append('files', $(e)[0].files[i]);
    
    
        var $request = $.ajax({
          url: `${assistance.base_url}/admin/upload-files`,
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
                            <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="assistance.remove_project_images(this)">X</i></a>
                            </div>`
              } else if (ex == "pdf") {
                img += `<div class="mx-1 remove_img_section gst_array_class"><img src="images/pdf.png" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                            <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="assistance.remove_project_images(this)">X</i></a>
                            </div>`
              }
              else {
                img += `<div class="mx-1 remove_img_section gst_array_class"><img src="${assistance.base_url}/files/${info}" class="get_img_section" data-img='${info}'   width=100px alt="Img">
                        <a class="a_tag" download="new-filename"><i class="fa-check" style="cursor: pointer;" data-img-name='${info}' onclick="assistance.remove_project_images(this)">X</i></a>
                        </div>`
    
              }
    
    
    
            })
    
            $(e).siblings(".img_pre").html("")
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









};





