document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;

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
        });
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach( index => {
            squares[currentPosition + index].classList.remove('tetromino');
        });
    }


    // Make the tetromino move down every second
    // let timerId = setInterval(moveDown, 500);

    // Assign functions to keycodes
    function control(e) {
        if(e.key === 'ArrowLeft') {
            moveLeft();
        } else if(e.key === 'ArrowUp') {
            console.log('Up');
            rotate();
        } else if(e.key === 'ArrowRight') {
            console.log('Right');
            moveRight();
        } else if(e.key === 'ArrowDown') {
            console.log('Down');
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

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
        }
    }

    // Move the tetromino left
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some( index => (currentPosition + index) % width === 0 );

        if(!isAtLeftEdge) currentPosition -= 1;
        if(current.some( index => squares[currentPosition + index].classList.contains['taken'])) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some( index => (currentPosition + index) % width === width -1 );

        if(!isAtRightEdge) currentPosition += 1;
        if(current.some( index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    // Rotate the tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    // Show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

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
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
        });
    }

    // Add functionality to the button
    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 500);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    });

});