<?php
require_once('../../../../db/conexion.php'); 

session_start();

if (isset($_POST['nombre']) && isset($_POST['precio']) && isset($_POST['tipo']) && isset($_POST['id'])){
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $tipo = $_POST['tipo'];

    $sql = "UPDATE accesorio SET nombre = :nombre, precio = :precio, fk_id_tipo = :tipo, edicion = NOW() WHERE id = :id";
    $req = $bdd->prepare($sql);
    $req->bindParam(":nombre", $nombre);
    $req->bindParam(":precio", $precio);
    $req->bindParam(":tipo", $tipo);
    $req->bindParam(":id", $id);  
    $res = $req->execute();

    // echo json_encode($res);
    if (!$res) {
        print_r($bdd->errorInfo());
        die ('ERROR EN PREPARACION UPDATE');
    }else{
        $sql = "SELECT accesorio.id, accesorio.precio, accesorio.edicion, accesorio.nombre, tipo_accesorio.tipo, tipo_accesorio.id AS id_tipo FROM accesorio
                INNER JOIN tipo_accesorio ON accesorio.fk_id_tipo = tipo_accesorio.id
                WHERE accesorio.id = :id"; 
        $req = $bdd->prepare($sql);
        $req->bindParam(":id", $id);
        $req->execute();
        $res = $req->fetchAll(PDO::FETCH_ASSOC);
        if (!$res) {
            print_r($bdd->errorInfo());
            die ('ERROR EN PREPARACION SELECT');
        }else{
            echo json_encode($res); 
        }
    }   
}
