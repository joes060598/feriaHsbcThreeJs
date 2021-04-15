 //let url = 'http://173.231.203.133:4000/';
 let url = 'https://api.feriaswbhsbc.com/';
 //let url = 'http://localhost:4000/';
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
         let pintar = "";
         let anteriores = ""
         if (data.statusCode == 200) {
             let schedule = data.schedule;
             let arraySchedule = [];
             console.log('schedule :>> ', schedule);
             //let fechaActual = new Date();
             //QUITAR
             let fechaActual = new Date("2021-04-24T07:00:00.000Z");
             let diaActual = fechaActual.getUTCDay();
             let mesActual = fechaActual.getMonth();
             console.log('fechaActual :>> ', fechaActual);
             console.log('diaActual :>> ', diaActual);
             console.log('mesActual :>> ', mesActual);
             for (const iterator of schedule) {
                 let fechaAgenda = new Date(iterator.fecha[0]);
                 console.log('fechaAgenda :>> ', fechaAgenda);
                 let mesAgenda = fechaAgenda.getMonth();
                 let diaAgenda = fechaAgenda.getDate();
                 console.log('mesAgenda :>> ', mesAgenda);
                 console.log('diaAgenda :>> ', diaAgenda);
                 if (diaActual == diaAgenda && mesActual == mesAgenda) {
                     pintar += `${getDayTexto(diaAgenda)+' '+diaAgenda}<br>`
                     for (const agendad of iterator.res) {
                         if (agendad.status == "true") {
                             let fechaInicio = new Date(agendad.start);
                             let fechaFinal = new Date(agendad.finish);

                             pintar += `<div>
                                       <p> ${agendad.name}</p>
                                       <p>${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</p>
                                       <a href="${agendad.url}" target="_blank">
                                       AQUI
                                       </a>
                                   </div>`
                         }
                     }
                 } else {

                 }
             }
             console.log('pintar :>> ', pintar);
             $('#calendar').html(pintar);
             $("#agendaGral").hide();
             $("canvas").hide();
             $("#agendaEspecifica").show('slow');
         } else {
             alertify.error(data.message);
         }
     });
 }

 function cerrarAgenda() {
     $("#agenda").hide();
     $("#agendaGral").show();
     $("#agendaEspecifica").hide();
     $("#nameGral").show();

     $("canvas").show();
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
             sessionStorage.setItem('gender', data.data.gender);

             $('#pasoLogin').hide();

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

     /* $.ajax({
          url: url + "questions/create",
          type: 'post',
          data: {
              question: pregunta.val(),
              cluster: 'default'
          },
          beforeSend: function(jqXHR, settings) {
              jqXHR.setRequestHeader('token', String(sessionStorage.getItem('token')));
          },
          dataType: 'json',
          success: function(data) {
              alertify.success('Sssss');
              pregunta.val('');
              cajaHide.hide();
          },
          error: function(err) {
              console.log('err :>> ', err);
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

 function getHora(hora) {
     if (hora == 1) {
         return "1 am ";
     }
     if (hora == 2) {
         return "2 am ";
     }
     if (hora == 3) {
         return "3 am ";
     }
     if (hora == 4) {
         return "4 am ";
     }
     if (hora == 5) {
         return "5 am ";
     }
     if (hora == 6) {
         return "6 am ";
     }
     if (hora == 7) {
         return "7 am ";
     }
     if (hora == 8) {
         return "8 am ";
     }
     if (hora == 9) {
         return "9 am ";
     }
     if (hora == 10) {
         return "10 am ";
     }
     if (hora == 11) {
         return "11 am ";
     }
     if (hora == 12) {
         return "12 pm ";
     }
     if (hora == 13) {
         return "1 pm ";
     }
     if (hora == 14) {
         return "2 pm ";
     }
     if (hora == 15) {
         return "3 pm ";
     }
     if (hora == 16) {
         return "4 pm ";
     }
     if (hora == 17) {
         return "5 pm ";
     }
     if (hora == 18) {
         return "6 pm ";
     }
     if (hora == 19) {
         return "1 pm ";
     }
     if (hora == 20) {
         return "8 pm ";
     }
     if (hora == 21) {
         return "9 pm ";
     }
     if (hora == 22) {
         return "10 pm ";
     }
     if (hora == 23) {
         return "11 pm ";
     }
     if (hora == 24) {
         return "12 pm ";
     }
 }


 function getDayTexto(dia) {
     if (dia == 1) {
         return 'LUNES';
     }
     if (dia == 2) {
         return 'MARTES';
     }
     if (dia == 3) {
         return 'MIERCOLES';
     }
     if (dia == 4) {
         return 'JUEVES';
     }
     if (dia == 5) {
         return 'VIERNES';
     }
     if (dia == 6) {
         return 'SÁBADO';
     }
 }