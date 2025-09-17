<?php
header('Content-Type: application/json');

error_log("Debug: PHP script started.");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("Debug: Invalid request method.");
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Read raw input stream
$input_stream = fopen('php://input', 'r');
if (!$input_stream) {
    error_log("Debug: Failed to open php://input stream.");
    echo json_encode(['status' => 'error', 'message' => 'Failed to open input stream.']);
    exit;
}

// Log the raw data to check if anything is being received
$raw_data = stream_get_contents($input_stream);
error_log("Debug: Received raw data length: " . strlen($raw_data));

// Check if $_FILES is populated (it won't be in this case, but good for debugging)
if (empty($_FILES)) {
    error_log("Debug: \$_FILES is empty. This is expected in this scenario.");
}

// Tùy chọn: Xử lý dữ liệu multipart/form-data thủ công.
// Điều này phức tạp và không cần thiết nếu bạn chỉ muốn xác nhận dữ liệu đã được nhận.
// Dữ liệu thô chứa cả headers và nội dung tệp.

// Trả về thành công nếu dữ liệu thô có độ dài lớn hơn 0
if (strlen($raw_data) > 0) {
    echo json_encode(['status' => 'success', 'message' => 'Raw data received. Manual file parsing needed.']);
} else {
    error_log("Debug: Raw data is empty.");
    echo json_encode(['status' => 'error', 'message' => 'No raw data received.']);
}

fclose($input_stream);
?>