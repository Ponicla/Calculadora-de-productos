<?php
require_once('../../../../db/conexion.php'); 

session_start();

$id = $_POST['id'];
$sql = "DELETE FROM pedido_producto WHERE fk_id_pedido = :id; DELETE FROM pedido WHERE pedido.id = :id";

$req = $bdd->prepare($sql);
$req->bindParam(':id', $id);
$req->execute(); 
$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>
