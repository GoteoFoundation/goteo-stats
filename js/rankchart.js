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
    // Update scales.
    y.domain(data.map(function (d, i) {
        if (idField) {
          return d[idField];
        } else {
          return i;
        }
      }))
     .rangeRoundBands([margin.top, height - margin.bottom], roundBands);
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
    ranks = svg.selectAll(".rank")
              .data(data,function(d){ return d[idField]; });
    ranks.exit()
        .remove();
    ranks.transition()
        .duration(transitionDuration)
        .attr("transform",function (d,i) { return "translate(" + margin.left + "," + (i * rankHeight) + ")"; });
    var names = ranks.enter()
                     .append("text")
                     .text(function (d) { return d[textField]; })
                     .attr("class","rank")
                     .attr("x", margin.left)
                     .attr("y", function (d,i) { return i * rankHeight; });
    var values = ranks.enter().append("text")
        .text(function(d){ return d[valueField].toFixed(2);})
        .attr("class","rank")
        .attr("x",margin.left+margin.internal)
        .attr("y",function(d,i){ return i*rankHeight; });
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

  return rank;
}
