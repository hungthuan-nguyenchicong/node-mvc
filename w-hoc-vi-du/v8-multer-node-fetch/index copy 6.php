<?php
// Tải dữ liệu POST thô
$rawData = file_get_contents('php://input');

if (empty($rawData)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'No raw data received.']);
    exit;
}

// Lấy ranh giới từ tiêu đề Content-Type
$contentType = $_SERVER['CONTENT_TYPE'];
preg_match('/boundary=(.*)$/', $contentType, $matches);
$boundary = $matches[1];

// Phân tách từng phần của dữ liệu
$parts = array_slice(explode('--' . $boundary, $rawData), 1, -1);

foreach ($parts as $part) {
    if (empty($part)) continue;

    // Phân tích tiêu đề và nội dung của từng phần
    $headersEnd = strpos($part, "\r\n\r\n");
    if ($headersEnd === false) continue;

    $headers = substr($part, 0, $headersEnd);
    $body = substr($part, $headersEnd + 4);

    // Lấy tên file và các thông tin khác từ tiêu đề
    if (preg_match('/name="([^"]+)"; filename="([^"]+)"/', $headers, $matches)) {
        $fieldName = $matches[1];
        $fileName = $matches[2];
        $uploadDir = __DIR__ . '/uploads/';
        $destPath = $uploadDir . $fileName;

        // Ghi nội dung vào file
        if (file_put_contents($destPath, $body) !== false) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'File đã được tải lên thành công.',
                'filePath' => $destPath
            ]);
            exit;
        }
    }
}

http_response_code(500);
echo json_encode(['status' => 'error', 'message' => 'Không có file nào được tải lên hoặc có lỗi xảy ra.']);