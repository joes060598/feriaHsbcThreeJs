//let url = 'http://173.231.203.133:4000/';
let url = 'http://feriaswbhsbc.com:4000/';
let _APP = null;

$(document).ready(function() {
    $(".mostrar").on("click", function() {
        $('.cajacoments').show(); //muestro mediante clase
    });
    $(".ocultar").on("click", function() {
        $('.cajacoments').hide(); //muestro mediante clase
    });
});

function registro() {
    $("#login").hide();
    $("#registro").fadeIn('slow');
    $("#password").val(generatePasswordRand(8, 'alf'));
}

function loginDiv() {
    $("#registro").hide();
    $("#login").fadeIn('slow');
}

function agenda(type) {
    $.get(url + `schedule/${type}`, function(data) {
        if (data.statusCode == 200) {
            let schedule = data.schedule;
            let arraySchedule = [];
            for (const iterator of schedule) {
                for (const scheduleAlone of iterator.res) {
                    let register = {
                        title: scheduleAlone.name,
                        start: scheduleAlone.start,
                        end: scheduleAlone.finish,
                        url: scheduleAlone.url,
                        video: scheduleAlone.url
                    }
                    arraySchedule.push(register)
                }
            }

            let calendarEl = document.getElementById('calendar');
            let calendar = new FullCalendar.Calendar(calendarEl, {
                height: 450,
                lang: 'es',
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prevYear,prev,next,nextYear today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,dayGridDay'
                },
                initialDate: '2021-04-22',
                navLinks: true, // can click day/week names to navigate views
                editable: true,
                dayMaxEvents: true, // allow "more" link when too many events
                events: arraySchedule,
                eventClick: function(event) {
                    if (event.event.url) {
                        event.jsEvent.preventDefault();
                        window.open(event.event.url, "_blank");
                        return false;
                    }
                }
            });
            setTimeout(() => {
                calendar.render();
            }, 100)
        } else {
            alertify.error(data.message);
        }
    });


    $("#agendaGral").hide();
    $("canvas").hide();
    $("#agendaEspecifica").show('slow');
}

function cerrarAgenda() {
    $("#agenda").hide();
    $("#agendaGral").show();
    $("#agendaEspecifica").hide();
    $("#nameGral").show();

    $("canvas").show();
}
var hitSound, danceSound;

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
            sessionStorage.setItem('gender', data.data.gender);

            $('#pasoLogin').hide();
            hitSound = new Audio('./assets/music2.mp3');
            console.log('hitSound :>> ', hitSound);
            hitSound.loop = true;
            hitSound.volume = 0.5;
            hitSound.currentTime = 0;
            hitSound.play();
            danceSound = new Audio('./assets/music.mp3');
            danceSound.loop = true;
            danceSound.volume = 0.5;
            danceSound.currentTime = 0;
            console.log('danceSound :>> ', danceSound);
        } else {
            alertify.error(data.message);

        }
    });



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
    let checkEmail = email.search("@hsbc.com.mx");
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
            $("#registro").hide();
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

function enviarPregunta(type, caja) {
    let pregunta = $('#' + type);
    let cajaHide = $('#' + caja);
    if (pregunta.val() != undefined && pregunta.val() != "") {
        alertify.success('Se ha enviado correctamente tu duda, espera a que el equipo de soporte te contacte.');
        cajaHide.hide();
    } else {
        alertify.error('No puede enviar una pregunta vacía.');

    }

    /*$.ajax({
        url: url + "questions/create",
        type: 'post',
        data: {
            question: pregunta.val()
        },
        headers: {
            token: sessionStorage.getItem('token'), //If your header name has spaces or any other char not appropriate
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        dataType: 'json',
        success: function(data) {
            alertify.success('Se ha enviado correctamente tu duda, espera a que el equipo de soporte te contacte.');
            pregunta.val('');
            cajaHide.hide();
        },
        error: function(err) {
            alertify.error(err.message);

        }
    });*/

}

function generatePasswordRand(length, type) {
    switch (type) {
        case 'num':
            characters = "0123456789";
            break;
        case 'alf':
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            break;
        case 'rand':
            //FOR ↓
            break;
        default:
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            break;
    }
    var pass = "";
    for (i = 0; i < length; i++) {
        if (type == 'rand') {
            pass += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
        } else {
            pass += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    }
    return pass;
}