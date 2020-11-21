/*
 * @Author: xuxiaowei
 * @Date: 2020-11-04 12:24:42
 * @LastEditTime: 2020-11-21 17:36:11
 * @LastEditors: xuwei
 * @Description:
 */
import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SingleSlide } from "./single";

const INIT = [];

export class RelativedPicker extends PureComponent {
  static defaultProps = {
    dataSource: [], //data
    onceChange: (arr) => {}, // once change callback
    confirm: (arr) => {}, //confirm  send data back
    cancel: () => {},
    customHead: null,
    pickerStyle: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      level1List: INIT,
      level2List: null,
      level3List: null,
    };
    this.result = [];
  }

  componentDidMount() {
    const { dataSource } = this.props;
    if (!dataSource || !this.props.dataSource.length) {
      console.warn("SlidePicker: dataSource should be a array");
      return;
    } else {
      this.splitData(dataSource);
    }
  }

  /** START props function ------------------------------*/
  onceDataChange = () =>
    this.props.onceChange && this.props.onceChange(this.result);

  confirm = () => this.props.confirm && this.props.confirm(this.result);

  cancel = () => this.props.cancel && this.props.cancel();

  // called by ref
  getResult = () => this.result;
  /**  props  -----------------------------------END */

  /** START init update  ----------------------------------*/
  splitData = (pros) => {
    const level1List = pros.map(this.fliterProperty);
    this.setState({ level1List });
    this.setL2List(0);
  };

  // update Level2
  setL2List = (initIndex) => {
    this.level2Ref && this.level2Ref.resetTrans();
    const pros = this.props.dataSource;
    const L1Target = pros[initIndex];
    this.addToLocal(L1Target, 0);
    if (L1Target && L1Target.list) {
      const l2List = L1Target.list;
      const level2List = l2List.map((item) => ({
        id: item.id,
        name: item.name,
        list: item.list,
      }));
      this.setState({ level2List }, () => this.setL3List(0));
    } else {
      this.addToLocal({}, 1);
      this.addToLocal({}, 2);
      this.setState({ level2List: [], level3List: [] });
    }
  };

  // update Level3
  setL3List = (initIndex) => {
    this.level3Ref && this.level3Ref.resetTrans();
    const level2List = this.state.level2List;
    const L2Target = level2List[initIndex];
    this.addToLocal(L2Target, 1);

    if (L2Target && L2Target.list) {
      const l3List = L2Target.list;
      const list = l3List.map(this.fliterProperty);
      this.setState({ level3List: list });
      this.addToLocal(list[0], 2);
    } else {
      this.addToLocal({}, 2);
      this.setState({ level3List: null });
    }
  };

  fliterProperty = (item) => ({
    id: item.id,
    name: item.name,
  });

  /**  init update  ---------------------------------- END */

  // add to this.result   /level index from zero
  addToLocal = (todoItem, level) => {
    const temp = { ...todoItem };
    delete temp.list;
    this.result[level] = temp;
    this.onceDataChange();
  };

  /** START after choose ---------------------------------*/

  doneL1 = (proIndex) => {
    const target = this.state.level1List[proIndex];
    this.setL2List(proIndex);
    this.addToLocal(target, 0);
  };

  doneL2 = (cityIndex) => {
    const target = this.state.level2List[cityIndex];
    this.setL3List(cityIndex);
    this.addToLocal(target, 1);
  };

  doneL3 = (areaIndex) => {
    const target = this.state.level3List[areaIndex];
    this.addToLocal(target, 2);
  };

  /**  after choose ---------------------------------  END*/

  setLv1Ref = (prosref) => (this.level1Ref = prosref);
  setLv2Ref = (cityref) => (this.level2Ref = cityref);
  setL3Ref = (arearef) => (this.level3Ref = arearef);

  renderHead = () => {
    if (this.props.customHead) {
      return this.props.customHead;
    } else {
      return (
        <View style={sts.btns}>
          <TouchableOpacity style={sts.btn} onPress={this.cancel}>
            <Text style={sts.btn_text}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={sts.btn} onPress={this.confirm}>
            <Text style={sts.btn_text}>Confirm</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={sts.com}>
        {/* <View style={sts.rest} /> */}
        {this.renderHead()}
        <View style={sts.all}>
          <SingleSlide
            list={this.state.level1List}
            done={this.doneL1}
            ref={this.setLv1Ref}
            {...this.props.pickerStyle}
          />
          {this.state.level2List && (
            <SingleSlide
              list={this.state.level2List}
              done={this.doneL2}
              ref={this.setLv2Ref}
              {...this.props.pickerStyle}
            />
          )}
          {this.state.level3List && (
            <SingleSlide
              list={this.state.level3List}
              done={this.doneL3}
              ref={this.setL3Ref}
              {...this.props.pickerStyle}
            />
          )}
        </View>
      </View>
    );
  }
}

export class IndependentPicker extends PureComponent {
  static defaultProps = {
    dataSource: [], //data
    onceChange: (arr) => {}, // once change callback
    confirm: (arr) => {}, //confirm  send data back
    cancel: () => {},
  };

  constructor(props) {
    super(props);
    this.result = [];
    this.initData();
  }

  initData = () => {
    const { dataSource } = this.props;
    dataSource.forEach((element, index) => {
      this.result[index] = element[0];
    });
  };

  componentDidMount() {
    const { onceChange } = this.props;
    onceChange && onceChange(this.result);
  }

  done = (dataindex, parindex) => {
    const { dataSource, onceChange } = this.props;
    const list = dataSource[parindex];
    const data = list[dataindex];
    this.result[parindex] = data;
    // console.info('data', data);
    onceChange && onceChange(this.result);
  };

  confirm = () => this.props.confirm && this.props.confirm(this.result);
  cancel = () => this.props.cancel && this.props.cancel();

  getResult = () => this.result;

  renderHead = () => {
    if (this.props.customHead) {
      return this.props.customHead;
    } else {
      return (
        <View style={sts.btns}>
          <TouchableOpacity style={sts.btn} onPress={this.cancel}>
            <Text style={sts.btn_text}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={sts.btn} onPress={this.confirm}>
            <Text style={sts.btn_text}>Confirm</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    const { dataSource, pickerStyle } = this.props;
    return (
      <View style={sts.com}>
        {/* <View style={sts.rest} /> */}
        {this.renderHead()}
        <View style={sts.all}>
          {dataSource.map((list, index) => (
            <SingleSlide
              list={list}
              key={index}
              inparindex={index}
              done={this.done}
              {...pickerStyle}
            />
          ))}
        </View>
      </View>
    );
  }
}

const sts = StyleSheet.create({
  com: {
    // backgroundColor:'#00a'
    // flex: 1, paddingTop: 20
  },
  rest: { flex: 1, backgroundColor: "#fff" },
  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    // backgroundColor: "#888",
    // backgroundColor: "#a00",
  },
  btn: {
    // backgroundColor: '#a00',
    padding: 15,
  },
  btn_text: { fontSize: 18, color: "#4169E1" },
  all: {
    flexDirection: "row",
    backgroundColor: "#a00",
    overflow: "hidden",
  },
});
