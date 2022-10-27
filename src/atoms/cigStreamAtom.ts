import { CigStreamArray } from 'hooks/useCigStream';
import { atom } from 'recoil';

const cigStreamAtom = atom<CigStreamArray>({
  key: 'cigStream',
  default: null,
});

export default cigStreamAtom;
