if (window.location.pathname == ruta + 'almacen/almacen.php') {
    
    /* DECLARACION DE VARIABLES */
    var $deck_cartas_productos = document.querySelector('#deck_cartas_productos');
    var $fila_producto = document.querySelector('#fila_producto');
    var $total_producto = document.querySelector('#total_producto');
    var $lista_accesorios_para_sumar = document.querySelector('#lista_accesorios_para_sumar');
    var valor_cera;
    var lista_productos = [];
    var lista_ingredientes = [];
    var lista_accesorios = [];
    var lista_nueva_general = [];
    var lista_filtrada_general = [];
    var lista_alternativa_de_productos = [];
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
    $('#criterio_boveda').val('2');

    $("#modal_vista_producto").on("hidden.bs.modal", function () {
        $('#lista_accesorios_para_sumar').trigger('change');
        $('#lista_accesorios_para_sumar').val('');
        $('#icono_bnt_suma_accesorio').addClass('text-dark');
        $('#icono_bnt_suma_accesorio').removeClass('text-success');
        $('#bnt_suma_accesorio').attr('disabled', true);
        $('#div_lista_accesorios_para_sumar').css('display', 'none');
    });

    $('#lista_accesorios_para_sumar').select2({
        theme: "bootstrap"
    });

    $('#lista_accesorios_para_sumar').change(function (e) {
        var valor = $('#lista_accesorios_para_sumar').val();
        if (valor) {
            $('#bnt_suma_accesorio').attr('disabled', false);
            $('#icono_bnt_suma_accesorio').removeClass('text-dark');
            $('#icono_bnt_suma_accesorio').addClass('text-success');
        }
    });

    $("#modal_cantidad_cera").on("hidden.bs.modal", function () {
        $('#formulario_cantidad_de_cera').trigger('reset');
    });

    $('#formulario_cantidad_de_cera').submit(function (e) {
        e.preventDefault();

        var precio = $('#cantidad_de_cera_precio').val();
        var nombre = $('#cantidad_de_cera_nombre').val();
        var id = $('#cantidad_de_cera_id').val();
        var cantidad_de_cera = parseInt($('#cantidad_de_cera').val());
        var cera_actual = parseInt($('#cantidad_total_cera').val());
        let nueva_cera = cera_actual + cantidad_de_cera;
        $('#cantidad_total_cera').val(nueva_cera);

        precio = ((precio / 100) * cantidad_de_cera);
        nombre = nombre + ' ' + cantidad_de_cera + ' gramos';
        precio = parseFloat((precio).toFixed(2));
        var indice = crea_indice(lista_ingredientes.length, lista_ingredientes);

        let obj = {
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad_de_cera: cantidad_de_cera,
            indice: indice,
            id_tipo: 2
        }


        /* FUNCION QUE FUCIONA LAS CERAS ACTUALES */
        var buscado = lista_ingredientes.find(elemento => elemento.id_tipo == 2);
        var template = ``;
        var template2 = ``;
        var cont = 1;
        var precio = 0;
        if (buscado) {
            var sumar_este_valor_cera = parseFloat((precio).toFixed(2))
            buscado.nombre = 'Cera de soja ' + nueva_cera + ' gramos';
            buscado.precio = buscado.precio + sumar_este_valor_cera;
            buscado.precio = parseFloat((buscado.precio).toFixed(2));
            Toast.fire({
                icon: 'success',
                title: 'Agregaste ' + nombre.toLowerCase() + ' a la preparación'
            })
            lista_ingredientes.forEach(function (elemento, index, object) {
                var id_contenedor_cantidad = "cantidad_cera_traida_" + cont;
                var id_contenedor = "ingrediente_fila_" + cont;
                template += dibujar_accesorio(id_contenedor, elemento, id_contenedor_cantidad);
                $fila_producto.innerHTML = template;
                cont = cont + 1;
                precio = precio + parseFloat(elemento.precio);
            });
            template2 += dibujar_precio(precio);
            $total_producto.innerHTML = template2;
            resetear_modal();   
        } else {
            Toast.fire({
                icon: 'success',
                title: 'Agregaste ' + nombre.toLowerCase() + ' a la preparación'
            })
            lista_ingredientes.push(obj);
            ordena_lista_por_precio(lista_ingredientes);
            lista_ingredientes.forEach(function (elemento, index, object) {
                var id_contenedor_cantidad = "cantidad_cera_traida_" + cont;
                var id_contenedor = "ingrediente_fila_" + cont;
                template += dibujar_accesorio(id_contenedor, elemento, id_contenedor_cantidad);
                $fila_producto.innerHTML = template;
                cont = cont + 1;
                precio = precio + parseFloat(elemento.precio);
                precio = parseFloat((precio).toFixed(2));

            });
            precio = precio;
            template2 += dibujar_precio(precio);
            $total_producto.innerHTML = template2;
            resetear_modal();
        }

    });
 
    $("#producto_buscado").keyup(function () {
        mostrar_lista();
    })

    $('#form_modal_vista_producto').submit(function (e) {
        e.preventDefault();
        var precio = 0;
        var lista_id_piezas = [];

        lista_ingredientes.forEach(elemento => {
            precio = precio + elemento.precio;
            lista_id_piezas.push(elemento.id);
        });
        var id_producto = $('#id_producto').val();
        var cantidad_de_cera = $('#cantidad_total_cera').val();
        var nombre = $('#nombre_vela').val();
        var descripcion = $('#descripcion_vela').val();

        $.ajax({
                url: "../../functions/php/almacen/actualizar_producto.php",
                type: "POST",
                data: {
                    lista_ingredientes: lista_id_piezas,
                    cantidad: cantidad_de_cera,
                    nombre: nombre,
                    descripcion: descripcion,
                    id: id_producto
                }
            })
            .done(function (res) {
                // console.log(res);
                if (res == 'true') {
                    // limpiar_producto();
                    $('#modal_vista_producto').modal('hide');
                    Swal.fire({
                        title: 'Actualizaste el producto ' + nombre,
                        width: 600,
                        padding: '3em',
                        customClass: {
                            confirmButton: 'btn btn-secondary',
                            title: 'text-white'
                        },
                        confirmButtonText: 'Se que va a estar mejor',
                        background: '#fff url("https://cdn.pixabay.com/photo/2013/04/14/20/24/water-103817_960_720.jpg")',
                        backdrop: `
                      rgba(0,110,225,0.4)
                      left top
                      no-repeat
                    `
                    })
                }

                $('#producto_buscado').val('');
                get_productos();
            })
            .fail(function () {
                console.log('Err');
            });
    });


    /* DECLARACION DE FUNCIONES */
    function dibujar_no_coincidencias(){
        template = `
        <div class="container-fluid">
            <div class="container-fluid">
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-emoji-frown"></i> No hay coincidencias
                </div>
            </div>
        </div>`
        return template;
    }

    function dibujar_accesorio(id_contenedor, elemento, id_contenedor_cantidad){
        template = `
        <div class="row" id=${id_contenedor}>
            <div class="col-md-10">
                <p><i onclick="quitar_accesorio_producto(${elemento.id}, ${id_contenedor}, ${elemento.indice}, ${elemento.id_tipo}, '${id_contenedor_cantidad}')" class="text-danger bi bi-trash"></i> ${elemento.nombre}</p>
            </div>
            <div class="col-md-2" style="text-align: right;">
                <p class="text-info">$${elemento.precio}</p>
            </div>
        </div>`
        return template;
    }

    function dibujar_precio(precio){
        template = `
        <div class="row">
            <div class="col-md-10">
                <p><i class=" text-success bi bi-cash-coin"></i> Total </p>
            </div>
            <div class="col-md-2" style="text-align: right;">
                <p class="text-success">$${precio}</p>
            </div>
        </div>`
        return template;
    }

    function dibujar_producto(producto, id_contenedor_cantidad, nombre_vela){
        if (producto.estado == false ) {
            color_bg = "bg-success";
            boton_funcion = `deshabilitar_o_habilitar_producto(${producto.id}, 1)`;
            boton_texto = "Boveda";
        } else {
            color_bg = "bg-danger";
            boton_funcion = `deshabilitar_o_habilitar_producto(${producto.id}, 0)`;
            boton_texto = "Activar";   
        }
        
        template =`
        <div class=" col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-1">
            <div class='card mx-auto'  style="width: 15rem; height: 14rem;">
                <div class='card-body ' >
                    <div class='row'>
                        <div class='col-md-12'>
                            <h6 >${nombre_vela}</h6>
                        </div>
                    </div>
                        <hr>
                            <div class='row'>
                                <div class='col-md-12'>
                                    <h6 >Precio: $${producto.precio}</h6>
                                </div>
                            </div>
                        <input hidden type="number" class="form-control" id="${id_contenedor_cantidad}" value="${producto.cantidad_cera}">
                    </div>
                    <div class='card-footer ${color_bg}  d-flex'>
                        <div class='p-0 col-md-7'>
                            <button onclick="ver_detalles_producto(${producto.id}, '${nombre_vela}', '${id_contenedor_cantidad}', ${producto.cantidad_cera}, '${producto.descripcion}')" class="btn btn-light btn-block btn-sm">Ver detalles</button>
                        </div>
                        <div class='p-0 col-md-5'>
                        <button onclick="${boton_funcion}" class=" ml-1 btn btn-outline-light btn-block btn-sm  pt-6 pb-6">${boton_texto}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        return template;
        /* $deck_cartas_productos.innerHTML = template; */
    }

    function resetear_modal(){
        $('#lista_accesorios_para_sumar').trigger('change');
        $('#lista_accesorios_para_sumar').val('');
        $('#icono_bnt_suma_accesorio').addClass('text-dark');
        $('#icono_bnt_suma_accesorio').removeClass('text-success');
        $('#bnt_suma_accesorio').attr('disabled', true);
        $('#div_lista_accesorios_para_sumar').css('display', 'none');
        $('#modal_cantidad_cera').modal('hide');
    }

    function llamar_funciones_iniciales(){
        get_productos();
        get_accesorios(); 
    }

    function obtener_valor_cera() {
        $.ajax({
                url: "../../functions/php/almacen/get_valor_cera.php",
                type: "GET"
            })
            .done(function (res) {
                var respuesta = JSON.parse(res);
                if(respuesta.length == 0){
                    valor_cera = 0;
                    llamar_funciones_iniciales();
                }else{  
                    valor_cera =  parseInt(respuesta[0].precio);
                    llamar_funciones_iniciales();
                }
            })
            .fail(function (e) {
                console.log('Err');
                window.location.reload();
            })
    }

    function ordena_lista_por_precio(lista) {
        lista.sort(function (a, b) {
            if (a.precio > b.precio) {
                return 1;
            }
            if (a.precio < b.precio) {
                return -1;
            }
            return 0;
        });
    }

    function agregar_accesorio() {
        valor = $('#lista_accesorios_para_sumar').val();
        var found = lista_accesorios.find(elemento => elemento.id == parseInt(valor));
        var val = found.id_tipo;
        // console.log(found); 
        if (val == 2) {
            // console.log('Es cera');
            $('#cantidad_de_cera_precio').val(found.precio);
            $('#cantidad_de_cera_nombre').val(found.nombre);
            $('#cantidad_de_cera_id').val(found.id);

            $('#modal_cantidad_cera').modal('show');
        } else {

            var indice = crea_indice(lista_ingredientes.length, lista_ingredientes);
            console.log(lista_accesorios);
            var found = lista_accesorios.find(elemento => elemento.id == parseInt(valor));
            console.log(found);
            let obj = {
                id: found.id,
                nombre: found.nombre,
                precio: found.precio,
                id_tipo: found.id_tipo,
                indice: indice
            }
            Toast.fire({
                icon: 'success',
                title: 'Agregaste ' + found.nombre.toLowerCase() + ' a la preparación'
            })
            console.log(obj);

            lista_ingredientes.push(obj);
            ordena_lista_por_precio(lista_ingredientes);
            /* console.log(lista_ingredientes); */
            var template = ``;
            var template2 = ``;
            var cont = 1;
            var precio = 0;
            lista_ingredientes.forEach(function (elemento, index, object) {
                var id_contenedor_cantidad = "cantidad_cera_traida_" + cont;

                var id_contenedor = "ingrediente_fila_" + cont;

                template += `
                <div class="row" id=${id_contenedor}>
                    <div class="col-md-10">
                        <p><i onclick="quitar_accesorio_producto(${elemento.id}, ${id_contenedor}, ${elemento.indice}, ${elemento.id_tipo}, '${id_contenedor_cantidad}')" class="text-danger bi bi-trash"></i> ${elemento.nombre}</p>
                    </div>
                    <div class="col-md-2" style="text-align: right;">
                        <p class="text-info">$${elemento.precio}</p>
                    </div>
                </div>`

                $fila_producto.innerHTML = template;
                cont = cont + 1;
                precio = precio + parseFloat(elemento.precio);

            });
            precio = precio;

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

            $('#lista_accesorios_para_sumar').trigger('change');
            $('#lista_accesorios_para_sumar').val('');
            $('#icono_bnt_suma_accesorio').addClass('text-dark');
            $('#icono_bnt_suma_accesorio').removeClass('text-success');
            $('#bnt_suma_accesorio').attr('disabled', true);
            $('#div_lista_accesorios_para_sumar').css('display', 'none');
        }
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

    function mostrar_select_accesorios() {
        $('#div_lista_accesorios_para_sumar').toggle();
        $('#lista_accesorios_para_sumar').trigger('change');
        $('#lista_accesorios_para_sumar').val('');
        $('#icono_bnt_suma_accesorio').addClass('text-dark');
        $('#icono_bnt_suma_accesorio').removeClass('text-success');
        $('#bnt_suma_accesorio').attr('disabled', true);
    }

    function get_accesorios() {
        $.ajax({
                url: "../../functions/php/almacen/get_accesorios.php",
                type: "GET"
            })
            .done(function (res) {
                var array = JSON.parse(res);
                lista_accesorios = array;
                var template = '';
                template += `<option class="form-control" selected disabled value=''>Qué agregamos?</option>`;
                array.forEach(OBJ => {
                    template += `<option class="form-control" value="${OBJ.id}">${OBJ.nombre} por $${OBJ.precio}</option>`;
                });
                $lista_accesorios_para_sumar.innerHTML = template;

            })
            .fail(function () {
                console.log('Err');
            });


    }

    function get_productos() {
        lista_productos = [];
        $.ajax({
                url: "../../functions/php/almacen/get_productos_1.php",
                type: "GET"
            })
            .done(function (res) {
                var array = JSON.parse(res);
                var template = ``;
                var cont = 0;
                if(array.length == 0){
                    $('#indicador_de_que_no_hay_nada').removeAttr('hidden');
                }
                array.forEach((producto) => {
                    cont = cont + 1;
                    var id_contenedor_cantidad = "cantidad_cera_traida_" + cont;
                    var nombre_vela = capitalize(producto.nombre);
                    if (producto.cantidad_cera > 0) {
                        producto.precio = parseInt(producto.precio) - parseInt(valor_cera);
                        producto.precio += ((parseInt(producto.cantidad_cera) * parseInt(valor_cera)) / 100);
                        template += dibujar_producto(producto, id_contenedor_cantidad, nombre_vela);
                    } else {
                        template += dibujar_producto(producto, id_contenedor_cantidad, nombre_vela);
                    }
                    $deck_cartas_productos.innerHTML = template;
                })
                lista_productos = array;
                lista_nueva_general = array;
                lista_filtrada_general = array;
            })
            .fail(function () {
                console.log('Err');
            });
    }

    function deshabilitar_o_habilitar_producto(id, nuevo_estado) {
        $.ajax({
            url: "../../functions/php/almacen/cambiar_estado_producto.php",
            type: "POST",
            data: {
                id: id,
                nuevo_estado: nuevo_estado
            },
        })
        .done(function (res) {
            get_productos();
            $('#criterio_boveda').val('1');
            $('#criterio_sort').val('');
            $('#producto_buscado').val('');
            if ( nuevo_estado == 1) {
                Toast.fire({
                    icon: 'error',
                    title: 'Producto enviado a la boveda, no estara disponible para pedidos'
                })
            } else {
                Toast.fire({
                    icon: 'success',
                    title: 'Producto activado, estara disponible para pedidos'
                })
            }
        })
        .fail(function () {
            console.log('Err');
        });
    }

    function mostrar_lista(){
        var lista = [];
        var crit_bov = $('#criterio_boveda').val();
        var crit_sor = $('#criterio_sort').val();
        var crit_nom = $('#producto_buscado').val();
        // console.log(crit_bov ,crit_sor ,crit_nom);
        lista_productos.forEach(elemento => {
            // console.log(elemento);
            let buscado = crit_nom.toLowerCase();
            let nombre = elemento.nombre.toLowerCase();
            if(nombre.includes(buscado)){
                if(crit_bov == 2){
                    lista.push(elemento);
                }else{
                    if(elemento.estado == crit_bov){
                        lista.push(elemento);
                    }
                }
            } 
        });
        // console.log(lista.length);
        // console.log(filtrado_lista(lista, crit_sor));

        mostrar_lista_ordenada_por_criterio(filtrado_lista(lista, crit_sor));

    }

    function mostrar_lista_ordenada_por_criterio(array) {
        var template = ``;
        $deck_cartas_productos.innerHTML = template;
        if(array.length == 0){
            template += dibujar_no_coincidencias();
            $deck_cartas_productos.innerHTML = template;
        }else{
            var cont = 0;
            array.forEach((producto) => {
                cont = cont + 1;
                var id_contenedor_cantidad = "cantidad_cera_traida_" + cont;
                var nombre_vela = capitalize(producto.nombre);
    
                template += dibujar_producto(producto, id_contenedor_cantidad, nombre_vela);
                $deck_cartas_productos.innerHTML = template;
            })
        }
        
    }

    function filtrado_lista(lista, criterio) {
        switch (criterio) {
            case "1":
                lista.sort(function (a, b) {
                    if (a.precio < b.precio) {
                        return 1;
                    }
                    if (a.precio > b.precio) {
                        return -1;
                    }
                    return 0;
                });
            break;

            case "2":
                lista.sort(function (a, b) {
                    if (a.precio > b.precio) {
                        return 1;
                    }
                    if (a.precio < b.precio) {
                        return -1;
                    }
                    return 0;
                });
            
            break;

            case "3":

            lista.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                return 0;
                });
               
            break; 

            case "4":
                lista.sort(function (a, b) {
                    if (a.nombre < b.nombre) {
                        return 1;
                    }
                    if (a.nombre > b.nombre) {
                        return -1;
                    }
                    return 0;
                });
                
            break;
          }
          return lista;
        
    }

    function capitalize(s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    function ver_detalles_producto(id, nombre, id_contenedor_cantidad, cantidad_cera, descripcion) {
        lista_ingredientes = [];
        $('#cantidad_total_cera').val(cantidad_cera);
        $('#nombre_vela').val(nombre);
        $('#descripcion_vela').val(descripcion);
        $('#id_producto').val(id);
        $.ajax({
                url: "../../functions/php/almacen/get_producto.php",
                type: "POST",
                data: {
                    id: id
                },
            })
            .done(function (res) {
                var array = JSON.parse(res);

                var template = ``;
                var template2 = ``;
                var cont = 1;
                var precio = 0;
                
                
                for (let i = 0; i < array.length; i++) {
                    const elemento = array[i];
                    elemento.indice = crea_indice(array.length, array);
                }
                array.forEach(elemento => {
                    // console.log(elemento);
                    if (elemento.id_tipo == 2) {
                        elemento.cantidad_de_cera = parseInt(cantidad_cera);
                        elemento.nombre = 'Cera de soja ' + cantidad_cera + ' gramos';
                        elemento.precio = parseInt(elemento.precio) - parseInt(valor_cera);
                        elemento.precio += ((parseInt(cantidad_cera) * parseInt(valor_cera)) / 100);




                        lista_ingredientes.push(elemento);
                        var id_contenedor = "ingrediente_fila_" + cont;

                        template += `
                                <div class="row" id=${id_contenedor}>
                                    <div class="col-md-10">
                                        <p><i onclick="quitar_accesorio_producto(${elemento.id}, ${id_contenedor}, ${elemento.indice}, ${elemento.id_tipo}, '${id_contenedor_cantidad}')" class="text-danger bi bi-trash"></i> ${elemento.nombre}</p>
                                    </div>
                                    <div class="col-md-2" style="text-align: right;">
                                        <p class="text-info">$${elemento.precio}</p>
                                    </div>
                                </div>`

                        $fila_producto.innerHTML = template;
                        cont = cont + 1;

                        precio = precio + parseFloat(elemento.precio);






                    } else {
                        elemento.cantidad_de_cera = 0;
                        lista_ingredientes.push(elemento);
                        var id_contenedor = "ingrediente_fila_" + cont;

                        template += `
                                <div class="row" id=${id_contenedor}>
                                    <div class="col-md-10">
                                        <p><i onclick="quitar_accesorio_producto(${elemento.id}, ${id_contenedor}, ${elemento.indice}, ${elemento.id_tipo}, '${id_contenedor_cantidad}')" class="text-danger bi bi-trash"></i> ${elemento.nombre}</p>
                                    </div>
                                    <div class="col-md-2" style="text-align: right;">
                                        <p class="text-info">$${elemento.precio}</p>
                                    </div>
                                </div>`

                        $fila_producto.innerHTML = template;
                        cont = cont + 1;

                        precio = precio + parseFloat(elemento.precio);
                    }


                });


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

                $('#modal_vista_producto').modal('show');
            })
            .fail(function () {
                console.log('Err');
            });
    }

    function quitar_accesorio_producto(id_elemento, id_contenedor, indice, id_tipo, id_contenedor_cantidad) {
        if (id_tipo == 2) {
            var index = lista_ingredientes.findIndex(elemento => elemento.indice == indice);
            /* lista_ingredientes.splice(index, 1); */
            var cantidad_a_sacar = parseInt(lista_ingredientes[index].cantidad_de_cera);
            var cantidad_actual = parseInt($('#cantidad_total_cera').val());
            var cantidad_nueva = cantidad_actual - cantidad_a_sacar;
            $('#cantidad_total_cera').val(cantidad_nueva);
        }

        const found = lista_ingredientes.findIndex(elemento => elemento.indice == indice);
        var indice_a_quitar = found;
        lista_ingredientes.splice(indice_a_quitar, 1);


        var contenedor = '#' + id_contenedor.id;
        // console.log(contenedor);
        $(contenedor).remove();

        var template2 = ``;
        var cont = 1;
        var precio = 0;
        lista_ingredientes.forEach(elemento => {
            precio = precio + parseFloat(elemento.precio)
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

        $total_producto.innerHTML = template2;

        if (lista_ingredientes.length == 0) {
            // $('#btn-piezas').attr('hidden','hidden');
            // $('#btn-limpia-producto').attr('hidden','hidden');
            $('#modal_vista_producto').modal('hide');
            $('#form_modal_vista_producto').trigger('reset');
            Toast.fire({
                icon: 'warning',
                title: 'Eliminar aca esto, a la mierda'
            })
        }
    }

    function string_to_int(string) {
        var regex = /(\d+)/g;
        var valor = string.match(regex)[0];
        valor = parseInt(valor)
        return valor;
    }
}