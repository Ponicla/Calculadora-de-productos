<?php
 include('../arriba.php');
 include('../nav.php');
?>

<!-- INFO -->
<div class="container-fluid">
    <div class="alert alert-info mt-2">Laboratorio</div>

    <hr>
    <p class="text-success">Cree un nuevo producto para el almacen</p>

    <div class="row form-group">
        <div class="col-md-4 form-group">
            <input id="nombre" id="nombre" type="text" class="form-control" placeholder="Que quieres agregar?" autocomplete="off">
        </div>
        <div class="col-md-3">
            <select id="criterio_sort" class="form-control" onchange="filtrado_lista(this.value)">
                <option value="" selected>Ordenar por</option>
                <option value="1">Precio de mayor a menor</option>
                <option value="2">Precio de menor a mayor</option>
                <option value="3" data-content='<i class="bi bi-sort-alpha-down">'></i>Nombre A - Z</option>
                <option value="4">Nombre Z - A</option>
            </select> 
        </div>
        <div class="col-md-4 form-group">
            <Button hidden id="btn-piezas" class="btn btn-success"><i class="bi bi-recycle"></i> Formula</Button>
            <Button hidden onclick="limpiar_producto2()" id="btn-limpia-producto" class="btn btn-danger"><i class="bi bi-trash"></i> Destruir</Button>
        </div>
        
    </div>
</div>

<div  hidden id='indicador_de_que_no_hay_nada' class="container-fluid">
    <div class="alert alert-danger" role="alert">
        No hay nada por aquí, intente agregar accesorios  <i class="bi bi-emoji-frown"></i>

        <div class="row mt-2">
            <div class="col-md-2">
                <a role="button" class="btn btn-dark btn-block btn-sm" href="../accesorios/accesorios.php">Ir por accesorios</a>
            </div>
        </div>
    </div>
</div>

<!-- DECK -->
<div id="deck_cartas" class="card-deck"></div>

<!-- MODAL EDICION ACCESORIO -->
<div class="modal fade" id="modal_nuevo_producto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="exampleModalLabel">Nuevo producto</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="form_modal_nuevo_producto">
                    <p class="text-success" style="font-size: 0.7rem;">Nombre del producto</p>
                    <input required type="text" class="form-control form-group" id="nombre_vela" name="nombre"
                        placeholder="Como quieres llamar este producto?">
                    <textarea required type="text" class="form-control form-group " id="descripcion_vela" name="descripcion"
                        placeholder="Cuenta algo sobre el" rows="4"></textarea>
                    <input hidden type="number" class="form-control form-group" id="cantidad_total_cera" name="cantidad_total_cera">   
                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Ingredientes</p>

                    <div id="fila_producto"></div>
                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Precio final</p>
                    <div id="total_producto"></div>

                    <div class="modal-footer pr-0">
                        <button type="button" class="btn btn-success" data-dismiss="modal">Volver</button>
                        <button type="submit" class="btn btn-success">Crear producto</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- MODAL CANTIDAD CERA-->
<div class="modal fade" id="modal_cantidad_cera"  data-target="bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="exampleModalLabel">Cantidad de cera</h5>    
            </div>
            <div class="modal-body">
                <div hidden>
                    <input id="cantidad_de_cera_id" class="form-control" type="number">
                    <input id="cantidad_de_cera_nombre" class="form-control" type="text">
                    <input id="cantidad_de_cera_precio" class="form-control" type="number" step="0.01">
                </div>
                <form id="formulario_cantidad_de_cera">
                    <p class="text-success"></p>
                    <input required id="cantidad_de_cera" class="form-control" type="number" placeholder="Cuánta cera ocupo?">

                    <div class="modal-footer pr-0">
                        <button type="submit" class="btn btn-success">Confirmar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php
 include('../abajo.php');
?>