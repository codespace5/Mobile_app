const actions = {
  SET_TAB_DATA: "home/SET_TAB_DATA",
  SET_CURRENT_VIDEO_TAB: "home/SET_CURRENT_VIDEO_TAB",
  SET_CURRENT_TAB_PAGE: "home/SET_CURRENT_TAB_PAGE",
  SET_PLAY_VIDEOS: "home/SET_PLAY_VIDEOS", // For Home
  SET_PLAY_VIDEOS2: "home/SET_PLAY_VIDEOS2", // For Top 100
  IS_HOME_FOCUSED: "home/IS_HOME_FOCUSED",
  SET_TOP100_FOCUSED: "home/SET_TOP100_FOCUSED",
  RESET_TAB_IDS: "home/RESET_TAB_IDS",

  setTabData: tabData => dispatch => dispatch({
    type: actions.SET_TAB_DATA,
    tabData,
  }),
  setCurrentVideoTab: currentTab => dispatch => dispatch({
    type: actions.SET_CURRENT_VIDEO_TAB,
    currentTab,
  }),
  setCurrentTabPage: (currentTab, page) => dispatch => dispatch({
    type: actions.SET_CURRENT_TAB_PAGE,
    currentTab,
    page,
  }),
  playVideos: play => dispatch => dispatch({
    type: actions.SET_PLAY_VIDEOS,
    play,
  }),
  playVideos2: play => dispatch => dispatch({
    type: actions.SET_PLAY_VIDEOS2,
    play,
  }),
  isHomeFocused: (focus, play = null) => dispatch => dispatch({
    type: actions.IS_HOME_FOCUSED,
    focus,
    play,
  }),
  isTop100Focused: (focus, play = null) => dispatch => dispatch({
    type: actions.SET_TOP100_FOCUSED,
    focus,
    play,
  }),
  resetTabIDS: () => dispatch => dispatch({
    type: actions.RESET_TAB_IDS,
  }),
};

export default actions;
