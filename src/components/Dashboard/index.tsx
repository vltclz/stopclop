import { useState } from 'react';
import Loader from '../Loader';
import MessageContainer from './MessageContainer';
import useCigStream from 'hooks/useCigStream';
import useMessagesContent, { Message } from 'hooks/useMessagesContent';
import MainContainer from './MainContainer';
import SettingsContainer from './SettingsContainer';

const Dashboard = () => {
  const { cigStream } = useCigStream();
  const { rulesMessage } = useMessagesContent();
  const sawRules = JSON.parse(localStorage.getItem('sawRules'));
  const [message, setMessage] = useState<Message>(
    sawRules ? null : rulesMessage
  );
  const [showMessage, setShowMessage] = useState(!sawRules);
  const [showSettings, setShowSettings] = useState(false);

  return cigStream ? (
    <>
      <MessageContainer
        message={message}
        showMessage={showMessage}
        setShowMessage={setShowMessage}
      />
      <MainContainer
        setMessage={setMessage}
        showMessage={showMessage}
        setShowMessage={setShowMessage}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      <SettingsContainer
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
    </>
  ) : (
    <Loader />
  );
};

export default Dashboard;
