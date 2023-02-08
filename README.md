# Deprecated

Because of this tool is relying on <a href="https://github.com/software-mansion/react-native-gesture-handler">React-native-gesture-handler</a>, and this issue https://github.com/software-mansion/react-native-gesture-handler/issues/139 still exists,  get some problems. So we suspend maintenance.



## 暂停更新

此选择器的手势监听依赖于对原生手势封装的 <a href="https://github.com/software-mansion/react-native-gesture-handler">React-native-gesture-handler</a> 库，该库在 Modal 中的手势动作获取有一些问题一直未修复，故暂停更新。查看 https://github.com/software-mansion/react-native-gesture-handler/issues/139



---


<h3><a href="https://github.com/lexguy/react-native-slidepicker/blob/main/CN.md">简中文档</a><h3>

## react-native-slidepicker

<hr/>

A react native picker component，used in address picker and other picker scenes.

<img src="https://christop.oss-cn-guangzhou.aliyuncs.com/tech/slidepicker-demo.gif">



why：

- archived by JavaScript，run on Android and iOS.

- custom height,backgroundColor,fontSize,fontColor,or even picker header.

- support parallel data and cascade data.

- can be used in modal or absolute position.

## Usage

install:

```bash
npm install react-native-slidepicker react-native-gesture-handler -S
```

or with yarn :

```bash
yarn add react-native-slidepicker react-native-gesture-handler
```

import:

```javascript
//Cascade data
import { CascadePicker } from "react-native-slidepicker";

//Parallel data
import { ParallelPicker } from "react-native-slidepicker";
```

## Example

```JSX
import {ParallelPicker} from 'react-native-slidepicker';
import Modal from 'react-native-modal';
import ParaData from './one.json';
export default class PickerTest extends Component {
  ...
  cancel = () => {
    //...close modal
  };
  confirm = data => console.info('confirm', data);
  render() {
    return (
      <View style={{flex: 1}}>
        <Modal isVisible={this.state...} {...props}>
          <ParallelPicker
            dataSource={ParaData}
            cancel={this.cancel}
            confirm={this.confirm}
          />
        </Modal>
      </View>
    );
  }
}

```

<hr id="deep"></hr>

## props

- [`dataSource`](#dataSource)
- [`pickerDeep`](#deep)
- [`confirm`](#confirm)
- [`cancel`](#cancel)
- [`values`](#values)
- [`pickerStyle`](#pickerStyle)
- [`headOptions`](#options)
- [`customHead`](#head)

<hr id="dataSource"></hr>

### `dataSource : array`

**required**. data source of the picker。

`id` ,`name` and `list` are keywords , `id` is necessary as the unique key,  `name` will be shown in the picker, `list` should be a array.

[Data format to follow](#dataformat)

<hr id="deep"></hr>

### `pickerDeep : number`

only used in CascadePicker, the num of sub pickers,  **required**.

<hr id="confirm"></hr>

### `confirm : (dataArray) => { }`

if you won't use the customeHead, this function is required.
called by confirm button, send the picker data back.

<hr id="cancel"/>

### `cancel : () => { } `

if you won't use the customeHead, this function is required.
called by cancel button, you should close the picker in this function.

<hr id="values"/>

### `values : {}[] `

The selected result.  You should set this value by data from `confirm` method callback.

<hr id="pickerStyle"/>

### `pickerStyle : object`

a custom style for the picker content , receives these props:

| Key             | Type            | Default Value | Description                            |
| --------------- | --------------- | ------------- | -------------------------------------- |
| itemHeight      | number          | 40            | item's height                          |
| visibleNum      | number          | 5             | Number of rows                         |
| activeBgColor   | string (color)  | "#FFF"        | Background color of selected item      |
| activeBgOpacity | number          | 1             | Background opacity of selected items   |
| activeFontSize  | Number          | 18            | Font size of selected item             |
| activeFontColor | string (color)  | "\#F00"       | Font color of selected item            |
| normalBgColor   | string (color)  | "#FFF"        | Unselected item background color       |
| normalBgOpacity | number (0-1)    | 0.4           | Background opacity of unselected items |
| normalFontSize  | number          | 16            | Unselected item font color             |
| normalFontColor | string：(color) | "#333"        | Unselected item font color             |

<hr id="options"/>

### `headOptions : object `

a custom style for the picker header , receives these props:

| key             | Type              | Default Value                    | Description                 |
| --------------- | ----------------- | -------------------------------- | --------------------------- |
| confirmText     | string            | Confirm                          | confirm button text         |
| cancelText      | string            | Cancel                           | cancel button text          |
| headHeight      | number            | 50                               | height of header            |
| borderTopRadius | number            | 0                                | borderTop(Left&Right)Radius |
| backgroundColor | string(color)     | \#FFF                            | backgroundcolor             |
| confirmStyle    | object (RN style) | {fontSize: 18, color: "#4169E1"} | confirm text style          |
| cancelStyle     | object (RN style) | {fontSize: 18, color: "#4169E1"} | cancel text style           |

<hr id="head"/>

### `customHead : view`

a rendered view, will replace the view that contains the [confirm]、[cancel] buttons.

you should provide the ref , and call `getResult` method to get the result of the picker.
[`getResult method`](#getresult)

## Method

if you custom the head, then you have to call `getResult` method by ref to get result.

<hr id="getresult"/>

### `getResult()`

unless you use customed header，or you should use `confirm` method.
you can get the result by this function , just like the following:

```JSX
export default class PickerTest extends Component {
  //...
  setPickerRef=(ref) => this.pickerRef = ref;
  getData=()=>{
    const data = this.pickerRef.getResult();
    console.info('data',data)
  }
  render() {
    const CustomHead = <View><Button onPress={this.getData}></Button></View>;
    return (
      <View style={{flex: 1}}>
        <ParallelPicker
          ref={this.setPickerRef}
          dataSource={ParaData}
          ...
        />
      </View>
    );
  }
}
```

## Illustration

This component does not deal with the logic of pop-up boxes, because the scheme of the pop-up layer may be different from the scheme adopted by each person. At present, it is difficult to find a solution that most people agree with. Therefore, the logic of this layer is left to the user. If there is a better scheme, issue and PR are welcome.

If you need to use it in the pop-up layer, you can use `absolute position and z-Index` or <a href="https://github.com/react-native-modal/react-native-modal">`Modal component`</a>.

example:

```jsx
  //used in view with state and used in modal
  {this.state.isPickerShow &&
    <View>
      <CascadePicker {...props}>
    </View>
  }

  <Modal isVisible={this.state.isShow}>
    <CascadePicker {...props}>
  </Modal>
```

## Experimental

### ` onceChange : (dataArray) => { }`

 once change the picker, it will be called and send current result back.

## Others

<span id="dataformat"></span>

format of dataSource prop:

**for cascade data:**

```json
[
  {
    "name": "Asia",
    "id": 1,
    "list": [
      {
        "name": "China",
        "id": 100,
        "list": [
          {
            "name": "Beijing",
            "id": 1101
          }
        ]
      },
      {
        "name": "South Korea",
        "id": 200,
        "list": []
      }
    ]
  }
]
```

**for parallel data ( a two-dimensional array ):**

```json
[
  [
    {
      "name": "2015",
      "id": 11
    }
  ],
  [
    {
      "name": "july",
      "id": 201
    },
    {
      "name": "August",
      "id": 202
    }
  ],
  [
    {
      "name": "1st",
      "id": 2101
    }
  ]
]
```

