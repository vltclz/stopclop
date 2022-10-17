import { css, Theme } from '@emotion/react';

export const container = (from: 'right' | 'left', visible: boolean) => css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  text-align: center;
  opacity: ${visible ? 1 : 0};
  margin-right: ${visible || from === 'left' ? 0 : -100}%;
  margin-left: ${visible || from === 'right' ? 0 : -100}%;
  transition: margin 0.5s ease-in-out, opacity 0.5s ease-in-out;
`;

export const button = (theme: Theme, main: boolean) => css`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${main ? theme.almostFg : theme.middleBg};
  border: hidden;
  color: ${main ? theme.almostBg : theme.almostFg};
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.2;
    cursor: auto;
  }
`;

export const actionsContainer = (theme: Theme) => css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
