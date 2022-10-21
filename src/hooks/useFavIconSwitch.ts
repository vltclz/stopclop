import { useEffect } from 'react';
import { ThemeSetting } from 'theme';

const useFavIconSwitch = () => {
  const favIconSwitch = (current?: ThemeSetting) => {
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    const manifest = document.getElementById('manifest') as HTMLLinkElement;
    const appleIcon = document.getElementById(
      'apple-touch-icon'
    ) as HTMLLinkElement;
    const switchTo =
      current ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeSetting.DARK
        : ThemeSetting.LIGHT);
    favicon.href = `/${switchTo}.ico`;
    manifest.href = `/${switchTo}-manifest.json`;
    appleIcon.href = `/${switchTo}.png`;
  };

  useEffect(() => {
    favIconSwitch();

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => favIconSwitch());
  }, []);

  return { favIconSwitch };
};

export default useFavIconSwitch;
