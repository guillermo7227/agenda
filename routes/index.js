var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.location("agenda");
  res.redirect("agenda");
});

/* GET materias y agenda */
router.get('/agenda', function(req,res) {
  var db = req.db;
  var materiascollection = db.get('materias');
  var agendacollection = db.get('agenda');
  materiascollection.find({},{}, function(e,docsmat) {
    agendacollection.find({},{}, function(e1,docsage) {
      var fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() + 16);
      var fechaComienzo = new Date();
      fechaComienzo.setDate(fechaComienzo.getDate() - 2); // hoy menos 2 dias
      agendacollection.find(
        { fecfinal: { $gte: fechaComienzo },
          fecfinal: { $lte: fechaLimite }},
        { sort: { fecfinal: 1}}, function(e2,ordage) {
          res.render('agenda', {
            "materias"  : docsmat,
            "agenda"    : docsage,
            "ordAgenda" : ordage
          });
        }
      );
    });
  });
});

/* GET nueva materia */
router.get('/nuevaMateria', function(req,res) {
  res.render('nuevaMateria', { title : "Nueva Materia" });
});

/* GET nueva actividad */
router.get('/nuevaActividad', function(req,res) {
  res.render('nuevaActividad', { title: "Nueva Actividad" })
});

/* GET borrar actividad */
router.get('/borrarActividad', function(req,res) {
  res.render('borrarActividad', { title : "Borrar Actividad" });
});

/* GET modificar Actividad */
router.get('/modificarActividad', function(req,res) {
  res.render('modificarActividad', { title : "Modificar Actividad" });
});



/*
 * ACCIONES
 */

/* POST agrega una nueva materia */
router.post('/addMateria', function(req, res) {
  var materianombre = req.body.materiaNombre;

  var db = req.db;
  var collection = db.get('materias');

  collection.insert({
    "matnombre" : materianombre
  }, function(err, doc) {
    if (err) {
      res.send("No se pudo escribir en la base de datos.");
    } else {
      res.location("agenda");
      res.redirect("agenda");
    }
  });
});

/* POST agregar una nueva actividad */
router.post('/addActividad', function(req,res) {
  var matnombre = req.body.matnombre;
  var actnombre = req.body.actnombre;
  var descripcion = req.body.descripcion;
  var fecinicio = new Date(req.body.fecinicio);
  var fecfinal = new Date(req.body.fecfinal);
  var puntos = req.body.puntos;
  var calificacion = req.body.calificacion;

  var collection = req.db.get('agenda');

  collection.insert({
    "matnombre" : matnombre,
    "actnombre" : actnombre,
    "descripcion" : descripcion,
    "fecinicio" : fecinicio,
    "fecfinal"  : fecfinal,
    "puntos"    : puntos,
    "calificacion" : calificacion
  }, function(err, doc) {
    if (err) {
      res.send("No se pudo escribir en la base de datos");
    } else {
      res.location("agenda");
      res.redirect("agenda");
    }
  });
});

/* POST borrar una actividad */
router.post('/delActividad', function(req,res) {
  var matnombre = req.body.matnombre;
  var actnombre = req.body.actnombre;

  var collection = req.db.get('agenda');

  collection.remove({
    "matnombre" : matnombre,
    "actnombre" : actnombre
  }, function(err, doc) {
    if (err) {
      res.send("No se pudo borrar el documento de la base de datos.");
    } else {
      res.location("agenda");
      res.redirect("agenda");
    }
  });
});

/* POST modifica una actividad */
router.post('/updActividad', function(req,res) {
  var matnombre = req.body.matnombre;
  var actnombre = req.body.actnombre;
  var descripcion = req.body.descripcion;
  var fecinicio = new Date(req.body.fecinicio);
  var fecfinal = new Date(req.body.fecfinal);
  var puntos = req.body.puntos;
  var calificacion = req.body.calificacion;

  var collection = req.db.get('agenda');
  collection.update({
    "matnombre" : matnombre,
    "actnombre" : actnombre
  }, {
    $set : {
      "descripcion" : descripcion,
      "fecinicio" : fecinicio,
      "fecfinal"  : fecfinal,
      "puntos"    : puntos,
      "calificacion" : calificacion
    }
  }, function(err,doc) {
    if (err) {
      res.send("No se pudo actualizar la base de datos.");
    } else {
      res.location("agenda");
      res.redirect("agenda");
    }
  });
});

module.exports = router;
