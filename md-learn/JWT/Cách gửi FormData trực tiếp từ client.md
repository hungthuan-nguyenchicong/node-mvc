# Cách gửi FormData trực tiếp từ client

## JavaScript

// Phía Client (Vanilla JS)
const fileInput = document.getElementById('myFile');
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://php-server.com/api/upload', {
    method: 'POST',
    // Bỏ headers: {'Content-Type': 'application/json'}
    body: formData, // Gửi FormData trực tiếp
});

## Cách nhận FormData trên máy chủ PHP

// Phía Server (PHP)
if (isset($_FILES['file'])) {
    $uploadDir = './uploads/';
    $uploadedFile = $uploadDir . basename($_FILES['file']['name']);
    
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadedFile)) {
        echo json_encode(['message' => 'File uploaded successfully.']);
    } else {
        echo json_encode(['error' => 'Failed to save file.']);
    }
} else {
    echo json_encode(['error' => 'No file found in the request.']);
}

