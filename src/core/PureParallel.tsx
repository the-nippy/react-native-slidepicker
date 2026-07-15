import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Wheel from './Wheel';
import Header from './Header';

interface IParallelState {
  checkedIndexMarks: number[];
}

class PureParallel extends Component<TSlidePickerType, IParallelState> {
  static defaultProps: TSlidePickerType;
  wheelRefs: any[];

  constructor(props: TSlidePickerType) {
    super(props);
    const {wheels} = this.props;
    const initialCheckMarks = new Array(wheels).fill(0);
    this.state = {checkedIndexMarks: initialCheckMarks};
    this.wheelRefs = initialCheckMarks.map(() => React.createRef());
  }

  componentDidMount(): void {
    const {values, wheels} = this.props;
    if (values && values.length === wheels) {
      const initialCheckedIndexMarks = this.getCheckMarksByValues();
      this.setState({checkedIndexMarks: initialCheckedIndexMarks}, () => {
        this.wheelRefs.forEach((ele, i) => {
          ele?.current?.manualSetChecked(initialCheckedIndexMarks[i], false);
        });
      });
    }
  }

  setCheckMark = (locationMark: number, checkedIndex: number) => {
    const indexMarks = [...this.state.checkedIndexMarks];
    indexMarks[locationMark] = checkedIndex;
    this.setState({checkedIndexMarks: indexMarks});
  };

  getValuesByCheckMarks = () => {
    const {dataSource} = this.props;
    const result = [];
    for (let i = 0; i < dataSource.length; i++) {
      const checkedIndex = this.state.checkedIndexMarks[i];
      const element = (dataSource as TParallelItemsProps)[i][checkedIndex];
      result.push(element);
    }
    return result;
  };

  getCheckMarksByValues = () => {
    const {values, dataSource} = this.props;
    const initialCheckedIndexMarks = [];
    for (let i = 0; i < values.length; i++) {
      const element = values[i];
      const wheelItems = (dataSource as TParallelItemsProps)[i];
      const findIndex = wheelItems.findIndex(
        ele => ele?.value === element?.value,
      );
      initialCheckedIndexMarks.push(findIndex >= 0 ? findIndex : 0);
    }
    return initialCheckedIndexMarks;
  };

  onConfirmClickProxy = () => {
    const {onConfirmClick} = this.props;
    const result = this.getValuesByCheckMarks();
    onConfirmClick && onConfirmClick(result);
  };

  // ref method for parent component to get the selected values
  _getValues = () => this.getValuesByCheckMarks();

  render() {
    const {wheels, dataSource, ...restProps} = this.props;

    return (
      <View>
        <Header {...this.props} onConfirmClick={this.onConfirmClickProxy} />
        <View style={styles.lists}>
          {new Array(wheels).fill(1).map((_, i) => {
            return (
              <Wheel
                key={i}
                ref={this.wheelRefs[i]}
                wheelItems={(dataSource as TParallelItemsProps)[i] || []}
                rowLocationMark={i}
                setCheckMark={this.setCheckMark}
                {...restProps}
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
  dataSource: [],
  itemHeight: 50,
  values: [],
};

const styles = StyleSheet.create({
  lists: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PureParallel;
