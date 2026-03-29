import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import useSearch from "../../hooks/useSearch";
import { isOnline } from "../../utilities/helperFunctions";
import SearchFrom from "../../components/SearchForm";
import PageNavigation from "../../components/PageNavigation";
import ProfilePic from "../../components/ProfilePic";
import styles from "./Conversations.module.css";

function Conversations() {
  const {
    search,
    page,
    resultsPerPage,
    results,
    isLoading,
    error,
    queryHandlers,
  } = useSearch("/thread");

  const formatParticipants = (participants) => {
    const names = participants.map((participant) => participant.username);
    if (names.length === 1) {
      return names[0];
    }

    names.sort((a, b) => a.localeCompare(b));
    const end = names.splice(-2, 2);
    names.push(end.join(" & "));
    return names.join(", ");
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Conversations</h1>
      <SearchFrom
        search={search}
        handleSearchChange={queryHandlers.handleSearchChange}
      />
      {isLoading && <p>Searching...</p>}
      {error && <p>{error}</p>}
      {results && (
        <>
          <p>{results.count} Results</p>
          <ol className={styles.resultsList}>
            {results.threads.map((thread) => (
              <li key={thread.id} className={styles.resultsItem}>
                <Link
                  to={`/conversations/${thread.id}`}
                  className={styles.conversationLink}
                >
                  <ProfilePic
                    src={thread.participants[0].profile.pictureURL}
                    size={50}
                    online={isOnline(thread.participants[0].profile.lastActive)}
                  />
                  <p>{formatParticipants(thread.participants)}</p>
                  <div className={styles.messageContainer}>
                    <p>{thread.messages[0].body}</p>
                    <p>
                      {formatDistanceToNow(thread.messages[0].createdAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
          <PageNavigation
            resultsCount={results.count}
            page={page}
            resultsPerPage={resultsPerPage}
            queryHandlers={queryHandlers}
          />
        </>
      )}
    </div>
  );
}

export default Conversations;
