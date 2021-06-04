<?php
 include('../arriba.php');
 include('../nav.php');
?>


<div class="container-fluid">
    <div class="alert alert-info mt-2">Almacen de productos</div>

    <hr>
    <p class="text-success">Encuentre información sobre sus porductos</p>

    <div class="row form-group mb-0">
       
        <div class="col-md-4 form-group">
            <input id="producto_buscado" name="nombre" type="text" class="form-control" placeholder="Qué producto buscas?" autocomplete="off">
        </div>
        <div class="text-muted mt-2">Ordenar por:</div>
        <div class="col-md-3">
            <!-- <select id="criterio_sort" class="form-control" onchange="filtrado_lista(this.value)"> -->
            <select id="criterio_sort" class="form-control" onchange="mostrar_lista()">
                <!--<option value="0" selected>Ordenar por</option>-->
                <option value="1">Precio de mayor a menor</option>
                <option value="2">Precio de menor a mayor</option>
                <option value="3" selected data-content='<i class="bi bi-sort-alpha-down">'></i>Nombre A - Z</option>
                <option value="4">Nombre Z - A</option>
            </select> 
        </div>
        <div class="text-muted mt-2">Mostrar:</div>
        <div class="col-md-2">
            <!-- <select id="criterio_boveda" class="form-control" onchange="boveda(this.value)"> -->
            <select id="criterio_boveda" class="form-control" onchange="mostrar_lista()">
                <option value="0" selected >Ocultar boveda</option>
                <option value="1">Solo boveda</option>
                <option value="2">Todos</option>
            </select> 
        </div>
    </div>
</div>

<div hidden id='indicador_de_que_no_hay_nada' class="container-fluid">
    <div class="alert alert-danger" role="alert">
        No hay nada por aquí. Quiéres crear algún producto?  <i class="bi bi-emoji-frown"></i>
        <div class="row mt-2">
            <div class="col-md-2">
                <a role="button" class="btn btn-dark btn-block btn-sm" href="../productos/productos.php">Entrar al laboratorio</a>
            </div>
        </div>
      </div>
</div>



<div id="deck_cartas_productos" class="card-deck d-flex flex-wrap mb-4" style="align-content: center;"></div>


<!-- MODAL MUESTRA PRODUCTO -->
<div class="modal fade" id="modal_vista_producto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title">Detalles del producto</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="form_modal_vista_producto">
                    <p class="text-success" style="font-size: 0.7rem;">Aquí estan los detalles de</p>
                    <!-- <h4 class="text-success" id="nombre_vela"></h4> -->
                    <input hidden type="number" class="form-control form-group" id="id_producto">
                    <input required type="text" class="form-control form-group" id="nombre_vela">
                    <textarea type="text" class="form-control form-group " id="descripcion_vela" name="descripcion"
                        placeholder="Cuenta algo sobre el producto" rows="4"></textarea>
                    <input hidden type="number" class="form-control" id="cantidad_total_cera">
                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Ingredientes</p>

                    <div id="fila_producto"></div>

                    <hr>
                    <p onclick="mostrar_select_accesorios()" class="text-success" style="font-size: 0.7rem;">Quieres agregar algo? <i class="bi bi-plus-circle"></i></p>
                    <div style="display: none" id="div_lista_accesorios_para_sumar" class="row">
                        <div class="col-md-10">
                            <select type="text" class="form-control" id="lista_accesorios_para_sumar"></select>
                        </div>
                        <div class="col-md-2" style="text-align: right; padding: 0;">
                            <button type="button" onclick="agregar_accesorio()" disabled id="bnt_suma_accesorio" class="btn"><i id="icono_bnt_suma_accesorio" class="text-dark bi bi-check-circle"></i></button>
                        </div>
                    </div>
                    
                    <hr>
                    <p class="text-success" style="font-size: 0.7rem;">Precios finales</p>
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

<!-- MODAL CANTIDAD CERA-->
<div class="modal fade" data-backdrop="static" data-keyboard="false" id="modal_cantidad_cera"  data-target="bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
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
                        <button type="button" data-dismiss="modal" class="btn btn-success">Volver</button>
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