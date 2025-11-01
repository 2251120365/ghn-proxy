import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.get("/api/track", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.json({ error: "Thiếu mã đơn hàng" });

  const url = `https://donhang.ghn.vn/?order_code=${encodeURIComponent(code)}`;
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Chờ phần tử xuất hiện
    await page.waitForSelector(".status", { timeout: 10000 });

    // Lấy text trạng thái
    const status = await page.$eval(".status", el => el.innerText.trim());
    await browser.close();

    res.json({ code, status });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
