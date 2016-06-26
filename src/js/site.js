(function(win,doc,$){
    var sliderArray = [];
    win.onload = function(){
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
                    console.log(to);
                    if(to != slider.actualIndex){
                        slider.change(to);
                    }
                }
                if(side == 'left'){
                    var to = (slider.actualIndex - 1) < 0 ? slider.imgs.length - 1 : slider.actualIndex - 1;
                    if(to != slider.actualIndex){
                        slider.change(to);
                    }
                }
            }
            if(direct){
                $('.slider-control').removeClass('slider-control-active');
                $(this).addClass('slider-control-active');
                var to = parseInt(direct) - 1;
                if(to != slider.actualIndex){
                    slider.change(to);
                }
            }
        })


    };

    $(win).on('scroll',function(){
        var header = doc.querySelector('.header'),
            logo = header.querySelector('img');
        if(doc.querySelector('body').scrollTop > 100){
            logo.style.height = '60px';
        }else{
            logo.removeAttribute('style');
        }
    });



    win.sliders = sliderArray;
})(window,document,$);