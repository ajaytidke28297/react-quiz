import React, { useEffect, useReducer } from "react";
import Error from "./Error";
import FinishScreen from "./FinishScreen";
import Header from "./Header";
import Loader from "./Loader";
import Main from "./Main";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Question from "./Question";
import StartScreen from "./StartScreen";

const initialState = {
  questions: [],
  status: "loading", // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "active",
      };

    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index++,
        answer: null,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    default:
      throw new Error("Unkown action");
  }
}

function App() {
  const [{ answer, index, questions, status, points, highscore }, dispatch] =
    useReducer(reducer, initialState);

  const numQuestions = questions?.length;
  const maxPossiblePoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  useEffect(function () {
    fetch(`http://localhost:8000/questions`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((e) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              index={index}
              numQuestions={numQuestions}
              answer={answer}
            />
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
