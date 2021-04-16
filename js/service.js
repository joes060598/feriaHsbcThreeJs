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
 }

 function loginDiv() {
     $('#registroForm')[0].reset();
     $("#registro").hide();
     $("#login").fadeIn('slow');
 }

 function agendaAnterior(type) {
     $.get(url + `schedule/${type}`, function(data) {
         let pintar = "";
         let anteriores = ""
         let tituloDia = ""
         if (data.statusCode == 200) {
             let schedule = data.schedule;
             let arraySchedule = [];
             let fechaActual = new Date('2021-04-24T05:00:00.000Z');
             let diaActual = fechaActual.getDate();
             let mesActual = fechaActual.getMonth();
             for (const iterator of schedule) {
                 let fechaAgenda = new Date(iterator.fecha[0]);
                 let mesAgenda = fechaAgenda.getMonth();
                 let diaAgenda = fechaAgenda.getDate();
                 let diaAgendaWeek = fechaAgenda.getDay();
                 if (fechaAgenda < fechaActual) {
                     tituloDia = `<h1>${getDayTexto(diaAgendaWeek)+' '+diaAgenda}</h1><br>`
                     for (const agendad of iterator.res) {
                         if (agendad.status == "true") {
                             let fechaInicio = new Date(agendad.start);
                             let fechaFinal = new Date(agendad.finish);
                             //<a href="${agendad.video}" target="_blank">

                             if (type == 'DesarrolloCarrera') {
                                 pintar += `<div class="col-sm-3 col-xs-12">
                               <div class="cajainfo bg-desarrollo">
                                   <div class="coso1">
                                       <img src="img/coso1.svg" width="30">
                                   </div>
                                   <p>${agendad.name}</p>
                                   <h3 class="color-desarrollo2">${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</h3>
       
                                   <div class="btn1">
                                       <a href="https://vimeo.com/535667880" target="_blank">Aquí</a>
                                       <div class="bola"></div>
                                   </div>
       
                               </div>
                           </div>`
                             }
                             if (type == 'Finanzas') {
                                 pintar += `<div class="col-sm-3 col-xs-12">
                               <div class="cajainfo bg-finanzas">
                                   <div class="coso1">
                                       <img src="img/coso1.svg" width="30">
                                   </div>
                                   <p>${agendad.name}</p>
                                   <h3 class="color-finanzas2">${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</h3>
       
                                   <div class="btn1">
                                       <a href="https://vimeo.com/535667880" target="_blank">Aquí</a>
                                       <div class="bola"></div>
                                   </div>
       
                               </div>
                           </div>`
                             }
                             if (type == 'Cultura') {
                                 pintar += `<div class="col-sm-3 col-xs-12">
                               <div class="cajainfo bg-cultura">
                                   <div class="coso1">
                                       <img src="img/coso1.svg" width="30">
                                   </div>
                                   <p>${agendad.name}</p>
                                   <h3 class="color-cultura2">${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</h3>
       
                                   <div class="btn1">
                                       <a href="https://vimeo.com/535667880" target="_blank">Aquí</a>
                                       <div class="bola"></div>
                                   </div>
       
                               </div>
                           </div>`
                             }
                             if (type == 'SaludBienestar') {
                                 pintar += `<div class="col-sm-3 col-xs-12">
                               <div class="cajainfo bg-salud">
                                   <div class="coso1">
                                       <img src="img/coso1.svg" width="30">
                                   </div>
                                   <p>${agendad.name}</p>
                                   <h3 class="color-salud2">${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</h3>
       
                                   <div class="btn1">
                                       <a href="https://vimeo.com/535667880" target="_blank">Aquí</a>
                                       <div class="bola"></div>
                                   </div>
       
                               </div>
                           </div>`
                             }
                             if (type == 'Balance') {
                                 pintar += `<div class="col-sm-3 col-xs-12">
                               <div class="cajainfo bg-balance">
                                   <div class="coso1">
                                       <img src="img/coso1.svg" width="30">
                                   </div>
                                   <p>${agendad.name}</p>
                                   <h3 class="color-balance2">${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</h3>
       
                                   <div class="btn1">
                                       <a href="https://vimeo.com/535667880" target="_blank">Aquí</a>
                                       <div class="bola"></div>
                                   </div>
       
                               </div>
                           </div>`
                             }



                         }
                     }
                 } else {

                 }
             }

             if (type == "DesarrolloCarrera") {
                 //titutext
                 $("#titutext").html('<h2 class="color-desarrollo">CALENDARIO | DESARROLLO Y CARRERA</h2>')
                 $("#iconoAgendaEspecifica").html('<img src="img/desarrollo-de-carrera.png" width="200px">')
                 $("#marco").removeClass();
                 $("#marco").addClass("marco-desarrollo");
                 $('#tituloDia').html('<h1 class="color-desarrollo">' + tituloDia + '</h1>')
                 $('#contenidoAgenda').html(pintar)
             }
             if (type == "Balance") {
                 //titutext
                 $("#titutext").html('<h2 class="color-balance">CALENDARIO | BALANCE ENTRE TRABAJO Y TIEMPO LIBRE</h2>')
                 $("#iconoAgendaEspecifica").html('<img src="img/balance.png" width="200px">')
                 $("#marco").removeClass();
                 $("#marco").addClass("marco-balance");
                 $('#tituloDia').html('<h1 class="color-balance">' + tituloDia + '</h1>')
                 $('#contenidoAgenda').html(pintar)
             }
             if (type == "Finanzas") {
                 //titutext
                 $("#titutext").html('<h2 class="color-finanzas">CALENDARIO | FINANZAS</h2>')
                 $("#iconoAgendaEspecifica").html('<img src="img/finanzas.png" width="200px">')
                 $("#marco").removeClass();
                 $("#marco").addClass("marco-finanzas");
                 $('#tituloDia').html('<h1 class="color-finanzas">' + tituloDia + '</h1>')
                 $('#contenidoAgenda').html(pintar)
             }
             if (type == "Cultura") {
                 //titutext
                 $("#titutext").html('<h2 class="color-cultura">CALENDARIO | CULTURA Y VALORES</h2>')
                 $("#iconoAgendaEspecifica").html('<img src="img/cultura-y-valores.png" width="200px">')
                 $("#marco").removeClass();
                 $("#marco").addClass("marco-cultura");
                 $('#tituloDia').html('<h1 class="color-cultura">' + tituloDia + '</h1>')
                 $('#contenidoAgenda').html(pintar)
             }
             if (type == "SaludBienestar") {
                 //titutext
                 $("#titutext").html('<h2 class="color-salud">CALENDARIO | SALUD Y BIENESTAR</h2>')
                 $("#iconoAgendaEspecifica").html('<img src="img/salud-y-bienestar.png" width="200px">')
                 $("#marco").removeClass();
                 $("#marco").addClass("marco-salud");
                 $('#tituloDia').html('<h1 class="color-salud">' + tituloDia + '</h1>')
                 $('#contenidoAgenda').html(pintar)
             }

             $("#agenda").hide();
             $("canvas").hide();
             $("#agendaEspecifica").show();
         } else {
             alertify.error(data.message);
         }
     });
 }

 function agenda(type) {
     $.get(url + `schedule/${type}`, function(data) {
         let pintar = "";
         let anteriores = ""
         let fechas = [];
         //let fechaActual = new Date();
         //QUITAR
         let tituloDia = "";
         let fechaActual = new Date('2021-04-24T05:00:00.000Z');
         let diaActual = fechaActual.getDate();
         let mesActual = fechaActual.getMonth();
         if (data.statusCode == 200) {
             let schedule = data.schedule;
             for (const iterator of schedule) {
                 let fechaAgenda = new Date(iterator.fecha[0]);
                 fechas.push(fechaAgenda);
                 let mesAgenda = fechaAgenda.getMonth();
                 let diaAgenda = fechaAgenda.getDate();
                 let diaAgendaWeek = fechaAgenda.getDay();
                 if (diaActual == diaAgenda && mesActual == mesAgenda) {
                     tituloDia = `<h1>${getDayTexto(diaAgendaWeek)+' '+diaAgenda}</h1><br>`;
                     for (const agendad of iterator.res) {
                         if (agendad.status == "true") {
                             let fechaInicio = new Date(agendad.start);
                             let fechaFinal = new Date(agendad.finish);
                             if (type == 'DesarrolloCarrera') {
                                 pintar += `<div class="col-sm-3 col-xs-12">
                                <div class="cajainfo bg-desarrollo">
                                    <div class="coso1">
                                        <img src="img/coso1.svg" width="30">
                                    </div>
                                    <p>${agendad.name}</p>
                                    <h3 class="color-desarrollo2">${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</h3>
        
                                    <div class="btn1">
                                        <a href="${agendad.url}" target="_blank">Aquí</a>
                                        <div class="bola"></div>
                                    </div>
        
                                </div>
                            </div>`
                             }
                             if (type == 'Finanzas') {
                                 pintar += `<div class="col-sm-3 col-xs-12">
                                <div class="cajainfo bg-finanzas">
                                    <div class="coso1">
                                        <img src="img/coso1.svg" width="30">
                                    </div>
                                    <p>${agendad.name}</p>
                                    <h3 class="color-finanzas2">${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</h3>
        
                                    <div class="btn1">
                                        <a href="${agendad.url}" target="_blank">Aquí</a>
                                        <div class="bola"></div>
                                    </div>
        
                                </div>
                            </div>`
                             }
                             if (type == 'Cultura') {
                                 pintar += `<div class="col-sm-3 col-xs-12">
                                <div class="cajainfo bg-cultura">
                                    <div class="coso1">
                                        <img src="img/coso1.svg" width="30">
                                    </div>
                                    <p>${agendad.name}</p>
                                    <h3 class="color-cultura2">${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</h3>
        
                                    <div class="btn1">
                                        <a href="${agendad.url}" target="_blank">Aquí</a>
                                        <div class="bola"></div>
                                    </div>
        
                                </div>
                            </div>`
                             }
                             if (type == 'SaludBienestar') {
                                 pintar += `<div class="col-sm-3 col-xs-12">
                                <div class="cajainfo bg-salud">
                                    <div class="coso1">
                                        <img src="img/coso1.svg" width="30">
                                    </div>
                                    <p>${agendad.name}</p>
                                    <h3 class="color-salud2">${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</h3>
        
                                    <div class="btn1">
                                        <a href="${agendad.url}" target="_blank">Aquí</a>
                                        <div class="bola"></div>
                                    </div>
        
                                </div>
                            </div>`
                             }
                             if (type == 'Balance') {
                                 pintar += `<div class="col-sm-3 col-xs-12">
                                <div class="cajainfo bg-balance">
                                    <div class="coso1">
                                        <img src="img/coso1.svg" width="30">
                                    </div>
                                    <p>${agendad.name}</p>
                                    <h3 class="color-balance2">${getHora(fechaInicio.getUTCHours())+'- '+getHora(fechaFinal.getUTCHours())}</h3>
        
                                    <div class="btn1">
                                        <a href="${agendad.url}" target="_blank">Aquí</a>
                                        <div class="bola"></div>
                                    </div>
        
                                </div>
                            </div>`
                             }

                         }
                     }
                 }
             }
             fechas.sort();
             if (pintar == "") {


                 if (fechas[0] > fechaActual) {
                     let d = fechas[0].getDate();
                     let w = fechas[0].getDay();
                     pintar = `El día de hoy no hay agenda abierta, hasta 
                     ${getDayTexto(w)+' '+d}<br>`
                 } else if (pintar == "" && fechas[1] > fechaActual) {
                     let d = fechas[1].getDate();
                     let w = fechas[1].getDay();
                     pintar = `El día de hoy no hay agenda abierta, hasta 
                    ${getDayTexto(w)+' '+d}<br>`
                 }

             }
             /**
              * DesarrolloCarrera

             Finanzas

             Cultura

             SaludBienestar

             Balance
              */
             if (type == "DesarrolloCarrera") {
                 //titutext
                 $("#titutext").html('<h2 class="color-desarrollo">CALENDARIO | DESARROLLO Y CARRERA</h2>')
                 $("#iconoAgendaEspecifica").html('<img src="img/desarrollo-de-carrera.png" width="200px">')
                 $("#marco").removeClass();
                 $("#marco").addClass("marco-desarrollo");
                 $('#tituloDia').html('<h1 class="color-desarrollo">' + tituloDia + '</h1>')
                 $('#contenidoAgenda').html(pintar)
             }
             if (type == "Balance") {
                 //titutext
                 $("#titutext").html('<h2 class="color-balance">CALENDARIO | BALANCE ENTRE TRABAJO Y TIEMPO LIBRE</h2>')
                 $("#iconoAgendaEspecifica").html('<img src="img/balance.png" width="200px">')
                 $("#marco").removeClass();
                 $("#marco").addClass("marco-balance");
                 $('#tituloDia').html('<h1 class="color-balance">' + tituloDia + '</h1>')
                 $('#contenidoAgenda').html(pintar)
             }
             if (type == "Finanzas") {
                 //titutext
                 $("#titutext").html('<h2 class="color-finanzas">CALENDARIO | FINANZAS</h2>')
                 $("#iconoAgendaEspecifica").html('<img src="img/finanzas.png" width="200px">')
                 $("#marco").removeClass();
                 $("#marco").addClass("marco-finanzas");
                 $('#tituloDia').html('<h1 class="color-finanzas">' + tituloDia + '</h1>')
                 $('#contenidoAgenda').html(pintar)
             }
             if (type == "Cultura") {
                 //titutext
                 $("#titutext").html('<h2 class="color-cultura">CALENDARIO | CULTURA Y VALORES</h2>')
                 $("#iconoAgendaEspecifica").html('<img src="img/cultura-y-valores.png" width="200px">')
                 $("#marco").removeClass();
                 $("#marco").addClass("marco-cultura");
                 $('#tituloDia').html('<h1 class="color-cultura">' + tituloDia + '</h1>')
                 $('#contenidoAgenda').html(pintar)
             }
             if (type == "SaludBienestar") {
                 //titutext
                 $("#titutext").html('<h2 class="color-salud">CALENDARIO | SALUD Y BIENESTAR</h2>')
                 $("#iconoAgendaEspecifica").html('<img src="img/salud-y-bienestar.png" width="200px">')
                 $("#marco").removeClass();
                 $("#marco").addClass("marco-salud");
                 $('#tituloDia').html('<h1 class="color-salud">' + tituloDia + '</h1>')
                 $('#contenidoAgenda').html(pintar)
             }
             $("#agenda").hide();
             $("canvas").hide();
             $("#agendaEspecifica").show();

         } else {
             alertify.error(data.message);
         }
     });
 }

 function cerrarAgenda() {
     $("#agenda").hide();
     $("#agendaGral").show();

     $("#nameGral").show();
     $("canvas").show();
 }

 function cerrarAgendaEspecifica() {
     $("#agenda").hide();
     $("#agendaEspecifica").css('display', 'none');
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
             if (data.data.gender != "-1") {
                 alertify.success('Bienvenido ' + data.data.name);
                 sessionStorage.setItem('token', data.data.token);
                 sessionStorage.setItem('name', data.data.name);
                 sessionStorage.setItem('gender', data.data.gender);

                 $('#pasoLogin').hide();
             } else {
                 alertify.error('Debe completar su registro.');

             }


         } else {
             alertify.error(data.message);

         }
     });



 }

 function buscarUser(type) {
     let email = $('#email').val();
     $.get(url + "user/" + email, function(data) {
         if (data.statusCode == 200) {
             let user = data.user;
             if (user.err) {
                 if (type == 'none') {
                     alertify.error(user.err)
                 }

                 $('#password').val("");
                 $('#gender').val("-1");
             } else {
                 $('#password').val(user.password);
                 $('#gender').val(user.gender);
             }
         } else {
             alertify.error(data.message);
         }
     });
 }

 function registroSend() {
     let email = $('#email').val();
     let gender = $('#gender').val();
     if (gender == "-1") {
         alertify.error('Debe seleccionar su género');
         return;
     }
     if (email == "") {
         alertify.error('Debe buscar su usuario');
         return;
     }
     let request = {
         gender: gender,
     }


     $.ajax({
         url: url + "user/" + email,
         type: 'PUT',
         data: request,
         success: function(data) {
             if (data.statusCode == 200) {
                 if (data.user.err) {
                     alertify.error(data.user.err);
                 } else {
                     alertify.success("Se han actualizado sus datos correctamente.");
                 }
             } else {
                 alertify.error(data.message);
             }
         }
     });



 }

 function enviarPregunta(type, caja, cluster) {
     let pregunta = $('#' + type);
     let cajaHide = $('#' + caja);
     if (pregunta.val() == undefined && pregunta.val() == "") {
         alertify.error('No puede enviar una pregunta vacía.');
         return;
     }

     $.ajax({
         url: url + "questions/create",
         type: 'post',
         data: {
             question: pregunta.val(),
             cluster: cluster,
             token: sessionStorage.getItem('token')
         },
         dataType: 'json',
         success: function(data) {
             alertify.success('Se ha enviado correctamente su pregunta, espere a que el equipo de soporte se comunique usted.');
             pregunta.val('');
             cajaHide.hide();
         },
         error: function(err) {
             console.log('err :>> ', err);
             alertify.error(err.message);

         }
     });

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