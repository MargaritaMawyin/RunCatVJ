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
  preguntasArriba = 5,
  preguntasAbajo = 5,
  castillos,
  numeroAB = 1,
  numeroA = 1,
  nivel = 1,
  count = 0,
  imagen;

var mapa = [
  1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1,
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
  1, 1, 1, 4, 2, 2, 1, 1, 1, 6, 1, 1, 1, 1,
];

var mainState = {
  preload: function () {
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
      var direccion = "/assets/preguntas/arriba/pregunta" + i + ".png";
      game.load.image(preguntaA, direccion);
    }
    for (var i = 1; i <= preguntasAbajo; i++) {
      var preguntaAB = "preguntaAB" + i;
      var direccion = "/assets/preguntas/abajo/pregunta" + i + ".png";
      game.load.image(preguntaAB, direccion);
    }
    game.load.image("gameOver", "/assets/Game over/Mesa de trabajo 1_2.png");
    game.load.image("reiniciar", "/assets/Game over/Mesa de trabajo 10_1.png");
    game.load.image("salir", "/assets/Game over/Mesa de trabajo 10_2.png");
    // game.load.spritesheet("dude", "assets/gatoMix.png", 68, 61, 16); //70, 61.25, 16
    game.load.spritesheet("dude", "assets/megaMix.png", 68, 61, 21);
    game.load.image("fondo", "assets/City2.jpg");
    game.load.image("bloqueSuelo", "assets/pared.png");
    game.load.spritesheet("castillo", "assets/castillo.png");

    //game.load.image('reloj', 'assets/reloj.png');
    game.load.spritesheet("reloj", "assets/caja1.png", 70, 70);
    game.load.spritesheet("pregunta", "assets/pregunta.png", 70, 70);
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
    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(this.saltar, this);
    //cursor para bajar rapido
    var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onDown.add(this.bajar, this);
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

    this.refreshStats();
    this.pointsText.fixedToCamera = true;
    this.camuflajeText.fixedToCamera = true;
  },

  update: function () {
    this.fondoJuego.tilePosition.x -= 0.05;
    game.physics.arcade.collide(dude, suelo);
    game.physics.arcade.collide(dude, obstaculos);
    if (!spaceKey.isDown) {
      console.log(spaceKey.isDown);
      dude.alpha = 1;
      game.physics.arcade.collide(dude, enemigos, this.gritar, null, this);
    } else if (spaceKey.justDown && this.transparencia<5) {
      
        dude.alpha = 0.5;
        this.cont++
        this.transparencia++;
        this.refreshStats();
        console.log('T' ,this.transparencia);
        console.log(this.cont);
      
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

    if (dude.alive) {
      if (dude.body.touching.down) {
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

    this.camuflajeText.text = this.maxCamuflaje - this.transparencia ;
    console.log(this.camuflajeText);
    console.log(this.maxCamuflaje);
    console.log(this.transparencia);
  },
  // camuflar: function () {
  //   if (!dude.alive ) return;
  //   dude.animations.add("g", [16], true); //para el camuflaje
  //   dude.animations.play("g");
  // },

  saltar: function () {
    var jumping = false;
    var doubleJumping = false;
    if (dude.alive == false) return;

    dobleJumpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

    // if (dobleJumpKey.isDown || dude.body.touching.down) {
    //   dude.body.velocity.y = -550;
    //   game.add.tween(dude).to({ angle: -20 }, 100).start();
    // }

    if (dobleJumpKey.isDown && jumping === false) {
      jumping = true;
      dude.body.velocity.y = -350;
    }

    if (jumping === true && doubleJumping === false) {
      if (dobleJumpKey.isDown) {
        doubleJumping = true;
        jumping = false;
        dude.body.velocity.y = -350;
      }
    }

    if (dude.body.touching.down) {
      jumping = false;
      doubleJumping = false;
    }

    saltarM = game.add.audio("jump");
    saltarM.play();
  },

  bajar: function () {
    dude.body.velocity.y = 600;
  },

  agregarEnemigo: function () {
    var perro = game.add.sprite(
      game.width,
      game.height - this.sizeBloque - 55,
      "perrito"
    );
    enemigos.add(perro);
    game.physics.arcade.enable(perro);
    perro.body.velocity.x = this.nivelVelocidad - 100;
    perro.animations.add("left", [2, 1, 0, 5, 4, 3, 8, 7, 6], 15, true);
    perro.animations.play("left");
    perro.scale.setTo(0.8, 0.8);
  },

  gritar: function (dude, enemigos) {
    console.log(dude);
    enemigos.destroy();

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
    var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(this.seguirjugando, this);
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
    window.setTimeout(this.seguirjugando, 10000);
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

game.state.add("main", mainState);

//game.state.start('main');
