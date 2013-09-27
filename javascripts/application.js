var topojsondata = {};

$(document).ready(function(){
    var options = {
      mapTopojson: topojsonData,
      quantitativeID: "delinquent_30_days_rate",
      toolTip: {
        delinquent_30_days_upb: "Delinquent UPB",
        delinquent_loan_count: "Delinquent Count",
        delinquent_30_days_rate: "Delinquent Rate"
      }
    }

    $("#map1").USMap(options);
    $("#map2").USMap({topojsonUrl: "http://localhost:3001/1/delinquency/demo/maps/us.json?callback=topo_json_callback", quantitativeID: "delinquent_60_days_rate"});
    $("#map3").USMap({topojsonUrl: "http://localhost:3001/1/delinquency/demo/maps/us.json?callback=topo_json_callback", quantitativeID: "performing_loan_count"});
});

function topo_json_callback(data) {
  topojsonData = data;
}
