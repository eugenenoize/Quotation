
function GetCategories() {
    $.ajax({
        url: 'api/categories',
        type: 'GET',
        contentType: "application/json",
        success: function (categories) {
            var options = "";
            $.each(categories, function (index, category) {
                options += option(category);
            })
            $("#quoteForm select").append(options);
        }
    });
}

function GetQuotes() {
    $.ajax({
        url: '/api/quotes',
        type: 'GET',
        contentType: "application/json",
        success: function (quotes) {
            var rows = "";
            $.each(quotes, function (index, quote) {
                rows += row(quote);
            })
            $("table tbody").append(rows);
        }
    });
}

function GetQuote(id) {
    $.ajax({
        url: 'api/quotes/' + id,
        type: 'GET',
        contentType: "application/json",
        success: function (quote) {
            var category = quote.categoryId;
            var form = document.forms["quoteForm"];
            form.elements["id"].value = quote.id;
            form.elements["author"].value = quote.author;
            form.elements["text"].value = quote.text;
            form.elements["datecreate"].value = quote.dateCreate;
            $("select option[value = " + category + "]").attr('selected', 'true');
        }
    });
}


function CreateQuote(author, text, categoryid) {
    $("#errors").empty().hide();
    $.ajax({
        url: "api/quotes",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            author: author,
            text: text,
            categoryid: categoryid
        }),
        success: function (user) {
            reset();
            $("table tbody").append(row(user));
        },
        //получение ошибок 
        error: function (jxqr, error, status) {
            // парсинг json-объекта
            if (jxqr.responseText === "") {
                $('#errors').append("<h3>" + jxqr.statusText + "</h3>");
            }
            else {
                var response = JSON.parse(jxqr.responseText);
                // добавляем общие ошибки модели
                if (response['']) {

                    $.each(response[''], function (index, item) {
                        $('#errors').append("<p>" + item + "</p>");
                    });
                }
                // добавляем ошибки свойства Name
                if (response['Author']) {

                    $.each(response['Author'], function (index, item) {
                        $('#errors').append("<p>" + item + "</p>");
                    });
                }
                // добавляем ошибки свойства Text
                if (response['Text']) {
                    $.each(response['Text'], function (index, item) {
                        $('#errors').append("<p>" + item + "</p>");
                    });
                }
            }

            $('#errors').show();
        }
    })
}



function EditQuote(quoteid, quoteauthor, quotetext, quotedatecreate, quotecategoryid) {
    $("#errors").empty().hide();
    $.ajax({
        url: "api/quotes",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: quoteid,
            author: quoteauthor,
            text: quotetext,
            datecreate: quotedatecreate,
            categoryid: quotecategoryid
        }),
        success: function (quote) {
            reset();
            $("tr[data-rowid='" + quote.id + "']").replaceWith(row(quote));
        },
        //получение ошибок 
        error: function (jxqr, error, status) {
            // парсинг json-объекта
            if (jxqr.responseText === "") {
                $('#errors').append("<h3>" + jxqr.statusText + "</h3>");
            }
            else {
                var response = JSON.parse(jxqr.responseText);
                // добавляем общие ошибки модели
                if (response['']) {

                    $.each(response[''], function (index, item) {
                        $('#errors').append("<p>" + item + "</p>");
                    });
                }
                // добавляем ошибки свойства Name
                if (response['Author']) {

                    $.each(response['Author'], function (index, item) {
                        $('#errors').append("<p>" + item + "</p>");
                    });
                }
                // добавляем ошибки свойства Text
                if (response['Text']) {
                    $.each(response['Text'], function (index, item) {
                        $('#errors').append("<p>" + item + "</p>");
                    });
                }
            }

            $('#errors').show();
        }
    });
}

function DeleteQuote(id) {
    $.ajax({
        url: "api/quotes/" + id,
        contentType: "application/json",
        method: "DELETE",
        success: function (quote) {
            $("tr[data-rowid='" + quote.id + "']").remove();
        }
    });
}

// сброс формы
function reset() {
    var form = document.forms["quoteForm"];
    form.reset();
    $('#errors').empty().hide();
    form.elements["id"].value = 0;
}

// создание строки для таблицы
var row = function (quote) {
    //перевод utc времени в локальное клиента
    var date = moment.utc(quote.dateCreate).toDate();
    date = moment(date).format("DD.MM.YYYY HH:mm");

    GetCategories
    return "<tr  data-rowid='" + quote.id + "'><td hidden>" + quote.id + "</td>"
        + "<td>" + quote.author + "</td>"
        + "<td>" + quote.text + "</td>"
        + "<td>" + date + "</td>"
        + "<td>" + quote.category.name + "</td>"
        + "<td><a class='editLink' data-id='" + quote.id + "'>Изменить</a> | " +
        "<a class='removeLink' data-id='" + quote.id + "'>Удалить</a></td></tr>";
}


// создание категорий
var option = function (category) {
    return "<option value='" + category.id + "'>" + category.name + "</option>";
}

// сброс значений формы
$("#reset").click(function (e) {

    e.preventDefault();
    reset();
})

// отправка формы
$("form").submit(function (e) {
    e.preventDefault();
    var id = this.elements["id"].value;
    var author = this.elements["author"].value;
    var text = this.elements["text"].value;
    var datecreate = this.elements["datecreate"].value;
    var categoryid = this.elements["category"].value;
    if (id == 0) {
        CreateQuote(author, text, categoryid);
    }
    else
        EditQuote(id, author, text, datecreate, categoryid);
});

// нажимаем на ссылку Изменить
$("body").on("click", ".editLink", function () {
    var id = $(this).data("id");
    GetQuote(id);
})
// нажимаем на ссылку Удалить
$("body").on("click", ".removeLink", function () {
    var id = $(this).data("id");
    DeleteQuote(id);
})

// сортировка цитат
$(".sortquote").click(function () {
    SortQuote($(this).val());
})

function SortQuote(sort) {
    $.ajax({
        url: '/api/quotes/sortquote/' + sort,
        type: 'GET',
        contentType: "application/json",
        success: function (quotes) {
            var rows = "";
            $.each(quotes, function (index, quote) {
                rows += row(quote);
            })
            $("table tbody").empty();
            $("table tbody").append(rows);
        }
    });
}

// загрузка цитат
GetQuotes();
GetCategories();

