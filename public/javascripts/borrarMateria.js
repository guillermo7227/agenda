$(document).ready(function() {

  var semestre = sessionStorage.getItem('semestre');
  var matnombre = sessionStorage.getItem('matnombre');
  $('#spaSemestre').text(semestre);
  $('#spaMateria').text(matnombre);
  $('input[name="semestre"]').val(semestre);
  $('input[name="matnombre"]').val(matnombre);


});
