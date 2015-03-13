'use strict';

var outliers = outliers || {'version':0.1, 'controller':{}, 'viz': {} ,'utils': {}};

outliers.viz.AreaChart = function() {
  var container = "body",
    width = 500,
    height = 200,
    margin = {"top": 5, "left": 50, "bottom": 90, "right": 10},
    svgParent = null,
    svg = null,
    transitionDuration = 500,
    timeAxis = true,
    dotRadius = 5,
    tooltipFormat = d3.format("-.3s"),
    axisLabelFormat = timeAxis ? d3.time.format('%B %Y') : d3.format(',.0f');

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

    var x = timeAxis ? d3.time.scale() : d3.scale.linear(),
        y = d3.scale.linear();

    if (timeAxis) {
      data.forEach(function(d) {
        if (xField) {
          d[xField] = new Date(d[xField]);
        }
      });
    }

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
      .range([height - (margin.top * 2) - margin.bottom, 0])

    var xAxis = d3.svg.axis()
      .scale(x)
      .tickValues(data.map(function (d) {
        return xField ? d[xField] : i;
      }))
      .orient("bottom")
      .tickFormat(axisLabelFormat);

    var areagen = d3.svg.area()
      .x(function(d, i) {
        return xField ? x(d[xField]) : x(i);
      })
      .y0(height - (margin.top * 2) - margin.bottom)
      .y1(function(d) {
        return yField ? y(d[yField]) : y(d);
      })
      .interpolate("monotone");

    var line = d3.svg.line()
      .x(function(d, i) {
        return xField ? x(d[xField]) : x(i);
      })
      .y(function(d) {
        return yField ? y(d[yField]) : y(d);
      })
      .interpolate("monotone");

    var renderedXAxis = svg.selectAll(".x.axis")
      .data([data]);
    renderedXAxis.exit()
      .remove();
    renderedXAxis.enter()
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - (margin.top * 2) - margin.bottom) + ")");
    renderedXAxis.transition()
      .duration(transitionDuration)
      .call(xAxis)
      .selectAll('.tick text')
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");


    var renderedArea = svg.selectAll(".area")
      .data([data])
    renderedArea.exit()
      .remove();
    renderedArea.transition()
      .duration(transitionDuration)
      .attr("d", areagen);
    renderedArea.enter()
      .append("path")
      .attr("class", "area")
      .attr("d", areagen);
    var renderedLine = svg.selectAll(".line")
      .data([data])
    renderedLine.exit()
      .remove();
    renderedLine.transition()
      .duration(transitionDuration)
      .attr("d", line);
    renderedLine.enter()
      .append("path")
      .attr("class", "line")
      .attr("d", line);

    var renderedDot = svg.selectAll('.dot')
      .data(data, function (d, i) {
        return idField ? d[idField] : i;
      });
    renderedDot.exit()
      .remove();
    renderedDot.transition()
      .duration(transitionDuration)
      .attr('cx', function(d, i) {
        return xField ? x(d[xField]) : x(i);
      })
      .attr('cy', function(d) {
        return yField ? y(d[yField]) : y(d);
      });
    renderedDot.enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', function(d, i) {
        return xField ? x(d[xField]) : x(i);
      })
      .attr('cy', function(d) {
        return yField ? y(d[yField]) : y(d);
      })
      .attr('r', dotRadius)
      .on("mouseover", function() {
        $(this).tooltip('show');
      })
      .on("mouseout", function() {
        $(this).tooltip('hide');
      })
      .each(function(d) {
        $(this).tooltip({
          placement: 'top',
          container: 'body',
          html: true,
          title: (textField ? d[textField] : (xField ? d[xField] : i)) + '<br/>' + (tooltipFormat(yField ? d[yField] : d))
        });
      });

  };

  /**
   * Resizes all the chart elements according to the new width provided.
   *
   * @param {Number} newWidth: new width of the chart.
   * @param {Number} newHeight: new height of the chart.
   * @param {Object[]} data: THE DATA (mandatory)
   * @param {String} valueField: name of the field where the value to be displayed is.
   * @param {String} idField: name of the field where the ID of every datum is.
   * @param {String} textField: name of the field where the text to be displayed on the label is.
   */
  area.resize = function (newWidth, newHeight, data, xField, yField, idField, textField) {
    width = newWidth;
    height = newHeight;
    area.render(data, xField, yField, idField, textField);
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
   * @param {Boolean} x: set X axis as a time axis..
   */
  area.timeAxis = function (_) {
    if (!arguments.length) return timeAxis;
    timeAxis = _;
    return area;
  };

  /**
   * If x is provided, sets the dot radius to it. If not
   * returns its current value.
   *
   * @param {Number} x: dot radius.
   */
  area.dotRadius = function (_) {
    if (!arguments.length) return dotRadius;
    dotRadius = _;
    return area;
  };

  area.axisLabelFormat = function (_) {
    if (!arguments.length) return axisLabelFormat;
    axisLabelFormat = _;
    return area;
  };

  area.tooltipFormat = function (_) {
    if (!arguments.length) return tooltipFormat;
    tooltipFormat = _;
    return area;
  };

  return area;
};
