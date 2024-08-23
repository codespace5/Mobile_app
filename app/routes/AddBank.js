/* eslint-disable react/jsx-one-expression-per-line */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import CHeader from '../components/CHeader';
import common from '../config/genStyle';
import colors from '../config/styles';
import CButton from '../components/CButton';
import authActions from '../redux/reducers/auth/actions';
import settings from '../config/settings';
import { getApiDataProgress } from '../redux/utils/apiHelper';
import { CAlert } from '../components/CAlert';
import CError from '../components/CError';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';


// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  bankaccwrap: {
    marginBottom: 20,
    // marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bankaccdetails: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#8e8e93',
  },
  FlexDR: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bankdetailswrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnwrap: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
    justifyContent: 'flex-end',
  },
  CommonLoaderErrorViewSty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// create a component
class AddBank extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      bankArray: [],
      selectBankId: 0,
      loading: true,
    };
  }

  componentDidMount = () => {
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
    this.submitBankListForm();
  }

  Deletebank = (data) => {
    const { auth: { token }, authActions: { setToken } } = this.props;
    console.log(token);

    getApiDataProgress(`${settings.endpoints.delete_bank}?id=${data.id}`, 'get', null, {
      Authorization: `Bearer ${token}`,
    }, null)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          this.submitBankListForm();
        } else if (_.isObject(responseJson) && _.isObject(responseJson.data)
        && _.isString(responseJson.data.name) && responseJson.data.name === 'Unauthorized'
        && responseJson.status === 401) {
          setToken('');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  Selectbank = (data) => {
    const { auth: { token } } = this.props;
    const { selectBankId } = this.state;
    console.log(token);

    getApiDataProgress(`${settings.endpoints.set_bank}?bank_id=${data.id}`, 'get', null, {
      Authorization: `Bearer ${token}`,
    }, null)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          this.setState({ selectBankId: selectBankId === data.id ? 0 : data.id });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setSelectBank = () => {
    const { bankArray } = this.state;
    if (_.isArray(bankArray) && bankArray.length > 0) {
      bankArray.map((data) => {
        console.log(data);
        if (_.isNumber(data.is_selected) && data.is_selected === 1) {
          this.setState({ selectBankId: data }, () => this.Selectbank(data));
        }
      });
    }
  }

  submitBankListForm = () => {
    const { auth: { token }, authActions: { setToken } } = this.props;
    console.log(token);
    this.setState({ bankArray: [], loading: true }, () => {
      getApiDataProgress(`${settings.endpoints.get_bank}`, 'get', null, {
        Authorization: `Bearer ${token}`,
      }, null)
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success === true) {
            if (_.isArray(responseJson.data) && responseJson.data.length > 0) {
              this.setState({
                bankArray: responseJson.data,
                loading: false,
              }, () => {
                this.setSelectBank();
              });
            } else {
              this.setState({
                bankArray: [],
                loading: false,
              });
            }
          } else if (_.isObject(responseJson) && _.isObject(responseJson.data)
          && _.isString(responseJson.data.name) && responseJson.data.name === 'Unauthorized'
          && responseJson.status === 401) {
            setToken('');
            this.setState({ bankArray: [], loading: false });
          } else {
            this.setState({
              bankArray: [],
              loading: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ bankArray: [], loading: false });
        });
    });
  }

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  }

  renderMainSubView = () => {
    const {
      bankArray,
      selectBankId,
    } = this.state;
    const { authActions: { trans } } = this.props;
    const iosBorder = Platform.OS === 'ios' ? 1 : 0;
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10 }}
      >
        {_.isArray(bankArray) && bankArray.length > 0 ? (
          bankArray.map((data, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={`id_${index}`}
              style={[
                styles.bankaccwrap,
                {
                  borderBottomWidth: selectBankId === data.id ? 5 : iosBorder,
                  borderBottomColor: Platform.OS === 'ios' && selectBankId !== data.id ? '#E0E0E0' : colors.brandAppBackColor,
                },
              ]}
            >
              <View style={{ paddingVertical: 10 }}>
                <View style={styles.FlexDR}>
                  <Text style={[common.textNormal, { flex: 0.8 }]}>{trans('AddBank_bank_name')}</Text>
                  <Text style={{ flex: 1.2, textAlign: 'right' }}>{_.isString(data.bank_name) && data.bank_name !== '' ? data.bank_name : ''}</Text>
                </View>
                <View style={styles.FlexDR}>
                  <Text style={[common.textNormal]}>{trans('AddBank_account_number')}</Text>
                  <Text style={{ textAlign: 'right' }}>{_.isString(data.bank_account_no) && data.bank_account_no !== '' ? data.bank_account_no : ''} </Text>
                </View>
                <View style={styles.FlexDR}>
                  <Text style={[common.textNormal, { flex: 0.8 }]}>{trans('AddBank_holder_name')}</Text>
                  <Text style={{ flex: 1.2, textAlign: 'right' }}>
                    {_.isString(data.bank_holder_name) && data.bank_holder_name !== '' ? data.bank_holder_name : ''}
                  </Text>
                </View>
                <View style={styles.FlexDR}>
                  <Text style={[common.textNormal]}>{trans('AddBank_phone_number')}</Text>
                  <Text>{_.isString(data.phone) && data.phone !== '' ? data.phone : ''}</Text>
                </View>
                {/* {data.bank_other !== '' ? (
                  <View style={[styles.FlexDR, { overflow: 'hidden' }]}>
                    <Text style={[common.textNormal, { flex: 0.5 }]}>Comment</Text>
                    <Text style={{ flex: 1.5, textAlign: 'right' }}>{_.isString(data.bank_other) && data.bank_other !== '' ? data.bank_other : ''}</Text>
                  </View>
                ) : null} */}

                {data.bank_other !== '' ? (
                  <View style={{ borderTopWidth: 1, borderTopColor: '#E0E0E0', marginVertical: 5 }}>
                    <Text style={[common.textNormal, { flex: 0.5, marginVertical: 5 }]}>{trans('AddBank_other_detail')}</Text>
                    <Text style={{ flex: 1.5 }}>{_.isString(data.bank_other) && data.bank_other !== '' ? data.bank_other : ''}</Text>
                  </View>
                ) : null}

              </View>
              {selectBankId === data.id ? null : (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CButton
                    Addbank
                    btnText={trans('AddBank_btn_text')}
                    btnStyle={{
                      padding: Platform.OS === 'ios' ? 4 : 0, margin: 0, width: '25%', height: '80%',
                    }}
                    textStyle={[common.textSmall, common.semiBold, { color: '#FFF', fontSize: RFValue(10) }]}
                    onPress={() => { this.Selectbank(data); }}
                    onChnage={() => { this.setSelectBank(data); }}
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      CAlert(trans('AddBank_delete_bank_alert'), trans('error_msg_title'),
                        () => {
                          this.Deletebank(data);
                        },
                        () => {});
                    }}
                  >
                    <MIcon
                      name="delete"
                      size={18}
                      style={{ color: '#404040' }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          this.renderLoader()
        )
        }
      </ScrollView>
    );
  }

  renderLoader = () => {
    const { loading } = this.state;
    const { authActions: { trans } } = this.props;
    if (loading) {
      return (
        <View style={styles.CommonLoaderErrorViewSty}>
          <ActivityIndicator size="small" color={colors.brandAppBackColor} animating />
        </View>
      );
    }
    return (
      <CError errorText={trans('AddBank_no_bank_detail_text')} />
    );
  }

  render() {
    const { navigation, authActions: { trans } } = this.props;
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          centerText={trans('AddBank_page_title')}
          showRightText
          ShowRightIcon
          rightIconName="Add"
          onRightIconAction={() => { this.goto('BankDetails'); }}
          onBackAction={() => { navigation.goBack(); }}
        />
        {this.renderMainSubView()}
      </View>
    );
  }
}

AddBank.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.func),
  auth: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
};

AddBank.defaultProps = {
  navigation: {},
  auth: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(AddBank);
