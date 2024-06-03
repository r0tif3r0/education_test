import { Link} from 'react-router-dom';
import style from './TestPage.module.scss';
import Button from '../../components/Button/Button';
import { useState, useEffect } from 'react';
import { questions } from '../../assets/questions';

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(
    questions.map(() => ({
      singleChoice: '',
      multipleChoice: [] as string[],
      shortAnswer: '',
      longAnswer: '',
    }))
  );
  const [[h, m, s], setTimer] = useState([0,2,0]);
  const [answeredQuestions, setAnsweredQuestions] = useState([] as number[]);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [testResults, setTestResults] = useState(
    questions.map((questions) => ({
      question: questions.question,
      answer: '',
    }))
  );

  const tick = () => {
    if (h === 0 && m === 0 && s === 0 || isTestFinished) {
      setIsTestFinished(true);
    } else if (m === 0 && s === 0) {
      setTimer([h - 1, 59, 59]);
    } else if (s === 0) {
      setTimer([h, m - 1, 59]);
    } else {
      setTimer([h, m, s - 1]);
    }
  };

  useEffect(() => {
    const timerID = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timerID);
  });

  useEffect(() => {
    const refreshTimer = setInterval(() => {
      saveTestState();
    }, 1);
    return () => clearInterval(refreshTimer);
  });

  useEffect(() => {
      loadTestState();
  }, [])

  const handleAnswerChange = (type : string, value: string[]) => {
    const newAnswers = [...answers];
    const newTestResult = [...testResults];
    switch (type) {
      case 'singleChoice':
        newAnswers[currentQuestion].singleChoice = value[0];
        newTestResult[currentQuestion].answer = value[0];
        break;
      case 'multipleChoice':
        newAnswers[currentQuestion].multipleChoice = value;
        newTestResult[currentQuestion].answer = value.toString();
        break;
      case 'shortAnswer':
        newAnswers[currentQuestion].shortAnswer = value[0];
        newTestResult[currentQuestion].answer = value[0];
        break;
      case 'longAnswer':
        newAnswers[currentQuestion].longAnswer = value[0];
        newTestResult[currentQuestion].answer = value[0];
        break;
    }
    setAnswers(newAnswers);
    setTestResults(newTestResult);
  };

  const handleNextQuestion = () => {
    saveTestState();
    setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handleSubmit = () => {
    setIsTestFinished(true);
  };
  
  const isNextButtonDisabled = () => {
    const currentQuestionAnswer = answers[currentQuestion];
    return (
      (questions[currentQuestion].type === 'singleChoice' && currentQuestionAnswer.singleChoice === '') ||
      (questions[currentQuestion].type === 'multipleChoice' && currentQuestionAnswer.multipleChoice.length === 0) ||
      (questions[currentQuestion].type === 'shortAnswer' && currentQuestionAnswer.shortAnswer.trim() === '') ||
      (questions[currentQuestion].type === 'longAnswer' && currentQuestionAnswer.longAnswer.trim() === '')
    );
  };

  const saveTestState = () => {
    localStorage.setItem('testState', JSON.stringify({
      currentQuestion,
      currentQuestionIndex,
      answers,
      h, m, s,
      answeredQuestions,
      isTestFinished,
      testResults,
    }));
  };

  const loadTestState = () => {
    const testState = JSON.parse(localStorage.getItem('testState')!);
    if (testState) {
      setCurrentQuestion(testState.currentQuestion);
      setCurrentQuestionIndex(testState.currentQuestionIndex);
      setAnswers(testState.answers);
      setTimer([testState.h,testState.m,testState.s]);
      setAnsweredQuestions(testState.answeredQuestions);
      setIsTestFinished(testState.isTestFinished);
      setTestResults(testState.testResults);
    }
  };

  const removeTestState = () => {
    localStorage.removeItem('testState')
  }

  return (
    <div className={style.container}>
      {isTestFinished ? (<>
        <h1>Тест завершен!</h1>
        <p>Результаты:</p>
        {testResults.map(({ question, answer }, index) => (
          <div key={index}>
            <p>{question} - {answer}</p>
          </div>
        ))}
        <Link to={'/'}>
          <Button className={style.button} text='На главную' onClick={removeTestState} isDisabled={false}/>
        </Link>
      </>) : (<><h1>ТECT</h1>
      <p>Осталось времени: {`${h.toString().padStart(2, '0')}:${m
        .toString()
        .padStart(2, '0')}:${s.toString().padStart(2, '0')}`}</p>
      <div className={style.question_list}>
        {questions.map((_question, index) => (
          <div className={style.question_item}
            key={index}
            style={{
              backgroundColor: index === currentQuestionIndex
                ? 'yellow'
                : answeredQuestions.includes(index)
                  ? 'lightgreen'
                  : 'lightgray',
            }}
          >
          </div>
        ))}
      </div>
      <h3>{questions[currentQuestion].question}</h3>
      {questions[currentQuestion].type === 'singleChoice' && (
        <div className={style.question_content}>
          {questions[currentQuestion].answers.map((answer, index) => (
            <div className={style.answer_option} key={index}>
              <input
                type="radio"
                checked={answers[currentQuestion].singleChoice === answer}
                onChange={() => handleAnswerChange('singleChoice', [answer])}
              />
              <label>{answer}</label>
            </div>
          ))}
        </div>
      )}
      {questions[currentQuestion].type === 'multipleChoice' && (
        <div className={style.question_content}>
          {questions[currentQuestion].answers.map((answer, index) => (
            <div className={style.answer_option} key={index}>
              <input
                type="checkbox"
                checked={answers[currentQuestion].multipleChoice.includes(answer)}
                onChange={() => {
                  console.log(answers)
                  const newMultipleChoice = answers[currentQuestion].multipleChoice.includes(answer)
                    ? answers[currentQuestion].multipleChoice.filter(a => a !== answer)
                    : [...answers[currentQuestion].multipleChoice, answer];
                  handleAnswerChange('multipleChoice', newMultipleChoice);
                }}
              />
              <label>{answer}</label>
            </div>
          ))}
        </div>
      )}
      {questions[currentQuestion].type === 'shortAnswer' && (
      <div className={style.question_content}>
        <input className={style.answer_input__short}
          type="text"
          value={answers[currentQuestion].shortAnswer}
          onChange={(e) => handleAnswerChange('shortAnswer', [e.target.value])}
        />
      </div>
      )}
      {questions[currentQuestion].type === 'longAnswer' && (
        <div className={style.question_content}>
          <textarea className={style.answer_input__long}
            value={answers[currentQuestion].longAnswer}
            onChange={(e) => handleAnswerChange('longAnswer', [e.target.value])}
          />
        </div>
      )}
      <div>
        {currentQuestionIndex === questions.length - 1 ? (
          <Button className={style.button} text='Завершить' onClick={handleSubmit} isDisabled={isNextButtonDisabled()}/>
        ) : (
          <Button className={style.button} text='Ответить' onClick={handleNextQuestion} isDisabled={isNextButtonDisabled()}/>
        )}
      </div></>)}
    </div>
  );
};