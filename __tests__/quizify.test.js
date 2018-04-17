const quizify = require('../src/quizify.js').default;
const { SimpleQuiz } = require('../data/SimpleQuiz');

let quiz = new quizify(SimpleQuiz);

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

test('validates correct quiz data', () => {
    expect(typeof quiz).toBe('object');
});

test('quiz data is set after init', () => {
    expect(quiz).toHaveProperty('_data');
    expect(typeof quiz._data).toBe(typeof []);
    expect(typeof quiz._position).toBe(typeof 1);
    expect(quiz._position).toBe(-1); // starts on negative index
})

test('retrieves next question', () => {
    let nextQuestion = quiz.getNext();
    console.log(nextQuestion);

    expect(typeof nextQuestion).toBe(typeof {});
    expect(nextQuestion).toHaveProperty('data');
    expect(nextQuestion.data).toHaveProperty('has_multiple_answers');
    expect(nextQuestion.data).toHaveProperty('dom_node');

});
