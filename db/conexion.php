<?php
    try{
            $bdd = new PDO('mysql:host=localhost;dbname=rincon;charset=utf8', 'root', 'abc12345');
    }
    catch(Exception $e){
            die('Error : '.$e->getMessage());
    }
