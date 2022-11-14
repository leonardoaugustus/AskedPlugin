/*!
 * Asked jQuery Plugin
 * 
 *
 * @updated November 14, 2022
 * @version 1.0
 *
 * @author Leonardo Augustus - https://linktr.ee/unitbox
 * @copyright (c) 2022 Unitbox - https://www.unitbox.com.br
 * @license MIT
 */

(function ($) {

    $.asked = function (element, options) {
        var plugin = this,
            $element = $(element),
            _element = '#' + $element.attr('id')

        defaults = {
            data: [],
            textButtonSave: 'Save &raquo;',
            events: {
                // onStartQuiz: function (options) { },
                onCompleteQuiz: function (options) { }
            }
        }

        plugin.config = $.extend(defaults, options);

        var internal = {
            method: {

                renderRadio: function (question, count_question) {

                    var html = "";
                    html += "<div class=\"form-group mb-3\" id=\"question_" + question.id + "\">";
                    html += "<h5 class=\"fw-normal mb-2\">" + count_question + ") " + question.title + "</h5>";

                    question.items.forEach(item => {
                        var checked = item.selected == false ? '' : 'checked';
                        var required = ((question.required == true && question.answered == false) ? ' required="required" ' : '');

                        html += "<div class=\"form-check m-0\">";
                        html += "<input class=\"form-check-input\" type=\"radio\" name=\"question_" + question.id + "\" id=\"item_" + item.id + "\" value=\"" + item.value +
                            "\" " + checked + required + ">";
                        html += "<label class=\"fw-medium \" for=\"item_" + item.id + "\">" + item.value + "</label>";
                        html += "</div>";
                    });
                    html += "</div>";

                    return html;
                },

                renderText: function (question, count_question) {

                    var rule = "";
                    if (question.rule != "" && question.rule != null && typeof question.rule != 'undefined') {
                        rule = question.rule;
                    }

                    var html = '';
                    html += "<div class=\"form-group mb-3\" id=\"question_" + question.id + "\" data-rule=\"" + rule + "\">";
                    html += "<h5 class=\"fw-normal mb-2\" for=\"question_" + question.id + "\">" + count_question + ") " + question.title + "</h5>";
                    html += internal.method.renderInputType(question, question.value_answer);
                    html += "</div>";

                    return html;
                },

                renderTextArea(question, count_question) {

                    var html = "";
                    var required = (question.obrigatorio == true ? ' required="required" ' : '');

                    html += "<div class=\"form-group mb-3\">";
                    html += "<h5 class=\"fw-normal mb-2\" for=\"question_" + question.id + "\">" + count_question + ") " + question.title + "</h5>";
                    html += "<textarea type=\"textarea\" class=\"form-control\" name=\"question_" + question.id + "\" rows=\"5\" cols=\"70\"" + required + ">" + question.value_answer + "</textarea>";
                    html += "</div>";

                    return html;
                },

                renderInputType: function (question, value_answer) {
                    var input = "";
                    var required = (question.required == true ? ' required="required" ' : '');

                    switch (question.rule) {
                        case "numeric":
                            input += "<input type=\"numeric\" min=\"0\" class=\"form-control\" name=\"item_" + question.id + "\" value=\"" + value_answer +
                                "\" inputmode=\"numeric\" pattern=\"[0-9]*\" " + required + "/>";
                            break;
                        case "telefone":
                            input += "<input type=\"text\" class=\"form-control phone\" name=\"question_" + question.id + "\" value=\"" + value_answer + "\"" + required + ">";
                            break;
                        case "cpf":
                            input += "<input type=\"text\" class=\"form-control cpf\" name=\"question_" + question.id + "\" value=\"" + value_answer + "\"" + required + " >";
                            break;
                        case "money":
                            input += "<input type=\"text\" class=\"form-control money\" name=\"question_" + question.id + "\" value=\"" + value_answer + "\"" + required + ">";
                            break;
                        case "date":
                            input += "<input type=\"date\" class=\"form-control date\" name=\"question_" + question.id + "\" value=\"" + value_answer + "\"" + required + ">";
                            break;
                        default:
                            input += "<input type=\"text\" class=\"form-control\" name=\"question_" + question.id + "\" value=\"" + value_answer + "\"" + required + ">";
                            break;
                    }

                    return input;
                },

                renderCheckbox: function (question, count_question) {
                    var html = '';
                    html += "<div class=\"form-group mb-3\" id=\"question_" + question.id + "\">";
                    html += "<h5 class=\"fw-normal mb-2\">" + count_question + ") " + question.title + "</h5>";

                    var required = '';
                    var answered = $.map(question.items, function (n, i) {
                        if (n.selected == true) {
                            return n.selected;
                        }
                    });

                    question.items.forEach(item => {
                        var checked = (item.selected == true ? ' checked ' : '');
                        if (answered == false) {
                            if (question.required == true) {
                                required = ' required="required" ';
                            }
                        }

                        html += "<div class=\"form-check\">";
                        html += "<input class=\"form-check-input\" type=\"checkbox\" name=\"question_" +
                            question.id + "\" id=\"item_" + item.id + "\" value=\"" + item.value + "\"" +
                            "onclick=\"changeCheckboxRequired('" + question.id + "', '" + question.required + "');" + "\"" + required + "";
                        html += checked + ">";
                        html += "<label class=\"form-check-label\" for=\"item_" + item.id + "\">" + item.value + "</label>";
                        html += "</div>";
                    });
                    html += "</div>";

                    return html;
                }
            }
        };

        plugin.method = {

            setupQuiz: function () {

                var count_quiz_id = 0;

                plugin.config.data.forEach(quiz => {

                    if (quiz.questions.length >= 1) {

                        var html = "";
                        if (quiz.title != "" && quiz.title != null && typeof quiz.title != 'undefined') {
                            html += "<h2>" + quiz.title + "</h2>";
                        }

                        var quiz_id = 0;
                        if (quiz.id == "" || quiz.id == null || typeof quiz.id == 'undefined') {
                            count_quiz_id++;
                            quiz_id = count_quiz_id;
                        } else {
                            quiz_id = quiz.id;
                        }

                        html += "<form action=\"" + quiz.route + "\" class=\"mb-3 g-3\" method=\"POST\" name=\"form_quiz_" + "_" + quiz_id + "\"";
                        html += "onsubmit=\"return submitQuiz('" + quiz_id + "');\" quiz-required=" + quiz.required + "";
                        html += ">";

                        var count_question = 0;
                        var order_question = 0;
                        quiz.questions.forEach(question => {

                            if (question.order == "" || question.order == null || typeof question.order == 'undefined') {
                                count_question++;
                                order_question = count_question;
                            } else {
                                order_question = question.order;
                            }

                            if (question.type == "radio") {
                                html += internal.method.renderRadio(question, order_question);

                            } else if (question.type == "textarea") {
                                html += internal.method.renderTextArea(question, order_question);

                            } else if (question.type == "text") {
                                html += internal.method.renderText(question, order_question);

                            } else if (question.type == "checkbox") {
                                html += internal.method.renderCheckbox(question, order_question);
                            }
                        });

                        html += "<button type=\"submit\" class=\"btn btn-sm btn-primary\">" + plugin.config.textButtonSave + "</button>";
                        html += "</form>";
                        // html += '<input type="text" id="quiz_complete_' + quiz.questionario_id + '" value="">';
                        $element.append(html);
                    }
                });
            },

            askedResult: function (quiz_id) {

                var form_quiz = $('form[name="form_quiz_' + "_" + quiz_id + '"]');
                let $inputs = $("input, textarea, select", form_quiz);
                var answers = [];

                $.each($inputs, function (index, value) {

                    var question_id = $(value).attr('name').replace('question_', '');
                    var question_type = $(value).attr('type');
                    var question_item_id = (question_type != "text" && question_type != 'textarea' ? $(value).attr('id') : '').replace('item_', '');

                    if ($(value).is('input:checkbox, input:radio, input:text, textarea')) {

                        var answered = (question_type == "checkbox" || question_type == "radio" ? $(value).is(':checked') : true);

                        answers.push({
                            "question_id": question_id,
                            "question_type": question_type,
                            "question_item_id": question_item_id,
                            "value": $(value).val(),
                            "question_rule": (question_type == "text" ? $("#question_" + question_id).attr('data-rule') : ''),
                            "answered": answered
                        });
                    }
                });
                return answers;
            },
        };

        plugin.init = function () {

            plugin.method.setupQuiz();

            changeCheckboxRequired = function (question_id, required) {
                var requiredCheckboxes = $("input:checkbox[name='question_" + question_id + "']");

                requiredCheckboxes.change(function () {
                    if (requiredCheckboxes.is(':checked') && required) {
                        requiredCheckboxes.removeAttr('required');
                    } else {
                        if (required == true) {
                            requiredCheckboxes.attr('required', 'required');
                        }
                    }
                });
            }

            submitQuiz = function (quiz_id) {
                event.preventDefault();
                var askeds = plugin.method.askedResult(quiz_id);

                if (plugin.config.events && plugin.config.events.onCompleteQuiz) {
                    plugin.config.events.onCompleteQuiz.apply(null, [askeds]);
                }
            }

            // Bind "next" buttons
            // $(".btn").on('click', function (e) {
            //     e.preventDefault();
            // });
        };

        plugin.init();
    }

    $.fn.asked = function (options) {

        return this.each(function () {
            if (undefined === $(this).data('asked')) {
                var plugin = new $.asked(this, options);
                $(this).data('asked', plugin);
            }
        });
    };
}(jQuery));
