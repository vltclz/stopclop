/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import { UserDataState, UserData } from 'App';
import axios from 'axios';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';
import Stream from './Stream';

const COOLDOWN_SECONDS = process.env.NODE_ENV === 'development' ? 10 : 30 * 60;
const PACK_PRICE = 10.5;

export type ElementType = 'avoided' | 'smoked';

export type StreamArray = {
  type: ElementType;
  time: number;
}[];

const transformStream = (
  rawStream: { id: string; message: { type: ElementType } }[]
) =>
  rawStream.map(({ id, message: { type } }) => ({
    time: parseInt(id.split('-')[0], 10),
    type,
  }));

const Dashboard = ({
  data,
  setData,
}: {
  data: UserData;
  setData: Dispatch<SetStateAction<UserDataState>>;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [stream, setStream] = useState<StreamArray>();
  const [errorString, setErrorString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sawRules = JSON.parse(localStorage.getItem('sawRules'));
  const rulesMessage = {
    title: t('rulesTitle'),
    content: [
      t('rulesContent1'),
      t('rulesContent2'),
      t('rulesContent3'),
      t('rulesContent4'),
    ],
  };
  const [message, setMessage] = useState<{ title: string; content: string[] }>(
    sawRules ? null : rulesMessage
  );
  const [showMessage, setShowMessage] = useState(!sawRules);
  const [lastSmoked, setLastSmoked] = useState('-');
  const [lastSmokedFull, setLastSmokedFull] = useState('-');
  const [cooldown, setCooldown] = useState(0);
  const hasOverlay = isLoading || cooldown > 0;

  // Fetch user's stream of cigarettes
  useEffect(() => {
    if (!stream && data) {
      const fetch = async () => {
        await axios
          .get(`${process.env.REACT_APP_BACK_URL}/${data.username}/stream`, {
            headers: { Authorization: data.token },
          })
          .then((response) => {
            if (response.status === 200) {
              setStream(transformStream(response.data));
            }
          })
          .catch((err) => setErrorString(err.toString()));
      };
      fetch();
    }
  }, [data, stream]);

  // Handle adding avoided/smoked cigarette to stream
  const handleAdd = useCallback(
    async (type: ElementType) => {
      setIsLoading(true);
      await axios
        .post(
          `${process.env.REACT_APP_BACK_URL}/${data.username}/stream/${type}`,
          {},
          {
            headers: { Authorization: data.token },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setStream(transformStream(response.data));
          }
        })
        .catch((err) => setErrorString(err.toString()));
      setIsLoading(false);
      if (type === 'avoided')
        setMessage({
          title: t('congratsTitle'),
          content: [
            t('congratsContent1'),
            t('congratsContent2', { saved: (PACK_PRICE / 20).toFixed(2) }),
          ],
        });
      else
        setMessage({
          title: t('bouhTitle'),
          content: [
            t('bouhContent1'),
            t('bouhContent2', { last: lastSmokedFull }),
          ],
        });
      setShowMessage(true);
    },
    [data, lastSmokedFull, t]
  );

  // Interval for cooldown update
  useEffect(() => {
    const checkCooldown = () => {
      if (!stream || !stream.length) return;
      const availabilityTime =
        Math.floor(stream[stream.length - 1].time / 1000) + COOLDOWN_SECONDS;
      const timeNow = Math.floor(Date.now() / 1000);
      const remainingTotalSeconds = availabilityTime - timeNow;
      if (remainingTotalSeconds < -1) return;
      setCooldown(remainingTotalSeconds);
    };
    if (stream) checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [stream]);
  // Cooldown string computation
  const cdMinutes = Math.floor(cooldown / 60);
  const cdSeconds = Math.floor(cooldown % 60);
  const timer = `${cdMinutes < 10 ? '0' : ''}${cdMinutes}:${
    cdSeconds < 10 ? '0' : ''
  }${cdSeconds}`;

  // Saved money computation
  const avoidedCigarettes = stream
    ? stream.filter(({ type }) => type === 'avoided').length
    : 0;
  const smokedCigarettes = stream
    ? stream.filter(({ type }) => type === 'smoked').length
    : 0;
  const savedAmount =
    (avoidedCigarettes - smokedCigarettes) * (PACK_PRICE / 20);

  // Last smoked string computation
  useEffect(() => {
    const checkLastSmoked = () => {
      if (!stream || !stream.length) return;
      const smoked = stream.filter(({ type }) => type === 'smoked');
      if (!smoked.length) return;
      const ls = !!smoked.length && smoked[smoked.length - 1];
      const lsSeconds = Math.floor((Date.now() - ls.time) / 1000);
      const lsMinutes = Math.floor(lsSeconds / 60);
      const lsHours = Math.floor(lsMinutes / 60);
      const lsDays = Math.floor(lsHours / 24);
      setLastSmoked(
        lsDays > 0
          ? `${lsDays}${t('dayMin')}`
          : lsHours > 0
          ? `${lsHours}${t('hourMin')}`
          : `${lsMinutes}${t('minuteMin')}`
      );
      if (lsMinutes > 0)
        setLastSmokedFull(
          lsDays > 0
            ? t('dayWithCount', { count: lsDays })
            : lsHours > 0
            ? t('hourWithCount', { count: lsHours })
            : t('minuteWithCount', { count: lsMinutes })
        );
    };
    if (stream) checkLastSmoked();
    const interval = setInterval(checkLastSmoked, 1000);
    return () => clearInterval(interval);
  }, [stream, t]);

  return stream ? (
    <>
      <div css={container('left', showMessage)}>
        {message && (
          <div css={messageContainer(theme)}>
            <div>{message.title}</div>
            {message.content.map((p, i) => (
              <div key={i}>{p}</div>
            ))}
            <button
              css={button(theme, false)}
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
      <div css={container('right', !showMessage)}>
        <div css={stats}>
          <div css={stat(theme)}>
            <div>{t('savedMoney')}</div>
            <div>{savedAmount ? `${savedAmount.toFixed(2)} €` : '-'}</div>
          </div>
          <div css={stat(theme)}>
            <div>{t('lastSmoked')}</div>
            <div>{lastSmoked}</div>
          </div>
        </div>
        <Stream stream={stream} filter="avoided" />
        <Stream stream={stream} filter="smoked" />
        {errorString && <div css={error(theme)}>{errorString}</div>}
        <div css={actionContainer(theme)}>
          {hasOverlay && (
            <div css={actionOverlay(theme)}>
              {isLoading ? <Loader /> : timer}
            </div>
          )}
          <button
            css={button(theme, true)}
            onClick={() => handleAdd('avoided')}
            disabled={hasOverlay}
          >
            {t('avoid')}
          </button>
          <button
            css={button(theme, false)}
            onClick={() => handleAdd('smoked')}
            disabled={hasOverlay}
          >
            {t('smoke')}
          </button>
        </div>
        <div css={secondaryLinks(theme)}>
          <div
            onClick={() => {
              setMessage(rulesMessage);
              setShowMessage(true);
            }}
          >
            {t('seeRules')}
          </div>
          <div onClick={() => setData('pending')}>{t('logOut')}</div>
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
};

const container = (from: 'right' | 'left', visible: boolean) => css`
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

const stats = () => css`
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

const error = (theme: Theme) => css`
  text-align: center;
  font-size: 12px;
  color: ${theme.bitFg};
`;

const actionContainer = (theme: Theme) => css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const actionOverlay = (theme: Theme) => css`
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

const button = (theme: Theme, main: boolean) => css`
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

const secondaryLinks = (theme: Theme) => css`
  font-size: 12px;
  color: ${theme.almostFg};
  display: flex;
  flex-direction: column;
  gap: 16px;

  & div {
    cursor: pointer;
  }
`;

const messageContainer = (theme: Theme) => css`
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

export default Dashboard;
