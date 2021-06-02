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
    get_pedidos();
    get_productos();


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
                console.log(array);
                var template = ``;
            array.forEach((accesorio) => {
                console.log(array);
                if (accesorio.estado == 0 ){
                            if(parseInt(accesorio.cantidad_cera) > 0 ){
                                var precio_actual = parseFloat(accesorio.precio);
                                var cantidad_de_cera = parseInt(accesorio.cantidad_cera);
                                // console.log(valor_cera);
                                var precio_subtotal = parseFloat(precio_actual) - parseFloat(valor_cera);
                                var precio_final = parseFloat(precio_subtotal) + ((cantidad_de_cera*valor_cera)/100);
                                accesorio.precio = precio_final; 
                                
                            }
                        
    
                        template += `<div class="col-sm-3 mt-1">
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
                Swal.fire({
                    title: 'Felicitaciones por tu nuevo pedido ',
                    width: 600,
                    padding: '3em',
                    confirmButtonText: 'A disfrutar',
                    background: '#fff url("https://images.vexels.com/media/users/3/166834/preview2/4213467a1f2589af7c27350ca54428f7-patron-de-flores-y-hojas-tropicales.jpg")',
                    backdrop: `
                    rgba(50,150,50,0.4)
                    url("https://i.pinimg.com/originals/04/5f/eb/045feb8f000006137ae43ea7a7ec9be1.gif")
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
    function cambiar_estado_de_pedido(id, nuevo_estado) {
        console.log(id,nuevo_estado);
        $.ajax({
            url: "../../functions/php/pedidos/cambiar_estado_pedido.php",
            type: "POST", 
            data: { id : id,
            nuevo_estado: nuevo_estado
            },
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
                // console.log(array);
                var template = ``;
                array.forEach((producto) => {
                    var texto_estado;
                    var estado_distinto;
                    var color;
                    var icono;
                    if (producto.estado == 1) {
                        texto_estado = "Pendiente";
                        estado_distinto = 2;
                        color = 'orange';
                        icono = '<i style="color: orange" class="bi bi-stopwatch"></i>';
                    } else {
                        texto_estado = "Entregado";
                        estado_distinto = 1;
                        color = 'green';
                        icono = '<i style="color: green" class="bi bi-bag-check"></i>';
                    }
                    // console.log(producto);
                    if(parseInt(producto.cantidad_cera) > 0 ){
                        // console.log('cambiar el precio');
                        var precio_actual = parseFloat(producto.precio_pedido);
                        var cantidad_de_cera = parseInt(producto.cantidad_cera);
                        // console.log(valor_cera);
                        var precio_subtotal = parseFloat(precio_actual) - (parseInt(producto.unidades_cera) * parseFloat(valor_cera));
                        var precio_final = parseFloat(precio_subtotal) + ((cantidad_de_cera*valor_cera)/100);
                        producto.precio_pedido = precio_final; 
                        
                    }
                    
                    let nombre_vela = capitalize(producto.nombre);
                    template += `<div class="col-sm-3 mt-3">
                                <div class='card' style="max-width: 20rem;">
                                    <div class='card-body'>
                                    <div class='row'>
                                            <div class='col-md-6'>
                                                <h5 class='text-info'>Pedido ${producto.id}</h5>
                                            </div>
                                            <div class='col-md-6' style="text-align: right !important">
                                                <p style="color : ${color}">${icono} ${texto_estado}</p>
                                            </div>
                                    </div>
                                        <div>Total $${producto.precio_pedido}</div>
                                            <small class="text-info">${producto.descripcion}</small>
                                    </div>
                                    <div class='card-footer'>
                                    <button class="btn btn-block btn-primary" onclick="cambiar_estado_de_pedido(${producto.id},${estado_distinto})">Cambiar estado</button>
                                            <button onclick="ver_detalles_pedido(${producto.id}, ${producto.precio_pedido}, '${producto.descripcion}')" class="btn btn-success btn-block">Ver detalles</button>
                                        </div>
                                </div>
                            </div>`
                    $deck_cartas_pedidos.innerHTML = template;
                })
                
            })
            .fail(function () {
                console.log('Err');
            });

            
    }

    function get_pedidos_filtrado(estado) {
        $.ajax({
                url: "../../functions/php/pedidos/get_pedidos_1.php",
                type: "GET",
                
            })
            .done(function (res) {
                
                var array = JSON.parse(res);
                console.log(array);
                var template = ``;
                array.forEach((producto) => {
                    if (producto.estado == estado) {

                    
                    var texto_estado;
                    var estado_distinto;
                    if (producto.estado == 1) {
                        texto_estado = "Pendiente";
                        estado_distinto = 2;
                        color = 'orange';
                        icono = '<i style="color: orange" class="bi bi-stopwatch"></i>';
                    } else {
                        texto_estado = "Entregado";
                        estado_distinto = 1;
                        color = 'green';
                        icono = '<i style="color: green" class="bi bi-bag-check"></i>';
                    }
                    
                    if(parseInt(producto.cantidad_cera) > 0 ){
                        // console.log('cambiar el precio');
                        var precio_actual = parseFloat(producto.precio_pedido);
                        var cantidad_de_cera = parseInt(producto.cantidad_cera);
                        // console.log(valor_cera);
                        var precio_subtotal = parseFloat(precio_actual) - (parseInt(producto.unidades_cera) * parseFloat(valor_cera));
                        var precio_final = parseFloat(precio_subtotal) + ((cantidad_de_cera*valor_cera)/100);
                        producto.precio_pedido = precio_final; 
                        
                    }
                    
                    let nombre_vela = capitalize(producto.nombre);
                    template += `<div class="col-sm-3 mt-3">
                    <div class='card' style="max-width: 20rem;">
                        <div class='card-body'>
                        <div class='row'>
                                <div class='col-md-6'>
                                    <h5 class='text-info'>Pedido ${producto.id}</h5>
                                </div>
                                <div class='col-md-6' style="text-align: right !important">
                                    <p style="color : ${color}">${icono} ${texto_estado}</p>
                                </div>
                        </div>
                            <div>Total $${producto.precio_pedido}</div>
                                <small class="text-info">${producto.descripcion}</small>
                        </div>
                        <div class='card-footer'>
                        <button class="btn btn-block btn-primary" onclick="cambiar_estado_de_pedido(${producto.id},${estado_distinto})">Cambiar estado</button>
                                <button onclick="ver_detalles_pedido(${producto.id}, ${producto.precio_pedido}, '${producto.descripcion}')" class="btn btn-success btn-block">Ver detalles</button>
                            </div>
                    </div>
                </div>`
                    $deck_cartas_pedidos.innerHTML = template;
                }
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

    function obtener_valor_cera() {
        $.ajax({
                url: "../../functions/php/pedidos/get_valor_cera.php",
                type: "GET"
            })
            .done(function (res) {
                var precio = JSON.parse(res);
                valor_cera = parseInt(precio[0].precio);
                // console.log(valor_cera);
            })
            .fail(function (e) {
                console.log('Err');
            })
    }

    function ver_detalles_pedido(id, precio, descripcion){ 
        $.ajax({
            url: "../../functions/php/pedidos/get_pedidos.php",
            type: "POST", 
            data: { id : id },
        })
        .done(function (res) {
            var array1 = JSON.parse(res);
            console.log(array1);
            $('#descripcion_pedido').text(descripcion);
            var template = ``;
            var cont = 1;
            var array2 = [];
            var contador = 0;
            $id_pedido.innerHTML= id;
            array1.forEach(elemento => {
                    if(parseInt(elemento.cantidad_cera) > 0 ){
                        var precio_actual = parseFloat(elemento.precio);
                        var cantidad_de_cera = parseInt(elemento.cantidad_cera);
                        console.log(valor_cera);
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
                
                template += `
                <div class="row" id=${id_contenedor}>
                    <div class="col-md-7">
                        <div class="row">
                            <div class="col-md-1 mr-0 ml-0 pr-0">
                                <p style="font-size: 0.9rem;" > ${elemento.cantidad} </p>
                            </div>
                            <div class="col-md-1 mr-0 ml-0 pr-0 pl-0">
                                <p style="font-size: 0.9rem;" > - </p>
                            </div>
                            <div class="col-md-10 mr-0 ml-0 pl-0 pr-0">
                                <p style="font-size: 0.9rem;" >  ${elemento.nombre}</p>
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
                
                $fila_producto.innerHTML = template;
                cont = cont + 1; 
            });
            $fila_producto_total.innerHTML = 
                `<div class="row">
                    <div class="col-md-10">
                        <p><i class=" text-success bi bi-cash-coin"></i> Total </p>
                    </div>
                    <div class="col-md-2" style="text-align: right;">
                        <p class="text-success">$${precio}</p>
                    </div>
                </div>`;

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
            // console.log(array);
            var template = ``;
        array.forEach((accesorio) => {
            if (accesorio.estado == 0 ){
                        if(parseInt(accesorio.cantidad_cera) > 0 ){
                            var precio_actual = parseFloat(accesorio.precio);
                            var cantidad_de_cera = parseInt(accesorio.cantidad_cera);
                            // console.log(valor_cera);
                            var precio_subtotal = parseFloat(precio_actual) - parseFloat(valor_cera);
                            var precio_final = parseFloat(precio_subtotal) + ((cantidad_de_cera*valor_cera)/100);
                            accesorio.precio = precio_final; 
                            
                        }
                    

                    template += `<div class="col-sm-3 mt-1">
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
            
            let obj = {
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
            //ordenar_lista(lista_productos); 
            $('#contenderdor_botones').removeAttr('hidden');
            $('#btn-pedido').removeAttr('hidden');
            $('#btn-limpia-pedido').removeAttr('hidden');
        
    }

    function limpiar_pedido() {
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

    function limpiar_pedido2(){
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
        Toast.fire({
            icon: 'success',
            title: 'Producto destruido'
        })
    }

    function quitar_producto_pedido(id_elemento, id_contenedor, indice){


        const found  = lista_productos.findIndex(elemento => elemento.indice == indice);
        var indice_a_quitar = found;
        lista_productos.splice(indice_a_quitar, 1);


        var contenedor = '#'+id_contenedor.id;
        $(contenedor).remove();

        var template2 = ``;
        var template3 = ``;
        var template4 = ``;
        var cont = 1;
        var precio = 0;
        lista_productos.forEach(elemento => {
            precio = precio + (parseFloat((elemento.precio).toFixed(2)));
        })
        
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