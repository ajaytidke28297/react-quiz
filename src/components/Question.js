import React from "react";
import Options from "./Options";

function Question({ answer, question, dispatch }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options answer={answer} question={question} dispatch={dispatch} />
    </div>
  );
}

export default Question;
