var lastCell = "0-0";
var boardSolved = [
    [9, 2, 1, 6, 3, 7, 5, 8, 4],
    [6, 7, 4, 5, 1, 8, 9, 2, 3],
    [5, 8, 3, 4, 9, 2, 1, 6, 7],
    [2, 6, 9, 8, 5, 4, 3, 7, 1],
    [7, 4, 5, 3, 6, 1, 2, 9, 8],
    [1, 3, 8, 7, 2, 9, 6, 4, 5],
    [8, 5, 6, 2, 7, 3, 4, 1, 9],
    [4, 1, 2, 9, 8, 5, 7, 3, 6],
    [3, 9, 7, 1, 4, 6, 8, 5, 2],
];
var board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

window.onload = function () {
    generateBoard();
}

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Sudoku Generate Board //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
function generateBoard() {
    initBoard();
    for (let i = 0; i < 9; i += 3) {
        swap(i, i + 1);
        swap(i, i + 2);
    }

    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            if (!Math.floor(Math.random() * 2))
                board[i][j] = boardSolved[i][j];

    printTable();
}
function swap(pos1, pos2) {
    //swap rows
    for (let i = 0; i < 9; i++) {
        let auxRow = boardSolved[pos1][i];
        boardSolved[pos1][i] = boardSolved[pos2][i];
        boardSolved[pos2][i] = auxRow;
    }
    //swap columns
    for (let i = 0; i < 9; i++) {
        let auxCol = boardSolved[i][pos1];
        boardSolved[i][pos1] = boardSolved[i][pos2];
        boardSolved[i][pos2] = auxCol;
    }
}
function initBoard() {
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            board[i][j] = 0;
}

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Sudoku Solver //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
async function solveSudoku() {
    if (document.getElementById('solve').innerHTML == "Stop")
        location.reload();

    disableButtons(true);
    await solve(board);
    disableButtons(false);
    clear();
}
async function solve(board) {
    let empty = await nextEmptySpot(board);
    let row = empty[0];
    let col = empty[1];
    let pos = document.getElementById(row + "-" + col);

    if (row === -1)
        return board;

    for (let num = 1; num <= 9; num++) {
        if (await checkValue(board, row, col, num)) {
            await draw();
            board[row][col] = num;
            pos.innerHTML = num;
            pos.style.color = "#29ff29";
            await solve(board);
        }
    }

    if (await nextEmptySpot(board)[0] !== -1) {
        board[row][col] = 0;
        pos.innerHTML = 0;
        pos.style.color = "red";
    }

    return board;
}
function checkValue(board, row, column, value, draw = true) {
    //check row
    for (var i = 0; i < board.length; i++) {
        if (draw) document.getElementById(i + "-" + column).className = "visited";
        if (board[i][column] === value)
            return false;
    }
    //check umcolumnumn
    for (var i = 0; i < board[row].length; i++) {
        if (draw) document.getElementById(row + "-" + i).className = "visited";
        if (board[row][i] === value)
            return false;
    }
    //check squere
    boxRow = Math.floor(row / 3) * 3;
    boxCol = Math.floor(column / 3) * 3;
    for (var r = 0; r < 3; r++) {
        let x = boxRow + r;
        for (var c = 0; c < 3; c++) {
            let y = boxCol + c;
            if (draw) document.getElementById(x + "-" + y).className = "visited";
            if (board[x][y] === value)
                return false;
        }
    }
    if (draw) {
        document.getElementById(row + "-" + column).className = "center";
        document.getElementById(row + "-" + column).style.color = "#40bdec";
    }

    return true;
}
function nextEmptySpot(board) {
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++)
            if (board[i][j] === 0)
                return [i, j];

    return [-1, -1];
}

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Sudoku Draw ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function printTable() {
    document.getElementById("board").innerHTML = "";
    for (let i = 0; i < 9; i++) {
        let tr = document.createElement('tr');
        tr.style = "border-top: 1px solid white;";
        if (i % 3 == 0 && i != 0)
            tr.style = "border-top: 4px solid white;";
        for (let j = 0; j < 9; j++) {
            let td = document.createElement('td');
            td.id = i + "-" + j;
            if (board[i][j] === 0) {
                td.contentEditable = true;
                td.className = "empty_cell";
                td.addEventListener("input", userNewNum);
            }
            else
                td.innerHTML = board[i][j];

            td.style = "border-left: 1px solid white;"
            if (j % 3 == 0 && j != 0)
                td.style = "border-left: 4px solid white;"
            tr.appendChild(td);
        }
        document.getElementById("board").appendChild(tr);
    }
}
function draw() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            clear();
            resolve();
        }, 135);
    });
}
function clear() {
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            document.getElementById(i + "-" + j).className = "";
}

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// User Interaction ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
function userNewNum(event) {
    let newNum = parseInt(event.target.innerHTML);
    let id = event.target.id;
    let pos = id.split("-");
    let element = document.getElementById(id);

    if (lastCell == id) //allow olny 1 number per cell
        element.innerHTML = newNum;

    if (!Number.isInteger(newNum) || newNum === 0) { // allow only numbers 
        boardNum = board[pos[0]][pos[1]];
        (boardNum == 0) ? element.innerHTML = "" : element.innerHTML = boardNum;
    }
    else if (newNum < 1 || newNum > 9) { //allow numbers between 1-9
        newNum = parseInt(event.data);
        element.innerHTML = newNum;
    }

    if (!Number.isNaN(newNum) && newNum >= 1 && newNum <= 9) {
        //check if is a valid position (row, column and square)
        let isValid = checkValue(board, parseInt(pos[0]), parseInt(pos[1]), newNum, false);
        (!isValid) ? element.style.color = "red" : element.style.color = "";

        board[pos[0]][pos[1]] = newNum;
    }

    lastCell = id;
}
function disableButtons(disable) {
    let solveButton = document.getElementById('solve');
    let newBoardButton = document.getElementById('newBoard');
    let board = document.getElementById('board');

    if (disable) {
        solveButton.innerHTML = "Stop";
        solveButton.className = "stop";
        newBoardButton.style.pointerEvents = "none";
        newBoardButton.style.color = "gray";
        board.style.pointerEvents = "none";
    }
    else {
        solveButton.innerHTML = "Solve";
        solveButton.className = "";
        newBoardButton.style.pointerEvents = "";
        newBoardButton.style.color = "white";
        board.style.pointerEvents = "";
    }
}