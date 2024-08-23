const actions = {
  SET_UPLOAD_VIDEO_DATA: 'video/SET_UPLOAD_VIDEO_DATA',
  SET_UPLOAD_PROGRESS: 'video/SET_UPLOAD_PROGRESS',
  SET_UPLOADING: 'video/SET_UPLOADING',
  SET_TRIMMING: 'video/SET_TRIMMING',
  SET_COMPRESSING: 'video/SET_COMPRESSING',
  setUploading: uploading => dispatch => dispatch({
    type: actions.SET_UPLOADING,
    uploading,
  }),
  setTrimming: trimming => dispatch => dispatch({
    type: actions.SET_TRIMMING,
    trimming,
  }),
  setCompressing: compressing => dispatch => dispatch({
    type: actions.SET_COMPRESSING,
    compressing,
  }),
  setUploadProgress: progress => dispatch => dispatch({
    type: actions.SET_UPLOAD_PROGRESS,
    progress,
  }),
  setUploadVideoData: videoData => dispatch => dispatch({
    type: actions.SET_UPLOAD_VIDEO_DATA,
    videoData,
  }),
};

export default actions;
