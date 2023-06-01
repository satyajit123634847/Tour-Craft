var register = {
    base_url: null,
    init: function () {
        register.bind_events()




    },
    bind_events: function (e) {


        $('#register_form').submit(function(event) {
            event.preventDefault(); // Prevent default form submission
            $("#register_btn").attr("disabled", true);
        
            // Perform form validation using Parsley or other validation libraries
            if ($('#register_form').parsley().isValid()) {
                register.register_user()
            }
        })


        // $('#register_btn').click(function (event) {
        //     $("#register_btn").attr("disabled", true);
        //     event.preventDefault(); // prevent default form submission
        //     $('#register_form').addClass('was-validated'); // trigger Parsley validation
        //     if ($('#register_form')[0].checkValidity() === false) {
        //         event.stopPropagation(); // prevent further propagation of the event
        //     }
        //     register.register_user()
        // });


        // $('#login_btn').click(function (event) {
        //     $("#login_btn").attr("disabled", true);
        //     event.preventDefault(); // prevent default form submission
        //     $('#login_form').addClass('was-validated'); // trigger Parsley validation
        //     if ($('#login_form')[0].checkValidity() === false) {
        //         event.stopPropagation(); // prevent further propagation of the event
        //     }
        //     register.login_user()
        // });

        

        $('#login_form').submit(function(event) {
            event.preventDefault(); // Prevent default form submission
            $("#login_btn").attr("disabled", true);
        
            // Perform form validation using Parsley or other validation libraries
            if ($('#login_form').parsley().isValid()) {
                register.login_user()
            }
        })



    },
    register_user: function (e) {

        if($("#firm_type").val() ==0 || $("#firm_type").val() == "0"){

            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error("Please select firm type..", '', { timeOut: 3000 })
            $("#register_btn").attr("disabled", false);

        }else{
            var obj = new Object()
            obj.username = $("#username").val()
            obj.password = $("#password").val()
            obj.name = $("#name").val()
            obj.email = $("#email").val()
            obj.mobile_number = $("#mobile_number").val()
            obj.firm_type = $("#firm_type").val()
            obj.pan_number = $("#pan_number").val()

    
    
    
            //  return false;
            var $request = $.ajax({
                url: `${register.base_url}/vendor/register`,
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(obj),
            });
    
            $request.done(function (data) {
                $("#register_btn").attr("disabled", false);
    
                console.log(data)
                if (data.status) {
    
                    Swal.fire(
                        'Thanks for registration.',
                        'You get registration from link in email shortly.',
                        'success'
                    ).then(() => {
                        setTimeout(() => {
                            window.location = '/vendor-register';
                        }, 500);
                    })
                } else {
                    $("#register_btn").attr("disabled", false);
    
                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.error(data.message, '', { timeOut: 3000 })
    
                }
            })
    

        }
     
    },
    login_user: function (e) {

        var obj = new Object()
        obj.username = $("#username1").val()
        obj.password = $("#password1").val()




        //  return false;
        var $request = $.ajax({
            url: `${register.base_url}/vendor/login`,
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(obj),
        });

        $request.done(function (data) {

            console.log(data)
            if (data.status) {
                if(data.data != null){
                    if (data.data.approve_status != undefined && data.data.approve_status == false) {

                        Swal.fire(
                            'Thanks for Login.',
                            'Your profile is not approve yet. once its done you will notified by email.',
                            'success'
                        ).then(() => {
                            setTimeout(() => {
                                window.location = '/vendor-login';
                            }, 1000);
                        })
    
                    }else{
    
                        toastr.options.positionClass = 'toast-bottom-right';
                        toastr.success(data.message, '', { timeOut: 3000 })
    
                    }
    

                }else{

                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.success(data.message, '', { timeOut: 3000 })


                }


                
                
            } else {
                $("#register_btn").attr("disabled", false);

                toastr.options.positionClass = 'toast-bottom-right';
                toastr.error(data.message, '', { timeOut: 3000 })

            }
        })

    }










};





