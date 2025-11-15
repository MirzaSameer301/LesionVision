// src/utils/fakeMask.js
export function generateFakeMaskImage({ width = 512, height = 512, detected = true, seed = Date.now() }) {
  // deterministic-ish randomness using seed
  let rnd = seed % 1000;
  const rand = () => {
    rnd = (rnd * 9301 + 49297) % 233280;
    return rnd / 233280;
  };

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // fill black
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  if (!detected) {
    // fully black means no detection
    return canvas.toDataURL("image/png");
  }

  // detected: draw one or more white blobs
  ctx.fillStyle = "#fff";

  const blobs = Math.floor(1 + Math.round(rand() * 3)); // 1 to 4 blobs
  for (let i = 0; i < blobs; i++) {
    const bw = Math.floor(width * (0.12 + rand() * 0.25));
    const bh = Math.floor(height * (0.08 + rand() * 0.22));
    const x = Math.floor(rand() * (width - bw));
    const y = Math.floor(rand() * (height - bh));

    // draw soft blob by drawing multiple concentric circles for nicer shape
    const layers = 8;
    for (let l = layers; l >= 1; l--) {
      const opacity = 1 - (l / (layers + 1));
      ctx.beginPath();
      ctx.globalAlpha = opacity;
      ctx.ellipse(
        x + bw / 2 + (rand() - 0.5) * bw * 0.2,
        y + bh / 2 + (rand() - 0.5) * bh * 0.2,
        (bw / 2) * (0.6 + rand() * 0.6) * (l / layers),
        (bh / 2) * (0.6 + rand() * 0.6) * (l / layers),
        Math.PI * rand(),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  return canvas.toDataURL("image/png");
}
