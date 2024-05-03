"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "@/../styles/login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import phoneman from "@/../public/phoneman.png";
import avatar from "@/../public/avatar.png";

import { linkAccount } from "@/../actions/linkAccount";

const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

export default function Login() {
  const [profile, setProfile] = useState({});
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");

  // Fetches LINE profile and updates state
  useEffect(() => {
    async function initializeLiff() {
      const liff = await import("@line/liff");
      try {
        await liff.init({ liffId });
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profileData = await liff.getProfile();
          setProfile(profileData);
        }
      } catch (error) {
        console.error("LIFF initialization error:", error.message);
      }
    }
    initializeLiff();

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

  // Link account function with error handling and validation
  const handleLinkAccount = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Basic validation for student ID and email
    if (!studentId || !studentId.match(/b\d{10}/)) {
      Swal.fire({
        title: "Invalid Student ID",
        text: "Please enter a valid student ID starting with 'b' followed by 10 digits",
        icon: "error",
      });
      return;
    }

    if (!email || !email.match(/.+@ku\.th/)) {
      Swal.fire({
        title: "Invalid Email",
        text: "Please enter a valid email address with domain @ku.th",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "Link Account",
      html: `
      <p><span style="color: black;">Student ID: ${studentId}</span></p>
      <p><span style="color: black;">Email: ${email}</span></p>
      <p><strong>Please be advised:</strong> Linking can only be performed <span style="color: red;">once</span>.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, link it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await linkAccount(studentId, email, profile); // Call Server Action
          if (response.success) {
            // Handle successful link account
            Swal.fire({
              title: "Success",
              text: "Account linked successfully! Please check your email for confirmation.",
              icon: "success",
            });
            // Clear student ID and email after successful link
            setStudentId("");
            setEmail("");
          } else {
            // Handle errors from Server Action
            Swal.fire({
              title: "Error",
              text:
                response.message ||
                "Failed to link account. Please try again later.",
              icon: "error",
            });
          }
        } catch (error) {
          console.error(error.message);
          Swal.fire({
            title: "Error",
            text:
              error.message ||
              "An unexpected error occurred. Please try again later.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.img}>
        <Image src={phoneman} alt="phoneman" width={500} height={415} />
      </div>
      <div className={styles.logincontent}>
        <form className={styles.firstform} onSubmit={handleLinkAccount}>
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
                type="text"
                maxLength={11}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>
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
