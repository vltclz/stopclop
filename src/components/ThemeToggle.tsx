/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import useFavIconSwitch from 'hooks/useFavIconSwitch';
import { useEffect, useState } from 'react';
import { getLocalThemeSetting, isDarkTheme } from 'theme';

const ThemeToggle = ({ toggleTheme }: { toggleTheme(): void }) => {
  const theme = useTheme();
  const [isDark, setIsDarkTheme] = useState(
    isDarkTheme(getLocalThemeSetting())
  );
  const { favIconSwitch } = useFavIconSwitch();

  useEffect(() => {
    setIsDarkTheme(isDarkTheme(getLocalThemeSetting()));
    favIconSwitch(getLocalThemeSetting());
  }, [favIconSwitch, theme]);

  return <div css={toggle(theme, isDark)} onClick={toggleTheme} />;
};

const toggle = (theme: Theme, isDark: boolean) => css`
  width: 48px;
  height: 28px;
  outline: none;
  position: relative;
  border-radius: 14px;
  display: inline-block;
  overflow: hidden;
  background: ${theme.almostFg};
  cursor: pointer;

  &::before,
  &::after {
    transition: all 200ms ease-in-out;
    content: '';
    display: block;
    position: absolute;
  }

  &::before {
    top: 4px;
    left: ${isDark ? 4 : 24}px;
    width: 20px;
    height: 20px;
    border-radius: 12px;
    background: ${theme.almostBg};
  }

  &::after {
    top: ${isDark ? -2 : 14}px;
    right: 2px;
    width: ${isDark ? 32 : 1}px;
    height: ${isDark ? 32 : 1}px;
    border-radius: ${isDark ? 16 : 0.5}px;
    background: ${theme.almostFg};
  }
`;

export default ThemeToggle;
