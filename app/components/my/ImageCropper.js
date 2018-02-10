'use strict';

var React = require('react-native');
var {
  CameraRoll,
  Image,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  UIManager,
  View,
} = React;
var ImageEditingManager = NativeModules.ImageEditingManager;
var RCTScrollViewConsts = UIManager.RCTScrollView.Constants;

var PAGE_SIZE = 20;

type ImageOffset = {
  x: number;
  y: number;
};

type ImageSize = {
  width: number;
  height: number;
};

type TransformData = {
  offset: ImageOffset;
  size: ImageSize;
}

class SquareImageCropper extends React.Component {
  _isMounted: boolean;
  _transformData: TransformData;

  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      randomPhoto: null,
      measuredSize: null,//{width:150,height:150},
      croppedImageURI: null,
      cropError: null,
    };
    this._fetchRandomPhoto();
  }

  _fetchRandomPhoto() {
    CameraRoll.getPhotos(
      {first: PAGE_SIZE},
      (data) => {
        if (!this._isMounted) {
          return;
        }
        var edges = data.edges;
        var edge = edges[Math.floor(Math.random() * edges.length)];
        var randomPhoto = edge && edge.node && edge.node.image;
        if (randomPhoto) {
          this.setState({randomPhoto});
        }
      },
      (error) => undefined
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (!this.state.measuredSize) {
      return (
        <View
          style={styles.container}
          onLayout={(event) => {
            var measuredWidth = event.nativeEvent.layout.width;
            if (!measuredWidth) {
              return;
            }
            this.setState({
              measuredSize: {width: measuredWidth, height: measuredWidth},
            });
          }}/>
      );
    }

    if (!this.state.croppedImageURI) {
      return this._renderImageCropper();
    }
    return this._renderCroppedImage();
  }

  _renderImageCropper() {
    if (!this.state.randomPhoto) {
      return (
        <View style={styles.container} />
      );
    }
    var error = null;
    if (this.state.cropError) {
      error = (
        <Text>{this.state.cropError.message}</Text>
      );
    }
    return (
      <View style={styles.container}>
        <Text>Drag the image within the square to crop:</Text>
        <ImageCropper
          image={this.state.randomPhoto}
          size={this.state.measuredSize}
          style={[styles.imageCropper, this.state.measuredSize]}
          onTransformDataChange={(data) => this._transformData = data}/>

        <TouchableHighlight
          style={styles.cropButtonTouchable}
          onPress={this._crop.bind(this)}>
          <View style={styles.cropButton}>
            <Text style={styles.cropButtonLabel}>
              剪切
            </Text>
          </View>
        </TouchableHighlight>
        {error}
      </View>
    );
  }

  _renderCroppedImage() {
    return (
      <View style={styles.container}>
        <Text>Here is the cropped image:</Text>
        <Image
          source={{uri: this.state.croppedImageURI}}
          style={[styles.imageCropper, this.state.measuredSize]}/>

        <TouchableHighlight
          style={styles.cropButtonTouchable}
          onPress={this._reset.bind(this)}>
          <View style={styles.cropButton}>
            <Text style={styles.cropButtonLabel}>
              重试
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _crop() {
    console.log(this._transformData);

    ImageEditingManager.cropImage(
      this.state.randomPhoto.uri,
      this._transformData,
      (croppedImageURI) => this.setState({croppedImageURI}),
      (cropError) => this.setState({cropError})
    );
  }

  _reset() {
    this.setState({
      randomPhoto: null,
      croppedImageURI: null,
      cropError: null,
    });
    this._fetchRandomPhoto();
  }

}

class ImageCropper extends React.Component {
  _scaledImageSize: ImageSize;
  _contentOffset: ImageOffset;
  _transformData: TransformData;
  componentWillMount() {
    // Scale an image to the minimum size that is large enough to completely
    // fill the crop box.
    var widthRatio = this.props.image.width / this.props.size.width;
    var heightRatio = this.props.image.height / this.props.size.height;
    if (widthRatio < heightRatio) {
      this._scaledImageSize = {
        width: this.props.size.width,
        height: this.props.image.height / widthRatio,
      };
    } else {
      this._scaledImageSize = {
        width: this.props.image.width / heightRatio,
        height: this.props.size.height,
      };
    }
    this._contentOffset = {
      x: (this._scaledImageSize.width - this.props.size.width) / 2,
      y: (this._scaledImageSize.height - this.props.size.height) / 2,
    };
    this._updateTransformData(
      this._contentOffset,
      this._scaledImageSize,
      this.props.size
    );
  }

  _onScroll(event) {
    this._updateTransformData(
      event.nativeEvent.contentOffset,
      event.nativeEvent.contentSize,
      event.nativeEvent.layoutMeasurement
    );
  }

  _updateTransformData(offset, scaledImageSize, croppedImageSize) {
    console.log(offset,scaledImageSize,croppedImageSize);

    var offsetRatioX = offset.x / scaledImageSize.width;
    var offsetRatioY = offset.y / scaledImageSize.height;
    var sizeRatioX = croppedImageSize.width / scaledImageSize.width;
    var sizeRatioY = croppedImageSize.height / scaledImageSize.height;

    this._transformData = {
      offset: {
        x: this.props.image.width * offsetRatioX,
        y: this.props.image.height * offsetRatioY,
      },
      size: {
        width: this.props.image.width * sizeRatioX,
        height: this.props.image.height * sizeRatioY,
      },
    };
    this.props.onTransformDataChange && this.props.onTransformDataChange(this._transformData);
  }

  render() {
    var decelerationRate =
      RCTScrollViewConsts && RCTScrollViewConsts.DecelerationRate ?
        RCTScrollViewConsts.DecelerationRate.Fast :
        0;
        //{this.props.style}
    return (
      <ScrollView
        alwaysBounceVertical={true}
        automaticallyAdjustContentInsets={false}
        contentOffset={this._contentOffset}
        decelerationRate={decelerationRate}
        horizontal={true}
        maximumZoomScale={3.0}
        onMomentumScrollEnd={this._onScroll.bind(this)}
        onScrollEndDrag={this._onScroll.bind(this)}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{flex:1,backgroundColor:'red'}}
        scrollEventThrottle={16}>
        <Image source={this.props.image} style={[this._scaledImageSize,{backgroundColor:'transparent'}]}>
        <View style={{width:150,height:150,backgroundColor:'blue'}}></View>
        </Image>
      </ScrollView>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  imageCropper: {
    alignSelf: 'center',
    marginTop: 12,
  },
  cropButtonTouchable: {
    alignSelf: 'center',
    marginTop: 12,
  },
  cropButton: {
    padding: 12,
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  cropButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

module.exports = SquareImageCropper;