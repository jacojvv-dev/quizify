/**
 * Simple quiz data for use in tests or other examples
 */
export const SimpleQuiz = [
    {
        id: 1,
        content: 'True or false? Dogs are herbivores.',
        weight: 5,        
        answers: [
            {
                id: 1,
                content: 'False, they are omnivores.',
                is_correct: true
            },
            {
                id: 2,
                content: 'True, they are herbivores.',
                is_correct: false
            }
        ]
    },
    {
        id: 2,
        content: 'What is the chemical symbol for the element oxygen?',
        weight: 5,
        answers: [
            {
                id: 3,
                content: 'Ox',
                is_correct: false
            },
            {
                id: 4,
                content: 'O',
                is_correct: true
            },
            {
                id: 5,
                content: 'Oxy',
                is_correct: false
            },
            {
                id: 6,
                content: 'N',
                is_correct: false
            }
        ]
    },
    {
        id: 3,
        content: 'Pure water has a pH level of a around?',
        weight: 5,
        answers: [
            {
                id: 7,
                content: '8',
                is_correct: false
            },
            {
                id: 8,
                content: '2',
                is_correct: false
            },
            {
                id: 9,
                content: '7',
                is_correct: true
            },
            {
                id: 10,
                content: '12',
                is_correct: false
            }
        ]
    }
];