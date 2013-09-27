(function ( $ ) {
    $.fn.USMap = function(options) {
      options["domElement"] = this;
      USMap.initialize(options);
      return this;
    };
}( jQuery ));
