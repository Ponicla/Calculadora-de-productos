<?php
require_once('../../../../db/conexion.php'); 

session_start();

$id = $_POST['id'];

$sql = "SELECT
        accesorio.id,
        accesorio.nombre,
        accesorio.precio,
        tipo_accesorio.id as id_tipo
        FROM
        producto 
        INNER JOIN accesorio_producto
        ON producto.id = accesorio_producto.fk_id_producto
        INNER JOIN accesorio
        ON accesorio_producto.fk_id_accesorio = accesorio.id
        INNER JOIN tipo_accesorio
        ON accesorio.fk_id_tipo = tipo_accesorio.id
        WHERE
        producto.id = :id";
$req = $bdd->prepare($sql);
$req->bindParam(':id', $id);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>