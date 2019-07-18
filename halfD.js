// Requires D3.js
define(["http://d3js.org/d3.v3.min.js", "jquery"], function(d3) {
    "use strict";

var dataset = {
  hist1: [200, 300, 400, 500, 600, 700, 800, 900],
  hist2: [620, 452, 213, 313, 122, 989, 878, 567],
};

var color = d3.scale.category10();

var width = 600,
  height = 300,
  margin = 50,
  thickness = 100,
  radius = Math.min(width, 2 * height) / 2,
  angleRange = 0.5 * Math.PI;

var pie = d3.layout.pie()
  .sort(null)
  .startAngle(angleRange * -1)
  .endAngle(angleRange);

var arc = d3.svg.arc()
  .innerRadius(radius - margin - thickness)
  .outerRadius(radius - margin);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + (height - margin / 2) + ")");

var path = svg.selectAll("path")
  .data(pie(dataset.hist1))
  .enter().append("path")
  .attr("fill", function(d, i) {
    return color(i);
  })
  .attr("d", arc);

path.transition()
  .duration(2000)
  .delay(500)
  .attrTween("d", tweenArc(function(d, i) {
    return {
      startAngle: -1 * angleRange,
      endAngle: d.startAngle
    }
  }));

path.transition()
  .duration(2000)
  .delay(3000)
  .attrTween("d", tweenArc(function(d, i) {
    return {
      startAngle: d.startAngle,
      endAngle: 0,
    }
  }));

svg.append("text")
  .attr("dy", "-.3em")
  .attr("dx", "-0.95em")
  .attr("font-size", "90px")
  .attr("font-family", "sans-serif")
  .text(function(d) { return "60%"; });
        
function transition(state) {
  var path = d3.selectAll(".arc > path")
    .data(state ? arcs(hist1, hist2) : arcs(hist2, hist1));

  // Wedges split into two rings.
  var t0 = path.transition()
    .duration(1000)
    .attrTween("d", tweenArc(function(d, i) {
      return {
        innerRadius: i & 1 ? innerRadius : (innerRadius + outerRadius) / 2,
        outerRadius: i & 1 ? (innerRadius + outerRadius) / 2 : outerRadius
      };
    }));

  // Wedges translate to be centered on their final position.
  var t1 = t0.transition()
    .attrTween("d", tweenArc(function(d, i) {
      var a0 = d.next.startAngle + d.next.endAngle,
        a1 = d.startAngle - d.endAngle;
      return {
        startAngle: (a0 + a1) / 2,
        endAngle: (a0 - a1) / 2
      };
    }));

  // Wedges then update their values, changing size.
  var t2 = t1.transition()
    .attrTween("d", tweenArc(function(d, i) {
      return {
        startAngle: d.next.startAngle,
        endAngle: d.next.endAngle
      };
    }));

  // Wedges reunite into a single ring.
  var t3 = t2.transition()
    .attrTween("d", tweenArc(function(d, i) {
      return {
        innerRadius: innerRadius,
        outerRadius: outerRadius
      };
    }));

  setTimeout(function() {
    transition(!state);
  }, 200);
}

function tweenArc(b) {
  return function(a, i) {
    var d = b.call(this, a, i),
      i = d3.interpolate(a, d);
    for (var k in d) a[k] = d[k]; // update data
    return function(t) {
      return arc(i(t));
    };
  };
}
});