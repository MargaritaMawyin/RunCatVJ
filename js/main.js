var game = new Phaser.Game(746, 400, Phaser.CANVAS, "");

var dude,
  suelo,
  obstaculos,
  enemigos,
  preguntasAB,
  preguntasA,
  musica,
  saltarM,
  space,
  cayendoM,
  musicaFinal,
  enemigosDerrotados,
  flag = 0,
  preguntasArriba = 23,
  preguntasAbajo = 25,
  castillos,
  numeroAB = 1,
  numeroA = 1,
  nivel = 1,
  count = 0,
  jumpActiveCount = 0,
  soundActive = false,
  audioContext,
  microphone = null,
  analyzer = null,
  soundThreshold = 12,
  dogActive = null,
  t3,
  shoutText,
  killedByVoice =0,
  imagen,
  pocion;

var mapa = [1, 1, 1, 1, 1, 1, 1];
navigator.mediaDevices.getUserMedia({ audio: true })
.then(function(stream) {
  console.log("Acceso al micrófono concedido");
  audioContext = new AudioContext();
  microphone = audioContext.createMediaStreamSource(stream);
  analyzer = audioContext.createAnalyser();
  microphone.connect(analyzer)

  soundActive = true;
})
.catch(function(err) {
  alert("No se puede acceder al micrófono, por favor permita el acceso a su micrófono")
});

var mainState = {
  preload: function () {
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    jumpSound = game.add.audio("jump");
    shoutKey = game.input.keyboard.addKey(Phaser.Keyboard.G);
    if (!game.device.desktop) {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.setMinMax(
        game.width / 2,
        game.height / 2,
        game.width,
        game.height
      );
    } else {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    if (nivel == 1) {
      numeroAB = 1;
      numeroA = 1;
    }
    //game.stage.backgroundColor = '#000';

    game.load.image("inicio", "/assets/Inicio/fondo.png");
    game.load.image("bttS", "/assets/Inicio/inicia.png");
    game.load.image("bttR", "/assets/Inicio/regla.png");

    for (var i = 1; i <= preguntasArriba; i++) {
      var preguntaA = "preguntaA" + i;
      var direccion = "assets/preguntas/arriba/pregunta" + i + ".png";
      game.load.image(preguntaA, direccion);
    }
    for (var i = 1; i <= preguntasAbajo; i++) {
      var preguntaAB = "preguntaAB" + i;
      var direccion = "assets/preguntas/abajo/pregunta" + i + ".png";
      game.load.image(preguntaAB, direccion);
    }
    game.load.image("gameOver", "assets/Game over/Mesa de trabajo 1_2.png");
    game.load.image("reiniciar", "assets/Game over/Mesa de trabajo 10_1.png");
    game.load.image("salir", "assets/Game over/Mesa de trabajo 10_2.png");
    // game.load.spritesheet("dude", "assets/gatoMix.png", 68, 61, 16); //70, 61.25, 16
    game.load.spritesheet("dude", "assets/megaMix.png", 68, 61, 21);
    game.load.image("fondo", "assets/City2.jpg");
    game.load.image("bloqueSuelo", "assets/pared.png");
    game.load.spritesheet("castillo", "assets/castillo.png");

    //game.load.image('reloj', 'assets/reloj.png');
    game.load.spritesheet("reloj", "assets/caja1.png", 70, 70);
    game.load.spritesheet("pregunta", "assets/pregunta.png", 70, 70);
    game.load.image("pocion", "assets/pocion.png", 54,74);
    game.load.spritesheet("pilaCaja", "assets/pilaCaja.png", 70, 420);

    game.load.spritesheet("perrito", "assets/DogRun.png", 122, 65); // 128.67, 70

    game.load.audio("jump", "assets/sonidos/jump.wav");
    game.load.audio("muere", "assets/sonidos/gatoCayendo.mp3");

    game.load.audio("musicaFondo", "assets/sonidos/opcion1.wav");
    game.load.audio("gameFondo", ["assets/sonidos/gameover.mp3"]);
  },

  create: function () {
    this.cont = 0;
    document.getElementById("loadingGame").style.display = "none";
    var bloqueSuelo;
    var bloqueSuelo2;
    var bloqueSuelo3;
    this.scratches = 0;
    this.transparencia = 0;
    this.maxScratches = 5;
    this.maxCamuflaje = 5;
    enemigosDerrotados = 0;
    //atributos del juego
    this.sizeBloque = 70;
    this.nivelVelocidad = -200;
    this.alturadude = 92;
    this.probCliff = 0.4;
    this.probVertical = 0.4;
    this.probMoreVertical = 0.5;

    musica = game.add.audio("musicaFondo");
    // musica = this.sound.add('musicaFondo', { loop: true });

    musica.play();

    //agregar fondo al juego
    this.fondoJuego = game.add.tileSprite(
      0,
      0,
      game.width,
      game.cache.getImage("fondo").height,
      "fondo"
    );
    //fondoJuego = game.add.tileSprite(0, 0, 'fondo');

    //Crear Mundo
    suelo = game.add.group();
    preguntasAB = game.add.group();
    preguntasA = game.add.group();
    pocion = game.add.group();

    castillos = game.add.group();
    suelo.enableBody = true;
    for (var i = 0; i < mapa.length; ++i) {
      switch (mapa[i]) {
        case 0: // vacio
          break;
        case 1: //suelo
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque;
          bloqueSuelo = suelo.create(x, y, "bloqueSuelo");
          bloqueSuelo.body.immovable = true;
          bloqueSuelo.body.velocity.x = this.nivelVelocidad;
          break;
        case 2: // caja
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 3;
          bloqueSuelo = suelo.create(x, y, "reloj");
          bloqueSuelo.body.immovable = true;
          bloqueSuelo.body.velocity.x = this.nivelVelocidad;
          break;
        case 3: // pregunta Abajo
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque;
          bloqueSuelo2 = suelo.create(x, y, "bloqueSuelo");
          bloqueSuelo2.body.immovable = true;
          bloqueSuelo2.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 2;
          bloqueSuelo = game.add.sprite(x, y, "pregunta");
          preguntasAB.add(bloqueSuelo);
          game.physics.arcade.enable(bloqueSuelo);
          bloqueSuelo.body.velocity.x = this.nivelVelocidad;
          break;
        case 4: // caja mas suelo
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 3;
          bloqueSuelo = suelo.create(x, y, "reloj");
          bloqueSuelo.body.immovable = true;
          bloqueSuelo.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque;
          bloqueSuelo2 = suelo.create(x, y, "bloqueSuelo");
          bloqueSuelo2.body.immovable = true;
          bloqueSuelo2.body.velocity.x = this.nivelVelocidad;
          break;
        case 5: // caja apiladas
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 8;
          bloqueSuelo = suelo.create(x, y, "pilaCaja");
          bloqueSuelo.body.immovable = true;
          bloqueSuelo.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque;
          bloqueSuelo2 = suelo.create(x, y, "bloqueSuelo");
          bloqueSuelo2.body.immovable = true;
          bloqueSuelo2.body.velocity.x = this.nivelVelocidad;
          break;
        case 6: // castillo
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 3;
          bloqueSuelo = game.add.sprite(x, y, "castillo");
          castillos.add(bloqueSuelo);
          game.physics.arcade.enable(bloqueSuelo);
          bloqueSuelo.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque;
          bloqueSuelo2 = suelo.create(x, y, "bloqueSuelo");
          bloqueSuelo2.body.immovable = true;
          bloqueSuelo2.body.velocity.x = this.nivelVelocidad;
          break;
        case 7: // pregunta Arriba
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque;
          bloqueSuelo2 = suelo.create(x, y, "bloqueSuelo");
          bloqueSuelo2.body.immovable = true;
          bloqueSuelo2.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 2;
          bloqueSuelo = game.add.sprite(x, y, "pregunta");
          preguntasA.add(bloqueSuelo);
          game.physics.arcade.enable(bloqueSuelo);
          bloqueSuelo.body.velocity.x = this.nivelVelocidad;
          break;
        case 8: // pocion
          x = i * this.sizeBloque+20;
          y = this.game.height - this.sizeBloque+10;
          bloqueSuelo2 = suelo.create(x, y, "bloqueSuelo");
          bloqueSuelo2.body.immovable = true;
          bloqueSuelo2.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque+20;
          y = this.game.height - this.sizeBloque * 2+10;
          bloqueSuelo = game.add.sprite(x, y, "pocion");
          pocion.add(bloqueSuelo);
          game.physics.arcade.enable(bloqueSuelo);
          bloqueSuelo.body.velocity.x = this.nivelVelocidad;
          break
        case 9: //caja mas suelo mas pregunta abajo
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 3;
          bloqueSuelo = suelo.create(x, y, "reloj");
          bloqueSuelo.body.immovable = true;
          bloqueSuelo.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque;
          bloqueSuelo2 = suelo.create(x, y, "bloqueSuelo");
          bloqueSuelo2.body.immovable = true;
          bloqueSuelo2.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 4;
          bloqueSuelo3 = game.add.sprite(x, y, "pregunta");
          preguntasAB.add(bloqueSuelo3);
          game.physics.arcade.enable(bloqueSuelo3);
          bloqueSuelo3.body.velocity.x = this.nivelVelocidad;
          break;
        case 10: //caja mas suelo mas pregunta abajo
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 3;
          bloqueSuelo = suelo.create(x, y, "reloj");
          bloqueSuelo.body.immovable = true;
          bloqueSuelo.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque;
          bloqueSuelo2 = suelo.create(x, y, "bloqueSuelo");
          bloqueSuelo2.body.immovable = true;
          bloqueSuelo2.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 4;
          bloqueSuelo3 = game.add.sprite(x, y, "pregunta");
          preguntasA.add(bloqueSuelo3);
          game.physics.arcade.enable(bloqueSuelo3);
          bloqueSuelo3.body.velocity.x = this.nivelVelocidad;
          break;
      }
    }

    //agregar al dude
    x = 200;
    y = game.height - (this.sizeBloque + this.alturadude);
    dude = game.add.sprite(x, y, "dude");
    game.physics.arcade.enable(dude);
    console.log(dude);
    //dude.body.bounce.y = 0.2;
    dude.body.gravity.y = 1000;
    // dude.setCollideWorldBounds(true);
    //game.camera.follow(dude);
    //dude.body.collideWorldBounds = true;
    dude.animations.add("yell", [0, 1, 2, 3, 4, 5, 6, 7], true);
    dude.animations.add("right", [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
    dude.animations.add("up", [8, 9, 8], true); //para el salto
    dude.animations.add("g", [17, 18, 19], 8, true); //para el camuflaje

    // dude.animations.play("right");

    //enemigos
    enemigos = game.add.group();
    //temporizadores
    this.timer = game.time.events.loop(6000, this.agregarEnemigo, this);

    //controles
    //cursos para saltar
    jumpKey.onDown.add(this.jumpActions, this);
    //cursor para bajar rapido
    var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onDown.add(this.bajar, this);

    //acelerar?
    var rapidKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rapidKey.onDown.add(this.acelerar, this);
    // poderoso
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // space.onDown.add(this.camuflar, this);

    //mensaje de vidas
    var style1 = { font: "20px Arial", fill: "#ff0" };
    var t1 = this.game.add.text(10, 20, "Vidas:     /5", style1);
    t1.fixedToCamera = true;
    var style2 = { font: "20px Arial", fill: "#00ff00" };
    this.pointsText = this.game.add.text(80, 20, "", style2);
    //ESQUIVAR AL PERRO
    var style3 = { font: "20px Arial", fill: "#ff0" };
    var t2 = this.game.add.text(10, 50, "Esquivar al perro:    /5", style3);
    t2.fixedToCamera = true;
    var style4 = { font: "20px Arial", fill: "#00ff00" };
    this.camuflajeText = this.game.add.text(177, 50, "", style4);

    // SHOUTING THRESHOLD USING ASCII ART

    if (soundActive){
      t3 = this.game.add.text(10, 80, "Voz para asustar perros: : □", style1);
      t3.fixedToCamera = true;
    }

    //with alpha 0 it is invisible
    shoutText = game.add.text(0, game.height - 20, "Presiona G y grita para matar al perro.", {

      font: "20px Arial",
      fill: "#ffffff",
      align: "center"
    });
    shoutText.alpha = 0;


    //recordatorio de reglas
    var reglas = { font: "14px Arial", fill: "#00ff00" };
    var text = this.game.add.text(450, 10, "Comandos:", reglas);
    text.fixedToCamera = true;

    var regla1 = { font: "12px Arial", fill: "#ff0" };
    var text1 = this.game.add.text(450, 25, "SALTAR : ⬆️ ", regla1);
    text1.fixedToCamera = true;

    var regla2 = { font: "12px Arial", fill: "#ff0" };
    var text2 = this.game.add.text(450, 40, "SALIR DE LA PREGUNTA : ENTER", regla2);
    text2.fixedToCamera = true;

    var regla5 = { font: "12px Arial", fill: "#ff0" };
    var text5 = this.game.add.text(450, 55, "ACELERAR : ➡️", regla5);
    text5.fixedToCamera = true;

    var regla4 = { font: "12px Arial", fill: "#ff0" };
    var text4 = this.game.add.text(450, 70, "BAJAR RAPIDO : ⬇️", regla4);
    text4.fixedToCamera = true;

    var regla3 = { font: "12px Arial", fill: "#ff0" };
    var text3 = this.game.add.text(450, 85, "ESQUIVAR AL PERRO : BARRA ESPACIADORA ", regla3);
    text3.fixedToCamera = true;

    var regla6 = { font: "12px Arial", fill: "#ff0" };
    var text6 = this.game.add.text(500, 97, "O CON LA TECLA G Y UN GRITO ", regla6);
    text6.fixedToCamera = true;

    this.refreshStats();
    this.pointsText.fixedToCamera = true;
    this.camuflajeText.fixedToCamera = true;
  },

  update: function () {
    this.fondoJuego.tilePosition.x -= 0.05;
    game.physics.arcade.collide(dude, suelo);
    game.physics.arcade.collide(dude, obstaculos);
    if (!spaceKey.isDown) {
      dude.alpha = 1;
      game.physics.arcade.collide(dude, enemigos, this.gritar, null, this);
    } else if (spaceKey.justDown && this.transparencia < 5) {
      dude.alpha = 0.5;
      this.cont++;
      this.transparencia++;
      this.refreshStats();
      console.log("T", this.transparencia);
      // console.log(this.cont);

    }

    game.physics.arcade.collide(
      dude,
      preguntasAB,
      this.presentarPreguntaAB,
      null,
      this
    );
    game.physics.arcade.collide(
      dude,
      preguntasA,
      this.presentarPreguntaA,
      null,
      this
    );

    game.physics.arcade.collide(
      dude,
      castillos,
      this.siguienteNivel,
      null,
      this
    );
    game.physics.arcade.collide(
      dude,
      pocion,
      this.presentarPocion,
      null,
      this
    );

    if (dude.alive) {
      if (soundActive && shoutKey.isDown) {
        if (analyzer) {
          t3.setText(`Voz para asustar perros: ${"■".repeat(killedByVoice+1)}`);
          var dataArray = new Uint8Array(analyzer.frequencyBinCount);
          analyzer.getByteFrequencyData(dataArray);
          var total = 0;
          for (var i = 0; i < dataArray.length; i++) {
            total += dataArray[i];
          }
          var average = total / dataArray.length;
          console.log(average);
          if (average > soundThreshold*(killedByVoice+1)) {
            if (dogActive) {
              dogActive.kill();
              dogActive = null;
              killedByVoice++;
            }
          }
        }
      }
      if (dude.body.touching.down) {
        jumpActiveCount = 0;
        game.add.tween(dude).to({ angle: -0 }, 100).start();
        dude.body.velocity.x = -this.nivelVelocidad;
        if (flag == 0) {
          dude.animations.play("right");
        } else dude.animations.play("yell");
      } else {
        dude.body.velocity.x = 5;
        // dude.animations.stop();
        dude.animations.play("up");
        // dude.frame = 8;
      }

      if (flag > 0) flag--;

      //restart the game if reaching the edge
      /*if(dude.x <= -this.sizeBloque) {
        game.state.start('main');
      }*/
      if (
        dude.y >= game.height + this.sizeBloque ||
        dude.x <= -100 ||
        this.scratches == 5
      ) {
        musica.pause();
        var imagen = game.add.sprite(0, 0, "gameOver");
        var botonReiniciar = game.add.sprite(191, 249, "reiniciar");
        var botonSalir = game.add.sprite(395, 249, "salir");

        botonReiniciar.inputEnabled = true;
        botonReiniciar.events.onInputDown.add(function () {
          // game.state.start("main");
          //game.state.start('main');

          game.state.start("main", mainState);
        });
        botonSalir.inputEnabled = true;
        botonSalir.events.onInputDown.add(function () {
          location.reload();
        });
      }
    }
  },

  refreshStats: function () {
    console.log(this.pointsText);
    console.log(this.maxScratches);
    this.pointsText.text = this.maxScratches - this.scratches;

    this.camuflajeText.text = this.maxCamuflaje - this.transparencia;
    console.log(this.camuflajeText);
    console.log(this.maxCamuflaje);
    console.log(this.transparencia);
  },
  // camuflar: function () {
  //   if (!dude.alive ) return;
  //   dude.animations.add("g", [16], true); //para el camuflaje
  //   dude.animations.play("g");
  // },

  jump: function () {
    dude.body.velocity.y = -550;
  },

  jumpActions: function () {
    jumpActiveCount++;
    if (!dude.alive || jumpActiveCount > 2) return;

    this.jump();
    console.log(jumpSound);
    jumpSound.play();
  },

  bajar: function () {
    dude.body.velocity.y = 600;
  },

  acelerar: function () {
    dude.body.velocity.x = 1000;
  },

  agregarEnemigo: function () {
    var perro = game.add.sprite(
      game.width,
      game.height - this.sizeBloque - 55,
      "perrito"
    );
    dogActive = perro;
    enemigos.add(perro);
    game.physics.arcade.enable(perro);
    perro.body.velocity.x = this.nivelVelocidad - 100;
    perro.animations.add("left", [2, 1, 0, 5, 4, 3, 8, 7, 6], 15, true);
    perro.animations.play("left");
    perro.scale.setTo(0.8, 0.8);
    perro.checkWorldBounds = true;
    perro.outOfBoundsKill = true;

    game.add.tween(shoutText).to({ alpha: 1 }, 1000).start();


    perro.events.onOutOfBounds.add(function () {
      dogActive = null;
    })
  
    //When dog is destroyed, add remove shoutText
    perro.events.onKilled.add(function () {
      game.add.tween(shoutText).to({ alpha: 0 }, 1000).start();
    });
    
  },

  agregarPocion: function () {
    console.log('se agregue una pocion')
    var pocionn = game.add.sprite(
      game.width,
      game.height - this.sizeBloque - 25,
      "pocion"
    );
   pocion.add(pocionn);
    game.physics.arcade.enable(pocion);
   
    // perro.scale.setTo(0.8, 0.8);
  },
  gritar: function (dude, enemigos) {
    // console.log(dude);
    enemigos.destroy();
    game.add.tween(shoutText).to({ alpha: 0 }, 1000).start();
    dogActive = null;

    cayendoM = game.add.audio("muere");
    cayendoM.play();

    this.scratches++;
    this.refreshStats();
    //update our stats
  },

  presentarPreguntaAB: function (dudee, caja) {
    caja.destroy();
    let numero;
    let min = Math.ceil(1);
    let max = Math.floor(preguntasAbajo);
    numero = Math.floor(Math.random() * (max - min + 1) + min);
    var nombre = "preguntaAB" + numero;
    imagen = game.add.sprite(70, 100, nombre);
    imagen.scale.setTo(0.9, 0.9);
    game.paused = true;
    // window.setTimeout(this.seguirjugando, 10000);
    //
    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(this.seguirjugando, this);
  },

  presentarPreguntaA: function (dudee, caja) {
    caja.destroy();
    let numero;
    let min = Math.ceil(1);
    let max = Math.floor(preguntasArriba);
    numero = Math.floor(Math.random() * (max - min + 1) + min);
    var nombre = "preguntaA" + numero;
    imagen = game.add.sprite(70, 100, nombre);
    imagen.scale.setTo(0.9, 0.9);
    game.paused = true;
    // window.setTimeout(this.seguirjugando, 10000);
    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(this.seguirjugando, this);
  },
  

  presentarPocion: function (dudee, pocion) {
    console.log( ' se presento un pocion')
    pocion.destroy();
    this.transparencia--;
    this.refreshStats()
  

    
  },
  siguienteNivel: function (dudee, castillos) {
    game.paused = true;
  },

  seguirjugando: function () {
    //update our stats
    imagen.destroy();
    game.paused = false;
  },
};
/*
hoyo:0
piso:	1
hoyo + caja: 2
pregunta camino bajo: 3
piso + caja: 4
piso + caja infinita: 5
castillo: 6
pregunta camino alto: 7
piso + caja + camino bajo: 8
piso + caja + camino alto: 9
*/
function llenarMapa() {
  let large = 490;
  let caminosAltos = [
    [1, 1, 1, 4, 4, 4, 2, 2, 0, 0, 0, 2, 2, 4, 4, 0, 0, 0, 2, 2, 2, 2, 4, 4, 0, 0, 4, 4, 0, 0, 2, 2, 4, 9, 4, 4, 4, 2, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 5, 1, 1, 1],
    [1, 1, 4, 4, 4, 2, 2, 2, 0, 0, 0, 4, 4, 0, 0, 2, 2, 1, 1, 1, 2, 2, 2, 4, 4, 4, 2, 9, 4, 4, 4, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 5, 1, 1, 1],
    [1, 1, 4, 2, 4, 2, 4, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 4, 1, 1, 1, 1, 4, 2, 2, 4, 4, 4, 4, 2, 2, 2, 1, 1, 2, 9, 4, 4, 4, 2, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 5, 1, 1, 1],
    [1, 1, 1, 4, 4, 4, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 10, 4, 4, 4, 2, 1, 1, 1, 4, 4, 4, 4, 2, 2, 0, 0, 0, 4, 4, 2, 0, 0, 2, 4, 4, 0, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 2, 2, 4, 4, 4, 2, 2, 2, 0, 0, 0, 4, 4, 2, 2, 0, 0, 0, 1, 1, 2, 2, 1, 1, 2, 2, 4, 4, 10, 4, 4, 4, 2, 1, 1, 1, 4, 4, 0, 0, 1, 1, 0, 0, 4, 4, 2, 2, 0, 0, 0, , 2, 2, 4, 4, 2, 0, 0, 2, 4, 4, 0, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 4, 4, 4, 4, 2, 2, 2, 1, 1, 1, 2, 2, 4, 2, 2, 4, 2, 2, 10, 4, 0, 0, 0, 4, 4, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 0, 0, 2, 4, 4, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 4, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 1, 1, 1],
    [1, 1, 4, 4, 4, 2, 2, 2, 4, 4, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1],
    [1, 1, 4, 4, 4, 4, 2, 2, 2, 1, 1, 2, 2, 4, 2, 2, 4, 2, 2, 1, 1, 1]
  ];
  let caminosBajos = [
    [1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 5, 1, 1, 0, 0],
    [1, 1, 1, 4, 4, 1, 1, 1, 4, 4, 4, 4, 4, 5],
    [1, 1, 0, 0, 1, 1, 1, 4, 4, 4, 4, 4, 4, 5],
    [1, 1, 1, 4, 4, 4, 1, 1, 1, 0, 0, 1,4, 4, 4, 4, 5, 1, 1, 0, 0]
  ];
  let pregunta = 1;
  let pocion = 1;
  let posiciónPregunta;
  let posiciónPocion;
  while (large > 0) {
    let numero = Math.floor(Math.random() * 11);
    switch (numero) {
      case (0, 1, 2): {
        mapa = mapa.concat([numero, numero]);
        large = large - 2;
        break;
      }
      case 3: {
        posiciónPregunta = mapa.length;
        if (pregunta < 13 && posiciónPregunta > 30 * pregunta) {
          let caminoBajo =
            caminosBajos[Math.floor(Math.random() * caminosBajos.length)];
          mapa = mapa.concat([1, 1, numero, 1], caminoBajo, [1, 1]);
          pregunta++;
          large = large - caminoBajo.length - 1;
        }
        break;
      }
      case 4: {
        mapa.push(numero);
        large--;
        break;
      }
      case 5: {
        mapa = mapa.concat([1, 1, numero, 1, 1]);
        large = large - 5;
        break;
      }
      case 6: {
        break;
      }
      case 7: {
        posiciónPregunta = mapa.length;
        if (pregunta < 13 && posiciónPregunta > 30 * pregunta) {
          let caminoAlto =
            caminosAltos[Math.floor(Math.random() * caminosAltos.length)];
          mapa = mapa.concat([1, 1, numero, 1], caminoAlto, [1, 1]);
          pregunta++;
          large = large - caminoAlto.length - 1;
        }
        break;
      }
      case 8: {
        posiciónPocion = mapa.length;
        console.log(mapa.length)
        if (pocion < 20 && posiciónPocion > 20 * pocion) {
          mapa.push(numero);
          large--;
        }
        break;
      }
    }
  }
  mapa = mapa.concat([6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  console.log("Tamaño del mapa: ", mapa.length);
  console.log("Mapa: ", mapa);
  /*
    0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1,
    3, 1, 1, 4, 4, 4, 4, 4, 4, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0,
    1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 7, 1, 1, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 1, 1,
    1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 3, 1, 1, 4, 4, 4,
    4, 4, 4, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 7,
    1, 1, 1, 1, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 2,
    2, 2, 0, 0, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 1, 3,
    1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 5, 1, 1, 0, 2, 2, 0, 0, 2, 2, 2, 2, 0, 2, 2, 2,
    2, 2, 2, 2, 1, 1, 0, 0, 1, 1, 0, 1, 7, 0, 1, 1, 4, 4, 4, 2, 0, 0, 4, 4, 0, 0,
    2, 4, 4, 0, 1, 1, 1, 1, 1, 1, 4, 1, 4, 1, 4, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3,
    1, 1, 4, 4, 4, 4, 4, 4, 4, 5, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 4, 7,
    1, 1, 4, 4, 0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 2, 2,
    0, 2, 4, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 3, 1, 1, 4, 1, 1, 4, 4,
    2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0, 1,
    1, 1, 0, 1, 2, 2, 2, 0, 2, 2, 2, 1, 1, 0, 0, 1, 1, 1, 1, 1, 7, 1, 1, 1, 4, 4,
    4, 0, 0, 1, 4, 4, 4, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 4, 4, 4, 4, 4, 4, 5,
    1, 1, 1, 4, 2, 2, 1, 1, 1, 6, 1, 1, 1
  */
}

game.state.add("main", mainState);

//game.state.start('main');
