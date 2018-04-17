export default class Exceptions {
    static QuizDataRequiredException() {
        return new Error('QuizDataRequiredException: The quiz data is required.');
    }
    static QuizDataInvalidType(currentType) {
        return new Error(`QuizDataInvalidType: The quiz data type ${currentType} is invalid. The type should be of array.`);
    }
    static QuizDataInvalidException() {
        return new Error('QuizDataInvalidException: The quiz data is invalid.');
    }
    static QuizQuestionDataRequiredException(question) {
        let questionAsJSON = JSON.stringify(question);
        return new Error(`QuizQuestionDataRequiredException: Quiz question is missing required data.\nProvided: ${questionAsJSON}`);
    }
    static QuizAnswerDataRequiredException(answer) {
        let answerAsJSON = JSON.stringify(answer);
        return new Error(`QuizAnswerDataRequiredException: Quiz answer is missing required data.\nProvided: ${answerAsJSON}`);
    }
    static QuizQuestionAnswerRequired() {
        return new Error('QuizQuestionAnswerRequired: The answer to the current question is required.');
    }
    static QuizNoAnswerSelectedException() {
        return new Error('QuizNoAnswerSelectedException: The user has not selected an answer for the question.');
    }
}