const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('./config/multer'); // Đường dẫn đến cấu hình Multer
const MobileModel = require('./models/mobileModel');

const app = express();
const port = 3000;

// Kết nối đến MongoDB
const uri = 'mongodb+srv://hoalacanh2508:FnXN4Z9PhHQdRbcv@cluster0.xdbxkit.mongodb.net/AND103';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB', error));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Cung cấp thư mục upload để truy cập ảnh

// Route để upload ảnh và tạo di động mới
app.post('/mobiles', multer.single('image'), async (req, res) => {
  try {
    const { name, born, brand, price } = req.body;
    const image = req.file ? req.file.filename : null; // Lấy tên file từ Multer

    // Tạo một đối tượng di động mới
    const newMobile = new MobileModel({
      name,
      born,
      brand,
      price,
      image // Thêm đường dẫn hoặc tên file của ảnh
    });

    // Lưu di động mới vào cơ sở dữ liệu
    await newMobile.save();

    res.status(201).send(newMobile);
  } catch (error) {
    console.error('Lỗi khi tạo di động:', error);
    res.status(500).send('Lỗi máy chủ nội bộ');
  }
});

// Route để cập nhật di động và ảnh
app.put('/mobiles/:id', multer.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, born, brand, price } = req.body;
    const image = req.file ? req.file.filename : null;

    // Cập nhật di động theo ID
    const updatedMobile = await MobileModel.findByIdAndUpdate(
      id,
      { name, born, brand, price, image },
      { new: true, runValidators: true }
    );

    if (!updatedMobile) {
      return res.status(404).send('Không tìm thấy di động');
    }

    res.send(updatedMobile);
  } catch (error) {
    console.error('Lỗi khi cập nhật di động:', error);
    res.status(500).send('Lỗi máy chủ nội bộ');
  }
});

// Route để xóa di động theo ID
app.delete('/mobiles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Xóa di động theo ID
    const deletedMobile = await MobileModel.findByIdAndDelete(id);

    if (!deletedMobile) {
      return res.status(404).send('Không tìm thấy di động');
    }

    res.status(200).send('Di động đã được xóa');
  } catch (error) {
    console.error('Lỗi khi xóa di động:', error);
    res.status(500).send('Lỗi máy chủ nội bộ');
  }
});

// Route để lấy danh sách di động
app.get('/mobiles', async (req, res) => {
  try {
    let mobiles = await MobileModel.find();
    res.send(mobiles);
  } catch (error) {
    console.error('Error fetching mobiles:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route để lấy di động theo ID
app.get('/mobiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mobile = await MobileModel.findById(id);

    if (!mobile) {
      return res.status(404).send('Không tìm thấy di động');
    }

    res.send(mobile);
  } catch (error) {
    console.error('Lỗi khi lấy di động:', error);
    res.status(500).send('Lỗi máy chủ nội bộ');
  }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/view-mobiles', async (req, res) => {
  try {
    const mobiles = await MobileModel.find();
    let html = '<!DOCTYPE html><html><head><title>Danh sách di động</title></head><body>';
    html += '<h1>Danh sách di động</h1>';
    html += '<ul>';

    mobiles.forEach(mobile => {
      html += `<li>
        <h2>${mobile.name}</h2>
        <p>Năm sản xuất: ${mobile.born}</p>
        <p>Thương hiệu: ${mobile.brand}</p>
        <p>Giá: ${mobile.price}</p>`;
      if (mobile.image) {
        html += `<img src="/uploads/${mobile.image}" alt="${mobile.name}" style="max-width: 200px;">`;
      }
      html += '</li>';
    });

    html += '</ul></body></html>';
    res.send(html);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách di động:', error);
    res.status(500).send('Lỗi máy chủ nội bộ');
  }
});

// Middleware xử lý lỗi 404 và lỗi máy chủ
app.use((req, res, next) => {
  res.status(404).send('Không tìm thấy trang');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Lỗi máy chủ nội bộ');
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
