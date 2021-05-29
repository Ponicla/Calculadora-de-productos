<?php
require_once('../../../../db/conexion.php'); 

session_start();

$id = $_POST['id'];

$sql = "SELECT accesorio.nombre, accesorio.precio
        FROM producto
        INNER JOIN accesorio_producto ON producto.id = accesorio_producto.fk_id_producto 
        INNER JOIN accesorio ON accesorio_producto.fk_id_accesorio = accesorio.id
        WHERE producto.id = :id";
$req = $bdd->prepare($sql);
$req->bindParam(':id', $id);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>