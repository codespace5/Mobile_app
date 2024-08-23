/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-props-no-spreading */
// import React from 'react';
// import ContentLoader, { Rect, Circle, Path } from 'rn-content-loader';

import React, { Component } from 'react';
import ContentLoader from 'react-content-loader/native';
import { Rect } from 'react-native-svg';
import { Dimensions } from 'react-native';

const { height: HEIGHT, width: WIDTH } = Dimensions.get('window');

class Loader extends Component {
  render() {
    return (
      <ContentLoader
        ltr={true}
        speed={3.5}
        interval={0.10}
        width={WIDTH}
        height={3}
        animated
        // viewBox="0 0 400 90"
        backgroundColor="#616161"
        backgroundOpacity={0.5}
        foregroundColor="#fafafa"
      >
        <Rect x="0" y="0" rx="0" ry="0" width={WIDTH} height="3" />
      </ContentLoader>
    );
  }
}
export default Loader;
