
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
  //document.getElementById("style").value = "dot-color";
  //document.getElementById("verticalRatio").value = "1.0";
  //document.getElementById("showPerspective").checked = true;

  //document.getElementById("xLabel").value = "x";
  //document.getElementById("yLabel").value = "y";
  //document.getElementById("zLabel").value = "z";
  //document.getElementById("legendLabel").value = "distance"
  //document.getElementById("filterLabel").value = "";
  

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
    
      data.add({x:parseFloat(csvArray[row][0]),
        y:parseFloat(csvArray[row][1]),
        z:parseFloat(csvArray[row][2]),
        style:parseFloat(csvArray[row][3])});
  
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
    showPerspective:   true,
    showLegend:        true,
    showShadow:        false,
    keepAspectRatio:   true,
    verticalRatio:      1.0,
    animationInterval:  1000,
    xLabel:             "x",
    yLabel:             "y",
    zLabel:             "z",
    filterLabel:        "",
    legendLabel:        "class",
    xCenter:           "55%",
    yCenter:           "45%",
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
