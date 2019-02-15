var wh, ww;
function on_resize() {
    wh = $(window).height();
    ww = $(window).width();

    if (ww < 1200 && $('.main-about').length != 0){
        $('.header').addClass('general');
        $(window).resize(function() {
            $('.header').addClass('general');
        });
    }
}
function on_scroll() {
    var st = $(window).scrollTop();

    if (st > 50) {
        $(".header").addClass("header--tiny");
    } else {
        $(".header").removeClass("header--tiny");
    }
    if($('.order-consult').length){
        if (st > 50) {
            // console.log(st);
            $('.order-consult').addClass("visible");
        } else {
            $('.order-consult').removeClass("visible");
        }
    }
    if(ww > 1200){
        $("[data-parallax]").each(function() {
            var block = $(this),
                pos_top = block.offset().top,
                delta = (pos_top - st) / wh,
                speed = block.data("parallax");

            if (delta < 0) delta = 0;
            if (delta > 1) delta = 1;

            block.css({
                "transform": "translateY(" + Math.round(delta * speed) + "px)",
                "opacity": 2*(1 - delta)
            });

        });
    }

}

function scrolled_stack() {
    var st = $(window).scrollTop();
    $(".stack").each(function () {
        var c = $(this).parent();
        if (c.offset().top - st <= 300) {
            $(this).addClass("fixed");
        } else {
            $(this).removeClass("fixed");
        }
        if ((st - 10 + $(this).height()) > (c.offset().top + c.height())) {
            $(this).addClass("bottom");
        } else {
            $(this).removeClass("bottom");
        }
    });
}

function groupsChanged(event) {
    var i = (event.item.index-2) % event.item.count;
    $(event.currentTarget).find(".owl-item").removeClass("current");
    $(event.currentTarget).find(".owl-item").eq(event.item.index).addClass("current");
    $(".main-group__slider-menu li").removeClass("active");
    $(".main-group__slider-menu li").eq(i).addClass("active");

    var newText = "";
    newText = $(event.currentTarget).find(".owl-item").eq(event.item.index).find(".main-group__slider-info.hidden").html();
    $('.groups .left__columns > .main-group__slider-info').html(newText);
    // console.log(newText);
}

var topTimoOut;
function topChanged(event) {
    var i = event.item.index;
    clearTimeout(topTimoOut);
    if (i == 2) {
        topTimoOut = setTimeout(function() {
            var owl = $("[data-carousel]");
            owl.trigger('to.owl.carousel', [0]);
        }, 5000);
    }
}
function do_maps() {
    //55.695523, 37.563828
    ymaps.ready(init);
    var myMap;
    var iconStyle = {
        iconLayout: 'default#image',
        iconImageHref: '    images/icon-map-pin.svg',
        iconImageSize: [79, 79],
        iconImageOffset: [-15, -43]
    };
    function init() {
        myMap = new ymaps.Map("map1", {
            center: [55.695485, 37.563538],
            zoom: 16
        });
        myMap.behaviors.disable('scrollZoom');
        var complexPlacemark = new ymaps.Placemark([55.695485, 37.563538], {
            hintContent: 'г. Москва, м. Академическая, ул. Губкина, 6к1',
            balloonContent: ''
        }, iconStyle);
        myMap.geoObjects.add(complexPlacemark);
        myMap.setBounds(myMap.geoObjects.getBounds());
        myMap.setZoom(16);
    }
}
function sliderInfoPosition(){
    var windowHeight = $(window).height() - 83;
    var heightBg = $('.ts-bg').height();
     // console.log(windowHeight, heightBg);
    if(windowHeight <= heightBg || ww < 680){
        $('.top-slider .owl-stage-outer').css({
            'height':  $(window).height()
        });
        $('.top-slider__info').css({
            'top': windowHeight
        });
    }else{
        $('.top-slider__info').css({
            'bottom': '0'
        });

    }

}

$(document).ready(function() {
    // console.log(screen.width, ww, wh);
    if ($(".stack").length && ww > 1024) {
        scrolled_stack();

        $(document).scroll(function(){scrolled_stack();});
        $(window).resize(function() {
            scrolled_stack();
            $(document).scroll(function(){scrolled_stack();});
        });
    }

    $(document).on('click', '.consult__btn',function () {
        var arr = $('.consult__form').serializeArray();
        var newText = '<h2>Заявка успешно отправлена</h2><div class="consult__descr-top">Наш менеджер перезвонит Вам в ближайшее время</div><a href="#" data-fancybox-close class="btn btn--blue consult__end">Хорошо</a>';
        $('.consult').html(newText);
    });
    $(document).on('click', '.fancybox-close-small',function () {
        $('.fancybox-container').addClass('back');
    });

    $('.main-about__item').on('click', 'a', function(event) {
        event.preventDefault();
        var point = $(this).attr('href');
        var top = $(point).offset().top + 2;
        $('body, html').animate({
            scrollTop: top
        },800);
    });

    $('.top-menu .anchor').on('click', function(event) {
        if($('.main-about').length != 0){
            event.preventDefault();
            var point = $(this).attr('href');
            var top = $(point).offset().top;
            $('body, html').animate({
                scrollTop: top
            },0);
        }else{
            location.href = $(this).attr('href');
        }

    });
    $('.logo div, .top-menu a').on('click', function () {
        if($('.header').hasClass('active')){
            $('.header').removeClass('active');
        }else{
            $('.header').addClass('active');
        }
    });

    $("[data-carousel-groups]").owlCarousel({
        responsiveClass:true,
        responsive: {
            0: {
                items: 1
            },
            741: {
                items: 2
            }
        },
        nav: true,
        dots: false,
        onChanged: groupsChanged,
        onInitialized: groupsChanged,
        margin: 30,
        loop: true,
        autoWidth: false,
        autoplay: true,
        autoplayTimeout: 4000,
        // merge: 2,
        // mergeFit: false
    });
    var owlG = $("[data-carousel-groups]");
    $("[data-groups-slide]").click(function() {
        event.preventDefault();
        owlG.trigger('to.owl.carousel', [$(this).attr('data-groups-slide')]);
    });
    // Go to the next item
    $('[data-groups-slide-next]').click(function() {
        owlG.trigger('next.owl.carousel');
    })
    // Go to the previous item
    $('[data-groups-slide-prev]').click(function() {
        // With optional speed parameter
        // Parameters has to be in square bracket '[]'
        owlG.trigger('prev.owl.carousel');
    })

    $("[data-carousel]").owlCarousel({
        items: 1,
        nav: false,
        dots: true,
        onChanged: topChanged,
        margin: 30,
        autoplay: true,
        // loop: true,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut'
    });
    var newHeight;
    $('.cards-mobile__btn').on('click', function () {
        event.preventDefault();
        newHeight = parseInt($(this).parent('.type__item').find('.types__items-text').height()) + 500 + 'px';
        if($(this).hasClass('opened')){
            $(this).removeClass('opened');
            $(this).parent('.type__item').css({
                "min-height": '430px'
            });
            $(this).parent('.type__item').find('.types__items-text').removeClass('opened');
            $(this).html('подробнее');
        }else{
            $(this).addClass('opened');
            $(this).parent('.type__item').css({
                "min-height": newHeight
            });
            $(this).parent('.type__item').find('.types__items-text').addClass('opened');
            $(this).html('свернуть');
        }
    });
    $('.gold-card .cards-mobile__btn').on('click', function () {
        event.preventDefault();
        var parent = $(this).parent();
        newHeight = parseInt(parent.parent().find('.gold-card__left-content').find('.gold-card__text').height()) + 350 + 'px';
        // console.log(newHeight);
        if(!$(this).hasClass('opened')){
            // console.log('1');
            $(this).removeClass('opened');
            $('.gold-card .wrap').animate({height: "326px"}, 500);
            $(this).html('подробнее');
            $(this).parent().find('.gold-card__text').removeClass('opened');
        }else{
            // console.log('2');
            $(this).addClass('opened');
            $('.gold-card .wrap').animate({height: newHeight}, 500);
            $(this).parent().find('.gold-card__text').addClass('opened');
            $(this).html('свернуть');
        }
    });

    do_maps();

    on_resize();
    $(window).resize(function() {
        on_resize();
        on_scroll();
       // sliderInfoPosition();
    });

    on_scroll();
    $(window).scroll(function() {
        on_scroll();
    });
    sliderInfoPosition();
});

