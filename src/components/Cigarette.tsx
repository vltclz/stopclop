/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';

const Cigarette = ({ height, color }: { height: number; color?: string }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        height: ${height}px;
        width: ${height * 0.15}px;
        border: ${height * 0.03}px solid ${color || theme.almostFg};
        border-radius: ${height * 0.05}px;
        box-sizing: border-box;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: -${height * 0.03}px;
          left: -${height * 0.03}px;
          height: ${height * 0.3}px;
          width: ${height * 0.15}px;
          background: ${color || theme.almostFg};
          border-radius: ${height * 0.05}px;
          border-bottom-left-radius: 0px;
          border-bottom-right-radius: 0px;
          transition: background 200ms ease-in-out;
        }
      `}
    />
  );
};

export default Cigarette;
