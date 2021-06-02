<?php
require_once('../../../../db/conexion.php'); 

session_start();

$id = $_POST['id'];
$descripcion = $_POST['descripcion'];
$sql = "UPDATE pedido SET descripcion = :descripcion WHERE pedido.id = :id";

$req = $bdd->prepare($sql);
$req->bindParam(':id', $id);
$req->bindParam(':descripcion', $descripcion);
$req->execute(); 
$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>
