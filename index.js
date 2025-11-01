import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/api/track", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.json({ error: "Thiếu mã đơn hàng" });

  try {
    const response = await fetch("https://online-gateway.ghn.vn/shiip/public-api/v2/tracking/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Token": "5a51f998e1b14f16a6fbbd1d2e15f188"
      },
      body: JSON.stringify({ order_code: code })
    });

    const data = await response.json();

    if (data.code !== 200 || !data.data || data.data.length === 0) {
      return res.json({ code, status: "Không tìm thấy trạng thái" });
    }

    const latest = data.data[0]; // lấy bản ghi mới nhất
    const status = latest.status || "Không xác định";
    const description = latest.description || status;

    res.json({ code, status: description });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(3000, () => console.log("GHN Proxy running!"));
