var outliers = outliers || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {}};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

outliers.controller.Goteo = function (options) {
    var self = {};
    for (key in options) {
        self[key] = options[key];
    }
    self.parentSelect = "#"+self.idName;
    self.APIUrl = self.baseUrl + self.endpoint;
    self.chartsList = self.chartsTemplate;
    self.selectorsList = self.selectorsTemplate;
    self.generateHtml = function () {
      // Append charts container.
      var mainContainer = d3.select(self.parentSelect)
                            .selectAll("#mainContainer-" + self.idName)
                            .data([0]);
      mainContainer.enter()
                   .append("div")
                   .attr("id", "mainContainer-" + self.idName);
      // Add selectors.
      var selectorsContainer = d3.select("#mainContainer-" + self.idName)
                                 .selectAll("#chartsSelectors-" + self.idName)
                                 .data([0]);
      selectorsContainer.enter()
                        .append("div")
                        .attr("id", "chartsSelectors-" + self.idName)
                        .attr("class", "col-xs-12 chartsSelectors");
      var selectors = d3.select("#chartsSelectors-" + self.idName)
                        .selectAll(".selector")
                        .data(self.selectorsList);
      var newSelectors = selectors.enter()
                                  .append("div")
                                  .attr("id", function (d) { return d.name + "Zone"; })
                                  .attr("class", function (d, i) { return "col-sm-5" + (i == 0 ? " col-sm-offset-2" : ""); });
      newSelectors.append("div")
                  .attr("id", function (d) { return d.name + "ZoneTitle"; })
                  .attr("class", "mainTitleZone col-sm-2")
                  .html(function (d) { return d.title; });
      newSelectors.append("select")
                  .attr("id", function (d) { return d.name + "Selector";})
                  .attr("class", "selector col-sm-6")
                  .on("change", function (d) {
                    self[d.name] = this.value;
                    if(self.parentSelect!="#community"&&self.parentSelect!="#money"){
                        self.refreshData();
                    }
                    else{
                        self.refreshDataCall();
                    }
                  })
                  .each(function (d) {
                     var options = d3.select(this)
                                     .selectAll("option")
                                     .data(d.values);
                     options.enter()
                            .append("option")
                            .attr("value", function (d) {
                              if (typeof d === 'object') {
                                return d.id;
                              } else {
                                return d;
                              }
                            })
                            .html(function (d) {
                               if (typeof d === 'object') {
                                 return d.name;
                               } else {
                                 return d;
                               }
                            });
                  });
      // Add charts.
      var chartsContainer = d3.select("#mainContainer-" + self.idName)
                              .selectAll("#charts-" + self.idName)
                              .data([0]);
      chartsContainer.enter()
                     .append("div")
                     .attr("id", "charts-" + self.idName)
                     .attr("class", "col-xs-12 chartsContainer");
      var charts = d3.select("#charts-" + self.idName)
                     .selectAll(".chart")
                     .data(self.chartsList);
      var newCharts = charts.enter()
                            .append("div")
                            .attr("class", "chart col-sm-6")
                            .attr("id", function (d) { return d.id + "Chart-" + self.idName; });
      newCharts.append("div")
               .attr("id", function (d) { return d.id + "Info"; })
               .attr("class", "col-sm-6")
               .each(function (d) {
                 var currentInfo = d3.select(this);
                 currentInfo.append("div")
                           .attr("id", function () { return d.id + "Title"; })
                           .attr("class", "chartTitleZone")
                           .html(function () { return d.title; });
                 currentInfo.append("div")
                           .attr("id", function () { return d.id + "Total"; })
                           .attr("class", "chartTotalZone");
                 currentInfo.append("div")
                           .attr("id", function () { return d.id + "Footer"; })
                           .attr("class", "chartFooterZone")
                           .html(function () { return d.footer; });
               });
      newCharts.append("div")
               .attr("id", function (d) { 
                   return d.id + d.type.capitalize() + "Chart"; 
               })
               .attr("class", "col-sm-6");
    };
    self.start = function(){
        self.generateHtml();
        if(self.parentSelect!='#community'&&self.parentSelect!="#money"){
          self.refreshData();
        }
        else{
          self.refreshDataCall();
        }
        // Instantiate charts.
        self.chartsList.forEach(function (d) {
          var currentChart;
          //var chartWidth = $("#" + d.id + d.type.capitalize() + "Chart").innerWidth();
          var chartWidth = 250;
          if (d.type === "bar") {
            currentChart = new outliers.viz.BarChart()
                                           //.container(self.parentSelect+" #" + d.id + d.type.capitalize() + "Chart")
                                           .container("#" + d.id + d.type.capitalize() + "Chart")
                                           .width(chartWidth)
                                           .height(chartWidth)
                                           .transitionDuration(200);
          } else if (d.type === "pie") {
            currentChart = new outliers.viz.PieChart()
                                           .container("#" + d.id + d.type.capitalize() + "Chart")
                                           .side(chartWidth)
                                           .margin({"top": 0, "left": 0, "bottom": 0, "right": 0})
                                           .transitionDuration(200);
          } else if (d.type === "rank"){

            currentChart = new outliers.viz.RankChart()
                                           .container("#" + d.id + d.type.capitalize() + "Chart")
                                           .width(chartWidth)
                                           //.margin({"top": 0, "left": 0, "bottom": 0, "right": 0})
                                           .transitionDuration(200);
          }
          d.chart = currentChart;
        });
    };
    self.refreshData = function () {
      d3.json(self.baseJUrl + "fake_" + self.year + "_" + self.category + ".json", function (error,data) {
        self.data = $.extend(true, [], data);
        self.chartsList.forEach(function (d) {
          if (d.type === "bar") {
            d.chart.render(self.data.meses, d.dataField, "mes", "mes");
          } else if (d.type === "pie") {
            d.chart.render(self.prepareData(self.data.meses, self.data[d.dataField], d.dataField), d.dataField, "mes", "mes");
          } else if (d.type === "rank"){
            d.chart.render(self.data.donantes, d.dataField , "nombre","nombre");
          }
        });
        self.fillTotals(self.data);
      });
    };
    self.refreshDataCall = function(){
        $.ajaxSetup({
              headers: { 'Authorization': "Basic " + btoa('goteo:goteo')}
        });
        //Retrieve some user information:
        $.get(self.APIUrl,function(data){
          self.data = $.extend(true, [], data);
          self.data.meses = [];
          $.each(['January','February','March','April','May','June','July','August','September','October','November','December'],function(i,d){
            self.dataAux = $.extend(true, [], data);
            self.dataAux.month = d;
            self.data.meses.push(self.dataAux);
          });
          self.chartsList.forEach(function (d) {
            if(d.type === "bar"){
                d.chart.render(self.data.meses, d.dataField, "month", "month");
            }
            else if (d.type === "rank"){
                d.chart.render(self.data[d.listName], d.dataField , "user","user");
            }
          });

        });
    };
    self.fillTotals = function(data){
      self.chartsList.forEach(function (d) {
        var totalId = "#" + d.id + "Total";
        if(d.type!="rank"){
          d3.select(totalId).html(self.formatNumbers(data[d.dataField]));
        }
        else{
          //TODO: Aquí debería ir el total de rank, si existe.
        }
      });
    };
    self.prepareData = function(data,total,dataField){
      $.each(data,function(i,d){
        d[dataField] = parseFloat(d[dataField])/parseFloat(total);
      });
      return data;
    };
    self.formatNumbers = d3.format(".3s");
    return self;
};

