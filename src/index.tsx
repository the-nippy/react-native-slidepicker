import {withMask} from './core/mask';
import PureCascade from './core/PureCascade';
import PureParallel from './core/PureParallel';

const SlidePicker = {
  PureParallel: PureParallel,
  Parallel: withMask(PureParallel),
  PureCascade: PureCascade,
  Cascade: withMask(PureCascade),
};

export default SlidePicker;
