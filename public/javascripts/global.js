
$(document).ready(function() {

  var location = window.location.pathname;

  setInterval(function fecha() {
    var fecha = new Date().toString();
    $("#fechaTop").html(fecha.substring(4,fecha.indexOf('GMT')));
  }, 1000);


  /*
   * EVENTOS
   */
  $("table a").on("click", function(e) {

    var href = $(this).attr('href');

    sessionStorage.setItem('materia', $(this).attr("data-materia"));
    sessionStorage.setItem('actividad', $(this).attr("data-actividad"));

    if (href == "/modificarActividad") {
      // recupera los valores de la actividad seleccionada
      var fila = $(this).closest('tr');
      var descripcion = fila.children('td:eq(2)').text();
      var fechainicio = fila.children('td:eq(3)').text();
      var fechafinal = fila.children('td:eq(4)').text();
      var puntos = fila.children('td:eq(5)').text();
      var calificacion = fila.children('td:eq(6)').text();

      sessionStorage.setItem('descripcion', descripcion);
      sessionStorage.setItem('fechainicio', fechainicio);
      sessionStorage.setItem('fechafinal', fechafinal);
      sessionStorage.setItem('puntos', puntos);
      sessionStorage.setItem('calificacion', calificacion);
    }

  });


  /*
   * OTROS
   */

  if ($("#hidMateria").length) {
    $("#spaMateria").text(sessionStorage.getItem('materia'));
    $("#hidMateria").attr('value', sessionStorage.getItem('materia'));
  }

  if ($("#hidActividad").length) {
    $("#spaActividad").text(sessionStorage.getItem('actividad'));
    $("#hidActividad").attr('value', sessionStorage.getItem('actividad'));

    $("#txtDescripcion").val(sessionStorage.getItem('descripcion'));
    $("#txtFechaInicio").val(sessionStorage.getItem('fechainicio'));
    $("#txtFechaFinal").val(sessionStorage.getItem('fechafinal'));
    $("#txtPuntos").val(sessionStorage.getItem('puntos'));
    $("#txtCalificacion").val(sessionStorage.getItem('calificacion'));
  }

  // formatea y pinta fechas y dias que faltan en Proximos
  $('#divProximos').find('.proxFechaFinal').each(function(i,fecha) {
    var fecfinal = fixDate(new Date(fecha.innerText));
    var hoy = Date.now();
    var spanDiasQueFaltan = $(fecha).parent().children('.proxDiasFaltan');
    if (hoy > fecfinal) {
      $(fecha).addClass('cCerrada');
      $(spanDiasQueFaltan).addClass('cCerrada');
    } else if (hoy > addDate(fecfinal, -5)) {
      $(fecha).addClass('c5dias');
      $(spanDiasQueFaltan).addClass('c5dias');
    } else if (hoy > addDate(fecfinal, -15)) {
      $(fecha).addClass('c15dias');
      $(spanDiasQueFaltan).addClass('c15dias');
    } else if (hoy > fecinicio) {
      $(fecha).addClass('cAbierta');
      $(spanDiasQueFaltan).addClass('cAbierta');
    }
    fecha.innerHTML = formatDate(fecfinal);
  });

  // pone los dias que faltan en 'Proximos'
  $('#divProximos').children('span').each(function(i,unProximo) {
    var unProximo = $(unProximo);
    var fechaFinal = fixDate(new Date(unProximo.children('.proxFechaFinal').text()))
    var diasQueFaltan = fechaFinal.getDate() - new Date().getDate();
    if (diasQueFaltan < 0) {
      unProximo.children('.proxDiasFaltan').text("Cerrada");
    } else {
      unProximo.children('.proxDiasFaltan').text(diasQueFaltan + " día(s)");
    }
  });

  // formatea las fechas a YYYY-AA-MM
  var fila, fecfinalTexto, fecfinalCelda;
  $('table').find('tbody tr').each(function(i,fila) {
    fila = $(fila);
    fecinicioCelda = fila.find('td').eq(3);
    fecinicioTexto = fixDate(new Date(fecinicioCelda.text()));
    fecinicioCelda.html(formatDate(fecinicioTexto));
    fecfinalCelda = fila.find('td').eq(4);
    fecfinalTexto = fixDate(new Date(fecfinalCelda.text()));
    fecfinalCelda.html(formatDate(fecfinalTexto));
  });

  // Pinta de colores segun las fechas
  var fila, fecinicio, fecfinal, hoy, puntos;
  $('table').find('tbody tr').each(function(i) {
    fila = $(this);
    fecinicio = fixDate(new Date(fila.find('td').eq(3).text()));
    fecfinal = fixDate(new Date(fila.find('td').eq(4).text()));
    celdaColor = fila.find('td').eq(4);
    hoy = Date.now();

    if (hoy > fecfinal) {
      celdaColor.addClass('cCerrada');
    } else if (hoy > addDate(fecfinal, -5)) {
      celdaColor.addClass('c5dias');
    } else if (hoy > addDate(fecfinal, -15)) {
      celdaColor.addClass('c15dias');
    } else if (hoy > fecinicio) {
      celdaColor.addClass('cAbierta');
    }
  });

  // pareja los altos de tablas de dos en dos
  $('#divTablas').find('div').each(function(i,div) {
    if (i % 2 != 0) { //tablas de la derecha
      var prevDivHeight = $(div).prev().height();
      var divHeight = $(div).height();
      if (prevDivHeight > divHeight) {
        $(div).height(prevDivHeight);
      }
    }
  });

});
