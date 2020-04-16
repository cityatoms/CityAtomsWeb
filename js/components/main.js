   // Popup overlay with popupClass=anim
   var popup = new ol.Overlay.Popup ({
    popupClass: "default anim", //"tooltips", "warning" "black" "default", "tips", "shadow",
    closeBox: true,
    onclose: function(){ console.log("You close the box"); },
    positioning: 'auto',
    autoPan: true,
    autoPanAnimation: { duration: 100 }
  });
 
 // The map
 var map = new ol.Map({
    target: 'map',
    view: new ol.View({
        // projection:'EPSG:4326',
      zoom: 4,
      center: [72.88261,19.07283]
    }),
    layers: [ new ol.layer.Tile({ source: new ol.source.OSM() })],
    overlays: [popup]
  });
//change map color
// map.on('postcompose',function(e){
//     document.querySelector('canvas').style.filter="invert(90%)";
//   });
  var select  = new ol.interaction.Select();
  map.addInteraction(select);
  select.on('select', function(e){
    if (e.selected.length){
      var feature = e.element;
      var content = "";  
      if (e.selected[0].getGeometry().getType() == 'Point'){
        content = '<b>City Name : </b> ' + e.selected[0].getProperties().name + ' <br> <b> Country : </b> ' + e.selected[0].getProperties().country
        popup.show(e.selected[0].getGeometry().getFlatCoordinates()        , content); 
      } else {
      var f = e.selected[0].get('features');
      if (f){
        content = '<b>Total Features : </b> ' + e.selected[0].get('features').length

      } 
      else {
        content = '<b>No Features in this bin </b> ' 
           
         }
        //  var ext = e.selected[0].getGeometry().getExtent()
        //  var center = [ext[2]-ext[0], ext[3]-ext[1]]
         popup.show(e.selected[0].getGeometry().getFirstCoordinate()         , content); 

        }

    } else {
      popup.hide(); 

    }
    
  });
  
  // Creat
 

  function addFeatures(nb){
    for (i=0;i<nb;i++){
      var lon = Math.random() * (180 + 180) -180;
      var lat =  Math.random() * (90 + 90) -90
      var point = new ol.geom.Point(
                  ol.proj.transform([ lon,lat], 'EPSG:4326', 'EPSG:3857')
              );
              var pointFeature = new ol.Feature(point);
              pointFeature.setProperties({'id':nb})
      
              source.addFeature(pointFeature)
    }
  }


  $.getJSON('res.json', function(data){
    //   console.log(data)
      for (i=0;i<data.length;i++){
      var point = new ol.geom.Point(
            ol.proj.transform([data[i].lon,data[i].lat], 'EPSG:4326', 'EPSG:3857')
        );
        var pointFeature = new ol.Feature(point);
        // pointFeature.setProperties({'name':data[i].name, 'country':data[i].country})

        source.addFeature(pointFeature)

    }
  })
  // Vector source
  var source = new ol.source.Vector();

  var layerSource = new ol.layer.Vector({ source: source,strategy: ol.loadingstrategy.bbox, visible:false })
  map.addLayer(layerSource);
  // addFeatures(200);
  var hexbin, layer, binSize;
  var style = $("#style");
  var min, max, maxi;
  var minRadius = 1;
  var styleFn = function(f,res){
    switch (style.val()){
      // Display a point with a radius 
      // depending on the number of objects in the aggregate.
      case 'point':{
        var radius = Math.round(binSize/res +0.5) * Math.min(1,f.get('features').length/max);
        if (radius < minRadius) radius = minRadius;
        return	[ new ol.style.Style({
          image: new ol.style.RegularShape({
            points: 6,
              radius: radius,
              fill: new ol.style.Fill({ color: [0,0,255] }),
              rotateWithView: true
            }),
            geometry: new ol.geom.Point(f.get('center'))
          })
          //, new ol.style.Style({ fill: new ol.style.Fill({color: [0,0,255,.1] }) })
        ];
      }
      // Display the polygon with a gradient value (opacity) 
      // depending on the number of objects in the aggregate.
      case 'gradient': {
        var opacity = Math.min(1,f.get('features').length/max);
        return [ new ol.style.Style({ fill: new ol.style.Fill({ color: [0,0,255,opacity] }) }) ];
      }
      // Display the polygon with a color
      // depending on the number of objects in the aggregate.
      case 'color':
      default: {
        var color;
        if (f.get('features').length > max) color = [136, 0, 0, 1];
        else if (f.get('features').length > min) color = [255, 165, 0, 1];
        else color = [0, 136, 0, 1];
        return [ new ol.style.Style({ fill: new ol.style.Fill({  color: color }) }) ];
      }
    }
  };
  
  // Create HexBin and calculate min/max
  function reset(size) {
   
    if (layer) map.removeLayer(layer);
    binSize = size;
    var features;
    hexbin = new ol.source.HexBin({
      source: source,		// source of the bin
      size: size			// hexagon size (in map unit)
    });
    layer = new ol.layer.Vector({ 
      source: hexbin, 
      opacity:0.5, 
      style: styleFn, 
      renderMode: 'image'
    });
    features = hexbin.getFeatures();
    // Calculate min/ max value
    min = Infinity;
    max = 0;
    for (var i=0, f; f=features[i]; i++)
    {	var n = f.get('features').length;
      if (n<min) min = n;
      if (n>max) max = n;
    }
    var dl = (max-min);
    maxi = max;
    min = Math.max(1,Math.round(dl/4));
    max = Math.round(max - dl/3);
    $(".min").text(min);
    $(".max").text(max);
    if (max == Infinity){
      // document.getElementById('legend').style.display = 'none'

    } else {
      // document.getElementById('legend').style.display = 'block'

    }

    // Add layer
    map.addLayer(layer);
  }
  var currentsize = 85000
map.once('postrender', function(event) {
  reset(currentsize)
});



  var currZoom = map.getView().getZoom();
  map.on('moveend', function(e) {
    // if (document.getElementById('customSwitch1').checked){
    var newZoom = map.getView().getZoom().toFixed(1);
    for (i=0;i<zoomtosize.length;i++){
      if (zoomtosize[i].zoomstart < newZoom && newZoom < zoomtosize[i].zoomennd){
        if (zoomtosize[i].size === 0){
          layer.setVisible(false)
          layerSource.setVisible(true)

        }else{
          layer.setVisible(true)
          layerSource.setVisible(false)
        if (currentsize != zoomtosize[i].size){
          reset(zoomtosize[i].size)
          currentsize = zoomtosize[i].size
        }
      }
    }
    }
  // }
  });

  var zoomtosize = [
    {
      "zoomstart" : 1,
      "zoomennd" : 3.1,
      "size": 300000
    },
    {
      "zoomstart" : 3.2,
      "zoomennd" : 5,
      "size": 85000
    },
    {
      "zoomstart" : 5.1,
      "zoomennd" : 6,
      "size": 40000
    },
    {
      "zoomstart" : 6.1,
      "zoomennd" : 6.4,
      "size": 29000
    },
    {
      "zoomstart" : 6.5,
      "zoomennd" : 7.5,
      "size": 10000
    },
    {
      "zoomstart" : 7.6,
      "zoomennd" : 9,
      "size": 5000
    },
    {
      "zoomstart" : 9.1,
      "zoomennd" : 10,
      "size": 3000
    },
    {
      "zoomstart" : 10.1,
      "zoomennd" : 19,
      "size": 0
    }
  ]


  //toggle layer 
  function togglelayers(val) {
   
      layer.setVisible(val)
      layerSource.setVisible(!val)
    
  }