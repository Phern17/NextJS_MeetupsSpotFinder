import MeetupDetails from "../../components/meetups/MeetupDetails";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from 'next/head'

const MeetupDetailsPage = ({ meetupData }) => {
  return (
    <Fragment>
      <Head>
        <title>{meetupData.title}</title>
        <meta name="description" content={meetupData.description} />
      </Head>
    <MeetupDetails
      image={meetupData.image}
      title={meetupData.title}
      address={meetupData.address}
      description={meetupData.description}
    />
    </Fragment>
  );
};

const connectDB = async (externalFunc) => {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oslue.mongodb.net/meetupApp?retryWrites=true&w=majority`
  );

  const db = client.db();

  // collection == table in NoSql
  const meetupsCollection = db.collection("meetups");

  const data = await externalFunc(meetupsCollection);

  client.close();

  return data;
};

export const getStaticPaths = async () => {
  const places = await connectDB(async (meetupsCollection) => {
    return await meetupsCollection.find({}, { _id: 1 }).toArray();
  });

  return {
    fallback: false,
    paths: places.map((place) => ({
      params: { meetupId: place._id.toString() },
    })),
  };
};

export const getStaticProps = async (context) => {
  // fetch data for a single meeting
  const meetupId = context.params.meetupId;

  const place = await connectDB(async (meetupsCollection) => {
    return await meetupsCollection.findOne({ _id: ObjectId(meetupId) });
  });

  return {
    props: {
      meetupData: {
        image: place.image,
        id: place._id.toString(),
        title: place.title,
        address: place.address,
        description: place.description,
      },
    },
  };
};

export default MeetupDetailsPage;
