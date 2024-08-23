import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, Image, Vibration } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import colors from '../../../../config/styles';

const styles = {
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 5,
    // marginLeft: 10,
  },
  icon: {
    resizeMode: 'contain',
    width: 40,
    height: 40,
  },
  textContainer: {
    flex: 1,
    alignSelf: 'center',
    // marginLeft: 20,
  },
  title: {
    color: '#000',
    // fontWeight: 'bold',
    fontFamily: colors.fonts.proximaNova.semiBold,
  },
  message: {
    color: '#000',
    marginTop: 5,
    fontFamily: colors.fonts.proximaNova.regular,
  },
};

class DefaultNotificationBody extends React.Component {
  constructor() {
    super();

    this.onNotificationPress = this.onNotificationPress.bind(this);
    this.onSwipe = this.onSwipe.bind(this);
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.vibrate || this.props.vibrate) && this.props.isOpen && !prevProps.isOpen) {
      Vibration.vibrate();
    }
  }

  onNotificationPress() {
    const {
      onPress,
      onClose,
    } = this.props;

    onClose();
    onPress();
  }

  onSwipe(direction) {
    const { onClose } = this.props;
    const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

    if (direction === SWIPE_RIGHT || direction === SWIPE_LEFT) {
      onClose();
    }
  }

  render() {
    const {
      title,
      message,
      iconApp,
      icon,
    } = this.props;

    return (
      <GestureRecognizer onSwipe={this.onSwipe} style={styles.container}>
        <TouchableOpacity
          style={styles.content}
          activeOpacity={0.3}
          underlayColor="transparent"
          onPress={this.onNotificationPress}
        >
          <View style={styles.iconContainer}>
            {(icon || iconApp) && <Image source={icon || iconApp} style={styles.icon} />}
          </View>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
            <Text numberOfLines={1} style={styles.message}>{message}</Text>
          </View>
        </TouchableOpacity>
      </GestureRecognizer>
    );
  }
}

DefaultNotificationBody.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  vibrate: PropTypes.bool,
  isOpen: PropTypes.bool,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
  iconApp: Image.propTypes.source,
  icon: Image.propTypes.source,
};

DefaultNotificationBody.defaultProps = {
  title: 'Notification',
  message: 'This is a test notification',
  vibrate: true,
  isOpen: false,
  iconApp: null,
  icon: null,
  onPress: () => null,
  onClose: () => null,
};

export default DefaultNotificationBody;
