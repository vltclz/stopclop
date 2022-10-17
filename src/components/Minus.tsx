/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';

const Minus = ({ height, color }: { height: number; color?: string }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        height: ${height}px;
        width: ${height}px;
        box-sizing: border-box;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          height: ${height / 6}px;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
          width: 100%;
          background: ${color || theme.almostFg};
          border-radius: ${height * 0.05}px;
          transition: background 200ms ease-in-out;
        }
      `}
    />
  );
};

export default Minus;
