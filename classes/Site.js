(function(){
    'use strict';
    var fs = require( 'fs');

    function Site(){
        var that = this,
            args = arguments[0];
        /**
         * Must be an Array of Page objects
         * @type {Array}
         */
        that.pages = [];
        Object.keys(args).forEach(function(arg){
            that[arg] = args[arg];
        });

    }

    Site.prototype.setNav = function(pages){
        var that = this;
        pages.forEach(function(page){
            var objectNav = { name: page.name , url: page.template };
            if(page.childPages){
                that.setNav(page.childPages);
            }
            return objectNav;
        });
    };

    Site.prototype.eachPage = function(callback){
        this.pages.forEach(function(page){
            page.view(function(pageHtml){
                return callback(page ,pageHtml);
            });
        });
    };

})();