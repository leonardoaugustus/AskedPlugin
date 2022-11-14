A jQuery plugin to create beautiful, dynamic questions with different element type.

## Demo And Usage

See `index.html` for demo and suggested HTML structure (the element class names are the important part).

See `js/asked-config.js` to set up your quiz copy and questions.


To initialize your quiz:

    $(function () {
        $('#asked').asked({
            // options
        });
    });


## Available Options

**`json`** (JSON Object) - your quiz JSON, pass this instead of setting quizJSON outside of the plugin (see js/asked-config.js)


#### Text Options



#### Functionality Options



#### Question Options

*See "Base Config Options" below for examples*

**`quiz.id`** (Integer) *Required*  - Use if there is more than one true answer and when submitting any single true answer should be considered correct.  (Select ANY that apply vs. Select ALL that apply)


#### Event Options

**`events.onCompleteQuiz`** (function) *Default: empty;* - a function to be executed the quiz has completed; the function will be passed two arguments in an object: <code>options.questionCount</code>, <code>options.score</code>


## Base HTML Structure

The asked ID and class names are what are important here:

     <body>
        <div class="container">
            <div class="asked" id="asked">
            </div>
        </div>
    </body>


## Base Config Options

See `js/asked-config.js`

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
                            "selected": true
                        },
                        {
                            "id": 5,
                            "value": "Iron Man",
                            "selected": false
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
                }
            ]
        }
    ]
}    

Created by [Leonardo Augustus](https://linktr.ee/unitbox) while previously employed at [Unitbox](http://unitbox.com.br), São Paulo, BR.