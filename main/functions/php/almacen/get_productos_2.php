<?php
require_once('../../../../db/conexion.php'); 

session_start();
$nombre = '%'.$_POST['nombre'].'%';
$sql = "SELECT
        producto.id,
        producto.nombre,
        producto.descripcion,
        sum( accesorio.precio ) AS precio,
        producto.cantidad_cera
        FROM
        accesorio
        INNER JOIN accesorio_producto
        ON accesorio.id = accesorio_producto.fk_id_accesorio
        INNER JOIN producto
        ON accesorio_producto.fk_id_producto = producto.id
        WHERE producto.nombre LIKE :nombre
        GROUP BY
        producto.id
        ORDER BY
        precio, producto.nombre";
        
$req = $bdd->prepare($sql);
$req->bindParam(':nombre', $nombre);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>