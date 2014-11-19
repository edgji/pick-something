var fs = require('fs');
var Shuffle = require('shuffle');

module.exports = Pick;

function Pick(filepath) {
    if(!(this instanceof Pick)) return new Pick(filepath);
    this.filepath = filepath;
}

Pick.prototype.readConfig = function(next) {
    var pick = this;
    fs.readFile(this.filepath, 'utf8', function(error, data) {
        if(error) {
            if(error.code !== 'ENOENT') return next(error);
            data = '{"items": []}';
            error = null;
        }
        pick.list = JSON.parse(data).items || [];
        next(error);
    });
}

Pick.prototype.draw = function(num) {
    num = num || 1;
    this.deck = Shuffle.shuffle({deck: this.list});
    return this.deck.drawRandom(num);
}

Pick.prototype.writeConfig = function() {
    fs.writeFileSync(this.filepath, JSON.stringify(this.toJSON()));
}

Pick.prototype.addItem = function(name) {
    var item = {name: name};
    this.list.push(item);
    return item;
}

Pick.prototype.toJSON = function() {
    return {
        items: this.list
    };
}