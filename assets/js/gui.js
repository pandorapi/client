function infoTip(type, text, options) {
    var cache = toastr.options
    toastr.options = $.extend(toastr.options, options)
    toastr[type](text, options);
    toastr.options = cache;
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

var loader = {
    big: function(action) {
        if (action == 'start') {
            $('#loader').removeClass('end').addClass('start')
        } else if (action == true) {
            $('#loader').removeClass('end')
        } else if (action == false) {
            $('#loader').addClass('end').removeClass('start')
        }
    },
    logo: function(action) {
        if (action == true) {
            $('#logo').addClass('loading')
        } else if (action == false) {
            $('#logo').removeClass('loading')
        }
    }
}

$(document).on('click', '.infoTip.clear', function() {
        toastr.clear()
    }).on('click', '.infoTip.remove', function() {
        toastr.remove()
    })
    .on('click', '.event.reconnect', function() {
        window.abortReConnection = false
        window.connectionCount = 0
        loader.logo(true);
        socket.emit('reConnect')
    })
