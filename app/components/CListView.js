/* eslint-disable react/prop-types */
/* eslint-disable import/named */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import colors from '../config/styles';
import { FORTAB } from '../config/MQ';
import settings from '../config/settings';
import common from '../config/genStyle';
// import authActions from '../redux/reducers/auth/actions';
import CNotification from './CNotification';
// import CFollowers from './CFollowers';
import CWinnerList from './CWinnerList';
import CProfileVideo from './CProfileVideo';
import CSearchUserList from './CSearchUserList';
import CSearchVideoList from './CSearchVideoList';

const styles = StyleSheet.create({
  scrollCont: {
    flexGrow: 1,
    backgroundColor: '#0000',
  },
  noItemsCont: {
    // flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
  },
  noItemsText: {
    color: '#aaa',
    fontSize: RFValue(17),
    fontFamily: colors.fonts.proximaNova.regular,
    backgroundColor: '#0000',
    textAlign: 'center',
    marginTop: 20,
  },
  CatView: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: FORTAB ? 25 : 15,
    backgroundColor: '#fff',
    borderColor: '#EEE',
    borderWidth: 1,
    elevation: 2,
    marginBottom: 5,
  },
  SubView: {
    flexDirection: 'column',
    padding: FORTAB ? 15 : 10,
    backgroundColor: '#fff',
    marginHorizontal: FORTAB ? 15 : 5,
    marginVertical: FORTAB ? 15 : 5,
  },
  CommonText: {
    color: '#333',
    fontFamily: colors.fonts.proximaNova.regular,
    fontSize: FORTAB ? 20 : 18,
  },
  CommonSty: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  CommonFlexSty: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  SerIconStyle: {
    color: colors.brandBtnColor,
    fontSize: FORTAB ? 22 : 18,
  },
  MainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CatSubView: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: FORTAB ? 10 : 5,
    // marginLeft: FORTAB ? 15 : 6,
    // width: (WIDTH / 3) - 10,
    minWidth: FORTAB ? 100 : 80,
    justifyContent: 'flex-start',
  },
  SubCon: {
    // width: FORTAB ? 80 : 60,
    // height: FORTAB ? 80 : 60,
    // alignItems: 'center',
    // justifyContent: 'center',
    // borderRadius: FORTAB ? 50 : 50,
  },
  subConText: {
    color: '#333',
    fontFamily: colors.fonts.proximaNova.regular,
    fontSize: FORTAB ? 18 : 14,
    marginTop: FORTAB ? 8 : 5,
    // marginTop: 5,
    textAlign: 'center',
  },
  SerSubView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: FORTAB ? 10 : 5,
    width: '24%',
  },
  ImgSer: {
    width: '100%',
    height: FORTAB ? 150 : 100,
    resizeMode: 'cover',
  },
  imgCat: {
    resizeMode: 'contain',
    width: FORTAB ? 70 : 50,
    height: FORTAB ? 70 : 50,
  },

  boxes: {
    height: FORTAB ? 200 : 150,
    backgroundColor: '#ccc',
    margin: 5,
    borderRadius: 5,
  },
  boxView: {
    height: FORTAB ? 170 : 130,
    borderRadius: 5,
    overflow: 'hidden',
  },
  ImgStyle: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  loadMoreCont: {
    position: 'absolute',
    height: 50,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 50,
  },
  noItemMain: {
    // flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class CListView extends Component {
  constructor(props) {
    super(props);
    this.loadingpage = false;
    this.contentHeight = 0;
    this.componentHeight = 0;
    this.state = {
      refreshing: false,
      Mclose: false,
      // SData: [],
      orientation: 1,
      loadMore: false,
    };
  }

  componentDidMount() {
    // this.calculateItemRows();
    Dimensions.addEventListener('change', this.onOrientationChange);
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  //   if (!_.isEqual(this.props.searchData.SearchHome, nextProps.searchData.SearchHome)) {
  //     this.setState({ Mclose: false });
  //   }
  // }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onOrientationChange);
  }

  /* eslint-disable no-unused-vars */
  onEndReached = (event) => {
    // console.log('onEndReached');
    // console.log(event);
    const {
      more,
      onLoadMore,
    } = this.props;
    // const { contentOffset } = event.nativeEvent;
    if (_.isFunction(onLoadMore)) {
      if (this.loadingpage !== true
      && more === true
      ) {
        this.loadingpage = true;
        this.addLoader();
        onLoadMore();
      }
    }
  }
  /* eslint-disable no-unused-vars */

  onRefresh = () => {
    const { onRefresh } = this.props;
    this.setState({ refreshing: true }, () => {
      if (_.isFunction(onRefresh)) {
        onRefresh();
      }
      setTimeout(() => {
        this.setState({ refreshing: false });
      }, 500);
    });
  }

  onOrientationChange = () => {
    // this.calculateItemRows();
    const { orientation } = this.state;
    setTimeout(() => {
      this.setState({
        orientation: orientation === 1 ? 0 : 1,
      });
    }, 50);
  };

  keyExtractor = i => (
    `video_item_${i.id}`
  );

  setFirstItemCords = (cords, itemRef) => {
    this.firstItemCords = cords;
    this.firstItemRef = itemRef;
  }

  openLoginModel = () => {
    this.CLogin.openModal();
  }


  CatData = data => (
    <TouchableOpacity
      key={`category_view_${data.name}`}
      style={styles.CatSubView}
      onPress={() => this.goCategorySingle(data)}
      activeOpacity={0.8}
    >
      <View style={[styles.SubCon, { backgroundColor: data.color }]}>
        <Image source={{ uri: data.img }} style={styles.imgCat} />
      </View>
      <Text style={styles.subConText}>{data.name}</Text>
    </TouchableOpacity>
  )

  goCategorySingle = (d) => {
    const { authActions: { setFireAnalyticEvent }, navigator } = this.props;
    setFireAnalyticEvent('category_list', { message: `User Just Went on ${d.name} Category.` });
    navigator.push({
      screen: 'CategoryList',
      passProps: {
        data: d,
      },
    });
  }

  gotoSingleDetail = (data) => {
    const { authActions: { setFireAnalyticEvent }, navigator } = this.props;
    setFireAnalyticEvent('single_detail_list', { message: `User Just Went Single Detail page and see ${data.name}` });
    navigator.push({
      screen: 'SingleDetail',
      passProps: {
        itemData: data,
      },
    });
  }

  SerData = (data, i, nWidth) => (
    <TouchableOpacity
      key={data.id}
      style={{ marginRight: 5 }}
      activeOpacity={0.7}
      onPress={() => { this.gotoSingleDetail(data); }}
    >
      <Image
        source={{ uri: (settings.api + data.img) }}
        style={{ height: nWidth / 4, width: nWidth / 5 }}
      />
    </TouchableOpacity>
  )

  topData = () => {
    // const nWidth = Dimensions.get('window').width;
    // const { categories } = this.props.auth;
    const { Mclose } = this.state;
    // const { searchData, pressViewAll } = this.props;
    // const { trans } = this.props.authActions;
    return (
    /* eslint-disable no-nested-ternary */
      <View>
        {/* {!searchData.SearchState &&
        <View
          style={styles.CatView}
          ref={(o) => { this.catScrollBar = o; }}
          onLayout={(cmp) => {
            if (cmp != null) {
              // catNamesCord[ele] = cmp.nativeEvent.layout;
              if (this.catScrollBar) {
                this.catScrollBar.measure((x, y, width, height, pageX, pageY) => {
                  this.categoryPageY = pageY;
                });
              }
            }
          }}
        >
          {_.isArray(categories) && categories.length > 0 ?
            <ScrollView
              horizontal
              scrollEnabled
              // bounces={false}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={1}
            >
              {_.isArray(categories) && categories.length > 0 ? (
                categories.map((data, i) => this.CatData(data, i))
              ) : (null)}

            </ScrollView> : (null)}
        </View>
        } */}
        { Mclose ? (null) : (
        //   (searchData.SearchHome !== undefined
        //     && searchData.SearchState !== undefined
        //     && !searchData.SearchState
        //     && searchData.SearchHome !== ''
        // ) ?
          <View style={[styles.SubView]}>
            <View style={[styles.MainView]}>
              <View style={styles.CommonFlexSty}>
                <Icon name="search" style={styles.SerIconStyle} />
                <Text style={[styles.CommonText, { marginLeft: FORTAB ? 15 : 10 }]}>
                  {/* {trans('home_recent_search_text')} */}
Close
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => { this.CloseSearch(); }}
                style={{ paddingHorizontal: 5, paddingBottom: 5 }}
              >
                <MIcon name="close" style={[styles.SerIconStyle, { fontSize: RFValue(18) }]} />
              </TouchableOpacity>
            </View>
            {/* <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
              <ScrollView
                horizontal
                scrollEnabled
                // bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEventThrottle={1}
              >
                {_.isArray(searchData.lastSearch) && searchData.lastSearch.length > 0 ?
                  searchData.lastSearch.map((data, i) => this.SerData(data, i, nWidth))
                : (null)}
              </ScrollView>
            </View> */}
            {/* <View style={[styles.CommonSty]}>
              <View style={{ width: '75%' }}>
                <Text style={[styles.CommonText, { color: '#000' }]} numberOfLines={2}>
                  {`"${searchData.SearchHome}"`}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={pressViewAll}
                style={{ width: '20%' }}
              >
                <Text style={[styles.CommonText, { color: colors.brandBtnColor }]}>
                  {trans('home_viewall_text')}
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        // : (null)
        )}
      </View>
      /* eslint-disable no-nested-ternary */
    );
  }

  scrolltotop = () => {
    console.log('Scroll To Top =======================>');
    if (this.FlatList) {
      this.FlatList.scrollToOffset({ offset: 0 });
    }
  };

  CloseSearch() {
    this.setState({ Mclose: true });
  }

  openAccessModal() {
    if (this.CAccessModal) {
      this.CAccessModal.openAccessModal();
    }
  }

  handleScroll(event) {
    const {
      more,
      onLoadMore,
    } = this.props;
    const { contentOffset } = event.nativeEvent;
    // console.log('handleScroll');
    // this.setMiles(contentOffset.y);
    if (this.loadingpage !== true
      // && more === true
      && ((contentOffset.y + 1000) > (this.contentHeight - this.componentHeight))) {
      // console.log('Inside If HandleScroll View =>');
      this.loadingpage = true;
      this.addLoader();
      if (onLoadMore) {
        onLoadMore();
      }
    }
  }

  removeLoader() {
    const { data, home } = this.props;
    console.log('removeLoader data ===============================>');
    console.log(data);
    if (home) {
      this.setState({ loadMore: false });
      this.loadingpage = false;
    } else {
      if (data && data.length && data[data.length - 1] && data[data.length - 1].loadMore) {
        data.splice(-1, 1);
      }
      this.loadingpage = false;
      this.refreshView('removeLoader');
    }
  }

  refreshView(str) {
    // console.log(`refreshView => ${str}`);
    const initTime = moment();
    this.setState({}, () => {
      const endTime = moment();
      console.log(`refreshView => ${str} took ${endTime.diff(initTime)} ms`);
    });
  }

  addLoader() {
    const { data, home } = this.props;
    console.log('addLoader data =======================================>');
    console.log(data);
    if (home) {
      this.setState({ loadMore: true });
    } else {
      data.push({ loadMore: true });
      this.refreshView('addLoader');
    }
  }

  renderScroll = () => {
    // console.log('Scroll List Item');
    const {
      // data,
      key,
      containerStyle,
      // scroll,
      refresh,
      // home,
    } = this.props;
    const { refreshing } = this.state;
    // console.log('renderScroll');
    return (
      <ScrollView
        key={key}
        // bounces={false}
        scrollEnabled
        contentContainerStyle={[styles.scrollCont, containerStyle]}
        showsVerticalScrollIndicator={false}
        onScroll={e => this.handleScroll(e)}
        onContentSizeChange={(contentWidth, contentHeight) => {
        // console.log('contentHeight ==='+contentHeight);
          this.contentHeight = contentHeight;
        }}
        onLayout={(event) => {
          // console.log(event.nativeEvent.layout);
          const ddH = event.nativeEvent.layout.height;
          // console.log('ddh ==='+ddH);
          if (ddH !== 0) { this.componentHeight = ddH; }
        }}
        refreshControl={
          refresh !== undefined && refresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              colors={[colors.brandAppBackColor]}
            />
          ) : (null)
        }
      >
        {/* {home ? this.topData() : null} */}
        {this.renderListItems()}
      </ScrollView>
    );
  };

  /* eslint-disable consistent-return */
  renderFlatItem = (item) => {
    const { type, refreshState, getNotification } = this.props;

    if (item && item.item && item.item.loadMore) {
      return (
        <View style={{
          marginVertical: FORTAB ? 12 : 10, flex: 1, alignItems: 'center', justifyContent: 'center',
        }}
        >
          <ActivityIndicator size={FORTAB ? 'large' : 'small'} color={colors.brandAppBackColor} />
        </View>
      );
    }

    if (type === 'ProfileVideoList') {
      return (
        <CProfileVideo
          {...this.props}
          data={item.item}
        />
      );
    }

    if (type === 'SearchVideoList') {
      return (
        <CSearchVideoList
          {...this.props}
          data={item.item}
        />
      );
    }

    if (type === 'SearchUserList') {
      return (
        <CSearchUserList
          {...this.props}
          data={item.item}
        />
      );
    }

    if (type === 'NotificationList') {
      return (
        <CNotification
          {...this.props}
          data={item.item}
          getNotification={getNotification}
        />
      );
    }

    // if (type === 'FollowersList') {
    //   return (
    //     <CFollowers
    //       {...this.props}
    //       data={item.item}
    //     />
    //   );
    // }

    // if (type === 'FollowingList') {
    //   return (
    //     <CFollowers
    //       {...this.props}
    //       data={item.item}
    //     />
    //   );
    // }

    if (type === 'WinnerList') {
      return (
        <CWinnerList
          {...this.props}
          data={item.item}
        />
      );
    }
  }
  /* eslint-disable consistent-return */

  renderFlat = () => {
    // console.log('Flat List Item');
    const {
      data,
      colNo,
      containerStyle,
      // scroll,
      refresh,
      // home,
      // onScroll,
    } = this.props;
    const { refreshing } = this.state;
    return (
      <FlatList
        data={data}
        ref={(o) => { this.FlatList = o; }}
        // onScroll={(e) => {
        //     const { y } = e.nativeEvent.contentOffset;
        //     this.setMiles(y);
        // }}
        // keyExtractor={this.keyExtractor}
        horizontal={false}
        // ListHeaderComponent={home ? this.topData : null}
        ListEmptyComponent={this.renderNoItems}
        renderItem={this.renderFlatItem}
        scrollEnabled
        initialNumToRender={10}
        // windowSize={50}
        // numColumns={this.itemRows}
        key={colNo}
        numColumns={colNo}
        // disableVirtualization
        scrollsToTop={false}
        removeClippedSubviews
        contentContainerStyle={[styles.scrollCont, containerStyle]}
        showsVerticalScrollIndicator={false}
        // onScroll={e => this.handleScroll(e)}
        scrollEventThrottle={1}
        onContentSizeChange={(contentWidth, contentHeight) => {
          this.contentHeight = contentHeight;
        }}
        onLayout={(event) => {
          const ddH = event.nativeEvent.layout.height;
          if (ddH !== 0) { this.componentHeight = ddH; }
        }}
        refreshControl={
          refresh !== undefined && refresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              colors={[colors.brandAppBackColor]}
            />
          ) : (null)}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.1}
      />
    );
  }

  /* eslint-disable class-methods-use-this */
  renderNoItems = () => {
    const { renderNoItems, ErrorViewText } = this.props;
    if (_.isFunction(renderNoItems)) {
      renderNoItems();
    }

    if (_.isFunction(ErrorViewText)) {
      return ErrorViewText();
    }
    return (
      <View style={styles.noItemMain}>
        <View><Text style={[common.textBig, common.textBold, { fontSize: RFValue(32), color: '#0008' }]}>Oops!</Text></View>
        <View>
          <Text style={[common.textNormal, common.MT5, { color: '#0008' }]}>
            {/* {'No Item Found'} */}
            {_.isString(ErrorViewText) && ErrorViewText !== '' ? ErrorViewText : 'No Item Found'}
          </Text>
        </View>
      </View>
    );
  }
  /* eslint-disable class-methods-use-this */


  renderListItems() {
    const { data, onSelectMasseuse } = this.props;
    return (
      data.map(item => (
        console.log(item)
      ))
    );
  }

  render() {
    const { data, scroll, profile } = this.props;
    const { loadMore } = this.state;
    const nWidth = Dimensions.get('window').width;
    const testM = true;
    return scroll !== undefined && !scroll ? this.renderListItems()
      : (
        <View style={{ flex: 1 }}>
          {testM && !profile ? this.renderFlat() : this.renderScroll()}
          {loadMore ? (
            <View style={[styles.loadMoreCont, { width: nWidth }]}>
              {Platform.OS === 'ios' ? (
                <ActivityIndicator color={colors.brandAppBackColor} size={FORTAB ? 'small' : 'small'} animating />
              ) : (
                <ActivityIndicator color={colors.brandAppBackColor} size={FORTAB ? 'small' : 'small'} animating />
              )}
            </View>
          ) : (null)}
        </View>
      );
  }
}


CListView.propTypes = {
  // authActions: PropTypes.objectOf(PropTypes.func),
  // auth: PropTypes.objectOf(PropTypes.any),
  key: PropTypes.string,
  more: PropTypes.bool,
  onLoadMore: PropTypes.func,
};

CListView.defaultProps = {
  // authActions: {},
  // auth: {},
  key: '1',
  more: true,
  onLoadMore: null,
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state, ownProps) {
  return {
    // auth: state.auth,
  };
}
/* eslint-disable no-unused-vars */

function mapDispatchToProps(dispatch) {
  return {
    // authActions: bindActionCreators(authActions, dispatch),
  };
}

// withRef is removed. To access the wrapped instance, use a ref on the connected component
// Warning: Function components cannot be given refs.
// Attempts to access this ref will fail. you mean to use React.forwardRef
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CListView);
// export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(CListView);
