'use strict';

var React = require('react-native');
var Constants = require('../constants/AppConstants');

var {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
}=React;

var ProductItem = React.createClass({
    propTypes: {
        onPress: React.PropTypes.func.isRequired
    },
    render: function () {
        var product = this.props.product;
        if(product.id === 0){
            return <View></View>
        }
        var width = (Constants.WIDTH-30)/2;
        var height = width*3/4;
        //96x72 300x225
        // var url = product.images;
        // if(url && url !== ''){
        //     url = url.replace('96x72','300x225');
        // }
        //<Text style={{marginLeft:20,color:'#858484',textDecorationLine:'line-through'}}>￥{product.price}</Text>
        //loadingIndicatorSource={require('../common/assets/loading.gif')}
        return (
            <TouchableOpacity style={{width:width,marginTop:10,marginHorizontal:5}} onPress={this.props.onPress}>
                <Image style={{width:width,height:height}} source={{uri: product.image}}/>
                <Text style={{marginTop:5,color:'#858484',fontSize:12,width:width}}>{product.name}</Text>
                <View style={{flexDirection:'row',marginTop:5}}>
                <Text style={{color:'#fe0006'}}>￥{product.defaultdisplayprice}</Text>
                </View>
            </TouchableOpacity>
        );
    }
});

module.exports = ProductItem;
