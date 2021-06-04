<?php
require_once('../../../../db/conexion.php'); 

session_start();
$sql = "SELECT
		pedido.id,
		pedido.fecha,
		sum(pedido_producto.precio_producto) AS precio_pedido,
		pedido.estado,
		pedido.descripcion,
		sum(producto.cantidad_cera) AS cantidad_cera
		FROM
		pedido
		INNER JOIN pedido_producto
		ON pedido.id = pedido_producto.fk_id_pedido
		INNER JOIN producto
		ON pedido_producto.fk_id_producto = producto.id
		GROUP BY pedido.id";
/* $sql = "SELECT id, precio AS precio_pedido, SUM(cantidad_cera) AS cantidad_cera, SUM(total_de_productos_con_cera) AS unidades_cera, estado
, descripcion
 FROM (
SELECT
 pedido.id AS id,
 0 AS cantidad_cera, 
 SUM(pedido_producto.precio_producto) AS precio,
 0 AS total_de_productos_con_cera,
 pedido.estado AS estado,
 pedido.descripcion AS descripcion
FROM
 pedido
INNER JOIN pedido_producto ON pedido.id = pedido_producto.fk_id_pedido
INNER JOIN producto ON pedido_producto.fk_id_producto = producto.id
INNER JOIN accesorio_producto ON producto.id = accesorio_producto.fk_id_producto
INNER JOIN accesorio ON accesorio_producto.fk_id_accesorio = accesorio.id
GROUP BY
 pedido.id UNION ALL
SELECT
					pedido_producto.fk_id_pedido AS id, SUM(producto.cantidad_cera) AS cantidad_cera, 
					NULL AS precio, 
					COUNT(producto.cantidad_cera) AS total_de_productos_con_cera,
					0 AS estado,
					'' AS descripcion
FROM
					producto
INNER JOIN pedido_producto ON producto.id = pedido_producto.fk_id_producto
WHERE
					producto.cantidad_cera > 0
GROUP BY
					pedido_producto.fk_id_pedido) p
GROUP BY id"; */




/* SELECT id, precio AS precio_pedido, SUM(cantidad_cera) AS cantidad_cera, SUM(total_de_productos_con_cera) AS unidades_cera, estado
FROM (
SELECT
 pedido.id AS id,
 0 AS cantidad_cera, SUM(accesorio.precio) AS precio,
 0 AS total_de_productos_con_cera,
 pedido.estado AS estado
FROM
 pedido
INNER JOIN pedido_producto ON pedido.id = pedido_producto.fk_id_pedido
INNER JOIN producto ON pedido_producto.fk_id_producto = producto.id
INNER JOIN accesorio_producto ON producto.id = accesorio_producto.fk_id_producto
INNER JOIN accesorio ON accesorio_producto.fk_id_accesorio = accesorio.id
GROUP BY
 pedido.id UNION ALL
SELECT
					pedido_producto.fk_id_pedido AS id, SUM(producto.cantidad_cera) AS cantidad_cera, 
					NULL AS precio, 
					COUNT(producto.cantidad_cera) AS total_de_productos_con_cera,
					0 AS estado
FROM
					producto
INNER JOIN pedido_producto ON producto.id = pedido_producto.fk_id_producto
WHERE
					producto.cantidad_cera > 0
GROUP BY
					pedido_producto.fk_id_pedido) p
GROUP BY id */



// $sql = "SELECT * FROM pedido
//         ORDER BY id
//         LIMIT 50";
$req = $bdd->prepare($sql);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>