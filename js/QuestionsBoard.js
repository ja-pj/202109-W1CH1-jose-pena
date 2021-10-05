
/**
* Class QuestionsBoard
*/
class QuestionsBoard{
    #questions;
    #currentQuestion;
    #currentAnswer;
    #accents
    #node; 
    #timer;
    #parent
    #parentActive

    #eventEnd;
    #eventPasapalabra;

    constructor(config){

        this.#accents = config.accents||false;

        this.questions=[];        
        config.questions.forEach(question => {
            this.questions.push(new Question(question));
        });

        this.currentQuestion=0;

        this.node = this.#createNode();
        if(this.node.avatar){
            this.node.avatar.innerHTML = config.playerAvatar;
        }

        this.#timer = new Timer(config.time,1,_=>{
            this.node.time.innerText = this.timer.currentTime;//.toFixed(1);
        },_=>{
            document.body.dispatchEvent(this.#eventPasapalabra);
        });

        this.updateScore();
        this.updateTime();
        this.node.question.innerHTML = this.currentQuestion.question;

        

        this.#eventEnd = new Event('endGame');
        this.#eventPasapalabra = new Event('pasapalabra');

        this.#parent = config.parent?config.parent:document.body;
        this.#parentActive = config.parentActive?config.parentActive:this.#parent;
        
        if(config.parent) config.parent.append(this.node.main);
    }

//#region getters and setters

   
    /**
    * Getter for this.#questions
    * @returns {Array<PasaPalabraQuestion>} this.#questions
    */
    get questions(){
        return this.#questions;
    }

    /**
    * Setter for this.#questions
    * @param {Array<PasaPalabraQuestion>} questions
    */
    set questions(questions){
        this.#questions=questions;
    }


    /**
    * Getter for this.#currentQuestion
    * @returns {PasaPalabraQuestion} this.#currentQuestion
    */
    get currentQuestion(){
        return this.questions[this.#currentQuestion];
    }

    /**
    * Setter for this.#currentQuestion
    * @param {Number} currentQuestion
    */
    set currentQuestion(currentQuestion){
        this.#currentQuestion=currentQuestion;
    }


    /**
    * Getter for this.#timer
    * @returns {Object<Timer>} this.#timer
    */
    get timer(){
        return this.#timer;
    }
    

    /**
    * Getter for this.#node
    * @returns {Object} this.#node
    */
     get node(){
        return this.#node;
    }
    
    /**
    * Setter for this.#node
    * @param {Object} node
    */
    set node(node){
        this.#node=node;
    }    
    
    /**
    * Getter for this.#currentAnswer
    * @returns {string} this.#currentAnswer
    */
     get currentAnswer(){
        return this.#currentAnswer;
    }
    
    /**
    * Setter for this.#currentAnswer
    * @param {string} currentAnswer
    */
    set currentAnswer(currentAnswer){
        this.#currentAnswer=currentAnswer;
    }
    

//#endregion

    /**
     * Gets the number of unanswered questions
     * @returns {Number}
     */
     unanswered(){
        return this.questions.filter(questions=>questions.state === 'UNANSWERED').length;
    }

    /**
     * Gets the number of right answered questions
     * @returns {Number}
     */
    right(){
        return this.questions.filter(questions=>questions.state === 'RIGHT').length;
    }

    /**
     * Gets the number of wrong answered questions
     * @returns {Number}
     */
    wrong(){
        return this.questions.filter(questions=>questions.state === 'WRONG').length;
    }

    /**
     * Tells if all the questions have been answered right
     * @returns {boolean}
     */
    fullRight(){
        return this.right() === this.questions.length;
    }

    /**
     * Returns true if the player has finished his game,
     *  answering all the questions or running out of time
     * @returns {Boolean}
     */
     isFinished(){
        return (this.unanswered() === 0) || (this.timer.currentTime<=0);
    }

    /**
     * Updates currentCuestion with the next unanswered question and returns it,
     *  or null if there are no more unanswered questions.
     * @returns {Question|null}
     */
    nextQuestion(){
        this.currentQuestion.desactivate();
        if(!this.isFinished()){
            do{
                this.currentQuestion=(this.#currentQuestion+1)%this.questions.length;
            }while(this.currentQuestion.state !== 'UNANSWERED');
        }else{
            return null;
        }
        this.currentQuestion.activate();
        this.node.question.innerHTML = this.currentQuestion.question;
        return this.currentQuestion;
    }

    /**
     * Updates time
     */
    updateTime(self=this){
        self.node.time.innerText = self.timer.currentTime;//.toFixed(1);
    }

    /**
     * Updates score
     */
    updateScore(){
        this.node.score.innerText = this.score();
        
    }

    /**
     * Returns the actual score of the player
     * 27*3 if fullright else rights-wrongs
     * if rights-wrongs < 0 then 0
     * @returns {Number}
     */
    score(){
        return this.fullRight()?27*3:(this.right()-this.wrong())<0?0:this.right()-this.wrong();
    } 

    maxPossibleScore(){
        return this.questions.length-this.wrong();
    }

    /**
     * Sets the player board to active
     */
    activate(){
        this.#parentActive.append(this.node.avatar, this.node.main);
        if((this.#parentActive.offsetWidth*0.8)>this.#parentActive.offsetHeight){
            this.node.main.style.width = (this.#parentActive.offsetHeight/(this.#parentActive.offsetWidth/100))+'%';
        }
        this.node.avatar.classList.add('active');
        this.node.main.classList.add('active');
        this.questions.forEach(question=>{
            question.resizeLetter();
        });
        this.node.time.style.fontSize = (.4*this.node.time.offsetWidth)+'px';
        this.node.score.style.fontSize = (.4*this.node.time.offsetWidth)+'px';
        this.currentQuestion.activate();
        this.timer.start();
        this.node.input.focus();
    }

    /**
     * Sets the player board to inactive
     */
    desactivate(){
        this.#parent.append(this.node.main);        
        this.node.main.append(this.node.avatar);
        this.node.main.style.width = 'inherit';
        this.currentQuestion.desactivate();
        this.node.main.classList.remove('active');
        this.node.avatar.classList.remove('active');
        this.questions.forEach(question=>{
            question.resizeLetter();
        });
        this.node.time.style.fontSize = (.4*this.node.time.offsetWidth)+'px';
        this.node.score.style.fontSize = (.4*this.node.time.offsetWidth)+'px';
    } 

     
    
    async showRightAnswer(){
        let promise = new Promise((resolve)=>{
            console.log('%cRight Answer is '+this.currentQuestion.answer,'color:red');
            this.node.answer.innerText = `La respuesta correcta era ${this.currentQuestion.answer}`;
            this.node.main.classList.add('showAnswer');
            setTimeout(() => {
                this.node.main.classList.remove('showAnswer');
                this.node.answer.innerText = '';
                resolve(resolve);
            }, 3000);
        });        
        return promise;
    }


    async onInput(node){
        let answer = this.currentQuestion.checkAnswer(node.input.value||node.input.placeholder,this.#accents);
        node.input.value = null;        
        
        if(answer === 'END'){
            document.body.dispatchEvent(this.#eventEnd);
        }else{
            this.updateScore();
            if(answer === 'WRONG'){
                await this.showRightAnswer();
            }
            if(!this.nextQuestion() || answer === 'WRONG' || answer === 'PASAPALABRA'){
                document.body.dispatchEvent(this.#eventPasapalabra);
            }else{
                this.timer.start();
            }
        }
        
    }


    /**
     * Creates an interface for the player
     * @returns {Object}
     */
    #createNode(parent=null){ 

        parent = parent||document.body;

        let node = {};
        node.main = document.createElement('div');
        node.main.classList.add('questionsBoard');
        node.main.innerHTML =   `<div class="playerAvatar"></div>
                                <div class="questionsWrapper"></div>
                                <div class="answer"></div>
                                <div class="score"></div>
                                <div class="timer"></div>                                
                                <div class="statsWrapper"> 
                                    <div class="currentQuestion">
                                        <p></p>
                                        <input placeholder="pasapalabra">
                                    </div>
                                </div>`;
        
        node.time = node.main.getElementsByClassName('timer')[0];
        node.question = node.main.querySelector('div.currentQuestion>p');
        node.score = node.main.getElementsByClassName('score')[0];
        node.answer = node.main.getElementsByClassName('answer')[0];
        node.avatar = node.main.getElementsByClassName('playerAvatar')[0];
        node.input = node.main.getElementsByTagName('input')[0];
        node.input.addEventListener('keydown', (e)=>{
            if(e.key === 'Enter' && this.timer.isRunning()){
                this.timer.stop();        
                this.onInput(node);
            }
        });
        node.main.getElementsByClassName('questionsWrapper')[0].append(...this.questions.map(question=>question.node));   
        
        return node;
    }

}

    



