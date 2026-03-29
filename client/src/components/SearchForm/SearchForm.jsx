import styles from "./SearchForm.module.css";

function SearchFrom({ search, handleSearchChange }) {
  return (
    <form>
      <div>
        <input
          type="text"
          name="search"
          id="search"
          className={styles.input}
          placeholder="Type here to search..."
          autoComplete="off"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
    </form>
  );
}

export default SearchFrom;
