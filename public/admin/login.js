var login = {
    base_url: null,
    init: function () {
        login.bind_events()




    },
    bind_events: function (e) {



        // $('#login_btn').click(function (event) {
        //     $("#login_btn").attr("disabled", true);
        //     event.preventDefault(); // prevent default form submission
        //     $('#login_form').addClass('was-validated'); // trigger Parsley validation
        //     if ($('#login_form')[0].checkValidity() === false) {
        //         event.stopPropagation(); // prevent further propagation of the event
        //     }
        //     login.login_user()
        // });

        $('#login_form').submit(function(event) {
            event.preventDefault(); // Prevent default form submission
            $("#login_btn").attr("disabled", true);
        
            // Perform form validation using Parsley or other validation libraries
            if ($('#login_form').parsley().isValid()) {
                login.login_user()
            }
        })





    },
    login_user: function (e) {

        var obj = new Object()
        obj.username = $("#username").val()
        obj.password = $("#password").val()


        //  return false;
        var $request = $.ajax({
            url: `${login.base_url}/admin/login`,
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(obj),
        });

        $request.done(function (data) {

            console.log(data)
            if (data.status) {

                sessionStorage.setItem("admin_login", "true")
                sessionStorage.setItem("name", data.data.name)
                sessionStorage.setItem("user_name", data.data.username)

                sessionStorage.setItem("user_id", data.data._id)
                sessionStorage.setItem("user_status", data.data.user_status)
                sessionStorage.setItem("user_token", data.token)


                toastr.options.positionClass = 'toast-bottom-right';
                toastr.success(data.message, '', { timeOut: 3000 },)
                setTimeout(() => {
                    window.location = '/dashboard';

                }, 1000);
            } else {
                $("#login_btn").attr("disabled", false);

                toastr.options.positionClass = 'toast-bottom-right';
                toastr.error(data.message, '', { timeOut: 3000 })
                // setTimeout(() => {
                //     window.location = '/login';

                // }, 3000);
            }
        })

    }









};





