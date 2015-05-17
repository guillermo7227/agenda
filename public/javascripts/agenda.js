$(document).ready(function() {


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

    // funcion devuelve true si la fila pasada es la fila del examen final
    function isExamenFinalRow ( tablerow ) {

        var actividad = $ ( tablerow ). find ( 'td[data-key="actividad"]' ).text();
        var descripcion = $ ( tablerow ). find ( 'td[data-key="descripcion"]' ).text();

        return ( (actividad + '' + descripcion).toLowerCase().indexOf ( 'final' ) > 0 );

    }


    $('#spaVerTotales').css('display', 'inline');
    $('#spaResaltarColaborativos').css('display', 'inline');
    $('#spaAlternarProximos').css('display', 'inline');
    $('#spaAlternarSoloColaborativosEnProximos').css('display', 'inline');
    toggleTFooters();

  /*******************************
   * EVENTOS
   *******************************/

    // opcion alternar proximas fechas
    $('#aAlternarProximos').on('click', function (ev) {
        ev.preventDefault();
        $('#divProximos').slideToggle();
    });

    // opcion alternar solo colaborativos en proximos
    $('#aAlternarSoloColaborativosEnProximos').on('click', function (ev) {
        ev.preventDefault ();
        $('#divProximos').children('div').each(function (i, unProximo) {
            var esColaborativo = 0;
            $(unProximo).children('span').each(function (i, unSpan) {
                var textoSpan = $(unSpan).text();
                if (textoSpan.toLowerCase().indexOf('colaborativo') >= 0) {
                    esColaborativo += 1;
                }
            });
            if (esColaborativo == 0) {
                $(unProximo).slideToggle();
            }
        });
    });

  // opcion Ver Totales
  $('#aVerTotales').on('click', function(ev) {
    ev.preventDefault();
    toggleTFooters(true);
  });

  // opcion resaltar los trabajos colaborativos abiertos
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


  // comandos Mod y Borr en tablas de Agenda //TODO: fix this
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

    /****
     * fin eventos
     ***************************/


    /**************************
     * TRABAJO CON PROXIMOS
     *************************************************/

  // formatea y pinta fechas y dias que faltan en Proximos
  $('#divProximos').find('.proxFechaFinal').each(function(i,fecha) {
    var hoy = Date.now();
    var fecfinal = fixDate(new Date(fecha.innerText));
    var spanDiasQueFaltan = $(fecha).parent().children('.proxDiasFaltan');
    var divUnProximo = $(fecha).closest('div');
    if (hoy > fecfinal) {
      //$(fecha).addClass('cCerrada');
    //   $(spanDiasQueFaltan).addClass('cCerrada');
      $(divUnProximo).addClass('cCerrada');
    } else if (hoy > addDate(fecfinal, -6)) {
      //$(fecha).addClass('c5dias');
    //   $(spanDiasQueFaltan).addClass('c5dias');
      $(divUnProximo).addClass('c5dias');
    } else if (hoy > addDate(fecfinal, -16)) {
      //$(fecha).addClass('c15dias');
    //   $(spanDiasQueFaltan).addClass('c15dias');
      $(divUnProximo).addClass('c15dias');
    } else {
      //$(fecha).addClass('cAbierta');
    //   $(spanDiasQueFaltan).addClass('cAbierta');
      $(divUnProximo).addClass('cAbierta');
    }
    fecha.innerHTML = formatDate(fecfinal);
  });

    // pone los dias que faltan en 'Proximos'
    $('#divProximos').children('div').each(function(i,unProximo) {
        var unProximo = $(unProximo);
        var fechaFinal = fixDate(new Date(unProximo.find('.proxFechaFinal').text()));
        var diasQueFaltan = getDaysDifference(fechaFinal, Date.now());

        if (diasQueFaltan < 0) {
          unProximo.find('.proxDiasFaltan').text("Cerrada");
        } else {
          unProximo.find('.proxDiasFaltan').text(diasQueFaltan + " día(s)");
        }
    });


    /***********************
     * TRABAJO CON LAS TABLAS
     **********************************************/

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
    } else {
        if (hoy >= fecinicio) {
            tdFecfinal.addClass('cAbierta');
            if (calificacion != "" && !isNaN(calificacion) || calificacion == "E") {
                tdFecfinal.addClass('cEntregada');
            } else if (hoy > addDate(fecfinal, -6)) {
                tdFecfinal.addClass('c5dias');
            } else if (hoy > addDate(fecfinal, -16)) {
              tdFecfinal.addClass('c15dias');
            }
        }
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


    // Muestra los totales finales si existe una calificación del examen final (25%)
    $('table.agenda').each( function ( i, table ) {

        $(table).find ( 'tbody tr' ).each ( function ( i, tr ) {

            if ( isExamenFinalRow ( tr ) ) {

                var calificacionExamenFinal = $(tr).find( 'td[data-key="calificacion"]' ).text();

                if ( !isNaN ( parseFloat ( calificacionExamenFinal ) ) ) {

                    // existe una calificacion
                    $(table).find ( 'tfoot .notafinal' ).each ( function ( i, row ) {

                        $( row ).css ( 'display', 'table-row' );

                    });

                } else {

                    // no existe una calificacion
                    $(table).find ( 'tfoot .notafinal' ).each ( function ( i, row ) {

                        $( row ).css ( 'display', 'none' );

                    });

                }

            }

        });

    });



  /***************************
   * CALCULOS
   **************************************/
  $('table.agenda').each(function(i,tabla) {

    var trs_tbody = $(tabla).find('tbody tr');
    var actPuntajeParcial = 0;
    var actPuntajeParcialObtenido = 0;
    var notaExamenFinal = "-";

    // acumula los puntajes de las actividades
    $(trs_tbody).each(function(i,tr) {


        // no suma examen final
        if ( isExamenFinalRow ( tr ) ) {

            var puntajeExamenFinal = $( tr ).find ( 'td[data-key="puntos"]' ).text();
            var calificacionExamenFinal = $( tr ).find ( 'td[data-key="calificacion"]' ).text();

            // si existe calificacion final valida
            if ( !isNaN ( parseFloat ( calificacionExamenFinal ) ) ) {

                notaExamenFinal = parseFloat ( calificacionExamenFinal ) / parseFloat ( puntajeExamenFinal ) * 5

            }

            return true;

        }

      var puntos = $(tr).find('td[data-key="puntos"]').text();
      var calificacion = $(tr).find('td[data-key="calificacion"]').text();

      if (!isNaN(parseFloat(calificacion))) {

        actPuntajeParcial += parseFloat(puntos);

        actPuntajeParcialObtenido += parseFloat(calificacion);

      }
    });

    if (actPuntajeParcial == 0) actPuntajeParcial = "-";

    if (actPuntajeParcial == "-") actPuntajeParcialObtenido = "-";

    // pone los valores en el footer

    var trs_tfoot = $(tabla).find('tfoot tr');

    $(trs_tfoot).find('td[data-key="actPuntajeParcial"]').text(actPuntajeParcial);

    $(trs_tfoot).find('td[data-key="actPuntajeParcialObtenido"]').text(actPuntajeParcialObtenido);

    var actNotaParcial = "-";
    if (actPuntajeParcial != "-") {

      actNotaParcial = actPuntajeParcialObtenido * 5 / actPuntajeParcial;
      // redondea a dos decimales
      actNotaParcial = Math.round((actNotaParcial + 0.00001) * 100) / 100
      $(trs_tfoot).find('td[data-key="actNotaParcial"]').text(actNotaParcial);

    }

    notaExamenFinal = Math.round((notaExamenFinal + 0.00001) * 100) / 100
    $( tabla ).find ( 'td[data-key="notaExamenFinal"]' ).text ( notaExamenFinal );

    if ( notaExamenFinal != "-" ) {

        var notaFinal = (actNotaParcial * 0.75) + (notaExamenFinal * 0.25)
        notaFinal = Math.round((notaFinal + 0.00001) * 100) / 100
        $ ( tabla ).find ( 'td[data-key="notaFinal"]' ).text ( notaFinal );

    }

  });


  // $('#divProximos').css('display','none');

});
