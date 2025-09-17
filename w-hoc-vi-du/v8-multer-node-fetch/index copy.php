<?php
// Thiết lập header để trình duyệt biết dữ liệu là JSON
header('Content-Type: application/json');
// tạo mảng dũ liệu
$data = [
    'success' => 'ok'
];

echo json_encode($data);
?>