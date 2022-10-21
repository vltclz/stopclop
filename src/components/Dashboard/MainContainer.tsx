/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import localDataAtom from 'atoms/localDataAtom';
import CigStream from 'components/CigStream';
import Loader from 'components/Loader';
import useCigStream, { CigType } from 'hooks/useCigStream';
import useMessagesContent, { Message } from 'hooks/useMessagesContent';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import * as styles from './styles';

const MainContainer = ({
  setMessage,
  showMessage,
  setShowMessage,
  showSettings,
  setShowSettings,
}: {
  setMessage: Dispatch<SetStateAction<Message>>;
  showMessage: boolean;
  setShowMessage: Dispatch<SetStateAction<boolean>>;
  showSettings: boolean;
  setShowSettings: Dispatch<SetStateAction<boolean>>;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [localData, setLocalData] = useRecoilState(localDataAtom);
  const { cigStream, setCigStream, addInStream } = useCigStream();
  const { rulesMessage, avoidedMessage, smokedMessage, smokedMessageWithLast } =
    useMessagesContent();
  const [lastSmoked, setLastSmoked] = useState('-');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const hasOverlay = isLoading || cooldown > 0;

  const computeLastSmoked = useCallback(() => {
    if (!cigStream || !cigStream.length) return {};
    const smoked = cigStream.filter(({ type }) => type === CigType.SMOKED);
    if (!smoked.length) return {};
    const ls = !!smoked.length && smoked[smoked.length - 1];
    const lsSeconds = Math.round((Date.now() - ls.timestamp) / 1000);
    const lsMinutes = Math.round(lsSeconds / 60);
    const lsHours = Math.round(lsMinutes / 60);
    const lsDays = Math.round(lsHours / 24);
    return { lsDays, lsHours, lsMinutes };
  }, [cigStream]);

  const handleAdd = useCallback(
    async (type: CigType) => {
      setIsLoading(true);
      await addInStream(type);
      setIsLoading(false);
      if (type === CigType.AVOIDED) setMessage(avoidedMessage);
      else {
        const { lsDays, lsHours, lsMinutes } = computeLastSmoked();
        const showLast = Boolean(lsDays + lsHours + lsMinutes);
        setMessage(
          showLast
            ? smokedMessageWithLast(
                lsDays > 0
                  ? t('dayWithCount', { count: lsDays })
                  : lsHours > 0
                  ? t('hourWithCount', { count: lsHours })
                  : t('minuteWithCount', { count: lsMinutes })
              )
            : smokedMessage
        );
      }
      setShowMessage(true);
    },
    [
      addInStream,
      avoidedMessage,
      computeLastSmoked,
      setMessage,
      setShowMessage,
      smokedMessage,
      smokedMessageWithLast,
      t,
    ]
  );

  // SAVED
  const avoidedCigarettes = cigStream.filter(
    ({ type }) => type === CigType.AVOIDED
  ).length;
  const smokedCigarettes = cigStream.filter(
    ({ type }) => type === CigType.SMOKED
  ).length;
  const savedAmount =
    (avoidedCigarettes - smokedCigarettes) *
    (localData.settings.price / localData.settings.capacity);

  // LAST SMOKED
  useEffect(() => {
    const updateLastSmoked = () => {
      const { lsDays, lsHours, lsMinutes } = computeLastSmoked();
      if (lsMinutes !== undefined)
        setLastSmoked(
          lsDays > 0
            ? `${lsDays}${t('dayMin')}`
            : lsHours > 0
            ? `${lsHours}${t('hourMin')}`
            : `${lsMinutes}${t('minuteMin')}`
        );
    };
    if (cigStream) updateLastSmoked();
    const interval = setInterval(updateLastSmoked, 1000);
    return () => clearInterval(interval);
  }, [computeLastSmoked, cigStream, t]);

  // COOLDOWN
  useEffect(() => {
    const checkCooldown = () => {
      if (!cigStream || !cigStream.length) return;
      const availabilityTime =
        Math.floor(cigStream[cigStream.length - 1].timestamp / 1000) +
        localData.settings.cooldown * 60;
      const timeNow = Math.floor(Date.now() / 1000);
      const remainingTotalSeconds = availabilityTime - timeNow;
      if (remainingTotalSeconds < -1) return;
      setCooldown(remainingTotalSeconds);
    };
    if (cigStream) checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [cigStream, localData.settings.cooldown]);
  const cdMinutes = Math.floor(cooldown / 60);
  const cdSeconds = Math.floor(cooldown % 60);
  const timer = `${cdMinutes < 10 ? '0' : ''}${cdMinutes}:${
    cdSeconds < 10 ? '0' : ''
  }${cdSeconds}`;

  return (
    <div
      css={styles.container(
        showSettings ? 'left' : 'right',
        !showMessage && !showSettings
      )}
    >
      <div css={statsContainer}>
        <div css={stat(theme)}>
          <div>{t('savedMoney')}</div>
          <div>{savedAmount ? `${savedAmount.toFixed(2)} €` : '-'}</div>
        </div>
        <div css={stat(theme)}>
          <div>{t('lastSmoked')}</div>
          <div>{lastSmoked}</div>
        </div>
      </div>
      <CigStream filter={CigType.AVOIDED} />
      <CigStream filter={CigType.SMOKED} />
      <div css={styles.actionsContainer(theme)}>
        {hasOverlay && (
          <div css={actionsOverlay(theme)}>
            {isLoading ? <Loader /> : timer}
          </div>
        )}
        <button
          css={styles.button(theme, true)}
          onClick={() => handleAdd(CigType.AVOIDED)}
          disabled={hasOverlay}
        >
          {t('avoid')}
        </button>
        <button
          css={styles.button(theme, false)}
          onClick={() => handleAdd(CigType.SMOKED)}
          disabled={hasOverlay}
        >
          {t('smoke')}
        </button>
      </div>
      <div css={secondaryLinks(theme)}>
        <div css={swipeLinksContainer}>
          <div
            role="button"
            onClick={() => {
              setMessage(rulesMessage);
              setShowMessage(true);
            }}
          >
            {'< '}
            {t('seeRules')}
          </div>
          <div
            role="button"
            onClick={() => {
              setShowSettings(true);
            }}
          >
            {t('settings')}
            {' >'}
          </div>
        </div>
        <div
          role="button"
          onClick={() => {
            setLocalData({});
            setCigStream(null);
          }}
        >
          {t('logOut')}
        </div>
      </div>
    </div>
  );
};

const statsContainer = () => css`
  display: flex;
  justify-content: space-around;
`;

const stat = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: ${theme.almostFg};
  text-transform: uppercase;

  & div:last-of-type {
    font-weight: 700;
    font-size: 28px;
    text-transform: lowercase;
  }
`;

const actionsOverlay = (theme: Theme) => css`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 32px;
  color: ${theme.almostFg};
  z-index: 1;
`;

const secondaryLinks = (theme: Theme) => css`
  font-size: 12px;
  color: ${theme.almostFg};
  display: flex;
  flex-direction: column;
  gap: 16px;

  [role='button'] {
    cursor: pointer;
  }
`;

const swipeLinksContainer = css`
  display: flex;
  justify-content: center;
  gap: 24px;
`;

export default MainContainer;
