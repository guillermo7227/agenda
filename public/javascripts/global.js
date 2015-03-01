
$(document).ready(function() {

  setInterval(function fecha() {
    var fecha = new Date().toString();
    $("#fechaTop").html(fecha.substring(4,fecha.indexOf('GMT')));
  }, 1000);

  // oculta opciones
  $('#spaVerTotales').css('display', 'none');
  $('#spaResaltarColaborativos').css('display', 'none');



});
