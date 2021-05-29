<?php
    try{
            $bdd = new PDO('mysql:host=localhost;dbname=rincon;charset=utf8', 'root', 'abc123');
    }
    catch(Exception $e){
            die('Error : '.$e->getMessage());
    }
