import React from "react";

export async function getStaticPaths() {
  // fetch all users and return as props
}

export async function getStaticProps() {
  // use getStaticPaths props to fetch single user
}

export default function Profile() {
  // destructure users and map
  return (
    <>
      <h1>Profile</h1>
    </>
  );
}
