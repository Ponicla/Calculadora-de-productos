<?php
require_once('../../../../db/conexion.php'); 

session_start();

if (isset($_POST['id'])){
        $ID= $_POST['id'];
        
        $sql = "DELETE FROM accesorio WHERE id = :id";
        $req = $bdd->prepare($sql);
        $req->bindParam(":id", $ID);
        $req->execute();

        if ($req == false) {
            // print_r($bdd->errorInfo());
            die ('ERROR EN PREPARACION');
        }else{
            echo json_encode(True);
        }   
}
?>