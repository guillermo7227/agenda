$(document).ready(function() {

  var materia = sessionStorage.getItem('materia');
  var actividad = sessionStorage.getItem('actividad');
  var semestre = sessionStorage.getItem('semestre');

  $("#spaMateria").text(materia);
  $("#spaActividad").text(actividad);

  $("#hidMateria").val(materia);
  $("#hidActividad").val(actividad);
  $("#hidSemestre").val(semestre);

});
