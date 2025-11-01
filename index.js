import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const app = express();

app.get("/api/track", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.json({ error: "Thiếu mã đơn hàng" });

  const url = `https://donhang.ghn.vn/?order_code=${encodeURIComponent(code)}`;

  try {
    const html = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118 Safari/537.36"
      }
    }).then(r => r.text());

    const $ = cheerio.load(html);

    // Dò phần trạng thái đơn hàng (theo xpath bạn chụp)
    const status =
      $("#root div div div div:nth-child(2) div:nth-child(1) div:nth-child(1) div div div:nth-child(1) div div:nth-child(5) div div:nth-child(2) div")
        .first()
        .text()
        .trim() || "Không tìm thấy trạng thái";

    res.json({ code, status });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(3000, () => console.log("GHN Proxy running!"));
