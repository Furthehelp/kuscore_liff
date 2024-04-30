"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

import phoneman from "../../public/phoneman.png";
import avatar from "../../public/avatar.png";

const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

export default function Profile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function initializeLiff() {
      const liff = (await import("@line/liff")).default;
      try {
        await liff.init({ liffId });
        if (!liff.isLoggedIn()) {
          liff.login();
        }
      } catch (error) {
        console.error("LIFF initialization error:", error.message);
      }
    }
    // initializeLiff();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      const liff = (await import("@line/liff")).default;
      try {
        await liff.ready;
        const profile = await liff.getProfile();
        setProfile(profile);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    }
    fetchProfile();
  }, []);

  const handleFocus = (e) => {
    e.target.parentNode.parentNode.classList.add(styles.focus);
  };

  const handleBlur = (e) => {
    const { value } = e.target;
    const parent = e.target.parentNode.parentNode;
    if (value === "") {
      parent.classList.remove(styles.focus);
    }
  };

  return (
    <section>
      <h1>Profile</h1>
      <div>
        {profile.pictureUrl && (
          <Image
            src={profile.pictureUrl}
            alt={profile.displayName}
            width={500}
            height={500}
          />
        )}
        <div>Name: {profile.displayName}</div>
        <div>Status: {profile.statusMessage}</div>
      </div>

      <div className={styles.container}>
        <div className={styles.img}>
          <Image src={phoneman} alt="phoneman" width={500} height={415} />
        </div>
        <div className={styles.logincontent}>
          <form className={styles.firstform}>
            <div className={styles.avatarcontainer}>
              <Image src={avatar} alt="avatar" width={100} height={100} />
            </div>
            <h2>KU Score</h2>
            <div className={`${styles.inputdiv} ${styles.one}`}>
              <div className={styles.i}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className={styles.div}>
                <h5>Username</h5>
                <input
                  type="text"
                  className={styles.input}
                  // value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </div>
            </div>
            <div className={`${styles.inputdiv} ${styles.pass}`}>
              <div className={styles.i}>
                <FontAwesomeIcon rel="preload" icon={faLock} />
              </div>
              <div className={styles.div}>
                <h5>Password</h5>
                <input
                  type="password"
                  className={styles.input}
                  // value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </div>
            </div>
            <button className={styles.btns} type="submit">
              Login
            </button>
            <div className="d-flex text-end">
              <Link href="/" className={styles.firstlink}>
                ลืมรหัสผ่าน ?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
