<?php
require_once('../../../../db/conexion.php'); 

session_start();

$id = $_POST['id'];


//sum(accesorio.precio) as precio <<<no separa los productos, es mejor hacerlo afuera
//GROUP BY 
//producto.id"
        $sql = "SELECT
        pedido.id,
        producto.nombre,
        sum(accesorio.precio) as precio,
        producto.cantidad_cera
        FROM
        producto
        INNER JOIN pedido_producto
        ON producto.id = pedido_producto.fk_id_producto
        INNER JOIN pedido
        ON pedido_producto.fk_id_pedido = pedido.id
        INNER JOIN accesorio_producto
        ON producto.id = accesorio_producto.fk_id_producto
        INNER JOIN accesorio
        ON accesorio_producto.fk_id_accesorio = accesorio.id
        WHERE
        pedido.id = :id
        GROUP BY
        pedido_producto.id";
// $sql = "SELECT producto.nombre
// FROM producto
// INNER JOIN pedido_producto
// ON producto.id = pedido_producto.fk_id_producto
// WHERE pedido_producto.fk_id_pedido = :id"; 

$req = $bdd->prepare($sql);
$req->bindParam(':id', $id);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>