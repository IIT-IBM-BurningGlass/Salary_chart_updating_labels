var express = require('express'), routes = require('./routes'), http = require('http'), path = require('path');
var request = require('request');
var OAuth   = require('oauth-1.0a');
var crypto = require('crypto');
var app = express();
var bodyParser = require('body-parser');
var server=require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;
io.on('connection', function(){ /* … */ });
server.listen(port, function(){
console.log('connection accepted');
});
server.on('error', function(err){console.log(err);});
// all environments
//app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));
app.get('/', routes.index);
io.on("connection", function(socket)
{
socket.on("fetchdata", function(data)
{
console.log("data id being fetched");
console.log(data.state);
console.log(data.careerarea);
var query='occupationGroupId='+data.careerarea+'&areaId='+data.state+'&culture=EnglishUS';
api_fetch(query,function(data)
{
console.log(data);
var lab=[];
var sal=[];  
var s = data.indexOf("salaryAverage",0);
var n; 
var e = data.indexOf("\"",s);
var item;
while(s != -1)
{	n = data.indexOf("name",s+1); //OGName
//      alert(s);
        e = data.indexOf(",",s);
//      alert(e-(s+15));
        item=data.substr(s+15,e-(s+15));
        sal.push(parseFloat(item));

//      alert(n);
        n = data.indexOf("name",n+1); //OccName
        e = data.indexOf("}",n);
//      alert(e-(n+7));
        item=data.substr(n+7,e-(n+7)-1);
        lab.push(item);
        
        s = data.indexOf("salaryAverage",s+1);

}
console.log(sal);
console.log(lab);

socket.emit("returneddata", {ar1:lab, ar2:sal});
}); // end of function(data) and api_fetch
}); // end of socket.on
});//end of io.on connection
////////////////////////////     API connect  ////////////////////

function api_fetch(query,cb)
{
var oauth = OAuth({
    consumer: {
        public: 'IBM',
        secret: 'F9715GJ48A3474E9C6E41FF989F0AF2'
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
    
});
var request_data = {
    //url: 'http://sandbox.api.burning-glass.com/v206/explorer/occupations/marketdata?'+query,
   // url: 'http://sandbox.api.burning-glass.com/v206/explorer/occupations/marketdata?bgtoccs=15-1199.06,15-1199.07,15-1199.91&areaId=506',
    url: 'http://sandbox.api.burning-glass.com/v206/explorer/occupations?'+query,
    method: 'GET',
    data: {oauth_token: 'Explorer',
	oauth_consumer_key: 'IBM'}
	};
console.log(request_data.url);
var token = {
    public: 'Explorer',
    secret: '95C93BE538BFG67J63B03E854AA84'
};


request({
    url: request_data.url,
    method: request_data.method,
    form: request_data.data,
    headers: oauth.toHeader(oauth.authorize(request_data, token))
   	}, function(error, response, body) 
		{//console.log(response.body);
		var ar=[];
/*		for (r in body.result.data)
			{
			ar.push(r[name]);
			}
		console.log(ar);
*/		
//		console.log(typeof(body) );
//		console.log(body.result.data);
		cb(body);
		}
		
        );



} // end of api fetch function


////////////////////////////     API connect end ////////////////////
//http://sandbox.api.burning-glass.com/v206/explorer/occupations?searchTerm=analy&areaId=505&careerAreaId=9
//http.createServer(app).listen(app.get('port'), '0.0.0.0');
