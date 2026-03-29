import { useParams } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import useFetchFromApi from "../../hooks/useFetchFromApi";
import useFindAndGotoThread from "../../hooks/useFindAndGotoThread";
import { isOnline } from "../../utilities/helperFunctions";
import ProfilePic from "../../components/ProfilePic";
import styles from "./User.module.css";

function User() {
  const { userId } = useParams();
  const {
    data,
    isLoading: userIsLoading,
    error: userError,
  } = useFetchFromApi(`/user/${userId}`);
  const { user } = data || {};

  const {
    findAndGotoThread,
    isLoading: findIsLoading,
    error: findError,
  } = useFindAndGotoThread();

  return (
    <div className={styles.container}>
      {userIsLoading && <p>Loading...</p>}
      {userError && <p className={styles.error}>{userError}</p>}
      {data && (
        <>
          <div className={styles.userHeader}>
            <ProfilePic
              src={user.profile.pictureURL}
              size={100}
              online={isOnline(user.profile.lastActive)}
            ></ProfilePic>
            <h2>{user.username}</h2>
          </div>

          <div>
            <h3>Bio</h3>
            <p>{user.profile.about || "There's nothing here..."}</p>
          </div>

          <div>
            <h3>Last Seen</h3>
            <p>
              {formatDistanceToNow(user.profile.lastActive, {
                addSuffix: true,
              })}
            </p>
          </div>

          <div>
            <h3>Account Created</h3>
            <p>{format(user.profile.createdAt, "PP")}</p>
          </div>

          <button
            className={styles.messageBtn}
            onClick={() => findAndGotoThread(user.id)}
            disabled={findIsLoading}
          >
            Send Message
          </button>
          {findError && <span className={styles.error}>{findError}</span>}
        </>
      )}
    </div>
  );
}

export default User;
