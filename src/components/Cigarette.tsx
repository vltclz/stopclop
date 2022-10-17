/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import { RADIUS_MULTIPLIER } from './Pack';

const WIDTH_MULTIPLIER = 0.15;
const BORDER_MULTIPLIER = 0.03;
const BUTT_HEIGHT_MULTIPLIER = 0.3;

const Cigarette = ({ height, color }: { height: number; color?: string }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        height: ${height}px;
        width: ${height * WIDTH_MULTIPLIER}px;
        border: ${height * BORDER_MULTIPLIER}px solid ${color || theme.almostFg};
        border-radius: ${height * RADIUS_MULTIPLIER}px;
        box-sizing: border-box;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: -${height * BORDER_MULTIPLIER}px;
          left: -${height * BORDER_MULTIPLIER}px;
          height: ${height * BUTT_HEIGHT_MULTIPLIER}px;
          width: ${height * WIDTH_MULTIPLIER}px;
          background: ${color || theme.almostFg};
          border-radius: ${height * RADIUS_MULTIPLIER}px;
          border-bottom-left-radius: 0px;
          border-bottom-right-radius: 0px;
          transition: background 200ms ease-in-out;
        }
      `}
    />
  );
};

export default Cigarette;
