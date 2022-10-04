/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';

const LangToggle = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  return (
    <div css={container(theme, i18n.language === 'fr')}>
      {['fr', 'en'].map((language) => {
        const selected = language === i18n.language;
        return (
          <div
            css={option(theme, selected)}
            onClick={() => !selected && i18n.changeLanguage(language)}
          >
            {language}
          </div>
        );
      })}
    </div>
  );
};

const container = (theme: Theme, isLeft: boolean) => css`
  display: flex;
  position: relative;

  &::before {
    transition: all 200ms ease-in-out;
    content: '';
    position: absolute;
    border-radius: 4px;
    width: 35px;
    height: 25px;
    background-color: ${theme.almostFg};
    left: ${isLeft ? 0 : 35}px;
  }
`;

const option = (theme: Theme, selected: boolean) => css`
  width: 35px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-weight: 800;
  font-size: 14px;
  cursor: ${!selected && 'pointer'};
  color: ${selected ? theme.almostBg : theme.almostFg};
  z-index: 1;
`;

export default LangToggle;
