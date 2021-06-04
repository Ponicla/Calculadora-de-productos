if(window.location.pathname == ruta+'productos/productos.php'){


    /* DECLARACION DE VARIABLES */
    var $deck_cartas = document.querySelector('#deck_cartas');
    var $fila_producto = document.querySelector('#fila_producto');
    var $total_producto = document.querySelector('#total_producto');
    var lista_ingredientes = [];
    var lista_accesorios = [];
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
    }) 


    /* LLAMADO A FUNCIONES */
    get_accesorios();


    /* LANZADORES JQUERY */
    $("#nombre").keyup(function() {
        lista_accesorios = [];
        var nombre = $("#nombre").val();
        $.ajax({
            url: "../../functions/php/productos/get_accesorios.php",
            type: "POST",
            data: {nombre}
        })
        .done(function (res) {
            var array = JSON.parse(res);
            var template = ``;
            $deck_cartas.innerHTML = '';
            if(array.length == 0){
                template += dibujar_no_coincidencias();
                $deck_cartas.innerHTML = template;
            };
            array.forEach((accesorio) => {
                var date = new Date(accesorio.edicion);
                var dia = date.getDate();
                var mes = date.toLocaleString("es-ES", { month: "long" });
                var ano = date.getFullYear();
                var edicion = dia + " " + mes + " " +ano;
                accesorio.edicion = edicion;
                accesorio.precio = parseFloat((accesorio.precio));
                template += dibuja_accesorios(accesorio);
                $deck_cartas.innerHTML = template;
            })
          lista_accesorios = array;
        })
        .fail(function () {
          console.log('Err'); 
        });
    })

    $('#btn-piezas').click(function (e) { 
        e.preventDefault();
        var template = ``;
        var template2 = ``;
        var cont = 1;
        var precio = 0;
        var cantidad_de_cera = 0;
        lista_ingredientes.forEach(function(elemento, index, object) {
            var id_contenedor = "ingrediente_fila_"+cont;
            if (elemento.hasOwnProperty('cantidad_de_cera')) {
                cantidad_de_cera = cantidad_de_cera + parseInt(elemento.cantidad_de_cera);
            }else{
                elemento.cantidad_de_cera = 0;
            }
            template += dibuja_fila(elemento, id_contenedor);
            $fila_producto.innerHTML = template;
            cont = cont + 1;
            precio = precio + parseFloat((elemento.precio).toFixed (2));
        });

        $('#cantidad_total_cera').val(cantidad_de_cera);
        precio = (precio.toFixed(2))
        template2 += dibuja_total_producto(precio);
        $total_producto.innerHTML = template2;

        $('#modal_nuevo_producto').modal('show');
    });

    $('#formulario_cantidad_de_cera').submit(function (e) { 
        e.preventDefault();

        var precio = $('#cantidad_de_cera_precio').val();
        var nombre = $('#cantidad_de_cera_nombre').val();
        var id = $('#cantidad_de_cera_id').val();
        var cantidad_de_cera = $('#cantidad_de_cera').val();

        precio = ((precio/100)*cantidad_de_cera);
        nombre = nombre + ' ' +cantidad_de_cera+' gramos';

        
        var indice = crea_indice(lista_ingredientes.length);

        let obj = {
            id_accesorio: id,
            nombre: nombre,
            precio: precio,
            cantidad_de_cera: cantidad_de_cera,
            indice: indice,
            id_tipo : 2
        } 
        var buscado = lista_ingredientes.find(elemento => elemento.id_tipo == 2);
        if (buscado) {
            var nueva_cera = parseInt(buscado.cantidad_de_cera) + parseInt(obj.cantidad_de_cera); 
            var sumar_este_valor_cera = parseFloat((precio).toFixed(2))
            buscado.nombre = 'Cera de soja ' + nueva_cera + ' gramos';
            buscado.precio = buscado.precio + sumar_este_valor_cera;
            buscado.precio = parseFloat((buscado.precio).toFixed(2));

        }else{
            lista_ingredientes.push(obj);
            
        }

        Toast.fire({
            icon: 'success',
            title: 'Agregaste '+ nombre.toLowerCase() +' a la preparación'
        })

        ordenar_lista(lista_ingredientes);
        $('#btn-piezas').removeAttr('hidden');
        $('#btn-limpia-producto').removeAttr('hidden');
        $('#modal_cantidad_cera').modal('hide');

          
    });

    $('#form_modal_nuevo_producto').submit(function (e) { 
        e.preventDefault();
        var precio = 0;
        var lista_id_piezas = [];
       
        
        lista_ingredientes.forEach(elemento => {
            precio = precio + elemento.precio;
            lista_id_piezas.push(elemento.id_accesorio);
        });
        var cantidad_de_cera_form = $('#cantidad_total_cera').val();
        var nombre = $('#nombre_vela').val();
        var descripcion = $('#descripcion_vela').val();

        $.ajax({
            url: "../../functions/php/productos/nuevo_producto.php",
            type: "POST",
            data: { lista_ingredientes : lista_id_piezas, 
                    cantidad: cantidad_de_cera_form,
                    nombre : nombre,
                    descripcion: descripcion
                }
        })
        .done(function (res) {
            if(res == 'true'){ 
                limpiar_producto();
                $('#modal_nuevo_producto').modal('hide');
                $('#indicador_de_que_no_hay_nada').attr('hidden', 'hidden');
                Swal.fire({
                    title: 'Felicitaciones por tu nuevo producto '+nombre,
                    width: 600,
                    padding: '3em',
                    confirmButtonText: 'A disfrutar',
                    background: '#fff url("https://images.vexels.com/media/users/3/166834/preview2/4213467a1f2589af7c27350ca54428f7-patron-de-flores-y-hojas-tropicales.jpg")',
                    backdrop: `
                      rgba(50,150,50,0.4)
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

    $("#modal_cantidad_cera").on("hidden.bs.modal", function () {
        $('#formulario_cantidad_de_cera').trigger('reset');
    });

    
    /* DECLARACION DE FUNCIONES */
    function dibuja_accesorios(accesorio){
        template = `<div class="col-sm-6 col-md-4 col-lg-3 col-xl-3 mt-1">
                        <div class='card mb-3 border border-primary mx-auto' style="min-width: 15rem; max-width: 17rem;">
                            <div class='card-body pt-3'>
                            <div class='row'>
                                <div class='col-md-10'>
                                <h6 class=''>${accesorio.nombre}</h6>
                                </div>
                                
                            </div>
                                <hr class="mt-0 bg-primary">
                                <p class='card-text'>Clase: ${accesorio.tipo}</p>
                                <small class='card-text'>
                                    <small class="" style="font-size: 1rem">Precio: $${accesorio.precio}
                                    </small> 
                                    <small style="font-size: 0.7rem">(${accesorio.edicion})
                                    </small>
                                </small>
                            </div>

                            <div class='card-footer  border-primary col-md-12'>
                                    <a onclick="agregar_accesorio_al_producto(${accesorio.id},${accesorio.precio},'${accesorio.nombre}', ${accesorio.id_tipo})" role="button" class="btn btn-primary btn-sm " style="width:100%">Agregar al producto</a>
                                </div>
                            
                        </div>
                    </div>`
        return template;
    }

    function crea_indice(indice) {
        if (indice == 0) {
             return indice;
        } else {
            const found = lista_ingredientes.find(elemento => elemento.indice == indice);
            if (!found) {
                return indice;
            } else {
                return crea_indice(indice + 1);
            }
        }
    } 

    function dibujar_no_coincidencias(){
        template = 
            `<div class="container-fluid">
                <div class="container-fluid">
                    <div class="alert alert-danger" role="alert">
                        <i class="bi bi-emoji-frown"></i> No hay coincidencias
                    </div>
                </div>
            </div>`
        return template;
    }

    function dibuja_total_producto(precio){
        template = 
            `<div class="row">
                <div class="col-md-10">
                    <p><i class=" text-success bi bi-cash-coin"></i> Total </p>
                </div>
                <div class="col-md-2" style="text-align: right;">
                    <p class="text-success">$${precio}</p>
                </div>
            </div>`
        return template;
    }

    function dibuja_fila(elemento, id_contenedor){
        template = `<div class="row" id=${id_contenedor}>
                        <div class="col-md-10">
                            <p><i onclick="quitar_accesorio_producto(${elemento.id_accesorio}, ${id_contenedor}, ${elemento.cantidad_de_cera}, ${elemento.indice})" class="text-danger bi bi-trash"></i> ${elemento.nombre}</p>
                        </div>
                        <div class="col-md-2" style="text-align: right;">
                            <p class="text-info">$${(elemento.precio).toFixed(2)}</p>
                        </div>
                    </div>`
        return template;
    }

    function get_accesorios(){
        lista_accesorios = [];
        $.ajax({
            url: "../../functions/php/productos/get_accesorios_1.php",
            type: "GET"
        })
        .done(function (res) {
            var array = JSON.parse(res);
            if(array.length == 0){
                $('#indicador_de_que_no_hay_nada').removeAttr('hidden');
            }
            var template = ``;
          array.forEach((accesorio) => {
            
            var date = new Date(accesorio.edicion);
            var dia = date.getDate();
            var mes = date.toLocaleString("es-ES", { month: "long" });
            var ano = date.getFullYear(); 
            var edicion = dia + " " + mes + " " +ano;
            accesorio.edicion = edicion;
            accesorio.precio = parseFloat((accesorio.precio));
            template += dibuja_accesorios(accesorio);
                $deck_cartas.innerHTML = template;
          })
          lista_accesorios = array;
          filtrado_lista($("#criterio_sort").val());
        })
        .fail(function () {
          console.log('Err'); 
        });
    }

    function agregar_accesorio_al_producto(id, precio, nombre, id_tipo) {
        if (id_tipo == 2) {
            $('#cantidad_de_cera_precio').val(precio);
            $('#cantidad_de_cera_nombre').val(nombre);
            $('#cantidad_de_cera_id').val(id);

            $('#modal_cantidad_cera').modal('show');
        } else {
            var indice = crea_indice(lista_ingredientes.length);
            
            let obj = {
                id_accesorio: id,
                nombre: nombre,
                precio: precio,
                indice: indice,
                id_tipo : id_tipo
            }
            Toast.fire({
                icon: 'success',
                title: 'Agregaste ' + nombre.toLowerCase() + ' a la preparación'
            })
            lista_ingredientes.push(obj);
            ordenar_lista(lista_ingredientes);
            $('#btn-piezas').removeAttr('hidden');
            $('#btn-limpia-producto').removeAttr('hidden');
        }
    }

    function quitar_accesorio_producto(id_elemento, id_contenedor, cantidad, indice){
        if(cantidad > 0){
            var cantidad_a_quitar = parseInt(cantidad);
            var cantidad_actual_de_cera = parseInt($('#cantidad_total_cera').val());
            $('#cantidad_total_cera').val(cantidad_actual_de_cera - cantidad_a_quitar);
        }   
        const found = lista_ingredientes.findIndex(elemento => elemento.indice == indice);
        var indice_a_quitar = found;
        var contenedor = '#'+id_contenedor.id;
        var template2 = ``;
        var precio = 0;
        lista_ingredientes.splice(indice_a_quitar, 1);
        $(contenedor).remove();
        lista_ingredientes.forEach(elemento => {
            precio = precio + (parseFloat((elemento.precio).toFixed(2)));
        })
        template2 += dibuja_total_producto(precio);
        $total_producto.innerHTML = template2;
        
        if(lista_ingredientes.length == 0){
            $('#btn-piezas').attr('hidden','hidden');
            $('#btn-limpia-producto').attr('hidden','hidden');
            $('#modal_nuevo_producto').modal('hide');
            $('#form_modal_nuevo_producto').trigger('reset');
            Toast.fire({
                icon: 'warning',
                title: 'El producto quedo vacio'
            })
        }
    }

    function ordenar_lista(lista){
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

    function limpiar_producto(){
        $('#form_modal_nuevo_producto').trigger('reset');
        lista_id_piezas = [];
        lista_ingredientes = [];
        var template = ``;
        var template2 = ``;
        $fila_producto.innerHTML = template;
        $total_producto.innerHTML = template2;
        $('#btn-piezas').attr('hidden','hidden');
        $('#btn-limpia-producto').attr('hidden','hidden');
        $('#nombre').val('');
        get_accesorios();
    }

    function limpiar_producto2(){
        $('#form_modal_nuevo_producto').trigger('reset');
        lista_id_piezas = [];
        lista_ingredientes = [];
        var template = ``;
        var template2 = ``;
        $fila_producto.innerHTML = template;
        $total_producto.innerHTML = template2;
        $('#btn-piezas').attr('hidden','hidden');
        $('#btn-limpia-producto').attr('hidden','hidden');
        $('#nombre').val('');
        get_accesorios();
        Toast.fire({
            icon: 'success',
            title: 'Producto destruido'
        })
    }

    function mostrar_lista_ordenada_por_criterio(array) {
        var template = ``;
        array.forEach((accesorio) => {
            var date = new Date(accesorio.edicion);
            var dia = date.getDate();
            var mes = date.toLocaleString("es-ES", { month: "long" });
            var ano = date.getFullYear(); 
            var edicion = dia + " " + mes + " " +ano;
            accesorio.edicion = edicion;
            accesorio.precio = parseFloat((accesorio.precio));
            template += dibuja_accesorios(accesorio);
            $deck_cartas.innerHTML = template;
        })
    }

    function filtrado_lista(criterio) {
        switch (criterio) {
            case "1":
                lista_accesorios.sort(function (a, b) {
                    if (a.precio < b.precio) {
                        return 1;
                    }
                    if (a.precio > b.precio) {
                        return -1;
                    }
                    return 0;
                });
                mostrar_lista_ordenada_por_criterio(lista_accesorios);
              break;
            case "2":
                lista_accesorios.sort(function (a, b) {
                    if (a.precio > b.precio) {
                        return 1;
                    }
                    if (a.precio < b.precio) {
                        return -1;
                    }
                    return 0;
                });
                mostrar_lista_ordenada_por_criterio(lista_accesorios);
              break;
            case "3": 
            lista_accesorios.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                return 0;
            });
            mostrar_lista_ordenada_por_criterio(lista_accesorios);
              break; 
            case "4":
                lista_accesorios.sort(function (a, b) {
                    if (a.nombre < b.nombre) {
                        return 1;
                    }
                    if (a.nombre > b.nombre) {
                        return -1;
                    }
                    return 0;
                });
                mostrar_lista_ordenada_por_criterio(lista_accesorios);
            break;
          }
        
        
    }
  
}