var account = "t-800a";
var from = Date.parse('2015-01-01T00:00:00');
var limit = 200; //max. 10.000

var MAX = 25;
var counter = 0;

/*
steem.api.getAccountHistory(account, from, limit, function(err, result) {

	if(!err && result != undefined && result.length > 0){

		for (var i = result.length - 1; i >= 0; i--) {

			if (result[i][1].op[0] == "vote" && result[i][1].op[1].voter != account) {

				var type = (result[i][1].op[1].permlink.includes("re-")) ? "Kommentar" : "Post";

				var datum = new Date(result[i][1].timestamp).toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

				var vote = {
					voter: result[i][1].op[1].voter,
					author: result[i][1].op[1].author,
					permlink: result[i][1].op[1].permlink,
					timestamp: datum,
					weight: result[i][1].op[1].weight / 100,
					typ: type
				}

		
				var htmlElement =	'<div class="alert alert-primary role="alert">' +
									'<a href="https://steemit.com/@' + vote.voter + '/" target="_blank" class="alert-link">@' + vote.voter + ' </a> hat deinen <a href="https://steemit.com/@' + vote.author + '/' + vote.permlink + '" target="_blank" class="alert-link">' + vote.typ + '</a> mit ' + vote.weight + '% gevoted!' +
									'</div>';
	

'<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="left" data-content="' + vote.timestamp + '">+</button>' +


									'<hr>' +
									'<p class="mb-0">' + vote.timestamp + '</p>' +
							
							
				var htmlElement =	'<div class="card">' +
										'<div class="card-body">' +
											'<h5 class="card-title">' + vote.voter + '</h5>' +
											'<h6 class="card-subtitle mb-2 text-muted">' + vote.typ + 'mit ' + vote.weight + '% gevoted!</h6>' +
											'<a href="https://steemit.com/@' + vote.author + '/' + vote.permlink + '" target="_blank">' + vote.typ + '</a>' +
										'</div>' +
									'</div>'


				$("#output-votes").append(htmlElement);

				counter++;

				if(counter >= MAX){
				break;
				}
			}

			// console.log(err, result[i][1]);
		}
	}
});

*/

var results = steem.api.getState('/created/beersaturday', function(err, result) {

	if(!err && result.content != undefined) {

		// console.log(err, result.content);
	
		for (var i = result.length - 1; i >= 0; i--) {

			
			if (result[i][1].op[0] == "vote" && result[i][1].op[1].voter != account) {
	
			
	
			}
		}
	}
});





