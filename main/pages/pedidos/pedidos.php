<?php
include '../arriba.php';
include '../nav.php';
?>


<div class="container-fluid">
    <div class="alert alert-info mt-2">Creador de pedidos</div>
    <hr>
    <p class="text-success">Cree un nuevo pedido con productos del almacen y calcule el presupuesto</p>
</div>

<div class="container-fluid">
    <div class="row ">
        <div class="col-md-4 form-group">
            <input id="producto_buscado" name="nombre" type="text" class="form-control"
                placeholder="Qué producto buscas?" autocomplete="off">
        </div>
        <div class="col-md-4">
            <Button hidden id="btn-pedido" class="btn btn-success"><i class="bi bi-recycle"></i> Administrar nuevo
                pedido</Button>
            <Button hidden onclick="limpiar_pedido()" id="btn-limpia-pedido" class="btn btn-danger"><i
                    class="bi bi-trash"></i> Destruir</Button>
        </div>
        <div id="div_boton_mostrar" class="col-md-4" style="text-align: right;">
            <a class="btn btn-primary" data-toggle="collapse" style="width:200px;" href="#div_deck_cartas_productos" role="button" onclick="change_icon()"
                aria-expanded="false" aria-controls="collapseExample">
                <i class="bi bi-eye"></i> Mostrar productos
            </a>
        </div> 
        <div id="div_boton_ocultar" hidden class="col-md-4" style="text-align: right;">
            <a class="btn btn-primary" data-toggle="collapse" style="width:200px;" href="#div_deck_cartas_productos" role="button" onclick="change_icon()"
                aria-expanded="false" aria-controls="collapseExample">
                <i class="bi bi-eye-slash"></i> Ocultar productos
            </a>
        </div>
    </div>
</div>


<div hidden id='indicador_de_que_no_hay_nada' class="container-fluid">
    <div class="alert alert-danger" role="alert">
        No hay nada por aquí, intente crear productos en el laboratio <i class="bi bi-emoji-frown"></i>
        <div class="col-md-2 pl-0 mt-2">
            <a role="button" class="btn btn-dark btn-block btn-sm" href="../productos/productos.php">Entrar al
                laboratorio</a>
        </div>
    </div>

</div>



<div class="collapse" id="div_deck_cartas_productos">
    <div id="deck_cartas_productos" class="card-deck mr-0 ml-0"></div>
</div>






<div class="container-fluid">
    <hr>
    <p class="text-success">Lista de pedidos, puedes filtrarla para obtener mejores resultados</p>
</div>

<div class="container-fluid">



    <div class="row form-group">
        <div class="col-md-4 form-group">
            <input id="pedido_buscado" onchange="buscar_pedido()" name="nombre" type="text" class="form-control"
                placeholder="Qué pedido buscas?" autocomplete="off">
        </div>
        <div class="text-muted mt-2">Mostrar:</div>
        <div class="col-md-2">
            <select id="criterio_pedido" class="form-control" onchange="">
                <option value="0" selected default>Todos los pedidos</option>
                <option value="1">Pedidos entregados</option>
                <option value="2">Pedidos pendientes</option>
            </select>
        </div>
        <div class="text-muted mt-2">Página: </div>
        <div class="" id="div_paginador"></div>
        <div class="text-muted mt-2 ml-1 " id="cantidad_paginas"></div>
        <div class="text-muted ml-4 mt-2 mr-2">Pedidos por página:</div>
        <div class="">
            <select id="cantidad_por_pagina" class="form-control" onchange="buscar_pedido()">
                <option value="5">5</option>
                <option value="10" selected>10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
    </div>
</div>

<div id='indicador_de_que_no_hay_nada2' hidden class="container-fluid">
    <div class="alert alert-danger" role="alert">
        No hay pedidos realizados <i class="bi bi-emoji-frown"></i>
    </div>
</div>
<div id="deck_cartas_pedidos" class="card-deck  mr-0 ml-0 mb-4"></div>



<!-- MODAL MUESTRA PEDIDO -->
<div class="modal fade" id="modal_vista_pedido" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="titulo_modal_vista_producto">Pedido n° <div class="d-inline-flex"
                        id="id_pedido"></div>
                </h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="form_modal_vista_producto">
                    <p class="text-success" style="font-size: 0.7rem;">Detalles</p>
                    <div id="update_descripcion_del_pedido"></div>

                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Productos del pedido</p>
                    <div class="row">
                        <div class="col-md-8"><small>Descripción</small> </div>
                        <!-- <div class="col-md-2"></div> -->
                        <div class="col-md-2" style="text-align: right;"><small>Unidad</small> </div>
                        <div class="col-md-2" style="text-align: right;"><small>Subtotal</small> </div>
                    </div>
                    <hr>
                    <div id="fila_producto"
                        style="max-height: 150px; overflow: hidden; overflow-y: scroll; overflow-y: auto;"></div>

                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Precios finales</p>
                    <div id="fila_producto_total"></div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- MODAL EDICION PEDIDO -->
<div class="modal fade" id="modal_nuevo_pedido" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="exampleModalLabel">Nuevo Pedido</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="form_modal_nuevo_pedido">
                    <p class="text-success" style="font-size: 0.7rem;">Detalles</p>
                    <input required id="detalle_pedido" type="text" class="form-control"
                        placeholder="Para quién es el pedido? Puedes poner su número" maxlength="100">
                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Productos</p>

                    <div id="fila_producto2"
                        style="max-height: 150px; overflow: hidden; overflow-y: scroll; overflow-y: auto;"></div>
                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Precio final</p>
                    <div id="total_pedido2"></div>

                    <div class="modal-footer pr-0">
                        <button type="button" class="btn btn-success" data-dismiss="modal">Volver</button>
                        <button type="submit" class="btn btn-success">Crear Pedido</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>



<?php
include '../abajo.php';
?>