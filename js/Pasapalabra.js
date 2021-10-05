
/**
* Class PasaPalabra
*/
class PasaPalabra{
	#players;
    #currentPlayer;


    constructor(config){

        this.#players=[];
        let questionsSets = QuestionsLib.getNSets(config.players.length);

        if(questionsSets.length<config.players.length){
            config.players.length = questionsSets.length;
        }

        this.createGeneralBoard(config.players);

        for (let i = 0; i < config.players.length; i++) {
            config.players[i].board = new QuestionsBoard({
                time:config.time,
                accents: config.accents||false,
                questions:questionsSets[i],
                parent:document.body.querySelector(`#${config.players[i].name}_cell`),
                parentActive: document.body.getElementsByClassName('activePlayer')[0],
                playerAvatar: config.players[i].avatar
            });
             
            this.#players.push(new Player(config.players[i]));
        }
               
        this.#currentPlayer=0;  
        
        document.body.addEventListener('endGame', (function (e) { 
            this.currentPlayer.board.desactivate();
            this.endGame(); 
        }).bind(this), false);
        document.body.addEventListener('pasapalabra', (function (e) { 
            this.currentPlayer.board.desactivate();
            if(this.nextPlayer()){
                this.currentPlayer.board.activate();
            }else{
                this.endGame();
            }            
        }).bind(this), false);       

    }

//#region getters and setters

    /**
    * Getter for this.#players
    * @returns {Array<PasaPalabraPlayer>} this.#players
    */
    get players(){
        return this.#players;
    }

    /**
    * Setter for this.#players
    * @param {Array<PasaPalabraPlayer} players
    */
    set players(players){
        this.#players=players;
    }


    /**
    * Getter for this.#currentPlayer
    * @returns {Player} this.#currentPlayer
    */
    get currentPlayer(){
        return this.players[this.#currentPlayer];
    }

    /**
    * Setter for this.#currentPlayer
    * @param {Number} currentPlayer
    */
    set currentPlayer(currentPlayer){
        this.#currentPlayer=currentPlayer;
    }


//#endregion


    /**
     * Returns true if the game is finished
     * @returns {Boolean}
     */
    isGameEnded(){
        return ((this.players.filter(player=>!player.board.isFinished()).length === 0) ||
                (this.players.filter(player=>player.board.fullRight()).length > 0));
    }

    /**
     * Push into currentPlayer the next player with unanswered questions
     */
    nextPlayer(){ 
        if(!this.isGameEnded()){         
            do{
                this.currentPlayer=(this.#currentPlayer+1)%this.players.length;                            
            }while(this.currentPlayer.board.isFinished());
        }else{
            return null;
        }
        return this.currentPlayer;             
    }

    endGame(){
        this.saveScore();     //Add the current scores to the already saved 
        let data = this.players.map(player=>{
            return [player.name,player.board.score()]
        }).sort((a,b)=>b[1]-a[1]);        
        PasaPalabra.showRanking(data,()=>{
            PasaPalabra.showRanking(PasaPalabra.ranking(),()=>{
                window.location.reload();
            },'Ranking General');
        },'Resultado');
        
    }

    /**
     * Starts the game and controls the turns. It's called for every question.
     */
    init(){ 
        this.currentPlayer.board.activate();
    }

    /**
     * Saves the scores of the players into localStorage
     */
    saveScore(){                
        let scores = localStorage.getItem('scores')||'{}';
        scores = JSON.parse(scores);

        this.players.forEach(player=> {
            scores[player.name] = scores[player.name]?scores[player.name]+player.board.score():player.board.score();
        }); 

        localStorage.setItem('scores',JSON.stringify(scores));       
    }

    

    /**
     * Resturns a string with the general ranking of the players
     * @returns {string} 
     */
    static ranking(){
        let scores = localStorage.getItem('scores')||'{}';
        scores = JSON.parse(scores);

        scores = Object.entries(scores);
        scores.sort((a,b)=>b[1]-a[1]);
        
        return scores;        
    }

    static showRanking(data,callback,title){        
        let node = document.getElementsByClassName('generalRanking')[0];
        node.addEventListener('click',()=>{
            node.style.display = 'none';
            callback();
        });

        let rows = '';
        data.forEach(score=>{                
            rows+=(`<li><h2>${score[0]}</h2><h2>${score[1]}</h2></li>`);           
        });

        node.getElementsByTagName('h1')[0].innerText = title;
        node.getElementsByTagName('ul')[0].innerHTML = rows;
        node.style.display = 'flex';
    } 

    
    createGeneralBoard(players){
        let inactivePlayers = document.body.getElementsByClassName('inactivePlayers')[0];

        players.forEach(player=>{
            player.cell = document.createElement('div');
            player.cell.id = `${player.name}_cell`;         
        });

        inactivePlayers.append(...players.map(player=>{return player.cell})); 
        
    }    
}