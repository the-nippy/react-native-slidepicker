## <a href="https://github.com/the-nippy/react-native-slidepicker/blob/main/README_CN.md">中文文档</a>


## react-native-slidepicker

A selector component on React Native that can be used for time, address, and various classification selection scenarios.

  <img src="./example_pic.gif" width="360">

<a href="https://github.com/the-nippy/react-native-slidepicker/blob/feature/absomask_flatlist/Example/example/index.tsx">demo code</a>

Feature：

- Implemented through RN components (JS / TS), compatible with Android and iOS.

- Support the use of cascaded data selection and parallel data selection.

- Most styles can be customized: entry text, background color, entire selector header.

- Custom display method, default to absolute positioning Mask, customizable container placement selector.


## How to use


Install (npm) :

```bash
npm install react-native-slidepicker -S
```

Import & use :

```javascript
import SlidePicker from "react-native-slidepicker";

//联动数据
<SlidePicker.Cascade
  visible={true}
  dataSource={...}
  values={...}
  ...
/>

//平级数据
<SlidePicker.Parallel
  dataSource={...}
/>
```

## Demo


```JSX
import SlidePicker from 'react-native-slidepicker';
import PARALLEL_TIME from './test_data/parallel_time.json';

export default class PickerTest extends Component {

  constructor(props: any) {
    super(props);
    this.state = {demoType : '', timeData: [] };
  }

  render() {
    return (
      <View style={{flex: 1}}>

        <SlidePicker.Parallel
          visible={this.state.demoType === 'parallel_time'}
          data={PARALLEL_TIME}
          values={this.state.timeData}
          wheels={2}
          checkedTextStyle={styles.checkedStyle}
          normalTextStyle={{fontSize: 14}}
          onCancelClick={() => this.setState({demoType: ''})}
          onConfirmClick={res => this.setState({timeData: res, demoType: ''})}
        />
      </View>
    );
  }
}

```

## props



| prop                   | type ( \* means required) | description                                                                                                                                | default                                          |
| ---------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| visible                | boolean \*          | component visible                                                                                                                                   | false                                            |
| dataSource             | array \*            | data source，<a href='#data_demo'>view data format</a>                                                                                    | []                                               |
| values                 | array \*            | checked values                                                                                                         | []                                               |
| wheels                 | number              | data columns                                                                                                                             | 2                                                |
| onMaskClick            | function            | background click event                                                                                                                               | null                                             |
| animationDuration      | number              | open/close animation duration                                                                                                                   | 200                                              |
| checkRange             | number              | row ranges数                                                                                                                               | 3                                                |
| itemHeight             | number              | height of item                                                                                                                           | 60                                               |
| contentBackgroundColor | string              | check area background color                                                                                                                             | #f8f8f8                                          |
| itemDividerColor | string      | divider line color                                                                                                                       | rgba(0,0,0,0.05)                                 |
| checkedTextStyle       | TextStyle           | checked item text style                                                                                                                         | { fontWeight: '700',fontSize: 16,color: '#006' } |
| normalTextStyle        | TextStyle           | normal item text style                                                                                                                         | { fontWeight: '400', fontSize: 14 }              |
| titleText              | string              | picker heading                                                                                                                             |                                                  |
| titleTextStyle         | TextStyle           | picker heading text style                                                                                                                     |                                                  |
| cancelText             | string              | cancel text                                                                                                                                   | cancel                                           |
| cancelTextStyle        | TextStyle           | cancel text style                                                                                                                               | { fontSize: 15, color: 'rgb(42, 123, 152)' }     |
| onCancelClick          | function            | cancel event                                                                                                                                   |                                                  |
| confirmText            | string              | confirm text                                                                                                                                   | confirm                                          |
| confirmTextStyle       | TextStyle           | confirm text style                                                                                                                               | { fontSize: 15, color: 'rgb(42, 123, 152)' }     |
| onConfirmClick         | function            | confirm event, `(res) => { }` width result                                                                                                        |                                                  |
| HeaderComponent        | JSX element         | Custom selector header component (If using a custom selector header component, the default header will be replaced, onConfirmClick will not be called, and ref needs to be used to call \ _getValues to take values)） |                                                  |

<hr id="dataSource"></hr>

## 方法

If you have used a custom header, then you need to set ref for the picker component. Then, the selection result can only be obtained by calling ref when clicking.

### `_getValues()`

> Unless you use a custom header, you should use the **onConfirmClick** props instead of using this method.

By setting ref, the selected data can be obtained in real-time.

```JSX
export default class RefDemo extends Component {

  constructor(props: any) {
   	// ...
    this.skuRef = React.createRef();
  }

  render() {

    return (
      <View style={{flex: 1}}>
       <SlidePicker.Parallel
          ref={this.skuRef}
          // ....
          HeaderComponent={
            <View style={styles.header}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={ICON_DOG} style={{width: 34, height: 34}} />
                <Text style={{marginLeft: 10}}>What you want?</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const res = this.skuRef?.current?._getValues();
                  console.info('res', res);
                  this.setState({skuData: res, demoType: ''});
                }}>
                <Text style={{fontWeight: '700'}}>Done</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  }
}
```

## Others

1. Issue with pop-up layers

Generally, the Picker component will have a pop-up layer, and this component's `SlidePicker.Parallel` and `SlidePicker.Cascade` uses an absolutely positioned View as the Mask container to load selectors, so it is best to place components at the page level. If you want to handle pop-up layers yourself, you can also use ` SlidePicker.PureParallel` and `SlidePicker.PureCascade`, this is a pure selector component without a pop-up layer.


2. Historical Version

The 1.x version uses react native Gesture handler to handle gesture scrolling, but on Android machines, especially when combined with react-native-modal, there are some instability issues that cannot be addressed by the native code of the library ( <a href="https://github.com/software-mansion/react-native-gesture-handler/issues/139">issue#139</a> ). Therefore, all 2. x are completed using RN's built-in components, mainly FlatList


<div id="data_demo">

## Data format


<a href="https://github.com/the-nippy/react-native-slidepicker/tree/feature/absomask_flatlist/Example/example/test_data">demo data format</a>



**cascaded data format** ：

```json
[
  {
    "label": "",
    "value": "",
    "options": [
      {
        "label": "",
        "value": "",
        "options": [
          {
            "label": "",
            "value": "",
            "options": [{ "label": "" }]
          }
        ]
      }
    ]
  },
  {
    "label": "",
    "value": ""
  }
]
```

**parallel data format** :

```json
[
  [
    {
      "label": "",
      "value": ""
    },
    {
      "label": "",
      "value": ""
    },
    {
      "label": "",
      "value": ""
    }
  ],

  [
    {
      "label": "",
      "value": ""
    },
    {
      "label": "",
      "value": ""
    }
  ]
]
```
