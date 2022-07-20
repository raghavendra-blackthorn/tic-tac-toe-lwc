import { LightningElement } from 'lwc';
import congratsImg from '@salesforce/resourceUrl/congrats1'; 
import AstroImg from '@salesforce/resourceUrl/Astro_img'; 

export default class TicTacToe extends LightningElement {
    
    turn = 'X'
    isXturn = true
    isGameOn = true
    isGameOver = false
    winCombination = [[0, 1, 2, 3, 5, 0],
                        [3, 4, 5, 3, 14, 0],                       
                        [6, 7, 8, 3, 23, 0],
                        [0, 3, 6, -6, 14, 90],
                        [1, 4, 7, 3.3, 14, 90],
                        [2, 5, 8, 12.6, 14, 90],
                        [0, 4, 8, 3.6, 14, 45],
                        [2, 4, 6, 3.6, 14, -45]]
    options = [{ label: 'Friend', value: 'Friend' },
                { label: 'Computer', value: 'Computer' }]
    playAgainst = 'Computer';
    congrats = congratsImg
    Astro_img = AstroImg
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

    handleChangePlayAgainst(event){
        this.playAgainst = event.detail.value;
        this.handleRestart();
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
        this.winCombination.forEach(e => {
            if(this.template.querySelector('[data-id=box-'+e[0]+']').textContent
                && this.template.querySelector('[data-id=box-'+e[1]+']').textContent
                && this.template.querySelector('[data-id=box-'+e[2]+']').textContent
                && (this.template.querySelector('[data-id=box-'+e[0]+']').textContent == this.template.querySelector('[data-id=box-'+e[1]+']').textContent)
                && (this.template.querySelector('[data-id=box-'+e[1]+']').textContent == this.template.querySelector('[data-id=box-'+e[2]+']').textContent)){
                    // Game Over true
                    this.isGameOver = true;
                    // Remove player-won value text
                    this.template.querySelector('[data-id=player-won]').textContent = this.turn;
                    // Remove Next turn value text
                    this.template.querySelector('[data-id=player-turn-text]').textContent = '';
                    // add pulse CSS to highligh matched turn
                    this.addPulseCssForMatchedPath(e);
                    //Congrats Img
                    this.displayCongratsImg();
                    // add CSS to cross line 
                    this.displayCrossLine(e);
                    // Update players Score
                    this.updatePoints();
                    
            }
        });
    }

    addPulseCssForMatchedPath(e){
        this.template.querySelector('[data-id=box-'+e[0]+']').classList.add('boxPulse');
        this.template.querySelector('[data-id=box-'+e[1]+']').classList.add('boxPulse');
        this.template.querySelector('[data-id=box-'+e[2]+']').classList.add('boxPulse');
    }

    displayCongratsImg(){
        this.template.querySelector('[class=congratsImg]').style.width = `300px`;
    }

    displayCrossLine(e){
        this.template.querySelector('[class=crossline]').style.width = `15rem`;
        this.template.querySelector('[class=crossline]').style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`;
        // this.template.querySelector('[class=line]').classList.add(this.turn+'-turn-line-color');
    }

    updatePoints(){
        this.X_Points = this.turn === 'X' ? this.X_Points + 1 : this.X_Points;
        this.O_Points = this.turn === 'O' ? this.O_Points + 1 : this.O_Points;
    }

    checkDrawMatch(){
        // for (let index = 0; index < 9; index++) {
        //     // check all boxes are filled
        //     if(this.template.querySelector('[data-id=box-'+index+']').textContent){
        //         console.log();
        //     }
        // }
        // if(){

        // }
    }

    handleRestart(){
        this.isLoading = true;
        this.isGameOver = false;
        // Remove player-won value text
        this.template.querySelector('[data-id=player-won]').textContent = '';
        // Remove Next turn value text
        this.template.querySelector('[data-id=player-turn-text]').textContent = this.turn+' turn';
        // hide congrats img
        this.template.querySelector('[class=congratsImg]').style.width = `0`;
        // hide cross line
        this.template.querySelector('[class=crossline]').style.width = `0`;
        for (let index = 0; index < 9; index++) {
            // Remove X / O value from all boxes
            this.template.querySelector('[data-id=box-'+index+']').textContent = '';
            // Remove Pulse CSS from all boxes
            this.template.querySelector('[data-id=box-'+index+']').classList.remove('boxPulse');
        }
        this.isLoading = false;
    }
    
}