<?php
require_once('../../../../db/conexion.php'); 

session_start();

$nombre = $_POST['nombre'];    
$descripcion = $_POST['descripcion'];
$cantidad = $_POST['cantidad'];
$lista = $_POST['lista_ingredientes'];
$sql = "INSERT INTO producto(nombre, descripcion, cantidad_cera) VALUES (:nombre, :descripcion, :cantidad_cera)";
$req = $bdd->prepare($sql);
$req->bindParam(":nombre", $nombre);
$req->bindParam(":descripcion", $descripcion);
$req->bindParam(":cantidad_cera", $cantidad);
$req->execute();
$id_producto = $bdd->lastInsertId();
if (!$id_producto) {
    print_r($bdd->errorInfo());
    die ('ERROR EN PREPARACION INSERT');
}else{
    for ($i=0; $i<count($lista); $i++){
        $sql = "INSERT INTO accesorio_producto(fk_id_producto, fk_id_accesorio) VALUES (:fk_id_producto, :fk_id_accesorio)"; 
        $req = $bdd->prepare($sql);
        $req->bindParam(":fk_id_producto", $id_producto);
        $req->bindParam(":fk_id_accesorio", intval($lista[$i]));
        $req->execute();
        $res = $req->fetchAll(PDO::FETCH_ASSOC);            
    }    
    echo json_encode(True); 
}
?>