
<?php
header("Content-Type: application/json");
// Habilitar CORS
header("Access-Control-Allow-Origin: *"); // Permite todas las solicitudes (cambiar '*' por un dominio específico si es necesario)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos
header("Access-Control-Allow-Credentials: true"); // Permite credenciales en la solicitud
// Manejar preflight request (CORS)


require_once "db.php";

$method = $_SERVER["REQUEST_METHOD"];
$action = isset($_GET["action"]) ? $_GET["action"] : "";

// Validar token antes de ejecutar cualquier acción
// $headers = function_exists('getallheaders') ? getallheaders() : [];
// $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

// if (!$authHeader || !verificarToken($authHeader)) {
//     respuestaError("Acceso no autorizado. Token inválido.");
// }


switch ($method) {
    case "POST":
        if ($action == "agregar_envio") {
            agregarEnvio();
        } elseif ($action == "editar_envio") {
            editarEnvio();
        } elseif ($action == "eliminar_envio") {
            eliminarEnvio();
        } elseif ($action == "crear_favorito") {
            crearFavorito();
        } elseif ($action == "eliminar_favorito") {
            eliminarFavorito();
        } else {
            respuestaError("Acción no válida");
        }
        break;
    
    case "GET":
        if ($action == "consultar_favoritos") {
            consultarFavoritos();
        } elseif ($action == "consultar_envios") {
            consultarEnvios();
        } else {
            respuestaError("Acción no válida");
        }
        break;
    default:
        respuestaError("Método no permitido");
}

function consultarFavoritos() {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("CALL ConsultarFavoritos()");
        $stmt->execute();
        $favoritos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $favoritos]);
        exit;
    } catch (PDOException $e) {
        respuestaError($e->getMessage());
    }
}
function consultarEnvios() {
    global $pdo;
    $fecha = isset($_GET["fecha"]) ? $_GET["fecha"] : "";
    
    if (!$fecha) {
        respuestaError("Debe proporcionar una fecha válida");
    }
    
    try {
        $stmt = $pdo->prepare("CALL ConsultarEnvios(?)");
        $stmt->execute([$fecha]);
        $envios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $envios]);
        exit;
    } catch (PDOException $e) {
        respuestaError($e->getMessage());
    }
}

// Función para verificar si el token es válido
function verificarToken($token) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT IDPrimaria FROM usuarios WHERE TOKEN = :token LIMIT 1");
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC) ? true : false;
}

function agregarEnvio() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!validarDatosEnvio($data)) {
        respuestaError("Datos inválidos");
    }

    $sql = "CALL AgregarEnvio(?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    $stmt = $pdo->prepare($sql);
    
    try {
        $stmt->execute([
            $data["numero"], $data["nombre"], $data["direccion"], 
            $data["numeracion"], $data["localidad"], 
            $data["tipoEnvio"], $data["costo"], $data["observaciones"],$data["pago"],$data["fecha"]
        ]);
        respuestaExitosa("Envío agregado correctamente");
    } catch (PDOException $e) {
        respuestaError($e->getMessage());
    }
}

function editarEnvio() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["id"]) || !validarDatosEnvio($data)) {
        respuestaError("Datos inválidos");
    }

    $sql = "CALL EditarEnvio(?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([
            $data["id"], $data["numero"], $data["nombre"], 
            $data["direccion"], $data["numeracion"], $data["localidad"], 
            $data["tipoEnvio"], $data["costo"], $data["observaciones"],$data["pago"]
        ]);
        respuestaExitosa("Envío actualizado correctamente");
    } catch (PDOException $e) {
        respuestaError($e->getMessage());
    }
}

function eliminarEnvio() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["id"])) {
        respuestaError("ID requerido");
    }

    $sql = "CALL EliminarEnvio(?)";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$data["id"]]);
        respuestaExitosa("Envío eliminado correctamente");
    } catch (PDOException $e) {
        respuestaError($e->getMessage());
    }
}

function crearFavorito() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["nombre"], $data["direccion"], $data["numeracion"], $data["localidad"])) {
        respuestaError("Datos inválidos");
    }

    $sql = "CALL CrearFavorito(?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$data["nombre"], $data["direccion"], $data["numeracion"], $data["localidad"]]);
        respuestaExitosa("Favorito agregado correctamente");
    } catch (PDOException $e) {
        respuestaError($e->getMessage());
    }
}

function eliminarFavorito() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["id"])) {
        respuestaError("ID requerido");
    }

    $sql = "CALL EliminarFavorito(?)";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$data["id"]]);
        respuestaExitosa("Favorito eliminado correctamente");
    } catch (PDOException $e) {
        respuestaError($e->getMessage());
    }
}

function validarDatosEnvio($data) {
    return isset($data["numero"], $data["nombre"], $data["direccion"], $data["numeracion"], 
                  $data["localidad"], $data["tipoEnvio"], $data["costo"], $data["observaciones"]);
}

function respuestaExitosa($mensaje) {
    echo json_encode(["success" => true, "message" => $mensaje]);
    exit;
}

function respuestaError($mensaje) {
    echo json_encode(["success" => false, "message" => $mensaje]);
    exit;
}

function validarJSON($data) {
    if (json_last_error() !== JSON_ERROR_NONE) {
        respuestaError("JSON inválido");
    }
}
?>
