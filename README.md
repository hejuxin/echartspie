| 参数 | 类型 | 说明| 默认值 | require|
| ----| --- | ----------| ---- | ---|
| type | pie \| sunburst | pie： 饼图 <br> sunburst：旭日图 | pie | false |
| radius | String \| Number \| Array \| Object| 双饼图需传Object类型, 其余为单饼图 | 50% | false |
| color | Array | 颜色数组，数据超出数组长度后会重新从头开始取颜色 | - | false |
| data | [DataItem](#dataItem)[] | data为数据源，Array类型 | [] | true |
| legendOption | Object | legend相关配置, [点击查看详情](#legendOption) | {} | false |
| tooltipOption | Object | tooltip相关配置, [点击查看详情](#tooltipOption) | {} | false |
| seriesOption | Object | series相关配置, [点击查看详情](#seriesOption) | {} | false |
| autoPlay | Boolean | 是否开启自动轮播 | false | false |
| autoPlayOption | Object | 自动轮播相关配置, [点击查看详情](#autoPlayOption) | {} | false |
| highLightOption | Object | 高亮相关配置, [点击查看详情](#highLightOption) | {} | false |
| centerBlockOption | Object | 圆环内置内容相关配置, [点击查看详情](#centerBlockOption) | {} | false |
| wrapStyle | CSSProperties | 外部容器的样式 | {} | false |

<span id='legendOption'></span>
legendOption
| 参数 | 类型 | 说明| 默认值 | require |
| ----| --- | ----------| ---- | --- |
| content |  (params, ticket, callback) => String \| ReactNode | 可参考 https://echarts.apache.org/zh/option.html#tooltip.formatter 回调函数格式 <br /> [例1 String](#tooltip1) <br /> [例2 ReactNode](#tooltip2)<br /> 为兼容双饼图模式，params为Array类型。 | - | false |

<span id='tooltipOption'></span>
tooltipOption
| 参数 | 类型 | 说明| 默认值 | require |
| ----| --- | ----------| ---- | --- |
| content |  (params, ticket, callback) => String \| ReactNode | 可参考 https://echarts.apache.org/zh/option.html#tooltip.formatter 回调函数格式 <br /> [例1 String](#tooltip1) <br /> [例2 ReactNode](#tooltip2) | - | false |
| position | String \| Array \| Function \| Object | 可参考https://echarts.apache.org/zh/option.html#tooltip.position |

<span id='seriesOption'></span>
seriesOption
- label

| 参数 | 类型 | 说明| 默认值 | require |
| ----| --- | ----------| ---- | --- |
| content |  (params) => ReactNode | 自定义label。其中params: { name: string, value, dataIndex, color, percent } | - | false |
| isLineExtend | Boolean | 维护是否需要延长labelLine, 本质上是设置length2。<br /> false时length2为15，true时length2为lineExtendLength默认为15 | false | false |
| lineExtendLength | Number | 设置length2的长度, isLineExtend设置true时生效 | 15 | false |
| mode | insideLine \| outsideLine | 分别对应在labelLine上和不在labelLine上 | outsideLine | false |
| distanceToLabelLine | Number | 维护与labelLine的距离 | mode为insideLine的情况下为0，outsideLine或未设置mode情况下为5 | false |

- labelLine 

| 参数 | 类型 | 说明| 默认值 | require |
| ----| --- | ----------| ---- | --- |
| capStyle |  CSSProperties | 线末端的样式。（类似lineStyle.cap） | {} | false |

<span id='autoPlayOption'></span>
autoPlayOption
| 参数 | 类型 | 说明| 默认值 | require |
| ----| --- | ----------| ---- | --- |
| time | Number | 轮播速度，单位ms | 3000 | false |
| seriesIndex | Number \| Number[] | 用于标识哪一层需要自动轮播。<br /><br />主要用于双饼图:<br /> 1. 数字时，会与radius的key值校验，取交集。<br /> 2. 数组时，需与radius的key值对应。会进行校验，取该数组与radius的key数组的交集。 | 0 | false

<span id='highLightOption'></span>
highLightOption
| 参数 | 类型 | 说明| 默认值 | require |
| ----| --- | ----------| ---- | --- |
| default | { seriesIndex: [], dataIndex: [] } | 用于标识默认高亮。若有值，自动轮播也会取该值作为初始项。<br /> 1. 若未设置dataIndex，则默认不高亮；<br /> 2. 若未设置seriesIndex，则seriesIndex默认为0； <br /> 3. 若都未设置，则默认不高亮。 <br /> 4. 若seriesIndex与dataIndex长度不对等; <br/> &emsp;4.1 若seriesIndex比较长, 则dataIndex取最后一位补齐; <br /> &emsp;4.2 若dataIndex比较长， 则只截取seriesIndex长度; | - | false |
| stillHigh | Boolean | 设置鼠标上移再移开后是否保持高亮 | false | false
| callback | (params, wholeParams) => {} | 高亮回调函数。旭日图下存在wholeParams。原有的highLightCallback配置，已兼容。| () => {} | false |

<span id='centerBlockOption'></span>
centerBlockOption
| 参数 | 类型 | 说明| 默认值 | require |
| ----| --- | ----------| ---- | --- |
| radius | Number \| String | centerBlock 的区域大小 | - | false |
| content | (params, wholeParams) => String \| ReactNode | [例1 String](#center1) <br /> [例2 ReactNode](#center2)  | - | false |

- DataItem
<span id='dataItem'></span>
```
{
    name: '区域点位',
    value: 47,
}
```

- tooltip 示例
    - <span id='tooltip1'>例1</span>
(params, ticket, callback) => String
    ```
    content: (params, ticket, callback) => {
     return `
         <div style="font-size: 14px; color: #595959">
           <div>${params.name}</div>
           <div>
           <span style="color: ${params.color};font-size: 24px; font-weight: 600;">${params.value}</span>  个
           </div>
         </div>
       `;
    }
    ```

    - <span id='tooltip2'>例2</span>
    (params, ticket, callback) => ReactNode
    ```
    content: (params, ticket, callback) => {
     return (
       <div style={{ fontSize: 14, color: '#595959' }}>
         <div>{params.name}</div>
         <div>
           <span
             style={{
               color: params.color,
               fontSize: 24,
               fontWeight: 600,
             }}
           >
             {params.value}
           </span>{' '}
           个
         </div>
       </div>
     );
    },
    ```

- center示例
    - <span id='center1'>例1</span>
(params) => String
    ```
    content: (params) => {
        return 'ffffffffff';
    },
    ```
    - <span id='center2'>例2</span>
(params) => ReactNode
    ```
    content: (params) => {
        return (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {params.name}
          </div>
        );
    },
    ```

<!-- 
# label
## 位置问题
mode：insideLine ｜ outsideLine
分别对应在labelLine上和不在labelLine上，默认为outsideLine

### insideLine
#### x轴的偏移量问题：
1. 在左边：transformX为0。文字居左。
2. 在右边：transformX为-100%。文字居右。
3. 添加distanceToLabelLine字段维护与labelLine的距离。默认为0。

#### 最大width问题：
取labelLine第二段的长度绝对值。
* todo 关于获取第二段长度 

#### 绝对定位left问题
取labelPoints的最后一项x数值。
需区分几种情况：
- x < 0, 一般在左边出现这种情况，代表最后一项超出左边范围。此时left = 0；
- x > 0
    - x > charts宽度（myChart.getWidth()）,一般在右边出现，代表最后一项超出右边范围。此时left = charts宽度? 取最大值后width会出现问题，此处改用left = charts宽度 - maxWidth，在transform时再进行回正
    - x < charts宽度，left = x

### outsideLine
#### x轴的偏移量问题：
1. 在左边：transformX为-100%。文字居左。
2. 在右边：transformX为0。文字居左。
3. 添加distanceToLabelLine字段维护与labelLine的距离。默认为5。

#### 最大width问题：
1. 在左边：为labelPoints的最后一项x数值。
2. 在右边：为charts宽度（myChart.getWidth()） - labelPoints的最后一项x数值。

### label左右问题
1. 官方通过labelLayout中的labelRect.x 与 charts中心位置进行比较，params.labelRect.x < myChart.getWidth() / 2
2. 目前使用的是，使用labelPoints的第一项x数值和最后一项x数值。第一项为起始点，最后一项为末端。
    - 若起始点x < 末端x，代表在右边
    - 若起始点x > 末端x，代表在左边


## 延长线问题
这个需要放到myChart.setOption()中去。
本质上是设置labelLine：{ length2: number }
添加isLineExtend：boolean维护是否需要延长, lineExtendLength：number维护延长长度
- 若isLineExtend为true，length2 = lineExtendLength || 15
- 若isLineExtend为false，length2 = 15


## label内容省略问题



# tooltip
mode：fixed ｜ 
固定和随鼠标

固定是否可用tooltip的position fun方法

单项时可作随鼠标位置展示，也可作固定位置展示。通过设置mode，默认为随鼠标位置展示
多项时只作固定位置展示，mode为fixed。若未设置位置，默认在右上角。

position
string、fn
array、obj

# auto
根据autoOption中的seriesIndex。
- 若series为单项，则只开启这一项
- 若series为多项，则开启这几项
- 若series未传，则all in

set
radius


label 重叠

auto 与 legend
legend 抛数据 数组
旭日图 -->