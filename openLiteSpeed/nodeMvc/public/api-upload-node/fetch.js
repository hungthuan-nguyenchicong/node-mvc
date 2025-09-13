fetch('http://your-domain.com/api-upload-node/', {
    method: 'GET',
    headers: {
        'X-From-Node': 'true'
    }
});