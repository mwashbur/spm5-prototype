var beginScale;
require([
    "esri/config",
    "esri/core/watchUtils",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/WMTSLayer",

    // Widgets
    "esri/widgets/Home",
    "esri/widgets/Zoom",
    "esri/widgets/Search",
    "esri/widgets/Expand",
    "esri/widgets/Legend",
    "esri/widgets/ScaleBar",
    "esri/layers/FeatureLayer",
    "esri/tasks/support/Query",
    "esri/tasks/QueryTask",
    "esri/widgets/Print/TemplateOptions",
    "esri/tasks/PrintTask",
    "esri/tasks/support/PrintParameters",
    "esri/tasks/support/PrintTemplate",
    "esri/widgets/LayerList",
    "esri/layers/OpenStreetMapLayer",

    "esri/layers/VectorTileLayer",
    "esri/Basemap",

    // Dojo
    "dojo/dom",
    "dojo/domReady!"
],

    function(
        esriConfig,
        watchUtils,
        Map,
        MapView,
        WMTSLayer,
        Home,
        Zoom,
        Search,
        Expand,
        Legend,
        ScaleBar,
        FeatureLayer,
        Query,
        QueryTask,
        TemplateOptions,
        PrintTask,
        PrintParameters,
        PrintTemplate,
        LayerList,
        OpenStreetMapLayer,
        VectorTileLayer,
        Basemap,
        dom) {

    // MODAL CONTROL

    // Get the modal
    var modal = dom.byId('myModal');

    // Get the button that opens the modal
    var btn = dom.byId("about");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // CONSTRUCT MAP WITH INITIAL BASEMAP
    var spmVectorTile = new VectorTileLayer({
        url: "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer",
        id: "txdot"
    });

    var spmBasemap = new Basemap({
        baseLayers: spmVectorTile,
    });

    var map = new Map({
        basemap: spmBasemap
    });

    // VIEW
    var mapView = new MapView({
        container: "mapViewDiv", // Reference to the DOM node that will contain the view
        map: map, // References the map object created in step 3
        center: [-100.341389, 31.132222],
        zoom: 6,
        spatialReference: {wkid: 102100},
        constraints: {
            minZoom: 6,
            rotationEnabled: false
        }
    });

    // ESRI UI WIDGETS
    var home = new Home({
        view: mapView
    });
    var zoom = new Zoom({
        view: mapView
    });
    var scalebar = new ScaleBar({
        view: mapView,
        unit: "dual",
    })

    // SEARCH WIDGET
    var searchWidget = new Search({
        // UNCOMMENT TO CONSTRUCT SEARCH IN NAVBAR
        // container: "searchWidgetDiv",
        view: mapView,
        allPlaceholder: "City, County, District, Hwy, CSJ...",
        includeDefaultSources: false,
        sources: [],
    });

    // PUSH SOURCES TO SEARCH WIDGET
    searchWidget.sources.push({
        featureLayer: new FeatureLayer({
            url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_City_Boundaries/FeatureServer/0",
        }),
        searchFields: ["CITY_NM"],
        displayField: "CITY_NM",
        exactMatch: false,
        autoSelect: true,
        outFields: ["*"],
        name: "City",
        placeholder: "City",
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 0,
        popupOpenOnSelect: false,
        resultSymbol: {
            type: "simple-line",
            color: "cyan",
            width: "6px",
        }
    });

    searchWidget.sources.push({
        featureLayer: new FeatureLayer({
            url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Control_Sections/FeatureServer/0",
        }),
        searchFields: ["CTRL_SECT_LN_NBR"],
        displayField: "CTRL_SECT_LN_NBR",
        exactMatch: false,
        autoSelect: true,
        outFields: ["*"],
        name: "Control Section",
        placeholder: "001001",
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 0,
        popupOpenOnSelect: false,
        resultSymbol: {
            type: "simple-line",
            color: "cyan",
            width: "6px",
        }
    });
    searchWidget.sources.push({
        featureLayer: new FeatureLayer({
            url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Projects/FeatureServer/0",
        }),
        searchFields: ["CONTROL_SECT_JOB"],
        displayField: "CONTROL_SECT_JOB",
        exactMatch: false,
        autoSelect: true,
        outFields: ["*"],
        name: "Control Section Job (CSJ)",
        placeholder: "001001001",
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 4,
        popupOpenOnSelect: false,
        resultSymbol: {
            type: "simple-line",
            color: "cyan",
            width: "6px",
        }
    });
    searchWidget.sources.push({
        featureLayer: new FeatureLayer({
            url: "http://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_Counties_Detailed/FeatureServer/0",
        }),
        searchFields: ["CNTY_NM"],
        displayField: "CNTY_NM",
        exactMatch: false,
        autoSelect: true,
        outFields: ["*"],
        name: "County",
        placeholder: "ex. Travis",
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 0,
        popupOpenOnSelect: false,
        resultSymbol: {
            type: "simple-line",
            color: "cyan",
            width: "6px",
        }
    });
    searchWidget.sources.push({
        featureLayer: new FeatureLayer({
            url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Districts/FeatureServer/0",
        }),
        searchFields: ["DIST_NM"],
        displayField: "DIST_NM",
        exactMatch: false,
        autoSelect: true,
        outFields: ["*"],
        name: "District",
        placeholder: "District",
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 0,
        popupOpenOnSelect: false,
        resultSymbol: {
            type: "simple-line",
            color: "cyan",
            width: "6px",
        }
    });
    searchWidget.sources.push({
        featureLayer: new FeatureLayer({
            url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Roadways_Search/FeatureServer/0",
        }),
        searchFields: ["RTE_CNTY"],
        displayField: "RTE_CNTY",
        exactMatch: false,
        autoSelect: true,
        outFields: ["*"],
        name: "On-System Highway",
        placeholder: "Ex: IH0035, US0083, SH0079",
        maxResults: 12,
        maxSuggestions: 12,
        enableSuggestions: true,
        minCharacters: 0,
        popupOpenOnSelect: false,
        resultSymbol: {
            type: "simple-line",
            color: "cyan",
            width: "6px",
        }
    });
    searchWidget.sources.push({
        featureLayer: new FeatureLayer({
            url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Top_100_Congested_Roadways/FeatureServer/0",
        }),
        searchFields: ["RANK"],
        displayField: "RANK",
        exactMatch: false,
        autoSelect: true,
        outFields: ["*"],
        name: "Top 100 Rank",
        placeholder: "Enter a Rank (1-100)",
        maxResults: 12,
        maxSuggestions: 12,
        enableSuggestions: true,
        minCharacters: 0,
        popupOpenOnSelect: false,
        resultSymbol: {
            type: "simple-line",
            color: "cyan",
            width: "6px",
        }
    });
    searchWidget.sources.push({
        featureLayer: new FeatureLayer({
            url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Highway_Designations/FeatureServer/0",
        }),
        searchFields: ["MO_NBR"],
        displayField: "MO_NBR",
        exactMatch: false,
        autoSelect: true,
        name: "Minute Order Number",
        outFields: ["*"],
        placeholder: "Minute Order Number",
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 0,
        popupOpenOnSelect: false,
        resultSymbol: {
            type: "simple-line",
            color: "cyan",
            width: "6px",
        }
    });

    // SEARCH WIDGET IN THE MAP OPTION
    var expandSearch = new Expand({
        expandIconClass: "esri-icon-search",
        view: mapView,
        content: searchWidget
    });

    // ADD/MODIFY WIDGETS IN THE VIEW
    mapView.ui.remove("attribution");
    mapView.ui.empty("top-left");
    mapView.ui.add([
      {
        component: home,
        position: "top-right",
        index: 1
      }, {
        component: zoom,
        position: "top-right",
        index: 0
      }, {
        component: scalebar,
        position: "bottom-right",
        index: 0
      } , {
        component: expandSearch,
        position: "top-right",
        index: 0
      }
    ]);



    //  BASEMAPS AND CONTROLS
    var id = "txdotDiv";
    dom.byId(id).style.borderLeft = "5px solid red";

    $('#esriLightGray').click(esriLightGray);
    $('#txdotDiv').click(txdotBase);
    $('#googleDiv').click(googleBase);
    $('#streetsDiv').click(esriStreets);
    $('#osm').click(osm);


    //ESRI LIGHT GRAY
    function esriLightGray() {
        var title = map.get("basemap.baseLayers.items.0.id");
        dom.byId(id).style.borderLeft = "5px solid rgb(225, 225, 225)";
        var esriLightGray = new VectorTileLayer({
            url: "https://www.arcgis.com/sharing/rest/content/items/5dd75c1a544b46c3af01ba5736bfdfa0/resources/styles/root.json?f=pjson",
            id: "gray"
        });

        if (title == "gray") {
            console.log("already the basemap");
        }
        else {
            map.basemap.baseLayers = esriLightGray;
        }

        id = "esriLightGray";
        dom.byId(id).style.borderLeft = "5px solid red";
    };

    //TxDOT SPM BASEMAP
    function txdotBase() {
        var title = map.get("basemap.baseLayers.items.0.id");
        dom.byId(id).style.borderLeft = "5px solid rgb(225, 225, 225)";
        var spmVectorTile = new VectorTileLayer({
            url: "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer",
            id: "txdot"
        });

        if (title == "txdot") {
            console.log("already the basemap");
        }
        else {
            map.basemap.baseLayers = spmVectorTile;
        }

        id = "txdotDiv";
        dom.byId(id).style.borderLeft = "5px solid red";
    };

    // TEXAS GOOGLE IMAGERY SERVICE
    function googleBase() {
        var title = map.get("basemap.baseLayers.items.0.id");
        dom.byId(id).style.borderLeft = "5px solid rgb(225, 225, 225)";
        // Name server with CORS enabled for Google Imagery
        esriConfig.request.corsEnabledServers.push("https://txgi.tnris.org");

        // Add Google Imagery WMTS layer
        google = new WMTSLayer({
            url: "https://txgi.tnris.org/login/path/pegasus-horizon-castro-comrade/wmts",
            serviceMode: "KVP",
            id: "googles"
        });

        if (title == "googles") {
            console.log("already the basemap");
        }
        else {
            map.basemap.baseLayers = google;
        }

        id = "googleDiv";
        dom.byId(id).style.borderLeft = "5px solid red";
    };

    // ESRI STREETS
    function esriStreets() {
        var title = map.get("basemap.baseLayers.items.0.id");
        dom.byId(id).style.borderLeft = "5px solid rgb(225, 225, 225)";
        var streets = new VectorTileLayer({
            url: "https://www.arcgis.com/sharing/rest/content/items/a60a37a27cc140ddad15f919cd5a69f2/resources/styles/root.json?f=pjson",
            id: "street"
        });

        if (title == "street") {
            console.log("already the basemap");
        }
        else {
            map.basemap.baseLayers = streets;
        }

        id = "streetsDiv";
        dom.byId(id).style.borderLeft = "5px solid red";
    };

    // OSM
    function osm() {
        var title = map.get("basemap.baseLayers.items.0.id");
        dom.byId(id).style.borderLeft = "5px solid rgb(225, 225, 225)";
        osmLayer = new OpenStreetMapLayer({
            id: "osm"
        });

        if (title == "osm") {
            console.log("already the basemap");
        } else {
            map.basemap.baseLayers = osmLayer;
        }

        id = "osm";

        dom.byId(id).style.borderLeft = "5px solid red";
    };

    // CONSTRUCT POPUP TEMPLATES AND RENDERERS FOR FEATURELAYERS
    var evacTemplate = {
        title: "Evacuation Route",
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "RTE_RB_NM",
                label: "Route Roadbed Name",
                visible: true
            }, {
                fieldName: "ROUTE_TYPE",
                label: "Type",
                visible: true
            }]
        }]
    };
    var funcTemplate = {
        title: "Functional Classification",
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "RTE_NM",
                label: "Route Roadbed Name",
                visible: true
            }, {
                fieldName: "FC_DESC",
                label: "Functional Classification",
                visible: true
            }]
        }]
    };
    var conSecTemplate = {
        title: "Control Sections",
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "CTRL_SECT_NBR",
                label: "Control Section",
                visible: true
            }, {
                fieldName: "RTE_NM",
                label: "Route Name",
                visible: true
            }, {
                fieldName: "BEGIN_MPT",
                label: "Begin Mile Point",
                visible: true
            } , {
                fieldName: "END_MPT",
                label: "End Milepoint",
                visible: true
            } , {
                fieldName: "BEGIN_DFO",
                label: "Begin DFO",
                visible: true
            } , {
                fieldName: "END_DFO",
                label: "End DFO",
                visible: true
            }]
        }]
    };

    // CONSTRUCT FEATURELAYERS
    const evacRoute = new FeatureLayer({
        url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Evacuation_Routes/FeatureServer/0",
        legendEnabled: true,
        visible: false,
        popupEnabled: true,
        outFields: ["*"],
        popupTemplate: evacTemplate,
        title: "Evacuation Route"
    });
    const functionClass = new FeatureLayer({
        url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Functional_Classification/FeatureServer/0",
        definitionExpression: "RTE_PRFX = 'IH' AND RDBD_TYPE = 'KG'",
        legendEnabled: true,
        visible: false,
        popupEnabled: true,
        outFields: ["*"],
        popupTemplate: funcTemplate,
        title: "Functional Classification"
    });
    const controlSection = new FeatureLayer({
        url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Control_Sections/FeatureServer/0",
        definitionExpression: "RTE_PRFX='IH'",
        legendEnabled: true,
        visible: false,
        popupEnabled: true,
        outFields: ["CTRL_SECT_NBR","RTE_NM","BEGIN_MPT","END_MPT", "BEGIN_DFO", "END_DFO"],
        popupTemplate: conSecTemplate,
        title: "Control Sections"
    });

    // ADD FEATURELAYERS TO MAP
    map.addMany([
        evacRoute,
        functionClass,
        controlSection
    ]);

    // CONSTRUCT LEGENDS FOR FEATURELAYERS
    var legendEvacRoute = new Legend({
        container: "legendEvacRouteDiv",
        view: mapView,
        layerInfos: [{
            layer: evacRoute,
            title: " "
        }]
    });
    var legendFuncClass = new Legend({
        container: "legendFuncClassDiv",
        view: mapView,
        layerInfos: [{
            layer: functionClass,
            title: " "
        }]
    });
    var legendConSec = new Legend({
        container: "legendLowWaterDiv",
        view: mapView,
        layerInfos: [{
            layer: controlSection,
            title: " "
        }]
    });

    // TOGGLE FEATURELAYER VISIBILITY
    $('#onEvac, #offEvac').click(function() {
        if (!evacRoute.visible) {
            evacRoute.visible = true;
        }
        else {
            evacRoute.visible = false;
        }
    });
    $('#onFun, #offFun').click(function(){
        if (!functionClass.visible) {
            functionClass.visible = true;
        }
        else {
            functionClass.visible = false;
        }
    });
    $('#onLow, #offLow').click(function() {
        if (!controlSection.visible) {
            controlSection.visible = true;
        }
        else {
            controlSection.visible = false;
        }
    });

    // SET SCALE-DEPENDENT QUERIES FOR ROUTES

    // USE WATCHUTILS TO LISTEN FOR ZOOM-END
    // https://community.esri.com/thread/220324-how-to-simulate-listening-for-zoom-end-in-the-4x-framework
    watchUtils.when(mapView, "interacting", function() {
      beginScale = mapView.get('zoom');
    });

    watchUtils.when(mapView, "stationary", function() {
      const currentScale = mapView.get('zoom');
      if (currentScale !== beginScale) {
        console.log("zoom done",mapView.zoom);
        scaleDependentQueries();
      }
    });

    // NOTE THAT WEBGL MUST BE ENABLED TO AVOID THIS ERROR:
    // https://community.esri.com/thread/217436-feature-layer-definition-expression-error
    function scaleDependentQueries() {
        if (controlSection.visible) {
            if (mapView.zoom<9) {
               controlSection.definitionExpression = "RTE_PRFX='IH'";
            }
            if (mapView.zoom>8&&mapView.zoom<10) {
               controlSection.definitionExpression = "(RTE_PRFX='IH' or RTE_PRFX='US')";
            }
            if (mapView.zoom>9&&mapView.zoom<11) {
               controlSection.definitionExpression = "(RTE_PRFX='IH' or RTE_PRFX='SH' or RTE_PRFX='US' or RTE_PRFX='SL')";
            }
            if (mapView.zoom>10&&mapView.zoom<13) {
               controlSection.definitionExpression = "RTE_PRFX NOT IN ('CS', 'FC', 'CR', 'FD', 'PR')";
            }
            if (mapView.zoom>12&&mapView.zoom<15) {
               controlSection.definitionExpression = "RTE_PRFX <> 'CS'";
            }
            if (mapView.zoom>14) {
               controlSection.definitionExpression = "";
            }
        }
        if (functionClass.visible) {
            if (mapView.zoom<9) {
               functionClass.definitionExpression = "RTE_PRFX ='IH' AND RDBD_TYPE = 'KG'";
            }
            if (mapView.zoom>8&&mapView.zoom<11) {
               functionClass.definitionExpression = "(RTE_PRFX IN ('IH', 'US') OR F_SYSTEM IN (1,2,3)) AND RDBD_TYPE = 'KG'";

            }

            if (mapView.zoom>10&&mapView.zoom<13) {
               functionClass.definitionExpression = "RDBD_TYPE = 'KG'";
            }

            if (mapView.zoom>=13) {
               functionClass.definitionExpression = "";
            }
        }
    }
// ***********************PRINT MODULE BEGIN******************************* //
    // //global varibales to update district name and county name custom text
    // DistName = [];
    // CountName = [];
    // dName = "";
    // cName = "";
    // legendTitle = "Notes";
    //
    // //print task! with custom button
    // function printMap() {
    //     //the load spinner with show while this function is running
    //     // $('#loader').show();
    //     // $('#loaderOverlay').show();
    //     // dom.byId("extent").disabled = true;
    //     // dom.byId("print").disabled = true;
    //
    //
    //     //get extent of the map on the view
    //     var extentOfPrint = mapView.extent;
    //
    //     //call the query to get the county names in the extent
    //     countyQuery();
    //
    //     //the function for getting the county names in the extent
    //     function countyQuery() {
    //
    //         var queryCountyTextTask = new QueryTask({
    //             url: "http://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_Counties_Detailed/FeatureServer/0"
    //         });
    //
    //         var queryCountyText = new Query({
    //             geometry: extentOfPrint,
    //             spatialRelationship: "intersects",
    //             orderByFields: "CNTY_NM ASC",
    //             outFields: ["CNTY_NM"]
    //         });
    //
    //         //execute query THEN get the result and save the information to the global variables
    //         queryCountyTextTask.execute(queryCountyText).then(countyResult);
    //
    //         //result function
    //         function countyResult(r) {
    //
    //             //This loop will get all the county names in the extent
    //             //and save them in an array (global variable)
    //             for (var i = 0; i < r.features.length; i++) {
    //                 console.log(r.features[i].attributes.CNTY_NM);
    //                 var cnty = r.features[i].attributes.CNTY_NM;
    //                 CountName.push(cnty);
    //             }
    //
    //             console.log(CountName);
    //
    //             //This saves the array of county names into a string
    //             //this will be used in the custom text section below
    //             if (CountName.length > 4) {
    //                 cName = "Counties: Multiple";
    //             } else if (CountName.length == 1) {
    //                 cName = "County: " + CountName;
    //             } else {
    //                 cName = "Counties: " + CountName.join(', ');
    //             }
    //
    //             //after the countyQuery finishes then the district query is called
    //             districtQuery();
    //         };
    //
    //     };
    //
    //     //the function for getting the district names in the extent
    //     function districtQuery() {
    //
    //         var queryDistrictTextTask = new QueryTask({
    //             url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Districts/FeatureServer/0"
    //         });
    //
    //         var queryDistrictText = new Query({
    //             geometry: extentOfPrint,
    //             spatialRelationship: "intersects",
    //             orderByFields: "DIST_NM ASC",
    //             outFields: ["DIST_NM"]
    //         });
    //
    //         //execute query THEN get the result and save the information to the global variables
    //         queryDistrictTextTask.execute(queryDistrictText).then(result);
    //
    //         function result(r) {
    //
    //             //This loop will get all the district names in the extent
    //             //and save them in an array (global variable)
    //             for (var i = 0; i < r.features.length; i++) {
    //                 console.log(r.features[i].attributes.DIST_NM);
    //                 var dist = r.features[i].attributes.DIST_NM;
    //                 DistName.push(dist);
    //             }
    //
    //             console.log(DistName);
    //
    //             //This saves the array of district names into a string
    //             //this will be used in the custom text section below
    //             if (DistName.length > 4) {
    //                 dName = "Districts: Multiple";
    //             } else if (DistName.length == 1) {
    //                 dName = "District: " + DistName;
    //             } else {
    //                 dName = "Districts: " + DistName.join(', ');
    //             }
    //
    //
    //             //are any layers turned on?
    //             if (functionClass.visible == true || lowWater.visible == true || evacRoute.visible == true) {
    //                 legendTitle = "Selected Overlays";
    //             }
    //
    //             //after the districtQuery finishes then the print task is called
    //             pT();
    //         };
    //
    //     };
    //
    //
    //     function pT() {
    //
    //         var pt = new PrintTemplate({
    //             format: "pdf",
    //             //legendEnabled: true,
    //             layout: "PoD_Template",
    //             layoutOptions: {
    //                 legendLayer: [],
    //                 customTextElements: [{
    //                         "District Name": dName
    //                     }, //from the districtQuery above
    //                     {
    //                         "County Name": cName
    //                     }, //from the countyQuery above
    //                     {
    //                         "LegendTitle": legendTitle
    //                     }
    //                 ]
    //             }
    //
    //         });
    //
    //         var params = new PrintParameters({
    //             view: mapView,
    //             template: pt
    //         });
    //
    //         var printTask = new PrintTask({
    //             url: "https://10.146.128.199:6443/arcgis/rest/services/ExportWebMap/GPServer/Export%20Web%20Map"
    //         });
    //
    //         console.log(pt.layoutOptions);
    //
    //         //execute query THEN get the result or error
    //         printTask.execute(params).then(printResult, printError);
    //
    //         //opens new website window with map export
    //         //loaded is stopped and hidden from the view
    //         function printResult(result) {
    //             console.log(result.url);
    //             window.open(result.url, "_blank");
    //             // $('#loader').hide();
    //             // $('#loaderOverlay').hide();
    //             // dom.byId("extent").disabled = false;
    //             // dom.byId("print").disabled = false;
    //         }
    //
    //         function printError(result) {
    //             console.log(result);
    //         }
    //
    //     };
    //
    //     //resets arrays and strings for next print
    //     DistName = [];
    //     dName = "";
    //     CountName = [];
    //     cName = "";
    // };
    //
    // //print task is exectued by print button
    // dom.byId("printSingleDiv").addEventListener("click", printMap);



});
