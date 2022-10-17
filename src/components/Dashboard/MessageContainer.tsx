/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import { Message } from 'hooks/useMessagesContent';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './styles';

const MessageContainer = ({
  message,
  showMessage,
  setShowMessage,
}: {
  message: Message;
  showMessage: boolean;
  setShowMessage: Dispatch<SetStateAction<boolean>>;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <div css={styles.container('left', showMessage)}>
      {message && (
        <div css={messageBox(theme)}>
          <div>{message.title}</div>
          {message.content.map((p, i) => (
            <div key={i}>{p}</div>
          ))}
          <button
            css={styles.button(theme, false)}
            onClick={() => {
              if (message.title === t('rulesTitle'))
                localStorage.setItem('sawRules', JSON.stringify(true));
              setShowMessage(false);
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

const messageBox = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 16px;
  color: ${theme.almostFg};

  & div:first-of-type {
    font-weight: 700;
    font-size: 28px;
  }

  & button {
    margin-top: 8px;
  }
`;

export default MessageContainer;
