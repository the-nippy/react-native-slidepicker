## react-native-slidepicker

一个 React Native 上的选择器组件，使用时间，地址以及各种分类选择的场景上。

<img src="https://pic.downk.cc/item/5fca0ebf394ac52378391b0b.gif" width=250>

<img src="https://pic.downk.cc/item/5fcaef1a394ac52378062486.jpg" width=200/> <img src="https://pic.downk.cc/item/5fcaef1a394ac52378062489.jpg" width=200/> <img src="https://pic.downk.cc/item/5fcaef1a394ac5237806248c.jpg" width=200/>

特点：

- 使用 JavaScript 实现，兼容 Android 和 iOS 端。
- 自定义条目高度，背景色，文字样式，自定义选择器头部
- 支持使用级联选择和平行选择两种方式
- 自定义在显示，可在 Modal 或绝对定位中使用

## 使用

安装库：

安装 (npm) :

```bash
npm install react-native-slidepicker react-native-gesture-handler -S
```

或者使用 yarn

```bash
yarn add react-native-slidepicker react-native-gesture-handler
```

引入使用：

```javascript
//联动数据
import { CascadePicker } from "react-native-slidepicker";

//平级数据
import { ParallelPicker } from "react-native-slidepicker";
```

## 例子

使用例子：

```JSX
import {ParallelPicker} from 'react-native-slidepicker';
import ParaData from './one.json';
export default class PickerTest extends Component {
  ...
  cancel = data => {
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

## props

组件的可用属性：

- [`dataSource`](#dataSource)
- [`pickerDeep`](#deep)
- [`confirm`](#confirm)
- [`cancel`](#cancel)
- [`defaultValueIndexes`](#defaultValueIndexes)
- [`pickerStyle`](#pickerStyle)
- [`headOptions`](#options)
- [`customHead`](#head)

<hr id="dataSource"></hr>

### `dataSource : array`

必要的属性，数组类型，用于选择的数据源。
`name`和`list`都是关键字，`name`是用于显示的文本，`list`是数组类型数据表示一列。

[参考数据格式](#dataformat)

<hr id="deep"></hr>

### `pickerDeep : number`

选择轮盘的个数

<hr id="confirm"></hr>

### `confirm : (dataArray) => { }`

(dataArray) => { } , 函数类型，如果使用了默认的确认和取消按钮，则该函数是必要的，在确认时传回选择的数据。

如果使用了自定义头部，自定义了「选择」按钮和操作，则非必要。

<hr id="cancel"/>

### `cancel : () => { } `

() => { }，函数类型， 如果使用了默认的确认和取消按钮，则该函数是必要的，用于取消操作。

<hr id="pickerStyle"/>

### `pickerStyle : object`

一个样式对象，可以包含如下的属性：

| Key             | Type            | Default Value | Description                                      |
| --------------- | --------------- | ------------- | ------------------------------------------------ |
| itemHeight      | number          | 40            | 条目高度                                         |
| visibleNum      | number          | 5             | 可见行数                                         |
| activeBgColor   | string (color)  | "#ccc"        | 被选中条目背景色                                 |
| activeBgOpacity | number          | 1             | 被选中条目背景透明度                             |
| activeFontSize  | Number          | 18            | 被选中条目字体大小                               |
| activeFontColor | string (color)  | "\#a00"       | 被选中条目字体颜色                               |
| normalBgColor   | string (color)  | "#fff"        | 未被选中条目背景色                               |
| normalBgOpacity | number (0-1)    | 0.4           | 未被选中条目背景色透明度（底色是 activeBgColor） |
| normalFontSize  | number          | 16            | 未被选中条目字体颜色                             |
| normalFontColor | string：(color) | "#333"        | 未被选中条目字体颜色                             |

<hr id="options"/>

### `headOptions : object `

a custom style for the picker header , receives these props:

| key             | Type              | Default Value                    | Description      |
| --------------- | ----------------- | -------------------------------- | ---------------- |
| confirmText     | string            | Confirm                          | 确认按钮文本     |
| cancelText      | string            | Cancel                           | 取消按钮文本     |
| headHeight      | number            | 50                               | 头部高度         |
| borderTopRadius | number            | 0                                | 头部的顶部圆角   |
| backgroundColor | string(color)     | \#fff                            | 背景色           |
| confirmStyle    | object (RN style) | {fontSize: 18, color: "#4169E1"} | 确认按钮文本样式 |
| cancelStyle     | object (RN style) | {fontSize: 18, color: "#4169E1"} | 取消按钮文本样式 |

<hr id="head"/>

### `customHead : view`

自定义头部，即滑动选择块上面的一部分内容，非必要参数。自定义头部会替换掉默认的包含「确认」，「取消」按钮的 View。

如果你需要在自定义的头部 View 中通过点击事件获取到结果，即达到「确认」按钮的效果，那就需要给当前`picker`组件指定一个 Ref，再通过`getResult`方法得到结果，详情参考下面的[`getResult方法`](#getresult)。

## 方法

如果你使用了自定义头部，且包含了「确认」「取消」按钮，那么就需要为 picker 组件设置 ref。然后将 ref 上的方法绑定到你的确事件上才能获取到选择结果。

<span id="getresult"></span>

### `getResult()`

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

## 说明

本组件并不处理弹出框的逻辑，因为弹出层的方案可能每个人采用的方案本身不同，目前还难以找到一种大多数人统一认同的方案，所以这一层的逻辑交由使用者处理 , 如果有更好的方案欢迎 issue 和 PR 。

如果你需要使用在弹出层中，可以使用绝对定位及 z-Index 方式或`Modal`组件处理，

如：

```jsx
 //通过 state 控制显示和在 Modal 中
 {this.state.isPicker &&
    <View>
      <CascadePicker {...props}>
    </View>
  }

  <Modal isVisible={this.state.isShow}>
    <CascadePicker {...props}>
  </Modal>
```

## 试验性功能

### `onceChange (dataArray) => { }` 

每次选择改变发生都会执行，返回当前的实时结果。

### `defaultValueIndexes` 

默认选中值，目前只在`ParallelPicker`中可用，`CascadePicker`待完成。

 <hr id="oncechange"/>

### `onceChange : (dataArray) => { }`

(dataArray) => { } , 函数类型，非必要参数。每次数据选择都会触发，传回当前选择的实时数据。

## 其他

<span id="dataformat"></span>

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

**平行数据（一个二维数组）：**

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
