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
  useEffect,
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

type SettingAttributes = {
  key: SettingKey;
  min: number;
  max: number;
  step: number;
  suffix?: string;
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
  const [modifiedSettings, setModifiedSettings] = useState<Settings>(
    localData.settings
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showSettings) setModifiedSettings(localData.settings);
  }, [localData.settings, showSettings]);

  const varySetting = useCallback(
    ({
      key,
      min,
      max,
      step,
      action,
    }: SettingAttributes & { action: 'increment' | 'decrement' }) => {
      const value =
        Math.round(
          (modifiedSettings[key] + (action === 'increment' ? step : -step)) *
            1e2
        ) / 1e2;
      if (min <= value && value <= max) {
        setModifiedSettings({ ...modifiedSettings, [key]: value });
      }
    },
    [modifiedSettings]
  );

  const setSetting = useCallback(
    ({
      key,
      min,
      max,
      inputValue,
    }: SettingAttributes & { inputValue: number }) => {
      const value =
        isNaN(inputValue) || inputValue <= min
          ? min
          : inputValue >= max
          ? max
          : inputValue;
      setModifiedSettings({ ...modifiedSettings, [key]: value });
    },
    [modifiedSettings]
  );

  const settingsAttributes: SettingAttributes[] = useMemo(
    () => [
      { key: SettingKey.PRICE, min: 2, max: 30, step: 0.1, suffix: '€' },
      { key: SettingKey.CAPACITY, min: 10, max: 150, step: 5 },
      { key: SettingKey.COOLDOWN, min: 1, max: 60, step: 1, suffix: 'min' },
    ],
    []
  );

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    await axios
      .post(
        `${process.env.REACT_APP_BACK_URL}/${localData.username}/settings`,
        modifiedSettings
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
  }, [localData, setLocalData, modifiedSettings]);

  return (
    <div css={styles.container('right', showSettings)}>
      {settingsAttributes.map((settingAttributes) => {
        const { key, min, max, step, suffix } = settingAttributes;
        const decrementDisabled = modifiedSettings[key] === min;
        const incrementDisabled = modifiedSettings[key] === max;
        return (
          <div key={key}>
            <label css={label(theme)}>{t(key)}</label>
            <div css={inputContainer}>
              <button
                onClick={() =>
                  varySetting({
                    ...settingAttributes,
                    action: 'decrement',
                  })
                }
                disabled={decrementDisabled}
              >
                <Minus
                  color={decrementDisabled ? theme.bitBg : theme.almostFg}
                  height={25}
                />
              </button>
              <div css={inputSuffixContainer}>
                <input
                  css={input(theme)}
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={modifiedSettings[key]}
                  onChange={(e) =>
                    setSetting({
                      ...settingAttributes,
                      inputValue:
                        Math.round(parseFloat(e.target.value) * 1e2) / 1e2,
                    })
                  }
                />
                <span css={suffixSpan(theme)}>{suffix}</span>
              </div>
              <button
                onClick={() =>
                  varySetting({
                    ...settingAttributes,
                    action: 'increment',
                  })
                }
                disabled={incrementDisabled}
              >
                <Plus
                  color={incrementDisabled ? theme.bitBg : theme.almostFg}
                  height={25}
                />
              </button>
            </div>
          </div>
        );
      })}

      <div css={styles.actionsContainer(theme)}>
        <button
          css={styles.button(theme, true)}
          onClick={() => {
            onSubmit();
            setShowSettings(false);
          }}
          disabled={lodash.isEqual(localData.settings, modifiedSettings)}
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

  button {
    all: unset;
    cursor: pointer;

    &:disabled {
      cursor: auto;
    }
  }
`;

const inputSuffixContainer = css`
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-size: 22px;
`;

const suffixSpan = (theme: Theme) => css`
  color: ${theme.almostFg};
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
  width: fit-content;
  color: ${theme.almostFg};
  transition: color 200ms ease-in-out;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export default SettingsContainer;
