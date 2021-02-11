import { Handler, Move } from "./index";
import * as utils from "./utils";

export class BoardHandler {
    COLS: number;
    ROWS: number;
    handler: Handler;
    board: number[][];

    constructor(cols: number, rows: number, handler: Handler) {
        this.COLS = cols;
        this.ROWS = rows;
        this.handler = handler;
        this.board = this.buildBoard(cols, rows);
    }

    buildBoard(cols: number, rows: number): number[][] {
        const board: number[][] = [];
        for (let x = 0; x < cols; x++) {
            board.push([]);
            for (let y = 0; y < rows; y++) {
                board[x].push(0);
            }
        }
        return board;
    }

    getBoard() {
        return utils.copyArray(this.board); // return a deep copy of the board
    }

    log() {
        let temp = utils.transpose(this.board);
        console.log(`
            ${temp[0]}
            ${temp[1]}
            ${temp[2]}
            ${temp[3]}
            ${temp[4]}
            ${temp[5]}
        `);
    }

    handlePlayerSelection(columnIndex: number, player: number) {
        // check if a move can be made on the desired column
        let row = 0;
        if (this.board[columnIndex][0] === 0) {
            for (let i = this.board[columnIndex].length - 1; i >= 0; i--) {
                if (this.board[columnIndex][i] === 0) {
                    this.board[columnIndex][i] = player;
                    row = i;
                    break;
                }
            }
            return { col: columnIndex, row: row };
        } else {
            return false;
        }
    }

    handleComputerChoice(col: number, row: number) {
        this.board[col][row] = 2;
    }

    checkMoveForWin(move: Move, player: number) {
        if (this.checkLoopForWin(this.board[move.col], player)) {
            return true;
        }

        // eval row
        let tempRow: number[] = [];
        for (let x = 0; x < this.board.length; x++) {
            tempRow.push(this.board[x][move.row]);
        }

        if (this.checkLoopForWin(tempRow, player)) {
            return true;
        }

        // check diagonals
        // first we go bottom left to top right /
        // first find start of diagonal row from move position
        let c = move.col,
            r = move.row;
        while (r < this.ROWS - 1 && c > 0) {
            c--;
            r++;
        }

        // iterate through cells diagonally /
        // j = col, k = row
        let tempDiagNorthEast: number[] = [];
        for (c; c < this.board.length; c++) {
            tempDiagNorthEast.push(this.board[c][r]);
            r--;
            if (r < 0) {
                break;
            }
        }

        if (this.checkLoopForWin(tempDiagNorthEast, player)) {
            return true;
        }

        // now we check bottom right to top left;
        c = move.col;
        r = move.row;
        while (r < this.ROWS - 1 && c < this.COLS - 1) {
            c++;
            r++;
        }

        let tempDiagNorthWest: number[] = [];
        for (c; c >= 0; c--) {
            tempDiagNorthWest.push(this.board[c][r]);
            r--;
            if (r < 0) {
                break;
            }
        }

        if (this.checkLoopForWin(tempDiagNorthWest, player)) {
            return true;
        }

        return false;
    }

    checkLoopForWin(set: number[], player: number) {
        let count: number = 0;
        for (let i = 0; i < set.length; i++) {
            if (set[i] === player) {
                count++;
            }
            if (set[i] !== player) {
                count = 0;
            }
            if (count > 3) return true;
        }
        return false;
    }

    reset() {
        this.board = this.buildBoard(this.COLS, this.ROWS);
    }
}
