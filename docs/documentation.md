# Goteo Statistics

## Prerequisites

This project assumes you are using Mac OS X with [XCode][xcode] and
[homebrew][brew] installed and configured correctly, but installation will
comfortably work on other platforms with minor command alterations.

Lets first check your system is OK, running brew doctor will help you

    brew doctor

This project requires [Node.js][nodejs] to build and [nginx][nginx] to serve the
application.

    brew install node nginx

You'll need to install node package [bower][bower] globally which is uses to
maintain third-party component dependencies.

    npm install --global bower protractor karma-cli

## Installation

Assuming you have [Node.js][nodejs] and [bower][bower]
installed you are ready to clone and install the project.


#### Clone the project

    $ git clone git@github.com:agonzalezdiez/goteoAPIViz.git
    $ cd ./goteoAPIViz

#### Install

    $ make setup

## Development

Now you have the application successfully installed, you want to make a change,
right.

Run [gulp][gulp], which will [lint][lint-wiki] and pre-compile the application
on file changes and make them available via [localhost:3000](http://localhost:3000):

    $ make

## Building

There is a [gulp][gulp] task that will build the application for deploying on
HTTP web servers run:

    $ gulp build

## License

Copyright 2015 Outliers Collective

[nodejs]:http://nodejs.org/
[bower]:http://bower.io/
[brew]:http://brew.sh/
[xcode]:https://developer.apple.com/xcode/
[gulp]:http://gulpjs.com/
[lint-wiki]:http://en.wikipedia.org/wiki/Lint_(software)
[nginx]:http://nginx.com

## Javascript Documentation

* [app/scripts/controllers/community.js](#controllers_community)
* [app/scripts/controllers/home.js](#controllers_home)
* [app/scripts/controllers/money.js](#controllers_money)
* [app/scripts/controllers/projects.js](#controllers_projects)
* [app/scripts/controllers/rewards.js](#controllers_rewards)
* [app/scripts/directives/areachart.js](#directives_areachart)
* [app/scripts/directives/barchart.js](#directives_barchart)
* [app/scripts/directives/piechart-select.js](#directives_piechart-select)
* [app/scripts/directives/piechart.js](#directives_piechart)
* [app/scripts/directives/ranking.js](#directives_ranking)
* [app/scripts/services/apiService.js](#services_apiService)
* [app/scripts/services/goteoApi.js](#services_goteoApi)
* [app/scripts/viz/areachart.js](#viz_areachart)
* [app/scripts/viz/barchart.js](#viz_barchart)
* [app/scripts/viz/piechart.js](#viz_piechart)
* [app/scripts/viz/utils.js](#viz_utils)


### app/scripts/controllers/community.js<a name="controllers_community"></a>

`/community` controller

##### prepareData()

Process data to be used in charts.

--------


### app/scripts/controllers/home.js<a name="controllers_home"></a>

`/home` controller

##### prepareData()

Process data to be used in charts.

--------


### app/scripts/controllers/money.js<a name="controllers_money"></a>

`/money` controller

##### prepareData()

Process data to be used in charts.

--------


### app/scripts/controllers/projects.js<a name="controllers_projects"></a>

`/projects` controller

##### prepareData()

Process data to be used in charts.

--------


### app/scripts/controllers/rewards.js<a name="controllers_rewards"></a>

`/rewards` controller

##### prepareData()

Process data to be used in charts.

--------


### app/scripts/directives/areachart.js<a name="directives_areachart"></a>

areachart directive

Attributes:

* **areachart-id** {String} id of the chart
* **areachart-title** {String} title text of the chart
* **areachart-description** {String} description text of the chart
* **areachart-cumul** {Number} cumulative value to display
* **areachart-data** {Array} data array
* **areachart-x-field** {String} name of the field to use as X value. Default: `name`
* **areachart-y-field** {String} name of the field to use as Y value. Default: `value`
* **areachart-id-field** {String} name of the field to use as unique id. Default: `id`
* **areachart-label-field** {String} name of the field to use as label. Default: `label`
* **areachart-unit** {String} units of the data
* **areachart-x-format** {String} format pattern to use for the X axis. Default: `%B %Y`
* **areachart-is-year** {Boolean} True if each datum represents a year

Example:

    <areachart areachart-id="miAreaChart" areachart-data="[{"id":"2011","name":"2011","value":141},{"id":"2012","name":"2012","value":397},{"id":"2013","name":"2013","value":735},{"id":"2014","name":"2014","value":509},{"id":"2015","name":"2015","value":179}]" />

--------


### app/scripts/directives/barchart.js<a name="directives_barchart"></a>

barchart directive

Attributes:

* **barchart-id** {String} id of the chart
* **barchart-title** {String} title text of the chart
* **barchart-description** {String} description text of the chart
* **barchart-cumul** {Number} cumulative value to display
* **barchart-data** {Array} data array
* **barchart-value-field** {String} name of the field to use as value. Default: `value`
* **barchart-id-field** {String} name of the field to use as unique id. Default: `id`
* **barchart-label-field** {String} name of the field to use as label. Default: `name`
* **barchart-label-format** {String} format pattern to use for the label. Default: `%B %Y`
* **barchart-unit** {String} units of the data

Example:

    <barchart barchart-id="mibarchart" barchart-data="[{"id":"enero 2015","name":"2015-01-01T00:00:00.000Z","value":60},{"id":"febrero 2015","name":"2015-02-01T00:00:00.000Z","value":33.33},{"id":"marzo 2015","name":"2015-03-01T00:00:00.000Z","value":0}" />

--------


### app/scripts/directives/piechart-select.js<a name="directives_piechart-select"></a>

piechart-select directive

Attributes:

* **piechart-select-id** {String} id of the chart
* **piechart-select-title** {String} title text of the chart
* **piechart-select-description** {String} description text of the chart
* **piechart-select-cumul** {Number} cumulative value to display
* **piechart-select-data** {Array} data array
* **piechart-select-value-field** {String} name of the field to use as value. Default: `value`
* **piechart-select-id-field** {String} name of the field to use as unique id. Default: `id`
* **piechart-select-label-field** {String} name of the field to use as label. Default: `label`
* **piechart-select-is-percentage** {Boolean} True if data is already provided as percentage
* **piechart-select-select-field** {String} name of the field to identify different sets of data. Default: `select`
* **piechart-select-data-field** {String} name of the field where each set of data is. Default: `data`

Example:

    <piechart-select piechart-select-id="mipiechart" piechart-select-data="{"select": "2015", "data":[{"id":2,"name":"Social","percentage-users":7.06,"users":0.19181286549707602},{"id":11,"name":"Cultural","percentage-users":6.43,"users":0.17485380116959065},{"id":7,"name":"Tecnológico","percentage-users":4.97,"users":0.13508771929824562},...]}" />

--------


### app/scripts/directives/piechart.js<a name="directives_piechart"></a>

piechart directive

Attributes:

* **piechart-id** {String} id of the chart
* **piechart-title** {String} title text of the chart
* **piechart-description** {String} description text of the chart
* **piechart-cumul** {Number} cumulative value to display
* **piechart-data** {Array} data array
* **piechart-value-field** {String} name of the field to use as value. Default: `value`
* **piechart-id-field** {String} name of the field to use as unique id. Default: `id`
* **piechart-label-field** {String} name of the field to use as label. Default `name`
* **piechart-is-percentage** {Boolean} True if data is already provided as percentage

Example:

    <piechart piechart-id="mipiechart" piechart-data="[{"id":2,"name":"Social","percentage-users":7.06,"users":0.19181286549707602},{"id":11,"name":"Cultural","percentage-users":6.43,"users":0.17485380116959065},{"id":7,"name":"Tecnológico","percentage-users":4.97,"users":0.13508771929824562},...]" />

--------


### app/scripts/directives/ranking.js<a name="directives_ranking"></a>

ranking directive

Attributes:

* **ranking-id** {String} id of the chart
* **ranking-title** {String} title text of the chart
* **ranking-description** {String} description text of the chart
* **ranking-data** {Array} data array
* **ranking-name-field** {String} name of the field to use as label. Default: `name`
* **ranking-value-field** {String} name of the field to use as Y value. Default: `value`
* **ranking-photo-field** {String} name of the field to use as unique id. Default: `photo`
* **ranking-url-field** {String} name of the field to use as unique id. Default: `null`
* **ranking-unit** {String} units of the data
* **ranking-display-photo** {Boolean} True if photo should be displayed
* **ranking-show-value** {Boolean} True if value should be displayed

Example:

    <ranking ranking-id="miRanking" ranking-name-field="name" ranking-value-field="amount" ranking-url-field="project-url" ranking-display-photo="true" ranking-photo-field="image-url" ranking-show-value="false" ranking-data="[{"amount":20205,"date-published":"Wed, 07 Jan 2015 23:00:00 GMT","description-short":"La Invisible es un Centro Social Ciudadano de Málaga. Necesitamos tu aporte para obras de seguridad y seguir construyendo para la ciudadanía.","image-url":"https://goteo.org/img/big/5365144000-56025b1ac2-b.jpg","name":"¡Apoya A La Casa Invisible!","project":"apoya-a-la-casa-invisible","project-url":"https://goteo.org/project/apoya-a-la-casa-invisible","video-url":"https://www.youtube.com/watch?v=iv6kZydVKUw"}]"

--------


### app/scripts/services/apiService.js<a name="services_apiService"></a>

--------


### app/scripts/services/goteoApi.js<a name="services_goteoApi"></a>

Angular service to interact with Goteo's API.

##### getData(type, locale, year, category)

Data request generic function.

###### Params:

* **String** *type* type of data to retrieve. Valid types are: `money`, `projects`, `community`, `rewards`, `licenses` and `summary`.
* **String** *locale* language of the API response
* **Number** *year* year we want to retrieve the data for
* **Number** *category* category we want to retrieve the data for

###### Return:

* **Object** result of the request to the API

##### getMoney(params)

Request to the `/digests/reports/money` endpoint.

###### Params:

* **Object** *params* API parameters

###### Return:

* **Object** API response

##### getProjects(params)

Request to the `/digests/reports/projects` endpoint.

###### Params:

* **Object** *params* API parameters

###### Return:

* **Object** API response

##### getCommunity(params)

Request to the `/digests/reports/community` endpoint.

###### Params:

* **Object** *params* API parameters

###### Return:

* **P** response

##### getRewards(params)

Request to the `/digests/reports/rewards` endpoint.

###### Params:

* **Object** *params* API parameters

###### Return:

* **Object** API response

##### getLicenses(params)

Request to the `/digests/licenses` endpoint.

###### Params:

* **Object** *params* API parameters

###### Return:

* **Object** API response

##### getSummary(params)

Request to the `/digests/reports/summary` endpoint.

###### Params:

* **Object** *params* API parameters

###### Return:

* **Object** API response

--------


### app/scripts/viz/areachart.js<a name="viz_areachart"></a>

##### outliers.viz.AreaChart
Outliers' Area Chart component.

Usage:

Instance the object:

     ac = new outliers.viz.AreaChart()
                        .container("#miAreaChart")
                        .width(500)
                        .height(250);

Render the chart:

     var chartData = [
                     {id: 1, value: 100},
                     {id: 2, value: 5},
                     {id: 3, value: 25},
                     {id: 4, value: 57}
                   ];
     ac.render(chartData, "value", "id", "id")

##### AreaChart

Area Chart object

###### Return:

* **Object** the area chart object.

##### render(data, xField, yField, idField, textField)

Renders the bar chart with the provided data.

###### Params:

* **Array** *data* THE DATA (mandatory)
* **String** *xField* name of the field where the X value is.
* **String** *yField* name of the field where the Y value is.
* **String** *idField* name of the field where the ID of every datum is.
* **String** *textField* name of the field where the text to be displayed on the label is.

##### resize(newWidth, newHeight, data, valueField, idField, textField)

Resizes all the chart elements according to the new width provided.

###### Params:

* **Number** *newWidth* new width of the chart.
* **Number** *newHeight* new height of the chart.
* **Array** *data* THE DATA (mandatory)
* **String** *valueField* name of the field where the value to be displayed is.
* **String** *idField* name of the field where the ID of every datum is.
* **String** *textField* name of the field where the text to be displayed on the label is.

##### container(_)

If x is provided, sets the selector of the container where the area chart will
be rendered. If not returns its current value.

###### Params:

* **String** *_* selector of the container where the chart will be rendered.

###### Return:

* **Object** the modified area chart object

##### width(_)

If x is provided, sets the width of the area chart to it. If not
returns its current value..

###### Params:

* **Number** *_* width of the pie chart.

###### Return:

* **Object** the modified area chart object

##### height(_)

If x is provided, sets the height of the area chart to it. If not
returns its current value..

###### Params:

* **Number** *_* width of the pie chart.

###### Return:

* **Object** the modified area chart object

##### transitionDuration(x:)

If x is provided, sets the transition duration of the area chart to it. If not
returns its current value.

###### Params:

* **Number** *x:* number of milliseconds a transition must take.

###### Return:

* **Object** the modified area chart object

##### timeAxis(_)

If x is provided, sets the condition to draw the X axis as a time scale to it. If not
returns its current value.

###### Params:

* **Boolean** *_* set X axis as a time axis.

###### Return:

* **Object** the modified area chart object

##### dotRadius(_)

If x is provided, sets the dot radius to it. If not
returns its current value.

###### Params:

* **Number** *_* dot radius.

###### Return:

* **Object** the modified area chart object

##### axisLabelFormat(_)

If x is provided, sets the axis label format to it. If not
returns its current value.

###### Params:

* **Function** *_* axis label format.

###### Return:

* **Object** the modified area chart object

##### tooltipFormat(_)

If x is provided, sets the tooltip format to it. If not
returns its current value.

###### Params:

* **Function** *_* tooltip format.

###### Return:

* **Object** the modified area chart object

##### isYear(_)

If x is provided, sets the condition indicating the data to display are years
instead of months to it. If not returns its current value.

###### Params:

* **Boolean** *_* True if the data to display are years.

###### Return:

* **Object** the modified area chart object

--------


### app/scripts/viz/barchart.js<a name="viz_barchart"></a>

##### outliers.viz.BarChart
Outliers' Bar Chart component.

Usage:

Instance the object:

     bc = new outliers.viz.BarChart()
                        .container("#miAreaChart")
                        .width(500)
                        .height(250);

Render the chart:

     var chartData = [
                     {id: 1, value: 100},
                     {id: 2, value: 5},
                     {id: 3, value: 25},
                     {id: 4, value: 57}
                   ];
     bc.render(chartData, "value", "id", "id")

##### BarChart

Bar Chart object.

###### Return:

* **Object** the bar chart object.

##### render(data, valueField, idField, textField)

Renders the bar chart with the provided data.

###### Params:

* **Array** *data* THE DATA (mandatory)
* **String** *valueField* name of the field where the value to be displayed is.
* **String** *idField* name of the field where the ID of every datum is.
* **String** *textField* name of the field where the text to be displayed on the label is.

##### resize(newWidth, newHeight, data, valueField, idField, textField)

Resizes all the chart elements according to the new width provided.

###### Params:

* **Number** *newWidth* new width of the chart.
* **Number** *newHeight* new height of the chart.
* **Array** *data* THE DATA (mandatory)
* **String** *valueField* name of the field where the value to be displayed is.
* **String** *idField* name of the field where the ID of every datum is.
* **String** *textField* name of the field where the text to be displayed on the label is.

##### container(_)

If x is provided, sets the selector of the container where the bar chart will
be rendered. If not returns its current value.

###### Params:

* **String** *_* selector of the container where the chart will be rendered.

###### Return:

* **Object** the modified bar chart object

##### width(_)

If x is provided, sets the width of the bar chart to it. If not
returns its current value..

###### Params:

* **Number** *_* width of the pie chart.

###### Return:

* **Object** the modified bar chart object

##### height(_)

If x is provided, sets the height of the bar chart to it. If not
returns its current value..

###### Params:

* **Number** *_* width of the pie chart.

###### Return:

* **Object** the modified bar chart object

##### transitionDuration(_)

If x is provided, sets the transition duration of the bar chart to it. If not
returns its current value.

###### Params:

* **Number** *_* number of milliseconds a transition must take.

###### Return:

* **Object** the modified bar chart object

##### roundBands(_)

If x is provided, sets the padding of the columns in the bar chart to it. If not
returns its current value.

###### Params:

* **Number** *_* number of milliseconds a transition must take.

###### Return:

* **Object** the modified bar chart object

##### labelPadding(_)

If x is provided, sets the labels padding of the bar chart to it. If not
returns its current value.

###### Params:

* **Number** *_* number of milliseconds a transition must take.

###### Return:

* **Object** the modified bar chart object

##### cornerRadius(_)

If x is provided, sets the corner radius of the bars of the pie chart to it. If not
returns its current value.

###### Params:

* **Number** *_* number of milliseconds a transition must take

###### Return:

* **Object** the modified bar chart object

##### formatNumbers(_)

If x is provided, sets the function to format the numbers on the mouseover tooltip. If not
returns its current value.

###### Params:

* **Function** *_* function to format the numbers on the mouseover tooltip.

###### Return:

* **Object** the modified bar chart object

##### formatLabels(_)

If x is provided, sets the function to format the labels to it. If not
returns its current value.

###### Params:

* **Function** *_* function to format the labels.

###### Return:

* **Object** the modified bar chart object

--------


### app/scripts/viz/piechart.js<a name="viz_piechart"></a>

##### outliers.viz.PieChart
Outliers' Pie Chart component.

Usage:

Instance the object:

     pc = new outliers.viz.PieChart()
                        .container("#miPieChart")
                        .side(500)
                        .transitionDuration(200);

Render the chart:

     var chartData = [
                     {id: 1, label: "Elem 1", fraction: 0.25},
                     {id: 2, label: "Elem 2", fraction: 0.10},
                     {id: 3, label: "Elem 3", fraction: 0.15},
                     {id: 4, label: "Elem 4", fraction: 0.5}
                   ];
     pc.render(chartData, "fraction", "id", "label")

##### PieChart

Pie chart object

###### Return:

* **Object** the pie chart object.

##### render(newData, valueField, idField, textField)

Renders the pie chart with the provided data.

###### Params:

* **Array** *newData* THE DATA (mandatory)
* **String** *valueField* name of the field where the value to be displayed is.
* **String** *idField* name of the field where the ID of every datum is.
* **String** *textField* name of the field where the text to be displayed on the label is.

##### resize(newSide, data, valueField, idField, textField)

Resizes all the chart elements according to the new side provided.

###### Params:

* **Number** *newSide* new width of the chart.
* **Array** *data* THE DATA (mandatory)
* **String** *valueField* name of the field where the value to be displayed is.
* **String** *idField* name of the field where the ID of every datum is.
* **String** *textField* name of the field where the text to be displayed on the label is.

##### container(x)

If x is provided, sets the selector of the container where the pie chart will
be rendered. If not returns its current value.

###### Params:

* **String** *x* selector of the container where the chart will be rendered.

###### Return:

* **Object** the modified pie chart

##### side(_)

If x is provided, sets the width and height of the pie chart to it. If not
returns its current value.

Radius will be calculated taking into consideration both the provided side and the
defined margins.

###### Params:

* **Number** *_* width of the pie chart.

###### Return:

* **Object** the modified pie chart

##### margin(_)

If x is provided, sets the margin object of the pie chart to it. If not
returns its current value.

The expected object must have the following fields: top, bottom, left and right.

###### Params:

* **Object** *_* margins of the pie chart.

###### Return:

* **Object** the modified pie chart

##### outerRadius(_)

If x is provided, sets the outer radius of the pie chart to it. If not
returns its current value.

###### Params:

* **Number** *_* size of the outer radius of the pie chart.

###### Return:

* **Object** the modified pie chart

##### innerRadius(_)

If x is provided, sets the inner radius of the pie chart to it. If not
returns its current value.

###### Params:

* **Number** *_* size of the inner radius of the pie chart.

###### Return:

* **Object** the modified pie chart

##### transitionDuration(_)

If x is provided, sets the transition duration of the pie chart to it. If not
returns its current value.

###### Params:

* **Number** *_* number of milliseconds a transition must take.

###### Return:

* **Object** the modified pie chart

##### arcPadding(_)

If x is provided, sets the arc padding of the pie chart to it. If not
returns its current value.

###### Params:

* **Number** *_* padding between arcs.

###### Return:

* **Object** the modified pie chart

##### isPercentage(_)

If x is provided, sets the condition to consider data as percentages to it. If not
returns its current value.

###### Params:

* **Boolean** *_* data should be considered as percentage?

###### Return:

* **Object** the modified pie chart

##### format(_)

If x is provided, sets the function to format numbers to it. If not
returns its current value.

###### Params:

* **Function** *_* function to format numbers

###### Return:

* **Object** the modified pie chart

--------


### app/scripts/viz/utils.js<a name="viz_utils"></a>

Auxiliary functions and methods.

##### pad(size)

Function to add zeros to the left of a number.

###### Params:

* **Number** *size* maximum number of zeros to display on the left

###### Return:

* **string**

##### roundedRect(x, y, w, h, r, tl, tr, bl, br)

Function to generate the SVG path `d` attribute content to draw a rounded rectangle.

###### Params:

* **Number** *x* X coordinate
* **Number** *y* Y coordinate
* **Number** *w* bar width
* **Number** *h* bar height
* **Number** *r* corner radius
* **Boolean** *tl* top-left corner should be rounded?
* **Boolean** *tr* top-right corner should be rounded?
* **Boolean** *bl* bottom-left corner should be rounded?
* **Boolean** *br* bottom-right corner should be rounded?

###### Return:

* **string** the value to insert in the `d` attribute of the path element

##### stringCleaner(_)

Removes from a string rare symbols.

###### Params:

* **String** *_* a string to be cleaned

###### Return:

* **String** the provided string without rare symbols

##### wrap(data, widthField)

Wraps the labels to fit in the provided width.

###### Params:

* **Array** *data* array of data elements
* **Number** *widthField* width of the field

--------
