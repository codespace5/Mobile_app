// import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import IoIcon from 'react-native-vector-icons/Ionicons';
import common from '../config/genStyle';
import getCmsData from '../redux/utils/getCmsData';
import CLoader from './CLoader';

// define your styles
const styles = StyleSheet.create({
  ModalMainView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    padding: 25,
  },
  OtherMainView: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  HeaderViewSty: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#8e8e93',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  infoViewSty: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  infoTextSty: {
    marginVertical: 10,
    color: '#0008',
    letterSpacing: 0.3,
    lineHeight: 19,
  },
  otherScrollSty: {
    paddingRight: 15,
    paddingBottom: 50,
  },
  HeaderTextTitle: {
    marginTop: 10,
    marginBottom: 20,
    color: '#404040',
  },
  loaderView: {
    height: '100%',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
  },
});

class CTermsOfVideoContest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      termsText: '',
    };
  }

  openModal = () => {
    this.setState({ visible: true, loading: true }, () => {
      this.getData();
    });
  }

  closeModal = () => {
    this.setState({ visible: false });
  }

  getData = async () => {
    try {
      const TermsanduseData = await getCmsData('terms-of-video-contest');
      if (TermsanduseData.success === true) {
        if (_.isObject(TermsanduseData.data)) {
          if (_.isString(TermsanduseData.data.app_body) && TermsanduseData.data.app_body !== '') {
            this.setState({
              termsText: TermsanduseData.data.app_body,
              loading: false,
            });
          }
        }
      } else {
        this.setState({ termsText: '', loading: false });
      }
    } catch (e) {
      console.log(e);
      this.setState({ termsText: '', loading: false });
    }
  }

  render() {
    const { visible, loading, termsText } = this.state;
    const { authActions: { trans } } = this.props;
    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={this.closeModal}
      >
        <View style={styles.ModalMainView}>
          <View style={styles.OtherMainView}>
            <View style={styles.HeaderViewSty}>
              <Text numberOfLines={1} style={[common.headerTitle]}>
                {trans('CTermsOfVideoContest_modal_title')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ alignItems: 'flex-end', justifyContent: 'center', zIndex: 10, padding: 10 }}
                onPress={this.closeModal}
              >
                <IoIcon name="md-close" style={{ fontSize: RFValue(25), color: '#000' }} />
              </TouchableOpacity>
            </View>
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              ref={(o) => { this.privacyScroll = o; }}
              contentContainerStyle={styles.infoViewSty}
            >
              {/* <Text numberOfLines={1} style={[common.textH3, styles.HeaderTextTitle]}>
                {'Last updated: March 2019'}
              </Text> */}

              <View style={styles.otherScrollSty}>
                <View style={styles.otherScrollSty}>
                  {loading ? (
                    <View style={styles.loaderView}>
                      <CLoader />
                    </View>
                  ) : (
                    <Text
                      style={[common.textH4, styles.infoTextSty]}
                    >
                      {_.isString(termsText) && termsText !== '' ? termsText : ''}
                    </Text>
                  )}
                </View>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

CTermsOfVideoContest.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
};

CTermsOfVideoContest.defaultProps = {
  authActions: {},
};

export default CTermsOfVideoContest;
