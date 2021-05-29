<?php
require_once('../../../../db/conexion.php'); 

session_start();
$nombre = '%'.$_POST['nombre'].'%';
$sql = "SELECT * FROM producto
        WHERE producto.nombre LIKE :nombre
        ORDER BY  producto.nombre
        LIMIT 50";
        
$req = $bdd->prepare($sql);
$req->bindParam(':nombre', $nombre);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>