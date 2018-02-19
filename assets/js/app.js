let numUsers = 0;
let yourName = '';
let loggedIn = false;

$(function () {
    var socket = io('http://ec2-34-227-11-223.compute-1.amazonaws.com:3000');
    $('form').submit(function (e) {
        e.preventDefault();
        const msg = $('#m').val();
        addToChat(`<li><span class="ppl">${yourName}</span>: ${msg} </li>`);
        socket.emit('new message', msg);
    });

    socket.on('new message', function (obj) {
        addToChat(`<li><span class="ppl">${obj.username}</span>: ${obj.message} </li>`);
    });

    $('#btn').click(function (e) {
        e.preventDefault();
        if ($('#userid').val().length > 0 && !loggedIn) {
            yourName = $('#userid').val();
            socket.emit('add user', yourName);
        }
    });

    socket.on('login', function (obj) {
        addToChat(`<li>you logged in as ${yourName}</li>`);
        loggedIn = true;
    });

    socket.on('user joined', function (obj) {
        addToChat(`<li><span class="ppl">${obj.username}</span> logged in</li>`);
        numUsers = obj.numUsers;
    });

    socket.on('user left', function (obj) {
        addToChat(`<li><span class="ppl">${obj.username}</span> logged out</li>`);
        numUsers = obj.numUsers;
    });    

    socket.on('typing', function (obj) {
        addToChat(`<li><span class="ppl">${obj.username}</span> is typing...</li>`);
    });

    socket.on('stop typing', function (obj) {
        addToChat(`<li><span class="ppl">${obj.username}</span> stopped typing</li>`);
    });
});

function addToChat(msg) {
    $('#messages').append(msg);
    window.scrollTo(0, document.body.scrollHeight);
}