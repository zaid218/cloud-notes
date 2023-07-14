
import React from "react";
import Notes from "./Notes";

const Home = (props) => {
  const { showAlert } = props;

  return (
    <div style={{ color: "white" }}>
      <Notes showAlert={showAlert} />
    </div>
  );
};

export default Home;