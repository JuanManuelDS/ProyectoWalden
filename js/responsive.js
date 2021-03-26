$(()=>{
    if($(document).width()<=850){
        let carLi = $(".car-li"),
        carLiClon = carLi.clone(),
        carUl = $('<ul class="car-ul"></ul>');
      carLiClon.appendTo(carUl);
      carUl.appendTo("nav div");
      carLi.remove();
    }
});