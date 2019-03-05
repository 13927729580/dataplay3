import React, { PureComponent } from 'react';
import { Select, Icon } from 'antd';

import styles from './ChartTypeSelector.less';
import { chartConfigs } from './ChartConfig';

const { Option } = Select;

class ChartTypeSelector extends PureComponent {
  render() {
    const { handleChange, size } = this.props;

    const buildOption = chart => {
      return (
        <Option key={chart.name} value={chart.name}>
          <span>
            {chart.name} <Icon type={chart.icon} />{' '}
          </span>
        </Option>
      );
    };

    const optionContents = chartConfigs.value.map(item => {
      return buildOption(item);
    });

    const handleFilter = (input, option) => {
      return (
        option.props.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    };

    return (
      <div className={styles.datasetListSelector}>
        <Select
          size={size}
          showSearch
          style={{ width: '100%' }}
          placeholder="Select a chart type"
          optionFilterProp="children"
          onChange={handleChange}
          filterOption={handleFilter}
        >
          {optionContents}
        </Select>
      </div>
    );
  }
}

export default ChartTypeSelector;