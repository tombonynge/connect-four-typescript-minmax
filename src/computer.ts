import { Handler, Move } from "./index";
import * as utils from "./utils";
import { NE_indices, NW_indices } from "./diag_indices";

// computer is player 2!!
export class Computer {
    handler: Handler;
    COLS: number;
    ROWS: number;
    DEPTH: number;
    // heuristicScores: number[];

    constructor(cols: number, rows: number, depth: number, handler: Handler) {
        this.handler = handler;
        this.COLS = cols;
        this.ROWS = rows;
        this.DEPTH = depth;
        // this.heuristicScores = [];
    }

    makeMove(board: number[][]) {
        interface MovePacket {
            move: Move;
            score: number;
        }

        // this.heuristicScores = [];

        const player = 2;
        let bestScore = -Infinity;
        const moves = this.getMoves(board);
        let bestMoves: MovePacket[] = [];
        if (moves.length === 0) {
            return false;
        }
        moves.forEach((move) => {
            board[move.col][move.row] = player;
            const score = this.minMax(board, move, this.DEPTH, false);
            board[move.col][move.row] = 0;

            if (score > bestScore) {
                bestScore = score;
                bestMoves = [{ move, score }];
            } else {
                if (score === bestScore) {
                    bestMoves.push({ move, score });
                }
            }
        });

        if (bestMoves.length > 1) {
            return bestMoves[utils.randomInteger(0, bestMoves.length - 1)].move;
        } else {
            return bestMoves[0].move;
        }
    }

    getMoves(board: number[][]) {
        let moves: Move[] = [];
        for (let x = 0; x < board.length; x++) {
            for (let y = board[x].length - 1; y >= 0; y--) {
                if (board[x][y] === 0) {
                    moves.push({ col: x, row: y });
                    break;
                }
            }
        }
        return moves;
    }

    minMax(board: number[][], move: Move, depth: number, isMax: boolean) {
        const score = this.evaluateBoard(utils.copyArray(board));

        if (depth === 0 || score !== 0) {
            // we are done return score
            if (score !== 0) {
                return score;
            } else {
                let h_score = this.heuristicEval(utils.copyArray(board), move, isMax === false ? 2 : 1);
                // this.heuristicScores.push(h_score);
                return h_score;
                // return score;
            }
        }

        if (isMax) {
            let bestScore = -Infinity;
            let moves = this.getMoves(board);
            moves.forEach((move) => {
                board[move.col][move.row] = 2;
                bestScore = Math.max(bestScore, this.minMax(board, move, depth - 1, false));
                board[move.col][move.row] = 0;
            });
            return bestScore;
        } else {
            let bestScore = Infinity;
            let moves = this.getMoves(board);
            moves.forEach((move) => {
                board[move.col][move.row] = 1;
                bestScore = Math.min(bestScore, this.minMax(board, move, depth - 1, true));
                board[move.col][move.row] = 0;
            });
            return bestScore;
        }
    }

    evaluateBoard(board: number[][]) {
        let totalScore = 0;

        // eval rows
        for (let y = 0; y < this.ROWS; y++) {
            let p1_points = 0;
            let p2_points = 0;
            let p1_count = 0;
            let p2_count = 0;
            for (let x = 0; x < this.COLS; x++) {
                if (board[x][y] === 1) {
                    p1_count++;
                    p2_count = 0;
                    if (p1_count === 4) {
                        p1_points++;
                        p1_count -= 1;
                    }
                } else if (board[x][y] === 2) {
                    p2_count++;
                    p1_count = 0;
                    if (p2_count === 4) {
                        p2_points++;
                        p2_count -= 1;
                    }
                } else {
                    p1_count = 0;
                    p2_count = 0;
                }
            }

            totalScore -= p1_points * 1001;
            totalScore += p2_points * 1000;
        }

        // eval columns
        for (let x = 0; x < this.COLS; x++) {
            let p1_points = 0;
            let p2_points = 0;
            let p1_count = 0;
            let p2_count = 0;
            for (let y = this.ROWS - 1; y >= 0; y--) {
                if (board[x][y] === 1) {
                    p1_count++;
                    p2_count = 0;
                    if (p1_count === 4) {
                        p1_points++;
                        p1_count -= 1;
                    }
                } else if (board[x][y] === 2) {
                    p2_count++;
                    p1_count = 0;
                    if (p2_count === 4) {
                        p2_points++;
                        p2_count -= 1;
                    }
                } else {
                    p1_count = 0;
                    p2_count = 0;
                }
            }
            totalScore -= p1_points * 1001;
            totalScore += p2_points * 1000;
        }

        // eval north east diagonal
        NE_indices.forEach((diag) => {
            let p1_points = 0;
            let p2_points = 0;
            let p1_count = 0;
            let p2_count = 0;
            diag.forEach((item) => {
                if (board[item.x][item.y] === 1) {
                    p1_count++;
                    p2_count = 0;
                    if (p1_count === 4) {
                        p1_points++;
                        p1_count -= 1;
                    }
                } else if (board[item.x][item.y] === 2) {
                    p2_count++;
                    p1_count = 0;
                    if (p2_count === 4) {
                        p2_points++;
                        p2_count -= 1;
                    }
                } else {
                    p1_count = 0;
                    p2_count = 0;
                }
            });
            totalScore -= p1_points * 1001;
            totalScore += p2_points * 1000;
        });

        // eval north west diagonal
        NW_indices.forEach((diag) => {
            let p1_points = 0;
            let p2_points = 0;
            let p1_count = 0;
            let p2_count = 0;
            diag.forEach((item) => {
                if (board[item.x][item.y] === 1) {
                    p1_count++;
                    p2_count = 0;
                    if (p1_count === 4) {
                        p1_points++;
                        p1_count -= 1;
                    }
                } else if (board[item.x][item.y] === 2) {
                    p2_count++;
                    p1_count = 0;
                    if (p2_count === 4) {
                        p2_points++;
                        p2_count -= 1;
                    }
                } else {
                    p1_count = 0;
                    p2_count = 0;
                }
            });
            totalScore -= p1_points * 1001;
            totalScore += p2_points * 1000;
        });

        return totalScore;
    }

    heuristicEval(board: number[][], move: Move, player: number) {
        // check possible combinations of four in row. higher number, higher score!
        // we need to get all possible 4 in a row combinations and evaluate them.
        // Any combination with the other players piece in, automatically gets discarded as this would mean a 4 in a row is not possible.
        // This means those combinations with other players piece in will always get lowest score (0)... so when minimizing will be best (computer will sabotage player)
        // we also get added bonus of scores for possible combinations if all adjacent cells are empty.

        const enemy = player === 1 ? 2 : 1;
        let combinationScore = 0;
        // rows first
        // get most left col (max 3 steps away from move.col)
        let c = move.col;
        let steps = 3;
        while (c > 0 && steps > 0) {
            steps--;
            c--;
        }
        // now find permutations and add up scores. more positions filled = higher score.
        let rowScore = 0;
        for (let i = 0; i < 4; i++) {
            if (c + 3 <= this.ROWS && c <= move.col) {
                if (board[c][move.row] !== enemy && board[c + 1][move.row] !== enemy && board[c + 2][move.row] !== enemy && board[c + 3][move.row] !== enemy) {
                    rowScore += board[c][move.row] + board[c + 1][move.row] + board[c + 2][move.row] + board[c + 3][move.row];
                    // console.log([board[c][move.row], board[c + 1][move.row], board[c + 2][move.row], board[c + 3][move.row]]);
                }
            }
            c++;
        }

        // now columns....
        // get highest row (bottom of column is actually highest index in our setup) (max 3 steps away from move.row)
        let r = move.row;
        c = move.col; // reset c, so I don't have to write move.col a load of times!
        steps = 3;
        while (r < this.ROWS - 1 && steps > 0) {
            steps--;
            r++;
        }

        let colScore = 0;
        for (let i = 0; i < 4; i++) {
            if (r - 3 >= 0 && r >= move.row) {
                if (board[c][r] !== enemy && board[c][r - 1] !== enemy && board[c][r - 2] !== enemy && board[c][r - 3] !== enemy) {
                    colScore += board[c][r] + board[c][r - 1] + board[c][r - 2] + board[c][r - 3];
                }
            }
            r--;
        }

        // TODO - diagonal checks...
        combinationScore = rowScore + colScore;
        return combinationScore;
    }
}
