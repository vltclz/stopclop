import { UserDataState } from 'App';
import { Dispatch, SetStateAction } from 'react';

const Stream = ({
  setData,
}: {
  setData: Dispatch<SetStateAction<UserDataState>>;
}) => {
  return (
    <div>
      Bjr <button onClick={() => setData('pending')}>Log Out</button>
    </div>
  );
};

export default Stream;
