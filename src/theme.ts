import { Theme } from '@emotion/react';

export const themeDark: Theme = {
  bg: '#040404',
  almostBg: '#0D0D0E',
  middleBg: '#1E2022',
  bitBg: '#404346',
  neutral: '#7C8084',
  bitFg: '#B9BDC1',
  middleFg: '#DCE0E3',
  almostFg: '#EFF2F5',
  fg: '#F7FAFD',
  red: 'rgb(248,113,113)',
};

export const themeLight: Theme = {
  fg: '#040404',
  almostFg: '#0D0D0E',
  middleFg: '#1E2022',
  bitFg: '#404346',
  neutral: '#7C8084',
  bitBg: '#B9BDC1',
  middleBg: '#DCE0E3',
  almostBg: '#EFF2F5',
  bg: '#F7FAFD',
  red: 'rgb(220,38,38)',
};

export enum ThemeSetting {
  LIGHT = 'light',
  DARK = 'dark',
}

export const themeSettingKey = 'themeSetting';

export const getLocalThemeSetting = (): ThemeSetting =>
  (localStorage.getItem(themeSettingKey) as ThemeSetting) || ThemeSetting.LIGHT;

export const isDarkTheme = (themeSetting: ThemeSetting) =>
  themeSetting === ThemeSetting.DARK;
