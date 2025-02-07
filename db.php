<?php
$host = "localhost";
$dbname = "n9000275_stock";
$user = "n9000275_nahuel";
$password = "testsdaiooeEE2";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>
