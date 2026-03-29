import { useContext, useRef, useState } from "react";
import { LuUpload } from "react-icons/lu";
import { ImCross } from "react-icons/im";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import useSendUpdate from "../../hooks/useSendUpdate";
import { GlobalContext } from "../../contexts";
import ProfilePic from "../../components/ProfilePic";
import styles from "./EditProfile.module.css";

function ProfileForm() {
  const { user, refetchUser } = useContext(GlobalContext);
  const formRef = useRef();

  const [picture, setPicture] = useState({
    file: null,
    previewURL: user.profile.pictureURL,
  });
  const [about, setAbout] = useState(user.profile.about);
  const [username, setUsername] = useState(user.username);

  const [success, setSuccess] = useState(false);

  const {
    sendUpdate,
    isLoading: updateIsLoading,
    errors: updateErrors,
  } = useSendUpdate(() => {
    formRef.current.reset();
    setSuccess(true);
    setPicture((prev) => ({ ...prev, file: null }));
    refetchUser();
  });

  const changesMade =
    picture.file || about !== user.profile.about || username !== user.username;

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);
    sendUpdate(
      "/user/me/profile",
      { picture: picture.file, about, username },
      { multipart: true },
    );
  };

  return (
    <>
      {success && <p>Profile updated!</p>}
      {updateIsLoading && <p>Saving...</p>}
      {updateErrors && (
        <ul>
          {updateErrors.map((error, i) => (
            <li key={i}>{error.msg}</li>
          ))}
        </ul>
      )}
      <form
        onSubmit={handleProfileSubmit}
        ref={formRef}
        className={styles.form}
      >
        <div>
          <div className={styles.profilePicContainer}>
            <ProfilePic src={picture.previewURL} size={100} />
            {picture.file ? (
              <button
                className={styles.removeBtn}
                onClick={(e) => {
                  e.preventDefault();
                  formRef.current.reset();
                  setPicture({
                    file: null,
                    previewURL: user.profile.pictureURL,
                  });
                }}
                disabled={!picture.file || updateIsLoading}
              >
                <ImCross />
              </button>
            ) : (
              <label htmlFor="picture" className={styles.uploadBtn}>
                <LuUpload />
              </label>
            )}
          </div>
          <input
            accept="image/*"
            type="file"
            name="picture"
            id="picture"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              setPicture({
                file,
                previewURL: URL.createObjectURL(file),
              });
            }}
            disabled={updateIsLoading}
          />
        </div>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="about">About Me: </label>
          <textarea
            name="about"
            id="about"
            autoComplete="off"
            value={about || ""}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <button type="submit" disabled={!changesMade}>
          Save Changes
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setUsername(user.username);
            setAbout(user.profile.about);
            setPicture({
              file: null,
              previewURL: user.profile.pictureURL,
            });
            formRef.current.reset();
          }}
          disabled={!changesMade}
        >
          Reset
        </button>
      </form>
    </>
  );
}

function PasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [success, setSuccess] = useState(false);

  const {
    sendUpdate,
    isLoading: updateIsLoading,
    errors: updateErrors,
  } = useSendUpdate(() => {
    setSuccess(true);
  });

  const changesMade =
    oldPassword !== "" || newPassword !== "" || newPasswordConfirm !== "";

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    sendUpdate("/user/me/password", {
      oldPassword,
      newPassword,
      newPasswordConfirm,
    });
    setSuccess(false);
  };

  return (
    <>
      {success && <p>Password changed!</p>}
      {updateIsLoading && <p>Saving changes...</p>}
      {updateErrors && (
        <ul>
          {updateErrors.map((error, i) => (
            <li key={i}>{error.msg}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handlePasswordSubmit} className={styles.form}>
        <div>
          <label htmlFor="oldPassword">Current Password: </label>
          <input
            type="password"
            name="oldPassword"
            id="oldPassword"
            autoComplete="off"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password: </label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            autoComplete="off"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="newPasswordConfirm">Confirm New Password: </label>
          <input
            type="password"
            name="newPasswordConfirm"
            id="newPasswordConfirm"
            autoComplete="off"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
          />
        </div>
        <button type="submit" disabled={!changesMade || updateIsLoading}>
          Submit
        </button>
      </form>
    </>
  );
}

function EditProfile() {
  const { user } = useContext(GlobalContext);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.mainContainer}>
      {user && (
        <>
          <button
            className={styles.formToggleBtn}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <>
                <FaArrowLeft /> Edit Profile
              </>
            ) : (
              <>
                Change Password <FaArrowRight />
              </>
            )}
          </button>
          {showPassword ? <PasswordForm /> : <ProfileForm />}{" "}
        </>
      )}
    </div>
  );
}

export default EditProfile;
