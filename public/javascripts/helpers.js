/*
 * FUNCIONES
 */
function addDate(date, days) { // suma dias a una fecha
  date = new Date(date);
  return new Date(date.setDate(date.getDate() + days));
}

function fixDate(date) { // arregla la hora colombiana (-5)
  var ndate = new Date(date.setHours(date.getHours() + 28));
  return new Date(ndate.setMinutes(ndate.getMinutes() + 59));
}

function formatDate(date) {
  date = new Date(date);

  var day = (function() {
    var day = date.getDate();
    if (day < 10) { return "0" + day; }
    else { return day; }
  })();

  var month = (function() {
    var month = date.getMonth() + 1
    if (month < 10) { return "0" + month; }
    else { return month; }
  })();

  return date.getFullYear() + "-" + month + "-" + day
}
