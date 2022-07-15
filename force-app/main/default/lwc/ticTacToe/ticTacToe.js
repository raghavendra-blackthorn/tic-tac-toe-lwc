import { LightningElement } from 'lwc';

export default class TicTacToe extends LightningElement {

    turn = 'X'
    isXturn = true

    changeTurn(){
        this.turn = this.turn === "X" ? "O" : "X";
    }

    onclick(){
        let music = new Audio('turn.mp3')
    }

    handleGameBoxClick(){
        console.log('handleGameBoxClick: ');
        let boxes = document.getElementsByClassName("gameArea");
        console.log('boxes: ',boxes);
        Array.from(boxes).forEach(element => {
            console.log('element: ',element);
            let box = element.querySelector('.box');
            console.log('box: ',box);
        });
    }

    handleBoxClick(event){
        let boxId = event.currentTarget.getAttribute("data-Id");
        if(!this.template.querySelector('[data-id='+boxId+']').textContent){
            this.template.querySelector('[data-id='+boxId+']').textContent = this.turn;
            this.changeTurn();
            this.template.querySelector('[data-id=player-turn-text]').textContent = this.turn+' turn';
        }
    }

    handleRestart(){
        
    }
    
}