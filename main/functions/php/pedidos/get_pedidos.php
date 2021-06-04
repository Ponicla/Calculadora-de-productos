<?php
require_once('../../../../db/conexion.php'); 

session_start();

$id = $_POST['id'];

$sql="  SELECT
                pedido.id,
                producto.nombre,
                pedido.descripcion,
                pedido_producto.precio_producto as precio,
                producto.id as id_producto
        FROM
                producto
                INNER JOIN pedido_producto
                ON producto.id = pedido_producto.fk_id_producto
                INNER JOIN pedido
                ON pedido_producto.fk_id_pedido = pedido.id
        WHERE
                pedido.id = :id"; 

$req = $bdd->prepare($sql);
$req->bindParam(':id', $id);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>