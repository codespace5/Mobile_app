import _ from "lodash";
import types from "./actions";

const initialState = {
  tabData: [
    {
      id: 1,
      price: "$ 0",
      IconName: "Microphone-outline",
      fillIcon: "Microphone-fill",
    },
    {
      id: 2,
      price: "$ 0",
      IconName: "Mic-outline",
      fillIcon: "Mic-fill",
    },
    {
      id: 3,
      price: "$ 0",
      IconName: "dance-1",
      fillIcon: "dance-2",
    },
    {
      id: 4,
      price: "$ 0",
      IconName: "theater-masks",
      fillIcon: "theater-masks",
    },
    {
      id: 5,
      price: "$ 0",
      IconName: "happy-outline",
      fillIcon: "Happy-fill",
    },
  ],
  currentTab: 1, // Default 3 - as 3rd tab is active
  tabPageIds: [0, 0], // Set Default page Id to 0 for each tab
  playVideos: true, // FOR HOME Tab
  isHomeFocused: true,
  isTop100Focused: false,
  isRenderTab: true,
};

export default function reducer(state = initialState, actions) {
  console.log("Home Reducer Action ==> ", actions.type, "Data ==> : ", actions);
  switch (actions.type) {
    case types.SET_TAB_DATA:
      let currentTabData = state.tabData;
      currentTabData = currentTabData.map((cTabObj, key) => {
        cTabObj.price = actions.tabData[key].price;
        cTabObj.price_raw = actions.tabData[key].price_raw;
        return cTabObj;
      });

      // if (_.isEqual(state.tabData, currentTabData)) return state;

      return {
        ...state,
        tabData: currentTabData,
      };
    case types.SET_CURRENT_VIDEO_TAB:
      if (_.isEqual(state.currentTab, actions.currentTab)) return state;
      return {
        ...state,
        currentTab: actions.currentTab, // Tab starts from 1 and Array from 0
      };
    case types.RESET_TAB_IDS:
      console.log("Reset Tabs IDS Called!!! ==>");
      return {
        ...state,
        tabPageIds: [0, 0],
      };

    case types.SET_CURRENT_TAB_PAGE:
      // eslint-disable-next-line no-case-declarations
      const tabPageIdsTmp = state.tabPageIds;
      tabPageIdsTmp[actions.currentTab - 1] = actions.page;

      // if (_.isEqual(state.tabPageIds, tabPageIdsTmp)) return state;
      return {
        ...state,
        tabPageIds: tabPageIdsTmp,
      };

    case types.SET_PLAY_VIDEOS: // For Home
      if (state.playVideos === actions.play) return state;

      return {
        ...state,
        playVideos: actions.play,
      };
    case types.IS_HOME_FOCUSED:
      if (state.isHomeFocused === actions.focus) return state;
      return {
        ...state,
        isHomeFocused: actions.focus,
        ...(actions.play !== null && { playVideos: actions.play }),
      };
    case types.SET_TOP100_FOCUSED:
      if (state.isTop100Focused === actions.focus) return state;
      return {
        ...state,
        isTop100Focused: actions.focus,
        ...(actions.play !== null && { playVideos2: actions.play }),
      };
    default:
      return state;
  }
}
