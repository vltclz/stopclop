/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import ThemeToggle from 'components/ThemeToggle';
import Pack from 'components/Pack';
import Cigarette from 'components/Cigarette';
import SignIn from 'components/SignIn';
import LangToggle from 'components/LangToggle';
import Copyright from 'components/Copyright';
import Dashboard from 'components/Dashboard';
import { useRecoilState } from 'recoil';
import localDataAtom from 'atoms/localDataAtom';

const App = ({ toggleTheme }: { toggleTheme(): void }) => {
  const theme = useTheme();
  const [localData] = useRecoilState(localDataAtom);

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
        <div css={app}>{localData.username ? <Dashboard /> : <SignIn />}</div>
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
  overflow: hidden;
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
  gap: 0px;
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
