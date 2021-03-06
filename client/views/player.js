var View        = require( 'ampersand-view' );
var templates   = require( '../templates' );

module.exports = View.extend(
{
    template    : templates.includes.player,
    bindings    :
    {
        'model.fullName'    : '[data-hook~=name]',
        'model.avatar'      :
        {
            type    : 'attribute',
            hook    : 'avatar',
            name    : 'src'
        },
        'model.ranking'             : '[data-hook~=elo]',
        'model.matches.length'      : '[data-hook~=matches]',
        'model.wonMatches.length'   : '[data-hook~=wins]',
        'model.lostMatches.length'  : '[data-hook~=losses]',
        'model.viewUrl'     :
        {
            type    : 'attribute',
            hook    : 'name',
            name    : 'href'
        },
        'model.editUrl'     :
        {
            type    : 'attribute',
            hook    : 'action-edit',
            name    : 'href'
        }
    },
    events  :
    {
        'click [data-hook~=action-delete]' : 'handleRemoveClick'
    },
    handleRemoveClick   : function()
    {
        this.model.destroy();
        return false;
    }
} );
