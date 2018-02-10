var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;
var Camera = require('react-native-camera');
var NavBar = require('../NavBar');

var CameraTakePicture = React.createClass({
  render() {
    return (
      <View style={{flex:1}}>
        <NavBar returnText={this.props.returnText} title = {'拍照'} navigator={this.props.navigator}/>
        <Camera ref="cam" style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'transparent'}} type={Camera.constants.Type.back}>
        </Camera>
        <TouchableHighlight style={{height:44,backgroundColor:'red',alignItems:'center',justifyContent:'center'}} onPress={this._takePicture}>
            <Text style={{fontSize:18,color:'#ffffff'}}>拍照</Text>
          </TouchableHighlight>
      </View>
    );
  },
  _takePicture() {
    this.refs.cam.capture(function(err, data) {
      console.log(err, data);
    });
  }
});

module.exports = CameraTakePicture;
