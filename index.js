import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/api/track", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.json({ error: "Thiếu mã đơn hàng" });

  try {
    const response = await fetch("https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Token": "5a51f998e1b14f16a6fbbd1d2e15f188"
      },
      body: JSON.stringify({ order_code: code })
    });

    const data = await response.json();

    if (data.code !== 200 || !data.data) {
      return res.json({ code, status: "Không tìm thấy trạng thái" });
    }

    const status = data.data.status || "Không xác định";
    const status_text = data.data.status_text || status;

    res.json({ code, status: status_text });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(3000, () => console.log("GHN Proxy running!"));
