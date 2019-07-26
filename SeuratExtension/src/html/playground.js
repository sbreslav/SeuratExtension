
var query = null;
function load() {
  loadCsvColoredDotsExample();
  draw();

  Graph2D = document.getElementById('2dGraph');
	Plotly.plot( Graph2D, [{
  mode: 'markers',
  type: 'scatter',
  marker: {
    size: 3
    //color: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
  },
	x: [1, 2, 3, 4, 5],
	y: [1, 2, 4, 8, 16] }], {
	margin: { t: 0 } } );
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
        style:parseInt(csvArray[row][3]),
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
function getOptions() {
  var options = {
    tooltip: true,
    width: "100%",
    height:    "500px",
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
    xCenter:           "50%",
    yCenter:           "50%",
    dotSizeRatio:      0.0073,
    onclick: function(point){
      console.log("OnClick", point);
      var value = "id:" + point.id + "\n";
      value += "X:" + point.x + "\n";
      value += "Y:" + point.y + "\n";
      value += "Z:" + point.z + "\n";
      for(var i=0; i < allLabels.length; i++){
        value += allLabels[i] + ": " + allValues[point.id][i] + "\n";
      }
      document.getElementById("detailArea").value = value;
      
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
  var graph = new vis.Graph3d(document.getElementById('3dGraph'), data, options);
}
