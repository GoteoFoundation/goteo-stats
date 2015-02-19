//import "viz";

var outliers = outliers || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {}};

outliers.viz.RankChart = function() {

  var container = "body",
      width = 500,
      height = 400,
      margin = {"top": 10, "left": 10, "bottom": 10, "right": 10, "internal": 150},
      svgParent = null,
      svg = null,
      x = d3.scale.linear(),
      y = d3.scale.ordinal(),
      roundBands = 0.2,
      bars = null,
      labels = null,
      transitionDuration = 500,
      cornerRadius = 3,
      maxOffset = Number.MIN_VALUE,
      labelPadding = 10,
      // ADDED BY ALEX
      rankLength = 11;

  function rank() {}

  /**
  * Renders the bar chart with the provided data.
  *
  * @param {Object[]} data: THE DATA (mandatory)
  * @param {String} valueField: name of the field where the value to be displayed is.
  * @param {String} idField: name of the field where the ID of every datum is.
  * @param {String} textField: name of the field where the text to be displayed on the label is.
  */
  rank.render = function  (data, valueField, idField, textField) {

    rankHeight = (height - margin.top - margin.bottom)/rankLength;
    console.log("RH " , rankHeight);

    function rightRoundedRect(x, y, width, height) {
      var radius = Math.abs(height * 0.33);
      return "M" + x + "," + y
           + "h" + (width - cornerRadius)
           + "a" + cornerRadius + "," + cornerRadius + " 0 0 1 " + cornerRadius + "," + cornerRadius
           + "v" + (height - 2 * cornerRadius)
           + "a" + cornerRadius + "," + cornerRadius + " 0 0 1 " + -cornerRadius + "," + cornerRadius
           + "h" + (cornerRadius - width)
           + "z";
    }
    // Update scales.
    y.domain(data.map(function (d, i) {
        if (textField) {
          return d[textField];
        } else {
          return i;
        }
      }))
     .rangeRoundBands([margin.top, height - margin.bottom], roundBands);
    //triangleDown.size(y.rangeBand());
    //triangleUp.size(y.rangeBand());
    //square.size(y.rangeBand());
    // Create SVG.
    console.log("CREO SVG", d3.select(container));
    console.log(container);
    console.log(d3.select(container));
    console.log(width);
    svgParent = d3.select(container)
                  .selectAll("svg")
                  .data([data]);
    svgParent.attr("width", width)
             .attr("height", height)
             .attr("viewBox", "0 0 " + width + " " + height);
    console.log(svgParent);
    svgParent.enter()
             .append("svg")
             .attr("width", width)
             .attr("height", height)
             .attr("viewBox", "0 0 " + width + " " + height)
             .append("g")
             .attr("transform","translate(0,"+30+")")
             .attr("id", "rank-" + container.replace(".","").replace("#", ""));
    svg = svgParent.select("#rank-" + container.replace(".","").replace("#", ""));
    // Add labels.
    /*labels = svg.selectAll(".barLabels")
                .data(data);
    labels.exit()
          .remove();
    labels.style("font-size", width < 480 ? "5pt" : "7pt")
          .transition()
          .duration(transitionDuration)
          .attr("y", function(d, i) {
            if (textField) {
              return y(d[textField]) + (y.rangeBand() / 2);
            } else {
              return y(i) + (y.rangeBand() / 2);
            }
          })
          .call(function (_) {
            if (_.length > 0) {
              for (var l = 0; l < _[0].length; l++) {
                if (_[0][l]){
                  var bbox = d3.select(_[0][l]).node().getBBox();
                  var currentOffset = bbox.x + bbox.width;
                  maxOffset = currentOffset > maxOffset ? currentOffset : maxOffset;
                }
              }
            }
          });
    labels.enter()
          .append("text")
          .attr("class", "rankGraph rankLabels")
          .attr("x", margin.left)
          .attr("y", function(d, i) {
            if (textField) {
              return y(d[textField]) + (y.rangeBand() / 2);
            } else {
              return y(i) + (y.rangeBand() / 2);
            }
          })
          .style("font-size", width < 480 ? "5pt" : "7pt")
          .text(function (d, i) {
            if (textField) {
              return d[textField];
            } else {
              return i;
            }
          })
          .transition()
          .duration(0)
          .call(function (_) {
            if (_.length > 0) {
              for (var l = 0; l < _[0].length; l++) {
                if (_[0][l]){
                  var bbox = d3.select(_[0][l]).node().getBBox();
                  var currentOffset = bbox.x + bbox.width;
                  maxOffset = currentOffset > maxOffset ? currentOffset : maxOffset;
                }
              }
            }
          });
    // We know the bigger text, we modify X scale.
    x.domain([Math.min(0, d3.min(data, function (d, i) {
                if (valueField) {
                  return +d[valueField];
                } else {
                  return +d;
                }
              })),
              d3.max(data, function (d) {
                if (valueField) {
                  return +d[valueField];
                } else {
                  return +d;
                }
              })])
     .range([0, width - margin.right - maxOffset - labelPadding])
     .nice();
     */
    // Add bars.
    ranks = svg.selectAll(".rank")
              .data(data,function(d){ return d[idField]; });
    ranks.exit()
        .remove();

    ranks.transition()
        .duration(transitionDuration)
        //.attr("y",function(d,i){ return i*rankHeight; });
        .attr("transform",function(d,i){ return "translate("+margin.left+","+i*rankHeight+")"; });
        /*.attr("d", function (d, i) {
          var myX = maxOffset + labelPadding,
              myY = textField ? y(d[textField]) : y(i),
              myWidth = valueField ? x(d[valueField]) : x(d),
              myHeight = y.rangeBand();
          return rightRoundedRect(myX, myY, myWidth, myHeight);
        })*/
    //var rankCont = ranks.enter()
    //    .append("g")
    //    .attr("class", "rankGraph rank")
    //    .attr("transform",function(d,i){ return "translate("+margin.left+","+i*rankHeight+")"; });
        

    var names = ranks.enter().append("text")
        .text(function(d){return d[textField];})
        .attr("class","rank")
        .attr("x",margin.left)
        .attr("y",function(d,i){ return i*rankHeight; });

    var values = ranks.enter().append("text")
        .text(function(d){ return d[valueField].toFixed(2);})
        .attr("class","rank")
        //.attr("transform",function(d,i){ return "translate("+(margin.left+50)+",0)"; });
        .attr("x",margin.left+margin.internal)
        .attr("y",function(d,i){ return i*rankHeight; });

    /*names.transition()
        .duration(transitionDuration)
        //.attr("x",margin.left)
        .attr("y",function(d,i){ return i*rankHeight; })
        .text(function(d){
            console.log("TRANSICIONO RANKING");
            return d.nombre;
        });


    values.transition()
        .duration(transitionDuration)
        //.attr("x",margin.left+100)
        .attr("y",function(d,i){ return i*rankHeight; })
        .text(function(d){return d[valueField].toFixed(2);});
*/
        /*.attr("d", function (d, i) {
          var myX = maxOffset + labelPadding,
              myY = textField ? y(d[textField]) : y(i),
              myWidth = valueField ? x(d[valueField]) : x(d),
              myHeight = y.rangeBand();
          return rightRoundedRect(myX, myY, myWidth, myHeight);
        })*/
  }

  /**
  * Resizes all the chart elements according to the new width provided.
  *
  * @param {Number} newWidth: new width of the chart.
  * @param {Object[]} data: THE DATA (mandatory)
  * @param {String} valueFiled: name of the field where the value to be displayed is.
  * @param {String} idField: name of the field where the ID of every datum is.
  * @param {String} textField: name of the field where the text to be displayed on the label is.
  */
  rank.resize = function (newWidth, data, valueField, idField, textField) {
    //width = newWidth;
    //bar.render(data, valueField, idField, textField);
    console.log("DEBERIA REAJUSTAR TEXTO")
  }

  /**
  * If x is provided, sets the selector of the container where the bar chart will
  * be rendered. If not returns its current value.
  *
  * @param {String} x: selector of the container where the chart will be rendered.
  */
  rank.container = function (_) {
    if (!arguments.length) return container;
    container = _;
    return rank;
  }

  /**
  * If x is provided, sets the width of the bar chart to it. If not
  * returns its current value..
  *
  * @param {Number} x: width of the pie chart.
  */
  rank.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return rank;
  }

  /**
  * If x is provided, sets the height of the bar chart to it. If not
  * returns its current value..
  *
  * @param {Number} x: width of the pie chart.
  */
  rank.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return rank;
  }

  /**
  * If x is provided, sets the transition duration of the bar chart to it. If not
  * returns its current value.
  *
  * @param {Number} x: number of milliseconds a transition must take.
  */
  rank.transitionDuration = function (_) {
    if (!arguments.length) return transitionDuration;
    transitionDuration = _;
    return rank;
  }

  /**
  * If x is provided, sets the padding of the columns in the bar chart to it. If not
  * returns its current value.
  *
  * @param {Number} x: number of milliseconds a transition must take.
  */
  rank.roundBands = function (_) {
    if (!arguments.length) return roundBands;
    roundBands = _;
    return rank;
  }

  /**
  * If x is provided, sets the labels padding of the bar chart to it. If not
  * returns its current value.
  *
  * @param {Number} x: number of milliseconds a transition must take.
  */
  rank.labelPadding = function (_) {
    if (!arguments.length) return labelPadding;
    labelPadding = _;
    return rank;
  }

  /**
  * If x is provided, sets the corner radius of the bars of the pie chart to it. If not
  * returns its current value.
  *
  * @param {Number} x: number of milliseconds a transition must take.
  */
  rank.cornerRadius = function (_) {
    if (!arguments.length) return cornerRadius;
    cornerRadius = _;
    return rank;
  }

  return rank;
}
