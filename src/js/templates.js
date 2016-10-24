var templates = {
    calendar:   '<div class="col-md-4 calendar">' +
                    '<div class="float-col">'+
                        '<div class="calendar-month">{{this.month}}</div>'+
                        '<div class="calendar-date">{{this.day}}</div>'+
                    '</div>'+
                    '<div class="float-col__block calendar-info">'+
                        '<h5 class="color-verde">{{this.title}}</h5>'+
                        '<p class="font-title">{{this.fullDate}} {{this.time}}</p>'+
                        '<a href="https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid={{this.eid}}&tmsrc=sps.arg@gmail.com&catt=false&pprop=HowCreated:DUPLICATE&hl=es&scp=ONE" target="_blank">Agendar en mi calendar</a>'+
                    '</div>'+
                    '<div class="clearfix"></div>'+
                '</div>'
};

