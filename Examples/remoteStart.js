//=====================================================================
// This sample demonstrates using TeslaJS
//
// https://github.com/mseminatore/TeslaJS
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//=====================================================================

var tjs = require('../TeslaJS');
var fs = require('fs');
var colors = require('colors');

//
//
//
function login_cb(result) {
    if (result.error) {
        console.error("Login failed!".red);
        console.warn(JSON.stringify(result.error));
        return;
    }

    var options = { authToken: result.authToken, carIndex: 0 };
    tjs.vehicles(options, function (vehicle) {
        options.vehicleID = vehicle.id_s;
        sampleMain(options);
    });
}

//
//
//
function sampleMain(options) {
    var passIndex = 2;

    if (process.argv.length > 3) {
        passIndex = 3;
    }

    var password = process.argv[passIndex];

    tjs.remoteStart(options, password, function (result) {
        if (result.result) {
            console.log("\nCommand completed successfully!\n");
            console.log("You may now begin driving.\n");
            console.log("Note that you must start driving within " + "2 minutes".bold.green + " or Remote Start will expire.");
        } else
            console.log(result.reason);
    });
}

//
//
//
function usage() {
    console.log("\nUsage: node <sample_name> <email> password\n");
}

//
// Sample starts here
//
var tokenFound = false;

try {
    tokenFound = fs.statSync('.token').isFile();
} catch (e) {
}

if (tokenFound) {
    var token = JSON.parse(fs.readFileSync('.token', 'utf8'));

    if (process.argv.length < 3) {
        usage();
        process.exit(1);
    }

    login_cb({ error: false, authToken: token });
} else {
    // no saved token found, expect username and password on command line
    if (process.argv.length < 3) {
        usage();
        process.exit(1);
    }

    tjs.login(process.argv[2], process.argv[3], login_cb);
}
