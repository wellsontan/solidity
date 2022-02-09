const http = require('http');

// Helper function to make the api calls
function request_helper (_method: string, _path: string, data?: any) {
    var option = {};
    if (data == undefined) {
        option = {
            hostname: 'localhost',
            port: 5000,
            path: _path,
            method: _method
        }
    } else {
        option = {
            hostname: 'localhost',
            port: 5000,
            path: _path,
            method: _method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
    }
    let body = '';
    const request = http.request(option, (res) => {
        res.on('data', (chunk) => { body += "" + chunk; })
        res.on('end', () => { console.log(body) })
        res.on('close', () => { console.log('Closed connection') })

    })

    if (data != undefined) request.write(data);
    request.end();

}

// Helper function to generate time string
function time_generator () {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let minute = date_ob.getMinutes();
    var time = date + "-" + month + "-" + year + " " + hour + ":" + minute;
    return time;
}

// Function that calls POST:/api/user to addd new user
export function add_user (_id_address: string, _name: string, _type: string, _location: string, _certifier: string, _document_hash: string) {
    const data = JSON.stringify({
        id_address: _id_address,
        name: _name,
        type: _type,
        location: _location,
        certifier: _certifier,
        document_hash: _document_hash
        })
    
    request_helper("post","/api/user", data);
}

// Function that calls POST:/api/beef to addd new beef product
export function add_beef (_product: string, _farmer: string, _price: string, _tier: string, _expiry: string) {
    const data = JSON.stringify({
        product_id: _product,
        farmer_id: _farmer,
        price: _price,
        tier: _tier,
        expiry_date: _expiry
    })

    request_helper("post","/api/beef", data);
}

// Function that calls POST:/api/journey to addd new journey for beef product
export function add_journey (_product: string, _user: string, _info: string){
    const data = JSON.stringify({
        product_id: _product,
        user_id: _user,
        start_date: time_generator(),
        produce_info: _info
    })

    request_helper("post","/api/journey", data);
}

// Function that calls PATCH:/api/journey to update beef product's end date
export function finish_journey (_product: string, _user: string){
    const data = JSON.stringify({
        product_id: _product,
        user_id: _user,
        end_date: time_generator()
    })

    request_helper("patch", "/api/journey", data);

}

// Function that calls GET:/api/***/****/ to retrieve data of user, beef or journey
export function get_function (_type: string, _id?: string) {
    var path = "/api/" + _type;
    if (_id != undefined) path += "/" +_id;
    request_helper("get", path);
}

// Function that calls PATCH:/api/user/***/ to cancel user validity
export function cancel_cert (_id: string) {
    var _path = "/api/user/" + _id;
    request_helper("patch", _path);
}