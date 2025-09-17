<?php


// Thiết lập header để trình duyệt biết dữ liệu là JSON







// Tạo một mảng dữ liệu
$data = array(
    'status' => 'success',
    'message' => 'Dữ liệu được trả về thành công.',
    'user' => array(
        'id' => 1,
        'name' => 'John Doe',
        'email' => 'johndoe@example.com'
    ),
);

$cars = [
    'success' => 'ok',
];

$file = $_FILES["file"];
//error_log($file);
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');


// Chuyển đổi mảng thành chuỗi JSON và in ra
//echo json_encode($data);
//echo json_encode($cars);
echo json_encode($file);

?>