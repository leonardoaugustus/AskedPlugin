/*!
 * Asked jQuery Plugin
 * 
 *
 * @updated April 13, 2025
 * @version 2.0
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
            classButtonSave: 'btn btn-primary',
            classTitleQuiz: 'h1',
            titleQuiz: true,
            destroy: false,
            events: {
                onStartQuiz: function (options) { },
                onCompleteQuiz: function (options) { }
            }
        }

        plugin.config = $.extend(defaults, options);

        var internal = {
            method: {

                renderRadio: function (question, count_question) {
                    var html = "";
                    html += "<div class=\"form-group mb-3 px-3\" id=\"question_" + question.id + "\">";
                    html += "<label class=\"h5 fs-0\">" + count_question + ") " + question.title + "</label>";

                    question.items.forEach(item => {
                        // Se o item for do tipo "texto", renderiza o input com label e preenche com o valor salvo (value_answer)
                        if (item.type && item.type.toLowerCase() === "texto") {
                            html += "<div class=\"mb-3\">";
                            html += "<label for=\"question_" + question.id + "_item_" + item.id + "_input\">" + item.value + "</label>";
                            html += "<input type=\"text\" class=\"form-control\" data-question-type=\"radio\" data-question-item-id=\"" + item.id + "\" name=\"question_" + question.id + "_item_" + item.id + "_input\" id=\"question_" + question.id + "_item_" + item.id + "_input\" placeholder=\"" + item.value + "\" value=\"" + (item.saved_value ? item.saved_value : "") + "\">";
                            html += "</div>";
                        } else {
                            // Renderiza o radio normalmente para os demais itens
                            var checked = item.selected ? 'checked' : '';
                            var required = ((question.required == true && question.answered == false) ? ' required="required" ' : '');
                            html += "<div class=\"form-check m-0\">";
                            html += "<input class=\"form-check-input\" type=\"radio\" name=\"question_" + question.id + "\" id=\"item_" + item.id + "\" value=\"" + item.value + "\" " + checked + required + ">";
                            html += "<label class=\"fw-medium\" for=\"item_" + item.id + "\">" + item.value + "</label>";
                            html += "</div>";
                        }
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
                    html += "<div class=\"form-group mb-3 px-3\" id=\"question_" + question.id + "\" data-rule=\"" + rule + "\">";
                    html += "<span class=\"h5 fs-0\" for=\"question_" + question.id + "\">" + count_question + ") " + question.title + "</span>";
                    html += internal.method.renderInputType(question, question.value_answer);
                    html += "</div>";

                    return html;
                },

                renderTextArea(question, count_question) {

                    var html = "";
                    var required = (question.obrigatorio == true ? ' required="required" ' : '');
                    var regra = (question.rule == "editable" ? 'editable' : '');

                    html += "<div class=\"form-group mb-3 px-3\">";
                    html += "<span class=\"h5 fs-0\" for=\"question_" + question.id + "\">" + count_question + ") " + question.title + "</span>";
                    html += "<textarea type=\"textarea\" class=\"form-control " + regra + "\" name=\"question_" + question.id + "\" rows=\"5\" cols=\"70\"" + required + ">" + (question.value_answer == null ? '' : question.value_answer) + "</textarea>";
                    html += "</div>";

                    return html;
                },

                renderInputType: function (question, value_answer) {
                    var input = "";
                    var required = (question.required == true ? ' required="required" ' : '');

                    switch (question.rule) {
                        case "number":
                            input += "<input type=\"number\" class=\"form-control\" name=\"question_" + question.id + "\" value=\"" + value_answer + "\"" + required + ">";
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
                    html += "<div class=\"form-group mb-3 px-3\" id=\"question_" + question.id + "\">";
                    html += "<span class=\"h5 fs-0\">" + count_question + ") " + question.title + "</span>";

                    var required = '';
                    // Checa se nenhum dos itens está marcado
                    var answered = $.map(question.items, function (n, i) {
                        if (n.selected === true) {
                            return n.selected;
                        }
                    });
                    // Se não houver nenhum item marcado e a questão for obrigatória, adiciona o atributo required
                    if (!answered.length && question.required === true) {
                        required = ' required="required" ';
                    }

                    question.items.forEach(item => {
                        var checked = (item.selected === true ? ' checked ' : '');
                        // Monte o input com os atributos devidamente separados
                        html += "<div class=\"form-check\">";
                        html += "<input class=\"form-check-input\" type=\"checkbox\" name=\"question_" + question.id + "\" id=\"item_" + item.id + "\" value=\"" + item.value + "\" " +
                            "data-question-item-id=\"" + item.id + "\" " +
                            "onclick=\"changeCheckboxRequired('" + question.id + "', '" + question.required + "');\" " +
                            required + " " + checked + ">";
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

                        if (plugin.config.titleQuiz && quiz.title) {
                            html += "<h2 class=\"" + plugin.config.classTitleQuiz + "\">" + quiz.title + "</h2>";
                        }

                        var quiz_id = quiz.id;
                        if (!quiz_id) {
                            count_quiz_id++;
                            quiz_id = count_quiz_id;
                        }

                        // Mantém o nome do form com dois underscores para compatibilidade com o seletor em askedResult
                        html += "<form action=\"" + quiz.route + "\" class=\"mb-3 g-3 form_quiz\" method=\"POST\" name=\"form_quiz_" + "_" + quiz_id + "\" data-quiz-id=\"" + quiz_id + "\" ";
                        html += "onsubmit=\"return submitQuiz('" + quiz_id + "');\" quiz-required=\"" + quiz.required + "\"";
                        html += ">";

                        var count_question = 0;
                        var order_question = 0;
                        quiz.questions.forEach(question => {

                            if (!question.order) {
                                count_question++;
                                order_question = count_question;
                            } else {
                                order_question = question.order;
                            }

                            if (question.type == "radio") {
                                html += internal.method.renderRadio(question, order_question);

                            } else if (question.type == "textarea") {
                                html += internal.method.renderTextArea(question, order_question);

                            } else if (question.type == "input") {
                                html += internal.method.renderText(question, order_question);

                            } else if (question.type == "checkbox") {
                                html += internal.method.renderCheckbox(question, order_question);
                            }
                        });

                        html += "<button type=\"submit\" class=\"" + plugin.config.classButtonSave + "\">" + plugin.config.textButtonSave + "</button>";
                        html += "</form>";
                        $element.append(html);
                    }
                });

            },

            askedResult: function (quiz_id) {
                var form_quiz = $('form[name="form_quiz_' + "_" + quiz_id + '"]');
                var answers = $("input, textarea, select", form_quiz).map(function () {
                    var $input = $(this);
                    var parts = $input.attr('name').split('_');
                    var question_id = parts[1];
                    var question_type = $input.data('question-type') || $input.attr('type');
                    var question_item_id = "";

                    if (question_type === "radio" || question_type === "checkbox") {
                        question_item_id = $input.data('question-item-id') || ($input.attr('id') ? $input.attr('id').replace('item_', '') : '');
                    }

                    var answered = (question_type === "radio" || question_type === "checkbox")
                        ? ($input.attr('type') === "text" ? $input.val().trim() !== "" : $input.is(':checked'))
                        : true;

                    return {
                        question_id: question_id,
                        question_type: question_type,
                        question_item_id: question_item_id,
                        value: $input.val(),
                        question_rule: (question_type === "input" ? $("#question_" + question_id).attr('data-rule') : ''),
                        answered: answered
                    };
                }).get();
                return answers;
            }


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
                var form = $('form[name="form_quiz_' + "_" + quiz_id + '"]')[0];

                // ⬇️ AQUI ESTÁ A CORREÇÃO
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }

                event.preventDefault();

                var askeds = plugin.method.askedResult(quiz_id);

                if (plugin.config.events && typeof plugin.config.events.onCompleteQuiz === 'function') {
                    plugin.config.events.onCompleteQuiz(askeds, quiz_id);
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
            $(this).removeData('asked');
            $(this).html("");

            if (undefined !== $(this).data('asked')) {
                if (options.destroy) {
                    $(this).removeData('asked');
                    $(this).html("");
                }
            }

            var plugin = new $.asked(this, options);
            $(this).data('asked', plugin);
        });
    };
}(jQuery));