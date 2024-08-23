import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Modal,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  // Image,
  // ScrollView,
  Dimensions,
  // Keyboard,
  FlatList,
  Platform,
} from "react-native";
import _ from "lodash";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IoIcon from "react-native-vector-icons/Ionicons";
// import colors from '../config/styles';
import common from "../config/genStyle";
import CInput from "./CInput";
import CCommentView from "./CCommentView";
import settings from "../config/settings";
import { getApiDataProgress } from "../redux/utils/apiHelper";
import CError from "./CError";
import CLoader from "./CLoader";
import { EAlert } from "./CAlert";
import CBannerAd from "./CBannerAd";

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
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: "hidden",
  },
  CloseIconViewSty: {
    position: "absolute",
    top: 0,
    right: 0,
    height: RFValue(50),
    width: RFValue(40),
    zIndex: 10,
    padding: RFValue(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
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
  BottomInputViewSty: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5E5",
    padding: 5,
  },
  InputViewSty: {
    backgroundColor: "#FFF",
    flex: 1,
    paddingLeft: RFValue(10),
  },
  DoneButtonSty: {
    width: RFValue(50),
    alignItems: "center",
    justifyContent: "center",
  },
  nextArrowIcon: {
    color: "#0006",
    fontSize: RFValue(25),
  },
  InputViewStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#8e8e93",
    borderBottomWidth: 1,
    borderBottomColor: "#8e8e93",
  },
  SearchView: {
    width: "100%",
    height: RFValue(50),
    backgroundColor: "#FFF",
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
});

class CComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      // IconFill: false,
      commentList: [],
      page: 1,
      isMore: true,
      searchText: "",
      pageLoader: true,
      loading: true,
      visible: false,
    };
  }

  openModal = () => {
    this.setState({ visible: true, loading: true }, () => {
      this.getAllComments(false, true);
    });
  };

  closeModal = () => {
    this.setState({ visible: false, searchText: "", commentList: [] });
  };

  getAllComments = (loadMore, search) => {
    const {
      id,
      auth: { token },
    } = this.props;
    const { page, commentList, isMore, searchText } = this.state;
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
        search ? { pageLoader: true, loading: true } : { pageLoader: true },
        () => {
          getApiDataProgress(
            `${settings.endpoints.getAllComments}?video_id=${id}&page=${pg}&q=${searchText}`,
            "get",
            {},
            headers,
            () => null
          )
            .then((response) => {
              // console.log(response);
              if (response.success === true) {
                Keyboard.dismiss();
                let dummyData = commentList;
                let PG = false;
                if (
                  loadMore &&
                  _.isObject(response.data) &&
                  _.isArray(response.data.rows)
                ) {
                  const { pagination, rows } = response.data;
                  dummyData = commentList.concat(rows);
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
                  commentList: dummyData,
                  page: pg,
                  isMore: PG,
                  pageLoader: false,
                  loading: false,
                });
              } else {
                this.setState({
                  commentList: [],
                  pageLoader: false,
                  loading: false,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.setState({
                commentList: [],
                pageLoader: false,
                loading: false,
              });
            });
        }
      );
    }
  };

  addComment = () => {
    Keyboard.dismiss();
    const {
      auth: { token },
      authActions: { setVideoData, trans },
      id,
    } = this.props;
    const { comment } = this.state;

    if (comment.trim() === "") {
      return;
    }

    const detail = {
      "VideoComment[video_id]": id,
      "VideoComment[comment]": comment,
    };

    const headers = {
      authorization: `Bearer ${token}`,
    };

    getApiDataProgress(
      settings.endpoints.addComment,
      "post",
      detail,
      headers,
      () => null
    )
      .then((response) => {
        console.log(response);
        if (response.success === true) {
          if (_.isArray(response.data) && !_.isEmpty(response.data)) {
            setVideoData(response.data);
          }
          this.setState({ comment: "", page: 1 }, () => {
            this.getAllComments(false, true);
          });
        } else {
          // this.setState({  });
          EAlert(response.message, trans("error_msg_title"));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderCommentView = ({ item, index }) => {
    const { gotoOtherUser } = this.props;
    return (
      <CCommentView
        {...this.props}
        key={`id_${index}`}
        gotoOtherUser={gotoOtherUser}
        data={item}
      />
    );
  };

  renderModalView = () => {
    const { comment, commentList, searchText, pageLoader, loading } =
      this.state;
    const {
      totalComments,
      auth: {
        token,
        adType: { admobUnitIdList },
      },
      authActions: { trans },
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={1}
        // onPress={closeModal}
        style={styles.ModalMainView}
      >
        <View style={styles.ModalMainViewSty}>
          <View style={styles.TopHeaderSty}>
            <Text numberOfLines={1} style={[common.textH4, common.semiBold]}>
              {trans("CComment_comment_text", { totalComment: totalComments })}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.CloseIconViewSty}
              onPress={this.closeModal}
            >
              <IoIcon name="md-close" style={styles.CloseIconSty} />
            </TouchableOpacity>
          </View>
          {admobUnitIdList &&
            admobUnitIdList["banner_Comment_Id"][Platform.OS] && (
              <CBannerAd
                bannerId={admobUnitIdList["banner_Comment_Id"][Platform.OS]}
              />
            )}

          {totalComments > 0 ? (
            <View style={styles.SearchView}>
              <View style={styles.InputViewStyle}>
                <View style={styles.IconViewSty}>
                  <IoIcon name="md-search" style={styles.SearchIconSty} />
                </View>
                <View style={{ flex: 1 }}>
                  <CInput
                    placeholder={trans("CComment_search_input_placeholder")}
                    keyboardType="default"
                    ref={(o) => {
                      this.searchInput = o;
                    }}
                    onChangeText={(t) => {
                      this.setState({ searchText: t });
                    }}
                    value={searchText}
                    onSubmitEditing={() => {
                      this.getAllComments(false, true);
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
          ) : null}

          {_.isArray(commentList) && !_.isEmpty(commentList) ? (
            <FlatList
              // bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              // pagingEnabled
              data={commentList}
              ref={(o) => {
                this.commentScroll = o;
              }}
              renderItem={this.renderCommentView}
              keyExtractor={(item, index) => `CCommentModal_key_${index}`}
              // onViewableItemsChanged={this.onViewableItemsChanged}
              // viewabilityConfig={{
              //   itemVisiblePercentThreshold: 50,
              // }}
              contentContainerStyle={styles.ScrollConSty}
              // contentContainerStyle={{ flexGrow: 1, backgroundColor: '#0000' }}
              onEndReached={() => this.getAllComments(true)}
            />
          ) : (
            <View style={styles.loaderView}>
              {pageLoader && loading ? (
                <CLoader />
              ) : (
                <CError
                  type={totalComments > 0 ? trans("error_msg_title") : " "}
                  errorText={
                    totalComments > 0
                      ? trans("CComment_no_user_found_text")
                      : trans("CComment_Be_the_first_comment_text")
                  }
                />
              )}
            </View>
          )}
          {/* <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            ref={(o) => { this.commentScroll = o; }}
            contentContainerStyle={styles.ScrollConSty}
          >
            {_.isArray(commentList) && commentList.length > 0 ? commentList.map((data, index) => (
              <CCommentView
                {...this.props}
                key={`id_${index}`}
                gotoOtherUser={gotoOtherUser}
                data={data}
              />
            )) : null}
          </ScrollView> */}
          {pageLoader && !loading ? (
            <CLoader />
          ) : // <View style={{ backgroundColor: '#FFF' }}>
          //   <ActivityIndicator size="large" color={colors.brandAppBackColor} />
          // </View>
          null}
          {token === "" || token === null || token === undefined ? null : (
            <View style={styles.BottomInputViewSty}>
              <CInput
                placeholder={trans("CComment_comment_input_placeholder")}
                keyboardType="default"
                ref={(o) => {
                  this.commentInput = o;
                }}
                onChangeText={(t) => {
                  this.setState({ comment: t });
                }}
                value={comment}
                // onSubmitEditing={() => { Keyboard.dismiss(); }}
                onSubmitEditing={() => this.addComment()}
                returnKeyType="done"
                selectionColor="#0009"
                blurOnSubmit={false}
                underlineColorAndroid="#0000"
                viewStyle={styles.InputViewSty}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                ref={(o) => {
                  this.password = o;
                }}
                onPress={() => this.addComment()}
                style={styles.DoneButtonSty}
              >
                <IoIcon name="md-arrow-forward" style={styles.nextArrowIcon} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { visible } = this.state;
    return (
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={this.closeModal}
      >
        {Platform.OS === "ios" ? (
          <KeyboardAwareScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {this.renderModalView()}
          </KeyboardAwareScrollView>
        ) : (
          this.renderModalView()
        )}
      </Modal>
    );
  }
}

CComment.propTypes = {
  modalVisible: PropTypes.bool,
  closeModal: PropTypes.func,
  auth: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
  gotoOtherUser: PropTypes.func,
  totalComments: PropTypes.string,
  loginModal: PropTypes.func,
};

CComment.defaultProps = {
  modalVisible: false,
  closeModal: null,
  auth: {},
  authActions: {},
  id: "",
  totalComments: "",
  gotoOtherUser: () => null,
  loginModal: () => null,
};

export default CComment;
