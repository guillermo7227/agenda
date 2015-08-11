$(document).ready(function() {

  var materia = sessionStorage.getItem('materia');
  var actividad = sessionStorage.getItem('actividad');

  $("#spaMateria").text(materia);
  $("#spaActividad").text(actividad);

  $("#hidMateria").val(materia);
  $("#hidActividad").val(actividad);

});
