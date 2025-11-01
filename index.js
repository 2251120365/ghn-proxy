import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/api/track", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.json({ error: "Thiếu mã đơn hàng" });

  try {
    const response = await fetch("https://api.17track.net/track/v2/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "User-Agent": "17TRACK/3.0.22 (com.17Track.app; build:22; iOS 17.0)",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        data: [
          {
            num: code
          }
        ]
      })
    });

    const data = await response.json();

    const desc =
      data?.data?.[0]?.track?.z0?.c?.trim() || "Không tìm thấy trạng thái";

    res.json({ code, status: desc });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(3000, () => console.log("17Track Mobile Proxy running!"));
