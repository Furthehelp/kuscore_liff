"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { LinkAccount } from "./action";

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
    initializeLiff();
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
    const { value } = document.querySelector("input[name='displayName']");
    const parent = document.querySelector("input[name='displayName']")
      .parentNode.parentNode;
    if (value !== "") {
      parent.classList.add(styles.focus);
    }
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
    <div className={styles.container}>
      <div className={styles.img}>
        <Image src={phoneman} alt="phoneman" width={500} height={415} />
      </div>
      <div className={styles.logincontent}>
        <form className={styles.firstform} action={LinkAccount}>
          <div className={styles.avatarcontainer}>
            {profile.pictureUrl ? (
              <Image
                src={profile.pictureUrl}
                alt={profile.displayName}
                width={100}
                height={100}
                className="rounded-full"
              />
            ) : (
              <Image src={avatar} alt="avatar" width={100} height={100} />
            )}
          </div>
          <h2>KU Score</h2>
          <div className={`${styles.inputdiv} ${styles.one}`}>
            <div className={styles.i}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className={styles.div}>
              <h5>Welcome</h5>
              <input
                name="displayName"
                type="text"
                className={`${styles.input}`}
                defaultValue={
                  profile.displayName ? profile.displayName : "Loading..."
                }
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                disabled
              />
            </div>
          </div>
          <div className={`${styles.inputdiv} ${styles.one}`}>
            <div className={styles.i}>
              <FontAwesomeIcon rel="preload" icon={faIdCard} />
            </div>
            <div className={styles.div}>
              <h5>Student ID</h5>
              <input
                name="studentId"
                pattern="b\d{10}"
                title="Please enter a valid student ID starting with 'b' followed by 10 digits"
                type="text"
                className={styles.input}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>
          <div className={`${styles.inputdiv} ${styles.pass}`}>
            <div className={styles.i}>
              <FontAwesomeIcon rel="preload" icon={faEnvelope} />
            </div>
            <div className={styles.div}>
              <h5>Email</h5>
              <input
                name="email"
                pattern=".+@ku\.th"
                title="Please enter a valid email address with domain @ku.th"
                type="email"
                className={styles.input}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>
          <input type="hidden" name="userId" value={profile.userId} />
          <input type="hidden" name="pictureUrl" value={profile.pictureUrl} />
          <button className={styles.btns} type="submit">
            Link Account
          </button>
          <div className="d-flex text-end">
            <Link href="/" className={styles.firstlink}>
              FAQ ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
