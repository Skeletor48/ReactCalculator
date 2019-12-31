import React from 'react';
import { evaluate } from 'mathjs';

import * as api from '../../api/api';

import Screen from './Screen/Screen';
import Keypad from './Keypad/Keypad';

const buttonMap = {
  0: { type: 'digit' },
  1: { type: 'digit' },
  2: { type: 'digit' },
  3: { type: 'digit' },
  4: { type: 'digit' },
  5: { type: 'digit' },
  6: { type: 'digit' },
  7: { type: 'digit' },
  8: { type: 'digit' },
  9: { type: 'digit' },
  '.': { type: 'operator' },
  '-': { type: 'operator' },
  '+': { type: 'operator' },
  '/': { type: 'operator' },
  '*': { type: 'operator' },
  '=': { type: 'action', handler: '_evaluateEquation' },
  'AC': { type: 'action', handler: '_clearAll' },
  '←': { type: 'action', handler: '_clear' },
  'M+': { type: 'action', handler: 'writeMemory' },
  'M-': { type: 'action', handler: 'readMemory' },
}

class Calculator extends React.Component {
  state = {
    equation: '',
    previousPress: null,
    total: 0,
    isMemoryFree: null
  }

  async componentDidMount() {
    /* On mount we check our server if it has already a stored number in memory. 
    Based on this value we set our state. This will be important to highlight on the 
    keypad if we have a stored number or not  */
    const storedNumber = await this.readMemory(false);
    /*The base value is 0 in our memory, also we set the value to zero as 'reset' so 0 in the memory store 
    means the memory is free to use*/
    const isMemoryFree = storedNumber === 0;
    this.setState({ isMemoryFree });
  }

  onButtonPress = event => {
    const pressedButton = event.target.innerHTML;
    this._handleInput(pressedButton);
  }

  _handleInput(pressedButton) {
    const currentEquation = this.state.equation;
    const inputArray = [currentEquation];
    const buttonType = buttonMap[pressedButton].type;

    switch (buttonType) {
      case 'action':
        return this._handleActionInput(pressedButton);
      case 'operator':
        const operatorInput = this._handleOperatorInput(pressedButton, buttonType);
        inputArray.push(operatorInput);
        break;
      default:
        const digitInput = this._handleDigitInput(pressedButton, buttonType);
        inputArray.push(digitInput);
        break;
    }
    this._refreshState(inputArray, pressedButton);
  }

  _refreshState(inputArray, pressedButton) {
    const equationString = this._formatInput(inputArray);
    this.setState({ equation: equationString, previousPress: pressedButton });
  }

  _formatInput(inputArray) {
    const inputString = this._getInputString(inputArray);
    /*regexp to handle the trailing 0s but we do not want to get rid of the 0s AFTER the decimal point hence he check*/
    let regexp = this._removeWhitespace(inputString).includes('.0') ? '' : /\b0+\B/mg;

    return inputString.replace(regexp, "")
  }

  _getInputString(array) {
    return array.join('').toString();
  }

  _removeWhitespace(string) {
    return string.toString().replace(/\s+/g, '')
  }

  _isDecimalDotAllowed() {    
    /*Transform the current equation string to an array of the inputed characters
      In the reversed array we have the user inputs in reversed order. What we are looking for is
      if we have already pushed an operator button other than the decimal dot or not.
      If so, we check its index if it is pressed before or after the decimal.
      Eg:
      Case A,
      we press the '.' so we check if it is allowed
      currentEquation = '0.5+0' 
      reversedInputs = '0', '+', '5', '.', '0'
    
      index of the not dot operator (+,-,*,/) is smaller than the dot operator's index 
      so it is clear that we want to insert our new dot to our consecutive number in the equation.

      Case B,
      we press the '.' so we check if it is allowed
      currentEquation = '0.5+0.3' 
      reversedInputs = '3', '.', '0', +', '5', '.', '0'

      index of the not dot operator (+,-,*,/) is higher than the dot operator's index 
      so it is clear that we want to insert our new dot to a number that already has a dot in it.
    */
    const currentEquation = this._removeWhitespace(this.state.equation);
    if (!currentEquation.includes('.')) return true;

    const currentInputs = currentEquation.split('');
    const reversedInputs = currentInputs.reverse();
    const notDotOperator = reversedInputs.find((input) => {
      return buttonMap[input].type === 'operator' && input !== '.';
    });

    return notDotOperator ? reversedInputs.indexOf(notDotOperator) < reversedInputs.indexOf('.') : false;
  }

  _isOperatorTypeAllowed(pressedButton) {
    const previousPress = this.state.previousPress;
    const currentEquation = this._removeWhitespace(this.state.equation);

    if (currentEquation.length < 1) {
      /* Let user inpuit '-' as first input, to generate negative number, 
      but otherwise we do not want trailing unnecessary operators  */
      return pressedButton === '-';
    }

    const currentInputs = currentEquation.split('');
    const lastInput = currentInputs.pop();
    /* Memory reading is the only evengt that adds a number to our equation string but without a digit type press */
    return buttonMap[lastInput].type === 'digit' || previousPress === 'M-';
  }

  _handleActionInput(pressedButton) {
    this.setState({ previousPress: pressedButton });
    const handlerMethod = buttonMap[pressedButton].handler;
    return this[handlerMethod](this.state);
  }

  _handleDigitInput(pressedButton) {
    return parseFloat(pressedButton);
  }

  _handleOperatorInput(pressedButton) {
    if (pressedButton === '.' && !this._isDecimalDotAllowed()) return ''

    return this._isOperatorTypeAllowed(pressedButton) ? ` ${pressedButton} ` : '';
  }

  _evaluateEquation({ equation }) {
    try {
      /* using mathJS here */
      const evalResult = evaluate(this._removeWhitespace(equation));
      const total = Number.isInteger(evalResult) ? evalResult : parseFloat(evalResult.toFixed(4)).toString()
      this.setState({ total, equation: ' ' });
    } catch (error) {
      alert('Invalid Mathematical Equation');
    }
  }

  _clear() {
    let equation = this.state.equation;
    equation = equation.trim();
    equation = equation.substr(0, equation.length - 1);
    this.setState({ equation });
  }

  _clearAll() {
    this.setState({ equation: '', total: 0 });
  }

  async writeMemory() {
    const numberToStore = this.state.total
    const response = await api.writeMemory(numberToStore).catch(error => {throw error});
    const isMemoryFree = (response.success && (!numberToStore || numberToStore === 0));

    this.setState({ isMemoryFree });
    console.log(response);
  }

  async readMemory(setState = true) {
    const numberStore = await api.readMemory().catch(error => {throw error});
    if (setState && numberStore.memory) this.setState({ equation: numberStore.memory });
    console.log(numberStore.memory);
    return numberStore.memory;
  }

  render() {
    return (
      <main className="calculator">
        <Screen equation={this.state.equation} total={this.state.total} />
        <Keypad onButtonPress={this.onButtonPress} isMemoryFree={this.state.isMemoryFree} />
      </main>
    );
  }
}

export default Calculator;
