<?php
require_once('../../../../db/conexion.php'); 

session_start();

$lista = $_POST['lista_productos'];
$descripcion = $_POST['descripcion'];
$sql = "INSERT INTO pedido VALUES (DEFAULT, DEFAULT, :descripcion)";
$req = $bdd->prepare($sql);
$req->bindParam(":descripcion", $descripcion);
$req->execute();
$id_pedido = $bdd->lastInsertId();
if (!$id_pedido) {
    print_r($bdd->errorInfo());
    die ('ERROR EN PREPARACION INSERT');
}else{
    for ($i=0; $i<count($lista); $i++){
        $sql = "INSERT INTO pedido_producto(fk_id_producto, fk_id_pedido) VALUES (:fk_id_producto, :fk_id_pedido)"; 
        $req = $bdd->prepare($sql);
        $req->bindParam(":fk_id_producto", intval($lista[$i]));
        $req->bindParam(":fk_id_pedido", $id_pedido);

        $req->execute();
        $res = $req->fetchAll(PDO::FETCH_ASSOC);            
    }    
    echo json_encode(True); 
}
?>