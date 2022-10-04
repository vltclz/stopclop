/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';

const SignIn = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <div css={container(theme)}>
      <div>{t('welcome')}</div>
      <div>{t('welcomeSubtitle')}</div>
    </div>
  );
};

const container = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  color: ${theme.almostFg};
  width: 100%;
`;

export default SignIn;
