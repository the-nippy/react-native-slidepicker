/*
 * @Author: xuxiaowei
 * @Date: 2020-11-04 12:24:42
 * @LastEditTime: 2020-11-08 18:30:10
 * @LastEditors: xuwei
 * @Description:
 */
import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import provinceMap from './province.json';
import { SingleSlide } from "./single";

const INIT = [];

export class RelativedPicker extends PureComponent {
  static defaultProps = {
    dataSource: [], //data
    onceChange: (arr) => {}, // once change callback
    confirm: (arr) => {}, //confirm  send data back
    cancel: () => {},
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
  /**  props  -----------------------------------END */

  /** START init update  ----------------------------------*/
  splitData = (pros) => {
    const level1List = pros.map(this.fliterProperty);
    this.setState({ level1List });
    this.setL2List(level1List[0].id);
  };

  // update Level2
  setL2List = (proId) => {
    this.level2Ref && this.level2Ref.resetTrans();
    const pros = this.props.dataSource;
    const L1Target = pros.find((pro) => pro.id === proId);
    this.addToLocal(L1Target, 0);

    if (L1Target && L1Target.list) {
      const l2List = L1Target.list;
      const level2List = l2List.map((item) => ({
        id: item.id,
        // pid: item.pid,
        name: item.name,
        list: item.list,
      }));
      this.setState({ level2List }, () => this.setL3List(level2List[0].id));
    }
  };

  // update Level3
  setL3List = (cityId) => {
    this.level3Ref && this.level3Ref.resetTrans();
    const level2List = this.state.level2List;
    const L2Target = level2List.find((item) => item.id === cityId);
    this.addToLocal(L2Target, 1);

    if (L2Target && L2Target.list) {
      const l3List = L2Target.list;
      const list = l3List.map(this.fliterProperty);
      this.setState({ level3List: list });
      this.addToLocal(list[0], 2);
    }
  };

  fliterProperty = (item) => ({
    id: item.id,
    name: item.name,
  });

  /**  init update  ---------------------------------- END */

  // add to this.result   /level index from zero
  addToLocal = (todoItem, level) => {
    const { list, ...final } = todoItem;
    this.result[level] = final;
    // console.info('result', this.result);
    this.onceDataChange();
  };

  /** START after choose ---------------------------------*/

  doneL1 = (proIndex) => {
    const target = this.state.level1List[proIndex];
    this.setL2List(target.id);
    this.addToLocal(target, 0);
  };

  doneL2 = (cityIndex) => {
    const target = this.state.level2List[cityIndex];
    this.setL3List(target.id);
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

  render() {
    return (
      <View style={sts.com}>
        <View style={sts.rest} />
        <View style={sts.btns}>
          <TouchableOpacity style={sts.btn} onPress={this.cancel}>
            <Text style={sts.btn_text}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={sts.btn} onPress={this.confirm}>
            <Text style={sts.btn_text}>确认</Text>
          </TouchableOpacity>
        </View>
        <View style={sts.all}>
          {/* {this.state.level1List.map((item, index) => (
            <SingleSlide
              list={this.state.level1List}
              done={this.doneL1}
              ref={() => this.setProsRef(index)}
            />
          ))} */}
          <SingleSlide
            list={this.state.level1List}
            done={this.doneL1}
            ref={this.setLv1Ref}
          />
          {this.state.level2List && (
            <SingleSlide
              list={this.state.level2List}
              done={this.doneL2}
              ref={this.setLv2Ref}
            />
          )}
          {this.state.level3List && (
            <SingleSlide
              list={this.state.level3List}
              done={this.doneL3}
              ref={this.setL3Ref}
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

  render() {
    const { dataSource } = this.props;
    return (
      <View style={sts.com}>
        <View style={sts.rest} />
        <View style={sts.btns}>
          <TouchableOpacity style={sts.btn} onPress={this.cancel}>
            <Text style={sts.btn_text}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={sts.btn} onPress={this.confirm}>
            <Text style={sts.btn_text}>确认</Text>
          </TouchableOpacity>
        </View>
        <View style={sts.all}>
          {dataSource.map((list, index) => (
            <SingleSlide
              list={list}
              key={index}
              inparindex={index}
              done={this.done}
            />
          ))}
          {/* <SingleSlide
            list={this.state.level1List}
            done={this.doneL1}
            ref={this.setLv1Ref}
          />
          {dataSource.length >= 2 && (
            <SingleSlide
              list={this.state.level2List}
              done={this.doneL2}
              ref={this.setLv2Ref}
            />
          )}
          {dataSource.length >= 3 && (
            <SingleSlide
              list={this.state.level3List}
              done={this.doneL3}
              ref={this.setL3Ref}
            />
          )} */}
        </View>
      </View>
    );
  }
}

const sts = StyleSheet.create({
  com: {
    // flex: 1, paddingTop: 20
  },
  rest: { flex: 1, backgroundColor: "#fff" },
  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
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
