import { LightningElement } from 'lwc';
import congratsImg from '@salesforce/resourceUrl/congrats1'; 

export default class TicTacToe extends LightningElement {

    turn = 'X'
    isXturn = true
    isGameOn = true
    isGameOver = false
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
    X_Points = 0
    O_Points = 0

    // change to next turn value
    changeTurn(){
        this.turn = this.turn === "X" ? "O" : "X";
    }

    // add border bottom color for X-turn
    get displayBottomColorForXTurn(){
        return this.turn === "X" ? "borderBottomColor pointsTable" : "pointsTable";
    }
    // add border bottom color for O-turn
    get displayBottomColorForOTurn(){
        return this.turn === "O" ? "borderBottomColor pointsTable" : "pointsTable";
    }

    handleBoxClick(event){
        this.isGameOn = false;
        // Current box id
        let boxId = event.currentTarget.getAttribute("data-Id");
        // Below action only for empty box and GameOver is false
        if(!this.template.querySelector('[data-id='+boxId+']').textContent
            && !this.isGameOver){
                // Display Turn Value inside box
                this.template.querySelector('[data-id='+boxId+']').textContent = this.turn;
                // add CSS to turn color based on X/O
                this.template.querySelector('[data-id='+boxId+']').classList.add(this.turn+'-turn-color')
                // Check for winning Combination
                this.checkWinner();
                // Change turn value 
                this.changeTurn();
                // Avoid adding CSS for Next turn without onclick
                this.template.querySelector('[data-id='+boxId+']').classList.remove(this.turn+'-turn-color')
                // to avoid showing Next trun after Game Over
                if(!this.isGameOver){
                    // checkDrawMatch
                    this.checkDrawMatch();
                    this.template.querySelector('[data-id=player-turn-text]').textContent = this.turn+' turn';
                    // this.template.querySelector('[data-id=won-img]').classList.add('addWidth')
                }
        }
    }
    
    // Check for winning Combination
    checkWinner(){
        this.winCombination.forEach(element => {
            if(this.template.querySelector('[data-id=box-'+element[0]+']').textContent
                && this.template.querySelector('[data-id=box-'+element[1]+']').textContent
                && this.template.querySelector('[data-id=box-'+element[2]+']').textContent
                && (this.template.querySelector('[data-id=box-'+element[0]+']').textContent == this.template.querySelector('[data-id=box-'+element[1]+']').textContent)
                && (this.template.querySelector('[data-id=box-'+element[1]+']').textContent == this.template.querySelector('[data-id=box-'+element[2]+']').textContent)){
                    // Game Over true
                    this.isGameOver = true;
                    // Remove player-won value text
                    this.template.querySelector('[data-id=player-won]').textContent = this.turn;
                    // Remove Next turn value text
                    this.template.querySelector('[data-id=player-turn-text]').textContent = '';
                    // add pulse CSS to highligh matched turn
                    this.addPulseCssForMatchedPath(element);
                    // Update players Score
                    this.updatePoints();
                    
            }
        });
    }

    addPulseCssForMatchedPath(element){
        this.template.querySelector('[data-id=box-'+element[0]+']').classList.add('boxPulse');
        this.template.querySelector('[data-id=box-'+element[1]+']').classList.add('boxPulse');
        this.template.querySelector('[data-id=box-'+element[2]+']').classList.add('boxPulse');
    }

    updatePoints(){
        this.X_Points = this.turn === 'X' ? this.X_Points + 1 : this.X_Points;
        this.O_Points = this.turn === 'O' ? this.O_Points + 1 : this.O_Points;
    }

    checkDrawMatch(){
        // for (let index = 0; index < 9; index++) {
        //     // check all boxes are filled
        //     this.template.querySelector('[data-id=box-'+index+']').textContent = '';
        // }
    }

    handleRestart(){
        this.isLoading = true;
        this.isGameOver = false;
        // Remove player-won value text
        this.template.querySelector('[data-id=player-won]').textContent = '';
        // Remove Next turn value text
        this.template.querySelector('[data-id=player-turn-text]').textContent = this.turn+' turn';
        for (let index = 0; index < 9; index++) {
            // Remove X / O value from all boxes
            this.template.querySelector('[data-id=box-'+index+']').textContent = '';
            // Remove Pulse CSS from all boxes
            this.template.querySelector('[data-id=box-'+index+']').classList.remove('boxPulse');
        }
        this.isLoading = false;
    }
    
}