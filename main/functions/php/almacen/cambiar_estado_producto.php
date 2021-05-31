<?php
require_once('../../../../db/conexion.php'); 

session_start();

$id = $_POST['id'];
$nuevo_estado = $_POST['nuevo_estado'];

$sql = "UPDATE producto
        SET estado = :nuevo_estado
        WHERE producto.id = :id";


$req = $bdd->prepare($sql);
$req->bindParam(':id', $id);
$req->bindParam(':nuevo_estado', $nuevo_estado);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>