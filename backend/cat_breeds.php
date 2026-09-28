<?php
// cat_breeds.php — REST API (CRUD) incl. image_url + lifespan
require_once 'connection.php';
require_once 'auth.php';

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('X-Backend-Version: 4');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$auth = new authObj();
if (!$auth->authenticate()) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$db = new dbObj();
$conn = $db->getConnstring();

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {

    // READ
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare('SELECT id, name, origin, temperament, description, image_url, lifespan, popularity, search_count FROM cat_breeds WHERE id = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $breed = $stmt->get_result()->fetch_assoc();
            if ($breed) {
                echo json_encode($breed);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Breed not found']);
            }
        } else {
            $result = $conn->query('SELECT id, name, origin, temperament, description, image_url, lifespan, popularity, search_count FROM cat_breeds ORDER BY name ASC');
            $breeds = [];
            while ($row = $result->fetch_assoc()) {
                $breeds[] = $row;
            }
            echo json_encode($breeds);
        }
        break;

    // CREATE
    case 'POST':
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!is_array($data) || empty(trim($data['name'] ?? '')) || empty(trim($data['origin'] ?? ''))) {
                http_response_code(422);
                echo json_encode(['error' => 'Name and Origin are required']);
                break;
            }
            // Bind by variable (PHP 7.4 mysqli rejects expressions in bind_param).
            $bkName        = trim($data['name']);
            $bkOrigin      = trim($data['origin']);
            $bkTemperament = trim($data['temperament'] ?? '');
            $bkDescription = trim($data['description'] ?? '');
            $bkImageUrl    = trim($data['image_url'] ?? '');
            $bkLifespan    = trim($data['lifespan'] ?? '');
            $bkPopularity  = intval($data['popularity'] ?? 0);
            $bkSearchCount = intval($data['search_count'] ?? 0);

            $stmt = $conn->prepare('INSERT INTO cat_breeds (name, origin, temperament, description, image_url, lifespan, popularity, search_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
                break;
            }
            $stmt->bind_param('ssssssii', $bkName, $bkOrigin, $bkTemperament, $bkDescription, $bkImageUrl, $bkLifespan, $bkPopularity, $bkSearchCount);
            if (!$stmt->execute()) {
                http_response_code(500);
                echo json_encode(['error' => 'Execute failed: [' . $stmt->errno . '] ' . $stmt->error]);
                break;
            }
            http_response_code(201);
            echo json_encode([
                'id'          => $stmt->insert_id,
                'name'        => $bkName,
                'origin'      => $bkOrigin,
                'temperament' => $bkTemperament,
                'description' => $bkDescription,
                'image_url'   => $bkImageUrl,
                'lifespan'    => $bkLifespan,
                'popularity'  => $bkPopularity,
                'search_count'=> $bkSearchCount,
            ]);
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode([
                'error'  => 'Exception: ' . $e->getMessage(),
                'errno'  => isset($conn) ? $conn->errno : null,
                'mysqli' => isset($conn) ? $conn->error : null,
            ]);
        }
        break;

    // UPDATE
    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing breed id']);
            break;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        // Preserve popularity / search_count when the client doesn't send them.
        $current = $conn->query('SELECT popularity, search_count FROM cat_breeds WHERE id = ' . $id)->fetch_assoc();
        $popularity = array_key_exists('popularity', $data) ? intval($data['popularity']) : intval($current['popularity'] ?? 0);
        $searchCount = array_key_exists('search_count', $data) ? intval($data['search_count']) : intval($current['search_count'] ?? 0);

        // Bind by variable (PHP 7.4 mysqli rejects expressions in bind_param).
        $updName        = trim($data['name'] ?? '');
        $updOrigin      = trim($data['origin'] ?? '');
        $updTemperament = trim($data['temperament'] ?? '');
        $updDescription = trim($data['description'] ?? '');
        $updImageUrl    = trim($data['image_url'] ?? '');
        $updLifespan    = trim($data['lifespan'] ?? '');

        $stmt = $conn->prepare('UPDATE cat_breeds SET name = ?, origin = ?, temperament = ?, description = ?, image_url = ?, lifespan = ?, popularity = ?, search_count = ? WHERE id = ?');
        $stmt->bind_param('ssssssiii', $updName, $updOrigin, $updTemperament, $updDescription, $updImageUrl, $updLifespan, $popularity, $searchCount, $id);
        $stmt->execute();

        $fetch = $conn->prepare('SELECT id, name, origin, temperament, description, image_url, lifespan, popularity, search_count FROM cat_breeds WHERE id = ?');
        $fetch->bind_param('i', $id);
        $fetch->execute();
        $updated = $fetch->get_result()->fetch_assoc();

        if ($updated) {
            echo json_encode($updated);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Breed not found']);
        }
        break;

    // DELETE
    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing breed id']);
            break;
        }
        $stmt = $conn->prepare('DELETE FROM cat_breeds WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Breed not found']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();