var express = require('express'), routes = require('./routes'), http = require('http'), path = require('path');
var request = require('request');
var OAuth   = require('oauth-1.0a');
var crypto = require('crypto');
var app = express();
var bodyParser = require('body-parser');

var server=require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection', function(){ /* … */ });
server.listen(8888, function(){
console.log('connection accepted');
});
server.on('error', function(err){console.log(err);});
// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

io.on("connection", function(socket)
{
socket.on("fetchdata", function(data)
{
//console.log("data id being fetched");
//console.log(data.state);
//console.log(data.careerarea);
var query='careerAreaId='+data.careerarea+'&areaId='+data.state+'&culture=EnglishUS&offset=0&limit=10';
api_fetch(query,function(data)
{
/*console.log(data);*/
var lab=[];
var sal=[];  
var s = data.indexOf("salaryAverage",0);
var n = data.indexOf("name",0);
var e = data.indexOf("\"",s);
var item;
while(s != -1)
{
//      alert(s);
        e = data.indexOf(",",s);
//      alert(e-(s+15));
        item=data.substr(s+15,e-(s+15));
        sal.push(parseFloat(item));

//      alert(n);
        e = data.indexOf("}",n);
//      alert(e-(n+7));
        item=data.substr(n+7,e-(n+7)-1);
        lab.push(item);
        
        s = data.indexOf("salaryAverage",s+1);
        n = data.indexOf("name",n+1);
}

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
        secret: 'F9751F2B48A3474E9C6E41FF989F0AF2'
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
    
});
var request_data = {
    url: 'http://sandbox.api.burning-glass.com/v206/explorer/occupationgroups?'+query,
    method: 'GET',
    data: {oauth_token: 'Explorer',
	oauth_consumer_key: 'IBM'}
	};
console.log(request_data.url);
var token = {
    public: 'Explorer',
    secret: '95C93BE538BD48F096D63B03E854AA84'
};


request({
    url: request_data.url,
    method: request_data.method,
    form: request_data.data,
    Accept : "json",
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


/*  ***********used with ajax***************
app.post('/explorer',function(req, res) 
{
var bar_data=[];
for(i=0;i<10;i++)
  {
     bar_data.push(Math.random()*20);
  }
var pie_lab=["Machine Learning","Python","R","SQL","Java",".Net","JavaScript","Ruby","Spark","Databases"];
res.send(bar_data);
            
});
*/
////////////////////////////     API connect end ////////////////////
app.get('/', routes.index);
http.createServer(app).listen(app.get('port'), '0.0.0.0');
