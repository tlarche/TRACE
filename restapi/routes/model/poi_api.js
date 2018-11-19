// Declaration
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// const XXXX = require ('../model/step_api');
// import { ObjectId } from '../model/step_api';

// __ POI SCHEMA ________________________________________
const ObjectId = mongoose.Schema.Types.ObjectId;
const Coord_DD = mongoose.Schema({
    latitude: {
        type: Number,
        require: true
    },
    longitude: {
        type: Number,
        require: true
    },
    address: {
        full_text: String,
        country: String
    }
});

const poiSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        require: true
    },
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: String,
    type: String,
    link: String,
    dd_coord: Coord_DD
  });

const poiModel = mongoose.model("poi", poiSchema);
// __ poi SCHEMA ________________________________________

/*
==============
ROUTE API REST
==============
*/

/* POST=CREATE */
router.post('/create', function( req, res, next) {
    console.log("ROUTE: poi/create", req.body);

    // Check if POI exist?
    poiModel.findOne({ name: req.body.name }, function( err, poi) {
    // jsonData = JSON.parse(req.body);
    // console.log(jsonData);

    if ( poi ) {

        // this POI exists, can't create
        console.log(`>>> poi already exists (name: ${req.body.name}) <<<`)
        // res.sendStatus(201);
        // res.status = 201;
        res.json({
            poi,
            result: false
        });

    } else {

        // This POI doesn't exist...
        const createdDate = new Date();
        const newPoi = new poiModel({
            user_id: req.body.user_id,
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            link: req.body.link,
            dd_coord:{
                "longitude": req.body.dd_coord.longitude,
                "latitude": req.body.dd_coord.latitude,
                "address": {
                    "full_text": req.body.dd_coord.address.full_text,
                    "country": req.body.dd_coord.address.country
                },
            }
        });

        // Create new POI
        //   console.log(newPoi);
        //   console.log(newPoi.dd_coord.latitude);
        //   console.log(newPoi.dd_coord.longitude);
        //   newPoi.dd_coord.longitude = 0;
        //   newPoi.dd_coord.latitude = 0;
        newPoi.save(function( error, poi ) {
            if ( err === null ) {
            console.log("CREATE: OK");
            res.json({ poi, result:true });
            } else {
            console.log("CREATE: error", err);
            res.json({ err, result:false });
            }
        }); // end save

    } // end else
  }); // end findOne

// END ROUTE => CREATE-POI
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({message: 'route /'});
});

// router.get('/account', function(req, res, next) {
//   userModel.find(function(err, users) {
//     res.json({users});
//   });
// });

// router.post('/account', function(req, res, next) {
//   var user = new userModel({
//     poster_path: req.body.poster_path,
//     overview: req.body.overview,
//     title: req.body.title,
//     idUserDB: req.body.idUserDB
//   });
//   user.save(function(error, user) {
//     userModel.find(function(err, users) {
//       res.json({user});
//     });
//   });
// });

// router.delete('/account/:idUserDB', function(req, res, next) {
//   userModel.remove({
//     idUserDB: req.params.idUserDB
//   }, function(error) {
//     userModel.find(function(err, users) {
//       res.json({users});
//     });
//   });
// });

module.exports = router;