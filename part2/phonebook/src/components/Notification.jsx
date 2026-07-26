const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  console.log(message);
  const { text, type } = message;
  return <div className={`notification ${type}`}>{text}</div>;
};

export default Notification;
