<?php
// ... (các header của bạn)
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$response = [];

// 1. Kiểm tra xem file có được tải lên không và không có lỗi
if (isset($_FILES["file"]) && $_FILES["file"]["error"] == UPLOAD_ERR_OK) {
    // 2. Lấy thông tin về file
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileName = $_FILES['file']['name'];
    
    // 3. Đặt thư mục đích để lưu file
    //$uploadDir = '../uploads/'; // Thư mục 'uploads' phải tồn tại và có quyền ghi!
    $uploadDir = __DIR__ . '/../uploads/';

    //error_log('upload: ' . $uploadDir);
    
    // 4. Tạo đường dẫn đầy đủ cho file đích
    $destPath = $uploadDir . $fileName;

    // 5. Di chuyển file từ thư mục tạm đến thư mục đích
    if (move_uploaded_file($fileTmpPath, $destPath)) {
        $response['status'] = 'success';
        $response['message'] = 'File đã được tải lên thành công.';
        $response['filePath'] = $destPath;
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Không thể di chuyển file.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Không có file nào được tải lên hoặc có lỗi xảy ra.';
}

// Trả về JSON chứa kết quả
echo json_encode($response);
?>