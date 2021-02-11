import { HtmlHandler } from "./board_html";
import { BoardHandler } from "./board_data";
import { Computer } from "./computer";

export type Move = {
    col: number;
    row: number;
};

export class Handler {
    htmlHandler: HtmlHandler;
    boardHandler: BoardHandler;
    currentPlayer: number;
    computer: Computer;
    isWon: boolean;
    recentMove: Move;

    constructor() {
        this.htmlHandler = new HtmlHandler(7, 6, this);
        this.boardHandler = new BoardHandler(7, 6, this);
        this.computer = new Computer(7, 6, 4, this);
        this.currentPlayer = 1;
        this.isWon = false;
        this.recentMove = { col: 0, row: 0 };
    }

    init() {
        this.htmlHandler.create();
    }

    receiveClick(columnIndex: number) {
        // console.log(`column: ${columnIndex} was clicked`);

        if (!this.isWon) {
            if (this.currentPlayer === 1) {
                let validMove = this.boardHandler.handlePlayerSelection(columnIndex, 1);
                if (validMove) {
                    this.recentMove = validMove;
                    this.htmlHandler.update(validMove.col, validMove.row, 1);
                    this.sendMessage(`You chose column: ${validMove.col}, row: ${validMove.row}`);
                    if (this.boardHandler.checkMoveForWin(validMove, 1)) {
                        this.updateGameWon();
                        return;
                    }
                } else {
                    this.sendMessage("error, this is not a valid move", "error");
                }
                this.sendMessage("The computer is thinking...");
                // allow the html to update before the computer move is made...
                setTimeout(() => {
                    this.handleComputerMove();
                }, 10);
            }
        }
    }

    handleComputerMove() {
        this.currentPlayer = 2;
        const move = this.computer.makeMove(this.boardHandler.getBoard());
        if (move && move.col != -1) {
            this.recentMove = move;
            this.boardHandler.handleComputerChoice(move.col, move.row);
            this.htmlHandler.update(move.col, move.row, 2);
            this.sendMessage(`Computer chose column: ${move.col}, row: ${move.row}`);
            if (this.boardHandler.checkMoveForWin(move, 2)) {
                this.updateGameWon();
                return;
            }
        }
        this.currentPlayer = 1;
    }

    updateGameWon() {
        this.isWon = true;
        this.sendMessage(`PLAYER ${this.currentPlayer} WON THE GAME!!!`, "win");
        // to do: add something in html for this indication!
    }

    sendMessage(message: string, className: string = "") {
        const div = document.getElementById("message")!;
        const currentTime = new Date().toLocaleTimeString();
        const p = document.createElement("p");
        if (className != "") {
            p.className = className;
        }
        p.innerText = `${currentTime}: ${message}`;
        div.prepend(p);
        // console.log(message);
    }

    reset() {
        const div = document.getElementById("message")!;
        div.innerHTML = "";
        this.currentPlayer = 1;
        this.isWon = false;
        this.boardHandler.reset();
        this.htmlHandler.reset();
    }
}

const handler = new Handler();
handler.init();

const reset = document.getElementById("reset-btn");
reset?.addEventListener("click", () => {
    handler.reset();
});
