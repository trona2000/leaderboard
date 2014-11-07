/*jshint eqnull: true*/
var parse   = require( 'co-body' );
var http    = require( 'http' );
var Player  = require( '../models/player' );
var r       = require( '../thinky' ).r;

// Retrieve all players
module.exports.getAll = function* getAll( next )
{
    this.type = 'application/json';

    try
    {
        var players = yield Player.getView().run();
        this.body = JSON.stringify( players );
    }
    catch( e )
    {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }

    yield next;
};

// Retrieve a player by id
module.exports.get = function* get( next )
{
    this.type = 'application/json';

    try
    {
        var id = this.params.id;
        var player = yield Player.get( id ).getView().run();

        if ( !player )
        {
            this.status = 404;
            player = {};
        }

        this.body = JSON.stringify( player );

    }
    catch( e )
    {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }

    yield next;
};

// Create a new player
module.exports.create = function* create( next )
{
    this.type = 'application/json';

    try
    {
        var data        = yield parse( this );
        var player      = new Player( data );

        yield player.save();

        this.body = JSON.stringify( player.getView() );
        this.status = 201;
    }
    catch( e )
    {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }

    yield next;
};

// Update a player
module.exports.update = function* update( next )
{
    this.type = 'application/json';

    try
    {
        var data = yield parse(this);

        if ( ( data == null ) || ( data.id == null ) )
        {
            throw new Error( 'The player must have a field `id`.' );
        }

        var player = yield Player.get( data.id ).run();
        yield player.merge( data ).save();

        this.body = JSON.stringify( player );
    }
    catch( e )
    {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }

    yield next;
};

// Delete a player
module.exports.del = function* del( next )
{
    this.type = 'application/json';

    try
    {
        var id = this.params.id;

        if ( id == null )
        {
            throw new Error('The player must have a field `id`.');
        }

        var player = yield Player.get( id ).run();
        yield player.delete();

        this.status = 204;
    }
    catch( e )
    {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }

    yield next;
};

module.exports.isLoggedIn = function* login( next )
{
    var id = this.params.id;

    if ( this.session[id] === true )
    {
        yield next;
    }
    
    this.status = 200;
};

// Delete a player
module.exports.login = function* login( next )
{
    this.type = 'application/json';

    try
    {
        var id          = this.params.id;
        var password    = this.params.password;

        if ( id == null )
        {
            throw new Error('You needto specify a username.');
        }

        var player = yield Player.get( id ).run();

        var hash = function( pwd )
        {
            return pwd;
        };

        if ( player == null || hash( password ) !== player.password )
        {
            throw new Error( 'The username or password is incorrect.' );
        }

        // do stuff set session
        if ( !this.session[id] )
        {
            this.session[id] = true;
        }

        this.status = 200;
    }
    catch( e )
    {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }

    yield next;
};


// Delete a player
module.exports.logout = function* logout( next )
{
    this.type = 'application/json';

    console.log( 'yo', this.session );
    try
    {
        var id = this.params.id;
        this.session[id] = null;
        this.status = 204;
    }
    catch( e )
    {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }

    yield next;
};
