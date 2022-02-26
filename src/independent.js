import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {SingleSlide} from './single';
export class IndependentPicker extends PureComponent {
  constructor(props) {
    super(props);
    const [defaultIndexArray, resultArray] = this.getDefaultValue();
    this.resultArray = resultArray;
    this.state = {
      resultIndexArray: defaultIndexArray,
    };
  }

  componentDidMount() {
    this.props.setResult(this.resultArray);
  }

  getDefaultValue = () => {
    const {values, dataSource} = this.props;
    console.info('values', values);
    let defaultIndexArray = [];
    let resultArray = [];
    for (let i = 0; i < dataSource.length; i++) {
      const subList = dataSource[i];
      let targetIndex = 0;
      if (values[i] && values[i].id) {
        targetIndex = subList.findIndex((item) => item.id == values[i].id);
      }
      resultArray[i] = subList[targetIndex];
      defaultIndexArray[i] = targetIndex;
    }
    console.info('defaultIndexArray', defaultIndexArray);
    return [defaultIndexArray, resultArray];
  };

  _done = (dataindex, parindex) => {
    const {dataSource, onceChange} = this.props;
    this.resultArray[parindex] = dataSource[parindex][dataindex];
    this.props.setResult(this.resultArray);
    onceChange && onceChange();
    const newIndexArray = this.state.resultIndexArray.slice();
    newIndexArray[parindex] = dataindex;
    this.setState({resultIndexArray: newIndexArray});
  };

  render() {
    const {dataSource, pickerStyle} = this.props;
    const {resultIndexArray} = this.state;
    return (
      <View style={sts.all}>
        {dataSource.map((list, index) => (
          <SingleSlide
            list={list}
            key={index}
            inparindex={index}
            done={this._done}
            defaultIndex={resultIndexArray[index]}
            {...pickerStyle}
          />
        ))}
      </View>
    );
  }
}
const sts = StyleSheet.create({
  all: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
