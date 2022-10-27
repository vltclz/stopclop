import { Settings } from 'components/Dashboard/SettingsContainer';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

type UserData = {
  username?: string;
  token?: string;
  settings?: Settings;
};

const localDataAtom = atom<UserData>({
  key: 'localData',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export default localDataAtom;
