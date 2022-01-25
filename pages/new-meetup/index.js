import { useRouter } from "next/router";
import React, { Fragment } from "react";
import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import Head from 'next/head'

const NewMeetupPage = () => {
  const router = useRouter();

  const addMeetupHandler = async (newMeetupData) => {
    const res = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(newMeetupData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    router.push("/");
  };

  return (
    <Fragment>
      <Head>
        <title>New Meetups</title>
        <meta name="description" content="Create a new react meetup." />  
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  );
};

export default NewMeetupPage;
