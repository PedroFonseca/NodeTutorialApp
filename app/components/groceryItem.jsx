var React = require('react');
module.exports = React.createClass({
    render: function(){
        return (
            <div className={this.props.item.purchased ? "strikethrough" : ""}>{this.props.item.name}</div>
        );
    }
});