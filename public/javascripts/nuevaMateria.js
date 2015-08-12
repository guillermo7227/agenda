$(document).ready(function() {

    var materia = sessionStorage.getItem('materia');
    var semestre = sessionStorage.getItem('semestre');

    $("#spaMateria").text(materia);

    $("#hidMateria").val(materia);

    $("#semestre").val(semestre);


});
