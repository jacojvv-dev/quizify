import { domainToASCII } from 'url';

const quizify = require('../src/quizify.js').default;
const {
    SimpleQuiz,
    QuizWithInvalidQuestion,
    QuizWithInvalidAnswer,
    AnswerLimitTestingQuiz } = require('../data/Data');

test('is a function by default', () => {
    expect(quizify).toBeDefined();
    expect(typeof quizify).toBe('function');
});

test('throws QuizDataRequiredException without data', () => {
    expect(() => { new quizify() }).toThrow('QuizDataRequiredException');
});

test('throws QuizDataInvalidType if the data is not a valid type', () => {
    expect(() => { new quizify('hello') }).toThrow('QuizDataInvalidType');
    expect(() => { new quizify(1) }).toThrow('QuizDataInvalidType');
});

test('throws QuizDataInvalidException if the data is not valid', () => {
    expect(() => { new quizify({}) }).toThrow('QuizDataInvalidException');
    expect(() => { new quizify([]) }).toThrow('QuizDataInvalidException');
});

test('throws QuizQuestionDataRequiredException if a question is missing a required property', () => {
    expect(() => { new quizify(QuizWithInvalidQuestion) }).toThrow('QuizQuestionDataRequiredException');
});

test('throws QuizQuestionDataRequiredException if an answer is missing a required property', () => {
    expect(() => { new quizify(QuizWithInvalidAnswer) }).toThrow('QuizAnswerDataRequiredException');
});

test('passed setup with questions that have strange answer limits', () => {
    let strangeAnswerQuiz = new quizify(AnswerLimitTestingQuiz);
    expect(typeof strangeAnswerQuiz).toBe('object');
    expect(strangeAnswerQuiz).toHaveProperty('_options');
    expect(strangeAnswerQuiz).toHaveProperty('_position');
    expect(strangeAnswerQuiz).toHaveProperty('_data');
});

test('quiz question limit limits the question amount', () => {
    let quizWithLimit = new quizify(SimpleQuiz, { limitQuestionsTo: 2 });
    expect(typeof quizWithLimit).toBe('object');
    expect(quizWithLimit).toHaveProperty('_data');
    expect(quizWithLimit._data.length).toBe(2);
});

test('quiz data is setup and valid', () => {
    let quiz = new quizify(SimpleQuiz);
    expect(typeof quiz).toBe('object');
    expect(quiz).toHaveProperty('_options');
    expect(quiz).toHaveProperty('_position');
    expect(quiz).toHaveProperty('_data');

    expect(typeof quiz._options).toBe(typeof []);

    expect(typeof quiz._position).toBe(typeof 1);
    expect(quiz._position).toBe(-1); // starts on negative index

    expect(typeof quiz._data).toBe(typeof []);
    expect(quiz._data.length).toBe(SimpleQuiz.length);
});

test('retrieves next question', () => {
    let quiz = new quizify(SimpleQuiz);
    let nextQuestion = quiz.getNext();

    expect(typeof nextQuestion).toBe(typeof {});

    expect(nextQuestion.type).toBe('question');
    expect(nextQuestion).toHaveProperty('data');
    expect(nextQuestion.data).toHaveProperty('has_multiple_answers');
    expect(nextQuestion.data).toHaveProperty('dom_node');
});

test('fails to retrieve next question without an answer', () => {
    let quiz = new quizify(SimpleQuiz);
    let nextQuestion = quiz.getNext();
    expect(() => { quiz.getNext() }).toThrowError('QuizNoAnswerSelectedException');
});

test('throws QuizNoAnswerSelectedException when no answer is selected on DOM processing', () => {
    let quiz = new quizify(SimpleQuiz);
    let nextQuestion = quiz.getNext();
    expect(() => { quiz._processDOMResult() }).toThrowError('QuizNoAnswerSelectedException');
});

test('throws QuizNoAnswerSelectedException when no answer is passed to process', () => {
    let quiz = new quizify(SimpleQuiz);
    let nextQuestion = quiz.getNext();
    expect(() => { quiz.processUserAnswer([]) }).toThrowError('QuizNoAnswerSelectedException');
});

test('grades questions based on dom results', () => {
    let quiz = new quizify(SimpleQuiz);
    let currentQuestion = quiz.getNext();

    createDomElementsForQuestion(currentQuestion);

    quiz._processDOMResult();

    expect(quiz._data[quiz._position]).toHaveProperty('_selectedAnswers');
});

test('runs until result is recieved', () => {
    let quiz = new quizify(SimpleQuiz);
    let currentQuestion;

    do {
        currentQuestion = quiz.getNext();
        if (currentQuestion.type === 'question') {
            createDomElementsForQuestion(currentQuestion);
            quiz._processDOMResult();
        }
    } while (currentQuestion.type === 'question');

    expect(currentQuestion).toHaveProperty('type');
    expect(currentQuestion.type).toBe('result');

    expect(currentQuestion).toHaveProperty('data');
    expect(currentQuestion.data).toHaveProperty('totalPossibleScore');
    expect(currentQuestion.data).toHaveProperty('totalAchievedScore');
    expect(currentQuestion.data).toHaveProperty('totalPenalisedScore');
    expect(currentQuestion.data).toHaveProperty('totalFinalScore');
    expect(currentQuestion.data.totalPossibleScore).toBeGreaterThanOrEqual(currentQuestion.data.totalAchievedScore);
    expect(currentQuestion.data.totalPossibleScore).toBeGreaterThanOrEqual(currentQuestion.data.totalPenalisedScore);
    expect(currentQuestion.data.totalPossibleScore).toBeGreaterThanOrEqual(currentQuestion.data.totalFinalScore);

    expect(currentQuestion.data).toHaveProperty('dom_node');
});


/**
 * Creates and appends question 'answers' to the dom
 * @param {object} question the question to append to the dom
 */
function createDomElementsForQuestion(question) {
    document.body.innerHTML = '';

    for (let i = 0; i < question.data.answers.length; i++) {
        let ans = question.data.answers[i];
        let domNode = document.createElement('input');
        domNode.name = 'quizify_answer_option';
        domNode.checked = ans.is_correct;
        domNode.value = ans.id;
        document.body.appendChild(domNode);
    }
}

test('has event listener methods', () => {
    let quiz = new quizify(SimpleQuiz);
    quiz.hasEventListener('answerSelected', () => { });
    quiz.addEventListener('answerSelected', () => { });
    quiz.addEventListener('anotherFakeEventName', (() => { }));
    quiz.addEventListener('whyNotAnotherOne', () => { });
    quiz.removeEventListener('anotherFakeEventName', () => { });
    quiz.dispatchEvent('answerSelected');

    expect(quiz._listeners).toHaveProperty('answerSelected');    
})


