<?php
// sudo tail -f /usr/local/lsws/logs/error.log
header('Content-Type: application/json');
$headers = getallheaders();
// error_log(var_export($headers, true));
$response = [];
if ($headers['X-Image-Insert-Id']) {
    // 1. Kiểm tra xem file có được tải lên không và không có lỗi
    if (isset($_FILES['file']) && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
        // Lấy thông tin về file
        $fileTmpPath = $_FILES['file']['tmp_name'];
        $fileName = basename($_FILES['file']['name']);
        // thư mục lưu trữ file
        $uploadDir = __DIR__ . './../uploads/';
        // Đường dẫn đầy dủ cho file đích
        $destPath = $uploadDir . $fileName;
        // Đường dẫn image src
        $imageSrc = '/uploads/' . $fileName;
        // Di chuyển từ thư mục tạm đến thư mục đích
        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $response['status'] = 'success';
            $response['image_src'] = $imageSrc;
        } else {
            $response['status'] = 'error-upload-php';
            $response['image_insert_id'] = $headers['X-Image-Insert-Id'];
            $response['message'] = 'Không thể di chuyển file.';
        }

    } else {
        $response['status'] = 400;
    }
} else {
    $response['status'] = 500;
}
// tra ket qua ve json
echo json_encode($response);
?>