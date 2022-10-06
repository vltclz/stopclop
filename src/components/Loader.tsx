/** @jsxImportSource @emotion/react */
import { css, keyframes, Theme, useTheme } from '@emotion/react';

const Loader = ({ inverted }: { inverted?: boolean }) => {
  const theme = useTheme();
  return <div css={loader(theme, inverted)} />;
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const loader = (theme: Theme, inverted: boolean) => css`
  animation: ${spin} infinite 1s linear;
  border: 3px solid ${inverted ? theme.bg : theme.fg};
  border-top: 2px solid transparent;
  height: 20px;
  width: 20px;
  border-radius: 50%;
`;

export default Loader;
