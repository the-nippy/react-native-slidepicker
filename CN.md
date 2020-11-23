# react-native-slidepicker

一个 React Native 上的选择器组件，使用时间，地址以及各种分类选择的场景上。

<img src="https://pic.downk.cc/item/5fb53f7fb18d6271136f2421.jpg" width=300>

为什么选择：

- 使用 JavaScript 实现，兼容 Android 和 iOS 端。

- 自定义条目高度，背景色，文字样式，自定义选择器头部

- 支持使用级联选择和平行选择两种方式

## Usage

安装库：

```javascript
npm install react-native-slidepicker
```

引入使用：

```javascript
//联动数据
import { CascadePicker } from "react-native-slidepicker";

//平级数据
import { ParallelPicker } from "react-native-slidepicker";
```

## Example

使用例子：

```JSX
import {ParallelPicker} from 'react-native-slidepicker';
import ParaData from './one.json';
export default class PickerTest extends Component {
  ...
  onceChange = data => console.info('once', data);
  confirm = data => console.info('confirm', data);
  render() {
    return (
      <View style={{flex: 1}}>
        {/* <CascadePicker
          dataSource={CasCaData}
          onceChange={this.onceChange}
          confirm={this.confirm}
        /> */}
        <ParallelPicker
          dataSource={ParaData}
          onceChange={this.onceChange}
          confirm={this.confirm}
        />
      </View>
    );
  }
}

```

## props

下面是该组件的各个属性

- [`dataSource`](#dataSource)
- [`pickerDeep`](#deep)
- [`confirm`](#confirm)
- [`onceChange`](#oncechange)
- [`cancel`](#cancel)
- [`pickerStyle`](#pickerStyle)
- [`customHead`](#head)

<hr id="dataSource"></hr>

### `dataSource`

必要的属性，数组类型，用于选择的数据源。

对级联数据选择和平行数据选择应该分别这样穿参：

**级联数据：**

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
          //...
        ]
      },
      {
        "name": "South Korea",
        "id": 200,
        "list": [
          //...
        ]
      }
    ]
  },
  {//....}
]
```

**平行数据：**

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
      "name": "7月",
      "id": 201
    },
    {
      "name": "8月",
      "id": 202
    }
  ],
  [
    {
      "name": "1日",
      "id": 2101
    }
  ]
]
```

<hr id="deep"></hr>

### `pickerDeep : number`

the num of sub pickers, required in CascadePicker Component.

<hr id="confirm"></hr>

### `confirm`

(dataArray) => { } , 函数类型，如果使用了默认的确认和取消按钮，则该函数是必要的，在确认时传回选择的数据。

如果使用了自定义头部，自定义了「选择」按钮和操作，则非必要。

<hr id="oncechange"/>

### `onceChange`

(dataArray) => { } , 函数类型，非必要参数。每次数据选择都会触发，传回当前选择的实时数据。

<hr id="cancel"/>

### `cancel`

() => { }，函数类型， 如果使用了默认的确认和取消按钮，则该函数是必要的，用于取消操作。

<hr id="pickerStyle"/>

### `pickerStyle`

一个样式对象，可以包含如下的属性：

| Key             | Type            | Default Value | Description                                      |
| --------------- | --------------- | ------------- | ------------------------------------------------ |
| itemHeight      | number          | 40            | 条目高度                                         |
| visibleNum      | number          | 5             | 可见行数                                         |
| activeBgColor   | string (color)  | "#ccc"        | 被选中条目背景色                                 |
| activeFontSize  | Number          | 18            | 被选中条目字体大小                               |
| activeFontColor | string (color)  | "\#a00"       | 被选中条目字体颜色                               |
| normalBgColor   | string (color)  | "#fff"        | 未被选中条目背景色                               |
| normalBgOpacity | number (0-1)    | 0.4           | 未被选中条目背景色透明度（底色是 activeBgColor） |
| normalFontSize  | number          | 16            | 未被选中条目字体颜色                             |
| normalFontColor | string：(color) | "#333"        | 未被选中条目字体颜色                             |

<hr id="head"/>

### `customHead`

自定义头部，即滑动选择块上面的一部分内容，非必要参数。自定义头部会替换掉默认的包含「确认」，「取消」按钮的 View。

如果你需要在自定义的头部 View 中通过点击事件获取到结果，即达到「确认」按钮的效果，那就需要给当前`picker`组件指定一个 Ref，再通过`getResult`方法得到结果，详情参考下面的[`getResult方法`](#getresult)。

## Method

如果你使用了自定义头部，且包含了「确认」「取消」按钮，那么就需要为 picker 组件设置 ref。然后将 ref 上的方法绑定到你的确事件上才能获取到选择结果。

<span id="getresult"></span>

### getResult()

除非你使用自定义头部，否则都应该使用 [confirm 方法](#confirm) 表示选定， 而不是使用这个方法。

通过设置 ref，可以实时获取到已选择的数据，但是触发时机并不好判定，因为已经有了 confirm 按钮和事件回调，应该优先使用 confirm 事件。

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

## illustration

本组件并不处理弹出框的逻辑，因为弹出层的方案可能每个人采用的方案本身不同，目前还难以找到一种大多数人统一认同的方案，所以这一层的逻辑交由使用者处理 , 如果有更好的方案欢迎 issue.

如果你需要使用在弹出层中，可以使用`Modal`或者绝对定位及 z-Index 手段，

如：

```jsx

//嵌入Modal
<Modal {...ModalProps}>
  <ParallelPicker
   dataSource={ParaData}
   onceChange={this.onceChange}
   confirm={this.confirm}
   ...
  />
</Modal>

//嵌入View。state控制
<View>
  {this.state.isPicker && <CascadePicker {...props}>}
</View>
```
