// This is the WebSocket manager which handles messages between server and clients

var webSocket = new Object;
var text_buffer = ["** Welcome to this mini irc client!\t**", "** Send message with the input field.\t**"];
var index = 2;
var max_messages = 400;
var user_name = "";

function add(text) {
    text_buffer[index++] = text;
    index = index % max_messages;
}

function append(text) {
    // Add text to circular buffer
    add(text);

    // Find canvas
    var canvas = document.getElementById("msg_c");
    var context = canvas.getContext("2d");

    // Cleaning up
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();

    // Display irc text
    context.font="14px Consolas";
    display(context);
}

function display(context) {
    if(text_buffer.length < max_messages) {
        for(var i = 0; i < text_buffer.length; ++i) {
            context.fillText(text_buffer[i],10,20*i+40);
        }
    }
    else {
        counter = 0;
        start = (index + 1) % text_buffer.length;
        end = index;
        for(var i = start; i != end; i = (i+1) % text_buffer.length) {
            context.fillText(text_buffer[i],10,20*counter+40);
            counter++;
        }
    }
}

function send() {
    message = form1.inputfield.value;

    // Do not send empty messages
    if(message == ""){
        return;
    }

    form1.inputfield.value = "";
    console.log("Client sent message: " +  message);
    webSocket.send("<"+user_name+">: " + message);
}

function load() {
    // Open socket to server
    open();

    // Bind the Return-key to our input field which in turn calls the send-function
    document.getElementById('in_field').onkeypress = function(e) {
        if (!e) {
            e = window.event;
        }
        if (e.keyCode == '13'){
            send();
            return false;
        }
    }
}

function open() {
    // Test if browser supports WebSockets.
    if("WebSocket" in window == false) {
        alert("This browser does not support WebSockets.");
        return;
    }

    // Get a random animal as name.
    user_name = "Anonymous " + animals[Math.floor(Math.random() * animals.length)];

    path = "ws://"+window.location.hostname+":9000/websocket";
    
    // Create our WebSocket and open a connection.
    webSocket = new WebSocket(path);
    
    // Handle open
    webSocket.onopen = function() {
        // Append text to the message_canvas in our browser.
        var message = webSocket.url;
        console.log("Connected to " +  message );
        append("Connection established to " + window.location.hostname + " as " + user_name);
    }

    // Define handler for the message event
    webSocket.onmessage = function(event) {
        // Append text to the message_canvas div in our browser.
        var message = event.data;
        console.log("Server: " + message);
        append(message);
    }

    // Log errors
    webSocket.onerror = function (error) {
        console.log("Error: " + error);
        append("Error: " + error + ".");
    };

    // Handle close
    webSocket.onclose = function() {
        var message = webSocket.url;
        console.log("Closed connection to " +  message + ".");
        append("Connection to " + window.location.hostname + " lost.");
    }
}

const animals = ["Aardvark",
"Albatross",
"Alligator",
"Alpaca",
"Ant",
"Anteater",
"Antelope",
"Ape",
"Armadillo",
"Ass",
"Donkey",
"Baboon",
"Badger",
"Barracuda",
"Bat",
"Bear",
"Beaver",
"Bee",
"Bison",
"Boar",
"Buffalo",
"Galago",
"Butterfly",
"Camel",
"Caribou",
"Cat",
"Caterpillar",
"Cattle",
"Chamois",
"Cheetah",
"Chicken",
"Chimpanzee",
"Chinchilla",
"Chough",
"Clam",
"Cobra",
"Cockroach",
"Cod",
"Cormorant",
"Coyote",
"Crab",
"Crane",
"Crocodile",
"Crow",
"Curlew",
"Deer",
"Dinosaur",
"Dog",
"Dogfish",
"Dolphin",
"Donkey",
"Dotterel",
"Dove",
"Dragonfly",
"Duck",
"Dugong",
"Dunlin",
"Eagle",
"Echidna",
"Eel",
"Eland",
"Elephant",
"Elephantseal",
"Elk",
"Emu",
"Falcon",
"Ferret",
"Finch",
"Fish",
"Flamingo",
"Fly",
"Fox",
"Frog",
"Gaur",
"Gazelle",
"Gerbil",
"GiantPanda",
"Giraffe",
"Gnat",
"Gnu",
"Goat",
"Goose",
"Goldfinch",
"Goldfish",
"Gorilla",
"Goshawk",
"Grasshopper",
"Grouse",
"Guanaco",
"Guineafowl",
"Guineapig",
"Gull",
"Hamster",
"Hare",
"Hawk",
"Hedgehog",
"Heron",
"Herring",
"Hippopotamus",
"Hornet",
"Horse",
"Human",
"Hummingbird",
"Hyena",
"Jackal",
"Jaguar",
"Jay",
"Jay,Blue",
"Jellyfish",
"Kangaroo",
"Koala",
"Komododragon",
"Kouprey",
"Kudu",
"Lapwing",
"Lark",
"Lemur",
"Leopard",
"Lion",
"Llama",
"Lobster",
"Locust",
"Loris",
"Louse",
"Lyrebird",
"Magpie",
"Mallard",
"Manatee",
"Marten",
"Meerkat",
"Mink",
"Mole",
"Monkey",
"Moose",
"Mouse",
"Mosquito",
"Mule",
"Narwhal",
"Newt",
"Nightingale",
"Octopus",
"Okapi",
"Opossum",
"Oryx",
"Ostrich",
"Otter",
"Owl",
"Ox",
"Oyster",
"Panther",
"Parrot",
"Partridge",
"Peafowl",
"Pelican",
"Penguin",
"Pheasant",
"Pig",
"Pigeon",
"Pony",
"Porcupine",
"Porpoise",
"PrairieDog",
"Quail",
"Quelea",
"Rabbit",
"Raccoon",
"Rail",
"Ram",
"Rat",
"Raven",
"Reddeer",
"Redpanda",
"Reindeer",
"Rhinoceros",
"Rook",
"Ruff",
"Salamander",
"Salmon",
"SandDollar",
"Sandpiper",
"Sardine",
"Scorpion",
"Sealion",
"SeaUrchin",
"Seahorse",
"Seal",
"Shark",
"Sheep",
"Shrew",
"Shrimp",
"Skunk",
"Snail",
"Snake",
"Spider",
"Squid",
"Squirrel",
"Starling",
"Stingray",
"Stinkbug",
"Stork",
"Swallow",
"Swan",
"Tapir",
"Tarsier",
"Termite",
"Tiger",
"Toad",
"Trout",
"Turkey",
"Turtle",
"Vicuña",
"Viper",
"Vulture",
"Wallaby",
"Walrus",
"Wasp",
"Waterbuffalo",
"Weasel",
"Whale",
"Wolf",
"Wolverine",
"Wombat",
"Woodcock",
"Woodpecker",
"Worm",
"Wren",
"Yak",
"Zebra"];