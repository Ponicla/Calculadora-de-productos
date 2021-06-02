<?php
include '../arriba.php';
include '../nav.php';
?>

    <!-- ENCABEZADO -->
    <div class="container-fluid">
        <div class="alert alert-info mt-2"> Menú accesorios</div>

        <hr>
        <p class="text-success">Complete y agregue y un nuevo accesorio</p>

        <form id="form_nuevo_accesorio" action="">
            <div class="form-group row ">
                <div class="col-md-3 form-group">
                    <input required placeholder="Nombre del accesorio" id="nombre" name="nombre" type="text" class="form-control">
                </div>
                <div class="col-md-3 form-group">
                    <input required placeholder="Precio del accesorio" id="precio" name="precio" type="number" step="0.01" class="form-control">
                </div>
                <div class="col-md-3 form-group">
                    <select required name="tipo" id="tipo"  class="form-control">
                    </select>
                </div>
                <div class="col-md-2 form-group">
                    <button type="submit" class="btn btn-success text-white">Agregar</button>
                </div>
            </div>
        </form>
    </div>

    <div hidden id='indicador_de_que_no_hay_nada' class="container-fluid">
        <div class="alert alert-danger" role="alert">
            No hay nada por aquí, intente agregar accesorios  <i class="bi bi-emoji-frown"></i>
        </div>
    </div>

    <!-- TABLA DE ACCESORIOS -->
    <div hidden id="contenedor_tabla_accesorios" class="container-fluid mt-4">
        <hr>
        <p class="text-success">Listado de accesorios</p>

            <table id="tabla_accesorios" class="table mt-4" style="background-color: #F2FFEE; width:100%">
                <thead>
                    <tr>
                        <th>Id accessorio</th>
                        <th>Accessorio</th>
                        <th>Clase</th>
                        <th>Precio</th>
                        <th>Última edición</th>
                        <th>Id tipo</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>

            </table>
    </div>


    <!-- MODAL EDICION ACCESORIO -->
    <div class="modal fade" id="modal_edicion_accesorio" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Edición accesorio</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="form_modal_edicion_accesorio">
                    <div hidden class="form-group">
                        <label class="col-form-label">Identificador</label>
                        <input type="text" placeholder="" class="form-control" name="id"
                            id="modal_edicion_accesorio_id">
                    </div>

                    <div class="form-group">
                        <label class="col-form-label">Nombre del accesorio</label>
                        <input required type="text" placeholder="" class="form-control" name="nombre"
                            id="modal_edicion_accesorio_nombre">
                    </div>

                    <div class="form-group">
                        <label class="col-form-label">Clase</label>
                        <select required name="tipo" id="modal_edicion_id_tipo" class="form-control">
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="col-form-label">Precio</label>
                        <input required type="number" placeholder="" class="form-control" name="precio" step="0.01"
                            id="modal_edicion_accesorio_precio">
                    </div>
            </div>
            <div class="modal-footer pr-0">
                <button type="button" class="btn btn-success" data-dismiss="modal">Volver</button>
                <button type="submit" class="btn btn-success">Actualizar</button>
            </div>
            </form>
        </div>
    </div>
</div>

<?php
include '../abajo.php';
?>