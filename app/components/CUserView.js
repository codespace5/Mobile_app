import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  // ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import moment from 'moment';
import IoIcon from 'react-native-vector-icons/Ionicons';
import common from '../config/genStyle';
import { getApiDataProgress } from '../redux/utils/apiHelper';
import settings from '../config/settings';
import colors from '../config/styles';

const styles = StyleSheet.create({
  ModalMainView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'relative',
  },
  TopHeaderSty: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
  },
  CloseIconViewSty: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 50,
    width: 40,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    zIndex: 10,
  },
  CloseIconSty: {
    color: '#000',
    fontSize: RFValue(20),
  },
  ModalMainViewSty: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: Dimensions.get('window').height / 4,
  },
  ScrollConSty: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
  },
  commentMainView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    marginBottom: 20,
    marginTop: 5,
  },
});

class CUserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewList: [],
      page: 1,
      isMore: true,
      loading: true,
      visible: false,
    };
  }

  openModal = () => {
    this.setState({ visible: true }, () => {
      this.getViewList();
    });
  }

  closeModal = () => {
    this.setState({ visible: false });
  }

  getViewList = (loadMore) => {
    const { id, auth: { token } } = this.props;
    const { page, viewList, isMore } = this.state;
    const headers = {
      authorization: `Bearer ${token}`,
    };

    let pg = page;
    if (loadMore) {
      pg = page + 1;
    }

    if (isMore) {
      this.setState({ loading: true }, () => {
        getApiDataProgress(`${settings.endpoints.getAllViewsList}?video_id=${id}&page=${pg}`, 'get', {}, headers, () => null).then((response) => {
          // console.log(response);
          if (response.success === true) {
            let dummyData = viewList;
            let PG = false;
            if (loadMore && _.isObject(response.data) && _.isArray(response.data.rows)) {
              const { pagination, rows } = response.data;
              dummyData = viewList.concat(rows);
              if (_.isObject(pagination)) {
                PG = pagination.isMore;
              }
            } else if (_.isObject(response.data) && _.isArray(response.data.rows)) {
              const { pagination } = response.data;
              dummyData = response.data.rows;
              if (_.isObject(pagination)) {
                PG = pagination.isMore;
              }
            }
            this.setState({
              viewList: dummyData,
              page: pg,
              isMore: PG,
              loading: false,
            });
          } else {
            this.setState({ viewList: [], loading: false });
          }
        }).catch((err) => {
          console.log(err);
          this.setState({ viewList: [], loading: false });
        });
      });
    }
  }

  onPressAction = (data) => {
    const { gotoOtherUser } = this.props;
    if (_.isFunction(gotoOtherUser)) {
      gotoOtherUser(data);
    }
    return null;
  }

  renderUserView = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.commentMainView}
      onPress={() => { this.onPressAction(item); }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
      >
        <Image
          style={{ width: 34, height: 34, borderRadius: 17 }}
          source={{ uri: item.photo }}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={{ flex: 1, paddingLeft: 8, paddingRight: 15 }}>
        <Text numberOfLines={1} style={[common.textNormal, common.semiBold]}>{`@${item.username}`}</Text>
        <Text numberOfLines={1} style={[common.textSmall]}>
          {moment(item.time * 1000).fromNow()}
        </Text>
      </View>
    </TouchableOpacity>
  )

  render() {
    const { viewList, loading, visible } = this.state;
    const { totalView, authActions: { trans } } = this.props;
    return (
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={this.closeModal}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.ModalMainView}
        >
          <View style={styles.ModalMainViewSty}>
            <View style={styles.TopHeaderSty}>
              <Text numberOfLines={1} style={[common.textH4, common.semiBold]}>{trans('CUserView_view_text', { totalView })}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.CloseIconViewSty}
                onPress={this.closeModal}
              >
                <IoIcon name="md-close" style={styles.CloseIconSty} />
              </TouchableOpacity>
            </View>

            <FlatList
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              pagingEnabled
              data={viewList}
              ref={(o) => { this.commentScroll = o; }}
              renderItem={this.renderUserView}
              keyExtractor={(item, index) => `CUserViewModal_data_item_${index}`}
              contentContainerStyle={styles.ScrollConSty}
              onEndReached={() => this.getViewList(true)}
            />
            {loading ? (
              <View style={{ backgroundColor: '#FFF' }}>
                <ActivityIndicator size="large" color={colors.brandAppBackColor} />
              </View>
            ) : null}
            {/* <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              ref={(o) => { this.commentScroll = o; }}
              contentContainerStyle={styles.ScrollConSty}
            >
              {_.isArray(viewList) && viewList.length > 0 ? viewList.map((data, index) => (
                <TouchableOpacity
                  // eslint-disable-next-line react/no-array-index-key
                  key={`CUserView_data_item_${index}`}
                  activeOpacity={0.8}
                  style={styles.commentMainView}
                  onPress={gotoOtherUser}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                  >
                    <Image
                      style={{ width: 34, height: 34, borderRadius: 17 }}
                      source={{ uri: data.photo }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  <View style={{ flex: 1, paddingLeft: 8, paddingRight: 15 }}>
                    <Text numberOfLines={1} style={[common.textNormal, common.semiBold]}>{data.username}</Text>
                    <Text numberOfLines={1} style={[common.textSmall]}>{moment(data.time * 1000).fromNow()}</Text>
                  </View>
                </TouchableOpacity>
              )) : null}
            </ScrollView> */}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

CUserView.propTypes = {
  modalVisible: PropTypes.bool,
  closeModal: PropTypes.func,
  gotoOtherUser: PropTypes.func,
  auth: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
  totalView: PropTypes.string,
  authActions: PropTypes.objectOf(PropTypes.any),
};

CUserView.defaultProps = {
  modalVisible: false,
  closeModal: null,
  gotoOtherUser: null,
  auth: {},
  id: '',
  totalView: '',
  authActions: {},
};

export default CUserView;
