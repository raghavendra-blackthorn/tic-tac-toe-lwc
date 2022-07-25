import { LightningElement } from 'lwc';
// Resource-Image
import congratsImg from '@salesforce/resourceUrl/congrats_img'; 
import AstroImg from '@salesforce/resourceUrl/Astro_img';
import Xicon from '@salesforce/resourceUrl/X_icon';  
import Oicon from '@salesforce/resourceUrl/O_icon';
// Resource-Track
import turnChangeTrack from '@salesforce/resourceUrl/turn_change_track';
import winnerTrack from '@salesforce/resourceUrl/winner_track';
import restartTrack from '@salesforce/resourceUrl/restart_track'; 

export default class TicTacToe extends LightningElement {
    
    // default turn 
    turn = 'X'
    // show/hide Start Game text
    isGameOn = false
    // game over bool
    isGameOver = false
    // turn winning combination & line angle 
    winCombination = [// rows
                        [0, 1, 2, 3, 5, 0],
                        [3, 4, 5, 3, 14, 0],                       
                        [6, 7, 8, 3, 23, 0],
                        // columns
                        [0, 3, 6, -6, 14, 90],
                        [1, 4, 7, 3.3, 14, 90],
                        [2, 5, 8, 12.6, 14, 90],
                        // diagonal
                        [0, 4, 8, 3.6, 14, 45],
                        [2, 4, 6, 3.6, 14, -45]]
    // options
    options = [{ label: 'Level 0: Play against a Friend', value: 'Friend' },
                { label: 'Level 1: Easy', value: 'CPU_Easy' },
                { label: 'Level 2: unbeatable', value: 'CPU_Hard' }
                ]
    level = 'CPU_Easy';
    // play with computer
    computerturn = false
    filledbox = []
    remainingbox = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    // img
    congrats_img = congratsImg
    Astro_img = AstroImg
    X_icon = Xicon
    O_icon = Oicon
    //track
    turn_change_track = turnChangeTrack;
    winner_track = winnerTrack;
    restart_track = restartTrack;
    muted = false
    // spinner
    isLoading = false
    // points
    X_Points = 0
    O_Points = 0

    // change to next turn value
    swapTurn(){
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

    // Shuffle Mute and unMute
    handleMute(){
        this.muted = !this.muted;
    }

    connectedCallback(){
        // check play against value
        this.computerturn = this.level.includes('CPU') ? true : false;
    }

    // Play Against Combox handleChange
    handleChangeLevel(event){
        this.level = event.detail.value;
        this.connectedCallback();
        this.X_Points = this.O_Points = 0;
        this.muted = true;
        this.handleRestart();
        this.muted = false;
    }

    get getleveldescription(){
        return this.level == 'CPU_Easy' ? 'Computer is bumb' : this.level == 'CPU_Hard' ? 'Unbeatable Computer' : 'Enjoy the party with your friend';
    }

    // handleClick on turn change
    handleBoxClick(event){
        this.isGameOn = true;
        // Current box id
        let boxId = event.currentTarget.getAttribute("data-Id");
        let boxindex =  parseInt(boxId.split('-')[1]);
        // Below action only for empty box and GameOver is false
        if(this.getGameStatus(boxindex)){
            // computer turn if this.level.includes('CPU')
            this.computerturn = true;
            this.displayTurnVal(boxindex);
        }
    }

    // Check for game not over and already filled boxes 
    getGameStatus(boxindex){
        if(!this.template.querySelector('[data-id=box-'+boxindex+']').innerHTML
            && !this.isGameOver
            || (this.level.includes('CPU')
            && !this.computerturn
            && !this.template.querySelector('[data-id=box-'+boxindex+']').innerHTML)){
                return true;
            }else{
                return false;
            } 
    }

    displayTurnVal(boxindex){
        // Display Turn Value inside box
        let displayTurnImg = this.turn === 'X' ? this.X_icon : this.O_icon;
        // text in a span
        // this.template.querySelector('[data-id=box-'+boxindex+']').textContent = this.turn;
        // image in a span
        this.template.querySelector('[data-id=box-'+boxindex+']').innerHTML = "<img src="+displayTurnImg+" class="+this.turn+">";
        // add CSS to turn color based on X/O
        this.template.querySelector('[data-id=box-'+boxindex+']').classList.add(this.turn+'-turn-color')
        // Check for winning Combination
        this.checkWinner();
        // Change turn value 
        this.swapTurn();
        // Avoid adding CSS for Next turn without onclick
        this.template.querySelector('[data-id=box-'+boxindex+']').classList.remove(this.turn+'-turn-color')
        // to avoid showing Next trun after Game Over
        if(!this.isGameOver){
            // play sound on each turn 
            this.playTrack(this.turn_change_track);
            // Next turn value on screen
            this.template.querySelector('[data-id=player-turn-text]').textContent = this.turn+' turn';
            // checkDrawMatch
            this.checkDrawMatch();
            // this.template.querySelector('[data-id=won-img]').classList.add('addWidth')
            // CPU turn
            if(this.level.includes('CPU')
                && this.computerturn){
                    this.isLoading = true;
                    this.computerTurn(boxindex);
            }
        }
    }

    edgemoves = [1, 3, 5, 7]
    cornermoves = [0, 2, 6, 8]
    centermove = [4]

    // Computer turn for Easy and Hard level
    computerTurn(boxindex){
        // not to make computer turn until next manual turn
        this.computerturn = false;
        setTimeout(() => {
            // player edge move make cpu move adjacent to it 
            if(this.level.includes('Hard')){
                if(this.edgemoves.includes(boxindex)){
                    switch(boxindex){
                        case 1:
                            this.displayTurnVal(0); 
                            break;
                        case 3:
                        case 7:
                            this.displayTurnVal(6);
                            break;
                        case 5:
                            this.displayTurnVal(2); 
                            break;
                    }
                }
                // player corner move make cpu move center
                else if(this.cornermoves.includes(boxindex)){
                    this.displayTurnVal(4); 
                }
                // player center move make cpu move corner
                else if(this.centermove == boxindex){
                    let cornerbox = this.getRandomIndex(this.cornermoves);
                    this.displayTurnVal(cornerbox); 
                }
            }else{
                this.filledbox.push(boxindex);
                // remove manually filled box index from remainingbox array
                this.getRemainingBoxIndex(boxindex);
                console.log('filledbox: ', this.filledbox); 
                // get random index for computer turn
                boxindex = this.getRandomIndex(this.remainingbox);
                console.log('boxindex: ', boxindex); 
                // remove CPU filled box index from remainingbox array
                this.getRemainingBoxIndex(boxindex);
                console.log('remainingbox: ', this.remainingbox); 
                // Call displayTurnVal method to select Next turn 
                this.displayTurnVal(boxindex); 
            }
        }, 500);
        this.isLoading = false;
    }

    // get remaining empty box index values
    getRemainingBoxIndex(boxindex){
        const index = this.remainingbox.indexOf(boxindex);
        if (index > -1) {
            this.remainingbox.splice(index, 1); 
        }
    }

    // get a random index from an remainingbox array
    getRandomIndex(remainingbox) {
        const randomboxIndex = Math.floor(Math.random() * remainingbox.length);
        const indexval = remainingbox[randomboxIndex];
        return indexval;
    }
    
    // Check for winning Combination
    checkWinner(){
        var winnotfound = true;
        this.winCombination.forEach(e => {
            if(winnotfound && this.template.querySelector('[data-id=box-'+e[0]+']').innerHTML
                && this.template.querySelector('[data-id=box-'+e[1]+']').innerHTML
                && this.template.querySelector('[data-id=box-'+e[2]+']').innerHTML
                && (this.template.querySelector('[data-id=box-'+e[0]+']').innerHTML == this.template.querySelector('[data-id=box-'+e[1]+']').innerHTML)
                && (this.template.querySelector('[data-id=box-'+e[1]+']').innerHTML == this.template.querySelector('[data-id=box-'+e[2]+']').innerHTML)){
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
                    // this.displayCrossLine(e);
                    // Update players Score
                    this.updatePoints();
                    // play winner sound track
                    this.playTrack(this.winner_track);
                    winnotfound = false
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
        var draw = 0
        this.template.querySelectorAll('.box').forEach(element => {
            if(element.innerHTML) draw++;
        });
        if(draw == 9){
            // Remove Next turn value text
            this.template.querySelector('[data-id=player-turn-text]').textContent = '';
            this.template.querySelector('[data-id=player-won]').textContent = 'Draw';
        }
    }

    // handle Restart on "Restart Game" and "Play Against" 
    handleRestart(){
        this.isLoading = true;
        this.isGameOver = false;
        this.turn = 'X';
        this.filledbox = [];
        this.remainingbox = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        // Play restart track
        this.playTrack(this.restart_track);
        // Remove player-won value text
        this.template.querySelector('[data-id=player-won]').textContent = '';
        // Remove Next turn value text
        this.template.querySelector('[data-id=player-turn-text]').textContent = this.turn+' turn';
        // hide congrats img
        this.template.querySelector('[class=congratsImg]').style.width = `0`;
        // hide cross line
        // this.template.querySelector('[class=crossline]').style.width = `0`;
        for (let index = 0; index < 9; index++) {
            // Remove X / O value from all boxes
            this.template.querySelector('[data-id=box-'+index+']').textContent = '';
            // Remove Pulse CSS from all boxes
            this.template.querySelector('[data-id=box-'+index+']').classList.remove('boxPulse');
        }
        this.isLoading = false;
    }

    // Play track sound
    playTrack(trackValue){
        this.muted ? '' :  new Audio(trackValue).play();
    }
    
}