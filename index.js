(function(){
    'use strict';
    var Page = require('./classes/Page');

    var site = {},
        eachPage = function(callback){
            Object.keys(site).forEach(function(page){
                site[page].view(function(pageHtml){
                    return callback(site[page],pageHtml);
                });
            });
        };

    // HOME
    site.index = new Page({
        title: 'Home',
        template: 'index.html',
        variables: {
            calendar: {
                primerBloque: [
                    {month: 'MAY', day: 17, fullDate: '17 de Mayo , 08:00 - 16:00' , title: 'Usina del Arte - 6 ES'},
                    {month: 'APR', day: 11, fullDate: '11 de Abril , 02:00 - 03:00' , title: 'Día de la de Mayo (Feriado)'},
                    {month: 'APR', day: 11, fullDate: '11 de Abril , 02:00 - 03:00' , title: 'Día de la Revolución de Mayo (Feriado)'}
                ],
                segundoBloque: [
                    {month: 'MAY', day: 17, fullDate: '17 de Mayo , 08:00 - 16:00' , title: 'Usina del Arte - 6 ES'},
                    {month: 'MAY', day: 17, fullDate: '17 de Mayo , 08:00 - 16:00' , title: 'Usina del Arte - 6 ES'},
                    {month: 'MAY', day: 17, fullDate: '17 de Mayo , 08:00 - 12:00' , title: 'Usina del Arte - 6 ES'}
                ]
            }
        }
    });

    site.contacto = new Page({
        title: 'Contacto',
        template: 'contacto.html'
    });

    site.niveles = new Page({
        title: 'Niveles',
        template: 'niveles.html'
    });

    site.nivele_inicial = new Page({
        title: 'Nivel inicial',
        template: 'niveles-inicial.html'
    });

    site.nivele_primario = new Page({
        title: 'Nivel primario',
        template: 'niveles-primario.html'
    });

    site.nivele_secundario = new Page({
        title: 'Nivel secundario',
        template: 'niveles-secundario.html'
    });

    site.institucional = new Page({
        title: 'Institucional',
        template: 'institucional.html'
    });

    site.ideario = new Page({
        title: 'Ideario',
        template: 'ideario.html'
    });

    site.historia = new Page({
        title: 'Historia',
        template: 'historia.html'
    });

    site.admisiones = new Page({
        title: 'Admisiones',
        template: 'admisiones.html'
    });

    site.perfildelegresado = new Page({
        title: 'Perfil del Egresado',
        template: 'perfil-del-egresado.html'
    });

    site.aprendizaje = new Page({
        title: 'Aprendizaje',
        template: 'aprendizaje.html'
    });

    module.exports = {
        pages: site,
        eachPage: eachPage
    };
}).call(this);
