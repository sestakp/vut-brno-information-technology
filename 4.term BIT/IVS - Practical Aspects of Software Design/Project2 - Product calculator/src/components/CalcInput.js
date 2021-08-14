import React from 'react';
import './CalcInput.css';

/**
 * @class CalcInput
 * @Brief this class represent Input for calculator
 */
class CalcInput extends React.Component {
    
    render(){
        
        return (
            <div className="CalcInput">
                <input readOnly="True" value={this.props.topInput}></input>
                <input value={this.props.input} onChange={this.props.handleOnChange} autoFocus></input>
            </div>
          );
    }    
  }
  
  export default CalcInput;