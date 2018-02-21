
var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

// ----------------

//Array
var arr = ["one", "two", "three", "four"];
//get JSON string from array.
var jsonStrofArray = JSON.stringify(arr); // returns json string of "["one","two","three","four"]"
// Recover array from JSON string
var arrFromJSONString = JSON.parse(jsonStrofArray); // Returns ["one", "two", "three", "four"]

//Objects
var obj = {firstname:"hiral", lastname: "patel"};
//get json string from object
var jsonStrofObj = JSON.stringify(obj); // returns json string of "{"firstname":"hiral","lastname":"patel"}"
// Recover object from JSON string
var objFromJSONString = JSON.parse(jsonStrofObj); // Returns json object with keys of firstname and lastname along with values.
