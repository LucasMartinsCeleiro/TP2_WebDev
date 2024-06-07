<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL); // Enable error reporting
ini_set('display_errors', 1); // Display errors
ini_set('log_errors', 1); // Log errors
ini_set('error_log', 'php_errors.log'); // Path to error log

$response = array('status' => 'error', 'message' => 'Unknown error'); // Default response

$dirPath = '../JSON/';
$filePath = $dirPath . 'Score.json';

// Check if the directory exists, if not, create it
if (!is_dir($dirPath)) {
    mkdir($dirPath, 0777, true);
    error_log("Directory created: " . $dirPath);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    error_log('Received data: ' . print_r($data, true)); // Debugging

    if ($data && isset($data['username']) && isset($data['location']) && isset($data['level']) && isset($data['progress'])) {
        if (!file_exists($filePath)) {
            file_put_contents($filePath, json_encode([]));
            error_log("File created: " . $filePath);
        }
        $scores = json_decode(file_get_contents($filePath), true);
        $scores[] = [
            'username' => $data['username'],
            'location' => $data['location'],
            'level' => $data['level'],
            'progress' => $data['progress'],
            'timestamp' => date('Y-m-d H:i:s')
        ];
        if (file_put_contents($filePath, json_encode($scores, JSON_PRETTY_PRINT))) {
            error_log('Score saved successfully'); // Debugging
            $response = array('status' => 'success');
        } else {
            error_log('Error saving score to file'); // Debugging
            $response['message'] = 'Error saving score';
        }
    } else {
        error_log('Invalid data received'); // Debugging
        $response['message'] = 'Invalid data';
    }
} else {
    error_log('Invalid request method'); // Debugging
    $response['message'] = 'Invalid request method';
}

echo json_encode($response); // Ensure a JSON response is always sent
?>
