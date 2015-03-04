'use strict';

var outliers = outliers || {'version':0.1, 'controller':{}, 'viz': {} ,'utils': {}};

outliers.viz.AreaChart = function() {
  var container = "body",
    width = 500,
    height = 200,
    margin = {"top": 10, "left": 10, "bottom": 10, "right": 10},
    svgParent = null,
    svg = null,
    transitionDuration = 500,
    timeAxis = true;

  function area() {}

  /**
   * Renders the bar chart with the provided data.
   *
   * @param {Object[]} data: THE DATA (mandatory)
   * @param {String} xField: name of the field where the X value is.
   * @param {String} yField: name of the field where the Y value is.
   * @param {String} idField: name of the field where the ID of every datum is.
   * @param {String} textField: name of the field where the text to be displayed on the label is.
   */
  area.render = function  (data, xField, yField, idField, textField) {
    console.log(data);

    var x = timeAxis ? d3.time.scale() : d3.scale.linear(),
        y = d3.scale.linear();

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
      .attr("id", "areachart-" + container.replace(".","").replace("#", ""));
    svg = svgParent.select("#areachart-" + container.replace(".","").replace("#", ""))
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function(d, i) {
      return xField ? d[xField] : i;
    }))
      .range([0, width - margin.left - margin.right]);

    y.domain([0, d3.max(data, function (d) {
        return yField ? d[yField] : d;
      })])
      .range([height - margin.top - margin.bottom, 0])

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var area = d3.svg.area()
      .x(function(d, i) {
        return xField ? x(d[xField]) : x(i);
      })
      .y0(height - margin.top - margin.bottom)
      .y1(function(d) {
        return yField ? y(d[yField]) : y(d);
      });

    svg.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  };

  /**
   * If x is provided, sets the selector of the container where the area chart will
   * be rendered. If not returns its current value.
   *
   * @param {String} x: selector of the container where the chart will be rendered.
   */
  area.container = function (_) {
    if (!arguments.length) return container;
    container = _;
    return area;
  };

  /**
   * If x is provided, sets the width of the area chart to it. If not
   * returns its current value..
   *
   * @param {Number} x: width of the pie chart.
   */
  area.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return area;
  };

  /**
   * If x is provided, sets the height of the area chart to it. If not
   * returns its current value..
   *
   * @param {Number} x: width of the pie chart.
   */
  area.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return area;
  };

  /**
   * If x is provided, sets the transition duration of the area chart to it. If not
   * returns its current value.
   *
   * @param {Number} x: number of milliseconds a transition must take.
   */
  area.transitionDuration = function (_) {
    if (!arguments.length) return transitionDuration;
    transitionDuration = _;
    return area;
  };

  /**
   * If x is provided, sets the condition to draw the X axis as a time scale to it. If not
   * returns its current value.
   *
   * @param {Number} x: number of milliseconds a transition must take.
   */
  area.timeAxis = function (_) {
    if (!arguments.length) return timeAxis;
    timeAxis = _;
    return area;
  };

  return area;
};
