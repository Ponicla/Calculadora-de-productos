<?php
 include('../arriba.php');
 include('../nav.php');
?>


<div class="container-fluid">
    <div class="alert alert-info mt-2">Creador de pedidos</div>

    <hr>
    <p class="text-success">Cree un nuevo pedido con productos del almacen y calcule el presupuesto</p>  

                                    
</div>

<!-- INFO -->
<div class="container-fluid">

    <div class="row form-group">
        <div class="col-md-4 form-group">
            <Button hidden id="btn-pedido" class="btn btn-success"><i class="bi bi-recycle"></i> Pedido</Button>
            <Button hidden onclick="limpiar_pedido()" id="btn-limpia-pedido" class="btn btn-danger"><i class="bi bi-trash"></i> Destruir</Button>
        </div>
    </div>
</div>

<div id="deck_cartas_productos" class="card-deck"></div>

 

<div class="container-fluid">

<p class="text-success">Lista con todos los pedidos</p> 

                                    
</div>

<div id="deck_cartas_pedidos" class="card-deck"></div>



<!-- MODAL MUESTRA PRODUCTO -->
<div class="modal fade" id="modal_vista_pedido" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="titulo_modal_vista_producto">Pedido <i id="id_pedido"></i></h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="form_modal_vista_producto">
                    
                    <p class="text-success" style="font-size: 0.7rem;">Productos del pedido</p>

                    <div id="fila_producto"></div>
                    
                    <hr>
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
                   
                    <p class="text-success" style="font-size: 0.7rem;">Productos</p>

                    <div id="fila_producto"></div>
                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Precio final</p>
                    <div id="total_pedido"></div>

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
 include('../abajo.php');
?>