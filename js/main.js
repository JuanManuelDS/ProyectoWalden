window.addEventListener('load', ()=>{

    let carrito = [];
    let listaDonaciones = document.querySelector("#donaciones-lista");
    let tablaCarrito = document.querySelector('.carrito tbody');
    let vaciarCarr = document.querySelector('.vaciar-carrito');
    let donar = document.querySelector('.concretar-carrito');
    let finalizarDonacion = document.querySelector('#finalizarDonacion-lista');
    let $navInvolucrateOculto = $('.navInvolucrate-oculto');

    /*-------------Nav involucrate responsive-----------------------*/
    $('li.navInvolucrateLi').hover(function(){
        $navInvolucrateOculto.slideDown(100);
    }, function(){
        $navInvolucrateOculto.slideUp(100);
    });

    $('a.navInvolucrate').on('click', function(e){
        e.preventDefault();
    });
    /*-------------Nav involucrate responsive fin-----------------------*/
    
    //Muestra/oculta el carrito del nav
    $('.car-li img').on('click', () => {
        $('.carrito').slideToggle();
    });
    //Carga el storage en caso de tener algo
    cargarStorage();

    listaDonaciones.addEventListener('click', e => {
        if (e.target.classList.contains('leerMas-btn')) {
            leerMas(e.target);
        } else if (e.target.classList.contains('leerMenos-btn')) {
            leerMenos(e.target);
        } else if (e.target.classList.contains('agregar-btn')) {
            agregarCarrito(e.target)
        }
    });

    tablaCarrito.addEventListener('click', e => {
        if (e.target.classList.contains('eliminar-donacion')) {
            eliminarDonacion(e.target);
        }
    });

    vaciarCarr.addEventListener('click', vaciarCarrito);

    donar.addEventListener('click', (e) => {
        carrito.forEach(carrito => {
            let fila = document.createElement('div');
            fila.className = 'finalizarDonacion-fila';
            fila.innerHTML = `
            <div>
                <img src="${carrito.img}" heigth="150" width="150" alt="">
             </div>
            <div>
                <p>${carrito.causa}</p>
            </div>
            <div>
                <p>${carrito.cantidad}</p>
            </div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-circle-fill eliminar-donacion" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg>
            </div>`;
            finalizarDonacion.appendChild(fila);
        });
    });

    function vaciarCarrito() {
        borrarHTMLCarrito();
        carrito = [];
        localStorage.removeItem('donaciones');
        $('.carritoVacio-mensaje').show(100);
        $('.carrito table').hide(100);
    }

    function agregarCarrito(target) {

        if (verificarEntrada(target)) {
            let donacionObj = leerDatos(target);

            let donacion = target.parentElement.parentElement;
            let existe = carrito.some(donacion => donacion.id === donacionObj.id);

            if (existe) {
                //Agregar al carrito una donación ya existente
                let nuevoCarrito = carrito.map(donacion => {
                    if (donacion.id === donacionObj.id) {
                        donacion.cantidad = `${Number(donacion.cantidad) + Number(donacionObj.cantidad)}`
                        return donacion;
                    } else {
                        return donacion;
                    }
                });
                carrito = [...nuevoCarrito];
            } else {
                carrito.push(donacionObj);
            }

            /* carrito.push(donacionObj); */
            HTMLCarrito();
            $('.carritoVacio-mensaje').hide(100);
            $('.carrito table').show(100);
            $(`.${target.parentElement.querySelector('.entradaInvalida').className}`).hide(200);
            target.parentElement.querySelector('.cantidad-donar').style.border = 'black solid 1px';
            Swal.fire({
                icon: 'success',
                title: 'Donación agregada correctamente',
                timer: 2000,
                showConfirmButton: false
            })
        }
    }

    function leerDatos(target) {
        let carta = target.parentElement;

        let donacion = {
            img: carta.parentElement.querySelector('img').src,
            causa: carta.parentElement.querySelector('.donacion-datos-titulo').textContent,
            cantidad: Number(carta.querySelector('.cantidad-donar').value),
            id: carta.parentElement.getAttribute('id')
        }
        console.log(donacion.id);
        return donacion

    }

    function HTMLCarrito() {

        borrarHTMLCarrito();

        if (carrito.length === 0) {
            vaciarCarrito();
        } else {

            carrito.forEach(carrito => {
                let fila = document.createElement('tr');
                fila.innerHTML = `
            <td>
                <img src="${carrito.img}" width=60 height=50px>
            </td>
            <td class="carrito-causa">
                ${carrito.causa}
            </td>
            <td>
                $${carrito.cantidad}
            </td>
            <td>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path class="eliminar-donacion" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg>
            </td>`;
                tablaCarrito.appendChild(fila);
            });
        }

        almacenarStorage();
    }

    function almacenarStorage() {
        localStorage.setItem('donaciones', JSON.stringify(carrito));
    }

    function cargarStorage() {
        if (localStorage.getItem('donaciones') !== null) {
            carrito = JSON.parse(localStorage.getItem('donaciones'));
            HTMLCarrito();
            $('.carritoVacio-mensaje').hide(100);
            $('.carrito table').show(100);
        }
    }

    function borrarHTMLCarrito() {
        tablaCarrito.innerHTML = '';
    }

    function verificarEntrada(target) {
        if (target.parentElement.querySelector('.cantidad-donar').value === '') {
            $(`#${target.parentElement.parentElement.id} .${target.parentElement.querySelector('.entradaInvalida').className}`).show(200);
            target.parentElement.querySelector('.cantidad-donar').style.border = 'solid red 2px';
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor ingrese la cantidad a donar en números',

            })
            return false;
        } else return true;
    }

    //Eliminar donaciones individualmente
    function eliminarDonacion(target) {
        let causaAEliminar = target.parentElement.parentElement.parentElement.querySelector('.carrito-causa').textContent.trim();
        target.parentElement.parentElement.parentElement.remove();
        carrito.forEach((carr,index) => {
            if(carr.causa === causaAEliminar) {
                carrito.splice(index,1);
            }
        });
        HTMLCarrito(); 
    }

    function leerMas(target) {
        let carta = $(`#${target.parentElement.parentElement.id}`);
        carta.animate({
            maxWidth: '600px',
            width: '600px',
            /* height: '500px' */
        }, 100, () => {
            $('html, body').animate({
                scrollTop: (carta.offset().top)-90
            }, 200)
            carta.find('.donacion-interaccion label').toggle(50);
            carta.find('.donacion-interaccion br').toggle(50);
            carta.find('.leerMenos-btn').toggle(50);
            carta.find('.descripcionLarga').toggle(50);
            carta.find('.donacion-interaccion input').toggle(50);
            carta.find('.agregar-btn').toggle(50);
            carta.find('.donar-btn').toggle(50);

            carta.find('.descripcionCorta').toggle(50);
            carta.find('.leerMas-btn').toggle(50);
        });

    }

    function leerMenos(target) {
        let carta = $(`#${target.parentElement.parentElement.id}`);
        carta.animate({
            maxWidth: '300px',
            height: '400px'
        }, 100, () => {
            carta.find('.donacion-interaccion label').toggle(50);
            carta.find('.donacion-interaccion br').toggle(50);
            carta.find('.leerMenos-btn').toggle(50);
            carta.find('.descripcionLarga').toggle(50);
            carta.find('.donacion-interaccion input').toggle(50);
            carta.find('.agregar-btn').toggle(50);
            carta.find('.donar-btn').toggle(50);

            carta.find('.descripcionCorta').toggle(50);
            carta.find('.leerMas-btn').toggle(50);
            carta.find('.entradaInvalida').hide(0);
        })
    }

});

/* $(window).scroll(function () {
    if($(document).scrollTop() > 60){
        $('#indexNav').removeClass('noScroll')
    } else {
        $('#indexNav').addClass('noScroll')
    }
}) */