/*mainState
ACEDEVEL NETWORKS S.R.L.
COCHABAMBA - BOLIVIA 2017
*/
var game = new Phaser.Game(746, 400, Phaser.CANVAS, "");
var dude,
  suelo,
  obstaculos,
  enemigos,
  musica,
  enemigosDerrotados,
  flag = 0;
var mapa = [
  1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1,
  3, 1, 1, 4, 4, 4, 4, 4, 4, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0,
  1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 3, 1, 1, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 1, 1,
  1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 3, 1, 1, 4, 4, 4,
  4, 4, 4, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
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

    //game.stage.backgroundColor = '#000';

    game.load.spritesheet("dude", "assets/gatoMix.png", 70, 61.25, 16);
    game.load.image("fondo", "assets/City2.jpg");
    game.load.image("bloqueSuelo", "assets/pared.png");
    //game.load.image('reloj', 'assets/reloj.png');
    game.load.spritesheet("reloj", "assets/caja1.png", 70, 70);
    game.load.spritesheet("pregunta", "assets/pregunta.png", 70, 70);
    game.load.spritesheet("pilaCaja", "assets/pilaCaja.png", 70, 420);

    game.load.spritesheet("perrito", "assets/DogRun.png", 128.67, 70);

    game.load.audio("jump", "assets/jump.wav");

    game.load.audio("musicaFondo", ["assets/sample.mp3", "assets/sample.ogg"]);
  },

  create: function () {
    document.getElementById("loadingGame").style.display = "none";
    var bloqueSuelo;
    var bloqueSuelo2;
    this.scratches = 0;
    this.maxScratches = 5;
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
        case 3: // pregunta
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque;
          bloqueSuelo2 = suelo.create(x, y, "bloqueSuelo");
          bloqueSuelo2.body.immovable = true;
          bloqueSuelo2.body.velocity.x = this.nivelVelocidad;
          x = i * this.sizeBloque;
          y = this.game.height - this.sizeBloque * 2;
          bloqueSuelo = suelo.create(x, y, "pregunta");
          bloqueSuelo.body.immovable = true;
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
      }
    }

    //agregar al dude
    x = 200;
    y = game.height - (this.sizeBloque + this.alturadude);
    dude = game.add.sprite(x, y, "dude");
    game.physics.arcade.enable(dude);
    //dude.body.bounce.y = 0.2;
    dude.body.gravity.y = 1000;

    //game.camera.follow(dude);
    //dude.body.collideWorldBounds = true;
    dude.animations.add("yell", [0, 1, 2, 3, 4, 5, 6, 7, 8], 30, true);
    dude.animations.add("right", [0, 1, 2, 3, 4, 5, 6, 7, 8], 30, true);
    dude.animations.add("up", [8, 9, 8], 8, true); //para el salto

    dude.animations.play("right");
    dude.scale.setTo(0.7, 0.7);
    console.log(dude);

    ///obstáculos
    obstaculos = game.add.group();
    obstaculos.enableBody = true;
    obstaculos.createMultiple(8, "reloj");
    obstaculos.setAll("checkWorldBounds", true);
    obstaculos.setAll("outOfBoundsKill", true);

    //enemigos
    enemigos = game.add.group();

    //temporizadores
    this.timer = game.time.events.loop(6000, this.agregarEnemigo, this);

    //controles
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.saltar, this);
    var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onDown.add(this.bajar, this);

    //mensaje de vidas
    var style1 = { font: "20px Arial", fill: "#ff0" };
    var t1 = this.game.add.text(10, 20, "Vidas:", style1);
    t1.fixedToCamera = true;
    var style2 = { font: "26px Arial", fill: "#00ff00" };
    this.pointsText = this.game.add.text(80, 18, "", style2);
    this.refreshStats();
    this.pointsText.fixedToCamera = true;
  },

  update: function () {
	
    this.fondoJuego.tilePosition.x -= 0.05;
    game.physics.arcade.collide(dude, suelo);
    game.physics.arcade.collide(dude, obstaculos);
    game.physics.arcade.collide(dude, enemigos, this.gritar, null, this);
    //game.physics.arcade.overlap(dude, pipes, this.choque, null, this);

    if (dude.alive) {
      if (dude.body.touching.down) {
        game.add.tween(dude).to({ angle: -0 }, 100).start();
        dude.body.velocity.x = -this.nivelVelocidad;
        if (flag == 0) dude.animations.play("right");
        else dude.animations.play("yell");
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
      if (dude.y >= game.height + this.sizeBloque || dude.x <= -100) {
        console.log("GAME OVER");

        var style1 = { font: "40px Arial", fill: "#ff0" };
        var gameover = this.game.add.text(100, 200, "GAME OVER", style1);
        gameover.fixedToCamera = true;

        musica.pause();
        //alert("PERRUNOS QUE INTENTARON MORDER A NUESTRO HEROE: "+enemigosDerrotados);
    //    this.scene.pause("main")
	// game.state.pause();

        game.state.pause("main")
		
		game.state.start("main");
	}
    }
  },
  
  


  refreshStats: function () {
    this.pointsText.text = this.maxScratches - this.scratches;
  },
  saltar: function () {
    if (dude.alive == false) return;

    if (dude.body.touching.down) {
      dude.body.velocity.y = -550;
      game.add.tween(dude).to({ angle: -20 }, 100).start();
    }

    // Play sound
    //this.jumpSound.play();
  },
  bajar: function () {
    dude.body.velocity.y = 600;
    // Play sound
    //this.jumpSound.play();
  },

  agregarEnemigo: function () {
    var perro = game.add.sprite(
      game.width,
      game.height - this.sizeBloque - 62,
      "perrito"
    );
    enemigos.add(perro);
    game.physics.arcade.enable(perro);
    perro.body.velocity.x = this.nivelVelocidad - 100;
    perro.animations.add("left", [2, 1, 0, 5, 4, 3, 8, 7, 6], 15, true);
    perro.animations.play("left");
    enemigosDerrotados++;

    if (enemigosDerrotados >= 50) {
      game.paused = true;
      alert("FELICIDADES LLEGASTE AL COLEGIO");
      document.getElementById("gameDiv").style.display = "none";
      document.getElementById("congratulaciones").style.display = "block";
    }
  },

  gritar: function (dude, enemigos) {
    enemigos.destroy();

    //update our stats
    this.scratches++;
    this.refreshStats();
  },
};

game.state.add("main", mainState);
//game.state.start('main');
