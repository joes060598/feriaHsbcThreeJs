let url = 'http://173.231.203.133:4000/';
let _APP = null;


function registro() {
    $("#login").hide();
    $("#formRegistro").fadeIn('slow');
    $("#log").html("Regístrate")
}

function loginDiv() {
    $("#formRegistro").hide();
    $("#login").fadeIn('slow');

    $("#log").html("Iniciar sesión");
    $("#personaj").html('<img src="./assets/img/feria.png" width="90%" class="image "> </div>');


}

function setImageCharacter() {
    let type = $('#gender').val();
    if (type == 'H') {
        $("#personaj").html('<img src="./assets/img/man.png" width="400px" heigth="800px"> </div>');

    } else if (type == 'M') {
        $("#personaj").html('<img src="./assets/img/girl.png" width="400px" heigth="450px" > </div>');

    } else if (type == 'NA') {
        $("#personaj").html('<img src="./assets/img/robot.png" width="400px" heigth="450px" > </div>');

    } else if (type == '-1') {
        $("#personaj").html('');

    }

}

function login() {
    let email = $('#emailLogin').val();
    let password = $('#passwordLogin').val();
    if (!email || !password) {
        alertify.error('Ingrese los datos necesarios.')
        return;
    }
    let request = {
            email: email,
            password: password
        }
        /*$.post(url + "user/login", request, function(data) {
            if (data.statusCode == 200) {
                console.log('data :>> ', data);
                alertify.success('Bienvenido ' + data.data.name);
                sessionStorage.setItem('token', data.data.token);
                sessionStorage.setItem('name', data.data.name);
                sessionStorage.setItem('gender', data.data.gender);

                $('#registro').modal('hide');

            } else {
                alertify.error(data.message);

            }
        });*/
    alertify.success('Bienvenido ');
    sessionStorage.setItem('token', 'temporal');
    sessionStorage.setItem('name', 'Pruebas');
    sessionStorage.setItem('gender', 'H');

    $('#registro').modal('hide');


}

function registroSend() {
    let email = $('#email').val();
    let password = $('#password').val();
    let gender = $('#gender').val();
    if (gender == "-1") {
        alertify.error('Debe seleccionar su género');
        return;
    }
    if (password.length < 8) {
        alertify.error('La contraseña debe tener como mínimo 8 caracteres');
        return;
    }
    let checkEmail = email.search("@hsbc.com");
    if (checkEmail == -1) {
        alertify.error('El correo debe ser institucional de hsbc, verifique de nuevo');
        return;
    }

    let request = {
        email: email,
        password: password,
        gender: gender,
    }


    $.post(url + "user/create", request, function(data) {
        if (data.statusCode == 200) {
            alertify.success('Se ha registrado correctamente a la feria.');
            $('#registroForm')[0].reset();
            $("#formRegistro").hide();
            $("#login").fadeIn('slow');
            $("#personaj").html('<img src="./assets/img/feria.png" width="90%" class="image "> </div>');

        } else {
            let err = data.message;
            if (err = 'User validation failed') {
                //alertify.error('Verifique que los campos requeridos esten completos.');

            }
            alertify.error(data.message);


        }
    });
}