
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

  drawCsv();
}


/**
 * Retrieve the datatable from the entered contents of the csv text
 * @param {boolean} [skipValue] | if true, the 4th element is a filter value
 * @return {vis.DataSet}
 */
function getDataMetrics() {
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
        style:parseFloat(csvArray[row][3]),
        id: row
      });
  
  }

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
function getOptions(data) {
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
    dotSizeRatio:      0.01,
    onclick: function(point){
      var value = "id:" + point.id + "\n";
      value += "X:" + point.x + "\n";
      value += "Y:" + point.y + "\n";
      value += "Z:" + point.z + "\n";
      for(var i=0; i < allLabels.length; i++){
        value += allLabels[i] + ": " + allValues[point.id][i] + "\n";
      }
      document.getElementById("detailArea").value = value;
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
  var data = getDataMetrics();
  var options = getOptions();

  // Creat a graph
  var graph = new vis.Graph3d(document.getElementById('graph'), data, options);
}
