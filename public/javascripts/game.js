var board;
var main = document.getElementById('main')
board = document.getElementById('board')
// var boardWidth = window.innerHeight*0.5714;        
var boardWidth = window.innerWidth;        
var boardHeight = window.innerHeight;
 main.style.width = window.innerWidth;        
main.style.height = window.innerHeight;
var context;

//play pause button logic
var button = document.getElementById('button')
//score logic
var scoreMeter = document.getElementById('score')
var HighScoreMeter = document.getElementById('highScore')
var gscoreMeter = document.getElementById('gscore')
var gHighScoreMeter = document.getElementById('ghighScore')
var Over = document.getElementById('over')


//bird
var birdWidth = 34; //width/height ratio = 408/228 = 17/12
var birdHeight = 24;
var birdX = boardWidth/8;
var birdY = boardHeight/2;
var birdImg;

var bird = {
    x:birdX,
    y:birdY,
    width:birdWidth,
    height:birdHeight
}
//pipes
var pipeArray =[];
var pipeWidth = 64; // 1/8
var pipeHeight = 512;
var pipeX = boardWidth;
var pipeY = 0;

var topPipeImg;
var bottomPipeImg;

//physics
var pipeSpeed = -4 ;
var pause = false;

var velocityX = pipeSpeed; //pipe moving left
var velocityY  =0; // bird jumping
var gravity = 0.4; //bird getting down
var gameOver = false;
var score = 0;

window.onload = function(){
    board = document.getElementById('board')
    board.height = boardHeight;
    board.width = boardWidth
    context = board.getContext('2d');

    //draw flappy bird
    context.fillStyle = 'red';
    context.fillRect(bird.x,bird.y,bird.width,bird.height)
    
    //load inmages
    birdImg = new Image();
    birdImg.src = "./images/flappybird.png";
    birdImg.onload = function(){
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }
    topPipeImg = new Image();
    topPipeImg.src = './images/toppipe.png';
    bottomPipeImg = new Image();
    bottomPipeImg.src = './images/bottompipe.png';
    requestAnimationFrame(update)
    setInterval(placePipes,1500);//placing pipe speed

}
function update(){
    
    requestAnimationFrame(update);
    if(pause){
        return
    }
    velocityY += gravity;
  
    if(gameOver){
        // bird.y = Math.max(bird.y + velocityY , 0)*1.1;
        return; 
    } else{board.style.animation = 'bga 6s linear  infinite';}
    context.clearRect(0, 0, board.width, board.height);
    //bird
    
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY , 0); // apply gravity to current pos of the bird , or limit the jumbping height
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    if(bird.y > board.height){
        gameOver = true;
    }
    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX ;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5; // there are two pipes
            pipe.passed = true;
        }
        
        if(collision(bird,pipe)){
            gameOver = true;
        }
        

    }
    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth ){
        pipeArray.shift(); //removes the first element from array
    }

    //score 
    //high score
const HighScore = localStorage.getItem('tempScore');

    context.fillStyle = 'white';
    context.font = '2em sans-serif' ;
    scoreMeter.textContent = `${score}`
    gscoreMeter.textContent = `${score}`
    HighScoreMeter.textContent = `${HighScore}`
    gHighScoreMeter.textContent = `${HighScore}`
    var tempScore = score
    //score
          if(HighScore != null){
        if(HighScore<tempScore){
            localStorage.setItem('tempScore', tempScore.toString());
        }
    }
    else{
        localStorage.setItem('tempScore', tempScore.toString());
    }
    if(gameOver){
        localStorage.removeItem('tempScore');
        // context.fillText('GAME OVER',250,90)
    }
}

function placePipes(){
   if(pause){
    board.style.animation = 'none';
    return
   }
    if(gameOver){
        Over.style.display = 'flex'
        board.style.animation = 'none';
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2)
    var openingSpace = board.height/4;
    var toppipe={
        img:topPipeImg,
        x:pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed : false
    }
    pipeArray.push(toppipe)

    var bottomPipe = {
        img: bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    } 
    pipeArray.push(bottomPipe);
}
window.addEventListener('keydown',function(e){
    if(e.keyCode === 32){
        moveBird()
    }
    else{
        stop()
    }
})
board.addEventListener('click',moveBird)

// moving the bird
function moveBird(){
    velocityY = -6;
    Over.style.display = 'none'
    //reset the game
    if(gameOver){
        bird.y = birdY;
        pipeArray=[];
        score = 0;
        gameOver = false;
         
    }
       // AJAX high score
axios.get('/scoreCheck')
.then((score) => {
  var ServerHighScore = score.data.highScore;
  console.log('Server ka score ' + ServerHighScore);

  var LocalHighScore = localStorage.getItem('tempScore');
  console.log('Local ka score ' + LocalHighScore);

  if (LocalHighScore > ServerHighScore) {
    console.log('if chala');
    axios.get(`/scoreSet/${LocalHighScore}`)
      .then((j) => {
        console.log('send the high score');
        localStorage.removeItem('tempScore');
      })
      .catch(() => {
        console.log('nhi gya');
      });
  } else if (ServerHighScore > LocalHighScore) {
    console.log('else chala');
    localStorage.setItem('tempScore', ServerHighScore.toString());
  }
})
.catch((error) => {
  console.error('Error fetching server high score:', error);
});



}

function collision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

var icon = document.getElementById('icon')
window.addEventListener('blur',()=>{
    document.title = "Wapis AA bhadwe!"
    changeIcon('/images/anger.png')
    // stop()
})
window.addEventListener('focus',()=>{
    document.title = "Flappy Bird"
    changeIcon('/images/flappybird.png')
})
function changeIcon(link){
    icon.href = link;
}
flag = true

function stop(){
    if(flag){
    pause = true;
    flag = false
    }
    else{
    pause = false;
    flag=true
    }
    if(pause){button.innerHTML = '<i class="ri-play-mini-fill"></i>'}
    else{button.innerHTML = '<i class="ri-pause-mini-fill"></i>'}
}


function restart(){
    window.location.href = '/game'
}
function pro(){
    window.location.href = '/profile'
}