
$(document).ready(function() {

  var location = window.location.pathname;

  setInterval(function fecha() {
    var fecha = new Date().toString();
    $("#fechaTop").html(fecha.substring(4,fecha.indexOf('GMT')));
  }, 1000);

  // function oculta muestra los tfooters con totales
  function toggleTFooters(fromOptionClick) {
    var option = sessionStorage.getItem('verTotales');
    if (option == undefined) {
      sessionStorage.setItem('verTotales', "OFF");
      toggleTFooters(fromOptionClick);
    } else if (!fromOptionClick) { // si viene desde otra uri, deja igual
      if (option == "OFF") {
        $('table.agenda tfoot').css('display', 'none');
        $('#aVerTotales').text("OFF")
      } else {
        $('table.agenda tfoot').css('display', 'table-footer-group');
        $('#aVerTotales').text("ON");
      }
    } else { // si es por click, cambia
      if (option == "OFF") {
        sessionStorage.setItem('verTotales', "ON");
        $('table.agenda tfoot').css('display', 'table-footer-group');
        $('#aVerTotales').text("ON")
      } else {
        sessionStorage.setItem('verTotales', "OFF");
        $('table.agenda tfoot').css('display', 'none');
        $('#aVerTotales').text("OFF")
      }
    }
  }

  // oculta opciones
  if (location == '/agenda') {
    $('#spaVerTotales').css('display', 'table-footer-group');
    toggleTFooters();
  } else {
    $('#spaVerTotales').css('display', 'none');
  }

  /*
   * EVENTOS
   */

  // clic en anchor Ver Totales
  $('#aVerTotales').on('click', function(ev) {
    ev.preventDefault();
    toggleTFooters(true);
  });

  // clic anchors en la tabla de Agenda
  $("table.agenda a").on("click", function(e) {
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

  // click anchors tablas Materias
  $('table.materias a').on('click', function(e) {
    sessionStorage.setItem('semestre', $(this).attr('data-semestre'));
    sessionStorage.setItem('matnombre', $(this).attr('data-matnombre'));
    var href = $(this).attr('href');
    if (href == "/modificarMateria") {
      var fila = $(this).closest('tr');
      sessionStorage.setItem('matcodigo', fila.children('[data-key="matcodigo"]').text());
      sessionStorage.setItem('grucodigo', fila.children('[data-key="grucodigo"]').text());
      sessionStorage.setItem('tutnombre', fila.children('[data-key="tutnombre"]').text());
    }
  });


  /*
   * AL CARGAR LOS FORMS
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

  if ($('form[name="modificarActividad"]').length) {
    $('#spaMateria').text(sessionStorage.getItem('materia'));
    // ...
  }

  if ($('form[name="modificarMateria"]').length) {
    $('#spaSemestre').text(sessionStorage.getItem('semestre'));
    $('#spaMateria').text(sessionStorage.getItem('matnombre'));
    $('form').find('input[name="semestre"]').val(sessionStorage.getItem('semestre'));
    $('form').find('input[name="matnombre"]').val(sessionStorage.getItem('matnombre'));
    $('form').find('input[name="matcodigo"]').val(sessionStorage.getItem('matcodigo'));
    $('form').find('input[name="grucodigo"]').val(sessionStorage.getItem('grucodigo'));
    $('form').find('input[name="tutnombre"]').val(sessionStorage.getItem('tutnombre'));
  }

  if($('form[name="borrarMateria"]').length) {
    var semestre = sessionStorage.getItem('semestre');
    var matnombre = sessionStorage.getItem('matnombre');
    $('#spaSemestre').text(semestre);
    $('#spaMateria').text(matnombre);
    $('input[name="semestre"]').val(semestre);
    $('input[name="matnombre"]').val(matnombre);
  }

  /*
   * OTROS
   */

  // formatea y pinta fechas y dias que faltan en Proximos
  $('#divProximos').find('.proxFechaFinal').each(function(i,fecha) {
    var hoy = Date.now();
    var fecfinal = fixDate(new Date(fecha.innerText));
    var spanDiasQueFaltan = $(fecha).parent().children('.proxDiasFaltan');
    if (hoy > fecfinal) {
      $(fecha).addClass('cCerrada');
      $(spanDiasQueFaltan).addClass('cCerrada');
    } else if (hoy > addDate(fecfinal, -6)) {
      $(fecha).addClass('c5dias');
      $(spanDiasQueFaltan).addClass('c5dias');
    } else if (hoy > addDate(fecfinal, -16)) {
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
    var fechaFinal = fixDate(new Date(unProximo.children('.proxFechaFinal').text()));
    var diasQueFaltan = getDaysDifference(fechaFinal, Date.now());

    if (diasQueFaltan < 0) {
      unProximo.children('.proxDiasFaltan').text("Cerrada");
    } else {
      unProximo.children('.proxDiasFaltan').text(diasQueFaltan + " día(s)");
    }
  });

  // formatea las fechas a YYYY-AA-MM
  var fila, fecfinalTexto, fecfinalCelda;
  $('table.agenda').find('tbody tr').each(function(i,fila) {
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
  $('table.agenda').find('tbody tr').each(function(i) {
    fila = $(this);
    fecinicio = fixDate(new Date(fila.find('td').eq(3).text()));
    fecfinal = fixDate(new Date(fila.find('td').eq(4).text()));
    celdaColor = fila.find('td').eq(4);
    hoy = Date.now();

    if (hoy > fecfinal) {
      celdaColor.addClass('cCerrada');
    } else if (hoy > addDate(fecfinal, -6)) {
      celdaColor.addClass('c5dias');
    } else if (hoy > addDate(fecfinal, -16)) {
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

  /*
   * CALCULOS
   */
  if (location == "/agenda") {
    var tablas = $('table.agenda');
    tablas.each(function(i,tabla) {
      var trs_tbody = $(tabla).find('tbody tr');
      var actPuntajeParcial = 0;
      var actPuntajeParcialObtenido = 0;
      $(trs_tbody).each(function(i,tr) {
        var puntos = $(tr).find('td[data-key="puntos"]').text();
        var calificacion = $(tr).find('td[data-key="calificacion"]').text();
        if (!isNaN(parseFloat(calificacion))) {
          actPuntajeParcial += parseFloat(puntos);
          actPuntajeParcialObtenido += parseFloat(calificacion);
        }
      });
      if (actPuntajeParcial == 0) actPuntajeParcial = "-";
      if (actPuntajeParcial == "-") actPuntajeParcialObtenido = "-";
      var trs_tfoot = $(tabla).find('tfoot tr');
      $(trs_tfoot).find('td[data-key="actPuntajeParcial"]').text(actPuntajeParcial);
      $(trs_tfoot).find('td[data-key="actPuntajeParcialObtenido"]').text(actPuntajeParcialObtenido);
      if (actPuntajeParcial != "-") {
        var actNotaParcial = actPuntajeParcialObtenido * 5 / actPuntajeParcial
        $(trs_tfoot).find('td[data-key="actNotaParcial"]').text(actNotaParcial);
      }
    });

  }

});
