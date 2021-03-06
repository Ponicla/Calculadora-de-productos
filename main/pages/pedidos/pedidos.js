if(window.location.pathname == ruta+'pedidos/pedidos.php'){


     /* DECLARACION DE VARIABLES */
     var $deck_cartas_pedidos = document.querySelector('#deck_cartas_pedidos');
     var $deck_cartas_productos = document.querySelector('#deck_cartas_productos');
     var $div_paginador = document.querySelector('#div_paginador');
     var $paginador = document.querySelector('#paginador');
     var $fila_producto = document.querySelector('#fila_producto');
     var $fila_producto2 = document.querySelector('#fila_producto2');
     var $total_pedido2 = document.querySelector('#total_pedido2');
     var $fila_producto_total = document.querySelector('#fila_producto_total');
     var $total_producto = document.querySelector('#total_producto');
     var $id_pedido = document.querySelector('#id_pedido');
     var $update_descripcion_del_pedido = document.querySelector('#update_descripcion_del_pedido');
     var lista_productos = [];
     var lista_productos_inalterable = [];
     var lista_de_pedidos_inalterable = [];
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
     $("#boton-productos").click(contenido_boton_mostrar = function (e) {
        if ($("#div_deck_cartas_productos").hasClass("show")) {
            $("#boton-productos").html(`<i class="bi bi-eye"></i> Mostrar productos`);
        } else {
            $("#boton-productos").html(`<i class="texto-boton bi bi-eye-slash"></i> Ocultar productos`);
        };
     });

    $("#producto_buscado").keyup(function () {  
        filtrar_productos($("#producto_buscado").val());
        if (!$("#div_deck_cartas_productos").hasClass("show")) { 
            contenido_boton_mostrar();
            $("#div_deck_cartas_productos").addClass("show");
        };
    });

    $('#form_modal_nuevo_pedido').submit(function (e) { 
        e.preventDefault();
        var lista_id_productos = [];

        var descripcion = $('#detalle_pedido').val();
        
        lista_productos.forEach(elemento => {
            let el = {
                id: elemento.id_producto,
                precio: elemento.precio
            }
            lista_id_productos.push(el);
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
            //console.log(res);
            if(res == 'true'){
                limpiar_pedido();
                $('#form_modal_nuevo_pedido').trigger('reset');
                $('#indicador_de_que_no_hay_nada2').attr('hidden', 'hidden');
                Swal.fire({
                    html: '<h5 style="color: white">Muy bien, creaste un pedido</h5>',
                    width: 600,
                    padding: '3em',
                    confirmButtonText: 'A disfrutar',
                    background: '#fff url("https://static.vecteezy.com/system/resources/previews/000/776/561/non_2x/background-of-small-red-rocks-photo.jpg")',
                    backdrop: `
                    rgba(255,0,0,0.4)

                    left top
                    no-repeat
                    `
                }) 
                $('#modal_nuevo_pedido').modal('hide');
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
        // console.log(lista_productos);
        lista_productos.forEach(function(elemento, index, object) {
            var id_contenedor = "ingrediente_fila_"+cont;
            var precio_para_enviar = (elemento.precio.toFixed(2));
            template += dibujar_fila_2(id_contenedor, elemento, precio_para_enviar);
            $fila_producto2.innerHTML = template;
            cont = cont + 1;
            precio = precio + parseFloat((elemento.precio.toFixed(2)));
        });
        precio = (precio.toFixed(2));
        template2 += dibuja_precio_detalles(precio);
        $total_pedido2.innerHTML = template2;
        $('#modal_nuevo_pedido').modal('show');
    });

    $("#pedido_buscado").keyup(function () {
        $('#paginador').val("1");
        buscar_pedido();
        
    });

    $("#criterio_pedido").on('change', function() {
        $('#paginador').val("1");
        buscar_pedido();
        
    });


    /* DECLARACION DE FUNCIONES */
    function buscar_pedido(){
        var lista = [];
        var pedido_buscado = $('#pedido_buscado').val();
        var criterio_filtro = $('#criterio_pedido').val();

        lista_de_pedidos_inalterable.forEach(elemento => {
            let buscado = pedido_buscado.toLowerCase();
            let descripcion = elemento.descripcion.toLowerCase();
            if(descripcion.includes(buscado)){
                if(criterio_filtro == 0){
                    lista.push(elemento);
                }else{
                    if(elemento.estado != criterio_filtro){
                        lista.push(elemento);
                    }
                }
            } 
        });
        mostrar_lista_pedidos_filtrada(paginado(lista));
    }

    function mostrar_lista_pedidos_filtrada(lista) {
        var template = ``;
        if(lista.length == 0){
            template = dibuja_lista_filtrada_vacia();
            $deck_cartas_pedidos.innerHTML = template;
        }else{
            $("#cantidad_paginas").text("de "+$('#paginador option').length);
            lista.forEach((pedido) => {
                if (pedido.Pagina == $('#paginador').val()) {  
                    var id_contenedor = "carta_pedido_numero_"+pedido.id;
                    pedido = refactor_predido(pedido, 1);
                    template += dibuja_pedidos(pedido, id_contenedor);
                    $deck_cartas_pedidos.innerHTML = template; 
                }
            }) 
        }
        
    }

    function filtrar_productos(buscado) {
        var array = lista_productos_inalterable;
        var lista = [];
                array.forEach(elemento => {
                    if (elemento.nombre.toLowerCase().includes(buscado.toLowerCase()) && (elemento.estado == 0)){
                        lista.push(elemento);
                    } 
                });
                mostrar_productos(lista);
    }

    function mostrar_productos(array) { 
        var template = ``;
        $deck_cartas_productos.innerHTML = template;
        if(array.length == 0){
            template += dibujar_no_coincidencias();
            $deck_cartas_productos.innerHTML = template;
        }else{
            array.forEach((producto) => {
                template += dibuja_productos(producto);
                $deck_cartas_productos.innerHTML = template;
            })
        }
       
    }

    function dibujar_fila_2(id_contenedor, elemento, precio){
        template = 
        `<div class="row" id=${id_contenedor} >
            <div class="col-md-9">
                <p><i onclick="quitar_producto_pedido(${elemento.id_producto}, ${id_contenedor}, ${elemento.indice})" class="text-danger bi bi-trash"></i> ${elemento.nombre}</p>
            </div>
            <div class="col-md-3" style="text-align:right">
                <p class="text-info " >$${precio}</p>
                
            </div>
        </div>`
        return template;
    }

    function dibujar_no_coincidencias(){
        template = 
            `<div class="container-fluid">
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-emoji-frown"></i> No hay coincidencias
                </div>
            </div>`
        return template;
    }

    function dibuja_productos(accesorio){
        template = `<div class="col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-1">
                        <div class="card mb-3 border border-primary mx-auto" style="min-width: 15rem; max-width: 17rem;">
                            <div class='card-body pt-3'>
                                <div class='row'>
                                    <div class='col-md-12'>
                                    <h6 class='text-dark '>${accesorio.nombre}</h6>
                                    </div>
                                    
                                </div>
                                <hr class="mt-0 bg-primary">
                                <div>
                                    <div>Valor $${accesorio.precio}</div>
                                </div>
                            </div>
                            <div class='card-footer  border-primary col-md-12'>
                            <a onclick="agregar_producto_al_pedido(${accesorio.id},'${accesorio.nombre}',${accesorio.precio})" role="button" class="btn btn-primary btn-sm " style="width:100%">Agregar al pedido</a>
                        </div>
                        </div>
                    </div>`
        return template;
    }

    function dibuja_pedidos(pedido, id_contenedor){
        
        if (pedido.estado == 2) {
            carta_borde = "border-success";
            boton_estado_color = "btn-warning";
            boton_estado_texto = "Cambiar a pendiente";
        } else {
            carta_borde = "border-warning";
            boton_estado_color = "btn-success"
            boton_estado_texto = "Cambiar a entregado";
        }
        template = `<div class="col-sm-6 col-md-4 col-lg-4 col-xl-3 mt-1" id="carta_pedido_numero_${pedido.id}">
                        <div class='card mb-3 mx-auto ${carta_borde}' style=" width: 17rem; min-height: 14rem;">
                            <div class='card-body'>
                            <div class='row'>
                                    <div class='col-md-6'>
                                        <h5 class='text-info'>Pedido ${pedido.id}</h5>
                                    </div>
                                    <div class='col-md-6' style="text-align: right !important">
                                        <p style="color : ${pedido.color}; margin-bottom: 0">${pedido.icono} ${pedido.texto_estado}</p>
                                        <p style="margin-bottom: 0"><small class="text-info">${pedido.fecha}</small></p>
                                    </div>
                            </div>
                                <div>Total $${pedido.precio_pedido}</div>   
                                <small class="text-info">${pedido.descripcion}</small>
                            </div>
                            <div class='card-footer ${carta_borde}'>
                            <button class="text-white btn btn-block ${boton_estado_color} btn-sm" onclick="cambiar_estado_de_pedido(${pedido.id},${pedido.estado_distinto}, '${id_contenedor}')">${boton_estado_texto}</button>
                                <div class="row mt-1 ">
                                    <div class="col-8 pr-0">
                                        <button onclick="ver_detalles_pedido(${pedido.id}, ${pedido.precio_pedido})" class="btn btn-primary btn-sm btn-block">Ver detalles</button>
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
                                    <p style="font-size: 0.9rem;" >${elemento.cantidad}</p>
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
                                <div class="col-md-5 m-0 pr-0" style="font-size: 0.8rem; text-align: right;"><p class=" text-info"> $${elemento.unidad}</p></div>
                                <!-- <div class="col-md-2 m-0 pr-3" style="font-size: 0.8rem;  text-align: right;"></div> -->
                                <div class="col-md-5 m-0 pl-0" style="font-size: 0.8rem;  text-align: right;"><p class="text-danger"> $${elemento.total}</p></div>    
                            </div>
                            
                        </div>
                    </div>`
        return template;
    }

    function dibuja_descripcion_del_pedido(descripcion, id){
        template =
        `<div class="row h-100">
             <div class="col-md-11">
                 <input class="form-control" maxlength="100" id="descripcion_pedido" value="${descripcion}">
             </div>
             <div class="col-md-1 my-auto" style="text-align: right;">
                 <i onclick="update_descripcion(${id})" class=" text-success bi bi-check-circle"></i>
             </div>
         </div>`;
         return template;
    }

    function dibuja_precio_detalles(precio){
        template = `<div class="row">
                        <div class="col-md-4">
                            <p><i class=" text-success bi bi-cash-coin"></i> Total </p>
                        </div>
                        <div class="col-md-8" style="text-align: right;">
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
                get_pedidos();

                $('#form_modal_vista_producto').trigger('reset');
                $('#modal_vista_pedido').modal('hide');
                

            })
            .fail(function () {
                console.log('Err');
            });
        }
        
    }; 

    function eliminar_pedido(id, id_contenedor){

        //var id_contenedor = '#'+id_contenedor;

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
                    //$(id_contenedor).remove();
                    get_pedidos();
                    
                })
                .fail(function () {
                    console.log('Err');
                });
            }
          })
    }

    function cambiar_estado_de_pedido(id, nuevo_estado, id_contenedor) {
        $.ajax({
            url: "../../functions/php/pedidos/cambiar_estado_pedido.php",
            type: "POST", 
            data: { id : id,
            nuevo_estado: nuevo_estado
            }
        })
        .done(function (res) {
            // var template = ``;
            // var lista = [];
            // var estado_actual = $('#criterio_pedido').val();
            // id_contenedor = '#'+id_contenedor;
            // const buscado = lista_de_pedidos_inalterable.find(elemtno => elemtno.id == id);
            
            // if(buscado){
            //     buscado.estado = nuevo_estado;
            // }
            
            // lista_de_pedidos_inalterable.forEach(pedido => {
            //     if(pedido.estado != estado_actual || estado_actual == 0){
            //         lista.push(pedido);
            //     }
            // });

            // if(lista.length == 0){
            //     template = dibujar_no_coincidencias();
                
            // }else{
            //     lista.forEach(pedido => {
            //         pedido = refactor_predido(pedido, 1);
            //         template += dibuja_pedidos(pedido);
            //     });
            // }

            // $deck_cartas_pedidos.innerHTML = template;
        


            get_pedidos();

        
            
            if(nuevo_estado == 2){
                Toast.fire({
                    icon: 'success',
                    title: 'Pedido movido a entregados'
                })
            }else if(nuevo_estado == 1) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Pedido movido a pendientes'
                })
            }
        })
        .fail(function () {
            console.log('Err');
        });
    }

    function paginado(lista) {    
        var valor_paginador = $('#paginador').val(); 
        if (valor_paginador == undefined) { valor_paginador = 1}
        var aux = [];
        var cartas_por_pagina = $('#cantidad_por_pagina').val();
        
        var n = 1;
        var c = 0;
        var template = "";

        if(lista.length == 0){
            $('#paginador').innerHTML = template;
        }else{
        lista.forEach(function callback(pedido, index) {
                if (c < cartas_por_pagina) {
                    c++;
                } else {
                    c = 1;
                    n++;
                }
                pedido["Pagina"] = n;
                aux.push(pedido);           
          });
          template = `<select id="paginador" class="form-control" onchange="buscar_pedido()">`;
                for (i=1;i<=n;i++) {
                    if (i == valor_paginador) {
                        template += `<option value="${i}" selected >${i}</option>`;
                    } else {
                        template += `<option value="${i}">${i}</option>`;
                    }
                }
            template += `</select>`;
           $div_paginador.innerHTML = template;
        }
          return aux;

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
                predido = refactor_predido(pedido, 0);
                template += dibuja_pedidos(pedido, id_contenedor);
                $deck_cartas_pedidos.innerHTML = template;
            })
            lista_de_pedidos_inalterable = array;
            buscar_pedido();
        })
        .fail(function () {
            console.log('Err');
        });      
    }

    function refactor_predido(pedido, viene_de_filtrado){
        // console.log(pedido.estado);
        var date = new Date(pedido.fecha);
        var dia = date.getDate();
        var mes = date.toLocaleString("es-ES", { month: "long" });
        var ano = date.getFullYear();
        var fecha = dia + " " + mes + " " +ano;

        if (pedido.estado == 1) {
            pedido.fecha = fecha;
            pedido.texto_estado = "Pendiente";
            pedido.estado_distinto = 2;
            pedido.color = 'orange';
            pedido.icono = '<i style="color: orange" class="bi bi-stopwatch"></i>';
        } else {
            pedido.fecha = fecha;
            pedido.texto_estado = "Entregado";
            pedido.estado_distinto = 1;
            pedido.color = 'green';
            pedido.icono = '<i style="color: green" class="bi bi-bag-check"></i>';
        }
        /* if(viene_de_filtrado == 0){
            if(parseInt(pedido.cantidad_cera) > 0 ){
                var precio_actual = parseFloat(pedido.precio_pedido);
                var cantidad_de_cera = parseInt(pedido.cantidad_cera);
                var precio_subtotal = parseFloat(precio_actual) - (parseInt(pedido.unidades_cera) * parseFloat(valor_cera));
     
                var precio_final = parseFloat(precio_subtotal) + (((cantidad_de_cera*valor_cera))/100);
                pedido.precio_pedido = precio_final; 
            }
        } */
        return pedido;
    }


    function get_pedidos_filtrado(estado) {
        var template = ``;
        var lista = [];
        lista_de_pedidos_inalterable.forEach(element => {
            if(element.estado == estado){
                lista.push(element);
            }
        });
        if(lista.length == 0){
            template = dibuja_lista_filtrada_vacia();
            $deck_cartas_pedidos.innerHTML = template;
        }else{
            lista.forEach((pedido) => {
                var id_contenedor = "carta_pedido_numero_"+pedido.id;
                pedido = refactor_predido(pedido, 1);
                template += dibuja_pedidos(pedido, id_contenedor);
                $deck_cartas_pedidos.innerHTML = template; 
            }) 
        }
    }

    function dibuja_lista_filtrada_vacia(){
        template = 
            `<div class="container-fluid">
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-emoji-frown"></i> No hay pedidos que cumplan esta condicion
                </div>
            </div>`;
        return template;
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
            // var array = JSON.parse(res);
            // var template = ``;
            // if(array.length == 0){
            //     $('#indicador_de_que_no_hay_nada').removeAttr('hidden');
            // }
            // array.forEach((accesorio) => {
            //     if (accesorio.estado == 0 ){
            //         if(parseInt(accesorio.cantidad_cera) > 0 ){
            //             var precio_actual = parseFloat(accesorio.precio);
            //             var cantidad_de_cera = parseInt(accesorio.cantidad_cera);
            //             var precio_subtotal = parseFloat(precio_actual) - parseFloat(valor_cera);
            //             var precio_final = parseFloat(precio_subtotal) + ((cantidad_de_cera*valor_cera)/100);
            //             accesorio.precio = precio_final; 
            //         }
            //         template += dibuja_productos(accesorio);
            //         $deck_cartas_productos.innerHTML = template;
            //     }
            // })

            var array = JSON.parse(res);
                var template = ``;
                var cont = 0;
                if(array.length == 0){
                    $('#indicador_de_que_no_hay_nada').removeAttr('hidden');
                }
                array.forEach((producto) => {
                    if (producto.estado == 0 ){
                        cont = cont + 1;
                        var id_contenedor_cantidad = "cantidad_cera_traida_" + cont;
                        var nombre_vela = capitalize(producto.nombre);
                        if (producto.cantidad_cera > 0) {
                            producto.precio = parseInt(producto.precio) - parseInt(valor_cera);
                            producto.precio += ((parseInt(producto.cantidad_cera) * parseInt(valor_cera)) / 100);
                            template += dibuja_productos(producto, id_contenedor_cantidad, nombre_vela);
                        } else {
                            template += dibuja_productos(producto, id_contenedor_cantidad, nombre_vela);
                        }
                        $deck_cartas_productos.innerHTML = template;
                    }   
                })
                lista_productos_inalterable = array;
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
        $('#form_modal_nuevo_pedido').trigger('reset');
        lista_productos = [];
        var template = ``;
        var template2 = ``;
        $fila_producto2.innerHTML = template;
        $total_pedido2.innerHTML = template2;
        $('#contenderdor_botones').attr('hidden','hidden');
        $('#btn-pedido').attr('hidden','hidden');
        $('#btn-limpia-pedido').attr('hidden','hidden');
        Toast.fire({
            icon: 'success',
            title: 'Pedido destruido'
        })
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
        
        template = dibuja_precio_detalles(precio);
        $total_pedido2.innerHTML = template;
        
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