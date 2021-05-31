<?php
require_once('../../../../db/conexion.php'); 

session_start();
//
$sql = "SELECT
	pedido.id,
	sum( accesorio.precio ) AS precio_pedido
FROM
	pedido
	INNER JOIN pedido_producto
	 ON pedido.id = pedido_producto.fk_id_pedido
	INNER JOIN producto
	 ON pedido_producto.fk_id_producto = producto.id
	INNER JOIN accesorio_producto
	 ON producto.id = accesorio_producto.fk_id_producto
	INNER JOIN accesorio
	 ON accesorio_producto.fk_id_accesorio = accesorio.id
GROUP BY
    pedido.id
    ";
// $sql = "SELECT * FROM pedido
//         ORDER BY id
//         LIMIT 50";
$req = $bdd->prepare($sql);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>