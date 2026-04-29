class Pelota {
  float posx, posy, dimension, velocidad;
  color colorr;
  float vida = 255;
  boolean muerte = false;

  Pelota(float _x, float _y, float _v, float _d, color _c) {
    posx = _x;
    posy = _y;
    velocidad = _v; 
    dimension = _d;
    colorr = _c;
  }

  void update() {
    
    dimension += velocidad;
    velocidad *= 0.98; 

    vida -= 5;
    if (vida <= 0) {
      muerte = true;
    }
  }

  void display() {
    if (vida <= 0) return;

    noFill();
    
    strokeWeight(3); 
    
    float radio = dimension / 2;
    
  
    for (float r = radio; r > radio - 20; r -= 3) {
      if (r < 0) break;

      float distanciaAlBorde = radio - r;
      float intensidad = map(distanciaAlBorde, 0, 20, 1, 0);
      
      intensidad = pow(intensidad, 2); 

      float alphaFinal = vida * intensidad;
      stroke(255, alphaFinal);
      strokeWeight(map(intensidad, 0, 1, 0.5, 3));
      ellipse(posx, posy, r * 2, r * 2);
    }
  }
}  

class Bola {
  float x, y, vx, vy;
  float px, py; 
  float tam;      
  color col;      
  
  // --- NUEVAS VARIABLES DE VIDA ---
  float vida = 255; 
  boolean muerta = false;
  float velocidadDegradado = random(0.5, 2.0); // Cada bola puede durar distinto tiempo

  Bola(float _x, float _y, float _vx, float _vy, float _tam, color _col) {
    x = _x;
    y = _y;
    vx = _vx;
    vy = _vy;
    tam = _tam;
    col = _col;
  }

  void update() {
    px = x;
    py = y;

    x += vx;
    y += vy;

    // Disminuir vida
    vida -= velocidadDegradado;
    if (vida <= 0) {
      muerta = true;
    }

    // Rebotes
    boolean golpe = false;
    if (x < tam/2 || x > capaEsfera.width - tam/2) {
      vx *= -1;
      golpe = true;
    }
    if (y < tam/2 || y > capaEsfera.height - tam/2) {
      vy *= -1;
      golpe = true;
    }

    if (golpe && !muerta) {
      float winX = map(x, 0, capaEsfera.width, 0, width);
      float winY = map(y, 0, capaEsfera.height, 0, height);
      // La explosión hereda el color pero con el alpha actual de la bola
      listaPelotas.add(new Pelota(winX, winY, random(2, 5), tam * 2, col));
    }
  }

  void display(PGraphics pg) {
    if (muerta) return;

    pg.beginDraw();
    pg.blendMode(BLEND);
    pg.noFill();
    
   
    float r = (col >> 16) & 0xFF;
    float g = (col >> 8) & 0xFF;
    float b = col & 0xFF;
    pg.stroke(r, g, b, vida); 
    
    pg.strokeWeight(2);

    float d = dist(px, py, x, y);
    if (d > 0.1) {
      for (float i = 0; i <= d; i += 2) {
        float lx = lerp(px, x, i/d);
        float ly = lerp(py, y, i/d);
        pg.circle(lx, ly, tam);
      }
    }
    pg.endDraw();
  }
}
