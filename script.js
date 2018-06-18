
//Width and height
var w = 800;
var h = 600;

//Define map projection
var projection = d3.geo.azimuthalEquidistant()
                       .translate([w/2, h/2])
                       .center([8, 15])
                       .scale([w/1.5]);

//Define path generator
var path = d3.geo.path()
                 .projection(projection);

//Create SVG element
var svg = d3.select("#container")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//Load in GeoJSON data
d3.json("europe.json", function(json) {
    //Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .classed("map", true)
       .attr("d", path)
       .attr("transform", "translate(0,300)")
       .attr("stroke", "#D4E8F0")
       .attr("fill", "#5696BA")
       .on("mouseover", function() {
            d3.select(this)
            .attr("fill", "#4F3A7A")
            .style("cursor", "pointer");
        })
       .on("mouseout", function() {
            d3.select(this)
            .transition()
            .duration(250)
            .attr("fill", "#5696BA");
        })
        .on("click", function(d){
            if ("properties" in d){
            makeSpiderChart(d.properties.name);
            }});
});

var dataset;
var years;

d3.json("data.json", function(err, data) {
    if(err) console.log("Error fetching data");
    dataset = data;
    var countries = Object.keys(data);
    years = Object.keys(data.Germany);
    var populations = Object.keys(data.Austria[2016]);
    
    svg.selectAll("text")
        .data(countries)
        .enter()
        .append("text")
        .classed("cntrLst", true)
        .text(function(d) { return d;})
        .attr("x", 0)
        .attr("y", function(d, i){
        return (h/20)+i*15;})
        .attr("fill", "#A0A0A0")
        .on("mouseover", function(){
            d3.select(this)
            .attr("fill", "#4F3A7A")
            .style("cursor", "pointer");})
        .on("mouseout", function() {
            d3.select(this)
            .transition()
            .duration(250)
            .attr("fill", "#A0A0A0");})
        .on("click", function(d){
        makeSpiderChart(d);});   
});


d3.select(".btn")
  .on('click', function(){
    d3.selectAll(".map").style("visibility", "visible");
    svg.attr("height", h).attr("width", w);
    d3.select("#container").style("width", w.toString()+"px");

    d3.selectAll(".title").remove();
    d3.selectAll(".legend").remove();
    d3.selectAll(".radar").remove();
    d3.selectAll(".scrollbar").remove();

  });


// Try of a chart
function makeSpiderChart(country){
    d3.selectAll(".map").style("visibility", "hidden");

    var wChart = w*1.5;
    var hChart = h*1.3;
    svg.attr("height", hChart).attr("width", wChart);
    d3.select("#container").style("width", wChart.toString()+"px");

    var n = Object.keys(dataset[country][2015]).length;    
    
    var dta = [];
    for (var j = 0; j < years.length; j++){
        var nesto = [];
        for (var i = 0; i<n; i++){
            var tmp = {};
            str1 = Object.keys(dataset[country][years[j]])[i];
            tmp.axis = str1.replace("|", " | ");
            tmp.value = Object.values(dataset[country][years[j]])[i];
            nesto[i] = tmp;
        };
        dta.push(nesto);
    };
    
    var colorscale = d3.scale.category20c();
    
    var mycfg = {
      w: 600,
      h: 600,
      maxValue: 100,
      levels: 5,
      ExtraWidthX: 400,
      ExtraWidthY: 400,
      color: colorscale,
      TranslateX: 250,
      TranslateY: 70
    };
    
    dataSlice = dta.slice(0,1);
    yearSlice = years.slice(0,1);
    RadarChart.draw('svg', dataSlice, mycfg);
    makeLegend(yearSlice);

    d3.selectAll(".scrollbar").remove();

    d3.select("#container")
       .append("div")
       .classed("scrollbar", true)

       .append("text")
       .attr("id", "yearInput")
       .attr("x", wChart/2)
       .attr("y", hChart-20)
       .text("2000");

     d3.select(".scrollbar")
       .append("input")
       .classed("slider", true)
       .attr("type", "range")
       .attr("min", "2000")
       .attr("max", "2016")
       .attr("value", "2000")
       .on("input", function(){
          updateYear(+this.value);
       });

     d3.select(".scrollbar")
      .append("button")
      .text("Plot All")
      .attr("class", "btn")
      .on('click', function(){
        RadarChart.draw('svg', dta, mycfg);
        makeLegend(years);
      });


    function updateYear(y){
      d3.select("#yearInput").text(y);
      var s = y - 2000;
      dataSlice = dta.slice(s,s+1);
      yearSlice = years.slice(s,s+1);
      RadarChart.draw('svg', dataSlice, mycfg);
      makeLegend(yearSlice);
    }


    d3.selectAll(".title").remove();
    //Create the title for the legend
    var text = svg.append("text")
        .attr("class", "title")
        .attr("x", w/2)
        .attr("y", 15)
        .attr("font-size", "18px")
        .attr("fill", "#404040")
        .text("Percentage of intermediate and resistant strains for "+country);

function makeLegend(yearSlice){

    d3.select(".legend").remove();
    //Initiate Legend	
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200);
    
    //Create colour squares
    legend.selectAll('rect')
      .data(yearSlice)
      .enter()
      .append("rect")
      .attr("x", wChart - 73)
      .attr("y", function(d, i){ return i * 20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i){ return colorscale(i);})
      ;
    //Create text next to squares
    legend.selectAll('text')
      .data(yearSlice)
      .enter()
      .append("text")
      .attr("x", wChart - 58)
      .attr("y", function(d, i){ return i * 20 + 10;})
      .attr("font-size", "14px")
      .attr("fill", "#737373")
      .text(function(d) { return d; });
};
    


};