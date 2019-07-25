
var query = null;
function load() {
  loadCsvColoredDotsExample();
  draw();
}



function round(value, decimals) {
  return parseFloat(value.toFixed(decimals));
}

function loadCsvColoredDotsExample() {
  var csv = "";


  // also adjust some settings
  document.getElementById("style").value = "dot-color";
  document.getElementById("verticalRatio").value = "1.0";
  document.getElementById("showPerspective").checked = true;

  document.getElementById("xLabel").value = "x";
  document.getElementById("yLabel").value = "y";
  document.getElementById("zLabel").value = "z";
  document.getElementById("legendLabel").value = "distance"
  document.getElementById("filterLabel").value = "";
  

  drawCsv();
}


/**
 * Retrieve the datatable from the entered contents of the csv text
 * @param {boolean} [skipValue] | if true, the 4th element is a filter value
 * @return {vis.DataSet}
 */
function getDataCsv() {
  //var csv = data; //document.getElementById("csvTextarea").value;

  // parse the csv content
  var csvArray = metricsValues; //csv2array(csv);

  var data = new vis.DataSet();

  var skipValue = false;
  //if (document.getElementById("filterLabel").value != "" && document.getElementById("legendLabel").value == "") {
  //  skipValue = true;
  //}

  // read all data
  for (var row = 0; row < csvArray.length; row++) {
    if (csvArray[row].length == 4 && skipValue == false) {
      data.add({x:parseFloat(csvArray[row][0]),
        y:parseFloat(csvArray[row][1]),
        z:parseFloat(csvArray[row][2]),
        style:parseFloat(csvArray[row][3])});
    }
    else if (csvArray[row].length == 4 && skipValue == true) {
      data.add({x:parseFloat(csvArray[row][0]),
        y:parseFloat(csvArray[row][1]),
        z:parseFloat(csvArray[row][2]),
        filter:parseFloat(csvArray[row][3])});
    }
    else if (csvArray[row].length == 5) {
      data.add({x:parseFloat(csvArray[row][0]),
        y:parseFloat(csvArray[row][1]),
        z:parseFloat(csvArray[row][2]),
        style:parseFloat(csvArray[row][3]),
        filter:parseFloat(csvArray[row][4])});
    }
    else {
      data.add({x:parseFloat(csvArray[row][0]),
        y:parseFloat(csvArray[row][1]),
        z:parseFloat(csvArray[row][2]),
        style:parseFloat(csvArray[row][2])});
    }
  }

  return data;
}

/**
 * remove leading and trailing spaces
 */
function trim(text) {
  while (text.length && text.charAt(0) == ' ')
    text = text.substr(1);

  while (text.length && text.charAt(text.length-1) == ' ')
    text = text.substr(0, text.length-1);

  return text;
}

/**
 * Retrieve the datatable from the entered contents of the javascript text
 * @return {vis.DataSet}
 */
function getDataJson() {
  var json = document.getElementById("jsonTextarea").value;
  var data = new google.visualization.DataTable(json);

  return data;
}


/**
 * Retrieve the datatable from the entered contents of the javascript text
 * @return {vis.DataSet}
 */
function getDataJavascript() {
  var js = document.getElementById("javascriptTextarea").value;

  eval(js);

  return data;
}


/**
 * Retrieve the datatable from the entered contents of the datasource text
 * @return {vis.DataSet}
 */
function getDataDatasource() {
}

/**
 * Retrieve a JSON object with all options
 */
function getOptions() {
  var options = {
    tooltip: true,
    width: "100%",
    height:    "100%",
    style:    "dot-color",
    showAnimationControls: false,
    showGrid:          true,
    showXAxis:         true,
    showYAxis:         true,
    showZAxis:         true,
    showPerspective:   (document.getElementById("showPerspective").checked != false),
    showLegend:        (document.getElementById("showLegend").checked != false),
    showShadow:        (document.getElementById("showShadow").checked != false),
    keepAspectRatio:   (document.getElementById("keepAspectRatio").checked != false),
    verticalRatio:      Number(document.getElementById("verticalRatio").value) || undefined,
    animationInterval:  Number(document.getElementById("animationInterval").value) || undefined,
    xLabel:             document.getElementById("xLabel").value,
    yLabel:             document.getElementById("yLabel").value,
    zLabel:             document.getElementById("zLabel").value,
    filterLabel:        document.getElementById("filterLabel").value,
    legendLabel:        document.getElementById("legendLabel").value,
    animationPreload:  (document.getElementById("animationPreload").checked != false),
    animationAutoStart:(document.getElementById("animationAutoStart").checked != false),

    xCenter:           document.getElementById("xCenter").value,
    yCenter:           document.getElementById("yCenter").value,

    xMin:              Number(document.getElementById("xMin").value) || undefined,
    xMax:              Number(document.getElementById("xMax").value) || undefined,
    xStep:             Number(document.getElementById("xStep").value) || undefined,
    yMin:              Number(document.getElementById("yMin").value) || undefined,
    yMax:              Number(document.getElementById("yMax").value) || undefined,
    yStep:             Number(document.getElementById("yStep").value) || undefined,
    zMin:              Number(document.getElementById("zMin").value) || undefined,
    zMax:              Number(document.getElementById("zMax").value) || undefined,
    zStep:             Number(document.getElementById("zStep").value) || undefined,

    valueMin:          Number(document.getElementById("valueMin").value) || undefined,
    valueMax:          Number(document.getElementById("valueMax").value) || undefined,

    xBarWidth:         Number(document.getElementById("xBarWidth").value) || undefined,
    yBarWidth:         Number(document.getElementById("yBarWidth").value) || undefined,
    onclick: function(point){
      console.log("OnClick", point);
    }
  };

  return options;
}

/**
 * Redraw the graph with the entered data and options
 */
function draw() {
  return drawCsv();
}


function drawCsv() {
  // retrieve data and options
  var data = getDataCsv();
  var options = getOptions();

  // Creat a graph
  var graph = new vis.Graph3d(document.getElementById('graph'), data, options);
}


function drawJavascript() {
  // retrieve data and options
  var data = getDataJavascript();
  var options = getOptions();

  // Creat a graph
  var graph = new vis.Graph3d(document.getElementById('graph'), data, options);
}


function drawGooglespreadsheet() {
  // Instantiate our graph object.
  drawGraph = function(response) {
    document.getElementById("draw").disabled = "";

    if (response.isError()) {
      error = 'Error: ' + response.getMessage();
      document.getElementById('graph').innerHTML =
          "<span style='color: red; font-weight: bold;'>" + error + "</span>"; ;
    }

    // retrieve the data from the query response
    data = response.getDataTable();

    // specify options
    options = getOptions();

    // Instantiate our graph object.
    var graph = new vis.Graph3d(document.getElementById('graph'), data, options);
  }

  url = document.getElementById("googlespreadsheetText").value;
  document.getElementById("draw").disabled = "disabled";

  // send the request
  query && query.abort();
  query = new google.visualization.Query(url);
  query.send(drawGraph);
}


function drawDatasource() {
  // Instantiate our graph object.
  drawGraph = function(response) {
    document.getElementById("draw").disabled = "";

    if (response.isError()) {
      error = 'Error: ' + response.getMessage();
      document.getElementById('graph').innerHTML =
          "<span style='color: red; font-weight: bold;'>" + error + "</span>"; ;
    }

    // retrieve the data from the query response
    data = response.getDataTable();

    // specify options
    options = getOptions();

    // Instantiate our graph object.
    var graph = new vis.Graph3d(document.getElementById('graph'), data, options);
  };

  url = document.getElementById("datasourceText").value;
  document.getElementById("draw").disabled = "disabled";

  // if the entered url is a google spreadsheet url, replace the part
  // "/ccc?" with "/tq?" in order to retrieve a neat data query result
  if (url.indexOf("/ccc?")) {
    url.replace("/ccc?", "/tq?");
  }

  // send the request
  query && query.abort();
  query = new google.visualization.Query(url);
  query.send(drawGraph);
}
