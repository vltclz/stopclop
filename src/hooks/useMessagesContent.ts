import localDataAtom from 'atoms/localDataAtom';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

export type Message = { title: string; content: string[] };

const useMessagesContent = () => {
  const { t } = useTranslation();
  const [localData] = useRecoilState(localDataAtom);

  const rulesMessage = {
    title: t('rulesTitle'),
    content: [
      t('rulesContent1'),
      t('rulesContent2'),
      t('rulesContent3'),
      t('rulesContent4'),
    ],
  };

  const avoidedMessage = {
    title: t('congratsTitle'),
    content: [
      t('congratsContent1'),
      t('congratsContent2', {
        saved: (localData.settings.price / localData.settings.capacity).toFixed(
          2
        ),
      }),
    ],
  };

  const smokedMessage = {
    title: t('booTitle'),
    content: [t('booContent1')],
  };

  const smokedMessageWithLast = (last: string) => ({
    title: t('booTitle'),
    content: [t('booContent1'), t('booContent2', { last })],
  });

  return {
    rulesMessage,
    avoidedMessage,
    smokedMessage,
    smokedMessageWithLast,
  };
};

export default useMessagesContent;
