PImage []img = new PImage[198];
String pong1, pong2;

int indexImage = 0;  //foto actual
ArrayList<Pelota> listaPelotas = new ArrayList<Pelota>();
ArrayList<Bola> misBolas = new ArrayList<Bola>();

PGraphics capaEsfera, capaBkg;
int frameFondo = 3;
//--brush--
float esferaX = 0;
float esferaVel = 5;
float factorColor = 0;

//variables del ruido
float timer = 0, t = 0, xoffset =0, yoffset = 0;
void setup () {
  size (600, 400, P2D);
  //fullScreen(P2D, SPAN);
  pixelDensity(displayDensity());
  noSmooth();
  pong1 = "Nu\nll\nP\n01n\nter\n3xc\nep\nti\n0n";
  pong2 ="Ty\np\n3\nrror:\nCa\nnno\nt\nre\nad\np\nop\ner\nty";
  misBolas.add(new Bola(width/2, height/2, 4, 3, 15, color(255, 100, 100)));
  capaBkg = createGraphics(600, 400, P2D);

  //--brush layer--
  capaEsfera = createGraphics(600, 400, P2D);
  capaEsfera.beginDraw();
  capaEsfera.background(0, 0);
  capaEsfera.fill(0, 50);

  capaEsfera.rect(0, 0, capaEsfera.width, capaEsfera.height);
  capaEsfera.endDraw();

  for ( int i=0; i < img.length; i ++) { //image array
    img[i]= loadImage("frame_"+nf(i+1, 5)+".png");
    img[i].resize(capaBkg.width, capaBkg.height);
  }
}
void draw() {

  if (frameCount % frameFondo == 0) bkg();

  image(capaBkg, 0, 0, width, height);


  desvanecerRastro();

  // --- ACTUALIZACIÓN DE BOLAS CON LIMPIEZA ---
  for (int i = misBolas.size() - 1; i >= 0; i--) {
    Bola b = misBolas.get(i);
    b.update();
    b.display(capaEsfera);

    if (b.muerta) {
      misBolas.remove(i);
    }
  }
  image(capaEsfera, 0, 0, width, height);

  fill(255);
  textAlign(RIGHT);
  text(pong1, 20, mouseY);
  textAlign(LEFT);
  text(pong2, width-30, mouseY);

  actexplosion();
}
void actexplosion() {

  //---explosion---
  for (int i = listaPelotas.size() - 1; i >= 0; i--) {
    Pelota p = listaPelotas.get(i);
    p.update();
    p.display();

    if (p.muerte) {
      listaPelotas.remove(i); 
    }
  }
}

void desvanecerRastro() {
  capaEsfera.beginDraw();
  capaEsfera.blendMode(REPLACE);
  capaEsfera.loadPixels();

  if (capaEsfera.pixels != null) {
    for (int i = 0; i < capaEsfera.pixels.length; i++) {
      int p = capaEsfera.pixels[i];
      int a = (p >> 24) & 0xFF;
      if (a > 0) {
        a = max(0, a - 4);
        capaEsfera.pixels[i] = (p & 0x00FFFFFF) | (a << 24);
      }
    }
    capaEsfera.updatePixels();
  }
  capaEsfera.endDraw();
}
