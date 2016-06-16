(function(win,doc,$){
    win.onload = function(){
        $('.header-menu__link, .header-menu__sub-items').on('mouseover',function(e){
            $('.header-menu__sub-items').css({display:'none'});
            $(this).parent().find('.header-menu__sub-items').css({display:'block'});
        });
        $('.header-menu__sub-items').on('mouseout',function(){
            $(this).css({display:'none'});
        });
    };
})(window,document,$);