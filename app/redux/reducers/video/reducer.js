import _ from 'lodash';
import types from './actions';

const defaultVideoData = {
  videoFile: {},
  videoDesc: '',
  videoDisclaimer: '',
  videoCat: '',
};

const initialState = {
  videoData: defaultVideoData,
  isUploading: false,
  isTrimming: false,
  isCompressing: false,
  uploadProgress: 0,
};

export default function reducer(state = initialState, actions) {
  console.log('Video Reducer Action ==> ', actions.type, 'Data ==> : ', actions);
  switch (actions.type) {
    case types.SET_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: actions.progress,
      };
    case types.SET_UPLOADING:
      return {
        ...state,
        isUploading: actions.uploading,
        uploadProgress: !actions.uploading ? 0 : state.uploadProgress
      };
    case types.SET_TRIMMING:
      return {
        ...state,
        isTrimming: actions.trimming,
        isCompressing: false,
        uploadProgress: 0,
      };
    case types.SET_COMPRESSING:
      return {
        ...state,
        isCompressing: actions.compressing,
        isTrimming: false,
        uploadProgress: 0,
      };
    case types.SET_UPLOAD_VIDEO_DATA:
      console.log(`${types.SET_UPLOAD_VIDEO_DATA} => `);

      let newVideoData = actions.videoData;
      if (!actions.videoData || actions.videoData === '' || _.isEmpty(actions.videoData)) {
        console.log('Blank video data ===> lets reset the video data to ', {
          videoFile: {},
          videoDesc: '',
          videoDisclaimer: '',
          videoCat: '',
        });
        newVideoData = {
          videoFile: {},
          videoDesc: '',
          videoDisclaimer: '',
          videoCat: '',
        };

        return {
          ...state,
          videoData: newVideoData,
          isUploading: false,
          uploadProgress: 0,
        };
      }

      return {
        ...state,
        videoData: newVideoData,
      };
    default:
      return state;
  }
}
