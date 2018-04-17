export class QuizifyQuestion {
    constructor(questionData) {
        this.type = 'question';
        this.data = questionData;
    }
}

export class QuizifyResult {
    constructor(resultData) {
        this.type = 'result';
        this.data = resultData;
    }
}