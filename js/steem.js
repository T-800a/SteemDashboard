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
    

var array1 = [5, 12, 8, 130, 44];

var found = array1.find(function(element) {
  return element > 10;
});

console.log(found);
// expected output: 12


// -------------------------------------------------------------------------------------------------------------------
// async test

var query = {
	tag: 't-800a',
  limit: 10
};

function fnc_callAPI (query, callback ){
  steem.api.getDiscussionsByBlog(query, function (err, result) {
        if (err) {
         var finalresult = err;
        } else {
          finalresult = result;
        }
        
        callback(finalresult);
  });
}

function processResponse( response ) {
    console.log(response);
}

fnc_callAPI(query, processResponse);



steem.api.getFollowers("t-800a", null, null, 1000, function(err, result) {
	console.log(err, result);
});

steem.api.getContent('ablaze', 're-t-800a-whiskybock-heubacher-brauerei-20180216t224654769z', function(err, result) {
	console.log(err, result);
});
	
	
// -------------------------------------------------------------------------------------------------------------------
*/



// -------------------------------------------------------------------------------------------------------------------
//
//				DEFINE FUNCTIONS
//
// -------------------------------------------------------------------------------------------------------------------

async function fnc_setSteemUser(){
	
	var user = document.getElementById('#MainSteemUser').value;
	
	window.SteemAccount = user;
	var settings = { "user": window.SteemAccount };	
	createCookie("SteamDashboardSettings", JSON.stringify(settings));
	
	window.count = {
		id:				0,
		alertsMax:		100,
		alerts:			0,
		commentMax:		50,
		comment:		0,
		feedMax:		15,
		feed:			0
	};

	
	// clear all
	document.getElementById("output-feed").innerHTML = '';
	document.getElementById("output-comments").innerHTML = '';
	document.getElementById("output-alerts").innerHTML = '';
	
	fnc_SteemLoadFeed();
	fnc_SteemAccountHistory();
}


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

function fnc_outputDataArray( array, buildFunction )
{
	array.sort(function(a,b){
		return new Date(b.timestamp) - new Date(a.timestamp);
	});

	for ( var i = 0; i < array.length; i++ ) {
		
		buildFunction( array[i].result, array[i].datum, i );
	}
}

async function fnc_buildAlerts( result, timestamp, ID )
{
	var data = {
		vote: {
			ID:			ID,
			voterSelf:	( result[1].op[1].voter != window.SteemAccount ) ? false : true,
			authorSelf:	( result[1].op[1].author != window.SteemAccount ) ? false : true,
			type:		(result[1].op[1].permlink.includes("re-")) ? false : true,
			author:		result[1].op[1].author,
			voter:		result[1].op[1].voter,
			voterURL:	'https://steemit.com/@' + result[1].op[1].voter + '/',
			authorURL:	'https://steemit.com/@' + result[1].op[1].author + '/',
			permlink:	'https://steemit.com/@' + result[1].op[1].author + '/' + result[1].op[1].permlink,
			timestamp:	timestamp,
			weight:		result[1].op[1].weight / 100,
			style:		( result[1].op[1].voter != window.SteemAccount ) ? 'alert-primary' : 'alert-secondary'
		}
	};

	var htmlElement = Mark.up(template_alerts_votes, data);
	
	$("#output-alerts").append( htmlElement );
	fnc_sortDiv( 'output-alerts' );
}

async function fnc_buildComment( result, timestamp, ID )
{
	var content = await steem.api.getContentAsync(result[1].op[1].author, result[1].op[1].permlink);

	var cleanBody = md.render(result[1].op[1].body)
	cleanBody = cleanBody.replace(/<(?:.|\n)*?>/gm, '');

	var data = {
		comment : {
			ID:			ID,
			author:		result[1].op[1].author,
			permlink:	result[1].op[1].permlink,
			title:		content.root_title,
			text:		cleanBody,
			timestamp:	timestamp
		}
	};

	var htmlElement = Mark.up(template_comments, data);
	
	$("#output-comments").append( htmlElement );
	fnc_sortDiv( 'output-comments' );
}

function fnc_sortDiv( element ){
	var main = document.getElementById( element );
	[].map.call( main.children, Object ).sort( function ( a, b ) {
		return +a.id.match( /\d+/ ) - +b.id.match( /\d+/ );
	}).forEach( function ( elem ) {
		main.appendChild( elem );
	});	
}

function fnc_tagInArray ( obj, tag ){
	return obj.find(function( element ) { 
		return ( element == tag ) ? true : false; 
	})
}


/*
active_votes: […]
	0: Object { voter: "gensek", weight: 27448, rshares: 2516191664, … }
	1: Object { voter: "ohiosumua", weight: 1401, rshares: 547634097, … }
	2: Object { voter: "t-800a", weight: 7910, rshares: 518393606, … }
	3: Object { voter: "afcgunner", weight: 4415, rshares: 578724252, … }
*/

function fnc_inArrayOfObj ( array, obj, tag ){
	var test = false;
	for (var i = array.length - 1; i >= 0; i--) {
		if( array[i][obj] == tag ){
			test = true;
		}
	}
	return test;
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
				
				if ( fnc_tagInArray( metaArray.tags, "beer" )){ skip = false; };
				if ( fnc_tagInArray( metaArray.tags, "craftbeer" )){ skip = false; };
				if ( fnc_tagInArray( metaArray.tags, "beersaturday" )){ skip = false; };
				
				if ( fnc_tagInArray( metaArray.tags, "quote" )){ skip = true; };
				

				if ( result[i].first_reblogged_by == undefined && !skip ) {
		
					var c_times = result[i].created;
					var c_datum = new Date(c_times).toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

					var cleanBody = md.render(result[i].body)
					cleanBody = cleanBody.replace(/<h[0-9][^>]+>/gi, '');
					cleanBody = cleanBody.replace(/<[/]{0,1}[h][0-9]>/gi, '');
					
					var vote = ( fnc_inArrayOfObj( result[i].active_votes, 'voter', 't-800a' ));

					var data = {
						feed: {
							ID:			window.count.feed,
							author:		result[i].author,
							permlink:	result[i].permlink,
							header:		result[i].title,
							category:	result[i].category,
							text:		cleanBody,
							vote:		vote,
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
					window.count.feed++;
				}
			}
		}

	//	console.log( result.length );
	//	console.log( window.count.feed );
	//	console.log( window.SteemFeedLastAuthor );
	//	console.log( window.SteemFeedLastPermlink );
		
		fnc_output_feed( output_feed );		
		
	//
	//	FILL IT UP BABY ... gosh thats ugly i guess
	//	
		if ( window.count.feed < window.count.feedMax ){
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
	
	steem.api.getAccountHistory(querryAccount, querryFrom, querryLimit, async function(err, result)
	{
		var output_alerts = new Array();
		var output_comments = new Array();
		
	//	console.log(querryAccount);
	//	console.log(result);

		if(!err && result != undefined && result.length > 0){

			for (var i = result.length - 1; i >= 0; i--) {
		
				var c_times = result[i][1].timestamp;
				var c_datum = new Date(c_times).toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

		// -------------------------------------------------------------------------------------------------------------
		// fetch VOTES
		
				if (result[i][1].op[0] == "vote" && window.count.alerts < window.count.alertsMax && !( result[i][1].op[1].voter == querryAccount && result[i][1].op[1].author == querryAccount )) {

					var output = {
						result:		result[i],
						timestamp:	c_times,
						datum:		c_datum
					};

					output_alerts.push(output);
					window.count.alerts++;
				}

		// -------------------------------------------------------------------------------------------------------------
		// fetch incomming COMMENTS
		
				if (result[i][1].op[0] == "comment" && window.count.comment < window.count.commentMax && result[i][1].op[1].parent_author != "" && result[i][1].op[1].author != querryAccount && !result[i][1].op[1].body.includes("@@")) {
					
					var output = {
						result:		result[i],
						timestamp:	c_times,
						datum:		c_datum
					};

					output_comments.push( output );	
					window.count.comment++;
				}

		// -------------------------------------------------------------------------------------------------------------
		//  
		
				
			//	console.log(err, '#ID ' + window.count.id + ' // ' + result[i][1].op[0] + ' // - Author: ' + result[i][1].op[1].author );
			//	console.log(err, result[i][1]);
				window.count.id++;
			}
		}

	//	console.log(err, result);
	
		fnc_outputDataArray( output_comments, fnc_buildComment )
		fnc_outputDataArray( output_alerts, fnc_buildAlerts )

		return true
	});
}

// -------------------------------------------------------------------------------------------------------------------
//
//				COOKIES

function createCookie(name, value, days) {
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





// -------------------------------------------------------------------------------------------------------------------
//
//				START DOING STUFF
//
// -------------------------------------------------------------------------------------------------------------------


// init markup
var md = new Remarkable();
md.set({ html: true, breaks: true });
console.log(md.render('# Remarkable rulezz!'));


// attemp loading cookie
var cookie = getCookie( "SteamDashboardSettings" );
console.log("# cookie: " + cookie);

if ( cookie == "" ){
	
	var user = "t-800a";
	
	console.log("##### USER #####");
	console.log("# -> no cookie");
	console.log("# " + user);
	
	document.getElementById('#MainSteemUser').value = user;
	window.SteemAccount = user;

}else{
	
	var settings = JSON.parse(cookie);
	console.log("##### USER #####");
	console.log("# -> from cookie");
	console.log("# user: " + settings.user);

	document.getElementById('#MainSteemUser').value = settings.user;
	window.SteemAccount = settings.user;

}

window.SteemFeedLimit		= 100;	
// window.SteemFeedLastPermlink
// window.SteemFeedLastAuthor

window.count = {
	id:				0,
	alertsMax:		100,
	alerts:			0,
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

fnc_SteemLoadFeed();
fnc_SteemAccountHistory();

console.log(window.count);


