// java script

(function ($) 
{
$('#sel1').on('change', function () 
	{
  	call_change();
	}); // end of button click
//$('#sel2').on('change', function () 
//	{
  //	call_change();
//	}); // end of button click
$('#sel3').on('change', function () 
	{
  	call_change();
	}); // end of button click

}(jQuery)); //end of function $

var socket=io.connect();
socket.on("returneddata",function(data)
{
console.log(data.ar1);
console.log(data.ar2);
update_bar(data.ar2,data.ar1);
update_pie();
}
);
function call_change(){

zip1=document.getElementById("sel1").value;
zip2=document.getElementById("sel3").value;
console.log(zip1);

socket.emit("fetchdata", {state:zip1, careerarea:zip2});

} // end of call_change

/*
 $.ajax({
  url: '/explorer',
  type: 'POST',
  success: function(respon){
 // $.each(data, function (key, val) {
	console.log(respon);
//	});
	dataset=[];pie_labels=[];
	draw_bar(respon);
	draw_pie(respon, pie_labelxs);
  }, // end of success function
  error: function(error){console.log(error);}

  });// end of ajax call

http://sandbox.api.burning-glass.com/v206/explorer/occupationgroups?careerArea=27&areaId=505&culture=EnglishUS&offset=0&limit=10

http://sandbox.api.burning-glass.com/v206/explorer/occupationgroups?careerAreaId=23&areaId=505&culture=EnglishUS&offset=0&limit=10
*/


// Socket connection code



// Your beautiful D3 code will go here

var clw=165;
var h=380;
var w=480;
var pw=590;
var speed=300;
var padding=20;
var data_set=[3,1,2,3,4,5,6,7,9];
var pie_labels=["Machine Learning","Python","R","SQL","Java",".Net","JavaScript","Ruby","Spark","Databases"];
var bar_labels=["Research Scientist","Business Intelligence","Database Specialists","IT Managers","Software Developer","Data Scientist","Java Developer","Front End Web Developer","System Engineer","Software Architect"];
var pie_values=[20,4,6,8,10,12,12,8,4,2];

var color=d3.scale.category20();
var svg2 = d3.select("#pieChart")
    .append("svg")
    .append("g");
svg2.append("g").attr("class", "slices");
svg2.append("g").attr("class", "labels");
svg2.append("g").attr("class", "lines");
var radius=(h-30)/2;
var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg2.attr("transform", "translate(" + pw/2 + "," + h/2 + ")");


var svg=d3.select("#barChart")
	.append("svg")
	.attr({ height: h,
		width: w
		});
var svgt=d3.select("#chartLabel")
	.append("svg")
	.attr({ height: h,
		width: clw
		});
draw_bar(data_set,bar_labels);
update_pie();

function update_pie()
{	pie_values=[];
	for(i=0;i<10;i++)
	{
	pie_values.push(Math.ceil(Math.random()));
	}
	
//fetch data from api and reconstruct the pie_lables and pie_values
	draw_pie(pie_values,pie_labels);
}


function update_bar(dataset,barlabels)
{
var xScale = d3.scale.linear()
		.domain([0, d3.max(dataset,function(d){return(d);})])
		.range([padding, w-padding]);
var xWidthScale = d3.scale.linear()
		.domain([0, d3.max(dataset,function(d){return(d);})])
		.range([0, w-padding-padding]);

var xAxis = d3.svg.axis().scale(xScale)
		.orient("bottom").ticks(5);
var yScale = d3.scale.ordinal()
	.domain(d3.range(dataset.length))
	.rangeRoundBands([ h-padding,padding], 0.1);
var yAxis = d3.svg.axis().scale(yScale)
		.orient("left")
		.tickFormat("")
		;

svg.append("g").attr("class","axis").attr("id", "xaxis").attr("transform", "translate(0,"+(h-padding)+")");
svg.append("g").attr("class","axis").attr("id", "yaxis").attr("transform", "translate("+padding+",0)");

var bLabel=svgt.selectAll("text")
		.data(barlabels)
	//	.enter()
	//	.append("text")
		.text(function(d){return d;});
var blab_attr={
          y: function(d, i) { return yScale(i)+padding;},
          x: clw-5,
          height: yScale.rangeBand(),
	  fill: "white",
	  "font-size": "12px",
	  "text-anchor": "end"
	}


var rects=svg.selectAll("rect")
   .data(dataset);
rects.enter()
   .append("rect")
   .attr({
	y: h,
	x: padding+2,
	height: yScale.rangeBand(),
	width: function(d){return xWidthScale(d);}
	})
   .on("mouseover",function(d){
	d3.select(this).attr("fill","orange");
	var xPosition=parseFloat(d3.select(this).attr("width"))/2;
	var yPosition=parseFloat(d3.select(this).attr("y"))+yScale.rangeBand()+55;
	//construct tool tip
	d3.select("#tooltip")
	  .style("left", xPosition +"px")
	  .style("top", yPosition +"px")
	  .select("#value")
	  .text("Average Salary: $"+d);
	
	//display the tip that is constructed
	d3.select("#tooltip").classed("hidden",false);
	})//end of function on  event mouse over
    .on("mouseout",function(){
	d3.select(this).attr("fill","#3b6caa");
	d3.select("#tooltip").classed("hidden",true);
	})//end of function on event mouse out
    ; // end of rect definition

var rec_attr={	
	y: function(d, i) { return yScale(i);},
	x: padding +2,
	height: yScale.rangeBand(),
	width: function(d) { return xWidthScale(d); },
	fill:"#3b6caa" 
   };

rects.attr(rec_attr);
bLabel.attr(blab_attr);

bLabel.transition().duration(speed).attr(blab_attr);
rects.transition().duration(speed).attr(rec_attr);

bLabel.exit().transition().duration(speed).remove();
rects.exit().transition().duration(speed).attr("y",0).attr("fill","#3b4b54").remove();	

svg.select("#xaxis").transition().duration(speed).call(xAxis);
svg.select("#yaxis").transition().duration(speed).call(yAxis);

update_label(barlabels);
} //end of update_bar()
function update_label(barlabel)
{
var bL=svgt.selectAll("text")
		.data(barlabel)
		.enter()
		.append("text")
		.text(function(d){return d;});
var yScale = d3.scale.ordinal()
	.domain(d3.range(barlabel.length))
	.rangeRoundBands([ h-padding,padding], 0.1);
var bL_attr={
          y: function(d, i) { return yScale(i)+padding;},
          x: clw-5,
          height: yScale.rangeBand(),
	  fill: "white",
	  "font-size": "12px",
	  "text-anchor": "end"
	}
bL.attr(bL_attr);

bL.transition().duration(speed).attr(bL_attr);

} // end of update_label();

function draw_bar(dataset,barlabels)
{
var xScale = d3.scale.linear()
		.domain([0, d3.max(dataset,function(d){return(d);})])
		.range([padding, w-padding]);
var xWidthScale = d3.scale.linear()
		.domain([0, d3.max(dataset,function(d){return(d);})])
		.range([0, w-padding-padding]);

var xAxis = d3.svg.axis().scale(xScale)
		.orient("bottom").ticks(5);
var yScale = d3.scale.ordinal()
	.domain(d3.range(dataset.length))
	.rangeRoundBands([ h-padding,padding], 0.1);
var yAxis = d3.svg.axis().scale(yScale)
		.orient("left")
		.tickFormat("")
		;

svg.append("g").attr("class","axis").attr("id", "xaxis").attr("transform", "translate(0,"+(h-padding)+")");
svg.append("g").attr("class","axis").attr("id", "yaxis").attr("transform", "translate("+padding+",0)");

var bLabel=svgt.selectAll("text")
		.data(dataset);
bLabel.enter()
	.append("text")
	.text(function(d){return d;});
var blab_attr={
          y: function(d, i) { return yScale(i)+padding;},
          x: clw-5,
          height: yScale.rangeBand(),
	  fill: "white",
	  "font-size": "12px",
	  "text-anchor": "end"
	}


var rects=svg.selectAll("rect")
   .data(dataset);

rects.enter()
   .append("rect")
   .attr({
	y: h,
	x: padding+2,
	height: yScale.rangeBand(),
	width: function(d){return xWidthScale(d);}
	})
   .on("mouseover",function(d){
	d3.select(this).attr("fill","orange");
	var xPosition=parseFloat(d3.select(this).attr("width"))/2;
	var yPosition=parseFloat(d3.select(this).attr("y"))+yScale.rangeBand()+55;
	//construct tool tip
	d3.select("#tooltip")
	  .style("left", xPosition +"px")
	  .style("top", yPosition +"px")
	  .select("#value")
	  .text("Average Salary: $"+d);
	
	//display the tip that is constructed
	d3.select("#tooltip").classed("hidden",false);
	})//end of function on  event mouse over
    .on("mouseout",function(){
	d3.select(this).attr("fill","#3b6caa");
	d3.select("#tooltip").classed("hidden",true);
	})//end of function on event mouse out
    ; // end of rect definition

var rec_attr={	
	y: function(d, i) { return yScale(i);},
	x: padding +2,
	height: yScale.rangeBand(),
	width: function(d) { return xWidthScale(d); },
	fill:"#3b6caa" 
   };

rects.attr(rec_attr);
bLabel.attr(blab_attr);

bLabel.transition().duration(speed).attr(blab_attr);
rects.transition().duration(speed).attr(rec_attr);

bLabel.exit().transition().duration(speed).remove();
rects.exit().transition().duration(speed).attr("y",0).attr("fill","#3b4b54").remove();	

svg.select("#xaxis").transition().duration(speed).call(xAxis);
svg.select("#yaxis").transition().duration(speed).call(yAxis);

} //end of draw_bar()



//////////////////////////////////       Part 2       ////////////////////

function draw_pie(pievalues, pielabels)
{
       data = pielabels.map(function(da,i)
                {return{label: da, value: pievalues[i]}
                });

var slice = svg2.select(".slices")
		.selectAll("path.slice")
		.data(pie(data), data.label);

slice.enter().insert("path")
	.attr("fill", function(d,i) { return color(i); })
	.attr("class", "slice");

slice.transition().duration(speed)
	.attrTween("d", function(d) 
	{
		this._current = this._current || d;
		var interpolate = d3.interpolate(this._current, d);
		this._current = interpolate(0);
		return function(t) 
			{
			return arc(interpolate(t));
			};
	});
slice.exit().remove();

//  Drawing the labeling lines
var polyline = svg2.select(".lines")
		.selectAll("polyline")
		.data(pie(data), data.label);
polyline.enter().append("polyline")
	.style("opacity",".25")
	.style("stroke","white")
	.style("stroke-width","2px")
	.style("fill","none");

polyline.transition().duration(speed)
	.attrTween("points", function(d)
	{
		this._current = this._current || d;
		var interpolate = d3.interpolate(this._current, d);
		this._current = interpolate(0);
		return function(t) 
		{
			var d2 = interpolate(t);
			var pos = outerArc.centroid(d2);
			pos[0] = radius * 0.90 * (midAngle(d2) < Math.PI ? 0.9 : -0.9);
			return [arc.centroid(d2), outerArc.centroid(d2), pos];
		};			
	});

polyline.exit().remove();


// Adding text labels
var text = svg2.select(".labels")
		.selectAll("text")
		.data(pie(data), data.label);

text.enter().append("text").text(function(d){return d.data.label;}).attr("fill","white");

//determining position for text
function midAngle(d)
{
	return d.startAngle + (d.endAngle - d.startAngle)/2;
}

text.transition().duration(speed)
	.attrTween("transform", function(d) 
		{
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) 
				{
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = (radius-10) * (midAngle(d2) < Math.PI ? 0.9 : -0.9);
	
				return "translate("+ pos +")";
				};
		})
		.styleTween("text-anchor", function(d)
		{
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) 
			{
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});
	
text.exit().remove();


} // end of function draw_pie()

//Have a good day.
