# coundown

if (result.success) {
                errMessage.innerHTML = 'Update thành công';
                countdown(form);
            }

## function countdown(form)

function countdown(form) {
    const countdownElement = form.querySelector('.countdown');
    const delayInSeconds = 3;
    let countdownValue = delayInSeconds;

    // cập nhật hiển thị
    countdownElement.textContent = countdownValue;

    // Hàm đếm ngược và cập nhật hiển thị
    function updateCountdown() {
        countdownElement.textContent = countdownValue;
        countdownValue --;
    }

    // Cập nhật đếm ngược mỗi giây
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Sử dụng setTimeout để chờ và sau đó chuyển hướng

    setTimeout(() => {
        // Dừng bộ đếm ngược để tránh hiển thị giá trị âm
        clearInterval(countdownInterval);
        // Chuyển hướng đến URL đích
        const newUrl = `/admin/?p=post&v=index`;
        window.history.pushState(null, null, newUrl);
        const adminRouterEvent = new CustomEvent('adminRouter', {detail:{url:newUrl}});
        document.dispatchEvent(adminRouterEvent);
    }, delayInSeconds * 1000);
}