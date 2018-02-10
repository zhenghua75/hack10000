'use strict';

import React, {
	StyleSheet, 
	PropTypes, 
	View, 
	Text,
	Animated,
	Platform,
	Dimensions,
	PickerIOS
} from 'react-native';

import PickerAndroid from 'react-native-picker-android';

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let PickerItem = Picker.Item;
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

export default class PickerRegion extends React.Component {

	static propTypes = {
		pickerBtnText: PropTypes.string,
		pickerCancelBtnText: PropTypes.string,
		pickerBtnStyle: PropTypes.any,
		pickerTitle: PropTypes.string,
		pickerTitleStyle: PropTypes.any,
		pickerToolBarStyle: PropTypes.any,
		pickerItemStyle: PropTypes.any,
		pickerHeight: PropTypes.number,
		showDuration: PropTypes.number,

		pickerData: PropTypes.any.isRequired,
		firstPickedData:PropTypes.any.isRequired,
		secondPickedData:PropTypes.any.isRequired,
		thirdPickedData:PropTypes.any.isRequired,

		onPickerDone: PropTypes.func,
		onPickerCancel: PropTypes.func,
	};

	static defaultProps = {
		pickerBtnText: '完成',
		pickerCancelBtnText: '取消',
		pickerHeight: 250,
		showDuration: 300,
		onPickerDone: ()=>{},
		onPickerCancel: ()=>{}
	};

	constructor(props, context){
		super(props, context);
	}

	componentWillMount(){
		this.state = this._getStateFromProps(this.props);
	}

	componentWillReceiveProps(newProps){
		let newState = this._getStateFromProps(newProps);
		this.setState(newState);
	}

	shouldComponentUpdate(nextProps, nextState, context){
		if(nextState.pickerData.length === 0){
			return false;
		}
		return true;
	}

	_getStateFromProps(props){
		let pickerBtnText = props.pickerBtnText;
		let pickerCancelBtnText = props.pickerCancelBtnText;
		let pickerBtnStyle = props.pickerBtnStyle;
		let pickerTitle = props.pickerTitle;
		let pickerTitleStyle = props.pickerTitleStyle;
		let pickerToolBarStyle = props.pickerToolBarStyle;
		let pickerItemStyle = props.pickerItemStyle;
		let pickerHeight = props.pickerHeight;
		let showDuration = props.showDuration;
		let pickerData = props.pickerData;
		let selectedValue = props.selectedValue;
		let onPickerDone = props.onPickerDone;
		let onPickerCancel = props.onPickerCancel;

		let firstPickedData = props.firstPickedData;
		let secondPickedData = props.secondPickedData;
		let thirdPickedData = props.thirdPickedData;

		let slideAnim = (this.state && this.state.slideAnim ? this.state.slideAnim : new Animated.Value(-props.pickerHeight));
		
		let firstWheelData = pickerData.filter(function(region){return region.level === 1;}); 
		let secondWheelData = pickerData.filter(function(region){return region.level === 2 && region.upid===secondPickedData.id;});
		let thirdWheelData = pickerData.filter(function(region){return region.level === 3 && region.upid===thirdPickedData.id;});

		return {
			pickerBtnText,
			pickerCancelBtnText,
			pickerBtnStyle,
			pickerTitle,
			pickerTitleStyle,
			pickerToolBarStyle,
			pickerItemStyle,
			pickerHeight,
			showDuration,
			pickerData,
			onPickerDone,
			onPickerCancel,
			slideAnim,

			firstWheelData,
			secondWheelData,
			thirdWheelData,

			firstPickedData,
			secondPickedData,
			thirdPickedData,
		};
	}

	_slideUp(){
		this.isMoving = true;
		Animated.timing(
			this.state.slideAnim,
			{
				toValue: 0,
				duration: this.state.showDuration,
			}
		).start((evt) => {
			if(evt.finished) {
				this.isMoving = false;
				this.isPickerShow = true;
			}
		});
	}

	_slideDown(){
		this.isMoving = true;
		Animated.timing(
			this.state.slideAnim,
			{
				toValue: -this.state.pickerHeight,
				duration: this.state.showDuration,
			}
		).start((evt) => {
			if(evt.finished) {
				this.isMoving = false;
				this.isPickerShow = false;
			}
		});
	}

	_toggle(){
		if(this.isMoving) {
			return;
		}
		if(this.isPickerShow) {
			this._slideDown();
		}
		else{
			this._slideUp();
		}
	}
	//向父组件提供方法
	toggle(){
		this._toggle();
	}

	_prePressHandle(callback){
		//通知子组件往上滚
		this.pickerWheel.moveUp();
	}

	_nextPressHandle(callback){
		//通知子组件往下滚
		this.pickerWheel.moveDown();
	}

	_pickerCancel() {
		this._toggle();
		this.state.onPickerCancel();
	}

	_pickerFinish(){
		this._toggle();
		this.state.onPickerDone({
			firstPickedData:this.state.firstPickedData,
			secondPickedData:this.state.secondPickedData,
			thirdPickedData:this.state.thirdPickedData,
		});
	}

	_renderWheel(pickerData){
		let me = this;
		let thirdWheel = me.state.thirdWheelData && (
			<View style={styles.pickerWheel}>
				<Picker
					ref={'thirdWheel'}
					selectedValue={me.state.thirdPickedData}
					onValueChange={(value) => {
						me.setState({
							thirdPickedData: value
						});
					}} >
					{me.state.thirdWheelData.map((value, index) => (
						<PickerItem
							key={'thirdWheel-item-'+index}
							value={value}
							label={value.name}/>)
					)}
				</Picker>
			</View>
		);

		return (
			<View style={styles.pickerWrap}>
				<View style={styles.pickerWheel}>
					<Picker
						ref={'firstWheel'}
						selectedValue={me.state.firstPickedData}
						onValueChange={(value) => {
							let secondWheelData = pickerData.filter(function(region){return region.level === 2 && region.upid===value.id;});
							let secondPickedData = secondWheelData[0];
							let thirdWheelData = pickerData.filter(function(region){return region.level === 3 && region.upid===secondPickedData.id;});
							let thirdPickedData = thirdWheelData[0];
							me.setState({
								firstPickedData:value,
								secondPickedData:secondPickedData,
								thirdPickedData:thirdPickedData,
								secondWheelData: secondWheelData,
								thirdWheelData: thirdWheelData,
							});
							me.refs.secondWheel && me.refs.secondWheel.moveTo && me.refs.secondWheel.moveTo(0);
							me.refs.thirdWheel && me.refs.thirdWheel.moveTo && me.refs.thirdWheel.moveTo(0);
						}} >
						{me.state.firstWheelData.map((value, index) => (
							<PickerItem
								key={'firstWheel-item-'+index}
								value={value}
								label={value.name}/>)
						)}
					</Picker>
				</View>
				<View style={styles.pickerWheel}>
					<Picker
						ref={'secondWheel'}
						selectedValue={me.state.secondPickedData}
						onValueChange={(value) => {
							let thirdWheelData = pickerData.filter(function(region){return region.level === 3 && region.upid===value.id;});
							let thirdPickedData = thirdWheelData[0];
							me.setState({
								thirdWheelData:thirdWheelData,
								thirdPickedData:thirdPickedData,
							});
							me.refs.thirdWheel && me.refs.thirdWheel.moveTo && me.refs.thirdWheel.moveTo(0);
						}} >
						{me.state.secondWheelData.map((value, index) => (
							<PickerItem
								key={'secondWheel-item-'+index}
								value={value}
								label={value.name}/>)
						)}
					</Picker>
				</View>
				{thirdWheel}
			</View>
		);
	}
	
	render(){
		/*let pickerBtn = Platform.OS === 'ios' ? null : (
			<View style={styles.pickerBtnView}>
				<Text style={styles.pickerMoveBtn} onPress={this._prePressHandle.bind(this)}>上一个</Text>
				<Text style={styles.pickerMoveBtn} onPress={this._nextPressHandle.bind(this)}>下一个</Text>
			</View>
		);*/
		// let pickerBtn = null;
		console.log('this.props.pickerData',this.props.pickerData);
		return (
			<Animated.View style={[styles.picker, {
				height: this.state.pickerHeight,
				bottom: this.state.slideAnim
			}]}>
				<View style={[styles.pickerToolbar, this.state.pickerToolBarStyle]}>
					<View style={styles.pickerCancelBtn}>
						<Text style={[styles.pickerFinishBtnText, this.state.pickerBtnStyle]}
							onPress={this._pickerCancel.bind(this)}>{this.state.pickerCancelBtnText}</Text>
					</View>
					<Text style={[styles.pickerTitle, this.state.pickerTitleStyle]} numberOfLines={1}>
						{this.state.pickerTitle}
					</Text>
					<View style={styles.pickerFinishBtn}>
						<Text style={[styles.pickerFinishBtnText, this.state.pickerBtnStyle]}
							onPress={this._pickerFinish.bind(this)}>{this.state.pickerBtnText}</Text>
					</View>
				</View>
				<View style={styles.pickerWrap}>
					{this.state.pickerData.length>0?this._renderWheel(this.state.pickerData):<View></View>}
				</View>
			</Animated.View>
		);
	}
};

let styles = StyleSheet.create({
	picker: {
		width: width,
		position: 'absolute',
		bottom: 0,
		left: 0,
		backgroundColor: '#bdc0c7',
		overflow: 'hidden'
	},
	pickerWrap: {
		width: width,
		flexDirection: 'row'
	},
	pickerWheel: {
		flex: 1
	},
	pickerToolbar: {
		height: 30,
		width: width,
		backgroundColor: '#e6e6e6',
		flexDirection: 'row',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#c3c3c3',
		alignItems: 'center'
	},
	pickerBtnView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	pickerMoveBtn: {
		color: '#149be0',
		fontSize: 16,
		marginLeft: 20
	},
	pickerCancelBtn: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginLeft: 20
	},
	pickerTitle: {
		flex: 4,
		color: 'black',
		textAlign: 'center'
	},
	pickerFinishBtn: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginRight: 20
	},
	pickerFinishBtnText: {
		fontSize: 16,
		color: '#149be0'
	}
});
