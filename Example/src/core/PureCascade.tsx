import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Wheel from './Wheel';
import Header from './Header';

interface IParallelState {
  checkedIndexMarks: number[];
}

class PureCascade extends Component<SlidePickerType, IParallelState> {
  static defaultProps: SlidePickerType;
  setMarkTimer: ReturnType<typeof setTimeout> | null;
  cacheMarks: number[];
  wheelRefs: any[];

  constructor(props: any) {
    super(props);
    const {wheels} = this.props;
    const checkedMarks = new Array(wheels).fill(0);
    this.state = {checkedIndexMarks: checkedMarks};
    this.setMarkTimer = null;
    this.cacheMarks = checkedMarks;
    this.wheelRefs = checkedMarks.map(() => React.createRef());
  }

  componentDidMount(): void {
    const {values, wheels} = this.props;
    if (values && values.length === wheels) {
      const initialCheckedIndexMarks = this.getCheckMarksByValues();
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
    const {wheels} = this.props;
    this.cacheMarks[locationMark] = checkedIndex;
    this.setMarkTimer && clearTimeout(this.setMarkTimer);
    this.setMarkTimer = setTimeout(() => {
      const targetMarks = [...this.cacheMarks];
      if (locationMark !== wheels - 1) {
        targetMarks.fill(0, locationMark + 1);
      }
      this.setState({checkedIndexMarks: targetMarks});
      if (locationMark !== wheels - 1) {
        const refs = this.wheelRefs.slice(locationMark + 1);
        refs.forEach(ele => ele?.current?.manualSetChecked(0, true));
      }
    }, 200);
  };

  getValuesByCheckMarks = () => {
    const {wheels, data} = this.props;
    const result = [];
    let temp = data as ICascadeItemsProps;
    for (let i = 0; i < wheels; i++) {
      const checkedIndex = this.state.checkedIndexMarks[i];
      const wheelData = {...temp[checkedIndex]};
      if (wheelData) {
        temp = wheelData.options || [];
        delete wheelData.options;
        result.push(wheelData);
      }
    }
    return result;
  };

  getCheckMarksByValues = () => {
    const {values, data} = this.props;
    const initialCheckedIndexMarks = [];
    let temp = data as ICascadeItemsProps;
    for (let i = 0; i < values.length; i++) {
      const element = values[i];
      if (temp && temp.length > 0) {
        // console.info('[temp]', JSON.stringify(temp));
        const index = temp.findIndex(ele => ele.value === element.value);
        initialCheckedIndexMarks.push(index);
        temp = temp[index].options || [];
      }
    }
    return initialCheckedIndexMarks;
  };

  onConfirmClickProxy = () => {
    const {onConfirmClick} = this.props;
    const result = this.getValuesByCheckMarks();
    onConfirmClick && onConfirmClick(result);
  };

  // ref
  _getValues = () => this.getValuesByCheckMarks();

  getWheelItemsData = () => {
    const {data, wheels} = this.props;
    const {checkedIndexMarks} = this.state;
    let temp = data;
    const AllWheelItems = [temp];
    for (let index = 0; index < wheels; index++) {
      temp = (temp?.[checkedIndexMarks[index]] as IWheelItemProps)
        ?.options as IWheelItemProps[];
      AllWheelItems.push(temp);
    }
    return AllWheelItems as IWheelItemProps[][];
  };

  render() {
    const {wheels} = this.props;

    const AllWheelItems = this.getWheelItemsData();

    return (
      <View>
        <Header {...this.props} onConfirmClick={this.onConfirmClickProxy} />
        <View style={styles.lists}>
          {new Array(wheels).fill(1).map((wheel, i) => {
            return (
              <Wheel
                key={i}
                ref={this.wheelRefs[i]}
                wheelItems={AllWheelItems[i]}
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

PureCascade.defaultProps = {
  visible: false,
  wheels: 2,
  checkRange: 3,
  data: [],
  itemHeight: 50,
  values: [],
};

const styles = StyleSheet.create({
  lists: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PureCascade;
