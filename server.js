// server.js

// Author: RJ Kunde
// 10/11/2015
// SatDev - Aerospace Engineering 
// University of Illinois - Urbana Champaign

//
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');       		 // use express
var app        = express();                			 // instantiate express, assign to var app
var bodyParser = require('body-parser');		 // parses the body of an http post operation

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        	// set our port

// Database Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/MockGroundStation')

var Satellite = require('./app/models/satellite');			//enable satellite model

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// Routes that end in /satellites
router.route('/satellites')
	
    // create a satellite (accessed at POST http://localhost:8080/api/satellites)
    .post(function(req, res) {
        
        var satellite = new Satellite();      // create a new instance of the satellite model
        satellite.satelliteName = req.body.satelliteName;  // set the satellites name (comes from the request)
		satellite.currentPass = req.body.currentPass;  	 // set the current orbital pass of the satellite (comes from the request)

        // save the satellite and check for errors
        satellite.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Satellite created!' });
        });
    })
	
	// get all the satellites (accessed at GET http://localhost:8080/api/satellites)
    .get(function(req, res) {
        Satellite.find(function(err, satellites) {
            if (err)
                res.send(err);

            res.json(satellites);
        });
    });
	
// Routes that end in /satellites/:satellite_id
router.route('/satellites/:satellite_id')
	
	// get the satellite with specified id (accessed via GET at http://localhost:8080/api/satellites/:satellite_id)
	.get(function(req, res) {
        Satellite.findById(req.params.satellite_id, function(err, satellite) {
            if (err)
                res.send(err);
            res.json(satellite);
        });
    })
	
	// update the satellite with this id (accessed at PUT http://localhost:8080/api/satellites/:satellite_id)
    .put(function(req, res) {

        // use our satellite model to find the satellie we want
        Satellite.findById(req.params.satellite_id, function(err, satellite) {

            if (err)
                res.send(err);

            satellite.satelliteName = req.body.satelliteName; 			 // update satellite name
			satellite.currentPass = req.body.currentPass;		//  update satellite orbital pass

            // save the satellite
            satellite.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Satellite updated!' });
            });

        });
    })
	
	// delete the satellite with this id (accessed at PUT http://localhost:8080/api/satellites/:satellite_id)
	.delete(function(req, res) {
        Satellite.remove({
            _id: req.params.satellite_id
        }, function(err, satellite) {
            if (err)
                res.send(err);

            res.json({ message: 'Satellite successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server is running, and accessible on port: ' + port);