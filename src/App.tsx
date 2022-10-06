/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { css, Theme, useTheme } from '@emotion/react';
import ThemeToggle from 'components/ThemeToggle';
import Pack from 'components/Pack';
import Cigarette from 'components/Cigarette';
import SignIn from 'components/SignIn';
import LangToggle from 'components/LangToggle';
import Copyright from 'components/Copyright';
import Stream from 'components/Stream';

type UserData = {
  username: string;
  token: string;
  stream: {
    type: 'avoided' | 'smoked';
    time: number;
  }[];
};

export type UserDataState = UserData | 'pending';

const App = ({ toggleTheme }: { toggleTheme(): void }) => {
  const theme = useTheme();
  const [data, setData] = useState<UserDataState>();

  useEffect(() => {
    if (!data) {
      setData(JSON.parse(localStorage.getItem('localData')) || 'pending');
    } else {
      localStorage.setItem('localData', JSON.stringify(data));
    }
  }, [data]);

  return (
    <div css={fullContainerStyle(theme)}>
      <div css={appContainerStyle}>
        <div css={header}>
          <div css={logo}>
            <Pack height={35} />
            <Cigarette height={35} />
          </div>
          <div css={name}>stopclop</div>
          <ThemeToggle toggleTheme={toggleTheme} />
        </div>
        <div css={app}>
          {data === 'pending' ? (
            <SignIn setData={setData} />
          ) : (
            <Stream setData={setData} />
          )}
          {!data && <Loader />}
        </div>
        <div css={footer}>
          <Copyright />
          <LangToggle />
        </div>
      </div>
    </div>
  );
};

const fullContainerStyle = (theme: Theme) => css`
  height: 100%;
  width: 100%;
  background-color: ${theme.almostBg};
`;

const appContainerStyle = css`
  height: 100%;
  max-width: 480px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const header = css`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 24px;
  width: 100%;
  gap: 16px;
`;

const logo = css`
  display: flex;
  gap: 8px;
`;

const name = (theme: Theme) => css`
  color: ${theme.almostFg};
  flex: 1;
  font-weight: 700;
  font-size: 18px;
`;

const app = (theme: Theme) => css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  width: 100%;
  padding: 32px 24px;
  box-sizing: border-box;
`;

const footer = css`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  gap: 16px;
`;

export default App;
