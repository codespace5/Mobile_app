/* eslint-disable import/named */
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { FORTAB } from './MQ';
import icoMoonConfig from './selection.json';
import colors from './styles';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

const smallIco = FORTAB ? 25 : 20;
const normalIco = FORTAB ? 45 : 35;
const bigIco = FORTAB ? 55 : 45;
const midIco = FORTAB ? 30 : 20;
const midIcoIo = FORTAB ? 40 : 30;

const replaceSuffixPattern = /--(active|big|small|very-big|medium)/g;

const icons = {
  home: [normalIco, colors.navBarButtonColor],
  'home--small': [smallIco, colors.navBarButtonColor],
  'home--medium': [midIco, colors.navBarButtonColor],
  'home--big': [bigIco, colors.navBarButtonColor],
};

const defaultIconProvider = Icon;
const iconsMap = {};
const iconsLoaded = new Promise((resolve) => {
  new Promise.all(Object.keys(icons).map((iconName) => {
    const Provider = icons[iconName][2] || defaultIconProvider;
    return Provider.getImageSource(
      iconName.replace(replaceSuffixPattern, ''),
      icons[iconName][0],
      icons[iconName][1],
    );
  })).then((sources) => {
    Object.keys(icons).forEach((iconName, idx) => {
      iconsMap[iconName] = sources[idx];
    });
    // Call resolve (and we are done)
    resolve(true);
  });
});

export {
  iconsMap,
  iconsLoaded,
  Icon,
};
