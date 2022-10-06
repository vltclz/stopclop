/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from '@emotion/react';
import Cigarette from './Cigarette';
import { StreamArray, ElementType } from './Dashboard';
import Pack from './Pack';

const Stream = ({
  stream,
  filter,
}: {
  stream: StreamArray;
  filter: ElementType;
}) => {
  const theme = useTheme();
  const filtered = stream.filter(({ type }) => type === filter);
  const packs = Math.floor(filtered.length / 20);
  const cigarettes = filtered.length % 20;
  const smoked = filter === 'smoked';

  return (
    <div css={container(theme)}>
      <Pack
        height={40}
        color={packs === 0 ? theme.middleBg : smoked && theme.red}
        number={packs || undefined}
      />
      {[...Array(cigarettes)].map((_, i) => (
        <Cigarette
          key={`visible-${filter}-${i}`}
          height={40}
          color={smoked && theme.red}
        />
      ))}
      {[...Array(20 - cigarettes)].map((_, i) => (
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

export default Stream;
