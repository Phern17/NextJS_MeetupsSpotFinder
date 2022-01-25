import React from "react";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";

const HomePage = (props) => {
  return <MeetupList meetups={props.meetups} />;
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
