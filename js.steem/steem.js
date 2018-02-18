/*

				var template	=	'<div class="alert {{vote.style}} alert-votes" role="alert">' +
										'{{if vote.voterSelf}}Ich habe{{else}}<a href="{{vote.voterURL}}" target="_blank" class="alert-link">@{{vote.voter}}</a> hat{{/if}} ' + 
										'einen <a href="{{vote.authorURL}}" target="_blank" class="alert-link">{{vote.typ}}</a> von ' + 
										'{{if vote.authorSelf}}mir{{else}}<a href="{{vote.authorURL}}" target="_blank" class="alert-link">@{{vote.author}}</a>{{/if}} mit {{vote.weight}} % gevoted! <br>' +
										'<small>{{vote.timestamp}}</small>' +
									'</div>';
									
									
									
    {
      "trx_id": "0000000000000000000000000000000000000000",
      "block": 19954617,
      "trx_in_block": 40,
      "op_in_trx": 1,
      "virtual_op": 0,
      "timestamp": "2018-02-17T17:27:36",
      "op": [
        "author_reward",
        {
          "author": "t-800a",
          "permlink": "spanish-craftbeers-arriaca-and-ceriux",
          "sbd_payout": "0.192 SBD",
          "steem_payout": "0.000 STEEM",
          "vesting_payout": "91.992077 VESTS"
        }
      ]
    }
	
So in your case you would need to break up your code to handle it in two chunks.

function makeCall( callback ) {
    var body = 'Test post';
      FB.api('/me/feed', 'post', { message: body }, function (response) {
        if (!response || response.error) {
         var finalresponse = response.error;
        } else {
          finalresponse = 'Post ID: ' + response.id;
        }
        callback(finalresponse);
      });
}


var array1 = [5, 12, 8, 130, 44];

var found = array1.find(function(element) {
  return element > 10;
});

console.log(found);
// expected output: 12

*/

var md = new Remarkable();

md.set({
    html: true,
    breaks: true
});

// Outputs: <h1>Remarkable rulezz!</h1>
console.log(md.render('# Remarkable rulezz!'));


var account = "t-800a";

window.SteemAccount			= account;
window.SteemFeedLimit		= 100;
// window.SteemFeedLastPermlink
// window.SteemFeedLastAuthor



var count = {
	id:				0,
	votesMax:		50,
	votes:			0,
	commentMax:		50,
	comment:		0,
	feedMax:		15,
	feed:			0
};


var template_feed = document.getElementById("template-feed").innerHTML; 
document.getElementById("output-feed").innerHTML = '';

var template_comments = document.getElementById("template-comments").innerHTML; 
document.getElementById("output-comments").innerHTML = '';

var template_alerts_votes = document.getElementById("template-votes-alert").innerHTML; 
document.getElementById("output-alerts").innerHTML = '';




function fnc_output_feed( feed )
{
	feed.sort(function(a,b){
		return new Date(b.time) - new Date(a.time);
	});
		
	for ( var i = 0; i < feed.length; i++ ) {
		
		$("#output-feed").append( feed[i].html );
	}
}

function fnc_outputHTML( HTMLarray, ID )
{
	HTMLarray.sort(function(a,b){
		return new Date(b.time) - new Date(a.time);
	});

	for ( var i = 0; i < HTMLarray.length; i++ ) {
		
		$( ID ).append( HTMLarray[i].html );
	}
}

function fnc_outputAlerts( alerts )
{
	alerts.sort(function(a,b){
		return new Date(b.time) - new Date(a.time);
	});

	for ( var i = 0; i < alerts.length; i++ ) {
		
		$("#output-alerts").append( alerts[i].html );
	}
}

function fnc_SteemLoadFeed( querryAccount, querryLimit, querryPermlink, querryAuthor, loadMore  )
{
	if ( querryAccount == undefined ){		var querryAccount		= window.SteemAccount; }
	if ( querryLimit == undefined ){		var querryLimit			= window.SteemFeedLimit; }
	if ( querryPermlink == undefined ){		var querryPermlink		= ''; }
	if ( querryAuthor == undefined ){		var querryAuthor		= ''; }	
	if ( loadMore == undefined ){			var loadMore			= false; }	
		
	steem.api.getDiscussionsByFeed( { tag: querryAccount, limit: querryLimit, start_permlink: querryPermlink, start_author: querryAuthor }, function (err, result) {

		var output_feed = new Array(); 
		
		if( !err && result != undefined && result.length > 1 ){
						
			if(loadMore){ result.shift(); }

			window.SteemFeedLastAuthor		= result[result.length - 1].author;
			window.SteemFeedLastPermlink	= result[result.length - 1].permlink;
			
			for (var i = result.length - 1; i >= 0; i--) {
				
				var skip = true;
				var metaArray = JSON.parse(result[i].json_metadata);
				
				if ( metaArray.tags.find(function(element) { return ( element == "beer" ) ? true : false; })){ skip = false; };
				if ( metaArray.tags.find(function(element) { return ( element == "craftbeer" ) ? true : false; })){ skip = false; };
				if ( metaArray.tags.find(function(element) { return ( element == "beersaturday" ) ? true : false; })){ skip = false; };
				
				if ( metaArray.tags.find(function(element) { return ( element == "quote" ) ? true : false; })){ skip = true; };
				

				if ( result[i].first_reblogged_by == undefined && !skip ) {
		
					var c_times = result[i].created;
					var c_datum = new Date(c_times).toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

					var cleanBody = md.render(result[i].body)
					cleanBody = cleanBody.replace(/<h[0-9][^>]+>/gi, '');
					cleanBody = cleanBody.replace(/<[/]{0,1}[h][0-9]>/gi, '');

					var data = {
						feed: {
							ID:			count.feed,
							author:		result[i].author,
							permlink:	result[i].permlink,
							header:		result[i].title,
							category:	result[i].category,
							text:		cleanBody,

							timestamp:	c_datum
						}
					};
					
					var htmlElement = Mark.up(template_feed, data);
					
					var output = {
						time:	c_times,
						html:	htmlElement
					};

	//				console.log( result[i] );
	//				console.log( metaArray.tags );
	
					output_feed.push(output);
					count.feed++;
				}
			}
		}

	//	console.log( result.length );
	//	console.log( count.feed );
	//	console.log( window.SteemFeedLastAuthor );
	//	console.log( window.SteemFeedLastPermlink );
		
		fnc_output_feed( output_feed );		
		
	//
	//	FILL IT UP BABY ... gosh thats ugly i guess
	//	
		if ( count.feed < count.feedMax ){
			fnc_SteemLoadFeed( window.SteemAccount, window.SteemFeedLimit, window.SteemFeedLastPermlink, window.SteemFeedLastAuthor, true );
		}
		
		return true
		
	});
}


function fnc_SteemAccountHistory( querryAccount, querryFrom, querryLimit )
{
	if ( querryAccount == undefined ){		var querryAccount		= window.SteemAccount; }
	if ( querryFrom == undefined ){			var querryFrom			= Date.parse('2015-01-01T00:00:00'); }
	if ( querryLimit == undefined ){		var querryLimit			= 1000; }
	
	steem.api.getAccountHistory(querryAccount, querryFrom, querryLimit, function(err, result)
	{
		var output_alerts = new Array();
		var output_comments = new Array();

		if(!err && result != undefined && result.length > 0){

			for (var i = result.length - 1; i >= 0; i--) {
		
				var c_times = result[i][1].timestamp;
				var c_datum = new Date(c_times).toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

		// -------------------------------------------------------------------------------------------------------------
		// fetch VOTES
		
				if (result[i][1].op[0] == "vote" && count.votes < count.votesMax && !( result[i][1].op[1].voter == account && result[i][1].op[1].author == account )) {
													
					var data = {
						vote: {
							voterSelf:	( result[i][1].op[1].voter != account ) ? false : true,
							authorSelf:	( result[i][1].op[1].author != account ) ? false : true,
							type:		(result[i][1].op[1].permlink.includes("re-")) ? false : true,
							author:		result[i][1].op[1].author,
							voter:		result[i][1].op[1].voter,
							voterURL:	'https://steemit.com/@' + result[i][1].op[1].voter + '/',
							authorURL:	'https://steemit.com/@' + result[i][1].op[1].author + '/',
							permlink:	'https://steemit.com/@' + result[i][1].op[1].author + '/' + result[i][1].op[1].permlink,
							timestamp:	c_datum,
							weight:		result[i][1].op[1].weight / 100,
							style:		( result[i][1].op[1].voter != account ) ? 'alert-primary' : 'alert-secondary'
						}
					};

					var htmlElement = Mark.up(template_alerts_votes, data);
					
					var output = {
						time:	c_times,
						html:	htmlElement
					};
					
					output_alerts.push(output);
					count.votes++;
				}
		
		// -------------------------------------------------------------------------------------------------------------
		// fetch incomming COMMENTS
		
				if (result[i][1].op[0] == "comment" && count.comment < count.commentMax && result[i][1].op[1].parent_author != "" && result[i][1].op[1].author != account && !result[i][1].op[1].body.includes("@@")) {

					var cleanBody = md.render(result[i][1].op[1].body)
					cleanBody = cleanBody.replace(/<(?:.|\n)*?>/gm, '');
				
					var data = {
						comment : {
							ID:			count.comment,
							author:		result[i][1].op[1].author,
							permlink:	result[i][1].op[1].permlink,
							text:		cleanBody,
							permlink:	result[i][1].op[1].permlink,
							timestamp:	c_datum
						}
					};

					var htmlElement = Mark.up(template_comments, data);
					
					var output = {
						time:	c_times,
						html:	htmlElement
					};
					
					output_comments.push(output);
					
					console.log(result[i]);
					
					count.comment++;
				}
				
				
		// -------------------------------------------------------------------------------------------------------------
		//  
		
				
			//	console.log(err, '#ID ' + count.id + ' // ' + result[i][1].op[0] + ' // - Author: ' + result[i][1].op[1].author );
			//	console.log(err, result[i][1]);
				count.id++;

			}
		}
		
		
	//	console.log(err, result);
	
		fnc_outputHTML( output_comments, '#output-comments' );
		fnc_outputHTML( output_alerts, '#output-alerts' );
		
	//	fnc_outputAlerts( output_alerts );
		
		return true
	});
}


fnc_SteemLoadFeed();
fnc_SteemAccountHistory();

console.log(count);

/*
	steem.api.getFollowers("t-800a", null, null, 1000, function(err, result) {
		console.log(err, result);
	});

	steem.api.getContent('ablaze', 're-t-800a-whiskybock-heubacher-brauerei-20180216t224654769z', function(err, result) {
		console.log(err, result);
	});
*/