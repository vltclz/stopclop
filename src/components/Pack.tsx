/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';

const Pack = ({
  height,
  color,
  number,
}: {
  height: number;
  color?: string;
  number?: number;
}) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        height: ${height}px;
        width: ${height * 0.71}px;
        background: ${color || theme.almostFg};
        position: relative;
        border-radius: ${height * 0.05}px;

        &::before {
          content: '';
          position: absolute;
          top: ${height * 0.25}px;
          left: 0px;
          height: ${height * 0.05}px;
          width: 100%;
          background: ${theme.almostBg};
          transition: background 200ms ease-in-out;
        }

        &::after {
          content: '${number}';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -20%);
          color: ${theme.almostBg};
          font-weight: 800;
          transition: color 200ms ease-in-out;
        }
      `}
    />
  );
};

export default Pack;
