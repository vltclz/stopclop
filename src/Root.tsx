import { ThemeProvider } from '@emotion/react';
import App from './App';
import { useCallback, useState } from 'react';
import {
  getLocalThemeSetting,
  isDarkTheme,
  themeDark,
  themeLight,
  ThemeSetting,
  themeSettingKey,
} from 'theme';

const Root = () => {
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>(
    getLocalThemeSetting()
  );
  const toggleTheme = useCallback(() => {
    const newSetting = isDarkTheme(themeSetting) ? 'light' : 'dark';
    setThemeSetting(newSetting);
    localStorage.setItem(themeSettingKey, newSetting);
  }, [themeSetting]);

  return (
    <ThemeProvider theme={isDarkTheme(themeSetting) ? themeDark : themeLight}>
      <App toggleTheme={toggleTheme} />
    </ThemeProvider>
  );
};

export default Root;
