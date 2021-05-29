<?php
require_once('../../../../db/conexion.php'); 

session_start();

$nombre = '%'.$_POST['nombre'].'%';

$sql = "SELECT accesorio.id, accesorio.precio, accesorio.edicion, accesorio.nombre, tipo_accesorio.tipo,  tipo_accesorio.id AS id_tipo  FROM accesorio
        INNER JOIN tipo_accesorio ON accesorio.fk_id_tipo = tipo_accesorio.id
        WHERE accesorio.nombre LIKE :nombre OR tipo_accesorio.tipo LIKE :nombre
        ORDER BY tipo_accesorio.tipo, accesorio.nombre
        LIMIT 8";
        //OR tipo_accesorio.tipo LIKE '%:nombre%'";
$req = $bdd->prepare($sql);
$req->bindParam(':nombre', $nombre);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>