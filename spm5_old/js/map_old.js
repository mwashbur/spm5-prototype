require([
"esri/config",
"esri/Map",
"esri/views/MapView",

"esri/layers/VectorTileLayer",
"esri/layers/FeatureLayer",

"esri/Basemap",

"esri/widgets/BasemapToggle",
"esri/widgets/BasemapGallery",
"esri/widgets/Home",
"esri/widgets/Search",
"esri/widgets/Legend",
"esri/widgets/Expand",
"esri/widgets/LayerList",
"dojo/domReady!"
],
function(
 esriConfig,
 Map,
 MapView,
 VectorTileLayer,
 FeatureLayer,
 Basemap,
 BasemapToggle,
 BasemapGallery,
 Home,
 Search,
 Legend,
 Expand,
 LayerList) {

// Create the Map with an initial basemap
var spmVectorTile = new VectorTileLayer({
  url: "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer",
  listMode: "hide"
});

var spmBasemap = new Basemap({
    baseLayers: spmVectorTile,
});

var map = new Map({
    basemap: spmBasemap,
    thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/87a5fd8e8ff84e969b0265ec5c326993/info/thumbnail/StatewidePlanningMap.png"
})

var view = new MapView({
  container: "mapViewDiv",
  map: map,
  center: [-100.341389, 31.132222],
  zoom: 6,
  spatialReference: {wkid:102100},
  constraints: {
      minZoom: 6,
      rotationEnabled: false
  }
});

// Initialize widgets
var home = new Home({
    view: view
});

var basemapToggle = new BasemapToggle({
    view: view,
    secondBasemap: "satellite"
});

var search = new Search({
    container: "searchDiv",
    view: view,
    allPlaceholder: "District or County",
    sources: [{
        featureLayer: new FeatureLayer({
        url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Districts/FeatureServer/0",
        }),
        searchFields: ["DIST_NM"],
        displayField: "DIST_NM",
        exactMatch: false,
        autoSelect: true,
        name: "District",
        outFields: ["*"],
        placeholder: "ex. Austin",
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 0,
        popupOpenOnSelect: false,
        resultSymbol:{
          type: "simple-line",
          color: "yellow",
          width: "4px",
        }
    },
    {
        featureLayer: new FeatureLayer({
        url: "http://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_Counties_Detailed/FeatureServer/0",
        }),
        searchFields: ["CNTY_NM"],
        displayField: "CNTY_NM",
        exactMatch: false,
        autoSelect: true,
        name: "County",
        outFields: ["*"],
        placeholder: "ex. Travis",
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 0,
        popupOpenOnSelect: false,
        resultSymbol:{
          type: "simple-line",
          color: "yellow",
          width: "4px",
        }
    }]
});


// Add/modify widgets in the MapView
view.ui.remove("attribution");
view.ui.move("zoom","top-right")
view.ui.add(search,"searchDiv");
view.ui.add([
  {
    component: home,
    position: "top-right",
    index: 0
  }, {
    component: basemapToggle,
    position: "bottom-right",
    index: 0
  }
]);



//
//       var countiesLayer = new FeatureLayer({
//       url: "http://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_Counties_Detailed/FeatureServer/0"
//     });
//       var citiesLayer = new FeatureLayer({
//         url: "http://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_City_Boundaries/FeatureServer/0"
//       });
//       var energyCorLayer = new FeatureLayer({
//         url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Energy_Sector_Corridors/FeatureServer/0/query?outFields=*&where=1%3D1"
//       })
//     map.add(citiesLayer);
//     map.add(countiesLayer)
//     map.add(energyCorLayer)
//
//
//     // - Create the widgets
//     var layerList = new LayerList({
//       view: view,
//       container: document.createElement("div"),
//     });
//
//     var basemapGallery = new BasemapGallery({
//     view: view,
//     container: document.createElement("div")
//     });
//
//     var searchWidget = new Search({ view: view });
//
//     var compass = new Compass({view: view});
//
//     var legend = new Legend({
//      view: view,
//      container: document.createElement("div"),
//      layerInfos: [{
//       layer: countiesLayer,
//       title: "Counties"
//       },{
//        layer: citiesLayer,
//        title: "Cities"
//       },{
//        layer: energyCorLayer,
//        title: "Energy Sector Corridors"
//       }]
//     });
//
//     var bgExpand = new Expand({
//     view: view,
//     content: basemapGallery.container,
//     expandIconClass: "esri-icon-basemap",
//     expandTooltip: "Basemap Gallery"
//     });
//
//     var lgExpand = new Expand({
//       view: view,
//       content: legend.container,
//       expandIconClass: "esri-icon-layers",
//       expandTooltip: "Legend"
//     });
//
//     var lyrListExpand = new Expand({
//     view: view,
//     content: layerList.container,
//     expandIconClass: "esri-icon-layer-list",
//     expandTooltip: "Map Overlays"
//     });
// // Add widgets to the view
//     view.ui.add(compass, "top-left");
//     view.ui.add(searchWidget, "top-right");
//     view.ui.add(legend, "bottom-left");
//     view.ui.add(lyrListExpand, "top-left");
//     view.ui.add(bgExpand, "top-right");
//     view.ui.add(lgExpand, "top-right");
//     view.ui.remove("attribution")
//     view.ui.add(layerList, {
//       position: "top-left"
//     });
});
