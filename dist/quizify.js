var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.quizify = factory();
})(this, function () {
    'use strict';

    var Exceptions = function () {
        function Exceptions() {
            _classCallCheck(this, Exceptions);
        }

        _createClass(Exceptions, null, [{
            key: 'QuizDataRequiredException',
            value: function QuizDataRequiredException() {
                return new Error('QuizDataRequiredException: The quiz data is required.');
            }
        }, {
            key: 'QuizDataInvalidType',
            value: function QuizDataInvalidType(currentType) {
                return new Error('QuizDataInvalidType: The quiz data type ' + currentType + ' is invalid. The type should be of array.');
            }
        }, {
            key: 'QuizDataInvalidException',
            value: function QuizDataInvalidException() {
                return new Error('QuizDataInvalidException: The quiz data is invalid.');
            }
        }, {
            key: 'QuizQuestionDataRequiredException',
            value: function QuizQuestionDataRequiredException(question) {
                var questionAsJSON = JSON.stringify(question);
                return new Error('QuizQuestionDataRequiredException: Quiz question is missing required data.\nProvided: ' + questionAsJSON);
            }
        }, {
            key: 'QuizAnswerDataRequiredException',
            value: function QuizAnswerDataRequiredException(answer) {
                var answerAsJSON = JSON.stringify(answer);
                return new Error('QuizAnswerDataRequiredException: Quiz answer is missing required data.\nProvided: ' + answerAsJSON);
            }
        }, {
            key: 'QuizQuestionAnswerRequired',
            value: function QuizQuestionAnswerRequired() {
                return new Error('QuizQuestionAnswerRequired: The answer to the current question is required.');
            }
        }, {
            key: 'QuizNoAnswerSelectedException',
            value: function QuizNoAnswerSelectedException() {
                return new Error('QuizNoAnswerSelectedException: The user has not selected an answer for the question.');
            }
        }]);

        return Exceptions;
    }();

    /**
     * Utilities and helpers for quizify
     */


    var Utils = function () {
        function Utils() {
            _classCallCheck(this, Utils);
        }

        _createClass(Utils, null, [{
            key: 'IsEmpty',

            /**
             * Returns true if an object is empty, otherwise returns false
             * @param {Object|Array} item the item to test for emptiness
             */
            value: function IsEmpty(item) {
                if (Object.keys(item).length === 0 && item.constructor === Object || item.length <= 0) return true;
                return false;
            }

            /**
             * Retrieves all the properties of an object
             * @param {object} item the object to retrieve the properties of
             */

        }, {
            key: 'GetObjectProperties',
            value: function GetObjectProperties(item) {
                var props = [];
                for (var property in item) {
                    if (item.hasOwnProperty(property)) props.push(property);
                }
                return props;
            }

            /**
             * Checks if all the values provided are in the provider array, returns false a value is not found
             * @param {Array} arrayToCheck the array of value to check
             * @param {Array} arrayOfValues the values to look for in the array
             */

        }, {
            key: 'CheckAllValuesExistInArray',
            value: function CheckAllValuesExistInArray(arrayToCheck, arrayOfValues) {
                for (var i = 0; i < arrayOfValues.length; i++) {
                    if (arrayToCheck.indexOf(arrayOfValues[i]) === -1) return false;
                }return true;
            }

            /**
             * Shuffles and returns an array
             * Courtesy : https://github.com/guilhermepontes
             * Gist : https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4
             * @param {Array} arrayToShuffle the array to shuffle
             */

        }, {
            key: 'ShuffleArray',
            value: function ShuffleArray(arrayToShuffle) {
                return arrayToShuffle.map(function (a) {
                    return [Math.random(), a];
                }).sort(function (a, b) {
                    return a[0] - b[0];
                }).map(function (a) {
                    return a[1];
                });
            }
        }]);

        return Utils;
    }();

    /**
     * Utilities for DOM element manipulation
     */


    var DOM = function () {
        function DOM() {
            _classCallCheck(this, DOM);
        }

        _createClass(DOM, null, [{
            key: 'CreateElement',

            /**
             * Creates a new HTML element
             * @param {string} nodeTag the tag of the element to create
             * @param {string} className name of the class to attach to the element
             */
            value: function CreateElement(nodeTag) {
                var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

                var el = document.createElement(nodeTag);

                // append class if supplied
                if (className && className.length > 0) el.classList.add(className);

                return el;
            }

            /**
             * Set the innertText property of a DOM element
             * @param {object} el the element to set the innertext of
             * @param {string} text the text to assign to the inner text
             */

        }, {
            key: 'SetText',
            value: function SetText(el, text) {
                el.innerText = text;
            }

            /**
             * Appends an element to another element
             * @param {object} el element to append the child to
             * @param {object} child element to append
             */

        }, {
            key: 'AddChild',
            value: function AddChild(el, child) {
                el.appendChild(child);
            }
        }]);

        return DOM;
    }();

    /**
     * quizify options
     */


    var Options = {
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
        limitQuestionsTo: null,
        /**
         * The class to attach to the question container
         */
        questionContainerClass: 'quizify-question-container',
        /**
         * The class to attach to the ul answer list
         */
        answerListClass: 'quizify-answer-list',
        /**
         * The class to attach to the li answer
         */
        answerListItemClass: 'quizify-answer-list-item',
        /**
         * The class to attach to the next button
         */
        questionNextButtonClass: 'quizify-button-next'
    };

    /**
     * Required question properties
     */
    var QUESTION_REQUIRED_PROPERTIES = ['id', 'content', 'weight', 'answers', 'answer_limit'];
    /**
     * Required answer properties
     */
    var ANSWER_REQUIRED_PROPERTIES = ['id', 'content', 'is_correct'];

    var QuizifyQuestion = function QuizifyQuestion(questionData) {
        _classCallCheck(this, QuizifyQuestion);

        this.type = 'question';
        this.data = questionData;
    };

    var QuizifyResult = function QuizifyResult(resultData) {
        _classCallCheck(this, QuizifyResult);

        this.type = 'result';
        this.data = resultData;
    };

    var Events = function () {
        function Events() {
            _classCallCheck(this, Events);
        }

        _createClass(Events, null, [{
            key: 'AnswerSelected',
            value: function AnswerSelected() {
                var ev = new CustomEvent('answerSelected', {
                    detail: null,
                    bubbles: true,
                    cancelable: true
                });
                return ev;
            }
        }]);

        return Events;
    }();

    /**
     * @author mrdoob / http://mrdoob.com/
     * https://github.com/mrdoob/eventdispatcher.js
     * 
     * Some modifications made by jacojvv-dev
     */

    function EventDispatcher() {}

    _extends(EventDispatcher.prototype, {

        addEventListener: function addEventListener(type, listener) {
            if (this._listeners === undefined) this._listeners = {};

            var listeners = this._listeners;

            if (listeners[type] === undefined) listeners[type] = [];

            if (listeners[type].indexOf(listener) === -1) listeners[type].push(listener);
        },

        hasEventListener: function hasEventListener(type, listener) {
            if (this._listeners === undefined) return false;

            var listeners = this._listeners;

            return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
        },

        removeEventListener: function removeEventListener(type, listener) {

            if (this._listeners === undefined) return;

            var listeners = this._listeners;
            var listenerArray = listeners[type];

            if (listenerArray !== undefined) {
                var index = listenerArray.indexOf(listener);
                if (index !== -1) listenerArray.splice(index, 1);
            }
        },

        dispatchEvent: function dispatchEvent(event) {
            if (this._listeners === undefined) return;

            var listeners = this._listeners;
            var listenerArray = listeners[event.type];

            if (listenerArray !== undefined) {
                // event.target = this; -- does not pass this line, not neccesary for execution however (jaco)
                var array = listenerArray.slice(0);

                for (var i = 0, l = array.length; i < l; i++) {
                    array[i].call(this, event);
                }
            }
        }
    });

    /**
     * quizify
     */

    var quizify = function () {
        /**
         * The quizify constructor
         * @param {Array} data quiz data
         * @param {Object} options options for quizify
         */
        function quizify(data) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            _classCallCheck(this, quizify);

            this._options = _extends(Options, options);
            this._position = -1;
            this._validateData(data);
            this._setup(data);
        }

        /**
         * Validates the quiz data, will throw an exception when invalid data is found
         * @param {Array} data the quiz data to validate
         * @private
         */


        _createClass(quizify, [{
            key: '_validateData',
            value: function _validateData(data) {
                // makes sure the data is set
                if (!data) throw new Exceptions.QuizDataRequiredException();
                // makes sure the type of the data is an array
                if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) != _typeof([])) throw new Exceptions.QuizDataInvalidType(typeof data === 'undefined' ? 'undefined' : _typeof(data));
                // makes sure the data is not an empty object or array
                if (Utils.IsEmpty(data)) throw new Exceptions.QuizDataInvalidException();

                // loop over the questions and answers and ensure all the properties are set
                for (var i = 0; i < data.length; i++) {
                    var question = data[i];

                    var questionProperties = Utils.GetObjectProperties(question);
                    if (!Utils.CheckAllValuesExistInArray(questionProperties, QUESTION_REQUIRED_PROPERTIES)) throw new Exceptions.QuizQuestionDataRequiredException(question);

                    for (var j = 0; j < question.answers.length; j++) {
                        var answer = question.answers[j];
                        var answerProperties = Utils.GetObjectProperties(answer);
                        if (!Utils.CheckAllValuesExistInArray(answerProperties, ANSWER_REQUIRED_PROPERTIES)) throw new Exceptions.QuizAnswerDataRequiredException(answer);
                    }
                }
            }

            /**
             * Runs the setup and assignment of quiz data
             * @param {Array} data the quiz data
             */

        }, {
            key: '_setup',
            value: function _setup(data) {
                // answers limits
                for (var i = 0; i < data.length; i++) {
                    // retrieve all the correct answers
                    var correctAnswers = data[i].answers.filter(function (ans) {
                        return ans.is_correct === true;
                    });
                    // retrieve all the incorrect answers, shuffled
                    var incorrectAnswers = Utils.ShuffleArray(data[i].answers.filter(function (ans) {
                        return ans.is_correct === false;
                    }));

                    if (data[i].answer_limit !== null) {
                        if (data[i].answer_limit <= correctAnswers.length && data[i].answer_limit > data[i].answers.length) continue;

                        data[i].answers = correctAnswers.concat(incorrectAnswers.slice(0, data[i].answer_limit - correctAnswers.length));
                    }
                }

                // shuffle questions
                if (this._options.shuffle === true) data = Utils.ShuffleArray(data);

                // shuffle answers
                if (this._options.shuffleAnswers === true) for (var _i = 0; _i < data.length; _i++) {
                    data[_i].answers = Utils.ShuffleArray(data[_i].answers);
                } // trim question array to assigned limit
                if (this._options.limitQuestionsTo !== null && !isNaN(this._options.limitQuestionsTo)) data = data.slice(0, this._options.limitQuestionsTo);

                this._data = data;
            }

            /**
             * Creates a new dom node for a question
             * @param {Object} question the question to construct the DOM node for
             */

        }, {
            key: '_constructQuestionDOMNode',
            value: function _constructQuestionDOMNode(question) {
                var _this = this;

                // the main question container        
                var container = DOM.CreateElement('div', this._options.questionContainerClass);

                // the question paragraph
                var questionParagraph = DOM.CreateElement('p');
                DOM.SetText(questionParagraph, question.content);
                DOM.AddChild(container, questionParagraph);

                // the list containg answers
                var answersList = DOM.CreateElement('ul', this._options.answerListClass);

                // add all possible answers
                for (var i = 0; i < question.answers.length; i++) {
                    var answer = question.answers[i];
                    var answerListItem = DOM.CreateElement('li', this._options.answerListItemClass);

                    // get the correct input type to use
                    var inputType = question.has_multiple_answers === true ? 'checkbox' : 'radio';

                    // generate the input
                    var input = DOM.CreateElement('input');
                    input.type = inputType;
                    input.name = 'quizify_answer_option';
                    input.value = answer.id;
                    DOM.AddChild(answerListItem, input);
                    // append the answer text as well
                    var answerText = DOM.CreateElement('span');
                    DOM.SetText(answerText, ' ' + answer.content);
                    DOM.AddChild(answerListItem, answerText);

                    DOM.AddChild(answersList, answerListItem);
                }

                // append the list of options to the container
                DOM.AddChild(container, answersList);

                // create the accept button
                var acceptButton = DOM.CreateElement.apply(DOM, ['button'].concat(_toConsumableArray(this._options.questionNextButtonClass.split(' '))));
                acceptButton.addEventListener('click', function () {
                    // call with context attached
                    _this._processDOMResult.call(_this);
                });
                DOM.SetText(acceptButton, 'Next Question');
                DOM.AddChild(container, acceptButton);

                return container;
            }

            /**
             * Retrieves chosen answers from the dom
             */

        }, {
            key: '_processDOMResult',
            value: function _processDOMResult() {
                // retrieve the checked input qyuizify elements
                var res = document.querySelectorAll('input[name=quizify_answer_option]:checked');
                if (res.length <= 0) throw new Exceptions.QuizNoAnswerSelectedException();

                // get the selection of the user
                var chosenOptions = [];
                for (var i = 0; i < res.length; i++) {
                    chosenOptions.push(res[i].value);
                } // pass it to the processing function
                this.processUserAnswer(chosenOptions);
            }
        }, {
            key: '_constructResultsDOMNode',
            value: function _constructResultsDOMNode(resultData) {
                var container = DOM.CreateElement('div', this._options.questionContainerClass);

                var heading = DOM.CreateElement('h2');
                DOM.SetText(heading, 'Quiz Results');
                DOM.AddChild(container, heading);

                resultData.dom_node = container;

                return resultData;
            }
        }, {
            key: '_gradeQuestions',
            value: function _gradeQuestions() {
                var totalPossible = 0; // total possible score of quiz
                var totalScored = 0; // total points scored
                var totalPenalised = 0; // total penalisation points (incorrect selections on multiples)
                var totalFinal = 0; // the final score

                for (var i = 0; i < this._data.length; i++) {
                    var question = this._data[i];
                    totalPossible += question.weight;

                    var scored = 0;
                    var penal = 0;

                    // get total correct
                    for (var j = 0; j < question.answers.length; j++) {
                        var answer = question.answers[j];

                        if (answer.is_correct && question._selectedAnswers.indexOf(answer.id.toString()) !== -1) scored += question.weight / question.answers.filter(function (ans) {
                            return ans.is_correct === true;
                        }).length;
                        // penalise on multiple choice for incorrect selection
                        else if (question.has_multiple_answers && !answer.is_correct && question._selectedAnswers.indexOf(answer.id.toString()) !== -1) {
                                // we need to make sure that th
                                penal += question.weight / question.answers.filter(function (ans) {
                                    return ans.is_correct === true;
                                }).length;
                            }
                    }

                    // make sure we dont remove points from the total if the penalisation points are larger than the scored points
                    if (scored >= penal) {
                        totalScored += scored;
                        totalPenalised += penal;
                    }
                }

                totalFinal = totalScored - totalPenalised;

                console.log('Total Possible:', totalPossible);
                console.log('Total Score:', totalScored);
                console.log('Total Penalised:', totalPenalised);
                console.log('Total Final:', totalFinal);

                var resData = {
                    totalPossibleScore: totalPossible,
                    totalAchievedScore: totalScored,
                    totalPenalisedScore: totalPenalised,
                    totalFinalScore: totalFinal,
                    dom_node: null
                };

                return this._constructResultsDOMNode(resData);
            }

            /**
             * Processes the answers of the user
             * @param {Array} chosenAnswers all the selected answer ids
             */

        }, {
            key: 'processUserAnswer',
            value: function processUserAnswer(chosenAnswers) {
                if (chosenAnswers.length <= 0) throw new Exceptions.QuizNoAnswerSelectedException();

                // retrieve the current question, and append the answers to the item
                var question = this._data[this._position];
                question._selectedAnswers = chosenAnswers;

                this.dispatchEvent(Events.AnswerSelected());
            }

            /**
             * Retrieve the next step in the quiz, either a question or a result
             */

        }, {
            key: 'getNext',
            value: function getNext() {
                if (this._position > -1 && !this._data[this._position]._selectedAnswers) throw new Exceptions.QuizNoAnswerSelectedException();

                this._position++;

                var nextQuestion = this._data[this._position];
                if (nextQuestion) {
                    // check if there are multple correct answers or not
                    var possibleAnswerCount = nextQuestion.answers.filter(function (answer) {
                        return answer.is_correct === true;
                    }).length;
                    nextQuestion.has_multiple_answers = possibleAnswerCount === 1 ? false : true;

                    // construct the dom node
                    nextQuestion.dom_node = this._constructQuestionDOMNode(nextQuestion);

                    // return the question data
                    return new QuizifyQuestion(nextQuestion);
                } else {
                    // todo : return result type
                    var results = this._gradeQuestions();
                    return new QuizifyResult(results);
                }
            }
        }]);

        return quizify;
    }();

    // add event dispatching to quizify


    _extends(quizify.prototype, EventDispatcher.prototype);

    return quizify;
});