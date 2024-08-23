/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  AsyncStorage,
  Platform,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { bindActionCreators } from 'redux';
import IoIcon from 'react-native-vector-icons/Ionicons';
import CHeader from '../components/CHeader';
// import colors from '../config/styles';
// import { Icon } from '../config/icons';
import authActions from '../redux/reducers/auth/actions';
import homeActions from '../redux/reducers/home/actions';
import { getApiData } from '../redux/utils/apiHelper';
import settings from '../config/settings';
import CCountry from '../components/CCountry';
import CLoader from '../components/CLoader';
import CInput from '../components/CInput';
import { strIncludes, setLeaveBreadcrumb } from '../redux/utils/CommonFunction';
import CError from '../components/CError';
// import settings from '../config/settings';
// import { getApiData } from '../redux/utils/apiHelper';

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  ScrollViewConSty: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  inputViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Platform.OS === 'ios' ? '#0000' : '#8e8e93',
    backgroundColor: '#FFF',
  },
  searchIconViewStyle: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderView: {
    borderBottomColor: '#8e8e93',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  // SearchView: {
  //   width: '100%',
  //   height: 50,
  //   backgroundColor: '#FFF',
  //   borderBottomWidth: 1,
  // },
  SearchIconSty: {
    color: '#8e8e93',
    fontSize: RFValue(20),
  },
});
class Country extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      countryList: [],
      loading: true,
      selectCountryData: {},
      searchText: '',
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
    this.didFocusSubscription = navigation.addListener('didFocus', this.onDidFocus);
  }

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }

    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  }

  onDidFocus = (payload) => {
    this.getCountryList();
  }

  getCountryList = () => {
    const { auth: { token } } = this.props;

    const headers = {
      authorization: `Bearer ${token}`,
    };

    this.setState({ loading: true }, () => {
      getApiData(settings.endpoints.get_countries, 'get', {}, headers, () => null).then((response) => {
        console.log(response);
        if (response.success) {
          if (_.isArray(response.data) && response.data.length > 0) {
            this.setState({ countryList: response.data, loading: false }, () => {
              this.setSelectData();
            });
          } else {
            this.setState({ countryList: [], loading: false });
          }
        } else {
          this.setState({ countryList: [], loading: false });
        }
      }).catch((err) => {
        console.log(err);
        this.setState({ countryList: [], loading: false });
      });
    });
  }

  submitSelectCountry = () => {
    const { auth: { token, userOtherData }, authActions: { setUserOtherData, setCountry }, navigation, setTabData } = this.props;
    const { selectCountryData } = this.state;

    const detail = {
      country_id: _.isObject(selectCountryData) && selectCountryData.id !== '' ? selectCountryData.id : '',
    };

    const headers = {
      authorization: `Bearer ${token}`,
    };

    this.setState({ loading: true }, () => {
      getApiData(settings.endpoints.set_country, 'get', detail, headers, () => null).then((response) => {
        console.log(response);
        if (response.success) {
          if (_.isObject(response.data) && _.isObject(userOtherData)) {
            const { country_code, country_img, country_name } = response.data;
            const uData = userOtherData;
            uData.countryImg = country_img;
            uData.code = country_code;
            uData.countryName = country_name;

            // console.log(uData);
            // setCountry(true);
            setCountry(country_code);
            setTimeout(() => {
              setUserOtherData(uData);
              this.setData(uData);
            }, 100);

            /* Set live prices on country change */
            if (response.data.live_prices) {
              setTabData(response.data.live_prices);
            }
          }
          navigation.navigate('Home');
          // navigation.navigate('Home', {
          //   load: true,
          // });
          // navigation.goBack();
        } else {
          console.log('country not set ====');
        }
      }).catch((err) => {
        console.log(err);
        this.setState({ countryList: [], loading: false });
      });
    });
  }

  setData = async (uData) => {
    const detail = JSON.stringify(uData);
    try {
      await AsyncStorage.multiSet([['userOtherData', 'true'], ['userOtherData', detail]], (err) => {
        console.log(err);
      }).then((r) => {
        console.log(r);
      });
    } catch (error) {
      console.log(error);
    }
  }

  selectCountryData = (data) => {
    console.log(data);
    const { selectCountryData } = this.state;
    this.setState({ selectCountryData: _.isEqual(selectCountryData, data) ? selectCountryData : data }, () => {
      console.log(selectCountryData);
    });
  }

  setSelectData = () => {
    const { countryList } = this.state;
    const { authActions: { setCountry } } = this.props;
    if (_.isArray(countryList) && countryList.length > 0) {
      countryList.map((data) => {
        // if (data.is_selected === 1) {
        //   console.log(data);
        // }
        if (_.isNumber(data.is_selected) && data.is_selected === 1) {
          this.setState({ selectCountryData: data });
          // setCountry(data);
        }
      });
    }
  }

  getFilteredData = () => {
    const { countryList, searchText } = this.state;
    let cList = [];
    if (
      _.isObject(countryList)
      && _.isArray(countryList)
      && countryList.length > 0
    ) {
      cList = countryList;
      if (_.isString(searchText) && searchText !== '') {
        cList = _.filter(cList, (country) => {
          const countryName = _.isString(country.country_name)
            && strIncludes(country.country_name, searchText);
          return countryName;
        });
      }
      return cList;
    }
    return cList;
  }

  renderMainSubView = () => {
    const { selectCountryData, searchText } = this.state;
    const { authActions: { trans } } = this.props;
    const filterData = this.getFilteredData();
    return (
      <View style={{ flex: 1 }}>
        {/* <View style={styles.SearchView}> */}
        <View style={styles.inputViewStyle}>
          <View style={[styles.searchIconViewStyle, Platform.OS === 'ios' ? styles.borderView : {}]}>
            <IoIcon name="md-search" style={styles.SearchIconSty} />
          </View>
          <View style={{ flex: 1 }}>
            <CInput
              placeholder={trans('Country_search_input_placeholder')}
              keyboardType="default"
              ref={(o) => { this.searchInput = o; }}
              onChangeText={(t) => { this.setState({ searchText: t }); }}
              value={searchText}
              onSubmitEditing={() => { Keyboard.dismiss(); }}
              selectionColor="#0009"
              returnKeyType="go"
              blurOnSubmit={false}
              underlineColorAndroid
              viewStyle={{ paddingHorizontal: 2 }}
              inputStyle={{ borderBottomWidth: 0 }}
            />
          </View>
        </View>
        {/* </View> */}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.ScrollViewConSty}
        >
          {_.isArray(filterData) && filterData.length > 0 ? (
            filterData.map((data, index) => (
              <CCountry
                key={`id_${index}`}
                data={data}
                selectedData={selectCountryData}
                selectCountry={() => this.selectCountryData(data)}
              />
            ))
          ) : <CError errorText={trans('Country_no_country_text')} />}
        </ScrollView>
      </View>
    );
  }

  renderLoader = () => (
    <CLoader />
  )

  render() {
    const { navigation, authActions: { trans } } = this.props;
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          centerText={trans('Country_page_title')}
          showRightIcon={false}
          showRightText
          rightText={trans('Country_right_btn_text')}
          onRightIconAction={this.submitSelectCountry}
          onBackAction={() => { navigation.goBack(); }}
          // onBackAction={() => { navigation.navigate('Home', { load: false }); }}
        />
        {loading ? <CLoader /> : this.renderMainSubView()}
      </View>
    );
  }
}

Country.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  setTabData: PropTypes.objectOf(PropTypes.any),
};

Country.defaultProps = {
  navigation: {},
  auth: {},
  authActions: {},
  setTabData: () => {},
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  const { setTabData } = homeActions;
  return {
    authActions: bindActionCreators(authActions, dispatch),
    setTabData: bindActionCreators(setTabData, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Country);
