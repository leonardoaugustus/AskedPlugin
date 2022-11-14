var quizJSON = {
    "quiz": [
        {
            "id": 1, // optional 
            "title": "Examples Questions", // optional
            "required": 0, // optional
            "route": "https://test.com", // optional
            "questions": [
                {
                    "id": 1, // optional
                    "title": "Which of the names below belong to marvel?", // required
                    "type": "checkbox",// required, see "Question Options" above
                    "order": 1, // optional
                    "rule": "", // optional
                    "required": 1, // optional
                    "answered": false, // optional, see "Question Options" above
                    "value_answer": "", // optional, see "Question Options" above
                    "items": [
                        {
                            "id": 3,
                            "value": "Falcon", // required
                            "selected": false // optional, see "Question Options" above
                        },
                        {
                            "id": 4,
                            "value": "The Flash",
                            "selected": false
                        },
                        {
                            "id": 5,
                            "value": "Iron Man",
                            "selected": true
                        },
                        {
                            "id": 6,
                            "value": "Wolverine",
                            "selected": false
                        },
                        {
                            "id": 7,
                            "value": "Batman",
                            "selected": false
                        },
                        {
                            "id": 8,
                            "value": "Spider-Man",
                            "selected": false
                        }
                    ],
                },
                {
                    "id": 2,
                    "title": "What is your favorite book to read?",
                    "type": "text",
                    "order": 2,
                    "rule": "",
                    "required": 1,
                    "answered": true,
                    "value_answer": "The Age of A.I., Clear Code, Kubernetes Security and Observability ",
                    "items": [
                    ],
                },
                {
                    "id": 3,
                    "title": "What is the tallest building in the world?",
                    "type": "radio",
                    "order": 3,
                    "required": 1,
                    "answered": true,
                    "value_answer": "Burj Khalifa",
                    "items": [
                        {
                            "id": 9,
                            "value": "Burj Khalifa",
                            "selected": true
                        },
                        {
                            "id": 10,
                            "value": "Warisan Merdeka Tower",
                            "selected": false
                        },
                        {
                            "id": 11,
                            "value": "Goldin Finance 117",
                            "selected": false
                        },
                        {
                            "id": 12,
                            "value": "Ping An Finance Center",
                            "selected": false
                        },

                    ],
                },
                {
                    "id": 4,
                    "title": "What's your favorite holiday?",
                    "type": "textarea",
                    "order": 4,
                    "required": 1,
                    "answered": false,
                    "value_answer": "",
                    "items": [
                    ],
                },
            ]
        }
    ]
}