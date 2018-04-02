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
import {
  Header,
  Button,
  Left,
  Right,
  Body,
  Title
} from 'native-base';
import moment from 'moment';
import 'moment/locale/pt-br';

import images from '../config/images';
import colors from '../config/colors';
import AudioController from '../AudioController';
import Video from 'react-native-video';
import styles from './styles/AudioControls.style';
import * as Animatable from 'react-native-animatable';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('window');

class AudioControls extends Component {

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
      isVideo:false,
      typeScene:0,
      modalVisible: false,
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

  onStatusHeader(){
    return 'hidetop'
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
      </TouchableOpacity>);
    }

    return (<TouchableOpacity onPress={() => AudioController.play()}>
      <Image source={images.iconPlay} style={[
          styles.playButtonResize, {
            tintColor: this.props.activeButtonColor || this.props.activeColor
          }
        ]}/>
    </TouchableOpacity>);
  }

  renderPlayerTrackIcon() {
    const {isPlaying} = this.state;
    if (isPlaying) {
      return (<TouchableOpacity onPress={() => AudioController.pause()}>
        <Image source={require('../../../src/images/icon_play_at.png')}/>
      </TouchableOpacity>);
    }

    return (<TouchableOpacity onPress={() => AudioController.play()}>
      <Image source={require('../../../src/images/icon_play.png')}/>
    </TouchableOpacity>);
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
      </TouchableOpacity>);
    }

    return (<TouchableOpacity onPress={() => AudioController.play()}>
      <Image source={images.iconPlay} style={[
          styles.playButton, {
            tintColor: this.props.activeButtonColor || this.props.activeColor
          }
        ]}/>
    </TouchableOpacity>);
  }

  renderNextIcon() {
    if (AudioController.hasNext()) {
      return (<TouchableOpacity onPress={() => AudioController.playNext()}>
          <Image source={require('../../../src/images/icon_next_at.png')} style={styles.controlExtraButton}/>
      </TouchableOpacity>);
    }
    return (  <Image source={require('../../../src/images/icon_next_at.png')} style={styles.controlExtraButton}/>);
  }

  renderPreviousIcon() {
    if (AudioController.hasPrevious()) {
      return (<TouchableOpacity onPress={() => AudioController.playPrevious()}>
          <Image source={require('../../../src/images/icon_previous_at.png')} style={styles.controlExtraButton}/>
      </TouchableOpacity>);
    }
    return (<Image source={require('../../../src/images/icon_previous_at.png')} style={styles.controlExtraButton}/>);
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

  renderShuffleIcon() {
    return (<TouchableOpacity onPress={() => AudioController.playNext()}>
      <Image source={require('../../../src/images/icon_shuffle.png')} style={styles.controlExtraButton}/>
    </TouchableOpacity>)
  }

  renderRepeatIcon() {
    return (<TouchableOpacity onPress={() => AudioController.playNext()}>
      <Image source={require('../../../src/images/icon_repeat.png')} style={styles.controlExtraButton}/>
    </TouchableOpacity>)
  }

  renderVideo(){
    return(<View style={styles.videoContainer}>
      <Video source={{uri: 'http://www.podcastgenerator.net/demoV2/pg/media/2016-08-13_video3dprinters.mp4'}}   // Can be a URL or a local file.
           ref={(ref) => {
             this.player = ref
           }}                                      // Store reference
           rate={1.0}                              // 0 is paused, 1 is normal.
           volume={1.0}                            // 0 is muted, 1 is normal.
           muted={false}                           // Mutes the audio entirely.
           paused={false}                          // Pauses playback entirely.
           resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
           repeat={true}                           // Repeat forever.
           playInBackground={false}                // Audio continues to play when app entering background.
           playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
           ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
           progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
           style={styles.videoStyle}/>
    </View>

    )
  }

  renderTrack() {
    const {currentTime, duration, currentAudio} = this.state;
    return (<View>
      <View style={styles.center}>
        <View style={styles.playbackContainer}>
          <Slider value={currentTime} maximumValue={duration}
            style={styles.playbackBar}
            minimumTrackTintColor={this.props.sliderMinimumTrackTintColor || this.props.activeColor}
             maximumTrackTintColor={this.props.sliderMaximumTrackTintColor || this.props.inactiveColor}
             thumbTintColor={this.props.sliderThumbTintColor || this.props.activeColor}
             onSlidingComplete={seconds => {
              AudioController.seek(seconds);
              if (seconds < duration)
                AudioController.play();
              }} onValueChange={() => AudioController.clearCurrentTimeListener()}/>
        </View>
        <View style={styles.buttonsContainer}>
          {this.renderShuffleIcon()}
          {this.renderSkipbackwardIcon()}
          {this.renderPreviousIcon()}
          {this.renderPlayerTrackIcon()}
          {this.renderNextIcon()}
          {this.renderSkipforwardIcon()}
          {this.renderRepeatIcon()}
        </View>
      </View>
    </View>)
  }

  renderRadioMini() {
    const {currentTime, duration, currentAudio} = this.state;
    return ( <View style={[styles.containerResize]}>
        <View style={styles.detailLeft}>
          <TouchableOpacity activeOpacity={0.8} hitSlop={{
              top: 20,
              bottom: 20,
              left: 50,
              right: 50
            }}
            onPress={() => {
              Actions.refresh({action:{
                    from:'/player',
                    to:'/player/',
                    type:'hideHeader',
                    refresh:Math.random()
                }})
              this.setState({typeScene:1})
            }}>
                <Image source={require('../../../src/images/icon_arrow_up.png')}/>
          </TouchableOpacity>
          <Image source={currentAudio.thumbnailUri
              ? {
                uri: currentAudio.thumbnailUri
              }
              : currentAudio.thumbnailLocal} style={{width: 48, height: 48, borderRadius: 48/2}}/>
        </View>
        <View style={styles.detailCenter}>
          <Text style={styles.titleStyleResize}>{currentAudio.title}</Text>
            <View style={styles.detailCenterSub}>
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
        <View style={styles.center}>
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
      {/* <View style={styles.navigation}>
        <TouchableOpacity activeOpacity={0.8} hitSlop={{
            top: 20,
            bottom: 20,
            left: 50,
            right: 50
          }}
          style={styles.buttonLeft}
          onPress={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
              <Image source={require('../../../src/images/icon_arrow_down.png')}/>
        </TouchableOpacity>

      </View> */}

      <Header style={styles.header}>
        <Left style={styles.flex}>
          <Button style={styles.transparent} onPress={() => {
            Actions.refresh({action:{
                  from:'/player',
                  to:'/player/',
                  type:'showHeader',
                  refresh:Math.random()
              }})
              this.setState({typeScene:0})
            }}>
            <Image source={require('../../../src/images/icon_arrow_down.png')}/>
          </Button>
        </Left>
        <Body style={styles.navigationTitle}>
          <Title style={styles.title}></Title>
        </Body>
        <Right style={styles.flex}>
        </Right>
      </Header>

      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} hitSlop={{
            top: 20,
            bottom: 20,
            left: 50,
            right: 50
          }} style={styles.buttonLive}>
          <Image source={require('../../../src/images/icon_live.png')}/>
        </TouchableOpacity>

        {
          this.state.isVideo == false ?
          <View style={this.props.thumbnailSize}>
            <Image source={currentAudio.thumbnailUri
                ? {
                  uri: currentAudio.thumbnailUri
                }
                : currentAudio.thumbnailLocal} style={this.props.thumbnailSize}/>
          </View>
          :
          this.state.isVideo == true ?
          <View style={styles.videoContent}>
            {this.renderVideo()}
          </View>
          :
          <View/>

        }
        {/* <View style={styles.videoContent}>
          {this.renderVideo()}
        </View> */}
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
          <Slider value={currentTime} maximumValue={duration}
            style={styles.playbackBar}
            minimumTrackTintColor={this.props.sliderMinimumTrackTintColor || this.props.activeColor}
             maximumTrackTintColor={this.props.sliderMaximumTrackTintColor || this.props.inactiveColor}
             thumbTintColor={this.props.sliderThumbTintColor || this.props.activeColor}
             onSlidingComplete={seconds => {
              AudioController.seek(seconds);
              if (seconds < duration)
                AudioController.play();
              }} onValueChange={() => AudioController.clearCurrentTimeListener()}/>
              {/* <Text numberOfLines={1} style={this.props.sliderTimeStyle}>
                        {duration ? moment(duration * 1000).format('mm:ss') : '00:00'}
                  </Text> */
              }
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity activeOpacity={0.8} onPress={()=> this.setState({isVideo:!this.state.isVideo})}>
            <Image source={require('../../../src/images/icon_video.png')}/>
          </TouchableOpacity>
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
      {/* {this.renderTrack()} */}
      {
        this.state.typeScene == 1 ?
        <View style={{flex:1}}>
          {this.renderRadio()}
        </View>
        :
        this.state.typeScene == 0 ?
        <View style={{flex:1}}>
          {this.renderRadioMini()}
        </View>
        :
        <View/>
      }

    </View>);
  }
}
const mapStateToProps = state => {

  return {

  };
};

export default connect(mapStateToProps, null)(AudioControls);
