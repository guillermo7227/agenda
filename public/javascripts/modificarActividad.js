$(document).ready(function() {

  var materia = sessionStorage.getItem('materia');
  var actividad = sessionStorage.getItem('actividad');

  $("#spaMateria").text(materia);
  $("#spaActividad").text(actividad);

  $("#hidMateria").val(materia);
  $("#hidActividad").val(actividad);


  $("#txtDescripcion").val(sessionStorage.getItem('descripcion'));
  $("#txtFechaInicio").val(sessionStorage.getItem('fechainicio'));
  $("#txtFechaFinal").val(sessionStorage.getItem('fechafinal'));
  $("#txtPuntos").val(sessionStorage.getItem('puntos'));
  $("#txtCalificacion").val(sessionStorage.getItem('calificacion'));

});
