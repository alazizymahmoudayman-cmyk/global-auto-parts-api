const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. الاتصال بالداتابيز
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("تم الاتصال بالداتابيز بنجاح! ✅"))
  .catch(err => console.log("خطأ في الاتصال: ❌", err));

// 2. تعريف شكل البيانات (Schema)
const StatsSchema = new mongoose.Schema({
  totalSales: Number,
  totalInventoryValue: Number,
  productsCount: Number
});
const Stats = mongoose.model('Stats', StatsSchema);

// 3. الـ API اللي هيستقبل البيانات
app.post('/api/update-stats', async (req, res) => {
  try {
    const { totalSales, totalInventoryValue, productsCount } = req.body;
    const updated = await Stats.findOneAndUpdate(
      {}, 
      { totalSales, totalInventoryValue, productsCount },
      { upsert: true, new: true }
    );
    res.json({ message: "تم التحديث بنجاح", data: updated });
  } catch (error) {
    res.status(500).json({ error: "حصلت مشكلة" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`سيرفرك شغال على بورت ${PORT}`)); 
module.exports = app; // للتستنج