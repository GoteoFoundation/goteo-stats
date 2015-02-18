outliers.utils = {};
outliers.utils.getStyleRuleValue = function (style, selector, sheet) {
  var sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets;
  for (var i = 0, l = sheets.length; i < l; i++) {
    sheet = sheets[i];
    if (/^.*\/app.css$/.test(sheet.href)) {
      if( !sheet.cssRules ) { continue; }
      for (var j = 0, k = sheet.cssRules.length; j < k; j++) {
        var rule = sheet.cssRules[j];
        if(rule.selectorText) {
          if (rule.selectorText.split(',').indexOf(selector) !== -1) {
              return rule.style[style];
          }
        }
      }
    }
  }
  return null;
}
/** x: x-coordinate
    y: y-coordinate
    w: width
    h: height
    r: corner radius
    tl: top_left rounded?
    tr: top_right rounded?
    bl: bottom_left rounded?
    br: bottom_right rounded? */
outliers.utils.roundedRect = function (x, y, w, h, r, tl, tr, bl, br) {
    var retval;
    retval  = "M" + (x + r) + "," + y;
    retval += "h" + (w - 2*r);
    if (tr) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r; }
    else { retval += "h" + r; retval += "v" + r; }
    retval += "v" + (h - 2*r);
    if (br) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r; }
    else { retval += "v" + r; retval += "h" + -r; }
    retval += "h" + (2*r - w);
    if (bl) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r; }
    else { retval += "h" + -r; retval += "v" + -r; }
    retval += "v" + (2*r - h);
    if (tl) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r; }
    else { retval += "v" + -r; retval += "h" + r; }
    retval += "z";
    return retval;
}

outliers.utils.stringCleaner = function (_) {
  return _.replace(/[.*+?#^=!:${}()|\[\]\s\/\\]/g, "_");
}

outliers.utils.wrap = function (data, widthField) {
  data.each(function() {
    var label = d3.select(this),
        words = label.text()
                     .split(/\s+/)
                     .reverse(),
        word,
        lines = [],
        line = [],
        width = parseFloat(label.attr(widthField)),
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = label.attr("y") || 0,
        dy = parseFloat(label.attr("dy")) || 0.1;
        gauge_tspan = label.text(null)
                           .append("tspan")
                           .style('opacity', 0);
    lines.push(line);
    while (word = words.pop()) {
        line.push(word);
        gauge_tspan.text(line.join(" "));
        var cond = Math.floor(width / 6);
        if ((gauge_tspan.node().getComputedTextLength() > width) && (line.length > 1)) {
          line.pop();
          line = [word];
          lines.push(line);
        } else if (line.length === 1 && line[0].length > cond) {
          var _1 = line[0].slice(0, cond),
              _2 = line[0].slice(cond);
          if (_2.length > 2) {
            line.pop();
            line = [_2];
            lines[lines.length - 1] = [_1 + "-"];
            lines.push(line);
          }
        };
    }
    var tspans = label.text(null)
                      .selectAll('tspan')
                      .data(lines.map(function(d) {
                        return d.join(" ");
                      }));
    tspans.exit()
          .remove();
    tspans.enter()
          .append("tspan")
          .attr("x", 0)
          .attr("y", function (d) {
            return y;
          })
    tspans.text(function(d) {
            return d;
          })
          .attr("dy", function(d, i) {
            return dy + i * lineHeight + "em";
          });
  });
}
