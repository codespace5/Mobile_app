import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  // ScrollView,
  Dimensions,
  Image,
  Keyboard,
  ActivityIndicator,
  FlatList,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import _ from "lodash";
import moment from "moment";
import IoIcon from "react-native-vector-icons/Ionicons";
import common from "../config/genStyle";
import CInput from "./CInput";
import { getApiDataProgress } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import colors from "../config/styles";
import CLoader from "./CLoader";
import CError from "./CError";

const styles = StyleSheet.create({
  ModalMainView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "relative",
  },
  TopHeaderSty: {
    width: "100%",
    height: RFValue(50),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#FFF",
    borderTopLeftRadius: RFValue(5),
    borderTopRightRadius: RFValue(5),
    overflow: "hidden",
  },
  SearchView: {
    width: "100%",
    height: RFValue(50),
    backgroundColor: "#FFF",
  },
  CloseIconViewSty: {
    position: "absolute",
    top: 0,
    right: 0,
    height: RFValue(50),
    width: RFValue(40),
    padding: RFValue(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    zIndex: 10,
  },
  CloseIconSty: {
    color: "#000",
    fontSize: RFValue(20),
  },
  ModalMainViewSty: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: Dimensions.get("window").height / 4,
    backgroundColor: "#FFF",
  },
  ScrollConSty: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(10),
  },
  commentMainView: {
    // width: '100%',
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    // justifyContent: 'space-around',
    backgroundColor: "#FFF",
    // marginBottom: 20,
    // marginTop: 5,
  },
  InputViewSty: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Platform.OS === "ios" ? "#0000" : "#8e8e93",
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#8e8e93",
  },
  IconViewSty: {
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  SearchIconSty: {
    color: "#8e8e93",
    fontSize: RFValue(20),
  },
  loaderView: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  voteView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: RFValue(10),
    marginTop: RFValue(5),
  },
  searchIconViewStyle: {
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  borderView: {
    borderBottomColor: "#8e8e93",
    borderBottomWidth: 1,
    paddingVertical: RFValue(13),
  },
});

class CVoteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      page: 1,
      voteList: [],
      isMore: true,
      pageLoading: true,
      loading: true,
      visible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { getList } = this.props;
    if (!_.isEqual(getList, nextProps.getList)) {
      this.getVoteList(false, true);
    }
  }

  openModal = () => {
    this.setState({ visible: true, loading: true }, () => {
      this.getVoteList(false, true);
    });
  };

  closeModal = () => {
    this.setState({ visible: false, searchText: "", voteList: [] });
  };

  getVoteList = (loadMore, search) => {
    const {
      id,
      auth: { token },
    } = this.props;
    const { page, voteList, isMore, searchText } = this.state;
    const headers = {
      authorization: `Bearer ${token}`,
    };

    let pg = page;
    if (loadMore) {
      pg = page + 1;
    } else if (search) {
      pg = 1;
    }

    if (isMore || search) {
      this.setState(
        search ? { pageLoading: true, loading: true } : { pageLoading: true },
        () => {
          getApiDataProgress(
            `${settings.endpoints.voteList}?video_id=${id}&page=${pg}&q=${searchText}`,
            "get",
            {},
            headers,
            () => null
          )
            .then((response) => {
              // console.log(response);
              if (response.success === true) {
                Keyboard.dismiss();
                let dummyData = voteList;
                let PG = false;
                if (
                  loadMore &&
                  _.isObject(response.data) &&
                  _.isArray(response.data.rows)
                ) {
                  const { pagination, rows } = response.data;
                  dummyData = voteList.concat(rows);
                  if (_.isObject(pagination)) {
                    PG = pagination.isMore;
                  }
                } else if (
                  _.isObject(response.data) &&
                  _.isArray(response.data.rows)
                ) {
                  const { pagination } = response.data;
                  dummyData = response.data.rows;
                  if (_.isObject(pagination)) {
                    PG = pagination.isMore;
                  }
                }
                this.setState({
                  voteList: dummyData,
                  page: pg,
                  isMore: PG,
                  pageLoading: false,
                  loading: false,
                });
              } else {
                this.setState({
                  voteList: [],
                  pageLoading: false,
                  loading: false,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.setState({
                voteList: [],
                pageLoading: false,
                loading: false,
              });
            });
        }
      );
    }
  };

  onPressAction = (data) => {
    const { gotoOtherUser } = this.props;
    if (_.isFunction(gotoOtherUser)) {
      gotoOtherUser(data);
    }
    return null;
  };

  renderVoteList = ({ item }) => (
    <View style={styles.voteView}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.commentMainView}
        onPress={() => {
          this.onPressAction(item);
        }}
      >
        <TouchableOpacity activeOpacity={0.8}>
          <Image
            style={{
              width: RFValue(34),
              height: RFValue(34),
              borderRadius: RFValue(17),
            }}
            source={{ uri: item.photo }}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            paddingLeft: RFValue(8),
            paddingRight: RFValue(15),
          }}
        >
          <Text
            numberOfLines={1}
            style={[common.textNormal, common.semiBold]}
          >{`@${item.username}`}</Text>
          <Text numberOfLines={1} style={[common.textSmall]}>
            {moment(item.time * 1000).fromNow()}{" "}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text style={{ color: "#000" }}>{item.vote}</Text>
      </View>
    </View>
  );

  render() {
    const { voteList, searchText, pageLoading, visible, loading } = this.state;
    const {
      totalVote,
      authActions: { trans },
      data: { is_winner },
    } = this.props;
    return (
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={this.closeModal}
      >
        <TouchableOpacity activeOpacity={1} style={styles.ModalMainView}>
          <View style={styles.ModalMainViewSty}>
            <View style={styles.TopHeaderSty}>
              <Text numberOfLines={1} style={[common.textH4, common.semiBold]}>
                {trans("CVoteModal_vote_text", { totalVote })}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.CloseIconViewSty}
                onPress={this.closeModal}
              >
                <IoIcon name="md-close" style={styles.CloseIconSty} />
              </TouchableOpacity>
            </View>

            <View style={styles.SearchView}>
              <View style={styles.InputViewSty}>
                <View
                  style={[
                    styles.searchIconViewStyle,
                    Platform.OS === "ios" ? styles.borderView : {},
                  ]}
                >
                  <IoIcon name="md-search" style={styles.SearchIconSty} />
                </View>
                <View style={{ flex: 1 }}>
                  <CInput
                    placeholder={trans("CVoteModal_search_input_placeholder")}
                    keyboardType="default"
                    ref={(o) => {
                      this.searchInput = o;
                    }}
                    onChangeText={(t) => {
                      this.setState({ searchText: t });
                    }}
                    value={searchText}
                    onSubmitEditing={() => {
                      this.getVoteList(false, true);
                    }}
                    returnKeyType="go"
                    selectionColor="#0009"
                    blurOnSubmit={false}
                    underlineColorAndroid="#0000"
                    viewStyle={{ paddingHorizontal: 2, height: "100%" }}
                    inputStyle={{ borderBottomWidth: 0 }}
                  />
                </View>
              </View>
            </View>

            {_.isArray(voteList) && !_.isEmpty(voteList) ? (
              <FlatList
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                // pagingEnabled
                data={voteList}
                ref={(o) => {
                  this.commentScroll = o;
                }}
                renderItem={this.renderVoteList}
                keyExtractor={(item, index) => `CVoteModal_data_item_${index}`}
                contentContainerStyle={styles.ScrollConSty}
                onEndReached={() => this.getVoteList(true)}
              />
            ) : (
              <View style={styles.loaderView}>
                {pageLoading && loading ? (
                  <CLoader />
                ) : (
                  <CError errorText={trans("CVoteModal_no_user_found_text")} />
                )}
              </View>
            )}

            {pageLoading && !loading ? (
              <View style={{ backgroundColor: "#FFF" }}>
                <ActivityIndicator
                  size="large"
                  color={colors.brandAppBackColor}
                />
              </View>
            ) : null}
            {/* <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              ref={(o) => { this.commentScroll = o; }}
              contentContainerStyle={styles.ScrollConSty}
            >
              {_.isArray(voteList) && voteList.length > 0 ? voteList.map((data, index) => (
                <TouchableOpacity
                  // eslint-disable-next-line react/no-array-index-key
                  key={`CVoteModal_data_item_${index}`}
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
                    <Text numberOfLines={1} style={[common.textSmall]}>
                      {moment(data.time * 1000).fromNow()}
                      {' '}
                    </Text>
                  </View>
                </TouchableOpacity>
              )) : null}
            </ScrollView> */}
            <Text
              style={[
                common.textNormal,
                common.semiBold,
                common.txtCenter,
                common.MB10,
              ]}
            >
              {trans("CVoteModal_vote_once_time")}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

CVoteModal.propTypes = {
  gotoOtherUser: PropTypes.func,
  auth: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
  totalVote: PropTypes.string,
  getList: PropTypes.bool,
  authActions: PropTypes.objectOf(PropTypes.any),
};

CVoteModal.defaultProps = {
  gotoOtherUser: null,
  auth: {},
  id: "",
  totalVote: "",
  getList: false,
  authActions: {},
};

export default CVoteModal;
