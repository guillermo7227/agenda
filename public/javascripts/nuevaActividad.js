$(document).ready(function() {

    var materia = sessionStorage.getItem('materia');

    $("#spaMateria").text(materia);

    $("#hidMateria").val(materia);


});
