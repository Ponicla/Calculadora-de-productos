<?php
 include('../arriba.php');
 include('../nav.php');
?>


<div class="container-fluid">
    <div class="alert alert-info mt-2">Almacen de productos</div>

    <hr>
    <p class="text-success">Encuentre información sobre sus porductos</p>

    <div class="row form-group">
        <div class="col-md-4 form-group">
            <input id="producto_buscado" name="nombre" type="text" class="form-control" placeholder="Qué buscas?" autocomplete="off">
        </div>
    </div>
</div>

<div id="deck_cartas_productos" class="card-deck"></div>


<!-- MODAL MUESTRA PRODUCTO -->
<div class="modal fade" id="modal_vista_producto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="titulo_modal_vista_producto"></h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="form_modal_vista_producto">
                    <p class="text-success" style="font-size: 0.7rem;">Nombre del producto</p>
                    <input required type="text" class="form-control" id="nombre_vela" name="nombre"
                        placeholder="Como quieres llamar este producto?">
                    <hr>
                    <!-- <p class="text-success" style="font-size: 0.7rem;">Cantidad de cera</p>

                    <input type="number" class="form-control" id="cantidad_cera"
                        placeholder="Cauntos gramos de cera ocupaste?">
                    <hr> -->
                    <p class="text-success" style="font-size: 0.7rem;">Ingredientes</p>

                    <div id="fila_producto"></div>
                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Precios finales</p>
                    <div id="sub_total_producto"></div>
                    <div id="porcentaje_producto"></div>
                    <div id="total_producto"></div>

                    <div class="modal-footer pr-0">
                        <button type="button" class="btn btn-success" data-dismiss="modal">Volver</button>
                        <button type="submit" class="btn btn-success">Actualizar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


<?php
 include('../abajo.php');
?>