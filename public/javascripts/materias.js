$(document).ready(function() {

  /*
   * EVENTOS
   */

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



});
