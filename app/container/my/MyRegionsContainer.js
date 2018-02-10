"use strict";

var React = require('react-native');

var UserStore = require('../../stores/UserStore');
var WebApiUtils = require('../../utils/WebAPIUtils');
var MyRegions = require('../../components/my/MyRegions');

var {
	InteractionManager,
}=React;

function _getStateFromStores () {
    return {
        user:UserStore.getUser(),
        regions:UserStore.getRegions(),
    };
}

var MyRegionsContainer = React.createClass({
	getInitialState(){
		return _getStateFromStores();
	},
	componentDidMount(){
		UserStore.addChangeListener(this._onChange);
	},
  _onChange () {
    this.setState(_getStateFromStores());
  },
  componentWillUnmount () {
    UserStore.removeChangeListener(this._onChange);
  },
  
  onReturnPress(){
    this.props.navigator.pop();
  },
	render(){
    return(
	   <MyRegions/>
  	);
  },
});

 module.exports = MyRegionsContainer;