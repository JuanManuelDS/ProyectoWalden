$(function(){
    let $navInvolucrateOculto = $('.navInvolucrate-oculto');

    $('li.navInvolucrateLi').hover(function(){
        $navInvolucrateOculto.slideDown(100);
    }, function(){
        $navInvolucrateOculto.slideUp(100);
    });

    $('a.navInvolucrate').on('click', function(e){
        e.preventDefault();
    })    

})

