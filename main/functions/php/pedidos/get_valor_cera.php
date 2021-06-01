<?php
require_once('../../../../db/conexion.php'); 

session_start();

$sql = "SELECT
        accesorio.precio
        FROM
        tipo_accesorio
        INNER JOIN accesorio
        ON tipo_accesorio.id = accesorio.fk_id_tipo
        WHERE
        tipo_accesorio.id = 2";
$req = $bdd->prepare($sql);
$req->bindParam(':id', $id);
$req->execute(); 

$res = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($res); 

?>