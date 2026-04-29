void bkg() {
  indexImage = (indexImage + 1) % img.length;
  
  // Verificación de imagen
  if (img[indexImage] == null) return;

  capaBkg.beginDraw();
  capaBkg.loadPixels();
  img[indexImage].loadPixels();

  // Verificación de array de píxeles de la capa
  if (capaBkg.pixels == null) {
    capaBkg.endDraw();
    return;
  }

  float d = dist( map(mouseX, 0, width, 0, capaBkg.width), map(mouseY, 0, height, 0, capaBkg.height), capaBkg.width/2, capaBkg.height/2);
  float umbral = map(d, 0, width/2, 0.6, 0.4);

  for (int loc = 0; loc < capaBkg.pixels.length; loc++) {
    color c = img[indexImage].pixels[loc];
    int r = (c >> 16) & 0xFF;
    int g = (c >> 8) & 0xFF;
    int b = c & 0xFF;

    float luminancia = (r + g + b) / 3.0;
    color colorFinal;

    if (luminancia < 60) {
      colorFinal = color(0);
    } else {
      float nuevoR = lerp(r, factorColor, 0.5);
      float nuevoG = g * 0.1;
      float nuevoB = lerp(b, 255 - factorColor, 0.4);
     
      int divisor = int(random(1, 3));
      colorFinal = color(nuevoG, nuevoR, nuevoB) / divisor;
    }

    int x = loc % capaBkg.width;
    int y = loc / capaBkg.width;
    float n = noise(0.008 * x, 0.008 * y, 0.03 * t);

    if (n > umbral) {
      capaBkg.pixels[loc] = color(c/5);
    } else {
      capaBkg.pixels[loc] = colorFinal;
    }
  }

  capaBkg.updatePixels();
  capaBkg.endDraw();

  t += map(mouseX, 0, width, -1, 1) + 0.1;
}
