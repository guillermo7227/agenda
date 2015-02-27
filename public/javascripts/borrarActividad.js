$(document).ready(function() {

  var materia = sessionStorage.getItem('materia');
  var actividad = sessionStorage.getItem('actividad');
  $("#spaMateria").text(materia);
  $("#hidMateria").val(materia);
  $("#spaActividad").text(actividad);
  $("#hidActividad").val(actividad);

});
