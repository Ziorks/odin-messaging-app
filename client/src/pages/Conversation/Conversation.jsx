import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";
import { format } from "date-fns";
import useFetchFromApi from "../../hooks/useFetchFromApi";
import useSendMessage from "../../hooks/useSendMessage";
import useSendUpdate from "../../hooks/useSendUpdate";
import { isOnline } from "../../utilities/helperFunctions";
import { GlobalContext } from "../../contexts";
import ProfilePic from "../../components/ProfilePic";
import styles from "./Conversation.module.css";

function Conversation() {
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState({ messageId: null, body: null });
  const isEditing = edit.messageId !== null;
  const { user } = useContext(GlobalContext);
  const { conversationId } = useParams();

  const {
    data,
    isLoading: threadIsLoading,
    error: threadError,
    refetch,
  } = useFetchFromApi(`/thread/${conversationId}`);

  const {
    sendMessage,
    isLoading: messageIsLoading,
    errors: messageErrors,
  } = useSendMessage(+conversationId, refetch);

  const {
    sendUpdate,
    isLoading: editIsLoading,
    errors: editErrors,
  } = useSendUpdate(refetch);

  const thread = data?.thread;

  const handleMessageFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    sendUpdate(`/message/${edit.messageId}`, { body: edit.body });
    setEdit({ messageId: null, body: null });
  };

  const getUserById = (userId) => {
    return thread.participants.find((participant) => participant.id === userId);
  };

  return (
    <div className={styles.pageContainer}>
      {data && (
        <div className={styles.conversationContainer}>
          <ul className={styles.participantsList}>
            {thread.participants.map((participant) => (
              <li key={participant.id}>
                <Link
                  to={`/users/${participant.id}`}
                  className={styles.participantLink}
                >
                  <ProfilePic
                    src={participant.profile.pictureURL}
                    size={40}
                    online={participant.profile.lastActive}
                  />
                  {participant.username}
                </Link>
              </li>
            ))}
          </ul>
          {threadIsLoading && <p>Loading conversation...</p>}
          {threadError && <p>{threadError}</p>}
          <ol className={styles.messagesList}>
            {thread.messages.map((message) => {
              const { id, senderId, body, isEdited, createdAt } = message;
              const sender = getUserById(senderId);
              return (
                <li key={id} className={styles.message}>
                  <ProfilePic
                    src={sender.profile.pictureURL}
                    size={25}
                    online={isOnline(sender.profile.lastActive)}
                  />
                  <p>
                    <Link
                      to={`/users/${sender.id}`}
                      className={styles.username}
                    >
                      {sender.username}
                    </Link>{" "}
                    <span className={styles.subtext}>
                      {format(createdAt, "M/d/yy, h:mmaaa")}
                    </span>
                  </p>
                  <p className={styles.messageBody}>
                    {body}
                    {isEdited && (
                      <span className={styles.subtext}> - edited</span>
                    )}
                  </p>
                  {!isEditing && senderId === user.id ? (
                    <button onClick={() => setEdit({ messageId: id, body })}>
                      Edit
                    </button>
                  ) : (
                    <button style={{ visibility: "hidden" }}>
                      this is just for spacing
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
          <div className={styles.actionsContainer}>
            <button
              onClick={refetch}
              disabled={threadIsLoading}
              className={styles.refreshBtn}
            >
              <FiRefreshCw />
            </button>
            {isEditing ? (
              <>
                <form
                  onSubmit={handleEditFormSubmit}
                  className={styles.messageForm}
                >
                  <input
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Edit message..."
                    autoComplete="off"
                    value={edit.body}
                    onChange={(e) =>
                      setEdit((prev) => ({ ...prev, body: e.target.value }))
                    }
                  />
                  <button type="submit" disabled={!edit.body || editIsLoading}>
                    Save
                  </button>
                  <button
                    onClick={() => setEdit({ messageId: null, body: null })}
                  >
                    Cancel
                  </button>
                </form>
                {editIsLoading && <p>Saving changes...</p>}
                {editErrors && (
                  <ul>
                    {editErrors.map((error) => (
                      <li>{error.msg}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <>
                <form
                  onSubmit={handleMessageFormSubmit}
                  className={styles.messageForm}
                >
                  <input
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Type a message..."
                    autoComplete="off"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" disabled={!message || messageIsLoading}>
                    Send
                  </button>
                </form>
                {messageIsLoading && <p>Sending message...</p>}
                {messageErrors && (
                  <ul>
                    {messageErrors.map((error) => (
                      <li>{error.msg}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Conversation;
