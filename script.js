const mainObject = $("#main-object");
const app = $("html");
var g_width = parseInt($(".game").css("width"));
var g_height = parseInt($(".game").css("height"));
var denta = 0;
var score = 0;
const scoreElement = $(".score-val");

var speed = 5;
if (g_width < 750) speed = 3;

class Obstacle {
  constructor(x, y, h) {
    this.x = x;
    this.y = y;
    this.height = h;
  }
  plus() {
    this.x += speed;
  }
  display() {
    return `
     <div class="obs-${this.height}" style="right:${this.x}px; bottom:${this.y}"></div>   
    `;
  }
}

var obstacleArray = [];
obstacleArray.push(new Obstacle(-100, 0, 1));

var state = {
  x: 0,
  y: 0,
  pressedKeys: {
    left: false,
    right: false,
    up: false,
    down: false,
  },
};

var keyMap = {
  68: "right",
  65: "left",
  87: "up",
  83: "down",
};
state.x = g_width / 2;
if (g_width < 750)
  state.x = g_width - 100;
function keydown(event) {
  if (parseInt(mainObject.css("bottom")) > 3) return;

  var key = keyMap[event.keyCode];

  state.pressedKeys[key] = true;
  // console.log('key down');

  if (state.pressedKeys.up) {
    if (denta == 0) {
      denta = 30;
      statusMainObject = 1;
    }
  }
}
function keyup(event) {
  var key = keyMap[event.keyCode];
  state.pressedKeys[key] = false;
}

var statusMainObject = 0;

function chooseHeight() {
  return Math.floor(Math.random() * 3) + 1;
}

function update(progress) {
  score++;
  if (score > 2000) {
    if (g_width < 750) speed = 5;
    else speed = 7;
  } else if (score > 5000) {
    if (g_width < 750) speed = 7;
    else speed = 10;
  }
  scoreElement.html(score);

  if (g_width > 1000) {
    // Update the state of the world for the elapsed time since last render
    if (obstacleArray[obstacleArray.length - 1].x > g_width / 3) {
      obstacleArray.push(new Obstacle(0, 0, chooseHeight()));
    }
  } else if (g_width > 750) {
    if (obstacleArray[obstacleArray.length - 1].x > (2 * g_width) / 3) {
      obstacleArray.push(new Obstacle(0, 0, chooseHeight()));
    }
  } else {
    if (obstacleArray[obstacleArray.length - 1].x > g_width + 100) {
      obstacleArray.push(new Obstacle(0, 0, chooseHeight()));
    }
  }
}
$(document).click(function (e) {
  if (parseInt(mainObject.css("bottom")) > 3) return;

  if (denta == 0) {
    denta = 30;
    statusMainObject = 1;
  }
  console.log("Clicked");
});
function updatePOS() {
  mainObject.css("right", state.x + "px");
  mainObject.css("bottom", state.y + "px");
}
function HeightOBS(h) {
  switch (h) {
    case 1:
      return 100;
    case 2:
      return 70;
    case 3:
      return 50;
  }
  return 0;
}
function CheckQuit() {
  for (var i = 0; i < obstacleArray.length; i++) {
    if (
      Math.abs(obstacleArray[i].x - parseInt(mainObject.css("right"))) < 5 &&
      parseInt(mainObject.css("bottom")) < HeightOBS(obstacleArray[i].height)
    ) {
      console.log("Game over");
      return false;
    }
  }
  return true;
}

function draw() {
  // Draw the state of the world
  updatePOS();

  // state.x += 5;

  if (state.x >= g_width) {
    state.x = -100;
  }

  if (statusMainObject == 1) {
    state.y += 5;
    denta--;
  }
  if (state.y < 0) {
    state.y = 0;
  }

  if (denta == 0) {
    statusMainObject = 0;
    if (state.y > 0) {
      state.y -= 5;
    }
  }

  $("#on-ground").html(" ");
  for (var i = 0; i < obstacleArray.length; i++) {
    obstacleArray[i].plus();
    var htmlTemp = obstacleArray[i].display();
    $("#on-ground").append(htmlTemp);
  }
}
function reset() {
  window.location.reload();
}
$(".play-again-btn").click(function () {
  reset();
  console.log("reset");
  $(".modal").hide();
});

function loop(timestamp) {
  var progress = timestamp - lastRender;

  update(progress);
  draw();
  if (!CheckQuit()) {
    $(".modal b.point").text(score);
    $(".modal").show();
    return;
  }

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);
window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);
