import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/api/track", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.json({ error: "Thiếu mã đơn hàng" });

  try {
    const response = await fetch("https://t.17track.net/restapi/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Origin": "https://t.17track.net",
        "Referer": "https://t.17track.net/"
      },
      body: JSON.stringify({
        data: [{ num: code }]
      })
    });

    const data = await response.json();

    // Truy xuất phần mô tả trạng thái
    const status =
      data?.dat?.[0]?.track?.z0?.c?.replace(/\s+/g, " ")?.trim() ||
      "Không tìm thấy trạng thái";

    res.json({ code, status });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(3000, () => console.log("17Track Proxy running!"));
