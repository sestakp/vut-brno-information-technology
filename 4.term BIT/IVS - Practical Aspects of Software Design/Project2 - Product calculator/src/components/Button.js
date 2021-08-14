import React from 'react';
import './Button.css';

/**
 * @class Button
 * @Brief this class represent one button of calculator
 */
class Button extends React.Component{
    
    constructor(props){
        super(props);
        this.buttonText = props.buttonText;
        this.buttonTitle = props.buttonTitle;
    }
    
    render() {

        var Classes = "Button";
        
        return (
                <button className={Classes} type="button" title={this.buttonTitle} onClick={() => this.props.handleClick(this.buttonText)}>{this.buttonText}</button>
          );
    }

}
  
export default Button;