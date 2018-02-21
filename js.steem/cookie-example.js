/*
Cookies can only store strings. Therefore, you need to convert your array of objects into a JSON string.
If you have the JSON library, you can simply use JSON.stringify(people) and store that in the cookie, 
then use $.parseJSON(people) to un-stringify it.
In the end, your code would look like:
*/

var people = [
   { 'name' : 'Abel', 'age' : 1 },
   { 'name' : 'Bella', 'age' : 2 },
   { 'name' : 'Chad', 'age' : 3 },
];
$.cookie("people", JSON.stringify(people));

// later on...

var people = $.parseJSON($.cookie("people");)
people.push(
    { 'name' : 'Daniel', 'age' : 4 }
);
$.cookie("people", JSON.stringify(people));
