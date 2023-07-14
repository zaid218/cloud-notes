
import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";
const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const navigate = useNavigate(); // useNavigate hook for navigation
  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    props.showAlert("added successfully", "success");
    navigate("/"); // Navigate to the home page after adding a note
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container my-3">
        <h2 style={{ fontSize: "calc(1.375rem + 1.5vw)", marginTop: "-70px" }}>
          Add a Note
        </h2>
        <form className="my-3">
          <div className="mb-3">
            <label
              htmlFor="title"
              style={{ color: "white" }}
              className="form-label"
            >
              Title
            </label>
            <input
              value={note.title}
              type="text"
              className="form-control"
              id="title"
              name="title"
              aria-describedby="emailHelp"
              onChange={onChange}
              minLength={5}
              required
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="description"
              style={{ color: "white" }}
              className="form-label"
            >
              Description
            </label>
            <input
              value={note.description}
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={onChange}
              minLength={10}
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="tag"
              style={{ color: "white" }}
              className="form-label"
            >
              Tag
            </label>
            <input
              value={note.tag}
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              onChange={onChange}
              minLength={1}
              required
            />
          </div>
          <button
            type="submit"
            disabled={
              note.title.length < 5 ||
              note.description.length < 10 ||
              note.tag.length < 1
            }
            className="btn btn-primary"
            onClick={handleClick}
          >
            AddNote
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;