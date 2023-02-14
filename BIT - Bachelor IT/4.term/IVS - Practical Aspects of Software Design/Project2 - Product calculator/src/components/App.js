import './App.css';
import CalcInput from './CalcInput';
import Button from './Button';
import React from 'react';
import {expressionAnalyzer} from '../library/expressionAnalyzer';

/**
 * @class App
 * @Brief Top Class which encapsulate calculator
 */
class App extends React.Component {

  constructor(props) {
    super(props);
    

    document.addEventListener("keydown", this.HandleKeyDown, false);


    /**
     * Init default variables used in react
     */
    this.state = {
      input: "", /** Input for calc */
      topInput: "", /** Top label for result */
      answer: NaN /** Result */
    };

    this.appendToInput = this.appendToInput.bind(this);
  }

  /** This function replace input of user to calc
   * @param {*} event Clicked button
   * 
   */
  updateInput = event => {
    var input = event.target.value;
    input = input.replace('*', '×');
    input = input.replace(',', '.');
    input = input.replace('/', '÷');
    input = input.replace('\\sqrt', '√');
    input = input.replace('=','');

    this.setState({ input: input });
  }
  
  appendToInput = val => {
    this.setState({ input: this.state.input + val });
  }

  /**
   * @Brief Clear input of calc
   */
  clearInput = () => {
    this.setState({ input: "", topInput: "", answer: NaN});
  }

  /**
   * @Brief This function call expression analyzer and display result 
   */
  calculate = val => {    
    try {
      var result = expressionAnalyzer.GetResult(this.state.input);
      this.setState({ topInput: this.state.input +" = "+result });
      this.setState({ answer: result });
      
    }
    catch(err) {
      this.setState({ topInput: err });

    }
    finally{
      this.setState({ input: "" });
    }

  }

  /**
   * @Brief Append ans to input 
   */
  ansToInput = val => {
    if(!isNaN(this.state.answer)){
      this.setState({ input: this.state.input + this.state.answer });
    }
  }

  /**
   * @Brief Handle input and transform to command
   */
  HandleKeyDown = event => {
    var input = event.key;
    input = input.trim();
    input = input.toLowerCase();
    if(input === "delete"){
      this.clearInput();
    }
    else if (input === "enter" || input === "="){
      this.calculate();
    }
  }

  /**
   * @brief Render structure of calc
   */
  render(){
    return (
      <div className="App">
        <CalcInput input={this.state.input} topInput={this.state.topInput} handleOnChange = { this.updateInput } />
        <div className="buttons">
          <div className="row">
            <Button buttonText = "%" buttonTitle = "a%b - a modulo b" handleClick = {this.appendToInput}/>
            <Button buttonText = "(" handleClick = {this.appendToInput}/>
            <Button buttonText = ")" handleClick = {this.appendToInput}/>
            <Button buttonText = "C" buttonTitle = "clear result" handleClick = {this.clearInput} />
          </div>
          <div className="row">
            <Button buttonText = "!" buttonTitle = "a! - factorian of a" handleClick = {this.appendToInput}/>
            <Button buttonText = "√" buttonTitle = "a√b - a root from b" handleClick = {this.appendToInput}/>
            <Button buttonText = "^" buttonTitle = "a^b - a raised to b" handleClick = {this.appendToInput}/>
            <Button buttonText = "÷" buttonTitle = "a÷b - a divides by b" handleClick = {this.appendToInput}/>
          </div>
          <div className="row">
            <Button buttonText = "7" buttonTitle = "write 7" handleClick = {this.appendToInput}/>
            <Button buttonText = "8" buttonTitle = "write 8" handleClick = {this.appendToInput}/>
            <Button buttonText = "9" buttonTitle = "write 9" handleClick = {this.appendToInput}/>
            <Button buttonText = "×" buttonTitle = "a×b - a multiply by b" handleClick = {this.appendToInput}/>
          </div>
          <div className="row">
            <Button buttonText = "4" buttonTitle = "write 4" handleClick = {this.appendToInput}/>
            <Button buttonText = "5" buttonTitle = "write 5" handleClick = {this.appendToInput}/>
            <Button buttonText = "6" buttonTitle = "write 6" handleClick = {this.appendToInput}/>
            <Button buttonText = "-" buttonTitle = "a-b - a subtract b" handleClick = {this.appendToInput}/>
          </div>
          <div className="row">
            <Button buttonText = "1" buttonTitle = "write 1" handleClick = {this.appendToInput}/>
            <Button buttonText = "2" buttonTitle = "write 2" handleClick = {this.appendToInput}/>
            <Button buttonText = "3" buttonTitle = "write 3" handleClick = {this.appendToInput}/>
            <Button buttonText = "+" buttonTitle = "a+b - a add b" handleClick = {this.appendToInput}/>
          </div>
          <div className="row">
            <Button buttonText = "Ans" buttonTitle = "write last result" handleClick = {this.ansToInput}/>
            <Button buttonText = "0" buttonTitle = "write 0" handleClick = {this.appendToInput}/>
            <Button buttonText = "." buttonTitle = "write decimal separator" handleClick = {this.appendToInput}/>
            <Button buttonText = "=" buttonTitle = "calculate" handleClick = {this.calculate}/>
          </div>
        </div>
      </div>
    );
  }
 
}

export default App;
