import {WithHeadAndMethod} from './src/hoc';
import {IndependentPicker} from './src/independent';
import {RelativedPicker} from './src/related';

export const ParallelPicker = WithHeadAndMethod(IndependentPicker);
export const CascadePicker = WithHeadAndMethod(RelativedPicker);
