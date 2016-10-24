(function(win,doc,$){
    var sliderArray = [],
        header = doc.querySelector('.header'),
        logo = header.querySelector('img');
    win.onload = function(){
        Parallaxy.refresh();
        $('#main').animate({opacity: 1},500);
        $('a.header-menu__link , a.header-menu__sub-link').on('click tap',function(e){
            var href = $(this).attr('href');
            if( typeof href !== 'undefined' && href !== '#'){
                e.preventDefault();
                $('#main').animate({opacity: 0},500,function(){
                    window.location = href;
                });
                logo.removeAttribute('style');

            }

        });
        $('.header-menu-burguer').on('click tap',function(){
            var menuMobile = doc.querySelector('.header-menu-mobile');
            if(menuMobile.getAttribute('style')){
                menuMobile.removeAttribute('style');
            }else{
                menuMobile.style.display = 'block';
            }
        });
        $('.header-menu__link').on('click tap',function(e){
            if($(this).attr('href') == '#'){
                e.preventDefault();
            }
        });
        $('.header-menu__link, .header-menu__sub-items').on('mouseover',function(e){
            $('.header-menu__sub-items').css({display:'none'});
            $(this).parent().find('.header-menu__sub-items').css({display:'block'});
        });
        $('.header-menu__sub-items').on('mouseout',function(){
            $(this).css({display:'none'});
        });

        var sliders = doc.querySelectorAll('[data-slider]');

        for(var i = 0; i < sliders.length ; i++){
            sliderArray.push( new SimpleSlider( sliders[i] ,{
                autoPlay:false,
                transitionTime:1,
                startValue: sliders[i].offsetWidth,
                endValue: -sliders[i].offsetWidth ,
                transitionDelay:3.5
            }));
        }
        $('.slider-control').on('click tap',function(e){
            e.preventDefault();
            var side = $(this).attr('data-slider-side') || false,
                direct = $(this).attr('data-slider-to') || false,
                sIndex = $(this).attr('data-slider-index') || 0,
                slider = sliderArray[sIndex];
            if(side){

                if(side == 'right'){
                    var to = (slider.actualIndex + 1) >= slider.imgs.length ? 0 : slider.actualIndex + 1;
                    if(to != slider.actualIndex){
                        slider.startVal =  slider.containerElem.offsetWidth;
                        slider.endVal = -slider.containerElem.offsetWidth;
                        slider.change(to);
                    }
                }
                if(side == 'left'){
                    var to = (slider.actualIndex - 1) < 0 ? slider.imgs.length - 1 : slider.actualIndex - 1;
                    if(to != slider.actualIndex){
                        slider.startVal =  -slider.containerElem.offsetWidth;
                        slider.endVal = slider.containerElem.offsetWidth;
                        slider.change(to);
                    }
                }
            }
            if(direct){
                $('.slider-control').removeClass('slider-control-active');
                $(this).addClass('slider-control-active');
                var to = parseInt(direct) - 1;
                if(to != slider.actualIndex){
                    slider.startVal = to > slider.actualIndex ? slider.containerElem.offsetWidth : -slider.containerElem.offsetWidth;
                    slider.endVal = to < slider.actualIndex ? slider.containerElem.offsetWidth : -slider.containerElem.offsetWidth;
                    slider.change(to);
                }
            }
        });

        var calendar = new Calendar().load(function(results, instance){
            var cal1 = doc.querySelector('#calendar1');
            var cal2 = doc.querySelector('#calendar2');


            $('.animateContainer').animate({
               height: 200
            }, 500, function(){
                this.style.height = 'auto';
                $(cal1).parent().find('hr').removeClass('hide');
                cal1.innerHTML = instance.getAll(results.slice(0,3));
                $(cal2).parent().find('hr').removeClass('hide');
                cal2.innerHTML = instance.getAll(results.slice(4,7));
            });
        });
    };

    if(win.innerWidth > 960){
        $(win).on('scroll',function(){

            if(doc.querySelector('body').scrollTop > 100){
                logo.style.height = '60px';
            }else{
                logo.removeAttribute('style');
            }
        });
    }


    win.sliders = sliderArray;
})(window,document,$);