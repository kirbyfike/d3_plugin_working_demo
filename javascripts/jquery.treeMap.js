(function ( $ ) {
    $.fn.treeMap = function(options) {
      options["domElement"] = this;
      USMap.initialize(options);
      return this;
    };
}( jQuery ));
