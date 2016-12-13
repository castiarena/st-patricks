(function(){
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
}());

(function(win, doc){
    'use strict';

    var calendarsIds = {
        "Kindergarten" : "sps.arg@gmail.com",
        //"Cumpleaños" : "#contacts@group.v.calendar.google.com",
        "Feriados" : "bl3rgjdsjqu98eecok3jdc7l5s@group.calendar.google.com",
        "Institucional": "9r1ull3mlekthb98966fo1edf0@group.calendar.google.com",
        "Nivel Primario" : "7uq7o4va9pup868m72kaslcf48@group.calendar.google.com",
        "Nivel Secundarion" : "tpm2ln2cjvjn3e6c26bokjdods@group.calendar.google.com",
        //"S.U.M - Eventos": "0p3vilqo73plhokrjd857p9rk4@group.calendar.google.com",
        "Festivos" : "es.ar#holiday@group.v.calendar.google.com"
    };

    var config = {
            today : new Date(),
            clientId : '1079516781600-212p1jk45grqpckktc693i042f59a7ai.apps.googleusercontent.com',
            apiKey : 'AIzaSyCpyjnQV-xj_15SroWw0ZitIxclZ25qVb8',
            userEmail : calendarsIds["Nivel Secundarion"],
            userTimeZone : 'Buenos Aires, Argentina',
            maxRows : 7,
            scopes : 'https://www.googleapis.com/auth/calendar' ,
            dependency: 'https://apis.google.com/js/client.js?onload=loadCalendar' },
        mapMonth = {
            "01": "ENE",
            "02": "FEB",
            "03": "MAR",
            "04": "ABR",
            "05": "MAY",
            "06": "JUN",
            "07": "JUL",
            "08": "AGO",
            "09": "SEP",
            "10": "OCT",
            "11": "NOV",
            "12": "DIC" },
        mapMonthFull = {
            "01": "Enero",
            "02": "Febrero",
            "03": "Marzo",
            "04": "Abril",
            "05": "Mayo",
            "06": "Junio",
            "07": "Julio",
            "08": "Agosto",
            "09": "Septiembre",
            "10": "Octubre",
            "11": "Noviembre",
            "12": "Diciembre" },
        mapDay = {
            "1" : "mon" ,
            "2": "tue" ,
            "3": "wed" ,
            "4": "thu" ,
            "5": "fri" ,
            "6": "sat" ,
            "0": "sun" };



    function Calendar (){
        this.template = Handlebars.compile(templates.calendar);
        this.events = [];
        return this;
    }

    Calendar.prototype.getAll = function (dates){
        var info = '';
        for( var i = 0 ; i < dates.length; i++){
            var thisDate = dates[i];
            info += this.template(thisDate);
        }
        return info;
    };

    // utils
    Calendar.prototype.getParameterByName = function(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    Calendar.prototype.padNum = function(num){
        if (num <= 9) {
            return "0" + num;
        }
        return num;
    };

    Calendar.prototype.amPm = function(num){
        if (num <= 12) {
            return 'Am';
        }
        return 'Pm';
    };

    Calendar.prototype.monthString = function(num){
        return mapMonth[num];
    };

    Calendar.prototype.monthFullString = function(num){
        return mapMonthFull[num];
    };

    Calendar.prototype.dayString = function(num){
        return mapDay[num];
    };

    Calendar.prototype.load = function(callback){
        var that = this;
        if(gapi){
            gapi.client.setApiKey(config.apiKey);
            gapi.auth.authorize({client_id: config.clientId, scope: config.scopes, immediate: true}, function(authResult){
                return that.handleAuthResult(authResult, callback, that);
            });
        }else{
            console.error('error cargando google apis');
        }

    };

    Calendar.prototype.multiRequest = function(calendarList){
        var that = this,
            array = [],
            calls = 0,
            totalCalls = Object.size(calendarList),
            config = function(calendarId){
                return {
                    'calendarId' : calendarId,
                    'timeZone' : config.userTimeZone,
                    'singleEvents': true,
                    'timeMin': new Date().toISOString(), //gathers only events not happened yet
                    'maxResults': config.maxRows,
                    'orderBy': 'startTime'
                }
            };

        var inmuted = {
            end: null
        };

        var monad = {
            and: that.multiRequest ,
            then: function(callback){
                for( var k in calendarList){
                    if(calendarList.hasOwnProperty(k)){
                        var conf = config(calendarList[k]),
                            request = gapi.client.calendar.events.list(conf);
                        request.execute(function(resp){
                            calls++;
                            array = $.merge(array, resp.items);
                            if(calls === totalCalls){
                                return inmuted.end(array);
                            }
                        });
                    }
                }
                return monad;
            },
            end: function(callback){
                inmuted.end = callback;
            }
        };

        return monad;
    };

    Calendar.prototype.handleAuthResult = function(authResult, callback, instance){
        var that = this;
        if (authResult) {
            gapi.client.load('calendar', 'v3', function () {
                that.multiRequest(calendarsIds)
                    .then(function(resp){
                        that.events.push(resp.items);
                    })
                    .end(function(array){
                        array.sort(function(a,b){
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                            return -(new Date(b.start.date) - new Date(a.start.date));
                        });

                        var results = [];
                            for (var i = 0; i < array.length; i++) {
                                var item = array[i],
                                    allDay = item.start.date? true : false,
                                    startDT = allDay ? item.start.date : item.start.dateTime,
                                    dateTime = startDT.split("T"), //split date from tim,
                                    dateTimeEnd = allDay ? null : item.end.dateTime.split("T"),
                                    date = dateTime[0].split("-"), //split yyyy mm d,
                                    startYear = date[0],
                                    startMonth = instance.monthString(date[1]),
                                    startDay = date[2],
                                    startDateISO = new Date(startMonth + " " + startDay + ", " + startYear + " 00:00:00"),
                                    startDayWeek = instance.dayString(startDateISO.getDay());

                                if(!allDay){
                                    var startTtime = dateTime[1].split(":"); //split hh ss etc...
                                    var startHour = startTtime[0];
                                    var startMin = startTtime[1];
                                    var endTime = dateTimeEnd[1].split(":"); //split hh ss etc...
                                    var endHour = endTime[0];
                                    var endMin = endTime[1];
                                }
                                results.push({
                                    month: startMonth,
                                    day: startDay,
                                    link: item.htmlLink,
                                    eid: instance.getParameterByName('eid',item.htmlLink),
                                    time: allDay ? '' : ', '+ startHour + ':' + startMin + ' - '+ endHour + ':' + endMin,
                                    date: dateTime[0],
                                    fullDate: date[2] + " de " + instance.monthFullString(date[1]) ,
                                    title: item.summary
                                });
                            }
                            callback(results, instance);
                    });
            });
        }
    };

    if(config.dependency){
        var script = doc.createElement('script'), body = doc.querySelector('body');
        script.src = config.dependency;
        body.appendChild(script);
    }

    win.Calendar = Calendar;
}(window, document));


//
//var clientId = '1079516781600-212p1jk45grqpckktc693i042f59a7ai.apps.googleusercontent.com'; //choose web app client Id, redirect URI and Javascript origin set to http://localhost
//var apiKey = 'AIzaSyCpyjnQV-xj_15SroWw0ZitIxclZ25qVb8'; //choose public apiKey, any IP allowed (leave blank the allowed IP boxes in Google Dev Console)
//var userEmail = "sps.arg@gmail.com"; //your calendar Id
//var userTimeZone = "Buenos Aires, Argentina"; //example "Rome" "Los_Angeles" ecc...
//var maxRows = 10; //events to shown
//var calName = "YOUR CALENDAR NAME"; //name of calendar (write what you want, doesn't matter)
//
//var scopes = 'https://www.googleapis.com/auth/calendar';
//
////--------------------- Add a 0 to numbers
//function padNum(num) {
//    if (num <= 9) {
//        return "0" + num;
//    }
//    return num;
//}
////--------------------- end
//
////--------------------- From 24h to Am/Pm
//function AmPm(num) {
//    if (num <= 12) {
//        return "am " + num;
//    }
//    return "pm " + padNum(num - 12);
//}
////--------------------- end
//
////--------------------- num Month to String
//function monthString(num) {
//    if (num === "01") { return "JAN"; }
//    else if (num === "02") { return "FEB"; }
//    else if (num === "03") { return "MAR"; }
//    else if (num === "04") { return "APR"; }
//    else if (num === "05") { return "MAJ"; }
//    else if (num === "06") { return "JUN"; }
//    else if (num === "07") { return "JUL"; }
//    else if (num === "08") { return "AUG"; }
//    else if (num === "09") { return "SEP"; }
//    else if (num === "10") { return "OCT"; }
//    else if (num === "11") { return "NOV"; }
//    else if (num === "12") { return "DEC"; }
//}
////--------------------- end
//
////--------------------- from num to day of week
//function dayString(num){
//    if (num == "1") { return "mon" }
//    else if (num == "2") { return "tue" }
//    else if (num == "3") { return "wed" }
//    else if (num == "4") { return "thu" }
//    else if (num == "5") { return "fri" }
//    else if (num == "6") { return "sat" }
//    else if (num == "0") { return "sun" }
//}
////--------------------- end
//
////--------------------- client CALL
//function handleClientLoad() {
//    gapi.client.setApiKey(apiKey);
//    checkAuth();
//}
////--------------------- end
//
////--------------------- check Auth
//function checkAuth() {
//    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
//}
////--------------------- end
//
////--------------------- handle result and make CALL
//function handleAuthResult(authResult) {
//    if (authResult) {
//        makeApiCall();
//    }
//}
////--------------------- end
//
////--------------------- API CALL itself
//function makeApiCall() {
//    var today = new Date(); //today date
//    gapi.client.load('calendar', 'v3', function () {
//        var request = gapi.client.calendar.events.list({
//            'calendarId' : userEmail,
//            'timeZone' : userTimeZone,
//            'singleEvents': true,
//            'timeMin': today.toISOString(), //gathers only events not happened yet
//            'maxResults': maxRows,
//            'orderBy': 'startTime'
//        });
//        request.execute(function (resp) {
//            console.log(resp);
//            for (var i = 0; i < resp.items.length; i++) {
//                var li = document.createElement('li');
//                var item = resp.items[i];
//                var classes = [];
//                var allDay = item.start.date? true : false;
//                var startDT = allDay ? item.start.date : item.start.dateTime;
//                var dateTime = startDT.split("T"); //split date from time
//                var date = dateTime[0].split("-"); //split yyyy mm dd
//                var startYear = date[0];
//                var startMonth = monthString(date[1]);
//                var startDay = date[2];
//                var startDateISO = new Date(startMonth + " " + startDay + ", " + startYear + " 00:00:00");
//                var startDayWeek = dayString(startDateISO.getDay());
//                if( allDay == true){ //change this to match your needs
//                    var str = [
//                        '<font size="4" face="courier">',
//                        startDayWeek, ' ',
//                        startMonth, ' ',
//                        startDay, ' ',
//                        startYear, '</font><font size="5" face="courier"> @ ', item.summary , '</font><br><br>'
//                    ];
//                } else{
//                    var time = dateTime[1].split(":"); //split hh ss etc...
//                    var startHour = AmPm(time[0]);
//                    var startMin = time[1];
//                    var str = [ //change this to match your needs
//                        '<font size="4" face="courier">',
//                        startDayWeek, ' ',
//                        startMonth, ' ',
//                        startDay, ' ',
//                        startYear, ' - ',
//                        startHour, ':', startMin, '</font><font size="5" face="courier"> @ ', item.summary , '</font><br><br>'
//                    ];
//                }
//                li.innerHTML = str.join('');
//                li.setAttribute('class', classes.join(' '));
//                document.getElementById('events').appendChild(li);
//            }
//            document.getElementById('updated').innerHTML = "updated " + today;
//            document.getElementById('calendarv2').innerHTML = calName;
//        });
//    });
//}
////--------------------- end