export default class Events{
    static AnswerSelected(){
        let ev = new CustomEvent('answerSelected',{
            detail : null,
            bubbles : true,
            cancelable : true
        });
        return ev;
    }
}