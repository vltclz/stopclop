/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';

export const RADIUS_MULTIPLIER = 0.05;
const WIDTH_MULTIPLIER = 0.7;
const LID_POSITION_MULTIPLIER = 0.25;
const LID_HEIGHT_MULTIPLIER = 0.05;

const Pack = ({
  height,
  color,
  count,
}: {
  height: number;
  color?: string;
  count?: number;
}) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        height: ${height}px;
        width: ${height * WIDTH_MULTIPLIER}px;
        background: ${color || theme.almostFg};
        position: relative;
        border-radius: ${height * RADIUS_MULTIPLIER}px;

        // "Lid" separator
        &::before {
          content: '';
          position: absolute;
          top: ${height * LID_POSITION_MULTIPLIER}px;
          left: 0px;
          height: ${height * LID_HEIGHT_MULTIPLIER}px;
          width: 100%;
          background: ${theme.almostBg};
          transition: background 200ms ease-in-out;
        }

        // Optional count overlay
        &::after {
          content: '${count}';
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
