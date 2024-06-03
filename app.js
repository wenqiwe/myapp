const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser'); // 导入 body-parser 模块

// 创建 SQLite 数据库连接
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// 配置 Express 使用 body-parser 中间件来解析表单数据
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 设置 Express 使用静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 处理用户登录表单提交的路由
app.post('/login', (req, res) => {
    const phoneNumber = req.body.phone; // 获取表单中的电话号码
    const password = req.body.password; // 获取表单中的密码

    // 将电话号码和密码插入到数据库中的 users 表格中
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
    // 执行查询数据库中所有数据的操作
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving data from database');
            return;
        }
        // 创建一个 HTML 表格来呈现查询结果
        let tableHtml = '<table border="1">';
        // 添加表头
        tableHtml += '<tr><th>電話號碼</th><th>密碼</th></tr>';
        // 添加每一行数据
        rows.forEach(row => {
            tableHtml += `<tr><td>${row.phone_number}</td><td>${row.password}</td></tr>`;
        });
        tableHtml += '</table>';
        // 将表格 HTML 发送给客户端
        res.send(tableHtml);
    });
});



// 设置 Express 监听端口
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
