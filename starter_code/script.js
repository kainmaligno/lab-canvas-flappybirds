window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

    //clases  
  function Board(){  //constructor con metodo
    this.x= 0;
    this.y= 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.score = 0;
    this.img = new Image();
    this.img.src = 'images/scary-trees-at-night.png';
    this.sound = new Audio();
    this.sound.src = 'images/scay.mp3';

        this.img.onload = function(){
          this.draw();
        }.bind(this); //bind nos deja apuntar al this del Board y no de esta funcion

        this.move = function(){ 
          this.x--;
          if(this.x < -canvas.width) this.x=0;
        }; //para mover nuestro fondo se resta el canvas para regresar 

        this.draw = function(){
          this.move();
          ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
          ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height);
        };

        this.drawScore = function (){
          this.score = Math.floor(frames/60);
          ctx.font = '50px Avenir';
          ctx.fillStyle = 'orange';
          ctx.fillText(this.score, this.width/2, this.y+50);
        };
  }
  function Flappy(){
    this.x = 150;
    this.y = 150;
    this.width = 60;
    this.height = 60;
    this.img = new Image();
    this.img.src = 'images/Jefe2.gif';
    this.sound = new Audio();
    this.sound.src = 'images/jump.mp3';
    this.sound2 = new Audio();
    this.sound2.src = 'images/dead.mp3';

      this.img.onload = function(){
        this.draw();
      }.bind(this);

      this.draw = function(){
        this.y += 1;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        if(this.y < 0 || this.y > canvas.height - this.height){
          gameOver();
         } 
        this.move = function(){
          this.y -= 50;
        }
      }

      this.isTouching = function (pipe){
        return (this.x < pipe.x + pipe.width) && 
               (this.x + this.width > pipe.x) &&
               (this.y < pipe.y + pipe.height) &&
               (this.y + this.height > pipe.y);
      };
   }



  //declaraciones
   var intervalo;
   var frames = 0;
   var board = new Board();
   var flappy = new Flappy();
   var pipes = [];

   function Pipes(y, height, type){
    this.x = canvas.width; //para que salga del lado derecho de la imagen 
    this.y = y;
    this.width = 50;
    this.height = height;
    this.img = new Image();
    this.img.src = 'images/top.png';
    this.img2 = new Image();
    this.img2.src = 'images/bottom.png';

      this.draw = function(){
        this.x--;
       // ctx.fillStyle = 'green';
          if(type){
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
          } else {
            ctx.drawImage(this.img2, this.x, this.y, this.width, this.height);
          }
        
      }
   }

  //listeners

  addEventListener('keydown', function(e){
    if(e.keyCode === 32){
      flappy.move();
      flappy.sound.play();
    }
  });


  //+++++++ auxiliares
function gameOver(){
  stop();
  ctx.font = '120px courier';
  ctx.strokeStyle = "green";
  ctx.lineWidth = 8;
  ctx.strokeText('Game Over', 50, 200);
 
  //ctx.font = '50px Avenir';
}

function generatePipes(){ //genera pipes de instancia de constructor pipe 
  if(!(frames%300 ===0)) return;
  var ventanita  = 150;
  var randomHeight = Math.floor(Math.random() * 200)+50;
  var pipe = new Pipes(0, randomHeight, true); 
  var pipe2 = new Pipes(randomHeight + ventanita, canvas.height - (randomHeight + ventanita), false);
                      //tamanio mas espacio del primero tubo arriba y el segundo el pipe de abajo 
  pipes.push(pipe); //agrega a pipes los datos de pipe
  pipes.push(pipe2);
}

function drawPipes(){
  pipes.forEach(function(pipe){ //
    pipe.draw();
  });
}

function checkColition(){
  pipes.forEach(function (pipe){
    if(flappy.isTouching(pipe))gameOver();
  });
}

  //main
    function update(){
      generatePipes();
      frames++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      board.draw();
      drawPipes();
      flappy.draw();
      board.drawScore();
      checkColition();
    }

  function startGame() {
      if (intervalo > 0)return;

          intervalo = setInterval(function(){
            update();
          },1000/60)
          board.sound.play();
  }

  function stop(){
    clearInterval(intervalo);
    intervalo = 0;
    board.sound.pause();
    flappy.sound2.play();

  }

};//fin de todo
