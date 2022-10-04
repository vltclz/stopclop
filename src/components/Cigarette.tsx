/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';

const Cigarette = ({ height }: { height: number }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        height: ${height}px;
        width: ${height * 0.15}px;
        border: ${height * 0.03}px solid ${theme.almostFg};
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
          background: ${theme.almostFg};
          border-radius: ${height * 0.05}px;
          border-bottom-left-radius: 0px;
          border-bottom-right-radius: 0px;
        }
      `}
    />
  );
};

export default Cigarette;
