var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.location("agenda");
  res.redirect("agenda");
});

/* GET materias */
router.get('/materias', function(req,res) {
  var semestrescollection = req.nedb.semestres;
  var materiascollection = req.nedb.materias;
  semestrescollection.find({},{},function(semerr,semdocs) {
    materiascollection.find({},{},function(materr,matdocs) {
      res.render('materias', {
        "title" : "Materias",
        "semestres" : semdocs,
        "materias" : matdocs
      });
    });
  });
});

/* GET agenda */
router.get('/agenda', function(req,res) {
  var materiascollection = req.nedb.materias;
  var agendacollection = req.nedb.agenda;
  materiascollection.find({}).sort({ matnombre : 1 }).exec(function(e,docsmat) {
    agendacollection.find({}).sort({ fecinicio : 1, fecfinal: 1 }).exec(function(e1,docsage) {
      var fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() + 16);
      var fechaComienzo = new Date();
      fechaComienzo.setDate(fechaComienzo.getDate() - 3); // hoy menos 2 dias
      agendacollection.find(
        { fecfinal: {
          $gte: fechaComienzo,
          $lte: fechaLimite
        }},
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

/* GET nuevo semestre */
router.get('/nuevoSemestre', function(req,res) {
  res.render('nuevoSemestre', { title: "Nuevo Semestre"});
});

/* GET modificar materias */
router.get('/modificarMateria', function(req,res) {
  res.render('modificarMateria', {
    title : "Modificar Materia"
  });
});

/* GET borrar Materia */
router.get('/borrarMateria', function(req,res) {
  res.render('borrarMateria', {
    title: "Borrar Materia"
  });
});



/*
 * ACCIONES
 */

/* POST agrega una nueva materia */
router.post('/addMateria', function(req, res) {
  var semestre = req.body.semestre;
  var matnombre = req.body.matnombre;
  var matcodigo = req.body.matcodigo;
  var grucodigo = req.body.grucodigo;
  var tutnombre = req.body.tutnombre;

  var db = req.db;
  var collection = db.get('materias');

  collection.insert({
    "semestre"  : semestre,
    "matnombre" : matnombre,
    "matcodigo" : matcodigo,
    "grucodigo" : grucodigo,
    "tutnombre" : tutnombre
  }, function(err, doc) {
    if (err) {
      res.send("No se pudo escribir en la base de datos.");
    } else {
      res.location("materias");
      res.redirect("materias");
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
  var agendacollection = req.nedb.agenda;
  agendacollection.update({
    "matnombre" : req.body.matnombre,
    "actnombre" : req.body.actnombre
  }, {
    $set : {
      "descripcion" : req.body.descripcion,
      "fecinicio" : new Date(req.body.fecinicio),
      "fecfinal"  : new Date(req.body.fecfinal),
      "puntos"    : req.body.puntos,
      "calificacion" : req.body.calificacion
    }
  }, function(err,doc) {
    if (err) {
      res.send("Error. No se pudo modificar la actividad.");
    } else {
      res.location("agenda");
      res.redirect("agenda");
    }
  });
});

/* POST nuevo semestre */
router.post('/addSemestre', function(req,res) {
  var semcodigo = req.body.semcodigo;
  var semestrescollection = req.db.get('semestres');
  semestrescollection.insert({
    "semcodigo" : semcodigo
  }, function(err, doc) {
    if (err) {
      res.send("Error al crear el semestre.");
    } else {
      res.location("materias");
      res.redirect("materias");
    }
  });
});

/* POST Modificar materias */
router.post('/updateMateria', function(req,res) {
  var semestre  = req.body.semestre;
  var matnombre = req.body.matnombre;
  var matcodigo = req.body.matcodigo;
  var grucodigo = req.body.grucodigo;
  var tutnombre = req.body.tutnombre;

  var materiascollection = req.db.get('materias');
  materiascollection.update({
    "semestre" : semestre,
    "matnombre" : matnombre
  }, { $set: {
    "matcodigo" : matcodigo,
    "grucodigo" : grucodigo,
    "tutnombre" : tutnombre
  }}, function(err,doc) {
    if (err) {
      res.send("Error al actualizar la materia.");
    } else {
      res.location("materias");
      res.redirect("materias");
    }
  });
});

router.post('/deleteMateria', function(req,res) {
  var semestre = req.body.semestre;
  var matnombre = req.body.matnombre;
  var materiascollection = req.db.get('materias');
  materiascollection.remove({
    semestre: semestre,
    matnombre: matnombre
  }, function(err,doc) {
    if (err) {
      res.send("Error al borrar la materia.");
    } else {
      res.location("materias");
      res.redirect("materias");
    }
  });
});

module.exports = router;
