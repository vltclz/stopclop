import { CigStreamArray } from 'hooks/useCigStream';
import { atom } from 'recoil';

const defaultAtom: CigStreamArray = null;

const cigStreamAtom = atom<CigStreamArray>({
  key: 'cigStream',
  default: defaultAtom,
});

export default cigStreamAtom;
