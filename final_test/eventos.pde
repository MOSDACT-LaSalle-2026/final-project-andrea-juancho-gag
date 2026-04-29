void mousePressed() {
  
  float tam = random(70, 150);
  color col = color(random(255), random(255), random(255));
  float vel = random(2, 3);
  float t = random(5, 30);
 float vx = (random(1) > 0.5) ? 10 : -10;
float vy = (random(1) > 0.5) ? 10 : -10;
  
 
  float mx = map(mouseX, 0, width, 0, capaEsfera.width);
  float my = map(mouseY, 0, height, 0, capaEsfera.height);
  
  // Color aleatorio 
  color c = color(random(100, 255), random(100, 255), 255, 200);
  
  misBolas.add(new Bola(mx, my, vx, vy, t, c));
  listaPelotas.add(new Pelota(mouseX, mouseY, vel, tam, col));
}
