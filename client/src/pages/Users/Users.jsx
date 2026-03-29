import { Link } from "react-router-dom";
import { IoChatbubbleOutline } from "react-icons/io5";
import useSearch from "../../hooks/useSearch";
import useFindAndGotoThread from "../../hooks/useFindAndGotoThread";
import { isOnline } from "../../utilities/helperFunctions";
import SearchFrom from "../../components/SearchForm";
import PageNavigation from "../../components/PageNavigation";
import styles from "./Users.module.css";
import ProfilePic from "../../components/ProfilePic/ProfilePic";

function Users() {
  const {
    search,
    page,
    resultsPerPage,
    results,
    isLoading: searchIsLoading,
    error: searchError,
    queryHandlers,
  } = useSearch("/user");

  const { findAndGotoThread } = useFindAndGotoThread();

  return (
    <div className={styles.pageContainer}>
      <h1>User Search</h1>
      <SearchFrom
        search={search}
        handleSearchChange={queryHandlers.handleSearchChange}
      />
      {searchIsLoading && <p>Searching...</p>}
      {searchError && <p>{searchError}</p>}
      {results && (
        <>
          <div>
            <p>{results.count} Results</p>
            <ul className={styles.resultsList}>
              {results.users.map((user) => (
                <li key={user.id} className={styles.resultsItem}>
                  <Link to={`/users/${user.id}`} className={styles.userLink}>
                    <div className={styles.userInfo}>
                      <ProfilePic
                        src={user.profile.pictureURL}
                        size={25}
                        online={isOnline(user.profile.lastActive)}
                      />
                      {user.username}
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      findAndGotoThread(user.id);
                    }}
                    className={styles.messageBtn}
                  >
                    <IoChatbubbleOutline />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <PageNavigation
            resultsCount={results.count}
            page={page}
            resultsPerPage={resultsPerPage}
            isLoading={searchIsLoading}
            queryHandlers={queryHandlers}
          />
        </>
      )}
    </div>
  );
}

export default Users;
