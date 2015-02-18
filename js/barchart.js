//import "viz";

var outliers = outliers || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {}};

outliers.viz.BarChart = function() {
  var container = "body",
      width = 500,
      height = 200,
      margin = {"top": 10, "left": 10, "bottom": 10, "right": 10},
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
      labelPadding = 10;

  function bar() {}

  /**
  * Renders the bar chart with the provided data.
  *
  * @param {Object[]} data: THE DATA (mandatory)
  * @param {String} valueField: name of the field where the value to be displayed is.
  * @param {String} idField: name of the field where the ID of every datum is.
  * @param {String} textField: name of the field where the text to be displayed on the label is.
  */
  bar.render = function  (data, valueField, idField, textField) {
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
    svgParent = d3.select(container)
                  .selectAll("svg")
                  .data([data]);
    svgParent.attr("width", width)
             .attr("height", height)
             .attr("viewBox", "0 0 " + width + " " + height);
    svgParent.enter()
             .append("svg")
             .attr("width", width)
             .attr("height", height)
             .attr("viewBox", "0 0 " + width + " " + height)
             .append("g")
             .attr("id", "bar-" + container.replace(".","").replace("#", ""));
    svg = svgParent.select("#bar-" + container.replace(".","").replace("#", ""));
    // Add labels.
    labels = svg.selectAll(".barLabels")
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
          .attr("class", "barGraph barLabels")
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
    // Add bars.
    bars = svg.selectAll(".bar")
              .data(data);
    bars.exit()
        .remove();
    bars.transition()
        .duration(transitionDuration)
        .attr("d", function (d, i) {
          var myX = maxOffset + labelPadding,
              myY = textField ? y(d[textField]) : y(i),
              myWidth = valueField ? x(d[valueField]) : x(d),
              myHeight = y.rangeBand();
          return rightRoundedRect(myX, myY, myWidth, myHeight);
        })
    bars.enter()
        .append("path")
        .attr("class", "barGraph bar")
        .attr("d", function (d, i) {
          var myX = maxOffset + labelPadding,
              myY = textField ? y(d[textField]) : y(i),
              myWidth = valueField ? x(d[valueField]) : x(d),
              myHeight = y.rangeBand();
          return rightRoundedRect(myX, myY, myWidth, myHeight);
        })
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
  bar.resize = function (newWidth, data, valueField, idField, textField) {
    width = newWidth;
    bar.render(data, valueField, idField, textField);
  }

  /**
  * If x is provided, sets the selector of the container where the bar chart will
  * be rendered. If not returns its current value.
  *
  * @param {String} x: selector of the container where the chart will be rendered.
  */
  bar.container = function (_) {
    if (!arguments.length) return container;
    container = _;
    return bar;
  }

  /**
  * If x is provided, sets the width of the bar chart to it. If not
  * returns its current value..
  *
  * @param {Number} x: width of the pie chart.
  */
  bar.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return bar;
  }

  /**
  * If x is provided, sets the height of the bar chart to it. If not
  * returns its current value..
  *
  * @param {Number} x: width of the pie chart.
  */
  bar.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return bar;
  }

  /**
  * If x is provided, sets the transition duration of the bar chart to it. If not
  * returns its current value.
  *
  * @param {Number} x: number of milliseconds a transition must take.
  */
  bar.transitionDuration = function (_) {
    if (!arguments.length) return transitionDuration;
    transitionDuration = _;
    return bar;
  }

  /**
  * If x is provided, sets the padding of the columns in the bar chart to it. If not
  * returns its current value.
  *
  * @param {Number} x: number of milliseconds a transition must take.
  */
  bar.roundBands = function (_) {
    if (!arguments.length) return roundBands;
    roundBands = _;
    return bar;
  }

  /**
  * If x is provided, sets the labels padding of the bar chart to it. If not
  * returns its current value.
  *
  * @param {Number} x: number of milliseconds a transition must take.
  */
  bar.labelPadding = function (_) {
    if (!arguments.length) return labelPadding;
    labelPadding = _;
    return bar;
  }

  /**
  * If x is provided, sets the corner radius of the bars of the pie chart to it. If not
  * returns its current value.
  *
  * @param {Number} x: number of milliseconds a transition must take.
  */
  bar.cornerRadius = function (_) {
    if (!arguments.length) return cornerRadius;
    cornerRadius = _;
    return bar;
  }

  return bar;
}
