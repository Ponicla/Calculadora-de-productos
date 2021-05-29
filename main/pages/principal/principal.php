
<?php
 include('../arriba.php');
 include('../nav.php');



?>


<div class="container-fluid">
    <?php

    date_default_timezone_set('America/Argentina/Buenos_Aires');
    $hora = date('H');

    
        if($hora >= '07' &&  $hora <= '12'){
            $saludo = 'Buen día';
            echo ("<div class='alert alert-info mt-2'> <i class='bi bi-brightness-alt-high'></i> $saludo</div>");
        } 
        else if($hora > '12' && $hora <= '19'){
            $saludo = 'Buenas tardes';
            echo ("<div class='alert alert-info mt-2'> <i class='bi bi-brightness-high'></i> $saludo</div>");
        }else if($hora > '19' && $hora <= '07'){
            $saludo = 'Buenas noches';
            echo ("<div class='alert alert-info mt-2'><i class='bi bi-moon'></i> $saludo </div>");
        }
        else if($hora < '07'){
            $saludo = 'Buenas noches';
            echo ("<div class='alert alert-info mt-2'><i class='bi bi-moon'></i> $saludo </div>");
        }
    ?>
    
</div>

<div class="container-fluid">


    <hr>
    <p class="text-success">Qué desea hacer?</p>
    
    <div class="card-deck">
        <div class="card" style="max-width: 18rem;">
        <div class="mt-3" id="centrador">
            <img class="card-img-top" src="../../../resources/assets/bombilla.png"  style="max-width: 10rem;" alt="Card image cap">
        </div>
          <div class="card-body">
            <h5 class="card-title">Producto</h5>
            <p class="card-text">Cree un nuevo producto para guardar en el almacen de productos</p>
            <div class="card-footer" style="text-align: right; background-color : white; padding-left: 0; padding-right: 0;">
                <!-- <form action="../../funciones/php/reportes/reporte_finalizados.php" method="POST"> -->
                    <a role="button" class="btn btn-success btn-block" href="../productos/productos.php">Nuevo producto</a>
                <!-- </form> -->
            </div>
          </div>
        </div>
        <div class="card" style="max-width: 18rem;">
            <div class="mt-3" id="centrador">
                <img id="imagen" class="card-img-top" src="../../../resources/assets/pedido.png" style="max-width: 10rem;" alt="Card image cap">
            </div>
          <div class="card-body">
            <h5 class="card-title">Pedido</h5>
            <p class="card-text">Generar un nuevo pedido con productos del almacen y obtenga el presupuesto</p>
            <div class="card-footer" style="text-align: right; background-color : white; padding-left: 0; padding-right: 0;">
                <!-- <form action="../../funciones/php/reportes/reporte_espera.php" method="POST"> -->
                    <a role="button" class="btn btn-success btn-block" href="../pedidos/pedidos.php">Nuevo pedido</a>
                <!-- </form> -->
            </div>
          </div>
        </div>
        
      </div>
</div>


 


<?php
 include('../abajo.php');
?>