function load() {
  var layout = {barmode: 'group', title: {
    text:'Cluster Avarages'}, hovermode: 'closest', margin: { t: 0, l: 40}};
  var clusterStats2D = getDataClusterStats2D();
  clusterStatsDiv = document.getElementById('clusterStats');
  Plotly.newPlot(clusterStatsDiv, clusterStats2D, layout, {showLink: false, showSendToCloud: false, });

  var data2D = getDataMetrics2D();
  Graph2D = document.getElementById('2dGraph');
	Plotly.plot( Graph2D, data2D, {
  margin: { t: 0, b: 0 }, title: {
    text:'2D t-SNE dimension reduction & k-means clustering'}, hovermode: 'closest' } );

  var data2D_2 = getVectorDataMetrics2D();
  Graph2DVector = document.getElementById('2dVectorGraph');
	Plotly.plot( Graph2DVector, data2D_2, {
  margin: { t: 0, b: 0 },  title: {
    text:'Star Coordinates'}, hovermode: 'closest' }, {showLink: false, showSendToCloud: false, } );
  
  Graph2D.on('plotly_click', function(data){
      var pts = '';
      var value = "";
      for(var i=0; i < 1; i++){ //data.points.length; i++){
              value += "id:" + data.points[i].pointIndex + "\n";
              value += "X:" + data.points[i].x + "\n";
              value += "Y:" + data.points[i].y + "\n";
              for(var j=0; j < allLabels.length; j++){
                value += allLabels[j] + ": " + allValues[data.points[i].pointIndex][j] + "\n";
              }
      }
      document.getElementById("detailArea").value = value;
  });

  Graph2DVector.on('plotly_click', function(data){
    var pts = '';
    var value = "";
    for(var i=0; i < 1; i++){ //data.points.length; i++){
            value += "id:" + data.points[i].pointIndex + "\n";
            value += "X:" + data.points[i].x + "\n";
            value += "Y:" + data.points[i].y + "\n";
            for(var j=0; j < allLabels.length; j++){
              value += allLabels[j] + ": " + allValues[data.points[i].pointIndex][j] + "\n";
            }
    }
    document.getElementById("detailArea").value = value;
});

// retrieve data and options
  var data3d = getDataMetrics3D();
  var layout = {margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0
    }, hovermode: 'closest'};
  var graph3d = document.getElementById('3dGraph');
  Plotly.newPlot(graph3d, data3d, layout, {showLink: false, showSendToCloud: false, });
  graph3d.on('plotly_click', function(data){
    var pts = '';
    var value = "";
    for(var i=0; i < 1; i++){ //data.points.length; i++){
            value += "id:" + data.points[i].pointNumber + "\n";
            value += "X:" + data.points[i].x + "\n";
            value += "Y:" + data.points[i].y + "\n";
            value += "Z:" + data.points[i].z + "\n";
            for(var j=0; j < allLabels.length; j++){
              value += allLabels[j] + ": " + allValues[data.points[i].pointNumber][j] + "\n";
            }
    }
    document.getElementById("detailArea").value = value;
});
}

function getDataMetrics3D() {
  
  var data3d = metricsValues3D; 

  var dataStream = [];
  col = [[37, 107, 73],
    [126, 170, 95],
    [213, 181, 83],
    [249, 126, 106],
    [210, 72, 84]];
  // read all data
  for (var row = 0; row < data3d.length; row++) {
    var cat = data3d[row][3];
    var len = dataStream.length;
    while ((len-1) < cat){
      dataStream.push({x:[], y:[], z:[], mode: 'markers',
      type: 'scatter3d',
      name: 'Cluster '+ len,
      marker: {
        size: 3,
        symbol: 'circle'
      }});
      len++;
    }
    if(cat < 5){
      dataStream[cat].marker.color = 'rgb('+col[cat][0]+','+col[cat][1]+','+col[cat][2]+')';
    }
    dataStream[cat].x.push(data3d[row][0]);
    dataStream[cat].y.push(data3d[row][1]);
    dataStream[cat].z.push(data3d[row][2]);
    
  }
  return dataStream;
}
function getDataClusterStats2D() {
  var stats = averageClusterParameters2D;
  var dataStream = [];
  var maxVals = {};
  col = [[37, 107, 73],
    [126, 170, 95],
    [213, 181, 83],
    [249, 126, 106],
    [210, 72, 84]];
  for (var cat = 0; cat < stats.length; cat++) {
    for (var i=0; i < stats[cat].length; i++){
      if(!maxVals[i] || maxVals[i] < stats[cat][i]){
        maxVals[i] = stats[cat][i];
      }
    }
  }
  for (var cat = 0; cat < stats.length; cat++) {
    var maxVal = Math.max(stats[cat]);
    
    dataStream.push({x:[], y:[],
      type: 'bar',
      name: 'Cluster '+ cat,
      marker: {}
      });
    
      for (var i=0; i < stats[cat].length; i++){
      dataStream[cat].x.push(allLabels[i]);
      dataStream[cat].y.push(stats[cat][i]/ maxVals[i]);
    }

    if(cat < 5){
      dataStream[cat].marker.color = 'rgb('+col[cat][0]+','+col[cat][1]+','+col[cat][2]+')';
    }
  }
  return dataStream;
}

function getVectorDataMetrics2D() {
  var labels = allGoals;
  var data = allValues;
  var dataStream = [];
  var angle = (2* Math.PI) / labels.length;
  var vecX = [];
  var vecY = [];
  var a = 0;
  

  
  col = [[37, 107, 73],
  [126, 170, 95],
  [213, 181, 83],
  [249, 126, 106],
  [210, 72, 84]];
  var data3d = metricsValues2D; //csv2array(csv);
  for (var row = 0; row < data3d.length; row++) {
    var cat = data3d[row][2];
    var len = dataStream.length;
    while ((len-1) < cat){
      dataStream.push({x:[], y:[], z:[], mode: 'markers',
      type: 'scatter',
      name: 'Cluster '+ len,
      marker: {
        size: 4
      }});
      len++;
    }
    if(cat < 5){
      dataStream[cat].marker.color = 'rgb('+col[cat][0]+','+col[cat][1]+','+col[cat][2]+')';
    }
  }

  dataStream.push({x:[], y:[], text:[],
    mode: 'markers',
    type: 'scatter',
    name: 'Metrics',
    marker: { size: 10 }
    });
  for (var i=0; i <  labels.length; ++i){
    a = a+angle;
    dataStream[dataStream.length-1].x.push(Math.cos(a));
    dataStream[dataStream.length-1].y.push(Math.sin(a));
    dataStream[dataStream.length-1].text.push(labels[i]);

  }
  
    var maxVals = {};
    for (var i1=0; i1 <  data.length; ++i1){
      for (var j=0; j < labels.length; j++){
        if(!maxVals[j] || maxVals[j] < data[i1][j]){
          maxVals[j] = data[i1][j];
        }
      }
    }

    for (var i2=0; i2 <  data.length; ++i2){
      var x = 0;
      var y = 0;
      var cat = data3d[i2][2];
      for (var j2=0; j2 < labels.length; j2++){
        x += (data[i2][j2] / maxVals[j2]) * dataStream[dataStream.length-1].x[j2];
        y += (data[i2][j2] / maxVals[j2]) * dataStream[dataStream.length-1].y[j2];
      }
      dataStream[cat].x.push(x);
      dataStream[cat].y.push(y);
    }
  return dataStream;
}

function getDataMetrics2D() {
  var data3d = metricsValues2D; 
  var dataStream = [];
  col = [[37, 107, 73],
    [126, 170, 95],
    [213, 181, 83],
    [249, 126, 106],
    [210, 72, 84]];
  // read all data
  for (var row = 0; row < data3d.length; row++) {
    var cat = data3d[row][2];
    var len = dataStream.length;
    while ((len-1) < cat){
      dataStream.push({x:[], y:[], z:[], mode: 'markers',
      type: 'scatter',
      name: 'Cluster '+ len,
      marker: {
        size: 3
      }});
      len++;
    }
    if(cat < 5){
      dataStream[cat].marker.color = 'rgb('+col[cat][0]+','+col[cat][1]+','+col[cat][2]+')';
    }
    dataStream[cat].x.push(data3d[row][0]);
    dataStream[cat].y.push(data3d[row][1]);
    dataStream[cat].z.push(row);
  }

  return dataStream;
}