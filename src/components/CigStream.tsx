/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import localDataAtom from 'atoms/localDataAtom';
import useCigStream, { CigType } from 'hooks/useCigStream';
import { useRecoilState } from 'recoil';
import Cigarette from './Cigarette';
import Pack from './Pack';

const CigStream = ({ filter }: { filter: CigType }) => {
  const theme = useTheme();
  const { cigStream } = useCigStream();
  const [localData] = useRecoilState(localDataAtom);
  const filtered = cigStream.filter(({ type }) => type === filter);
  const packs = Math.floor(filtered.length / localData.settings.capacity);
  const cigarettes = filtered.length % localData.settings.capacity;
  const smoked = filter === CigType.SMOKED;

  return (
    <div css={container(theme)}>
      <Pack
        height={40}
        color={packs === 0 ? theme.middleBg : smoked && theme.red}
        count={packs || undefined}
      />
      {[...Array(cigarettes)].map((_, i) => (
        <Cigarette
          key={`visible-${filter}-${i}`}
          height={40}
          color={smoked && theme.red}
        />
      ))}
      {[...Array(localData.settings.capacity - cigarettes)].map((_, i) => (
        <Cigarette
          key={`invisible-${filter}-${i}`}
          height={40}
          color={theme.middleBg}
        />
      ))}
    </div>
  );
};

const container = (theme: Theme) => css`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export default CigStream;
