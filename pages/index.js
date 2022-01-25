import React, { Fragment } from "react";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>Home page</title>
        <meta name="description" content="Browse a huge list of highly active React Meetups!"/>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

export const getStaticProps = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://phern:RIX6QgS1gu@cluster0.oslue.mongodb.net/meetupApp?retryWrites=true&w=majority"
  );

  const db = client.db();

  // collection == table in NoSql
  const meetupsCollection = db.collection("meetups");

  const places = await meetupsCollection.find().toArray();

  return {
    props: {
      meetups: places.map((place) => ({
        id: place._id.toString(),
        image: place.image,
        title: place.title,
      })),
    },
    revalidate: 1,
  };
};

export default HomePage;
