/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import md5 from 'md5';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';
import { UserDataState } from 'App';
import { Dispatch, SetStateAction } from 'react';

const SignIn = ({
  setData,
}: {
  setData: Dispatch<SetStateAction<UserDataState>>;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [mode, setMode] = useState<'register' | 'signin'>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [entryKey, setEntryKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorString, setErrorString] = useState('');

  const canSubmit = useMemo(
    () => !!username && !!password && (!!entryKey || mode === 'signin'),
    [entryKey, mode, password, username]
  );

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    await axios
      .post(`${process.env.REACT_APP_BACK_URL}/${mode}`, {
        username,
        password: md5(password),
        entryKey: mode === 'register' ? entryKey : undefined,
      })
      .then(({ status }) => {
        if (status === 204) {
          setData({ username, token: md5(password) });
        }
      })
      .catch((err) => setErrorString(t('invalidCredentials')));
    setIsLoading(false);
  }, [entryKey, mode, password, setData, t, username]);

  return (
    <div css={container(theme)}>
      <div css={headline(theme)}>
        <div>{t('welcome')}</div>
        <div>{t('welcomeSubtitle')}</div>
      </div>
      <div css={form}>
        {errorString && <div css={error(theme)}>{errorString}</div>}
        <input
          css={input(theme)}
          type="text"
          placeholder={t('username')}
          value={username}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            (canSubmit ? onSubmit() : setErrorString(t('fieldMissing')))
          }
          onChange={(e) =>
            setUsername(e.target.value.replace(/[^a-z0-9]/gi, '').toLowerCase())
          }
        />
        <input
          css={input(theme)}
          type="password"
          placeholder={t('password')}
          value={password}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            (canSubmit ? onSubmit() : setErrorString(t('fieldMissing')))
          }
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === 'register' && (
          <input
            css={input(theme)}
            type="password"
            placeholder={t('entryKey')}
            value={entryKey}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              (canSubmit ? onSubmit() : setErrorString(t('fieldMissing')))
            }
            onChange={(e) => setEntryKey(e.target.value)}
          />
        )}

        <div css={buttons(theme, mode === 'register')}>
          {(['register', 'signin'] as const).map((m) => {
            const isSelected = m === mode;
            return (
              <button
                key={m}
                css={button(theme, isSelected)}
                onClick={() => {
                  if (mode === m) onSubmit();
                  else setMode(m);
                }}
                disabled={isSelected && !canSubmit}
              >
                {isLoading && isSelected ? (
                  <Loader color={theme.almostBg} />
                ) : (
                  t(m)
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const container = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  color: ${theme.almostFg};
  width: 100%;
  gap: 40px;
`;

const headline = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 26px;
  color: ${theme.almostFg};

  & div:first-of-type {
    font-weight: 700;
    font-size: 28px;
  }
`;

const form = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const input = (theme: Theme) => css`
  padding: 16px;
  width: 100%;
  background-color: transparent;
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  border: 1.25px solid ${theme.neutral};
  color: ${theme.middleFg};
  font-weight: 600;

  &::placeholder {
    color: ${theme.neutral};
    font-weight: 500;
  }
`;

const buttons = (theme: Theme, isLeft: boolean) => css`
  display: flex;
  flex-direction: row;
  height: 50px;
  width: 100%;
  background-color: ${theme.middleBg};
  border-radius: 8px;
  font-weight: 600;
  position: relative;

  &::before {
    transition: all 200ms ease-in-out;
    content: '';
    position: absolute;
    border-radius: 8px;
    width: 50%;
    height: 100%;
    background-color: ${theme.almostFg};
    left: ${isLeft ? 0 : '50%'};
  }
`;

const button = (theme: Theme, selected: boolean) => css`
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: hidden;
  color: ${selected ? theme.almostBg : theme.almostFg};
  font-weight: 600;
  position: relative;
  z-index: 1;
  cursor: pointer;
`;

const error = (theme: Theme) => css`
  text-align: center;
  font-size: 12px;
  color: ${theme.bitFg};
`;

export default SignIn;
