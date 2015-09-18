/**
 * Created by alemaum on 16/09/2015.
 */
(function () {

    function GithubRepo() {

        this.handler;

        this.e_promise;

        this.response = [];

        this.git_usuario;
        this.git_repositorio;
        this.git_url_api = 'https://api.github.com/repos/{0}/{1}/issues';

        this.tabela;

        this.msg_alerta = '<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">' +
            '&times;</a><strong>Aten&ccedil;&atilde;o! </strong>A consulta para o reposit&oacute;rio "{1}" do ' +
            'usu&aacute;rio "{0}" n&atilde;o retornou dados</div>';

        this.msg_error = '<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;' +
            '</a><strong>Erro! </strong>A consulta do reposit&oacute;rio "{1}" do usu&aacute;rio "{0}" ' +
            'gerou um erro: ({2}) {3}</div>';

        this.popula_registro = function (registro) {
            this.tabela.children('tbody')
                .append('<tr class="row-issues"><th>{0}</th><td>{1}</td></tr>'
                    .format(registro.number, registro.title))
        };

        this.limpa_registros = function () {
            if (typeof this.tabela != 'undefined') {
                this.tabela.children('tbody').children().remove();
            }
        };

        this.dispara_alerta = function (str_alerta) {
            $('div#mensagem').append(str_alerta);
        };

        this.limpa_alerta = function () {
            $('div#mensagem').children().remove();
        };
    }

    GithubRepo.prototype.Buceta = function () {
        console.log('Por que essa Buceta não funciona...');
    };

    GithubRepo.prototype.SetTabela = function (id_tabela) {
        this.tabela = $(id_tabela);
    };

    GithubRepo.prototype.BuscaIssues = function (usuario, repositorio) {
        var self = this;
        this.limpa_alerta();
        this.limpa_registros();

        this.git_usuario = usuario;
        this.git_repositorio = repositorio;

        self.response = [];
        this.handler = $.get(self.git_url_api.format(self.git_usuario, self.git_repositorio));

        this.e_promise = self.handler.promise();

        this.e_promise.done(function (data) {
            self.response = data;
        });

        this.e_promise.fail(function (data) {
            self.limpa_registros();
            self.dispara_alerta(self.msg_error.format(self.git_usuario, self.git_repositorio, data.status,
                data.statusText))
        });
    };

    GithubRepo.prototype.PopulaTabela = function () {
        var self = this;

        this.e_promise.done(function () {

            self.limpa_registros();

            if (self.response.length > 0) {
                self.response.forEach(function (registro) {
                    self.popula_registro(registro);
                });
            } else {
                self.dispara_alerta(self.msg_alerta.format(self.git_usuario, self.git_repositorio))
            }

        })
    };

    GithubRepo.prototype.done = function (fn) {
        //noinspection JSUnresolvedFunction
        this.e_promise.done(fn);
        return true;
    };

    GithubRepo.prototype.fail = function (fn) {
        //noinspection JSUnresolvedFunction
        this.e_promise.fail(fn);
        return true;
    };

    GithubRepo.prototype.always = function (fn) {
        //noinspection JSUnresolvedFunction
        this.e_promise.always(fn);
        return true;
    };

    function ValidaForm() {
        this.has_error = [];
    }

    ValidaForm.prototype.validaInput = function (input) {
        if (input.val() == '') {
            this.has_error.push(input.parent('div'))
        } else {
            input.parent('div').removeClass('has-error has-feedback');
        }
    };

    ValidaForm.prototype.HasError = function (call) {
        if (this.has_error.length > 0) {
            for (var att in this.has_error) {
                //noinspection JSUnfilteredForInLoop
                this.has_error[att].addClass('has-error');
            }
            this.has_error[0].children('input:first').focus();
            return true;
        } else {
            if (typeof call == 'function') {
                call();
            }
            return false;
        }
    };


    /**
     * @return {boolean}
     */
    function VaiBuscarAsIssues() {
        var validaForm = new ValidaForm();
        var getGithubRepo = new GithubRepo();

        var usuario = $('#github_username');
        var repositorio = $('#github_reponame');

        var carregando = Carregando();

        //carregando.MostrarAguarde();

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

    $('#BuscaIssues').click(event, VaiBuscarAsIssues);
    $('#EitaPreguica').click(event, EitaPreguica);

})();