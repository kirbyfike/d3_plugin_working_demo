var USMap = (function($) {
    var public = {};
    var map_topojson = {};
    var LEGEND_SHAPE_WIDTH = 10;
    var LEGEND_SHAPE_HEIGHT = 10;
    var SVG_WIDTH =  700;
    var SVG_HEIGHT = 400;
    var MAP_SCALE = 700;
    var MAP_WIDTH = 900;
    var MAP_HEIGHT = 500
    var SVG_OFFSET = -150;
    var QUANTILE_RANGE = 4;

    // public methods
    public.initialize = function(options) {
        var userTopojson = retrieveTopojson(options);

        if (isEmpty(userTopojson)) return;

        clearMap(options.domElement);
        var stateData = topojson.feature(userTopojson, userTopojson.objects.us_states).features;
        var colorQuantiles = generateColorQuantiles(stateData, options.quantitativeID);
        drawMap(options.domElement, options.quantitativeID, stateData, colorQuantiles, options.toolTip)
    }
    
    function retrieveTopojson(options) {
        var data = {};

        if (options.mapTopojson && !isEmpty(options.mapTopojson)) {
            data = options.mapTopojson;
        } else if(options.topojsonUrl && options.topojsonUrl != "") {
            retrieveTopojsonFromServer(options);
        } else {
            alert("Error! Both the Topojson data and server url were empty.");
        }

        return data;
    }

    function isEmpty(ob){
       for(var i in ob){ return false; }
       return true;
    }

    function retrieveTopojsonFromServer(options) {
        var options = options;

        setTopojsonUrlToDom(options.topojsonUrl);

        $.ajax({
            url: options.topojsonUrl,
            type: "post",
            dataType: "jsonp",
            success: function(serverData) {
              options["mapTopojson"] = serverData;
              options["topojsonUrl"] = "";
              public.initialize(options);
            }
        })
    }

    function setTopojsonUrlToDom(url) {
        var appendUrl = "<script src='" + url + "' type='text/javascript'></script>";
        $("body").append(appendUrl);
    }

    function clearMap(domElement) {
        $(domElement.selector).find("svg").remove();
    }

    function drawMap(domElement, quantitativeID, stateData, colorQuantiles, toolTipOptions) {
        $(domElement.selector).append("<div class='hidden tooltip'><span></span></div>");

        var projection = d3.geo.albersUsa().scale(MAP_SCALE);
        var path = d3.geo.path().projection(projection);
        var svg = d3.select(domElement.selector).append("svg")
            .attr("width", SVG_WIDTH)
            .attr("height", SVG_HEIGHT);

        var g = svg.append("g")
            .attr("class", "states")
            .attr("transform", "translate(-230,-60)")
            .selectAll("path")
            .data(stateData)
            .enter().append("path")
            .attr("class", function (d) {
                if (d.properties[quantitativeID] == 0) {
                    return "q4"
                } else {
                    return colorQuantiles((d.properties[quantitativeID]));
                }
            })
            .on("mouseover", function(d) {
                var $tooltip = $(this).closest("svg").siblings(".tooltip");
                var position = $(this).position();
                
                if (toolTipOptions && !isEmpty(toolTipOptions)) {
                    showToolTip(position.left, position.top, $tooltip, d, toolTipOptions);
                }
            })
            .on("mouseout", function(d) {
                var $tooltip = $(this).closest("svg").siblings(".tooltip");
                hideToolTip($tooltip);
            })
            .attr("d", path)
    }

    function hideToolTip($tooltip) {
        $(".tooltip").hide();
    }

    function showToolTip(x, y, $tooltip, d, toolTipOptions) {
        $tooltip.html(toolTipHtml(d, toolTipOptions));
        $tooltip.css({left: x, top: y + 100}).html(toolTipHtml(d, toolTipOptions))
        
        $tooltip.show();
    }

    function toolTipHtml(d, toolTipOptions) {
        var toolTipHtml = "<b>" + d.properties["state_name"] + "</b> (" + d.properties["state_code"] + ")<br><br>";

        for (key in toolTipOptions) {
          toolTipHtml += "<b>" + toolTipOptions[key] + "</b> " + d.properties[key] + "<br>"
        }

        return toolTipHtml;
    }

    function drawLegend(){

    }

    function generateColorQuantiles(stateData, quantitativeID) {
        var domain_values = stateData.map(function(d) {
            return d.properties[quantitativeID];
        });

        return d3.scale.quantile().domain(domain_values).range(d3.range(QUANTILE_RANGE).map(function(i) { return "q" + i; }));
    }

    return public;
}(jQuery));
