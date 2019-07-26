
var query = null;
function load() {
  loadCsvColoredDotsExample();
  draw();
  
  var data2D = getDataMetrics2D();
  Graph2D = document.getElementById('2dGraph');
	Plotly.plot( Graph2D, data2D, {
  margin: { t: 0 } } );
  
  Graph2D.on('plotly_click', function(data){
      var pts = '';
      console.log(data);
      var value = "";
      for(var i=0; i < data.points.length; i++){
              value += "id:" + data.points[i].pointIndex + "\n";
              value += "X:" + data.points[i].x + "\n";
              value += "Y:" + data.points[i].y + "\n";
              for(var j=0; j < allLabels.length; j++){
                value += allLabels[j] + ": " + allValues[data.points[i].pointIndex][j] + "\n";
              }
      }
      alert('Closest point clicked:\n\n'+pts);
      
      document.getElementById("detailArea").value = value;
  });
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
function getDataMetrics3D() {
  //var csv = data; //document.getElementById("csvTextarea").value;

  // parse the csv content
  var data3d = metricsValues3D; //csv2array(csv);

  var data = new vis.DataSet();

  var skipValue = false;
  //if (document.getElementById("filterLabel").value != "" && document.getElementById("legendLabel").value == "") {
  //  skipValue = true;
  //}

  // read all data
  for (var row = 0; row < data3d.length; row++) {
    
      data.add({x:parseFloat(data3d[row][0]),
        y:parseFloat(data3d[row][1]),
        z:parseFloat(data3d[row][2]),
        style:parseInt(data3d[row][3]),
        id: row
      });
  
  }

  return data;
}

function getDataMetrics2D() {
  //var csv = data; //document.getElementById("csvTextarea").value;

  // parse the csv content
  var data3d = metricsValues2D; //csv2array(csv);

  //var x = [];
  //var y = []; 
  var dataStream = [];

  // read all data
  for (var row = 0; row < data3d.length; row++) {
    var cat = data3d[row][2];
    var len = dataStream.length;
    while ((len-1) < cat){
      dataStream.push({x:[], y:[], z:[], mode: 'markers',
      type: 'scatter',
      name: 'Cluster '+ len,
      marker: {
        size: 3,
      }});
      len++;
    }
    dataStream[cat].x.push(data3d[row][0]);
    dataStream[cat].y.push(data3d[row][1]);
    dataStream[cat].z.push(row);
    //color.push(data3d[row][2]);
    

  }
  //var maxGroup = Math.max(color);
  //var c = color; //.map((val) => { return (val * 255) / maxGroup; })
  //var data = {
  //  mode: 'markers',
  //  type: 'scatter',
  //  marker: {
  //    size: 3,
      //color: c//color: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
  //  },
  //  x: x,
  //  y: y };

  return dataStream;
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
  var data = getDataMetrics3D();
  var options = getOptions();

  // Creat a graph
  var graph = new vis.Graph3d(document.getElementById('3dGraph'), data, options);
}
