<?php
require_once('../../../../db/conexion.php'); 

session_start();

$sql = "SELECT * FROM tipo_accesorio";
$req = $bdd->prepare($sql);
$req->execute();

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>