import React from 'react';
import renderer from 'react-test-renderer';

import Calculator from './Calculator';


describe('Calculator', () => {
  const calculator = new Calculator();
  
  describe('_isDecimalDotAllowed', () => {
    it('should allow using a new dot after a mathematical operation input', () => {
      calculator.state = { equation: '0.5+0' };
      const permissionToUseDot = calculator._isDecimalDotAllowed();
      expect(permissionToUseDot).toEqual(true);
    });
    it('should not allow using a new dot after an already inserted dot', () => {
      calculator.state = { equation: '0.5+0.2' };
      const permissionToUseDot = calculator._isDecimalDotAllowed();
      expect(permissionToUseDot).toEqual(false);
    });
    it('should allow using a new dot if there is none in the equation string', () => {
      calculator.state = { equation: '2222222222' };
      const permissionToUseDot = calculator._isDecimalDotAllowed();
      expect(permissionToUseDot).toEqual(true);
    });
  });

  describe('_isOperatorTypeAllowed', () => {
    it('should not allow operator type as first input except -', () => {
      calculator.state = { equation: '', previousPress:null };
      const calledWithAdd = calculator._isOperatorTypeAllowed('+');
      const calledWithMulti = calculator._isOperatorTypeAllowed('*');
      const calledWithDivi = calculator._isOperatorTypeAllowed('/');
      const calledWithDot = calculator._isOperatorTypeAllowed('.');
      const calledWithSub = calculator._isOperatorTypeAllowed('-');
      expect(calledWithAdd).toEqual(false);
      expect(calledWithMulti).toEqual(false);
      expect(calledWithDivi).toEqual(false);
      expect(calledWithDot).toEqual(false);
      expect(calledWithSub).toEqual(true);
    });
    it('should not allow operator type after an operator type', () => {
      calculator.state = { equation: '999*', previousPress:'*' };
      const calledWithAdd = calculator._isOperatorTypeAllowed('+');
      const calledWithMulti = calculator._isOperatorTypeAllowed('*');
      const calledWithDivi = calculator._isOperatorTypeAllowed('/');
      const calledWithDot = calculator._isOperatorTypeAllowed('.');
      const calledWithSub = calculator._isOperatorTypeAllowed('-');
      expect(calledWithAdd).toEqual(false);
      expect(calledWithMulti).toEqual(false);
      expect(calledWithDivi).toEqual(false);
      expect(calledWithDot).toEqual(false);
      expect(calledWithSub).toEqual(false);
    });
    it('should allow operator type after a memory read ', () => {
      calculator.state = { equation: '999', previousPress:'M-' };
      const calledWithAdd = calculator._isOperatorTypeAllowed('+');
      const calledWithMulti = calculator._isOperatorTypeAllowed('*');
      const calledWithDivi = calculator._isOperatorTypeAllowed('/');
      const calledWithDot = calculator._isOperatorTypeAllowed('.');
      const calledWithSub = calculator._isOperatorTypeAllowed('-');
      expect(calledWithAdd).toEqual(true);
      expect(calledWithMulti).toEqual(true);
      expect(calledWithDivi).toEqual(true);
      expect(calledWithDot).toEqual(true);
      expect(calledWithSub).toEqual(true);
    });
    it('should allow operator type after a digit type', () => {
      calculator.state = { equation: '999', previousPress:'9' };
      const calledWithAdd = calculator._isOperatorTypeAllowed('+');
      const calledWithMulti = calculator._isOperatorTypeAllowed('*');
      const calledWithDivi = calculator._isOperatorTypeAllowed('/');
      const calledWithDot = calculator._isOperatorTypeAllowed('.');
      const calledWithSub = calculator._isOperatorTypeAllowed('-');
      expect(calledWithAdd).toEqual(true);
      expect(calledWithMulti).toEqual(true);
      expect(calledWithDivi).toEqual(true);
      expect(calledWithDot).toEqual(true);
      expect(calledWithSub).toEqual(true);
    });
  });
});