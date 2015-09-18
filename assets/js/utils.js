/**
 * Created by alemaum on 10/01/2013.
 */
function AttributeError(msg) {
    this.mensagem = msg;
    this.toString = function () {
        return "AttributeError: " + this.mensagem;
    };
}
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'string' || typeof arguments[i] == 'number') {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        } else {
            throw new AttributeError('O atributo não é do tipo String');
        }
    }
    return formatted;
};

function Carregando() {
    var divAguarde = $('#divAguarde');
    return {
        MostrarAguarde: function () {
            divAguarde.modal('show');
        },
        'EsconderAguarde': function () {
            divAguarde.modal('hide');
        }
    };
}
