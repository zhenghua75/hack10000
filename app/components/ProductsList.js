'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    ScrollView,
    Text,
}=React;

var ProductsList = React.createClass({
    render: function () {
        return (
            <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                {this.props.children}
            </View>
        );
    }
});

module.exports = ProductsList;
