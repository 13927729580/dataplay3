import React, { PureComponent } from 'react';
import { Empty } from 'antd';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';

import styles from './index.less';

class GGChart extends PureComponent {
  render() {
    console.log('render chart');
    const { grammar, currentDataset } = this.props.model;
    if (!currentDataset) {
      return <Empty />;
    }

    const data = currentDataset.dataSource;

    const coordinationType = grammar.coordination;
    const buildCoordination = () => {
      if (coordinationType) {
        return <Coord type={coordinationType} />;
      } else {
        return null;
      }
    };
    const coordination = buildCoordination();

    const validateGrammar = geom => {
      if (
        !coordinationType ||
        coordinationType == 'rect' ||
        coordinationType == 'polar' ||
        coordinationType == 'helix'
      ) {
        if (geom.position && geom.position.length == 2) {
          return true;
        }
      } else if (coordinationType == 'theta') {
        if (geom.position && geom.position.length >= 1) {
          return true;
        }
      }
      return false;
    };

    const buildGeom = geom => {
      const geomType = geom.geometry;
      let position = '';
      if (geom.position) {
        position = geom.position.join('*');
      }

      let color = '';
      if (geom.color && geom.color.length > 0) {
        color = geom.color[0];
      }

      let size = '';
      if (geom.size && geom.size.length > 0) {
        size = geom.size[0];
      }

      let shape = '';
      if (geom.shape && geom.shape.length > 0) {
        shape = geom.shape[0];
      }

      let opacity = '';
      if (geom.opacity && geom.opacity.length > 0) {
        opacity = geom.opacity[0];
      }

      const buildLable = () => {
        if (geom.label && geom.label.length > 0) {
          const lable = geom.label.join('*');
          return <Label content={lable} />;
        } else {
          return null;
        }
      };
      const label = buildLable();
      return (
        <Geom
          type={geomType}
          position={position}
          color={color}
          size={size}
          shape={shape}
          opacity={opacity}
        >
          {label}
        </Geom>
      );
    };

    const buildGeomList = () => {
      if (!grammar.geom) {
        return;
      }
      let geometryList = [];

      Object.entries(grammar.geom).map(item => {
        const value = item[1];
        if (!validateGrammar(value)) {
          return;
        }
        geometryList.push(buildGeom(value));
      });

      return geometryList;
    };

    const buildAxis = () => {
      if (grammar && grammar.geom && grammar.geom.Geom_0 && grammar.geom.Geom_0.position) {
        return Object.entries(grammar.geom.Geom_0.position).map(item => {
          const pos = item[1];
          return <Axis name={pos} />;
        });
      } else {
        return null;
      }
    };

    const buildSingeChart = () => {
      const geomList = buildGeomList();

      if (geomList.length === 0) {
        return <Empty />;
      }

      const axis = buildAxis();

      return (
        <div className={styles.ggchart}>
          <Chart height={600} data={data} forceFit>
            <Legend />
            <Tooltip />
            {axis}
            {coordination}
            {geomList}
          </Chart>
        </div>
      );
    };

    const buildfacat = () => {
      const geomList = buildGeomList();
      return (
        <Facet type="rect" fields={grammar.facat}>
          <View>{geomList}</View>
        </Facet>
      );
    };

    if (grammar.facat && grammar.facat.length > 0) {
      let facat = null;
      if (grammar.facat.length == 1 || grammar.facat.length == 2) {
        facat = buildfacat();
      } else {
        return <Empty />;
      }
      return (
        <div className={styles.ggchart} >
          <Chart height={600} data={data} forceFit>
            <Legend />
            <Tooltip />
            {facat}
          </Chart>
        </div>
      );
    } else {
      return buildSingeChart();
    }
  }
}

export default GGChart;