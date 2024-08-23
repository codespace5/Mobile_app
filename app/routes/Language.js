import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from 'react-native-i18n';
import CHeader from '../components/CHeader';
import CLanguage from '../components/CLanguage';
import authActions from '../redux/reducers/auth/actions';
import settings from '../config/settings';
import { getApiData } from '../redux/utils/apiHelper';
import CLoader from '../components/CLoader';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

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
});
class Language extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      languageData: [],
      selectedLanguageData: {},
      loading: true,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.didFocusSubscription = navigation.addListener('didFocus', this.onDidFocus);
    this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
  }

  componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }

    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onDidFocus = (payload) => {
    this.languagesList();
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  }

  selectLanguageData = (dataObj) => {
    const { selectedLanguageData } = this.state;
    this.setState({ selectedLanguageData: _.isEqual(selectedLanguageData, dataObj) ? {} : dataObj }, () => {
      console.log(selectedLanguageData);
    });
  }

  SubmitSelectLanguage = () => {
    const { auth: { token }, navigation } = this.props;
    const { selectedLanguageData } = this.state;
    const data = {
      language_id: _.isObject(selectedLanguageData)
        && _.isString(selectedLanguageData.language_id)
        && selectedLanguageData.language_id !== ''
        ? selectedLanguageData.language_id : '',
    };

    this.setState({ loading: true }, () => {
      getApiData(settings.endpoints.set_language, 'get', data, {
        Authorization: `Bearer ${token}`,
      })
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success === true) {
            // navigation.goBack();
            this.setCountry(selectedLanguageData);
          } else {
            this.setState({ loading: false });
            console.log('responseJson.success === false');
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
    });
  }

  setCountry = (selectedCountry) => {
    const { authActions: { setLanguage }, navigation } = this.props;
    setLanguage(selectedCountry);
    this.setData(selectedCountry);

    const data = {
      lang_id: selectedCountry.language_id,
    };

    getApiData(settings.endpoints.getLanguage, 'get', data, {}).then((response) => {
      console.log('new language data =====>>>>');
      console.log(response);
      if (response.success) {
        if (_.isObject(response.data)) {
          console.log(response.data);
          this.setState({ loading: false });
          I18n.translations.en = response.data;
          navigation.goBack();
        }
      } else {
        console.log('language get data success false ====');
        this.setState({ loading: false });
      }
    }).catch((err) => {
      console.log(err);
      this.setState({ loading: false });
    });
  }

  setData = async (data) => {
    const detail = JSON.stringify(data);
    try {
      await AsyncStorage.multiSet([['languageData', 'true'], ['languageData', detail]], (err) => {
        console.log(err);
      }).then((r) => {
        console.log(r);
      });
    } catch (error) {
      console.log(error);
    }
  }

  setSelectData = () => {
    const { languageData } = this.state;

    if (_.isArray(languageData) && languageData.length > 0) {
      languageData.map((data) => {
        if (_.isNumber(data.is_selected) && data.is_selected === 1) {
          this.setState({ selectedLanguageData: data });
        }
      });
    }
  }

  languagesList = () => {
    const { auth: { token } } = this.props;
    this.setState({ languageData: [], loading: true }, () => {
      getApiData(settings.endpoints.get_languages, 'get', null, {
        Authorization: `Bearer ${token}`,
      }, null)
        .then((responseJson) => {
          if (responseJson.success === true) {
            if (_.isArray(responseJson.data)) {
              this.setState({
                languageData: responseJson.data.length > 0 ? responseJson.data : [],
                loading: false,
              }, () => {
                this.setSelectData();
              });
            } else {
              this.setState({
                languageData: [],
                loading: false,
              });
            }
          } else {
            this.setState({
              languageData: [],
              loading: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ languageData: [], loading: false });
        });
    });
  }

  renderMainSubView = () => {
    const { languageData, selectedLanguageData } = this.state;
    return (
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.ScrollViewConSty}
      >
        {_.isArray(languageData) && languageData.length > 0 ? (
          languageData.map((data, index) => (
            <CLanguage
              key={`id_${index}`}
              data={data}
              selectedData={selectedLanguageData}
              selectLanguage={() => { this.selectLanguageData(data); }}
            />
          ))
        ) : null}
      </ScrollView>
    );
  }

  render() {
    const { navigation, authActions: { trans } } = this.props;
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          centerText={trans('Languages_page_title')}
          showRightIcon={false}
          showRightText
          rightText={trans('Languages_right_btn_text')}
          onRightIconAction={this.SubmitSelectLanguage}
          onBackAction={() => { navigation.goBack(); }}
        />
        {loading ? <CLoader /> : this.renderMainSubView()}
      </View>
    );
  }
}

Language.propTypes = {
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
};

Language.defaultProps = {
  auth: {},
  navigation: {},
  authActions: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(Language);
