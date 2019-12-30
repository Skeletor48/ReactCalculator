import React from 'react';

import TotalScreen from './TotalScreen/TotalScreen';
import ComputationScreen from './ComputationScreen/ComputationScreen';

const screen = (props) => (
  <section className="screen">
  <TotalScreen>{props.total}</TotalScreen>
  <ComputationScreen>{props.equation}</ComputationScreen>
  </section>
);

export default screen;
