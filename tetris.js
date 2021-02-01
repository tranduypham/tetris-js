var SCORE = document.querySelector(".score");
const cvs = document.querySelector("#tetris");
const ctx = cvs.getContext("2d");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20; //Default size of a single square
const VACANT = "white"; //Color of empty square


// Draw a square
function drawSQ(x, y, color = "white") {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}





// Create the board
let board = [];
for (r = 0; r < ROW; r++) {
    board[r] = [];
    for (c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}
// Draw the Inital Board
function drawBoard() {
    for (r = 0; r < ROW; r++) { //x
        for (c = 0; c < COL; c++) { //y
            drawSQ(c, r, board[r][c]);
        }
    }
}
drawBoard();






const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellowgreen"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"],
];


function randPeice() {
    let r = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1]);
}



// let p = randPeice() ;
let p = randPeice();
//Piece OBJ
function Piece(tetromino, color) { //Constructor
    // Hinh dang Z + mau sac red
    this.tetromino = tetromino;
    this.color = color;

    // Z[0]
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // Position of peices
    this.x = 0;
    this.y = -4;
}
// Function Draw piece of Piece OBJ
Piece.prototype.draw = function () { //Add function to current Obj

    for (r = 0; r < this.activeTetromino.length; r++) { //x
        for (c = 0; c < this.activeTetromino.length; c++) { //y
            if (this.activeTetromino[r][c]) {
                drawSQ(this.x + c, this.y + r, this.color);
            }
        }
    }
};
// Function unDraw piece of Piece OBJ
Piece.prototype.unDraw = function () { //Add function to current Obj
    for (r = 0; r < this.activeTetromino.length; r++) { //x
        for (c = 0; c < this.activeTetromino.length; c++) { //y
            if (this.activeTetromino[r][c]) {
                drawSQ(this.x + c, this.y + r, VACANT);
            }
        }
    }
};
var score = 0;
SCORE.innerHTML = score;
// Functin Lock
Piece.prototype.lock = function () {
    for (r = 0; r < this.activeTetromino.length; r++) { //x
        for (c = 0; c < this.activeTetromino.length; c++) { //y
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            if (this.y + r < 0) {
                GameOver = true;
                alert("Game Over. F5 to reset the game");
                break;
            }
            board[this.y + r][this.x + c] = this.color;
        }
    }
    for (r = 0; r < ROW; r++) { //x
        let is_Full = true;
        for (c = 0; c < COL; c++) { //y
            is_Full = is_Full && (board[r][c] != VACANT);
        }
        if (is_Full) {
            for (i = r; i > 0; i--) {
                for (c = 0; c < COL; c++) {
                    board[i][c] = board[i - 1][c];
                }
            }
            // If the top row board[0][x] is full, so there are no row before it (board[-1][x] doesn't exsit) so we have to set the Board[0][x] into White by your self
            for (c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
            score += 10;
            SCORE.innerHTML = score;
        }
    }
    drawBoard();
};
// Function Movedown the piece of Piece OBJ
Piece.prototype.moveDown = function () {
    console.log("down");
    if (!this.is_Collision(0, 1)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        // Lock the activePiece and generate a new Piece
        this.lock();
        p = randPeice();
    }

};
// Function moveRight the piece of Piece OBJ
Piece.prototype.moveRight = function () {
    console.log("right");
    if (!this.is_Collision(1, 0)) {
        this.unDraw();
        this.x++;
        this.draw();
    } else {
        // Lock the activePiece and generate a new Piece
        // console.log("hello");
    }

};
// Function moveLeft the piece of Piece OBJ
Piece.prototype.moveLeft = function () {
    console.log("left");
    if (!this.is_Collision(-1, 0)) {
        this.unDraw();
        this.x--;
        this.draw();
    } else {
        // console.log("hello");
    }

};
// Function moveLeft the piece of Piece OBJ
Piece.prototype.rotate = function () {
    console.log("rotate");
    let nextPatterm = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    if (this.is_Collision(0, 0, nextPatterm)) {
        console.log("Bound");
        if (this.x < COL / 2) {
            kick = 1;
        }
        if (this.x > COL / 2) {
            kick = -1;
        }
    }
    if (!this.is_Collision(kick, 0, nextPatterm)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }

    console.log(kick);
};
// Collision check
Piece.prototype.is_Collision = function (x, y, check_piece = this.activeTetromino) {
    for (r = 0; r < check_piece.length; r++) { //x
        for (c = 0; c < check_piece.length; c++) { //y
            if (!check_piece[r][c]) { //Ô ko có tô màu
                continue;
            }
            let nextX = this.x + c + x;
            let nextY = this.y + r + y;
            if (nextX < 0 || nextX >= COL || nextY >= ROW) { //Bay khỏi bàn cờ
                return true;
            }
            if (nextY < 0) {
                continue;
            }
            if (board[nextY][nextX] != VACANT) { //Ô tiếp theo đã bị Occupied
                return true;
            }
        }
    }
    return false;
};

// Constainly use Move down to drop the piece

var LEVEL;

let start = Date.now();
var GameOver = false;

function drop() {
    console.log(LEVEL);
    let now = Date.now();
    let delta = now - start;
    if (delta > LEVEL) { //Moi 1s thuc hien drop 1 lan
        p.moveDown();
        start = Date.now();
    }
    if (!GameOver) {
        requestAnimationFrame(drop); //Taoj vong lap chuyen dung cho animation
    }
}



// Key press listener
function MediumMode() {
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 37) {
            p.moveLeft();
        } else if (e.keyCode == 38) {
            p.rotate();
        } else if (e.keyCode == 39) {
            p.moveRight();
        } else if (e.keyCode == 40) {
            p.moveDown();
        }
    });
}



function EasyMode() {
    // Key press listener but Pieces stop when ever you hit button - easy mode
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 37) {
            p.moveLeft();
            start = Date.now();
        } else if (e.keyCode == 38) {
            p.rotate();
            start = Date.now();
        } else if (e.keyCode == 39) {
            p.moveRight();
            start = Date.now();
        } else if (e.keyCode == 40) {
            p.moveDown();
        }
    });
}


function startGame() {
    p.draw();
    drop();
    if (LEVEL == 500) {
        MediumMode();
    }
    if (LEVEL == 1000) {
        EasyMode();
    }
}

var btn = document.querySelector(".button");
var menu = document.querySelector(".menu");
var main = document.getElementById("play");
console.log(main);
var level = 1;

btn.addEventListener('click', function (e) {
    e.preventDefault;
    var op1 = document.querySelector("#op1");
    var op2 = document.querySelector("#op2");
    if (op1.checked) {
        level = 1;
    } else {
        level = 2;
    }
    if (level == 2) {
        LEVEL = 1000;
    }
    if (level == 1) {
        LEVEL = 500;
        // levelOfGame = MediumMode();
    }

    menu.classList.add("hidden");
    main.classList.remove("hidden");
    startGame();
});