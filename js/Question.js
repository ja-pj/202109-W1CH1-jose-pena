/**
* Class Question
*/
class Question{
	#letter;
    #answer;
    #question;
    #state;
    #node;


    constructor(question){
		this.letter=question.letter;
        this.answer=question.answer;
        this.question=question.question;
        this.node=this.#createNode();
        this.state='UNANSWERED';
    }

//#region getters and setters

    /**
    * Getter for this.#letter
    * @returns {string} this.#letter
    */
    get letter(){
        return this.#letter;
    }

    /**
    * Setter for this.#letter
    * @param {string} letter
    */
    set letter(letter){
        this.#letter=letter.toUpperCase();
    }


    /**
    * Getter for this.#answer
    * @returns {string} this.#answer
    */
    get answer(){
        return this.#answer;
    }

    /**
    * Setter for this.#answer
    * @param {string} answer
    */
    set answer(answer){
        this.#answer=answer.toUpperCase();
    }


    /**
    * Getter for this.#question
    * @returns {string} this.#question
    */
    get question(){
        //Controls the accentuated vocals
        let firstLetter = ['Á','É','Í','Ó','Ú'].indexOf(this.answer[0]);
        firstLetter = firstLetter>-1?['A','E','I','O','U'][firstLetter]:this.answer[0];

        return `${this.letter == firstLetter?"Con la ":"Contiene la "}${this.letter}:\n ${this.#question}`;
    }

    /**
    * Setter for this.#question
    * @param {string} question
    */
    set question(question){
        this.#question=question;
    }


    /**
    * Getter for this.#state
    * @returns {string} this.#state
    */
    get state(){
        return ['UNANSWERED','RIGHT','WRONG'][this.#state];
    }

    /**
    * Setter for this.#state
    * @param {string} state
    */
    set state(state){
        this.#state=['UNANSWERED','RIGHT','WRONG'].indexOf(state);
        this.node.classList.remove('unanswered','right','wrong');
        this.node.classList.add(this.state.toLowerCase());
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

//#endregion

    
    checkAnswer(answer,accents = false){
        if(!answer) return 'PASAPALABRA';
        answer = answer.toUpperCase();

        let rightAnswer = this.answer;
        if(accents){
            rightAnswer = this.answer.replace(/([ÁÉÍÓÚ])/g,(match)=>{
                return ['A','E','I','O','U'][['Á','É','Í','Ó','Ú'].indexOf(match)];
            });
            answer = answer.replace(/([ÁÉÍÓÚ])/g,(match)=>{
                return ['A','E','I','O','U'][['Á','É','Í','Ó','Ú'].indexOf(match)];
            });
        }
        
        if(rightAnswer === answer || answer === '1'){
            this.state = answer = 'RIGHT';
        }else if(answer !== 'END' && answer !== 'PASAPALABRA'){
            this.state = answer = 'WRONG';
        }
        return answer;
    }

    #createNode(){
        let node=document.createElement('div');
        node.classList.add('questionLetter');
        node.innerText = this.letter;
        return node;
    }

    resizeLetter(tam=.8){
        this.node.style.fontSize = (tam*this.node.offsetWidth)+'px';
    }

    activate(){
        this.node.classList.add('active');
    }

    desactivate(){
        this.node.classList.remove('active');
    }

}
