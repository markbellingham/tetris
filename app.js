document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colours = ['orange', 'red', 'purple', 'green', 'blue'];
    let gameInPlay = false;
    let gameEnded = false;

    // The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    let currentPosition = 4;
    let currentRotation = 0;

    // Randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    // Draw the Tetromino
    function draw() {
        current.forEach( index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colours[random];
        });
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach( index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    // Assign functions to keycodes
    function control(e) {
        if(gameInPlay) {
            switch(e.key) {
                case 'ArrowLeft':
                    moveLeft(); break;
                case 'ArrowUp':
                    rotate(); break;
                case 'ArrowRight':
                    moveRight(); break;
                case 'ArrowDown':
                    moveDown(); break;
            }
        }
    }
    document.addEventListener('keydown', control);

    // Move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // Freeze function
    function freeze() {
        if(current.some( index => squares[currentPosition + index + width].classList.contains('taken') )) {
            current.forEach( index => squares[currentPosition + index].classList.add('taken') );
            // start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // Move the tetromino left
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some( index => (currentPosition + index) % width === 0 );
        if(!isAtLeftEdge) {
            currentPosition -= 1;
        }
        if(current.some( index => squares[currentPosition + index].classList.contains['taken'])) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some( index => (currentPosition + index) % width === width -1 );
        if(!isAtRightEdge) {
            currentPosition += 1;
        }
        if(current.some( index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    // Rotate the tetromino
    function rotate() {
        const prev = current.map( x => x );
        const oldRotation = currentRotation.valueOf();

        undraw();
        currentRotation++;
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();

        // Check if the tetromino has wrapped around the board, and undo if it has
        const isAtLeftEdge = current.some( index => (currentPosition + index) % width === 0 );
        const isAtRightEdge = current.some( index => (currentPosition + index) % width === (width - 1) );
        if(isAtRightEdge && isAtLeftEdge) {
            undraw();
            current = prev.map( x => x );
            currentRotation = oldRotation.valueOf();
            draw();
        }
    }

    // Show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    // The Tetrominoes without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], // lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], // zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], // tTetromino
        [0, 1, displayWidth, displayWidth+1], // oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], // iTetromino
    ];

    // Display the shape in the mini-grid display
    function displayShape() {
        // Remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colours[nextRandom];
        });
    }

    // Add functionality to the button
    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
            gameInPlay = false;
        } else {
            if(gameEnded) {
                for(let i = 0; i < 199; i++) {
                    squares[i].classList.remove('tetromino','taken');
                    squares[i].style.backgroundColor = '';
                }
                gameEnded = false;
                score = 0;
                scoreDisplay.innerHTML = score;
            }
            gameInPlay = true;
            draw();
            timerId = setInterval(moveDown, 500);
            displayShape();
        }
    });

    // Add score
    function addScore() {
        let multiple = 0;
        for(let i = 0; i < 199; i+=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every( index => squares[index].classList.contains('taken'))) {
                score += 10 + multiple;
                multiple += 5;
                scoreDisplay.innerHTML = score;
                undraw();
                row.forEach( index => {
                    squares[index].classList.remove('taken', 'tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach( cell => grid.appendChild(cell) );
                draw();
            }
        }
    }

    // Game over
    function gameOver() {
        if(current.some( index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
            timerId = null;
            gameInPlay = false;
            gameEnded = true;
        }
    }

});