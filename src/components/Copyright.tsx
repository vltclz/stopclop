/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';

const Copyright = () => {
  const theme = useTheme();
  return (
    <a
      css={css`
        color: ${theme.bitFg};
        font-size: 14px;
        text-decoration: none;
        transition: all 200ms ease-in-out;
        font-weight: 600;
        &:hover {
          color: ${theme.almostFg};
        }
      `}
      href="https://github.com/vltclz"
      target="_blank"
      rel="noreferrer"
    >
      @vltclz
    </a>
  );
};

export default Copyright;
