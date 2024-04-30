"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

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
  }, []);

  return (
    <section>
      <Head>
        <title>My Profile</title>
      </Head>
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
    </section>
  );
}
