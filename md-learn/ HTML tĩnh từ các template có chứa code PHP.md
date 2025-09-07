##  HTML tĩnh từ các template có chứa code PHP

Tất nhiên. PHP có các hàm rất mạnh để đọc, ghi và xử lý nội dung file, biến nó thành công cụ lý tưởng để tạo các tệp HTML tĩnh từ các template.

Bạn có hai cách chính để xử lý chuỗi và chèn dữ liệu vào file HTML tĩnh:

### 1\. Sử dụng Placeholder và hàm str\_replace()

Đây là cách đơn giản và phổ biến nhất. Bạn sẽ tạo một file HTML template, chèn các **"placeholder"** (chuỗi giữ chỗ) vào đó, sau đó dùng PHP để tìm và thay thế các chuỗi này bằng dữ liệu thực tế.

#### File HTML Template (ví dụ: `template.html`)

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
</head>
<body>
    <h1>{{ heading }}</h1>
    <div class="content">
        <p>{{ content }}</p>
    </div>
</body>
</html>
```

#### Script PHP (ví dụ: `build.php`)

```php
<?php
// Bước 1: Đọc nội dung file template vào một biến
$template = file_get_contents('template.html');

// Bước 2: Tạo dữ liệu động
$data = [
    'title' => 'Đây là tiêu đề bài viết',
    'heading' => 'Bài viết mới nhất',
    'content' => 'Nội dung chi tiết của bài viết được lấy từ database.'
];

// Bước 3: Thay thế các placeholder bằng dữ liệu
$html_content = str_replace(
    ['{{ title }}', '{{ heading }}', '{{ content }}'],
    [$data['title'], $data['heading'], $data['content']],
    $template
);

// Bước 4: Ghi nội dung đã xử lý ra một file HTML tĩnh mới
file_put_contents('bai-viet-moi.html', $html_content);

echo "Đã tạo file bai-viet-moi.html thành công!";
?>
```

Cách này hiệu quả, dễ hiểu và không yêu cầu file template phải được PHP xử lý.

-----

### 2\. Sử dụng Template Engine hoặc Output Buffering

Cách này phức tạp hơn một chút, nhưng cho phép bạn viết code PHP trực tiếp trong file HTML template, tương tự như cú pháp `<?= ?>` mà bạn đã đề cập.

#### File HTML Template (ví dụ: `template_php.php`)

```html
<!DOCTYPE html>
<html>
<head>
    <title><?= $title ?></title>
</head>
<body>
    <h1><?= $heading ?></h1>
    <div class="content">
        <p><?= $content ?></p>
    </div>
</body>
</html>
```

#### Script PHP (ví dụ: `build_complex.php`)

```php
<?php
// Bước 1: Đặt các biến cần thiết
$title = 'Sản phẩm mới ra mắt';
$heading = 'Laptop siêu mỏng';
$content = 'Thông tin chi tiết về sản phẩm laptop.';

// Bước 2: Bắt đầu bộ đệm đầu ra (Output Buffering)
// Mọi output sau dòng này sẽ được lưu vào bộ nhớ thay vì gửi thẳng đến trình duyệt
ob_start();

// Bước 3: "Include" file template
// PHP sẽ thực thi code trong file này
include 'template_php.php';

// Bước 4: Lấy nội dung từ bộ đệm ra và lưu vào một biến
$html_content = ob_get_clean();

// Bước 5: Ghi nội dung đã xử lý ra một file HTML tĩnh mới
file_put_contents('san-pham-moi.html', $html_content);

echo "Đã tạo file san-pham-moi.html thành công!";
?>
```

  * **`ob_start()`** và **`ob_get_clean()`** là các hàm quan trọng trong kỹ thuật này. Chúng cho phép bạn "bắt" output của một đoạn code (trong trường hợp này là `include 'template_php.php'`) và lưu nó vào một biến, thay vì in thẳng ra màn hình. Điều này giúp bạn tạo ra các file HTML tĩnh từ các template có chứa code PHP.