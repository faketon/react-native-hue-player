import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Slider,
  Text,
  Dimensions,
  Modal
} from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';

import images from '../config/images';
import colors from '../config/colors';
import AudioController from '../AudioController';
import styles from './styles/AudioControls.style';

const {width, height} = Dimensions.get('window');

class AudioControls extends Component {

  state = {
    modalVisible: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  static defaultProps = {
    ...Component.defaultProps,

    //SKIP SECONDS
    hasButtonSkipSeconds: false,
    timeToSkip: 15,

    //THUMBNAIL
    thumbnailSize: {
      width: 170,
      height: 170,
      borderRadius: 170 / 2
    },

    //SOUND
    titleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.default
    },
    authorStyle: {
      fontSize: 18,
      color: colors.default
    },

    //COLORS
    activeColor: colors.white,
    inactiveColor: colors.grey,

    //BUTTONS
    activeButtonColor: null,
    inactiveButtonColor: null,

    //SLIDER
    sliderMinimumTrackTintColor: colors.greenSlider,
    sliderMaximumTrackTintColor: null,
    sliderThumbTintColor: colors.default,
    sliderTimeStyle: {
      fontSize: 14,
      color: colors.white
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      duration: 0,
      currentTime: 0,
      currentAudio: {},
      isReady: true,
      isPlaying: false
    };
  }

  componentWillMount() {
    const {playlist, initialTrack} = this.props;
    AudioController.init(playlist, initialTrack, this.onChangeStatus, this.updateCurrentTime);
  }

  onChangeStatus = (status) => {
    switch (status) {
      case AudioController.status.PLAYING:
        this.setState({isPlaying: true});
        break;
      case AudioController.status.PAUSED:
        this.setState({isPlaying: false});
        break;
      case AudioController.status.STOPPED:
        this.setState({isPlaying: false});
        break;
      case AudioController.status.LOADED:
        AudioController.getDuration((seconds) => {
          this.setState({duration: seconds});
        });
        this.setState({currentAudio: AudioController.currentAudio});
        break;
      case AudioController.status.ERROR:
        console.log('Status Error');
        break;
      default:
        return;
    }
  }

  updateCurrentTime = (seconds) => {
    this.setState({currentTime: seconds});
  }


  renderPlayerIconResize() {
    const {isPlaying} = this.state;
    if (isPlaying) {
      return (<TouchableOpacity onPress={() => AudioController.pause()}>
        <Image source={images.iconPause} style={[
            styles.playButtonResize, {
              tintColor: this.props.activeButtonColor || this.props.activeColor
            }
          ]}/>
      </TouchableOpacity >);
    }

    return (<TouchableOpacity onPress={() => AudioController.play()}>
      <Image source={images.iconPlay} style={[
          styles.playButtonResize, {
            tintColor: this.props.activeButtonColor || this.props.activeColor
          }
        ]}/>
    </TouchableOpacity >);
  }

  renderPlayerIcon() {
    const {isPlaying} = this.state;
    if (isPlaying) {
      return (<TouchableOpacity onPress={() => AudioController.pause()}>
        <Image source={images.iconPause} style={[
            styles.playButton, {
              tintColor: this.props.activeButtonColor || this.props.activeColor
            }
          ]}/>
      </TouchableOpacity >);
    }

    return (<TouchableOpacity onPress={() => AudioController.play()}>
      <Image source={images.iconPlay} style={[
          styles.playButton, {
            tintColor: this.props.activeButtonColor || this.props.activeColor
          }
        ]}/>
    </TouchableOpacity >);
  }

  renderNextIcon() {
    if (AudioController.hasNext()) {
      return (<TouchableOpacity onPress={() => AudioController.playNext()}>
        <Image source={images.iconNext} style={[
            styles.controlButton, {
              tintColor: this.props.activeButtonColor || this.props.activeColor
            }
          ]}/>
      </TouchableOpacity>);
    }
    return (<Image source={images.iconNext} style={[
        styles.controlButton, {
          tintColor: this.props.inactiveButtonColor || this.props.inactiveColor
        }
      ]}/>);
  }

  renderPreviousIcon() {
    if (AudioController.hasPrevious()) {
      return (<TouchableOpacity onPress={() => AudioController.playPrevious()}>
        <Image source={images.iconPrevious} style={[
            styles.controlButton, {
              tintColor: this.props.activeButtonColor || this.props.activeColor
            }
          ]}/>
      </TouchableOpacity>);
    }
    return (<Image source={images.iconPrevious} style={[
        styles.controlButton, {
          tintColor: this.props.inactiveButtonColor || this.props.inactiveColor
        }
      ]}/>);
  }

  renderSkipbackwardIcon() {
    if (!this.props.hasButtonSkipSeconds)
      return;
    return (<TouchableOpacity onPress={() => {
        AudioController.seekToForward(-this.props.timeToSkip);
      }}>
      <Image source={images.skipBackward} style={[
          styles.controlButton, {
            tintColor: this.props.activeButtonColor || this.props.activeColor
          }
        ]}/>
    </TouchableOpacity>);
  }

  renderSkipforwardIcon() {
    if (!this.props.hasButtonSkipSeconds)
      return;
    return (<TouchableOpacity onPress={() => {
        AudioController.seekToForward(this.props.timeToSkip);
      }}>
      <Image source={images.skipForward} style={[
          styles.controlButton, {
            tintColor: this.props.activeButtonColor || this.props.activeColor
          }
        ]}/>
    </TouchableOpacity>);
  }

  renderRadioMini() {
    const {currentTime, duration, currentAudio} = this.state;
    return ( <View style={styles.containerResize}>
      <View style={{flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
      <TouchableOpacity activeOpacity={0.8} hitSlop={{
          top: 20,
          bottom: 20,
          left: 50,
          right: 50
        }}
        onPress={() => {
          this.setModalVisible(!this.state.modalVisible);
        }}>
            <Image source={require('../../../src/images/icon_arrow_up.png')}/>
      </TouchableOpacity>

        <Image source={currentAudio.thumbnailUri
            ? {
              uri: currentAudio.thumbnailUri
            }
            : currentAudio.thumbnailLocal} style={{width: 48, height: 48, borderRadius: 48/2}}/>
          </View>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', paddingTop: 30,  paddingLeft: 20, paddingRight: 20, paddingBottom: 20}}>
              <Text style={styles.titleStyleResize}>{currentAudio.title}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text numberOfLines={1} style={styles.contentStyle}>14.00-17.00 / Thu-Fri</Text>
                <TouchableOpacity activeOpacity={0.8} hitSlop={{
                    top: 20,
                    bottom: 20,
                    left: 50,
                    right: 50
                  }} style={styles.buttonLiveResize}>
                  <Image source={require('../../../src/images/icon_live.png')}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              {this.renderSkipbackwardIcon()}
              {/* {this.renderPreviousIcon()} */}
              {this.renderPlayerIconResize()}
              {/* {this.renderNextIcon()} */}
              {this.renderSkipforwardIcon()}
            </View>
      </View>
    )
  }

  renderRadio() {
    const {currentTime, duration, currentAudio} = this.state;
    return (<ImageBackground source={require('../../../src/images/bg.png')} style={styles.backgroundImage}>
      <View style={styles.navigation}>
        <TouchableOpacity activeOpacity={0.8} hitSlop={{
            top: 20,
            bottom: 20,
            left: 50,
            right: 50
          }}    onPress={() => {
               this.setModalVisible(!this.state.modalVisible);
             }} style={styles.buttonLeft}>
          <Image source={require('../../../src/images/icon_arrow_down.png')}/>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} hitSlop={{
            top: 20,
            bottom: 20,
            left: 50,
            right: 50
          }} style={styles.buttonLive}>
          <Image source={require('../../../src/images/icon_live.png')}/>
        </TouchableOpacity>
        <Image source={currentAudio.thumbnailUri
            ? {
              uri: currentAudio.thumbnailUri
            }
            : currentAudio.thumbnailLocal} style={this.props.thumbnailSize}/>
        <View style={styles.detailContainer}>
          <Text style={this.props.titleStyle}>{currentAudio.title}</Text>
          {/* <Text style={this.props.authorStyle}>{currentAudio.author}</Text> */}
          <Text style={styles.contentStyle}>Lorem ipsum dolor sit amet.{"\n"}Lorem ipsum dolor sit amet.</Text>
        </View>
        <View style={styles.buttonsContainer}>
          {this.renderSkipbackwardIcon()}
          {/* {this.renderPreviousIcon()} */}
          {this.renderPlayerIcon()}
          {/* {this.renderNextIcon()} */}
          {this.renderSkipforwardIcon()}
        </View>
        <View style={styles.playbackContainer}>
          {/* <Text numberOfLines={1} style={this.props.sliderTimeStyle}>
                        {currentTime ? moment(currentTime * 1000).format('mm:ss') : '00:00'}
                  </Text> */
          }
          <Slider value={currentTime} maximumValue={duration} style={styles.playbackBar} minimumTrackTintColor={this.props.sliderMinimumTrackTintColor || this.props.activeColor} maximumTrackTintColor={this.props.sliderMaximumTrackTintColor || this.props.inactiveColor} thumbTintColor={this.props.sliderThumbTintColor || this.props.activeColor} thumbImage={require('../../../src/images/icon_volume.png')} onSlidingComplete={seconds => {
              AudioController.seek(seconds);
              if (seconds < duration)
                AudioController.play();
              }} onValueChange={() => AudioController.clearCurrentTimeListener()}/> {/* <Text numberOfLines={1} style={this.props.sliderTimeStyle}>
                        {duration ? moment(duration * 1000).format('mm:ss') : '00:00'}
                  </Text> */
          }
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity activeOpacity={0.8}><Image source={require('../../../src/images/icon_video.png')}/></TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}><Image source={require('../../../src/images/icon_speech_bubble.png')}/></TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}><Image source={require('../../../src/images/icon_heart.png')}/></TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}><Image source={require('../../../src/images/icon_share.png')}/></TouchableOpacity>
        </View>
      </View>
    </ImageBackground>)
  }

  render() {
    const {currentTime, duration, currentAudio} = this.state;
    return (<View style={styles.flex}>
      {/* {this.renderRadio()} */}
      {/* {this.renderRadioMini()} */}
       <Modal
         animationType="slide"
         transparent={false}
         visible={false}
         onRequestClose={() => {
           alert('Modal has been closed.');
         }}>
               {this.renderRadio()}
       </Modal>

       <TouchableOpacity
         onPress={() => {
           this.setModalVisible(true);
         }}>
           {this.renderRadioMini()}
       </TouchableOpacity>

    </View>);
  }
}

export default AudioControls;

