<?php
require_once('../../../../db/conexion.php'); 

session_start();

$nombre = $_POST['nombre'];    
$descripcion = $_POST['descripcion'];
$cantidad = $_POST['cantidad'];
$lista = $_POST['lista_ingredientes'];
$id_producto = $_POST['id'];

function update($bdd, $nombre, $descripcion, $cantidad, $lista, $id_producto){
    $sql = "DELETE FROM accesorio_producto WHERE fk_id_producto = :id_producto";
    $req = $bdd->prepare($sql);
    $req->bindParam(":id_producto", $id_producto);
    $req->execute();

 
    $sql2 = "UPDATE producto SET nombre = :nombre, descripcion = :descripcion, cantidad_cera = :cantidad_cera WHERE id = :id";
    $req2 = $bdd->prepare($sql2);
    $req2->bindParam(":nombre", $nombre);
    $req2->bindParam(":descripcion", $descripcion);
    $req2->bindParam(":cantidad_cera", $cantidad);
    $req2->bindParam(":id", $id_producto);
    $req2->execute();


    for ($i=0; $i<count($lista); $i++){
        $sql3 = "INSERT INTO accesorio_producto(fk_id_producto, fk_id_accesorio) VALUES (:fk_id_producto, :fk_id_accesorio)"; 
        $req3 = $bdd->prepare($sql3);
        $req3->bindParam(":fk_id_producto", $id_producto);
        $req3->bindParam(":fk_id_accesorio", intval($lista[$i]));
        $req3->execute();
        $res3 = $req3->fetchAll(PDO::FETCH_ASSOC);            
    }    
}

update($bdd, $nombre, $descripcion, $cantidad, $lista, $id_producto);
echo json_encode(True);  

?>