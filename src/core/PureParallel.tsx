import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Wheel from './Wheel';
import ParallelTestData from '../test_data/parallel.json';
import Header from './Header';

interface IParallelState {
  checkedIndexMarks: number[];
}

class PureParallel extends Component<SlidePickerType, IParallelState> {
  static defaultProps: SlidePickerType;
  setMarkTimer: ReturnType<typeof setTimeout> | null;
  // cacheMarks: number[];
  wheelRefs: any[];

  constructor(props: any) {
    super(props);
    const {wheels} = this.props;
    const initialCheckMarks = new Array(wheels).fill(0);
    this.state = {checkedIndexMarks: initialCheckMarks};
    this.setMarkTimer = null;
    // this.cacheMarks = new Array(wheels).fill(0);
    this.wheelRefs = initialCheckMarks.map(() => React.createRef());
  }

  componentDidMount(): void {
    const {value, wheels} = this.props;
    if (value && value.length === wheels) {
      const initialCheckedIndexMarks = this.getCheckMarksByValue();
      this.setState({checkedIndexMarks: initialCheckedIndexMarks}, () => {
        this.wheelRefs.forEach((ele, i) => {
          ele.current.manualSetChecked(initialCheckedIndexMarks[i], false);
        });
      });
    }
  }

  componentWillUnmount(): void {
    this.setMarkTimer && clearTimeout(this.setMarkTimer);
  }

  setCheckMark = (locationMark: number, checkedIndex: number) => {
    const indexMarks = [...this.state.checkedIndexMarks];
    indexMarks[locationMark] = checkedIndex;
    this.setState({checkedIndexMarks: indexMarks});
  };

  // setCheckMark = (locationMark: number, checkedIndex: number) => {
  //   this.cacheMarks[locationMark] = checkedIndex;
  //   this.setMarkTimer && clearTimeout(this.setMarkTimer);
  //   this.setMarkTimer = setTimeout(() => {
  //     this.setState({checkedIndexMarks: [...this.cacheMarks]});
  //   }, 200);
  // };

  onConfirmClickProxy = () => {
    const {onConfirmClick, data} = this.props;
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const checkedIndex = this.state.checkedIndexMarks[i];
      const element = (data as IParallelItemsProps)[i][checkedIndex];
      result.push(element);
    }
    onConfirmClick && onConfirmClick(result);
  };

  getCheckMarksByValue = () => {
    const {value, data} = this.props;
    const initialCheckedIndexMarks = [];
    for (let i = 0; i < value.length; i++) {
      const element = value[i];
      const wheelItems = (data as IParallelItemsProps)[i];
      const findIndex = wheelItems.findIndex(ele => ele?.id === element?.id);
      initialCheckedIndexMarks.push(findIndex >= 0 ? findIndex : 0);
    }
    return initialCheckedIndexMarks;
  };

  render() {
    const {wheels, data} = this.props;

    return (
      <View>
        <Header {...this.props} onConfirmClick={this.onConfirmClickProxy} />
        <View style={styles.lists}>
          {new Array(wheels).fill(1).map((wheel, i) => {
            return (
              <Wheel
                key={i}
                ref={this.wheelRefs[i]}
                wheelItems={(data as IParallelItemsProps)[i]}
                rowLocationMark={i}
                setCheckMark={this.setCheckMark}
                {...this.props}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

PureParallel.defaultProps = {
  visible: false,
  wheels: 2,
  checkRange: 3,
  data: ParallelTestData,
  itemHeight: 50,
  value: [],
};

const styles = StyleSheet.create({
  lists: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PureParallel;
