import cigStreamAtom from 'atoms/cigStreamAtom';
import localDataAtom from 'atoms/localDataAtom';
import axios from 'axios';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

export enum CigType {
  AVOIDED = 'avoided',
  SMOKED = 'smoked',
}

export type CigStreamArray =
  | {
      type: CigType;
      timestamp: number;
    }[]
  | null;

const transformRawStream = (
  rawStream: { id: string; message: { type: CigType } }[]
): CigStreamArray =>
  rawStream.map(({ id, message: { type } }) => ({
    timestamp: parseInt(id.split('-')[0], 10),
    type,
  }));

const useCigStream = () => {
  const [cigStream, setCigStream] = useRecoilState(cigStreamAtom);
  const [localData] = useRecoilState(localDataAtom);
  const identifiedUser = !!localData.username && !!localData.token;

  const addInStream = async (type: CigType) =>
    identifiedUser &&
    (await axios
      .post(
        `${process.env.REACT_APP_BACK_URL}/${localData.username}/stream/${type}`,
        {},
        {
          headers: { Authorization: localData.token },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setCigStream(transformRawStream(response.data));
        }
      })
      .catch((err) => {
        throw new Error(err);
      }));

  // Fetch user's stream of cigarettes
  useEffect(() => {
    if (!cigStream && identifiedUser) {
      const fetch = async () => {
        await axios
          .get(
            `${process.env.REACT_APP_BACK_URL}/${localData.username}/stream`,
            {
              headers: { Authorization: localData.token },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              setCigStream(transformRawStream(response.data));
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
      };
      fetch();
    }
  }, [cigStream, identifiedUser, localData, setCigStream]);

  return { cigStream, setCigStream, addInStream };
};

export default useCigStream;
