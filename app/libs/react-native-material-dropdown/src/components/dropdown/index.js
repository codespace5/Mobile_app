import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Text,
  View,
  ScrollView,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  ViewPropTypes,
  TextInput,
  TouchableOpacity,
  ListView,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextField } from 'react-native-material-textfield';

import DropdownItem from '../item';
import styles from './styles';
import colors from '../../../../../config/styles';

const minMargin = 8;
const maxMargin = 16;
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Dropdown extends PureComponent {
  static defaultProps = {
    disabled: false,

    rippleOpacity: 0.54,
    shadeOpacity: 0.12,

    animationDuration: 225,
    fontSize: RFValue(16),

    textColor: 'rgba(0, 0, 0, .87)',
    itemColor: 'rgba(0, 0, 0, .54)',
    baseColor: 'rgba(0, 0, 0, .38)',

    itemCount: 4,
    itemPadding: 8,

    labelHeight: 32,
  };

  static propTypes = {
    disabled: PropTypes.bool,

    rippleInsets: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),

    rippleOpacity: PropTypes.number,
    shadeOpacity: PropTypes.number,

    animationDuration: PropTypes.number,
    fontSize: PropTypes.number,

    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    data: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
      ]),
    })),

    textColor: PropTypes.string,
    itemColor: PropTypes.string,
    selectedItemColor: PropTypes.string,
    baseColor: PropTypes.string,

    itemTextStyle: Text.propTypes.style,

    itemCount: PropTypes.number,
    itemPadding: PropTypes.number,

    labelHeight: PropTypes.number,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,

    renderBase: PropTypes.func,
    renderAccessory: PropTypes.func,

    containerStyle: (ViewPropTypes || View.propTypes).style,
    pickerStyle: (ViewPropTypes || View.propTypes).style,

    dropdownPosition: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.updateRippleRef = this.updateRef.bind(this, 'ripple');
    this.updateContainerRef = this.updateRef.bind(this, 'container');
    this.updateScrollRef = this.updateRef.bind(this, 'scroll');
    this.renderAccessory = this.renderAccessory.bind(this);

    this.blur = this.onClose;
    this.focus = this.onPress;

    let { value } = this.props;

    this.mounted = false;
    this.state = {
      opacity: new Animated.Value(0),
      selected: -1,
      modal: false,
      value,
    };
  }

  componentWillReceiveProps({ value }) {
    if (value !== this.props.value) {
      this.setState({ value });
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onPress(event) {
    let {
      data = [],
      disabled,
      onFocus,
      labelHeight,
      itemPadding,
      dropdownPosition,
      animationDuration,
    } = this.props;

    if (disabled) {
      return;
    }

    let itemCount = data.length;
    let visibleItemCount = this.visibleItemCount();
    let tailItemCount = this.tailItemCount();
    let timestamp = Date.now();

    if (null != event) {
      /* Adjust event location */
      event.nativeEvent.locationY -= this.rippleInsets().top;

      /* Start ripple directly from event */
      this.ripple.startRipple(event);
    }

    if (!itemCount) {
      return;
    }

    if ('function' === typeof onFocus) {
      onFocus();
    }

    let dimensions = Dimensions.get('window');

    this.container.measureInWindow((x, y, containerWidth, containerHeight) => {
      let { opacity } = this.state;

      let delay = Math.max(0, animationDuration - (Date.now() - timestamp));
      let selected = this.selectedIndex();
      let offset = 0;

      if (itemCount > visibleItemCount) {
        if (null == dropdownPosition) {
          switch (selected) {
            case -1:
              break;

            case 0:
            case 1:
              break;

            default:
              if (selected >= itemCount - tailItemCount) {
                offset = this.itemSize() * (itemCount - visibleItemCount);
              } else {
                offset = this.itemSize() * (selected - 1);
              }
          }
        } else {
          if (~selected) {
            if (dropdownPosition < 0) {
              offset = this.itemSize() * (selected - visibleItemCount - dropdownPosition);
            } else {
              offset = this.itemSize() * (selected - dropdownPosition);
            }
          }
        }
      }

      let left = x - maxMargin;
      let leftInset;

      if (left > minMargin) {
        leftInset = maxMargin;
      } else {
        left = minMargin;
        leftInset = minMargin;
      }

      let right = x + containerWidth + maxMargin;
      let rightInset;

      if (dimensions.width - right > minMargin) {
        rightInset = maxMargin;
      } else {
        right = dimensions.width - minMargin;
        rightInset = minMargin;
      }

      let top = y
        + Platform.select({ ios: 1, android: 2 })
        + labelHeight
        - itemPadding;

      this.setState({
        modal: true,
        width: right - left,
        top,
        left,
        leftInset,
        rightInset,
        selected,
      });

      setTimeout((() => {
        if (this.mounted) {
          if (this.scroll) {
            this.scroll.scrollTo({ x: 0, y: offset, animated: false });
          }

          Animated
            .timing(opacity, {
              duration: animationDuration,
              toValue: 1,
            })
            .start(() => {
              if (this.mounted && 'ios' === Platform.OS) {
                let { flashScrollIndicators } = this.scroll || {};

                if ('function' === typeof flashScrollIndicators) {
                  flashScrollIndicators.call(this.scroll);
                }
              }
            });
        }
      }), delay);
    });
  }

  onClose() {
    let { onBlur, animationDuration } = this.props;
    let { opacity } = this.state;

    Animated
      .timing(opacity, {
        duration: animationDuration,
        toValue: 0,
      })
      .start(() => {
        if ('function' === typeof onBlur) {
          onBlur();
        }

        if (this.mounted) {
          this.setState({ modal: false });
        }
      });
  }

  onSelect(index) {
    let { data, onChangeText, animationDuration } = this.props;
    let { value } = data[index];

    this.setState({ value });

    if ('function' === typeof onChangeText) {
      onChangeText(data[index], index, data);
    }

    setTimeout(this.onClose, animationDuration);
  }

  isFocused() {
    return this.state.modal;
  }

  selectedIndex() {
    let { data = [] } = this.props;

    return data
      .findIndex(({ value }) => value === this.state.value);
  }

  selectedItem() {
    let { data = [] } = this.props;

    return data
      .find(({ value }) => value === this.state.value);
  }

  itemSize() {
    let { fontSize, itemPadding } = this.props;

    return fontSize * 1.5 + itemPadding * 2;
  }

  visibleItemCount() {
    let { data = [], itemCount } = this.props;

    return Math.min(data.length, itemCount);
  }

  tailItemCount() {
    return Math.max(this.visibleItemCount() - 2, 0);
  }

  rippleInsets() {
    let {
      top = 0,
      right = 0,
      bottom = 0,
      left = 0,
    } = this.props.rippleInsets || {};

    return { top, right, bottom, left };
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  renderBase() {
    let { value } = this.state;
    let {
      containerStyle,
      rippleInsets,
      rippleOpacity,
      renderBase,
      renderAccessory = this.renderAccessory,
      ...props
    } = this.props;

    let { label = value } = this.selectedItem() || {};

    if ('function' === typeof renderBase) {
      return renderBase({ ...props, label, value, renderAccessory });
    }

    let title = 'string' === typeof label?
        label:
        value;
  /* 
  old code here

    <TextField
        {...props}
        basePadding={0}
        style={{
          // backgroundColor:'#f002',
          borderWidth:0, 
          borderBottomWidth:0}}
          labelTextStyle={{color:"#ccc",fontFamily: colors.fonts.proximaNova.regular,fontSize: RFValue(12),}}
        value={title}
        style={{color:"#ccc",fontFamily: colors.fonts.proximaNova.regular,fontSize: RFValue(12),}}
        editable={false}
        onChangeText={undefined}
        renderAccessory={renderAccessory}
        // onLayout={(e)=>{console.log(e.nativeEvent.layout)}}
      />
  */
    return (
      <View style={{height:40,width:'100%', flexDirection:'row',}}>
        <View style={{flex:1,justifyContent:'center'}}>
        <Text
          numberOfLines={1}
          style={{
            color:"#ccc",
            fontFamily: colors.fonts.proximaNova.regular,
            fontSize: RFValue(14),
            textAlign:'left',
          }}
        >
          {title ? value: this.props.label}
        </Text>
        </View>
        <View style={{ height:40, width:40, alignItems:'center', justifyContent:'center' }}>
        {this.renderAccessory()}
        </View>
      </View>
      
      
    );
  }

  renderAccessory() {
    let { baseColor: backgroundColor } = this.props;
    let triangleStyle = { backgroundColor };

    return (
      <View style={styles.accessory}>
        <View style={styles.triangleContainer}>
          <View style={[styles.triangle, triangleStyle]} />
        </View>
      </View>
    );
  }

  /* old logic */
  // renderItems() {
  //   let { selected, leftInset, rightInset } = this.state;

  //   let {
  //     data = [],
  //     textColor,
  //     itemColor,
  //     selectedItemColor = textColor,
  //     baseColor,
  //     fontSize,
  //     itemTextStyle,
  //     animationDuration,
  //     rippleOpacity,
  //     shadeOpacity,
  //   } = this.props;

  //   let props = {
  //     baseColor,
  //     fontSize,
  //     animationDuration,
  //     rippleOpacity,
  //     shadeOpacity,
  //     onPress: this.onSelect,
  //     style: {
  //       height: this.itemSize(),
  //       paddingLeft: leftInset,
  //       paddingRight: rightInset,
  //     },
  //   };

  //   return data
  //     .map(({ value, label = value }, index) => {
  //       let color = ~selected?
  //         index === selected?
  //           selectedItemColor:
  //           itemColor:
  //         selectedItemColor;

  //       let style = { color, fontSize };

  //       return (
  //         <DropdownItem index={index} key={index} {...props}>
  //           <Text style={[itemTextStyle, style]} numberOfLines={1}>
  //             {label}
  //           </Text>
  //         </DropdownItem>
  //       );
  //     });
  // }

  /* new logic */
  renderItems(rowData, index) {
    let { selected, leftInset, rightInset } = this.state;

    let {
      data = [],
      textColor,
      itemColor,
      selectedItemColor = textColor,
      baseColor,
      fontSize,
      itemTextStyle,
      animationDuration,
      rippleOpacity,
      shadeOpacity,
    } = this.props;

    let props = {
      baseColor,
      fontSize,
      animationDuration,
      rippleOpacity,
      shadeOpacity,
      onPress: this.onSelect,
      style: {
        height: this.itemSize(),
        paddingLeft: leftInset,
        paddingRight: rightInset,
      },
    };
    

        let color = ~selected?
          index === selected?
            selectedItemColor:
            itemColor:
          selectedItemColor;

        let style = { color, fontSize };

        return (
          <DropdownItem index={index} key={index} {...props}>
            <Text style={[itemTextStyle, style]} numberOfLines={1}>
              {rowData.value}
            </Text>
          </DropdownItem>
        );

  }
  /* new logic end */

  render() {
    let {
      data = [],
      rippleOpacity,
      containerStyle,
      pickerStyle: pickerStyleOverrides,
      baseColor,
      animationDuration,
      itemPadding,
      dropdownPosition,
    } = this.props;

    let { left, top, width, opacity, selected, modal } = this.state;

    let dimensions = Dimensions.get('window');

    let itemCount = data.length;
    let visibleItemCount = this.visibleItemCount();
    let tailItemCount = this.tailItemCount();
    let itemSize = this.itemSize();

    let overlayStyle = {
      width: dimensions.width,
      height: dimensions.height,
    };

    let height = 2 * itemPadding + itemSize * visibleItemCount;
    let translateY = -itemPadding;

    if (null == dropdownPosition) {
      switch (selected) {
        case -1:
          translateY -= 1 === itemCount? 0 : itemSize;
          break;

        case 0:
          break;

        default:
          if (selected >= itemCount - tailItemCount) {
            translateY -= itemSize * (visibleItemCount - (itemCount - selected));
          } else {
            translateY -= itemSize;
          }
      }
    } else {
      if (dropdownPosition < 0) {
        translateY -= itemSize * (visibleItemCount + dropdownPosition);
      } else {
        translateY -= itemSize * dropdownPosition;
      }
    }

    let pickerStyle = {
      width,
      height,
      top,
      left,
      opacity,
      transform: [{ translateY }],
    };

    let { bottom, ...insets } = this.rippleInsets();
    let rippleStyle = {
      ...insets,
      // backgroundColor:'#0f02',
      height: itemSize - bottom,
      position: 'absolute',
    };
    return (
      <View ref={this.updateContainerRef} style={containerStyle}>
        <TouchableWithoutFeedback onPress={this.onPress}>
          <View pointerEvents='box-only'>
            {this.renderBase()}

            <Ripple
              style={rippleStyle}
              rippleColor={baseColor}
              rippleDuration={animationDuration * 2}
              rippleOpacity={rippleOpacity}
              rippleSequential={true}
              ref={this.updateRippleRef}
            />
          </View>
        </TouchableWithoutFeedback>

        <Modal visible={modal} transparent={true} onRequestClose={this.onClose}>
          <TouchableWithoutFeedback onPress={this.onClose}>
            <View style={overlayStyle} onLayout={(e)=>{console.log(e.nativeEvent.layout)}}>
              <Animated.View
                style={[styles.picker, pickerStyle, pickerStyleOverrides]}
              >
                {/* old logic */}
                {/* <ScrollView
                  ref={this.updateScrollRef}
                  style={styles.scroll}
                  scrollEnabled={visibleItemCount < itemCount}
                  contentContainerStyle={styles.scrollContainer}
                  removeClippedSubviews={true}
                >
                  {this.renderItems()}
                </ScrollView> */}
                {/* old logic end */}


                {/* new logic */}
                <ListView
                  ref={this.updateScrollRef}
                  style={styles.scroll}
                  scrollEnabled={visibleItemCount < itemCount}
                  contentContainerStyle={styles.scrollContainer}
                  removeClippedSubviews={true}
                  dataSource={ds.cloneWithRows(data)}
                  renderRow={(rowData, sectionId, rowId, hId) => this.renderItems(rowData, parseInt(rowId, 10))}
                />
                {/* new logic end */}
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}
