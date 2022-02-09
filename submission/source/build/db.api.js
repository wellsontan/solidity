"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel_cert = exports.get_function = exports.finish_journey = exports.add_journey = exports.add_beef = exports.add_user = void 0;
var http = require('http');
// Helper function to make the api calls
function request_helper(_method, _path, data) {
    var option = {};
    if (data == undefined) {
        option = {
            hostname: 'localhost',
            port: 5000,
            path: _path,
            method: _method
        };
    }
    else {
        option = {
            hostname: 'localhost',
            port: 5000,
            path: _path,
            method: _method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
    }
    var body = '';
    var request = http.request(option, function (res) {
        res.on('data', function (chunk) { body += "" + chunk; });
        res.on('end', function () { console.log(body); });
        res.on('close', function () { console.log('Closed connection'); });
    });
    if (data != undefined)
        request.write(data);
    request.end();
}
// Helper function to generate time string
function time_generator() {
    var ts = Date.now();
    var date_ob = new Date(ts);
    var date = date_ob.getDate();
    var month = date_ob.getMonth() + 1;
    var year = date_ob.getFullYear();
    var hour = date_ob.getHours();
    var minute = date_ob.getMinutes();
    var time = date + "-" + month + "-" + year + " " + hour + ":" + minute;
    return time;
}
// Function that calls POST:/api/user to addd new user
function add_user(_id_address, _name, _type, _location, _certifier, _document_hash) {
    var data = JSON.stringify({
        id_address: _id_address,
        name: _name,
        type: _type,
        location: _location,
        certifier: _certifier,
        document_hash: _document_hash
    });
    request_helper("post", "/api/user", data);
}
exports.add_user = add_user;
// Function that calls POST:/api/beef to addd new beef product
function add_beef(_product, _farmer, _price, _tier, _expiry) {
    var data = JSON.stringify({
        product_id: _product,
        farmer_id: _farmer,
        price: _price,
        tier: _tier,
        expiry_date: _expiry
    });
    request_helper("post", "/api/beef", data);
}
exports.add_beef = add_beef;
// Function that calls POST:/api/journey to addd new journey for beef product
function add_journey(_product, _user, _info) {
    var data = JSON.stringify({
        product_id: _product,
        user_id: _user,
        start_date: time_generator(),
        produce_info: _info
    });
    request_helper("post", "/api/journey", data);
}
exports.add_journey = add_journey;
// Function that calls PATCH:/api/journey to update beef product's end date
function finish_journey(_product, _user) {
    var data = JSON.stringify({
        product_id: _product,
        user_id: _user,
        end_date: time_generator()
    });
    request_helper("patch", "/api/journey", data);
}
exports.finish_journey = finish_journey;
// Function that calls GET:/api/***/****/ to retrieve data of user, beef or journey
function get_function(_type, _id) {
    var path = "/api/" + _type;
    if (_id != undefined)
        path += "/" + _id;
    request_helper("get", path);
}
exports.get_function = get_function;
// Function that calls PATCH:/api/user/***/ to cancel user validity
function cancel_cert(_id) {
    var _path = "/api/user/" + _id;
    request_helper("patch", _path);
}
exports.cancel_cert = cancel_cert;
