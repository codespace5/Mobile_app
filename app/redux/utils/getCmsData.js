import _ from 'lodash';
import { getApiDataProgress } from './apiHelper';
import settings from '../../config/settings';

export default function getCmsData(pageSlug) {
  return new Promise((resolve, reject) => {
    if (_.isString(pageSlug) && pageSlug !== '') {
      getApiDataProgress(`${settings.endpoints.get_cms_page}?slug=${pageSlug}`, 'get', null, {}, null)
        .then((responseJson) => {
          console.log(responseJson);
          resolve(responseJson);
          console.log(responseJson.message);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(new Error('Blank string'));
    }
  });
}
