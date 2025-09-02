# vite-plugin-template-html

npm i vite-plugin-html-template

Với `vite-plugin-template-html`, bạn có thể cấu hình nhiều điểm vào (entry points) cho mỗi template bằng cách tạo nhiều instance của `createHtmlPlugin` trong mảng `plugins`. Mỗi instance sẽ tương ứng với một template và một file đầu ra.

### Cấu hình nhiều điểm vào

Bạn cần thêm một instance `createHtmlPlugin` cho mỗi trang bạn muốn tạo. Mỗi instance sẽ có `template` và `filename` riêng biệt. `filename` sẽ là tên file đầu ra trong thư mục `dist`.

```javascript
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-template-html';

export default defineConfig({
  plugins: [
    // Cấu hình cho trang chủ (index.html)
    createHtmlPlugin({
      // Điểm vào JavaScript cho trang này (nếu có)
      entry: 'src/main.js', 
      // File template
      template: 'index.html',
      // Tên file đầu ra
      filename: 'index.html',
      // Dữ liệu cho template
      data: {
        title: 'Trang chủ',
        heading: 'Chào mừng!',
        list: ['Item 1', 'Item 2', 'Item 3'],
      },
      minify: true,
    }),
    // Cấu hình cho trang giới thiệu (about.html)
    createHtmlPlugin({
      entry: 'src/about.js',
      template: 'about.html',
      filename: 'about.html',
      data: {
        title: 'Giới thiệu',
        content: 'Đây là trang giới thiệu.',
      },
      minify: true,
    }),
    // Thêm các instance khác cho các trang khác nếu cần
  ],
});
```

-----

### Lưu ý khi sử dụng nhiều điểm vào

  * **File template:** Đảm bảo bạn có các file template tương ứng (`index.html`, `about.html`) trong thư mục gốc hoặc thư mục được chỉ định.
  * **File JavaScript:** Mỗi trang có thể có một file JavaScript riêng, được chỉ định trong thuộc tính `entry`. Vite sẽ xử lý và liên kết file JS đó với trang tương ứng.
  * **Dữ liệu độc lập:** Bạn có thể truyền dữ liệu khác nhau cho mỗi trang thông qua thuộc tính `data`, giúp tùy chỉnh nội dung cho từng template.

Cách này giúp bạn xây dựng một ứng dụng đa trang (MPA) hiệu quả, nơi mỗi trang được xử lý độc lập trong quá trình build của Vite.