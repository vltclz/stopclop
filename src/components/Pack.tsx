/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';

const Pack = ({ height }: { height: number }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        height: ${height}px;
        width: ${height * 0.71}px;
        background: ${theme.almostFg};
        position: relative;
        border-radius: ${height * 0.05}px;

        &::before {
          content: '';
          position: absolute;
          top: ${height * 0.25}px;
          height: ${height * 0.05}px;
          width: 100%;
          background: ${theme.almostBg};
        }
      `}
    />
  );
};

export default Pack;
