if(window.location.pathname == '/rincon/main/pages/almacen/almacen.php'){
    
    /* DECLARACION DE VARIABLES */
    var $deck_cartas_productos = document.querySelector('#deck_cartas_productos');
    var $fila_producto = document.querySelector('#fila_producto');
    var $total_producto = document.querySelector('#total_producto');
    var $porcentaje_producto = document.querySelector('#porcentaje_producto');
    var $sub_total_producto = document.querySelector('#sub_total_producto');
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });


    /* LLAMADO A FUNCIONES */
    get_productos();

    /* FUNCIONES JQUERY */
    $("#producto_buscado").keyup(function() {

        var nombre = $("#producto_buscado").val();
        $.ajax({
            url: "../../functions/php/almacen/get_productos_2.php",
            type: "POST",
            data: {nombre: nombre}
        })
        .done(function (res) {
            var array = JSON.parse(res);
            var template = ``;
        array.forEach((producto) => {
            let nombre_vela = capitalize(producto.nombre);
            template += `<div class="col-sm-3 mt-1">
                                <div class='card' style="max-width: 24rem;">
                                    <div class='card-body'>
                                    <div class='row'>
                                        <div class='col-md-10'>
                                        <h5 class='text-success'>${nombre_vela}</h5>
                                        </div>
                                    </div>
                                        <hr>
                                        <p class='card-text'>$${producto.precio_final}</p>
                                        
                                    </div>

                                    <div class='card-footer'>
                                            <button onclick="ver_detalles_producto()" class="btn btn-success btn-block">Ver detalles</button>
                                        </div>
                                    
                                </div>
                            </div>`
                $deck_cartas_productos.innerHTML = template;
          })
        })
        .fail(function () {
          console.log('Err'); 
        });
    })

    /* DECLARACION DE FUNCIONES */
    function get_productos() {
        $.ajax({
                url: "../../functions/php/almacen/get_productos_1.php",
                type: "GET"
            })
            .done(function (res) {
                var array = JSON.parse(res);
                var template = ``;
                array.forEach((producto) => {
                    let nombre_vela = capitalize(producto.nombre);
                    template += `<div class="col-sm-3 mt-1">
                                <div class='card' style="max-width: 24rem;">
                                    <div class='card-body'>
                                    <div class='row'>
                                        <div class='col-md-10'>
                                        <h5 class='text-success'>${nombre_vela}</h5>
                                        </div>
                                    </div>
                                        <hr>
                                        <p class='card-text'>$${producto.precio_final}</p>
                                        
                                    </div>

                                    <div class='card-footer'>
                                            <button onclick="ver_detalles_producto(${producto.id}, '${nombre_vela}')" class="btn btn-success btn-block">Ver detalles</button>
                                        </div>
                                </div>
                            </div>`
                    $deck_cartas_productos.innerHTML = template;
                })
            })
            .fail(function () {
                console.log('Err');
            });

            
    }

    function capitalize(s){
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    function ver_detalles_producto(id, nombre){
        console.log(id, nombre);
        $('#titulo_modal_vista_producto').val(nombre);
        $.ajax({
            url: "../../functions/php/almacen/get_producto.php",
            type: "POST", 
            data: { id : id },
        })
        .done(function (res) {
            var array = JSON.parse(res);
            console.log(array);



            var template = ``;
            var template2 = ``;
            var template3 = ``;
            var template4 = ``;
            var cont = 1;
            var precio = 0;
            // console.log(lista_ingredientes);
            array.forEach(elemento => {
            
                var id_contenedor = "ingrediente_fila_"+cont;
                
                template += `
                <div class="row" id=${id_contenedor}>
                    <div class="col-md-10">
                        <p><i onclick="quitar_accesorio_producto(${elemento.id_accesorio}, ${id_contenedor})" class="text-danger bi bi-trash"></i> ${elemento.nombre}</p>
                    </div>
                    <div class="col-md-2" style="text-align: right;">
                        <p class="text-info">$${elemento.precio}</p>
                    </div>
                </div>`
                
                $fila_producto.innerHTML = template;
                cont = cont + 1;

                precio = precio + parseFloat(elemento.precio);
                
            });
            var sub_total = precio;
            var porcentaje = (precio*0.5);
            precio = precio + porcentaje;
            
            template2 += `
                <div class="row">
                    <div class="col-md-10">
                        <p><i class=" text-success bi bi-cash-coin"></i> Total </p>
                    </div>
                    <div class="col-md-2" style="text-align: right;">
                        <p class="text-success">$${precio}</p>
                    </div>
                </div>`
                
            $total_producto.innerHTML = template2;

            template3 += `
                <div class="row">
                    <div class="col-md-10">
                        <p><i class="text-success bi bi-percent"></i> Porcentaje </p>
                    </div>
                    <div class="col-md-2" style="text-align: right;">
                        <p class="text-info">$${porcentaje}</p>
                    </div>
                </div>`
                
            $porcentaje_producto.innerHTML = template3;

            template4 += `
                <div class="row">
                    <div class="col-md-10">
                        <p><i class="text-success bi bi-card-checklist"></i> Sub total </p>
                    </div>
                    <div class="col-md-2" style="text-align: right;">
                        <p class="text-danger">$${sub_total}</p>
                    </div>
                </div>`
                
            $sub_total_producto.innerHTML = template4;

            $('#modal_vista_producto').modal('show');


        })
        .fail(function () {
            console.log('Err');
        });
    }

}