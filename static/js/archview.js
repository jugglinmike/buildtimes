// vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2

/*
 * time
 *
 *    |
 *    |                                +
 *    |           +
 *    |  +                     +
 *    |
 *    +-----------------------------------
 *                when
 *
 *
 * x = when
 * y = time
 *
 */

$(document).ready(function() {
  var margin = {top: 20, right: 80, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category20();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.when); })
      .y(function(d) { return y(d.time); });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("/times/" + pkg, function(error, data) {

    var arch_list = [];
    data.forEach(function(d) {
      d.when = new Date(d.when * 1000);
      if ( arch_list.indexOf(d.arch) == -1 ) {
        arch_list.push(d.arch);
      }
    });

    color.domain(arch_list);

    var arches = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {when: d.when, time: d.time};
        })
      };
    });

    y.domain(d3.extent(data, function(d) { return d.time; }));
    x.domain(d3.extent(data, function(d) { return d.when; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Build Time");

    var arch = svg.selectAll(".arch")
        .data(arches)
      .enter().append("g")
        .attr("class", "arch");

    arch.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

    arch.append("text")
        .attr("transform", function(d) { return "translate(" + x(d.values[0].when) + "," + y(d.values[0].time) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });
  });
});
