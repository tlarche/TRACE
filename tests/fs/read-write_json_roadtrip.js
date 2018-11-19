// CONSTANTS
const C_HOST_URL = "http://localhost:3000";

// Define JSON File
//import * as Joi from 'joi-browser';
const fs = require("fs");
const Joi = require("joi-browser");
const request = require("request");

//const Extension = require('joi-date-extensions');
//const Joi = BaseJoi.extend(Extension);

const joi_schema_user = Joi.object().keys({

    user_uid: Joi.number().integer().min(1),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string(),
    country: Joi.string(),
    language: Joi.string().valid("fr", "ru").required(),
    user_status: Joi.string().valid("active", "blocked").required(),
    trip_count: Joi.number(),
    trip_list: Joi.array().items(Joi.object().required()),

    // ATTENTION : Date au format "MM-DD-YYYY" !
    created_date: Joi.date().required(),
    updated_date: Joi.date(),
    version: Joi.number()
    })

const joi_schema_trip = Joi.object().keys({

    trip_uid: Joi.number().integer().min(1).required(),
    trip_sequence: Joi.number().integer().min(1).required(),
    status: Joi.string().valid('planned', 'pending', 'achieved').required(),
    title: Joi.string().max(100),
    description: Joi.string().max(500),
    expected_distance: Joi.number().integer().min(1),
    start_date:Joi.date(),
    end_date: Joi.date(),
    main_means_of_transport: Joi.string().max(15),
    visited_country_list: Joi.array().items(Joi.string()),
    step_count: Joi.number().integer().required(),
    step_list: Joi.array().items(Joi.object().required()),

    // ATTENTION : Date au format "MM-DD-YYYY" !
    created_date: Joi.date().required(),
    updated_date: Joi.date(),
    version: Joi.number()    
    })

const joi_schema_step = Joi.object().keys({

    step_sequence: Joi.number().integer().min(1).required(),
    step_date: Joi.date().required(),
    starting_time: Joi.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    expected_duration: Joi.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    expected_arrival_time: Joi.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    status: Joi.string().valid('planned', 'pending', 'achieved'),
    title: Joi.string().max(100),
    description: Joi.string().max(500),
    instruction: Joi.string().max(5000),
    expected_distance: Joi.number().integer().min(1),
    from_dd_coord: Joi.object(),
    to_dd_coord: Joi.object(),
    means_of_transport: Joi.string().max(15),
    way_point_count: Joi.number().integer().min(2).required(),
    way_point_list: Joi.array().items(Joi.object().required()),

    // // ATTENTION : Date au format "MM-DD-YYYY" !
    // created_date: Joi.date().required(),
    // updated_date: Joi.date(),
    // version: Joi.number()
})

const joi_schema_coord = Joi.object().keys({
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    address: Joi.string().max(500)

})

const joi_schema_way_point_poi = Joi.object().keys({

    wp_sequence: Joi.number().integer().min(1).required(),
    name: Joi.string().max(100),
    timing: Joi.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    type: Joi.string().valid("B", "E", "I", "S", "V"),
    kind: Joi.string().valid("way_point", "tourism", "historical", "hotel", "restaurant", "gas station", "train station", "hostipal", "home"),
    description: Joi.string().max(500),
    instruction: Joi.string().max(500),
    dd_coord: Joi.object()

    // ATTENTION : Date au format "MM-DD-YYYY" !
    // created_date: Joi.date().required(),
    // updated_date: Joi.date(),
    // version: Joi.number()
})

console.log("\n *STARTING* \n");

// Get content from file
const rawData = fs.readFileSync("trip_v0.1.json");

// Define to JSON type
const obj = JSON.parse(rawData);

// Get Value from JSON
console.log(obj);
let result = Joi.validate(obj, joi_schema_user);
if (result.error !== null) {
    console.log("Joi error (USER) =>", result.error);
    return;
}

console.log("\n *TRAVERSING OBJ USER* \n");
for (const myKey in obj) {
    console.log(`key: "${myKey}", value: "${obj[myKey]}", typeof: "${typeof(obj[myKey])}"`);
}
// Create USER instance in db
const newUser = {
    "last_name": obj.last_name,
    "first_name": obj.first_name,
    "email": obj.email,
    "user_status": obj.user_status,
    "country": obj.country,
    "language": obj.language,
    "trip_count": obj.trip_count,
    "created_date": obj.created_date, 
    "updated_date": obj.updated_date
}
result = Joi.validate(newUser, joi_schema_user);
if (result.error !== null) {
    console.log("Joi error (NEW USER) =>", result.error);
    return;
}

// console.log("REQUEST POST 1", newUser);
// // try {
    
    
//     // myRequest = new Request(`${C_HOST_URL}/user/create`, {
    //         //     json: true,
    //         //     method: 'POST',
    //         //     // this line is important, if this content-type is not set it wont work
//         //     //headers: { 'Content-Type': 'application/json' },
//         //     body: newUser
//         // });

//     const options = {
    //         url: `${C_HOST_URL}/user/create`,
//         // json: true,
//         method: 'POST',
//         // this line is important, if this content-type is not set it wont work
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newUser)
//     }
//     console.log(options);
//      request(options, function (err, response, user) {
//         // console.log(err);
//         // console.log("user._id", user);
//         // console.log("user._id", response.body._id);
//         user = JSON.parse(user);
//         user._id = user._id;
//         console.log(user._id);
//     });

//     catch(error) {
    //         console.log("<<<<< exception error >>>>>");
    //         console.log(error);
    //         console.log("<<<<< exception error >>>>>");
//     }
// }
// End request "create"

let user_id = "";
const fetch = require("node-fetch");
const url = `${C_HOST_URL}/user/create`;
const getData = async url => {
    try {
        const response = await fetch(url, {
            json: true,
            method: 'POST',
            // this line is important, if this content-type is not set it wont work
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        //console.log(response);
        const json = await response.json();
        //console.log(json);
user_id = 1
       return json._id

    } catch (error) {
        console.log(error);
    }
};
getData(url)
    .then(
        (data) => console.log(data)  
        //console.log(">>>", user_id);
    )

return;

// const http = require("http");
// console.log("ggg");
// let req = http.request(options);

// const fetch = require("node-fetch");
// const url = `${C_HOST_URL}/user/create`;
// const request = async () => {
//     const response = await fetch(url, {
//         json: true,
//         method: 'POST',
//         // this line is important, if this content-type is not set it wont work
//         headers: { 'Content-Type': 'application/json' },
//         body: newUser});
//         console.log(response);
//     const json = await response.json();
//     // console.log(json);
// }
// request();
// return;

// console.log("user_id ", user_id);
console.log("\n *TRAVERSING OBJ USER/TRIPS* \n");
const trips = obj.trip_list;
const trip_count = trips.length;
console.log("# trips:", trip_count);
return;

for (let t=0; t<trip_count; t++) {

    console.log(trips[t]);
    const result = Joi.validate(trips[t], joi_schema_trip);
    if (result.error !== null) {
        console.log("Joi error (TRIP) =>", result.error);
        return;
    }

    console.log("Trip#: ", t)
    for (const myKey in trips[t]) {
        console.log(`key: "${myKey}", value: "${trips[t][myKey]}", typeof: "${typeof(trips[t][myKey])}"`);
    }

    console.log(`\n *TRAVERSING OBJ USER/TRIP[${t}]/STEPS* \n`);
    const steps = trips[t].step_list;
    const step_count = steps.length;
    console.log("# steps:", step_count);
    
    for (let s = 0; s < step_count; s++) {
        console.log("Step#: ", s);
        
        console.log(steps[s]);
        let result = Joi.validate(steps[s], joi_schema_step);
        console.log("Joi error (STEP) =>", result.error);
        if (result.error !== null) {
            return;
        }

        for (const myKey in steps[s]) {
                console.log(`key: "${myKey}", value: "${steps[s][myKey]}", typeof: "${typeof(steps[s][myKey])}"`);
        }
        console.log(`key: "from_dd_coord.longitude", value: "${steps[s].from_dd_coord.longitude}"`);
        console.log(`key: "from_dd_coord.latitude", value: "${steps[s].from_dd_coord.latitude}"`);
        console.log(`key: "to_dd_coord.longitude", value: "${steps[s].to_dd_coord.longitude}"`);
        console.log(`key: "to_dd_coord.latitude", value: "${steps[s].to_dd_coord.latitude}"`);
        result = Joi.validate(steps[s].from_dd_coord, joi_schema_coord);
        console.log("Joi error (STEP/COORD) =>", result.error);
        if (result.error !== null) {
            return;
        }
        result = Joi.validate(steps[s].to_dd_coord, joi_schema_coord);
        console.log("Joi error (STEP/COORD) =>", result.error);
        if (result.error !== null) {
            return;
        }

        console.log(`\n *TRAVERSING OBJ USER/TRIP[${t}]/STEP[${s}]/WAY_POINTS* \n`);
        const way_points = steps[s].way_point_list;
        const way_point_count = way_points.length;
        console.log("# WayPoints:", way_point_count);

        for(let wp = 0; wp < way_point_count; wp++) {

            console.log("WayPoint#: ", wp);
            result = Joi.validate(way_points[wp], joi_schema_way_point_poi); 
            console.log("Joi error (STEP/WP) =>", result.error);
            if (result.error !== null) {
                return;
            }
            for (const myKey in way_points[wp]) {
                console.log(`key: "${myKey}", value: "${way_points[wp][myKey]}", typeof: "${typeof(way_points[wp][myKey])}"`);
            }
            console.log(`key: "dd_coord.longitude", value: "${way_points[wp].dd_coord.longitude}"`);
            console.log(`key: "dd_coord.latitude", value: "${way_points[wp].dd_coord.latitude}"`);
            result = Joi.validate(way_points[wp].dd_coord, joi_schema_coord);
            console.log("Joi error (STEP/COORD) =>", result.error);
            if (result.error !== null) {
                return;
            }
            result = Joi.validate(way_points[wp].dd_coord, joi_schema_coord);
            console.log("Joi error (STEP/COORD) =>", result.error);
            if (result.error !== null) {
                return;
            }
            console.log("\n");

        }
        console.log("\n");

    }
    console.log("\n");
}

console.log("\n *WRITE JSON FILE* \n");
const content = JSON.parse(JSON.stringify(obj.trip_list[0].step_list));
//let content = JSON.stringify(obj.trip_list[0].step_list);
//content = JSON.parse(content);
//const content = obj.trip_list[0].step_list;

// Save the JSON file in ASYNC mode
fs.writeFile('trip_v0.1 [write].json', content, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

console.log("\n *EXIT* \n");