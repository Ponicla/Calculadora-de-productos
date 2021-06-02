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
            <input id="producto_buscado" name="nombre" type="text" class="form-control" placeholder="Qué producto buscas?" autocomplete="off">
        </div>
        <div class="col-md-4 ">
            <Button hidden id="btn-pedido" class="btn btn-success"><i class="bi bi-recycle"></i> Pedido</Button>
            <Button hidden onclick="limpiar_pedido()" id="btn-limpia-pedido" class="btn btn-danger"><i class="bi bi-trash"></i> Destruir</Button>
        </div>

        <!-- <div class="col-md-3">
            <select id="criterio_sort" class="form-control" onchange="filtrado_lista(this.value)">
                <option value="0" selected default>Todos los pedidos</option>
                <option value="1">Pedidos entregados</option>
                <option value="2">Pedidos pendientes</option>
            </select>
        </div> -->
    </div>
</div>
<!-- INFO -->
<!-- <div  hidden id="contenderdor_botones" class="container-fluid">

    <div  class="row form-group">
        <div class="col-md-4 form-group">
            <Button hidden id="btn-pedido" class="btn btn-success"><i class="bi bi-recycle"></i> Pedido</Button>
            <Button hidden onclick="limpiar_pedido()" id="btn-limpia-pedido" class="btn btn-danger"><i class="bi bi-trash"></i> Destruir</Button>
        </div>
    </div>
</div> -->

<div id="deck_cartas_productos" class="card-deck"></div>



<div class="container-fluid">
    <hr>
    <p class="text-success">Lista de pedidos, puedes filtrarla para obtener mejores resultados</p>
</div>

<div class="container-fluid">
    <div class="row form-group">
        <!-- <div class="col-md-4 form-group">
            <input id="producto_buscado" name="nombre" type="text" class="form-control" placeholder="Qué buscas?" autocomplete="off">
        </div> -->

        <div class="col-md-3">
            <select id="criterio_sort" class="form-control" onchange="filtrado_lista(this.value)">
                <option value="0" selected default>Todos los pedidos</option>
                <option value="1">Pedidos entregados</option>
                <option value="2">Pedidos pendientes</option>
            </select>
        </div>
    </div>
</div>

<div id="deck_cartas_pedidos" class="card-deck"></div>



<!-- MODAL MUESTRA PEDIDO -->
<div class="modal fade" id="modal_vista_pedido" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="titulo_modal_vista_producto">Pedido n° <div class="d-inline-flex" id="id_pedido"></div></h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="form_modal_vista_producto">
                    <p class="text-success" style="font-size: 0.7rem;">Detalles</p>
                    <p id="descripcion_pedido"></p>
                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Productos del pedido</p>
                    <div class="row">
                        <div class="col-md-8"><small>Descripción</small> </div>
                        <!-- <div class="col-md-2"></div> -->
                        <div class="col-md-2" style="text-align: right;"><small>Unidad</small> </div>
                        <div class="col-md-2" style="text-align: right;"><small>Subtotal</small> </div>
                    </div>
                    <hr>
                    <div id="fila_producto"></div>

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
                    <input required id="detalle_pedido" type="text" class="form-control" placeholder="Para quién es el pedido? Puedes poner su número" maxlength="100" >
                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Productos</p>

                    <div id="fila_producto2"></div>
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