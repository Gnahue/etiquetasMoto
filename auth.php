<?php
header("Content-Type: application/json");
// Habilitar CORS
header("Access-Control-Allow-Origin: *"); // Permite todas las solicitudes (cambiar '*' por un dominio específico si es necesario)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos
header("Access-Control-Allow-Credentials: true"); // Permite credenciales en la solicitud

// Manejar preflight request (CORS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}
require_once "db.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["nombre"], $data["password"])) {
        respuestaError("nombre y contraseña son requeridos");
    }

    global $pdo;
    
    $sql = "CALL LoginUsuario(?, ?)";
    $stmt = $pdo->prepare($sql);
    
    try {
        $stmt->execute([$data["nombre"], $data["password"]]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result && $result["user_id"]) {
            respuestaExitosa([
                "user_id" => $result["user_id"],
                "token" => $result["token"],
                "message" => $result["message"]
            ]);
        } else {
            respuestaError("Credenciales incorrectas");
        }
    } catch (PDOException $e) {
        respuestaError($e->getMessage());
    }
} else {
    respuestaError("Método no permitido");
}

function respuestaExitosa($data) {
    echo json_encode(["success" => true, "data" => $data]);
    exit;
}

function respuestaError($mensaje) {
    echo json_encode(["success" => false, "message" => $mensaje]);
    exit;
}
?>
