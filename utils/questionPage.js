export const handleAnswerChange = (text, questionId, questionIndex, questions, setQuestions, error, setError) => {
    setQuestions(questions.map(question => {
        if (question.questionId === questionId) {
            question.answer = text;
        }
        return question;
    }));
    let customError = [...error];
    if (text.length === 0) {
        customError[questionIndex].answer = 'Required';
    }
    else {
        customError[questionIndex].answer = '';
    }
    setError(customError);
};

export const optionValidation = (options, customError, index) => {
    for (let i = 0; i < options.length; i++) {
        if (options[i].option === '') {
            customError[index].options[i] = 'Required';
        }
    }
};

export const addQuestionValidation = (questions, customError, error) => {
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].question === '') {
            customError[i].question = 'Required';
        }
        if (questions[i].answer === '') {
            customError[i].answer = 'Required';
        }
        if (questions[i].options.some(opt => opt.option === '')) {
            optionValidation(questions[i].options, customError, i);
        }
    }
};

export const handleQuestionChange = (text, questionId, questionIndex, questions, setQuestions, error, setError) => {
    setQuestions(questions.map(question => {
        if (question.questionId === questionId) {
            question.question = text;
        }
        return question;
    }));
    let customError = [...error];
    if (text.length === 0) {
        customError[questionIndex].question = "Required";
    }
    else {
        customError[questionIndex].question = null;
    }
    setError(customError);
};
export const validateAddOption = (questions, index, error, setError) => {
    let check = questions[index].options.some(opt => opt.option === '')

    if (check) {
        let customError = [...error]
        optionValidation(questions[index].options, customError, index)
        setError(customError);
    }

    return !check;
};

export const addOptionInQuestion = (questions, setQuestions, questionId, option) => {
    setQuestions(questions.map(question => {
        if (question.questionId === questionId) {
            question.options.push(option);
        }
        return question;
    }));
}