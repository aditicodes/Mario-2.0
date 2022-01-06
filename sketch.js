// global varr
var gameOverImg,restartImg;
var bkSound,jumpSound,ringSound ;

var sonic , sonic_running, sonicCollide;
  
var ground, invisiGround, groundImg,bgimg;
var ring ,ringImage, obstacle, obstacleImage,obstacleGroup;
var butterflyImage,butterflyGroup;

var monster1,monster2,monster3, bulletImage;

var monsterGroup, monster, bulletGroup, bullet;

var score = 0;
  var ringScore = 0;
  

var PLAY = 0;
  var END = 1;
  var gameState = PLAY;


  function preload(){
    // ading animation
    restartImg = loadImage("restart.png")
    gameOverImg = loadImage("gameOver.png")
    bgimg = loadImage("sonibg.png");
    

    sonic_running = loadAnimation("sonic1.png","sonic2.png","sonic3.png","sonic4.png","sonic5.png","sonic6.png");
    
// colliding
    sonicCollide = loadAnimation("playerfreeze.png");

    butterflyImage = loadAnimation("butterfly1.png", "butterfly2.png");

    groundImg = loadImage("sonicground1.jpg") 

    ringImage = loadAnimation("ring1.png","ring2.png","ring3.png","ring4.png");
    obstacleImage = loadImage("building.png");
    
  monster1 = loadImage("mon1.png");
  monster2 = loadImage("mon2.png");
  monster3 = loadImage("mon3.png");
  bulletImage = loadImage("ball.png");

  ringSound=loadSound("candy.wav");  
  jumpSound=loadSound("jump.wav");
  bkSound=loadSound("bk.mp3");
  }  

function setup(){
  createCanvas(600,300);
  bg = createSprite(200, 150);
  bg.addImage("bgimg", bgimg);
  bg.scale =1.3;
   
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
// creating groups
    obstacleGroup = createGroup();
    ringGroup = createGroup();
  butterflyGroup=createGroup();
  monsterGroup=createGroup();
  bulletGroup=createGroup();

// creating sonic
    sonic = createSprite(80,230,10,10);
    sonic.scale = 0.18;
    sonic.addAnimation("sonic", sonic_running);
    sonic.addAnimation("collide", sonicCollide);


    ground = createSprite(300,340,600,10);
    ground.scale = 1;

    ground.addImage("ground", groundImg);
// creating invis ground
    invisiGround = createSprite(300,278,600,7);
    invisiGround.visible = false;
  bkSound.play();
  bkSound.loop(); 
  }

  function draw(){
    
    background("skyblue");
    fill("white");
    text("SURVIVAL TIME: "+score, 470, 20);
    text("RINGS COLLECTED: "+ringScore,300,20);

    if (gameState === PLAY){
      
      obstacles();
      rings();
      spawnButterfly();
      spawnMonsters();
      score = score + Math.round(getFrameRate()/50);
      gameOver.visible = false
      restart.visible = false

      ground.velocityX = -(4+score*1.5/100);
       bg.velocitX= -(4+score*1.5/100);
      
          
      if(keyDown("space")) {
        sonic.velocityY = -13; 
        jumpSound.play();
      }

      sonic.velocityY = sonic.velocityY + 0.7

      if (ground.x < 0){
        ground.x = ground.width/2;
      }
if (bg.x < 0){
        bg.x = bg.width/2;
      }
      if (sonic.isTouching(ringGroup)){
        ringScore++;  
        ringGroup.destroyEach();

      }
      
      if(keyDown("t")) {
      throwBullet();  
    }
      if(monsterGroup.isTouching(sonic)){
      gameState = END;
     }
      if(obstacleGroup.isTouching(sonic)){
      //score++;
      sonic.scale = 0.20;
      //candySound.play();
      obstacleGroup.destroyEach();
   }
      if(bulletGroup.isTouching(monsterGroup)) {
      score = score + 1;
      sonic.scale = 0.40;
      monsterGroup.destroyEach();
    }
    
    if(ringGroup.isTouching(sonic)){
      score++;
      sonic.scale = 0.40;
      ringSound.play();
      ringGroup.destroyEach();
   }

      if (sonic.isTouching(obstacleGroup)){
        gameState = END;
     
      }

    }

    if (gameState === END){
      ground.velocityX = 0;

      bkSound.stop();
      gameOver.visible = true;
      restart.visible = true;
      sonic.y = 235;
      sonic.scale = 0.12;
            
      sonic.changeAnimation("collide", sonicCollide);

      obstacleGroup.setVelocityXEach(0);
      ringGroup.setVelocityXEach(0);
      obstacleGroup.setLifetimeEach(-1);
      ringGroup.setLifetimeEach(-1);
      

      if(mousePressedOver(restart)) {
      reset();
    
        ringGroup.destroyEach();
        obstacleGroup.destroyEach();
        sonic.changeAnimation("sonic", sonic_running);
        score = 0;
        ringScore = 0;
        gameState = PLAY; 
      }
    }



    drawSprites(); 
    text("SURVIVAL TIME: "+score, 470, 20);
    text("RINGS COLLECTED: "+ringScore,300,20);
    sonic.collide(invisiGround);
   
  }

function rings(){
    if (frameCount%80 === 0){

      ring = createSprite(620,120, 50, 50 )
      ring.addAnimation("ring", ringImage);
      ring.y=Math.round(random(120,200)); 
      ring.scale = 0.1;
      ring.velocityX =-(4+score*1.9/100);           
      ring.lifetime = 220;
      ringGroup.add(ring);
     


    }



  }
function reset(){
  
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;

obstacleGroup.destroyEach();
  
  score=0;
}

function obstacles(){
    if (frameCount%200 === 0){

      obstacle = createSprite(620,253,50,50);
      obstacle.addAnimation("rock", obstacleImage);
      obstacle.setCollider("circle", 0, 0, 10);
      obstacle.scale = 0.4 ;
      obstacle.velocityX = -(4+score*1.5/100);
      obstacle.lifetime = 220;
      obstacle.collide(ground);
      obstacleGroup.add(obstacle);

    }    
  }

function spawnButterfly() {
  
  if (frameCount % 60 === 0) {
    var butterfly = createSprite(600,120,40,10);
    butterfly.y = Math.round(random(80,210));
    butterfly.addAnimation("butterfly",butterflyImage);
    butterfly.scale = 0.2;
    
    if(butterfly.y>150){
      butterfly.y=150;
      butterfly.velocityX = -3;
      butterfly.velocityY = -1;
    }
    else {
      butterfly.velocityX = -3;
      butterfly.velocityY = 1;
    }
     //assign lifetime to the variable
    butterfly.lifetime = 200;
    
    //adjust the depth
    butterfly.depth = sonic.depth;
    sonic.depth = sonic.depth + 1;
    
    //add each butterfly to the group
    butterflyGroup.add(butterfly);
  }
  
}
function spawnMonsters() {
  
  if (frameCount % 250 === 0) {
    monster = createSprite(600,285,10,40);
    x=Math.round(random(1,3))
    if (x==1)
      {
        monster.addImage(monster1);
        monster.scale = 0.3    ;
      }
    else if (x==2)
      {
        monster.addImage(monster2);
        monster.scale = 0.2;
      }
    else{
        monster.addImage(monster3);
        monster.scale = 0.1   ;
    }
   
    monster.velocityX = -3;
   //assign lifetime to the variable
    monster.lifetime = 200;
    
    //adjust the depth
    monster.depth = sonic.depth;
    sonic.depth =sonic.depth + 1;
    
    //add each monster to the group
    monsterGroup.add(monster);
  }

}

function throwBullet() {
  bullet = createSprite(70,240,10,40);
  bullet.addImage(bulletImage);
  bullet.rotation = -30;
  bullet.scale = 0.1;
  bullet.velocityY = 2;    
  bullet.velocityX = 4;
  bullet.lifetime = 50;
  bulletGroup.add(bullet);
}
