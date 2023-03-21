| 参数 | 类型 | 说明| 默认值 | require|
| ----| --- | ----------| ---- | ---|
| type | pie \| sunburst | pie： 饼图 <br> sunburst：旭日图 | pie | false|
| radius | String \| Number \| Array \| Object| 双饼图需传Object类型, 其余为单饼图 | 50% | false |
| data | [DataItem](#dataItem)[] | data为数据源，Array类型 | [] | true |
| tooltipOption | Object | tooltip相关配置, [点击查看详情](#tooltipOption) | {} | false |
| seriesOption | Object | series相关配置, [点击查看详情](#seriesOption) | {} | false |
| auto | Boolean | 是否开启自动轮播 | false | false |
| autoOption | Object | 自动轮播相关配置, [点击查看详情](#autoOption) | {} | false |
| highLightOption | Object | 高亮相关配置, [点击查看详情](#highLightOption) | {} | false |
| centerBlockOption | Object | 圆环内置内容相关配置, [点击查看详情](#centerBlockOption) | {} | false |


<span id='tooltipOption'></span>
tooltipOption
| 参数 | 类型 | 说明| 默认值 | require |
| ----| --- | ----------| ---- | --- |
| content |  (params, ticket, callback) => String \| ReactNode | 可参考 https://echarts.apache.org/zh/option.html#tooltip.formatter 回调函数格式 <br /> [例1 String](#tooltip1) <br /> [例2 ReactNode](#tooltip2) | - | false |
| position | string \| Array \| Function \| Object | 可参考https://echarts.apache.org/zh/option.html#tooltip.position |

<span id='seriesOption'></span>
seriesOption
- label

| 参数 | 类型 | 说明| 默认值 | require |
| ----| --- | ----------| ---- | --- |
| content |  (params) => ReactNode | 自定义label。其中params: { name: string, value, dataIndex, color, percent } | - | false |

<span id='autoOption'></span>
autoOption
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
### 数据传参
```
{
  type: 'pie' | 'sunburst'
  data: [],
  radius: string | number | Array | Object
  legendOption = {},
  tooltipOption = {},
  seriesOption = {},
  autoPlay
  autoPlayOption // 自动轮播配置项，默认为3000 ms
  centerBlockOption
}
```
| 参数 | 类型 | 说明| 默认值 | require|
| ----| --- | ----------| ---- | ---|
| type | pie \| sunburst | pie： 饼图 <br> sunburst：旭日图 | pie | false|
| radius | string \| number \| Array \| Object| 双饼图需传Object类型, 其余为单饼图 | 50% | false

- type
  - 可选类型 'pie' | 'sunburst'; pie为饼图，sunburst为旭日图。
  - 可不传，不传默认为pie。

- radius
  - 可选类型：string | number | Array | Object;
  - radius 可不传，默认为 50%，普通饼图;
  - radius 可传 Number 类型如 50，或 String 类型如 50%，控制普通饼图的大小;
  - radius 可传 Array<number|string>类型，为环形图。数组的第一项是内半径，第二项是外半径。每一项遵从上述 number string 的描述;
  - radius 可传 Object 类型，如{ 0: 50, 1: '80%' }，为双饼图;

- data
  - data为数据源，Array类型
  格式如下
  ```
  [
    {
      name: '区域点位',
      value: 47,
    },
    {
      name: '饮用水源点位',
      value: 11,
    },
    {
      name: '风险监控点',
      value: 2,
    },
  ]
  ```


- tooltipOption
  tooltipOption 为 tooltip 配置项,
  其中新增 content 属性可对 tooltip 内容进行自定义

  - content

    1. 例 1
       可返回 dom 格式的 string 类型，但需是原生 dom
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

    2. 例 2
       此例可返回 react 格式的 dom 结构，返回类型为 HTMLDOM
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

    - params
      第一个参数 params 是 content 需要的数据集。格式如下

      ```
      {
        componentType: 'series',
        // 系列类型
        seriesType: string,
        // 系列在传入的 option.series 中的 index
        seriesIndex: number,
        // 系列名称
        seriesName: string,
        // 数据名，类目名
        name: string,
        // 数据在传入的 data 数组中的 index
        dataIndex: number,
        // 传入的原始数据项
        data: Object,
        // 传入的数据值。在多数系列下它和 data 相同。在一些系列下是 data 中的分量（如 map、radar 中）
        value: number|Array|Object,
        // 坐标轴 encode 映射信息，
        // key 为坐标轴（如 'x' 'y' 'radius' 'angle' 等）
        // value 必然为数组，不会为 null/undefied，表示 dimension index 。
        // 其内容如：
        // {
        //     x: [2] // dimension index 为 2 的数据映射到 x 轴
        //     y: [0] // dimension index 为 0 的数据映射到 y 轴
        // }
        encode: Object,
        // 维度名列表
        dimensionNames: Array<String>,
        // 数据的维度 index，如 0 或 1 或 2 ...
        // 仅在雷达图中使用。
        dimensionIndex: number,
        // 数据图形的颜色
        color: string,
        // 饼图，漏斗图的百分比
        percent: number
      }
      ```

  - position
    - 可选类型：String | Array | Function | Object
    - 具体参考https://echarts.apache.org/zh/option.html#tooltip.position

- legendOption
  legendOption 为 legend 配置项,
  其中新增 content 属性可对 legend 内容进行自定义

  - content

    1. 例 1
       返回String类型，默认使用echarts的formatter功能，此时可按照echarts的配置设置icon，如 icon: 'circle'。

       ```
        content: (params) => {
          return `${params.name} ${params.value} ${params.percent?.toFixed(
            2
          )}%`;
        }
       ```

    2. 例 2
       返回 ReactNode 类型, 此例中图例前的 icon 需自行设置
       ```
        content: (params) => {
          return (
            <div style={{ fontSize: 12 }}>
              <!-- icon -->
              <div className='icon'></div>
              <div style={{ fontSize: 14 }}>{params.name}</div>
              <div>
                {params.value} {`${params.percent?.toFixed(2)}%`}
              </div>
            </div>
          );
        }
       ```

    - params
      params 是 content 需要的数据集。格式如下

      ```
      {
          // 数据名，类目名
          name: string,
          // 数据在传入的 data 数组中的 index
          dataIndex: number,
          // 传入的原始数据项
          data: Object,
          value: number|Array|Object,
          // 数据图形的颜色
          color: string,
          // 饼图，漏斗图的百分比
          percent: number
      }
      ```

- centerBlockOption
  centerBlockOption 为圆环内置内容的设置项，可不传，不传则为圆环内置内容显示

  其格式如下：

  ```
  {
    margin: 5,
    padding: 5,
    border: '1px solid #000',
    radius: '40%',
    backgroundColor: '#DBDFF1',
    backgroundImage:
            'https://t7.baidu.com/it/u=2582370511,530426427&fm=193&f=GIF',
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
  }
  ```
  - radius 为 centerBlock 的区域大小

  - content
    content 可显示内容自定义，可返回 HTMLDOM 或者 string 类型。

    1. 例 1
      当 content 需跟随高亮变化时，可使用 ReactNode 返回

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

      - params
        params 是 content 需要的数据集。格式如下

        ```
        {
            // 数据名，类目名
            name: string,
            // 数据在传入的 data 数组中的 index
            dataIndex: number,
            // 传入的原始数据项
            data: Object,
            value: number|Array|Object,
            // 数据图形的颜色
            color: string,
            // 饼图，漏斗图的百分比
            percent: number
        }
        ```

    2. 例 2
      当 content 为固定显示内容时，可直接返回 String 类型

      ```
      content: (params) => {
        return 'ffffffffff';
      },
      ```

- autoPlay
  是否开启自动轮播，默认为 false

- autoPlayOption
  自动轮播的配置项
  {
  time: 3000,
  seriesIndex: 0,
  }
  time 为轮播速度，默认为 3000
  seriesIndex 为轮播数据 series，默认为 0。双饼图中可传 Array。
