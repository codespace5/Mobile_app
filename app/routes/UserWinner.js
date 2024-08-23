// import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Text,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearGradient from 'react-native-linear-gradient';
import AIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/Feather';
import { Icon } from '../config/icons';
import CHeader from '../components/CHeader';
import common from '../config/genStyle';
import colors from '../config/styles';
import { FORTAB } from '../config/MQ';
import authActions from '../redux/reducers/auth/actions';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  MainView: {
    flex: 1,
  },
  MonthTitleSty: {
    textAlign: 'center',
    marginLeft: 10,
  },
  ImgSty: {
    width: '100%',
    height: '100%',
  },
  imgViewSty: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8e8e93',
    overflow: 'hidden',
  },
  MonthHeaderSty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ScrollViewSty: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  ScrollSubMainView: {
    paddingTop: 20,
    marginBottom: 10,
    // borderBottomColor: '#8e8e93',
    // borderBottomWidth: 1,
  },
});

// create a component
class UserWinner extends Component {
static navigationOptions = {
  header: null,
};

constructor(props) {
  super(props);
  this.state = {
    position: 0,
    interval: null,
    monthList: [
      {
        id: 1,
        monthName: 'April 2019',
        winnerList: [],
      },
      {
        id: 2,
        monthName: 'March 2019',
        winnerList: [
          {
            id: 4,
            imgUrl: 'https://s3.amazonaws.com/ntbrand-wp/impressivenature/wp-content/uploads/2018/10/10165639/1-6-e1539204999298.jpeg',
            cat: 'Signing',
            prize: '$20 m',
            likes: '20 m',
            rank: 'First',
          },
          {
            id: 5,
            imgUrl: 'https://wallpapercave.com/wp/e8xnTpf.jpg',
            cat: 'Dance',
            prize: '$10 m',
            likes: '20 m',
            rank: 'Second',
          },
          {
            id: 3,
            imgUrl: 'http://awesomebestpictures.com/images/rose-images-with-love/36024507-rose-images-with-love.jpg',
            cat: 'rap',
            prize: '$10 m',
            likes: '200 m',
            rank: 'First',
          },
          {
            id: 1,
            imgUrl: 'https://s3.amazonaws.com/ntbrand-wp/impressivenature/wp-content/uploads/2018/10/10165639/1-6-e1539204999298.jpeg',
            cat: 'sing',
            prize: '$10 m',
            likes: '200 m',
            rank: 'First',
          },
          {
            id: 2,
            imgUrl: 'https://wallpapercave.com/wp/e8xnTpf.jpg',
            cat: 'dance',
            prize: '$10 m',
            likes: '100 m',
            rank: 'First',
          },
        ],
      },
      {
        id: 3,
        monthName: 'February 2019',
        winnerList: [
          {
            id: 4,
            imgUrl: 'https://s3.amazonaws.com/ntbrand-wp/impressivenature/wp-content/uploads/2018/10/10165639/1-6-e1539204999298.jpeg',
            cat: 'other',
            prize: '$10 m',
            likes: '200 m',
            rank: 'First',
          },
          {
            id: 5,
            imgUrl: 'https://wallpapercave.com/wp/e8xnTpf.jpg',
            cat: 'jokes',
            prize: '$10 m',
            likes: '200 m',
            rank: 'First',
          },
          {
            id: 3,
            imgUrl: 'http://awesomebestpictures.com/images/rose-images-with-love/36024507-rose-images-with-love.jpg',
            cat: 'rap',
            prize: '$10 m',
            likes: '200 m',
            rank: 'First',
          },
          {
            id: 1,
            imgUrl: 'https://s3.amazonaws.com/ntbrand-wp/impressivenature/wp-content/uploads/2018/10/10165639/1-6-e1539204999298.jpeg',
            cat: 'sing',
            prize: '$10 m',
            likes: '200 m',
            rank: 'First',
          },
          {
            id: 2,
            imgUrl: 'https://wallpapercave.com/wp/e8xnTpf.jpg',
            cat: 'dance',
            prize: '$10 m',
            likes: '200 m',
            rank: 'First',
          },
        ],
      },
    ],
  };
}

componentDidMount() {
  const { navigation } = this.props;
  this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
}

componentWillUnmount() {
  if (this.onWillFocusSubscription) {
    this.onWillFocusSubscription.remove();
  }
}

onWillFocus = (payload) => {
  setLeaveBreadcrumb(payload);
}

goto = (page) => {
  const { navigation } = this.props;
  navigation.navigate(page);
}

render() {
  const { position, monthList } = this.state;
  const { navigation } = this.props;
  return (
    <View style={styles.container}>
      <CHeader
        showBackArrow
        showCenterText
        centerText
        onBackAction={() => { navigation.goBack(); }}
      />
      <View style={styles.MainView}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          ref={(o) => { this.winnerScroll = o; }}
          contentContainerStyle={styles.ScrollViewSty}
        >
          {_.isArray(monthList) && monthList.length > 0
            ? monthList.map(data => (
              <View>
                {_.isArray(data.winnerList) && data.winnerList.length > 0 ? (
                  <View key={`id_${data.id}`} style={styles.ScrollSubMainView}>
                    <View style={styles.MonthHeaderSty}>
                      <View style={styles.imgViewSty}>
                        <Image
                          source={require('../images/mtdlogo.png')}
                          style={styles.ImgSty}
                          resizeMode="cover"
                        />
                      </View>
                      <Text style={[common.textH3, common.semiBold, styles.MonthTitleSty]}>{data.monthName}</Text>
                    </View>

                    <ScrollView
                      bounces={false}
                      horizontal
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="always"
                      ref={(o) => { this.HorizontalScroll = o; }}
                      contentContainerStyle={{ flexGrow: 1 }}
                    >
                      {_.isArray(data.winnerList) && data.winnerList.length > 0
                        ? data.winnerList.map(data => (
                          <View
                            key={`id_${data.id}`}
                            style={{
                              padding: 10,
                              borderWidth: 1,
                              borderColor: '#E5E5E5',
                              borderRadius: 5,
                              elevation: 1,
                              marginVertical: 8,
                              marginRight: 10,
                              position: 'relative',
                              minWidth: 300,
                            }}
                          >
                            <View style={{ flexDirection: 'row' }}>
                              <View style={{
                                width: Dimensions.get('window').width - 225,
                                height: Dimensions.get('window').width - 225,
                                borderRadius: 5,
                                overflow: 'hidden',
                              }}
                              >
                                <Image
                                  source={{ uri: data.imgUrl }}
                                  style={{ width: '100%', height: '100%' }}
                                />
                              </View>

                              <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                <View style={{
                                  flexDirection: 'row', marginVertical: 2, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', alignItems: 'center', justifyContent: 'space-between',
                                }}
                                >
                                  <AIcon name="videocamera" style={{ color: '#0008', fontSize: RFValue(20) }} />
                                  <Text
                                    numberOfLines={1}
                                    style={[common.textNormal, { marginVertical: 5, color: '#0008' }]}
                                  >
                                    {data.cat}
                                  </Text>
                                </View>
                                <View style={{
                                  flexDirection: 'row', marginVertical: 2, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', alignItems: 'center', justifyContent: 'space-between',
                                }}
                                >
                                  <AIcon name="gift" style={{ color: '#0008', fontSize: RFValue(20) }} />
                                  <Text
                                    numberOfLines={1}
                                    style={[common.textNormal, { marginVertical: 5, color: '#0008' }]}
                                  >
                                    {data.prize}
                                  </Text>
                                </View>
                                <View style={{
                                  flexDirection: 'row', marginVertical: 2, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', alignItems: 'center', justifyContent: 'space-between',
                                }}
                                >
                                  <AIcon name="like2" style={{ color: '#0008', fontSize: RFValue(20) }} />
                                  <Text
                                    numberOfLines={1}
                                    style={[common.textNormal, { marginVertical: 5, color: '#0008' }]}
                                  >
                                    {data.likes}
                                  </Text>
                                </View>
                                <View style={{
                                  flexDirection: 'row', marginVertical: 2, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', alignItems: 'center', justifyContent: 'space-between',
                                }}
                                >
                                  <AIcon name="Trophy" style={{ color: '#0008', fontSize: RFValue(20) }} />
                                  <Text
                                    numberOfLines={1}
                                    style={[common.textNormal, { marginVertical: 5, color: '#0008' }]}
                                  >
                                    {data.rank}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
											  ))
											  : null}
                    </ScrollView>
                  </View>
                ) : null}
              </View>
            ))
            : null
          }
        </ScrollView>
      </View>
    </View>
  );
}
}

UserWinner.propTypes = {
  // authActions: PropTypes.objectOf(PropTypes.func),
  // auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
};

UserWinner.defaultProps = {
  // authActions: {},
  // auth: {},
  navigation: {},
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserWinner);
