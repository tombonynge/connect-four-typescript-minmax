import { Handler } from "./index";

export class HtmlHandler {
    board: HTMLElement | null;
    cols: number;
    rows: number;
    handler: Handler;

    constructor(cols: number, rows: number, handler: Handler) {
        this.board = document.getElementById("board");
        this.cols = cols;
        this.rows = rows;
        this.handler = handler;
    }

    create() {
        if (this.board) {
            for (let x = 0; x < this.cols; x++) {
                const column = document.createElement("div");
                column.setAttribute("id", `col-${x}`);
                column.classList.add("column");
                for (let y = 0; y < this.rows; y++) {
                    const row = document.createElement("div");
                    row.setAttribute("id", `row-${y}`);
                    row.classList.add("row");
                    // add label to row!
                    row.innerText = `${x},${y}`;
                    column.appendChild(row);
                }
                this.board.appendChild(column);
            }
            // add an event listener to handle clicks on the board;
            let that = this;
            const columns = this.board.querySelectorAll(".column");
            columns.forEach((element) => {
                element.addEventListener("click", this.handleClick.bind(that));
            });
            console.log("ready for input");
        } else {
            throw new Error("The board is undefined");
        }
    }

    handleClick(e: Event) {
        let column: number = 0;
        let target = <HTMLElement>e.target;
        if (target.getAttribute("class") === "row") {
            column = parseInt(target.parentElement!.getAttribute("id")![4]);
        }
        if (target.getAttribute("class") === "column") {
            column = parseInt(target.getAttribute("id")![4]);
        }
        this.handler.receiveClick(column);
    }

    update(col: number, row: number, player: number) {
        // find the relevant cell and update it's color;
        let color = player === 1 ? "red" : "yellow";
        let column = this.board!.querySelector(`#col-${col}`);
        let cell = column?.querySelector(`#row-${row}`);
        cell?.setAttribute("style", `background:${color}`);
    }
}
