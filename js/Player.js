
/**
* Class Player
*/
class Player{
	#name;
    #board;

    constructor(config){
		this.name=config.name;
        this.board = config.board;
        this.avatar = config.avatar;
    }

//#region getters and setters

    /**
    * Getter for this.#name
    * @returns {string} this.#name
    */
    get name(){
        return this.#name;
    }

    /**
    * Setter for this.#name
    * @param {string} name
    */
    set name(name){
        this.#name=name;
    }


    /**
    * Getter for this.#board
    * @returns {Array<PasaPalabraQuestion>} this.#board
    */
    get board(){
        return this.#board;
    }

    /**
    * Setter for this.#board
    * @param {Object<board>} board
    */
    set board(board){
        this.#board=board;
    }

//#endregion

}

    



