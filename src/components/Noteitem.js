
import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const navigate = useNavigate();
  const { deleteNote } = context;
  const { note, updateNote } = props;

  const handleDelete = () => {
    deleteNote(note._id);
    props.showAlert("Deleted successfully", "success");
  };

  const handleUpdate = () => {
    updateNote(note);
    navigate("/");
  };

  const noteItemStyle = {
    backgroundColor: "rgb(208, 235, 204)",
    color: "white",
     // Adjust margin as needed
  };

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body" style={noteItemStyle}>
          <div className="d-flex align-items-center">
            <h5 className="card-title" style={{ color: "black" }}>
              {note.title}
            </h5>
            <i
              className="far fa-trash-alt mx-2"
              style={{ color: "black" }}
              onClick={handleDelete}
            />
            <i
              className="far fa-edit mx-2"
              style={{ color: "black" }}
              onClick={handleUpdate}
            />
          </div>
          <p className="card-text" style={{ color: "black" }}>
            {note.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;