import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import { Client } from 'bugsnag-react-native';
import firebase from 'react-native-firebase';
import settings from '../../config/settings';
import { CAlert } from '../../components/CAlert';

const bugsnag = new Client(settings.bugsnagKey);

function logOut() {
  AsyncStorage.multiRemove(['login', 'token', 'userOtherData'], (err) => {
    console.log(err);
  }).then((res) => {
    console.log(res);
  });
}

function logEvent(ep, data) {
  const eventMap = {
    'video/add-vote': 'video_vote_add',
    'video/add-comment': 'video_comment_add',
    'video/add-view': 'video_view_add',
    'user/add-bank': 'user_bank_add',
    'user/delete-bank': 'user_bank_delete',
    'user/set-language': 'user_change_language',
    'user/set-country': 'user_change_country',
    'notification/remove': 'notification_remove',
    'notification/remove-all': 'notification_remove_all',
    'video/add-video': 'video_post_upload',
    'video/report': 'video_user_report',
    'user/change-password': 'user_change_password',
    'user/me-update': 'user_profile_update',
    'user/follow': 'user_follow',
    'user/block': 'user_block',
    'user/unblock': 'user_unblock',
    'payment/paystack-verification': 'video_payment_paystack',
    'payment/in-app-verification': 'video_payment_in_app_purchase',
    'payment/free-video-post': 'video_payment_free',
    'video/delete-video': 'video_delete',
    'user/index': 'user_search',
  };

  if (eventMap[ep]) {
    firebase.analytics().logEvent(eventMap[ep], { data: JSON.stringify(data) });
  }
}

export function getApiData(endpoint, method, data, headers) {
  return new Promise((resolve, reject) => {
    let query = '';
    let qs = '';
    for (key in data) {
      query += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
    }
    const params = {};
    params.method = method.toLowerCase() === 'get' ? 'get' : 'post';
    if (headers) {
      params.headers = headers;
    } else {
      params.headers = {
        'Content-Type': 'application/json',
      };
    }
    console.log(params.headers);
    if (params.method === 'post') {
      if (params.headers && params.headers['Content-Type'] && params.headers['Content-Type'] === 'application/json') {
        params.body = JSON.stringify(data);
      } else {
        params.body = query;
      }
    } else {
      qs = `?${query}`;
    }

    console.log(params);

    if (params.method === 'post' && params.headers && params.headers['Content-Type'] && params.headers['Content-Type'] === 'application/json') {
      console.log(JSON.stringify(data));
    } else {
      let str = '';
      if (data && Object.keys(data).length > 0) {
        Object.keys(data).map((dk) => {
          str += `${dk}:${data[dk]}\n`;
        });
      }
      console.log(str);
    }

    /* Log events to firebase based on Calls */
    logEvent(endpoint, params, qs);

    console.log(settings.api + endpoint + qs);
    fetch(settings.api + endpoint + qs, params).then(response => response.json())
      .then((resposeJson) => {
        console.log(resposeJson);
        if (_.isObject(resposeJson) && _.isObject(resposeJson.data)
          && _.isString(resposeJson.data.name) && resposeJson.data.name === 'Unauthorized'
          && resposeJson.status === 401) {
          bugsnag.notify({
            code: 0,
            message: 'API Force user Logout',
          }, (report) => {
            report.metadata = {
              user: {
                function: 'getAPIDATA',
                url: settings.api + endpoint + qs,
                headers,
                method,
                data,
                response: resposeJson,
              },
            };
          });
          // CAlert('Your account has been deleted. Your access is no more', 'Oops!', () => {
          //   logOut();
          // });
          logOut();
          resolve(resposeJson);
        } else {
          resolve(resposeJson);
        }
      }).catch((err) => {
        console.log(err);

        bugsnag.notify(err, (report) => {
          report.metadata = {
            user: {
              function: 'getAPIDATA',
              url: settings.api + endpoint + qs,
              headers,
              method,
              data,
            },
          };
        });

        reject(err);
      });
  });
}


export function getApiDataProgress(endpoint, method, data, headers, onProgress) {
  return new Promise((resolve, reject) => {
    const urlPrefix = (endpoint.startsWith('http') ? '' : settings.api);
    const url = urlPrefix + endpoint;
    const oReq = new XMLHttpRequest();
    oReq.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded * 100) / event.total;
        if (onProgress) {
          onProgress(progress);
        }
      } else {
        // Unable to compute progress information since the total size is unknown
      }
    });
    let str = '';
    if (data && Object.keys(data).length > 0) {
      Object.keys(data).map((dk) => {
        str += `${dk}:${data[dk]}\n`;
      });
    }
    console.log(str);
    const query = new FormData();
    if (data && Object.keys(data).length > 0) {
      Object.keys(data).map(k => query.append(k, data[k]));
    }
    const params = query;
    oReq.open(method, url, true);
    console.log(params);
    console.log(url);
    oReq.setRequestHeader('Content-Type', 'multipart/form-data');
    if (_.isObject(headers)) {
      Object.keys(headers).map((hK) => {
        oReq.setRequestHeader(hK, headers[hK]);
      });
    }

    /* Log events to firebase based on Calls */
    logEvent(endpoint, params);
    oReq.send(params);
    oReq.onreadystatechange = () => {
      if (oReq.readyState === XMLHttpRequest.DONE) {
        try {
          const resposeJson = JSON.parse(oReq.responseText);
          console.log(resposeJson);
          if (!resposeJson) {
            reject(new Error('No response from server'));
          }
          if (_.isObject(resposeJson) && _.isObject(resposeJson.data)
              && _.isString(resposeJson.data.name) && resposeJson.data.name === 'Unauthorized'
              && resposeJson.status === 401) {
            bugsnag.notify({
              code: 0,
              message: 'API Force user Logout',
            }, (report) => {
              report.metadata = {
                user: {
                  function: 'getApiDataProgress',
                  url,
                  params,
                  headers,
                  method,
                  data,
                  response: resposeJson,
                },
              };
            });
            // CAlert('Your account has been deleted. Your access is no more', 'Oops!', () => {
            //   logOut();
            // });
            logOut();
            resolve(resposeJson);
          } else {
            resolve(resposeJson);
          }
        } catch (exe) {
          console.log(exe);
          bugsnag.notify(exe, (report) => {
            report.metadata = {
              user: {
                function: 'getApiDataProgress',
                url,
                params,
                headers,
                method,
                data,
                response: oReq.responseText,
              },
            };
          });

          reject(exe);
        }
      }
    };
  });
}
