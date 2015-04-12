$(document).ready(function() {

  $('#spaVerTotales').css('display', 'inline');
  $('#spaResaltarColaborativos').css('display', 'inline');
  $('#spaAlternarProximos').css('display', 'inline');
  toggleTFooters();


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

  /*
   * EVENTOS
   */

    //alternar proximas fechas
    $('#aAlternarProximos').on('click', function (ev) {
        ev.preventDefault();
        $('#divProximos').slideToggle();
    });

  // clic en anchor Ver Totales
  $('#aVerTotales').on('click', function(ev) {
    ev.preventDefault();
    toggleTFooters(true);
  });

  // resalta los trabajos colaborativos abiertos
  $('#aResaltarColaborativos').on('click', function(ev) {
    ev.preventDefault();
    var tablas = $('table.agenda');
    if ($(this).text() == "OFF") {
      $(tablas).each(function(i,tabla) {
        var tdsDescripcion = $(tabla).find('td[data-key="descripcion"]:contains("colaborativo")');
        $(tdsDescripcion).each(function(i,td) {
            var fecinicio = new Date($(td).closest('tr').children('td[data-key="fecinicio"]').text());
            var fecfinal = new Date($(td).closest('tr').children('td[data-key="fecfinal"]').text());
            if (fecinicio < Date.now() && fecfinal > Date.now()) $(td).addClass('resaltado');
        });
      });
      $(this).text("ON");
    } else {
      $(tablas).each(function(i,tabla) {
        $(tabla).find('td.resaltado').removeClass('resaltado');
      });
      $(this).text("OFF")
    }
  });


  // clic anchors en la tabla de Agenda //TODO: fix this
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


  // formatea y pinta fechas y dias que faltan en Proximos
  $('#divProximos').find('.proxFechaFinal').each(function(i,fecha) {
    var hoy = Date.now();
    var fecfinal = fixDate(new Date(fecha.innerText));
    var spanDiasQueFaltan = $(fecha).parent().children('.proxDiasFaltan');
    if (hoy > fecfinal) {
      //$(fecha).addClass('cCerrada');
      $(spanDiasQueFaltan).addClass('cCerrada');
    } else if (hoy > addDate(fecfinal, -6)) {
      //$(fecha).addClass('c5dias');
      $(spanDiasQueFaltan).addClass('c5dias');
    } else if (hoy > addDate(fecfinal, -16)) {
      //$(fecha).addClass('c15dias');
      $(spanDiasQueFaltan).addClass('c15dias');
    } else {
      //$(fecha).addClass('cAbierta');
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

  // formatea las fechas a YYYY-AA-MM //TODO: fix this
  $('table.agenda').find('tbody tr').each(function(i,fila) {
    var fila, fecfinalTexto, fecfinalCelda;
    fila = $(fila);
    fecinicioCelda = fila.find('td').eq(3);
    fecinicioTexto = fixDate(new Date(fecinicioCelda.text()));
    fecinicioCelda.html(formatDate(fecinicioTexto));
    fecfinalCelda = fila.find('td').eq(4);
    fecfinalTexto = fixDate(new Date(fecfinalCelda.text()));
    fecfinalCelda.html(formatDate(fecfinalTexto));
  });

  // Pinta de colores segun las fechas
  $('table.agenda').find('tbody tr').each(function(i) {
    var fila, fecinicio, fecfinal, hoy, puntos;
    fila = $(this);
    var calificacion = fila.find('td[data-key="calificacion"]').text();
    fecinicio = fixDate(new Date(fila.find('td[data-key="fecinicio"]').text()));
    fecfinal = fixDate(new Date(fila.find('td[data-key="fecfinal"]').text()));
    tdFecfinal = fila.find('td[data-key="fecfinal"]');
    hoy = Date.now();

    if (hoy > fecfinal) {
      tdFecfinal.addClass('cCerrada');
    } else if (calificacion != "" && !isNaN(calificacion) || calificacion == "E") {
        tdFecfinal.addClass('cEntregada');
    } else if (hoy > addDate(fecfinal, -6)) {
        tdFecfinal.addClass('c5dias');
    } else if (hoy > addDate(fecfinal, -16)) {
      tdFecfinal.addClass('c15dias');
    } else if (hoy >= fecinicio) {
      tdFecfinal.addClass('cAbierta');
    }
  });

  // pareja los altos de tablas de dos en dos
  $('#divTablasAgenda').find('div').each(function(i,div) {
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
  $('table.agenda').each(function(i,tabla) {
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


  // $('#divProximos').css('display','none');

});
