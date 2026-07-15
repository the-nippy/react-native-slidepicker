import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Wheel from './Wheel';
import Header from './Header';

interface ICascadeState {
  checkedIndexMarks: number[];
  wheelItemsData: TWheelItemProps[][];
}

class PureCascade extends Component<TSlidePickerType, ICascadeState> {
  static defaultProps: TSlidePickerType;
  setMarkTimer: ReturnType<typeof setTimeout> | null;
  cacheMarks: number[];
  wheelRefs: any[];

  constructor(props: TSlidePickerType) {
    super(props);
    const {wheels} = this.props;
    const checkedMarks = new Array(wheels).fill(0);
    const wheelItemsData = this.getWheelItemsDataByMarks(checkedMarks);
    this.state = {checkedIndexMarks: checkedMarks, wheelItemsData};
    this.setMarkTimer = null;
    this.cacheMarks = checkedMarks;
    this.wheelRefs = checkedMarks.map(() => React.createRef());
  }

  componentDidMount(): void {
    const {values, wheels} = this.props;
    if (values && values.length === wheels) {
      const initialCheckedIndexMarks = this.getCheckMarksByValues();
      const wheelItemsData = this.getWheelItemsDataByMarks(initialCheckedIndexMarks);
      this.setState(
        {
          checkedIndexMarks: initialCheckedIndexMarks,
          wheelItemsData,
        },
        () => {
          this.wheelRefs.forEach((ele, i) => {
            ele.current.manualSetChecked(initialCheckedIndexMarks[i], false);
          });
        },
      );
    }
  }

  componentDidUpdate(prevProps: Readonly<TSlidePickerType>): void {
    if (prevProps.dataSource !== this.props.dataSource) {
      const wheelItemsData = this.getWheelItemsDataByMarks(
        this.state.checkedIndexMarks,
      );
      this.setState({wheelItemsData});
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
      const wheelItemsData = this.getWheelItemsDataByMarks(targetMarks);
      this.setState({checkedIndexMarks: targetMarks, wheelItemsData});
      if (locationMark !== wheels - 1) {
        const refs = this.wheelRefs.slice(locationMark + 1);
        refs.forEach(ele => ele?.current?.manualSetChecked(0, true));
      }
    }, 200);
  };

  getValuesByCheckMarks = () => {
    const {wheels, dataSource} = this.props;
    const result = [];
    let temp = dataSource as TCascadeItemsProps;
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
    const {values, dataSource} = this.props;
    const initialCheckedIndexMarks = [];
    let temp = dataSource as TCascadeItemsProps;
    for (let i = 0; i < values.length; i++) {
      const element = values[i];
      if (temp && temp.length > 0) {
        const index = temp.findIndex(ele => ele.value === element.value);
        if (index < 0) {
          break;
        }
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

  _getValues = () => this.getValuesByCheckMarks();

  getWheelItemsDataByMarks = (marks: number[]) => {
    const {dataSource, wheels = 0} = this.props;
    let temp = dataSource;
    const AllWheelItems = [temp] as TWheelItemProps[][];
    for (let index = 0; index < wheels; index++) {
      const next = (temp?.[marks[index]] as TWheelItemProps | undefined)
        ?.options as TWheelItemProps[] | undefined;
      temp = next as TCascadeItemsProps;
      AllWheelItems.push(temp as TWheelItemProps[]);
    }
    return AllWheelItems;
  };

  render() {
    const {wheels, ...restProps} = this.props;
    const {wheelItemsData} = this.state;

    return (
      <View>
        <Header {...this.props} onConfirmClick={this.onConfirmClickProxy} />
        <View style={styles.lists}>
          {new Array(wheels).fill(1).map((_, i) => {
            return (
              <Wheel
                key={i}
                ref={this.wheelRefs[i]}
                wheelItems={wheelItemsData[i]}
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

PureCascade.defaultProps = {
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

export default PureCascade;
