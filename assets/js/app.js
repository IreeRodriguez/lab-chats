let numUsers = 0;
let yourName = 'You';
let loggedIn = false;

$(function () {
    var socket = io('http://ec2-34-227-11-223.compute-1.amazonaws.com:3000');

    $('form').submit(function (e) {
        e.preventDefault();
        const msg = $('#m').val();
        addToChat(`<li><span class="you">${yourName}</span>: ${msg} </li>`);
        socket.emit('new message', msg);
        $('#m').val('');
    });

    socket.on('new message', function (obj) {
        const name = obj.username ? obj.username : 'Guest';
        addToChat(`<li><span class="ppl">${name}</span>: ${obj.message} </li>`);
    });

    socket.on('chat message', function (msg) {
        addToChat(`<li><span class="ppl">Guest</span>: ${msg} </li>`);
    });

    $('#btn').click(function (e) {
        e.preventDefault();
        if ($('#userid').val().length > 0 && !loggedIn) {
            yourName = $('#userid').val();
            socket.emit('add user', yourName);
            $('#chat').removeClass('d-none');
            $('#firstLogin').addClass('d-none');
        }
    });
    $('#guest').click(function (e) {
        e.preventDefault();
        $('#chat').removeClass('d-none');
        $('#firstLogin').addClass('d-none');
    });

    socket.on('login', function (obj) {
        addToChat(`<li>you logged in as <span class="you">${yourName}</span></li>`);
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
});

function addToChat(msg) {
    $('#messages').append(msg);
    window.scrollTo(0, document.body.scrollHeight);
}