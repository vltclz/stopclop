/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import localDataAtom from 'atoms/localDataAtom';
import axios from 'axios';
import Minus from 'components/Minus';
import Plus from 'components/Plus';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import * as styles from './styles';
import lodash from 'lodash';
import Loader from 'components/Loader';

enum SettingKey {
  PRICE = 'price',
  CAPACITY = 'capacity',
  COOLDOWN = 'cooldown',
}

export type Settings = Record<SettingKey, number>;

type SettingSpecs = {
  key: SettingKey;
  min: number;
  max: number;
  step: number;
};

const SettingsContainer = ({
  showSettings,
  setShowSettings,
}: {
  showSettings: boolean;
  setShowSettings: Dispatch<SetStateAction<boolean>>;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [localData, setLocalData] = useRecoilState(localDataAtom);
  const [settingsState, setSettingsState] = useState<Settings>(
    localData.settings
  );
  const [isLoading, setIsLoading] = useState(false);

  const setSettingState = useCallback(
    (props: SettingSpecs & { value: number }) => {
      const { key, min, max, value } = props;
      if (min <= value && value <= max) {
        setSettingsState({ ...settingsState, [key]: value });
      }
    },
    [settingsState]
  );

  const settings: SettingSpecs[] = useMemo(
    () => [
      { key: SettingKey.PRICE, min: 2, max: 30, step: 0.1 },
      { key: SettingKey.CAPACITY, min: 10, max: 150, step: 5 },
      { key: SettingKey.COOLDOWN, min: 1, max: 60, step: 1 },
    ],
    []
  );

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    await axios
      .post(
        `${process.env.REACT_APP_BACK_URL}/${localData.username}/settings`,
        settingsState
      )
      .then(({ status, data }) => {
        if (status === 200) {
          setLocalData({ ...localData, ...data });
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
    setIsLoading(false);
  }, [localData, setLocalData, settingsState]);

  return (
    <div css={styles.container('right', showSettings)}>
      {settings.map((specs) => (
        <div key={specs.key}>
          <label css={label(theme)}>{t(specs.key)}</label>
          <div css={inputContainer}>
            <div
              role="button"
              onClick={() =>
                setSettingState({
                  ...specs,
                  value:
                    Math.round((settingsState[specs.key] - specs.step) * 1e2) /
                    1e2,
                })
              }
            >
              <Minus height={25} />
            </div>
            <input
              css={input(theme)}
              type="number"
              min={specs.min}
              max={specs.max}
              step={specs.step}
              value={settingsState[specs.key]}
              onChange={(e) =>
                setSettingState({
                  ...specs,
                  value: Math.round(parseFloat(e.target.value) * 1e2) / 1e2,
                })
              }
            />
            <div
              role="button"
              onClick={() =>
                setSettingState({
                  ...specs,
                  value:
                    Math.round((settingsState[specs.key] + specs.step) * 1e2) /
                    1e2,
                })
              }
            >
              <Plus height={25} />
            </div>
          </div>
        </div>
      ))}

      <div css={styles.actionsContainer(theme)}>
        <button
          css={styles.button(theme, true)}
          onClick={() => {
            onSubmit();
            setShowSettings(false);
          }}
          disabled={lodash.isEqual(localData.settings, settingsState)}
        >
          {isLoading ? <Loader /> : t('save')}
        </button>
        <button
          css={styles.button(theme, false)}
          onClick={() => {
            setShowSettings(false);
          }}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
};

const inputContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  [role='button'] {
    cursor: pointer;
  }
`;

const label = (theme: Theme) => css`
  display: block;
  margin-top: 16px;
  margin-bottom: 8px;
  color: ${theme.almostFg};
`;

const input = (theme: Theme) => css`
  all: unset;
  font-size: 22px;
  font-weight: 700;
  width: 250px;
  color: ${theme.almostFg};
  transition: color 200ms ease-in-out;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export default SettingsContainer;
