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
get_pedidos();
get_productos();

  /* DECLARACION DE FUNCIONES */
  function get_pedidos() {
    $.ajax({
            url: "../../functions/php/pedidos/get_pedidos_1.php",
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
                                    <h5 class='text-success'>Pedido ${producto.id}</h5>
                                    </div>
                                </div>
                                    <div>Total $${producto.precio_pedido}</div>
                                </div>

                                <div class='card-footer'>
                                        <button onclick="ver_detalles_pedido(${producto.id},${producto.precio_pedido})" class="btn btn-success btn-block">Ver detalles</button>
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

function capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function ver_detalles_pedido(id, precio){
    //console.log(id, nombre);
    //$('#titulo_modal_vista_pedido').val(nombre);
    $.ajax({
        url: "../../functions/php/pedidos/get_pedidos.php",
        type: "POST", 
        data: { id : id },
    })
    .done(function (res) {
        var array = JSON.parse(res);



        var template = ``;
        var cont = 1;

        $id_pedido.innerHTML= id;

        array.forEach(elemento => {
            var id_contenedor = "producto_fila_"+cont;
            
            template += `
            <div class="row" id=${id_contenedor}>
                <div class="col-md-9">
                    <p> ${elemento.nombre}</p>
                </div>
                <div class="col-md-3">
                    <p> $ ${elemento.precio}</p>
                </div>
               
            </div>`
            
            $fila_producto.innerHTML = template;
            cont = cont + 1;

            
        });

        $fila_producto_total.innerHTML = 
            `<div>
            Total: $ ${precio}
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
        var template = ``;
      array.forEach((accesorio) => {
            template += `<div class="col-sm-3 mt-1">
                            <div class='card' style="max-width: 24rem;">
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
        $('#btn-pedido').removeAttr('hidden');
        $('#btn-limpia-pedido').removeAttr('hidden');
    
}

function limpiar_pedido() {}

$('#form_modal_nuevo_pedido').submit(function (e) { 
    e.preventDefault();
    var lista_id_productos = [];
   
    
    lista_productos.forEach(elemento => {
        lista_id_productos.push(elemento.id_producto);
    });
    $.ajax({
        url: "../../functions/php/pedidos/nuevo_pedido.php",
        type: "POST",
        data: { lista_productos : lista_id_productos
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