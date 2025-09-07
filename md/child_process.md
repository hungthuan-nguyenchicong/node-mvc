## chạy lệnh trong máy chủ linux child_process

const { exec } = require('child_process');

const cacheKey = require('crypto').createHash('md5').update(urlToPurge).digest('hex');

exec(`rm -f ${cacheFilePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error purging cache.');
        }
        res.send('Nginx cache purged successfully.');
    });

