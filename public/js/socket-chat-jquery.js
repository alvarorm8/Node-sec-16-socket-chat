var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

//referencias de jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
//funciones para renderizar usuarios

function renderizarUsuarios(personas) {
    console.log(personas);
    var html = "";
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';


    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '    <a data-id ="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);

}

function renderizarMensajes(mensaje, yo) {

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'info';
    if (mensaje.nombre === "Administrador") {
        adminClass = 'danger';
    }
    if (!yo) {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== "Administrador") {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>'
        html += '</div>'
        html += '<div class="chat-time">' + hora + '</div>'
        html += '</li>'
    } else {
        html += '<li class="reverse">'
        html += '    <div class="chat-content">'
        html += '        <h5>' + mensaje.nombre + '</h5>'
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>'
        html += '    </div>'
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li>'
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//Listeners de jquery

divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id'); //es el data-id de la central del html dentro del for
    if (id)
        console.log(id);
}); //cuando se haga click en cualquier elemento de divUsuarios, quiero disparar la función definida

formEnviar.on('submit', function(e) {
    e.preventDefault(); //evita que al pulsar enter para enviar el mensaje se recargue la pantalla
    if (txtMensaje.val().trim().length === 0) { //trim quita los espacios al principio y final del mensaje
        return;
    }
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus(); //focus sirve para que aunque se recargue la página, pulse el botón de envíar, etc., el cuadro para escribir se quede seleccionado
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});