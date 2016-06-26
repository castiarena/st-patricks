(function(){
    'use strict';
    var fs = require('fs'),
        handlebars = require('handlebars'),
        ROOT = __dirname.replace('classes','') + 'src/vistas/',
        LAYOUT = 'layout.html';
    /**
     * Crea pagina y depende de handlebars
     * @constructor
     * Argumentos sugeridos:
     *  template : url al template (OBLIGATORIO)
     *  title : titulo de la pagina
     *  content : contenido de la pagina
     */
    function Page(){
        var that = this,
            args = arguments[0];
        Object.keys(args).forEach(function(arg){
            that[arg] = args[arg];
        });
        /**
         * Estructura de cada posicion del array
         * { name: 'Name de la pagina' , url:'' , subnav: [ { name: 'Name sub page', url: ''} ]}
         * @type {Array}
         */
        that.navLinks = [
            {name: 'Institucional' , url: 'institucional.html' ,
                subnav: [
                    {name: 'Ideario', url: 'ideario.html'},
                    {name: 'Historia', url: 'historia.html'},
                    {name: 'Perfil del egresado', url: 'perfil-del-egresado.html'},
                    {name: 'Aprendizaje', url: 'aprendizaje.html'}
            ]},
            {name: 'Niveles' , url: 'niveles.html' , subnav: [
                {name: 'Nivel inicial', url: 'niveles-inicial.html'},
                {name: 'Nivel Primario', url: 'niveles-primario.html'},
                {name: 'Nivel Secundario', url: 'niveles-secundario.html'}
            ]},
            {name: 'Admisiones' , url: 'admisiones.html' },
            {name: 'Contacto' , url: 'contacto.html' },
            {name: 'Comunidad Educativa' , url: 'comunidad-educativa.html' , icon: 'user' }
        ]
    }

    //Page.prototype.setNavLinks = function(navs){
    //    var that = this;
    //    if(navs.name != that.title){
    //        that.navLinks.push({name : that.title , url: that.template});
    //    }
    //    if(that.subNav.from != null){
    //        that.navLinks.forEach(function(nav){
    //            nav[that.subNav.from].subnav = nav;
    //        });
    //    }
    //};

    Page.prototype.createTemplate = function(callback){
        var that = this;
        fs.exists(ROOT + that.template,function(exists){
            if(!exists){
                fs.writeFile(ROOT + that.template,'<!-- '+ that.title+' -->','utf8',function(err){
                    if(err) return callback();
                    console.log('Se creo el template para '+ that.template);
                    return callback();
                })
            }else{
                return callback();
            }
        })
    };

    Page.prototype.view = function(callback){
        var that = this;
        that.createTemplate(function(){
            that.render(that.template, function(err,templateStr){
                if(err) console.log(err.message);
                var template = handlebars.compile(templateStr),
                    html = template(that.variables ? that.variables : {});
                that.render(LAYOUT,function(err, lay){
                    if(err) console.log(err.message);
                    var template = handlebars.compile(lay);
                    var view = template({
                        title: that.title,
                        nav: that.navLinks,
                        content: html
                    });
                    return callback(view);
                })
            });
        });


    };

    Page.prototype.render = function(template, callback){
        fs.readFile(ROOT + template, 'utf8',function(err, templateStr){
            if(err) return callback(err);
            return callback(null,templateStr);
        });
    };


    module.exports = Page;
}).call(this);
