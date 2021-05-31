if(window.location.pathname == ruta+'pedidos/pedidos.php'){

     /* DECLARACION DE VARIABLES */
     var $deck_cartas_pedidos = document.querySelector('#deck_cartas_pedidos');
     var $deck_cartas_productos = document.querySelector('#deck_cartas_productos');
     var $fila_producto = document.querySelector('#fila_producto');
     var $fila_producto_total = document.querySelector('#fila_producto_total');
     var $total_producto = document.querySelector('#total_producto');
     var $porcentaje_producto = document.querySelector('#porcentaje_producto');
     var $sub_total_producto = document.querySelector('#sub_total_producto');
     var $id_pedido = document.querySelector('#id_pedido');


     var lista_ingredientes = [];

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
            console.log(array);
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
        console.log(array);



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
                                        <a onclick="agregar_producto_al_pedido(${accesorio.id},'${accesorio.nombre}')" role="button" class="btn btn-success btn-sm"><i class="bi bi-plus-circle"></i></a>
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

function agregar_producto_al_pedido(id, nombre) {

        //var indice = crea_indice(lista_ingredientes.length);
        
        let obj = {
            id_accesorio: id,
            nombre: nombre,
        }
        Toast.fire({
            icon: 'success',
            title: 'Agregaste ' + nombre + ' al Pedido'
        })
        lista_ingredientes.push(obj);
        //ordenar_lista(lista_ingredientes);
        $('#btn-pedido').removeAttr('hidden');
        $('#btn-limpia-pedido').removeAttr('hidden');
    
}

function limpiar_pedido() {}

$('#form_modal_nuevo_pedido').submit(function (e) { 
    //Acá va el modal de generar nuevo pedido

});

$('#btn-pedido').click(function (e) { 
    //Acá va el modal del nuevo pedido

    $('#modal_nuevo_pedido').modal('show');
});



}