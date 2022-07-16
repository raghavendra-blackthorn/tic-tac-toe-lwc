import { LightningElement, track } from 'lwc';
import congratsImg from '@salesforce/resourceUrl/congrats1'; 

export default class TicTacToe extends LightningElement {

    turn = 'X'
    isXturn = true
    isGameOn = true
    @track isGameOver = false
    winCombination = [[0, 1, 2],
                        [3, 4, 5],
                        [6, 7, 8],
                        [0, 3, 6],
                        [1, 4, 7],
                        [2, 5, 8],
                        [0, 4, 8],
                        [2, 4, 6]]
    congrats = congratsImg;
    isLoading = false

    changeTurn(){
        this.turn = this.turn === "X" ? "O" : "X";
    }

    handleBoxClick(event){
        this.isGameOn = false;
        let boxId = event.currentTarget.getAttribute("data-Id");
        if(!this.template.querySelector('[data-id='+boxId+']').textContent
            && !this.isGameOver){
                this.template.querySelector('[data-id='+boxId+']').textContent = this.turn;
                this.checkWinner(this.turn);
                this.changeTurn();
                // to avoid showing Next trun after Game Over
                if(!this.isGameOver){
                    this.template.querySelector('[data-id=player-turn-text]').textContent = this.turn+' turn';
                }
        }
    }

    checkWinner(turnVal){
        this.winCombination.forEach(element => {
            if(this.isTurnMatch(element[0], turnVal) 
                && this.isTurnMatch(element[1], turnVal) 
                && this.isTurnMatch(element[2], turnVal)){
                    this.isGameOver = true;
                    this.template.querySelector('[data-id=player-won]').textContent = this.turn+' Won';
                    this.template.querySelector('[data-id=player-turn-text]').textContent = '';
            }
        });
    }

    isTurnMatch(boxIndex, turnVal){
        if(this.template.querySelector('[data-id=box-'+boxIndex+']').textContent
            && this.template.querySelector('[data-id=box-'+boxIndex+']').textContent == turnVal){
                return true;
        }else{
            return false;
        }
    }

    handleRestart(){
        this.isLoading = true;
        this.isGameOver = false;
        this.template.querySelector('[data-id=player-won]').textContent = '';
        this.template.querySelector('[data-id=player-turn-text]').textContent = this.turn+' turn';
        for (let index = 0; index < 9; index++) {
            this.template.querySelector('[data-id=box-'+index+']').textContent = '';
        }
        this.isLoading = false;
    }
    
}