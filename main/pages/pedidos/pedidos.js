if(window.location.pathname == ruta+'pedidos/pedidos.php'){

     /* DECLARACION DE VARIABLES */
     var $deck_cartas_pedidos = document.querySelector('#deck_cartas_pedidos');
     var $deck_cartas_productos = document.querySelector('#deck_cartas_productos');
     var $fila_producto = document.querySelector('#fila_producto');
     var $fila_producto2 = document.querySelector('#fila_producto2');
     var $total_pedido2 = document.querySelector('#total_pedido2');
     var $fila_producto_total = document.querySelector('#fila_producto_total');
     var $total_producto = document.querySelector('#total_producto');
     var $id_pedido = document.querySelector('#id_pedido');
     var $update_descripcion_del_pedido = document.querySelector('#update_descripcion_del_pedido');
     var lista_productos = [];
     var valor_cera;
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
    obtener_valor_cera();
 

    /* FUNCIONES JQUERY */
    $("#producto_buscado").keyup(function () {  
        lista_productos = [];
        var nombre = $("#producto_buscado").val();
        $.ajax({
                url: "../../functions/php/almacen/get_productos_2.php",
                type: "POST",
                data: {
                    nombre: nombre
                }
            })
            .done(function (res) {
                var array = JSON.parse(res);
                var template = ``;
            array.forEach((accesorio) => {
                if (accesorio.estado == 0 ){
                    if(parseInt(accesorio.cantidad_cera) > 0 ){
                        var precio_actual = parseFloat(accesorio.precio);
                        var cantidad_de_cera = parseInt(accesorio.cantidad_cera);
                        var precio_subtotal = parseFloat(precio_actual) - parseFloat(valor_cera);
                        var precio_final = parseFloat(precio_subtotal) + ((cantidad_de_cera*valor_cera)/100);
                        accesorio.precio = precio_final; 
                        
                    }
                    template += dibuja_productos(accesorio);
                    $deck_cartas_productos.innerHTML = template;
                }
                lista_productos = array;
            })
            })
            .fail(function () {
                console.log('Err');
            });
    })

    $('#form_modal_nuevo_pedido').submit(function (e) { 
        e.preventDefault();
        var lista_id_productos = [];
        var descripcion = $('#detalle_pedido').val();

        lista_productos.forEach(elemento => {
            lista_id_productos.push(elemento.id_producto);
        });
        $.ajax({
            url: "../../functions/php/pedidos/nuevo_pedido.php",
            type: "POST",
            data: { 
                lista_productos : lista_id_productos,
                descripcion : descripcion 
            }
        })
        .done(function (res) {
            if(res == 'true'){
                limpiar_pedido();
                $('#modal_nuevo_pedido').modal('hide');
                $('#indicador_de_que_no_hay_nada2').attr('hidden', 'hidden');
                Swal.fire({
                    html: '<h5 style="color: white">Muy bien, creaste un pedido</h5>',
                    width: 600,
                    padding: '3em',
                    confirmButtonText: 'A disfrutar',
                    background: '#fff url("https://static.vecteezy.com/system/resources/previews/000/776/561/non_2x/background-of-small-red-rocks-photo.jpg")',
                    backdrop: `
                    rgba(255,0,0,0.4)
                    url("http://www.elpatinete.com/gifsanimados/felices/x_toon.gif")
                    left top
                    no-repeat
                    `
                }) 
            }
        })
        .fail(function () {
        console.log('Err'); 
        });

    });

    $('#btn-pedido').click(function (e) { 
        e.preventDefault();
        var template = ``;
        var template2 = ``;
        var cont = 1;
        var precio = 0;
        var cantidad_de_cera = 0;
    
        lista_productos.forEach(function(elemento, index, object) {
            var id_contenedor = "ingrediente_fila_"+cont;
            template += `
            <div class="row" id=${id_contenedor}>
                <div class="col-md-10">
                    <p><i onclick="quitar_producto_pedido(${elemento.id_producto}, ${id_contenedor}, ${elemento.indice})" class="text-danger bi bi-trash"></i> ${elemento.nombre}</p>
                </div>
                <div class="col-md-2" style="text-align: right;">
                    <p class="text-info">$${(elemento.precio).toFixed(2)}</p>
                </div>
            </div>`
            
            $fila_producto2.innerHTML = template;
            cont = cont + 1;

            precio = precio + parseFloat((elemento.precio).toFixed (2));

            
        });

        precio = (precio.toFixed(2))
        template2 += `
            <div class="row">
                <div class="col-md-10">
                    <p><i class=" text-success bi bi-cash-coin"></i> Total </p>
                </div>
                <div class="col-md-2" style="text-align: right;">
                    <p class="text-success">$${precio}</p>
                </div>
            </div>`
            
        $total_pedido2.innerHTML = template2;

        $('#modal_nuevo_pedido').modal('show');
    });


    /* DECLARACION DE FUNCIONES */
    function dibuja_productos(accesorio){
        template = `<div class="col-sm-3 mt-1">
                        <div class='card' style="max-width: 20rem;">
                            <div class='card-body'>
                                <div class='row'>
                                    <div class='col-md-10'>
                                    <h5 class='text-success'>${accesorio.nombre}</h5>
                                    </div>
                                    <div class='col-md-2'>
                                        <a onclick="agregar_producto_al_pedido(${accesorio.id},'${accesorio.nombre}',${accesorio.precio})" role="button" class="btn btn-success btn-sm"><i class="bi bi-plus-circle"></i></a>
                                    </div>
                                </div>
                                <div>
                                    <div>Valor $${accesorio.precio}</div>
                                </div>
                            </div>
                        </div>
                    </div>`
        return template;
    }

    function dibuja_pedidos(pedido, id_contenedor){
        template = `<div class="col-sm-6 col-md-4 col-lg-4 col-xl-3 mt-1" id="carta_pedido_numero_${pedido.id}">
                        <div class='card mx-auto' style=" width: 17rem; min-height: 14rem;">
                            <div class='card-body'>
                            <div class='row'>
                                    <div class='col-md-6'>
                                        <h5 class='text-info'>Pedido ${pedido.id}</h5>
                                    </div>
                                    <div class='col-md-6' style="text-align: right !important">
                                        <p style="color : ${pedido.color}">${pedido.icono} ${pedido.texto_estado}</p>
                                    </div>
                            </div>
                                <div>Total $${pedido.precio_pedido}</div>
                                    <small class="text-info">${pedido.descripcion}</small>
                            </div>
                            <div class='card-footer'>
                            <button class="btn btn-block btn-primary btn-sm" onclick="cambiar_estado_de_pedido(${pedido.id},${pedido.estado_distinto})">Cambiar estado</button>
                                <div class="row mt-1 ">
                                    <div class="col-8">
                                        <button onclick="ver_detalles_pedido(${pedido.id}, ${pedido.precio_pedido})" class="btn btn-success btn-sm btn-block">Ver detalles</button>
                                    </div>
                                    <div class="col-4">
                                        <button onclick="eliminar_pedido(${pedido.id}, '${id_contenedor}')" class="btn btn-danger btn-sm btn-block">Quitar</button>
                                    </div>
                                </div>
                                </div>
                        </div>
                    </div>`
                    return template;
    }

    function dibujar_fila(elemento, id_contenedor){
        template = `<div class="row" id=${id_contenedor}>
                        <div class="col-md-7">
                            <div class="row">
                                <div class="col-md-1 mr-0 ml-0 pr-0">
                                    <p style="font-size: 0.9rem;" > ${elemento.cantidad}</p>
                                </div>
                                <div class="col-md-1 mr-0 ml-0 pr-0 pl-0">
                                    <p style="font-size: 0.9rem;" > - </p>
                                </div>
                                <div class="col-md-10 mr-0 ml-0 pl-0 pr-0">
                                    <p style="font-size: 0.9rem;" > ${elemento.nombre}</p>
                                </div>
                            </div>

                        </div>
                        <div class="col-md-5">
                            <div class="row" >
                                <div class="col-md-2"></div>
                                <div class="col-md-5 m-0 pr-3" style="font-size: 0.8rem; text-align: right;"><p class=" text-info"> $${elemento.unidad}</p></div>
                                <!-- <div class="col-md-2 m-0 pr-3" style="font-size: 0.8rem;  text-align: right;"></div> -->
                                <div class="col-md-5 m-0 pr-3" style="font-size: 0.8rem;  text-align: right;"><p class="text-danger"> $${elemento.total}</p></div>    
                            </div>
                            
                        </div>
                    </div>`
        return template;
    }

    function dibuja_descripcion_del_pedido(descripcion, id){
        template =
        `<div class="row h-100">
             <div class="col-md-11">
                 <input class="form-control" id="descripcion_pedido" value="${descripcion}">
             </div>
             <div class="col-md-1 my-auto" style="text-align: right;">
                 <i onclick="update_descripcion(${id})" class=" text-success bi bi-check-circle"></i>
             </div>
         </div>`;
         return template;
    }

    function dibuja_precio_detalles(precio){
        template = `<div class="row">
                        <div class="col-md-10">
                            <p><i class=" text-success bi bi-cash-coin"></i> Total </p>
                        </div>
                        <div class="col-md-2" style="text-align: right;">
                            <p class="text-success">$${precio}</p>
                        </div>
                    </div>`;
        return template;
    }

    function llamar_funciones_iniciales(){
        get_pedidos();
        get_productos(); 
    }

    function obtener_valor_cera() {
        $.ajax({
                url: "../../functions/php/pedidos/get_valor_cera.php",
                type: "GET"
            })
            .done(function (res) {
                var respuesta = JSON.parse(res);
                if(respuesta.length == 0){
                    valor_cera = 0;
                    llamar_funciones_iniciales();
                }else{  
                    valor_cera = parseInt(respuesta[0].precio);
                    llamar_funciones_iniciales();
                }
            })
            .fail(function (e) {
                console.log('Err');
                window.location.reload();
            })
    }

    function update_descripcion(id){
        var descripcion = $('#descripcion_pedido').val(); 
        if(descripcion == ''){
            Toast.fire({
                icon: 'error',
                title: 'No puede dejar el detalle vacio'
            })
        }
        else{
            $.ajax({
                url: "../../functions/php/pedidos/update_descripcion.php",
                type: "POST", 
                data: { id : id,
                        descripcion: descripcion
                }
            })
            .done(function (res) {
                Toast.fire({
                    icon: 'success',
                    title: 'Detalles actualizados'
                })            
            })
            .fail(function () {
                console.log('Err');
            });
        }
        
    }; 

    function eliminar_pedido(id, id_contenedor){

        var id_contenedor = '#'+id_contenedor;

        Swal.fire({
            html: 'Esta segura o seguro de eliminar el pedido?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar pedido',
            cancelButtonText: 'Volver'
          }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "../../functions/php/pedidos/eliminar_pedido.php",
                    type: "POST", 
                    data: { id : id
                    },
                })
                .done(function (res) {
                    console.log(res);
                    Toast.fire({
                        icon: 'success',
                        title: 'Pedido eliminado, para siempre'
                    }) 
                    $(id_contenedor).remove();
                })
                .fail(function () {
                    console.log('Err');
                });
            }
          })


        
    }

    function cambiar_estado_de_pedido(id, nuevo_estado) {
        $.ajax({
            url: "../../functions/php/pedidos/cambiar_estado_pedido.php",
            type: "POST", 
            data: { id : id,
            nuevo_estado: nuevo_estado
            }
        })
        .done(function (res) {
            get_pedidos();
        })
        .fail(function () {
            console.log('Err');
        });
    }

    function get_pedidos() {
        $.ajax({
                url: "../../functions/php/pedidos/get_pedidos_1.php",
                type: "GET"
        })
        .done(function (res) {
            $('#criterio_sort').val(0); 
            var array = JSON.parse(res);
            var template = ``;
            if(array.length == 0){ 
                $('#indicador_de_que_no_hay_nada2').removeAttr('hidden');
            }
            array.forEach((pedido) => {
                var id_contenedor = "carta_pedido_numero_"+pedido.id;
                predido = refactor_predido(pedido, 1);
                template += dibuja_pedidos(pedido, id_contenedor);
                $deck_cartas_pedidos.innerHTML = template;
            })
            
        })
        .fail(function () {
            console.log('Err');
        });      
    }

    function refactor_predido(pedido, compare_estado_con){
        if (pedido.estado == compare_estado_con) {
            pedido.texto_estado = "Pendiente";
            pedido.estado_distinto = 2;
            pedido.color = 'orange';
            pedido.icono = '<i style="color: orange" class="bi bi-stopwatch"></i>';
        } else {
            pedido.texto_estado = "Entregado";
            pedido.estado_distinto = 1;
            pedido.color = 'green';
            pedido.icono = '<i style="color: green" class="bi bi-bag-check"></i>';
        }
        if(parseInt(pedido.cantidad_cera) > 0 ){
            var precio_actual = parseFloat(pedido.precio_pedido);
            var cantidad_de_cera = parseInt(pedido.cantidad_cera);
            var precio_subtotal = parseFloat(precio_actual) - (parseInt(pedido.unidades_cera) * parseFloat(valor_cera));
            var precio_final = parseFloat(precio_subtotal) + ((cantidad_de_cera*valor_cera)/100);
            pedido.precio_pedido = precio_final; 
        }
        return pedido;
    }

    function get_pedidos_filtrado(estado) {
        $.ajax({
                url: "../../functions/php/pedidos/get_pedidos_1.php",
                type: "GET",
            }) 
            .done(function (res) {
                var array = JSON.parse(res);
                var template = ``;
                array.forEach((pedido) => {
                    var id_contenedor = "carta_pedido_numero_"+pedido.id;
                    pedido = refactor_predido(pedido, estado);
                    template += dibuja_pedidos(pedido, id_contenedor);
                    $deck_cartas_pedidos.innerHTML = template;
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

    function filtrado_lista(criterio) {
        switch (criterio) {
            case "0": {
                get_pedidos()
                };
              break;
            case "1": {
                get_pedidos_filtrado(2)
                };
              break;
            case "2": {
                get_pedidos_filtrado(1)
                };
              break;
        }
    }

    function ver_detalles_pedido(id, precio){ 
        $.ajax({ 
            url: "../../functions/php/pedidos/get_pedidos.php",
            type: "POST", 
            data: { id : id }
        })
        .done(function (res) {
            var array1 = JSON.parse(res);
            var template = ``;
            var template2 = ``;
            var template3 = ``;
            var cont = 1;
            var array2 = [];
            var descripcion = array1[0].descripcion;
            template2 = dibuja_descripcion_del_pedido(descripcion,id);
            $update_descripcion_del_pedido.innerHTML = template2;
            $id_pedido.innerHTML= id;

            array1.forEach(elemento => {
                if(parseInt(elemento.cantidad_cera) > 0 ){
                    var precio_actual = parseFloat(elemento.precio);
                    var cantidad_de_cera = parseInt(elemento.cantidad_cera);
                    var precio_subtotal = parseFloat(precio_actual) - parseFloat(valor_cera);
                    var precio_final = parseFloat(precio_subtotal) + ((cantidad_de_cera*valor_cera)/100);
                    elemento.precio = precio_final;  
                }
                if (array2.some(item => item.nombre === elemento.nombre)){
                    array2.findIndex(function(post, index) {
                        if(post.nombre == elemento.nombre) {
                            array2[index].cantidad ++;
                            var total = parseFloat(array2[index].total);
                            var precio_aca = parseFloat(elemento.precio);
                            array2[index].total = total + precio_aca;
                        }
                    }); 
                } else {
                    let obj = {
                        nombre: elemento.nombre, 
                        cantidad: 1, 
                        total: elemento.precio, 
                        unidad: elemento.precio
                    }
                    array2.push(obj);
                }          
            });      
            array2.forEach(elemento => {
                var id_contenedor = "producto_fila_"+cont;
                template += dibujar_fila(elemento, id_contenedor);
                $fila_producto.innerHTML = template;
                cont = cont + 1; 
            });

            template3 = dibuja_precio_detalles(precio);
            $fila_producto_total.innerHTML = template3;
            $('#modal_vista_pedido').modal('show');
        })
        .fail(function () {
            console.log('Err');
        });
    } 

    function get_productos(){
        $.ajax({
            url: "../../functions/php/almacen/get_productos_1.php",
            type: "GET"
        })
        .done(function (res) {
            var array = JSON.parse(res);
            var template = ``;
            if(array.length == 0){
                $('#indicador_de_que_no_hay_nada').removeAttr('hidden');
            }
            array.forEach((accesorio) => {
                if (accesorio.estado == 0 ){
                    if(parseInt(accesorio.cantidad_cera) > 0 ){
                        var precio_actual = parseFloat(accesorio.precio);
                        var cantidad_de_cera = parseInt(accesorio.cantidad_cera);
                        var precio_subtotal = parseFloat(precio_actual) - parseFloat(valor_cera);
                        var precio_final = parseFloat(precio_subtotal) + ((cantidad_de_cera*valor_cera)/100);
                        accesorio.precio = precio_final; 
                    }
                    template += dibuja_productos(accesorio);
                    $deck_cartas_productos.innerHTML = template;
                }
            })
        })
        .fail(function () {
        console.log('Err'); 
        });
    }
 
    function agregar_producto_al_pedido(id, nombre, precio) {
            var indice = crea_indice(lista_productos.length, lista_productos);
            var obj = {
                id_producto: id,
                nombre: nombre,
                precio: precio,
                indice: indice
            }
            Toast.fire({
                icon: 'success',
                title: 'Agregaste ' + nombre + ' al Pedido'
            })
            lista_productos.push(obj); 
            $('#contenderdor_botones').removeAttr('hidden');
            $('#btn-pedido').removeAttr('hidden');
            $('#btn-limpia-pedido').removeAttr('hidden');
    }

    function crea_indice(indice, array) {
        if (indice == 0) {
            return indice;
        } else {
            const found = array.find(elemento => elemento.indice == indice);
            if (!found) {
                return indice;
            } else {
                return crea_indice(indice + 1, array);
            }
        }
    }

    function limpiar_pedido(){
        $('#modal_nuevo_pedido').trigger('reset');
        lista_productos = [];
        var template = ``;
        var template2 = ``;
        $fila_producto2.innerHTML = template;
        $total_pedido2.innerHTML = template2;
        $('#contenderdor_botones').attr('hidden','hidden');
        $('#btn-pedido').attr('hidden','hidden');
        $('#btn-limpia-pedido').attr('hidden','hidden');
        get_pedidos();
    }

    function quitar_producto_pedido(id_elemento, id_contenedor, indice){
        const found  = lista_productos.findIndex(elemento => elemento.indice == indice);
        var indice_a_quitar = found;
        var contenedor = '#'+id_contenedor.id;
        var template2 = ``;
        var precio = 0;
        lista_productos.splice(indice_a_quitar, 1);
        $(contenedor).remove();
        
        lista_productos.forEach(elemento => {
            precio = precio + (parseFloat((elemento.precio).toFixed(2)));
        })
        
        template += dibuja_precio_detalles(precio);
        $total_pedido2.innerHTML = template2;
        
        if(lista_productos.length == 0){
            $('#contenderdor_botones').attr('hidden','hidden');
            $('#btn-pedido').attr('hidden','hidden');
            $('#btn-limpia-pedido').attr('hidden','hidden');
            $('#modal_nuevo_pedido').modal('hide');
            $('#form_modal_nuevo_pedido').trigger('reset');
            Toast.fire({
                icon: 'warning',
                title: 'El pedido quedo vacio'
            })
        }
    }

}