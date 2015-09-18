/**
 * Created by alemaum on 16/09/2015.
 */

function GithubRepo() {

    var handler;

    var e_promise;

    var response = [];

    //var git_usuario = usuario;
    //var git_repositorio = repositorio;

    var git_usuario;
    var git_repositorio;
    var git_url_api = 'https://api.github.com/repos/{0}/{1}/issues';

    var tabela;

    var msg_alerta = '<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">' +
        '&times;</a><strong>Aten&ccedil;&atilde;o! </strong>A consulta para o reposit&oacute;rio "{1}" do ' +
        'usu&aacute;rio "{0}" n&atilde;o retornou dados</div>';

    var msg_error = '<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;' +
        '</a><strong>Erro! </strong>A consulta do reposit&oacute;rio "{1}" do usu&aacute;rio "{0}" ' +
        'gerou um erro: ({2}) {3}</div>';

    var popula_registro = function (registro) {
        tabela.children('tbody')
            .append('<tr class="row-issues"><th>{0}</th><td>{1}</td></tr>'
                .format(registro.number, registro.title))
    };

    var limpa_registros = function () {
        if (typeof tabela != 'undefined') {
            tabela.children('tbody').children().remove();
        }
    };

    var dispara_alerta = function (str_alerta) {
        $('div#mensagem').append(str_alerta);
    };

    var limpa_alerta = function () {
        $('div#mensagem').children().remove();
    };

    return {
        "SetTabela": function (id_tabela) {
            tabela = $(id_tabela);
        },
        "BuscaIssues": function (usuario, repositorio) {
            limpa_alerta();
            limpa_registros();

            git_usuario = usuario;
            git_repositorio = repositorio;

            response = [];
            handler = $.get(git_url_api.format(git_usuario, git_repositorio));

            e_promise = handler.promise();

            e_promise.done(function (data) {
                response = data;
            });

            e_promise.fail(function (data) {
                limpa_registros();
                dispara_alerta(msg_error.format(git_usuario, git_repositorio, data.status, data.statusText))
            });
        },
        "PopulaTabela": function () {

            e_promise.done(function () {

                limpa_registros();

                if (response.length > 0) {
                    response.forEach(function (registro) {
                        popula_registro(registro);
                    });
                } else {
                    dispara_alerta(msg_alerta.format(git_usuario, git_repositorio))
                }

            })
        },
        'done': function (fn) {
            //noinspection JSUnresolvedFunction
            e_promise.done(fn);
            return true;
        }

        ,
        'fail': function (fn) {
            //noinspection JSUnresolvedFunction
            e_promise.fail(fn);
            return true;
        },
        'always': function (fn) {
            e_promise.always(fn);
            return true
        }
    };
}

function ValidaForm() {
    var has_error = [];
    return {
        'validaInput': function (input) {
            if (input.val() == '') {
                has_error.push(input.parent('div'))
            } else {
                input.parent('div').removeClass('has-error has-feedback');
            }
        },
        'HasError': function (call) {
            if (has_error.length > 0) {
                for (var att in has_error) {
                    //noinspection JSUnfilteredForInLoop
                    has_error[att].addClass('has-error');
                }
                has_error[0].children('input:first').focus();
                return true;
            } else {
                if (typeof call == 'function') {
                    call();
                }
                return false;
            }
        }

    };
}

/**
 * @return {boolean}
 */
function VaiBuscarAsIssues() {
    var validaForm = ValidaForm();
    var getGithubRepo = GithubRepo();

    var usuario = $('#github_username');
    var repositorio = $('#github_reponame');

    var carregando = Carregando();

    validaForm.validaInput(usuario);
    validaForm.validaInput(repositorio);

    if (!validaForm.HasError(carregando.MostrarAguarde)) {
        getGithubRepo.SetTabela('#issuestable');
        getGithubRepo.BuscaIssues(usuario.val(), repositorio.val());
        getGithubRepo.PopulaTabela();
        getGithubRepo.done(function (data) {
            console.log('Result done');
            console.table(data);
        });
        getGithubRepo.fail(function (data) {
            console.log('Result fail: {0}'.format(data.toString()));
        });
        getGithubRepo.always(function () {
            carregando.EsconderAguarde();
            console.log('Result always');
        })
    } else {
        carregando.EsconderAguarde();
    }

}

/**
 * Criei por que estava com uma preguiça de digitar e não estava afim de usar value!!
 */
function EitaPreguica() {
    var usuario = $('#github_username');
    var repositorio = $('#github_reponame');

    usuario.val('freedomsponsors');
    repositorio.val('www.freedomsponsors.org')
}
