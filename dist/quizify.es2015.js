(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.quizify = factory());
}(this, (function () { 'use strict';

class Exceptions {
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

/**
 * Utilities and helpers for quizify
 */
class Utils {
    /**
     * Returns true if an object is empty, otherwise returns false
     * @param {Object|Array} item the item to test for emptiness
     */
    static IsEmpty(item) {
        if ((Object.keys(item).length === 0 && item.constructor === Object) || item.length <= 0)
            return true;
        return false;
    }

    /**
     * Retrieves all the properties of an object
     * @param {object} item the object to retrieve the properties of
     */
    static GetObjectProperties(item) {
        let props = [];
        for (let property in item) {
            if (item.hasOwnProperty(property))
                props.push(property);
        }
        return props;
    }

    /**
     * Checks if all the values provided are in the provider array, returns false a value is not found
     * @param {Array} arrayToCheck the array of value to check
     * @param {Array} arrayOfValues the values to look for in the array
     */
    static CheckAllValuesExistInArray(arrayToCheck, arrayOfValues) {
        for (let i = 0; i < arrayOfValues.length; i++)
            if (arrayToCheck.indexOf(arrayOfValues[i]) === -1)
                return false;

        return true;
    }

    /**
     * Shuffles and returns an array
     * Courtesy : https://github.com/guilhermepontes
     * Gist : https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4
     * @param {Array} arrayToShuffle the array to shuffle
     */
    static ShuffleArray(arrayToShuffle) {
        return arrayToShuffle
            .map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);
    }
}

/**
 * Utilities for DOM element manipulation
 */
class DOM {
    /**
     * Creates a new HTML element
     * @param {string} nodeTag the tag of the element to create
     * @param {string} className name of the class to attach to the element
     */
    static CreateElement(nodeTag, className = '', innerText = null) {
        let el = document.createElement(nodeTag);

        // append class if supplied
        if (className && typeof className === typeof '' && className.length > 0)
            el.classList.add(...className.split(' '));
        // set innerText if supplied
        if (innerText && typeof innerText === typeof '' && innerText.length > 0)
            DOM.SetText(el, innerText);

        return el;
    }

    /**
     * Set the innertText property of a DOM element
     * @param {object} el the element to set the innertext of
     * @param {string} text the text to assign to the inner text
     */
    static SetText(el, text) {
        el.innerText = text;
    }

    /**
     * Appends an element to another element
     * @param {object} el element to append the child to
     * @param {object} child element to append
     */
    static AddChild(el, child) {
        el.appendChild(child);
    }
}

/**
 * quizify options
 */
const Options = {
    /**
     * Should the questions be shuffled
     */
    shuffle: true,
    /**
     * Should the answers be shuffled
     */
    shuffleAnswers: true,
    /**
     * Limit the total questions presented to
     */
    limitQuestionsTo : null,
    /**
     * The class to attach to the question container
     */
    questionContainerClass : 'quizify-question-container',
    /**
     * The class to attach to the ul answer list
     */
    answerListClass : 'quizify-answer-list',
    /**
     * The class to attach to the li answer
     */
    answerListItemClass : 'quizify-answer-list-item',
    /**
     * The class to attach to the next button
     */
    questionNextButtonClass : 'quizify-button-next'
};

/**
 * Required question properties
 */
const QUESTION_REQUIRED_PROPERTIES = ['id', 'content', 'weight', 'answers', 'answer_limit'];
/**
 * Required answer properties
 */
const ANSWER_REQUIRED_PROPERTIES = ['id', 'content', 'is_correct'];

class QuizifyQuestion {
    constructor(questionData) {
        this.type = 'question';
        this.data = questionData;
    }
}

class QuizifyResult {
    constructor(resultData) {
        this.type = 'result';
        this.data = resultData;
    }
}

class Events{
    static AnswerSelected(){
        let ev = new CustomEvent('answerSelected',{
            detail : null,
            bubbles : true,
            cancelable : true
        });
        return ev;
    }
}

/**
 * @author mrdoob / http://mrdoob.com/
 * https://github.com/mrdoob/eventdispatcher.js
 * 
 * Some modifications made by jacojvv-dev
 */

function EventDispatcher() { }

Object.assign(EventDispatcher.prototype, {

    addEventListener: function (type, listener) {
        if (this._listeners === undefined)
            this._listeners = {};

        var listeners = this._listeners;

        if (listeners[type] === undefined)
            listeners[type] = [];

        if (listeners[type].indexOf(listener) === - 1)
            listeners[type].push(listener);
    },

    hasEventListener: function (type, listener) {
        if (this._listeners === undefined)
            return false;

        var listeners = this._listeners;

        return listeners[type] !== undefined && listeners[type].indexOf(listener) !== - 1;
    },

    removeEventListener: function (type, listener) {

        if (this._listeners === undefined) return;

        var listeners = this._listeners;
        var listenerArray = listeners[type];

        if (listenerArray !== undefined) {
            var index = listenerArray.indexOf(listener);
            if (index !== - 1)
                listenerArray.splice(index, 1);
        }

    },

    dispatchEvent: function (event) {
        if (this._listeners === undefined) return;

        var listeners = this._listeners;
        var listenerArray = listeners[event.type];

        if (listenerArray !== undefined) {
            // event.target = this; -- does not pass this line, not neccesary for execution however (jaco)
            var array = listenerArray.slice(0);

            for (var i = 0, l = array.length; i < l; i++)
                array[i].call(this, event);
        }
    }
});

/**
 * quizify
 */
class quizify {
    /**
     * The quizify constructor
     * @param {Array} data quiz data
     * @param {Object} options options for quizify
     */
    constructor(data, options = {}) {
        // do JSON workaround so as to keep the initial Options stateS
        this._options = Object.assign(JSON.parse(JSON.stringify(Options)), options);
        this._position = -1;
        this._validateData(data);
        this._setup(data);
    }

    /**
     * Validates the quiz data, will throw an exception when invalid data is found
     * @param {Array} data the quiz data to validate
     * @private
     */
    _validateData(data) {
        // makes sure the data is set
        if (!data)
            throw new Exceptions.QuizDataRequiredException();
        // makes sure the type of the data is an array
        if (typeof data != typeof [])
            throw new Exceptions.QuizDataInvalidType(typeof data);
        // makes sure the data is not an empty object or array
        if (Utils.IsEmpty(data))
            throw new Exceptions.QuizDataInvalidException();

        // loop over the questions and answers and ensure all the properties are set
        for (let i = 0; i < data.length; i++) {
            let question = data[i];

            let questionProperties = Utils.GetObjectProperties(question);
            if (!Utils.CheckAllValuesExistInArray(questionProperties, QUESTION_REQUIRED_PROPERTIES))
                throw new Exceptions.QuizQuestionDataRequiredException(question);

            for (let j = 0; j < question.answers.length; j++) {
                let answer = question.answers[j];
                let answerProperties = Utils.GetObjectProperties(answer);
                if (!Utils.CheckAllValuesExistInArray(answerProperties, ANSWER_REQUIRED_PROPERTIES))
                    throw new Exceptions.QuizAnswerDataRequiredException(answer);
            }
        }
    }

    /**
     * Runs the setup and assignment of quiz data
     * @param {Array} data the quiz data
     */
    _setup(data) {
        // answers limits
        for (let i = 0; i < data.length; i++) {
            // retrieve all the correct answers
            let correctAnswers = data[i].answers.filter(ans => { return ans.is_correct === true });
            // retrieve all the incorrect answers, shuffled
            let incorrectAnswers = Utils.ShuffleArray(data[i].answers.filter(ans => { return ans.is_correct === false }));


            if (data[i].answer_limit !== null) {
                // skip if answer limit is smaller than total correct answers OR the limit is larger than the length of answers 
                if (data[i].answer_limit <= correctAnswers.length || data[i].answer_limit > data[i].answers.length)
                    continue;

                data[i].answers = correctAnswers.concat(incorrectAnswers.slice(0, data[i].answer_limit - correctAnswers.length));
            }
        }

        // shuffle questions
        if (this._options.shuffle === true)
            data = Utils.ShuffleArray(data);

        // shuffle answers
        if (this._options.shuffleAnswers === true)
            for (let i = 0; i < data.length; i++)
                data[i].answers = Utils.ShuffleArray(data[i].answers);

        // trim question array to assigned limit
        if (this._options.limitQuestionsTo !== null && !isNaN(this._options.limitQuestionsTo))
            data = data.slice(0, this._options.limitQuestionsTo);

        this._data = data;
    }

    /**
     * Creates a new dom node for a question
     * @param {Object} question the question to construct the DOM node for
     */
    _constructQuestionDOMNode(question) {
        // the main question container        
        let container = DOM.CreateElement('div', this._options.questionContainerClass);

        // the question paragraph
        let questionParagraph = DOM.CreateElement('p', null, question.content);
        DOM.AddChild(container, questionParagraph);

        // the list containg answers
        let answersList = DOM.CreateElement('ul', this._options.answerListClass);

        // add all possible answers
        for (let i = 0; i < question.answers.length; i++) {
            let answer = question.answers[i];
            let answerListItem = DOM.CreateElement('li', this._options.answerListItemClass);

            // get the correct input type to use
            let inputType = question.has_multiple_answers === true ? 'checkbox' : 'radio';

            // generate the input
            let input = DOM.CreateElement('input');
            input.type = inputType;
            input.name = 'quizify_answer_option';
            input.value = answer.id;
            DOM.AddChild(answerListItem, input);
            // append the answer text as well
            let answerText = DOM.CreateElement('span', null, ' ' + answer.content);
            DOM.AddChild(answerListItem, answerText);

            DOM.AddChild(answersList, answerListItem);
        }

        // append the list of options to the container
        DOM.AddChild(container, answersList);

        // create the accept button
        let acceptButton = DOM.CreateElement('button', this._options.questionNextButtonClass, 'Next Question');
        acceptButton.addEventListener('click', () => {
            // call with context attached
            this._processDOMResult.call(this);
        });

        DOM.AddChild(container, acceptButton);

        return container;
    }

    /**
     * Retrieves chosen answers from the dom
     * @private
     */
    _processDOMResult() {
        // retrieve the checked input qyuizify elements
        let res = document.querySelectorAll('input[name=quizify_answer_option]:checked').length > 0 ?
            document.querySelectorAll('input[name=quizify_answer_option]:checked') :
            document.querySelectorAll('input[name=quizify_answer_option]'); // for jest testing...

        // get the selection of the user
        let chosenOptions = [];
        for (let i = 0; i < res.length; i++)
            if (res[i].checked === true)
                chosenOptions.push(res[i].value);

        if (chosenOptions.length <= 0)
            throw new Exceptions.QuizNoAnswerSelectedException();

        // pass it to the processing function
        this.processUserAnswer(chosenOptions);
    }

    /**
     * Builds the results DOM node      
     * @param {object} resultData the calculated result data
     * @private
     */
    _constructResultsDOMNode(resultData) {
        let container = DOM.CreateElement('div', this._options.questionContainerClass);

        let heading = DOM.CreateElement('h2', null, 'Quiz Results');
        DOM.AddChild(container, heading);

        let { totalAchievedScore, totalPossibleScore, percentageAchieved } = resultData;
        let resultText = DOM.CreateElement('p', null, `You got ${totalAchievedScore} out of ${totalPossibleScore} (${percentageAchieved}%)`);

        DOM.AddChild(container, resultText);

        resultData.dom_node = container;

        return resultData;
    }

    /**
     * Grades the question answers of the user
     */
    _gradeQuestions() {
        let totalPossible = 0; // total possible score of quiz
        let totalScored = 0; // total points scored
        let totalPenalised = 0; // total penalisation points (incorrect selections on multiples)
        let totalFinal = 0; // the final score

        for (let i = 0; i < this._data.length; i++) {
            let question = this._data[i];
            totalPossible += question.weight;

            let scored = 0;
            let penal = 0;

            // get total correct
            for (let j = 0; j < question.answers.length; j++) {
                let answer = question.answers[j];

                if (answer.is_correct && question._selectedAnswers.indexOf(answer.id.toString()) !== -1)
                    scored += question.weight / question.answers.filter(ans => ans.is_correct === true).length;
                // penalise on multiple choice for incorrect selection
                else if (question.has_multiple_answers && !answer.is_correct && question._selectedAnswers.indexOf(answer.id.toString()) !== -1) {
                    // we need to make sure that th
                    penal += question.weight / question.answers.filter(ans => ans.is_correct === true).length;
                }
            }

            // make sure we dont remove points from the total if the penalisation points are larger than the scored points
            if (scored >= penal) {
                totalScored += scored;
                totalPenalised += penal;
            }
        }

        totalFinal = totalScored - totalPenalised;

        let resData = {
            totalPossibleScore: totalPossible,
            totalAchievedScore: totalScored,
            totalPenalisedScore: totalPenalised,
            totalFinalScore: totalFinal,
            percentageAchieved: Math.round(totalFinal / totalPossible * 100),
            dom_node: null
        };

        return this._constructResultsDOMNode(resData);
    }

    /**
     * Processes the answers of the user
     * @param {Array} chosenAnswers all the selected answer ids
     */
    processUserAnswer(chosenAnswers) {
        if (chosenAnswers.length <= 0)
            throw new Exceptions.QuizNoAnswerSelectedException();

        // retrieve the current question, and append the answers to the item
        let question = this._data[this._position];
        question._selectedAnswers = chosenAnswers;

        this.dispatchEvent(Events.AnswerSelected());
    }

    /**
     * Retrieve the next step in the quiz, either a question or a result
     */
    getNext() {
        if (this._position > -1 && !this._data[this._position]._selectedAnswers)
            throw new Exceptions.QuizNoAnswerSelectedException();

        this._position++;

        let nextQuestion = this._data[this._position];
        if (nextQuestion) {
            // check if there are multple correct answers or not
            let possibleAnswerCount = nextQuestion.answers.filter(answer => answer.is_correct === true).length;
            nextQuestion.has_multiple_answers = possibleAnswerCount === 1 ? false : true;

            // construct the dom node
            nextQuestion.dom_node = this._constructQuestionDOMNode(nextQuestion);

            // return the question data
            return new QuizifyQuestion(nextQuestion);
        }
        else {
            let results = this._gradeQuestions();
            return new QuizifyResult(results);
        }
    }
}

// add event dispatching to quizify
Object.assign(quizify.prototype, EventDispatcher.prototype);

return quizify;

})));
