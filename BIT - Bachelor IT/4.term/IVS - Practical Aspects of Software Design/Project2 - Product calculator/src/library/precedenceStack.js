/*******************************************************************
* Project Name: ReactCalculator
*******************************************************************/
/**
* @file precedenceStack.js
*
* @brief Stack for precedence analytics
*
* @author Lukáš Plevač (lukasplevac)
*/

/**
 * @brief object for precedence stack
 * @namespace precedenceStack
 */
export function precedenceStack() {
    this._stack = [];
    this._precedences = [];
    
    //constants for tokens
    this.e_token = { type: "T_E", value: undefined };
    this.eof_token = { type: "T_EOF", value: undefined };
}

/**
 * @brief function Push() push item to stack and add precedence (<) before it 
 * @param item Item to push (object with .type)
 * @returns null
 */
precedenceStack.prototype.Push = function(item) {

    this._precedences.push(this._Last_terminal_pos() + 1);
    this._stack.push(item);
}

/**
 * @brief function Push() push item to stack but not add precedence (<) before it 
 * @param item Item to push (object with .type)
 * @returns null
 */
precedenceStack.prototype.Push_no_precedence = function(item) {
    this._stack.push(item);
}


/**
 * @brief function Reduce() remove all from top to last precedence (<) and push E on top
 * @param value mixed value of reduced part
 * @returns number of removed items (int)
 */
precedenceStack.prototype.Reduce = function(value) {
    if (this._precedences.length === 0) {
        return 0;
    }

    var pops_count = this._stack.length - this._precedences[this._precedences.length - 1];
    for (var i = 0; i <  pops_count; i++) {
        this._stack.pop();
    }

    this.e_token.value = value;

    var tok = Object.assign({}, this.e_token);
    this._stack.push(tok);
    this._precedences.pop();

    return pops_count;
}

/**
 * @brief function _Last_terminal_pos() return index of first item from top where type != "T_E"
 * @returns int
 */
precedenceStack.prototype._Last_terminal_pos = function() {
    
    for (var i = this._stack.length - 1; i >= 0; i--) {
        if (this._stack[i].type !== "T_E") {
            return i;
        }
    }

    //EOF ($) is terminal
    return -1;
}

/**
 * @brief function Last_terminal() return first item from top where type != "T_E"
 * @returns item from stack (object with .type) 
 */
precedenceStack.prototype.Last_terminal = function() {
    
    var index = this._Last_terminal_pos();

    if (index  < 0) {
        return this.eof_token;
    }

    return this._stack[index];
}

/**
 * @brief function _Last_precedence_pos() return index of first precedence from top
 * @returns int position in stack, if not exist return 0
 */
precedenceStack.prototype._Last_precedence_pos = function() {
    if (this._precedences.length === 0) {
        return -1;
    }

    return this._precedences[this._precedences.length - 1];
}

/**
 * @brief function Compare_part() array of items from top to last_precedence, if precedence not exist return -1
 * @returns array of items from top to last_precedence, if precedence not exist return -1
 */
precedenceStack.prototype.Compare_part = function() {

    var precedence_pos = this._Last_precedence_pos() ;
    if (precedence_pos === -1) {
        return false;
    }

    var output = [];

    for (var i = precedence_pos; i < this._stack.length; i++) {
        output.push(this._stack[i]);
    }

    return output;
}



/*  END OF precedenceStack.js   */