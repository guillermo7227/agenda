$(document).ready(function() {

  $('#spaSemestre').text(sessionStorage.getItem('semestre'));
  $('#spaMateria').text(sessionStorage.getItem('matnombre'));
  $('form').find('input[name="semestre"]').val(sessionStorage.getItem('semestre'));
  $('form').find('input[name="matnombre"]').val(sessionStorage.getItem('matnombre'));
  $('form').find('input[name="matcodigo"]').val(sessionStorage.getItem('matcodigo'));
  $('form').find('input[name="grucodigo"]').val(sessionStorage.getItem('grucodigo'));
  $('form').find('input[name="tutnombre"]').val(sessionStorage.getItem('tutnombre'));


});
