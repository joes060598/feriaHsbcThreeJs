let url = 'http://localhost:4000/';
let _APP = null;


function registro() {
    $("#login").hide();
    $("#formRegistro").fadeIn('slow');
    $("#log").html("Regístrate")
}

function loginDiv() {
    $("#formRegistro").hide();
    $("#login").fadeIn('slow');

    $("#log").html("Iniciar sesión")

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
    $.post(url + "user/login", request, function(data) {
        if (data.statusCode == 200) {
            console.log('data :>> ', data);
            alertify.success('Bienvenido ' + data.data.name);
            sessionStorage.setItem('token', data.data.token);
            sessionStorage.setItem('name', data.data.name);
            sessionStorage.setItem('caracter', data.data.name);

            $('#registro').modal('hide');

        } else {
            alertify.error(data.message);

        }
    });


}

function registroSend() {

    let name = $('#name').val();
    let lastName = $('#lastname').val();
    let phone = $('#phone').val();
    let department = $('#department').val();
    let job = $('#job').val();
    let email = $('#email').val();
    let password = $('#password').val();
    let gender = $('#gender').val();


    let cp = $('#cp').val();
    let municipio = $('#municipio').val();

    let edo = $('#edo').val();
    let colonia = $('#colonia').val();
    let calle = $('#calle').val();
    let inter = $('#inter').val();
    let ex = $('#ex').val();
    if (!ex) {
        ex = 's/n';
    }


    if (!name || !lastName || !phone || !department || !job || !email || !password || gender == '-1' || !cp ||
        !municipio || !edo || !colonia || !calle || !inter) {
        alertify.error('Debe registrar información en los campos requeridos');
        return;
    }
    console.log('phone.length :>> ', phone.length);
    if (phone.length != 10) {
        alertify.error('Su número telefonico debe ser a 10 dígitos');
        return;
    }
    if (cp.length != 5) {
        alertify.error('El código postal debe ser  5 dígitos');
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
        name: name,
        lastName: lastName,
        phone: parseInt(phone),
        department: department,
        job: job,
        email: email,
        password: password,
        gender: gender,
        calle: calle,
        exterior: ex,
        interior: inter,
        estado: edo,
        municipio: municipio,
        colonia: colonia,
        cp: cp
    }


    $.post(url + "user/create", request, function(data) {
        if (data.statusCode == 200) {
            alertify.success('Se ha registrado correctamente a la feria.');
            $('#registroForm')[0].reset();
            $("#formRegistro").hide();
            $("#login").fadeIn('slow');
        } else {
            let err = data.message;
            if (err = 'User validation failed') {
                //alertify.error('Verifique que los campos requeridos esten completos.');

            }
            alertify.error(data.message);


        }
    });
}