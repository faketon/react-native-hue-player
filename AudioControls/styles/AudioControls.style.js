import {Dimensions, Platform, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  //----------  ----------//
  flex: {
    flex: 1
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  transparent: {
    backgroundColor: 'transparent'
  },
  header: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerResize: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 72,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingLeft: 10,
    paddingRight: 10,
    position: 'absolute',
    bottom: 0
  },
  detailContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginVertical: 10
  },
  detailLeft: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  detailCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  detailCenterSub: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  navigation: {
    paddingTop: Platform.OS == 'ios' && height >= 812
      ? 0
      : 20
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null
  },
  titleStyleResize: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#50E3C2'
  },
  playbackContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  playbackBar: {
    flex: 1
  },
  playButton: {
    width: 80,
    height: 80
  },
  playButtonResize: {
    width: 60,
    height: 60
  },
  controlButton: {
    width: 20,
    height: 20,
    margin: 5
  },
  controlExtraButton: {
    margin: 20
  },
  buttonLeft: {
    // position: 'absolute',
    // top: 20,
    // left: 20,
    marginLeft: 20,
    zIndex: 1
  },
  buttonLive: {
    marginBottom: 20
  },
  buttonLiveResize: {
    marginTop: 5,
    marginLeft: 5
  },
  buttonGroup: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 10
  },
  contentStyle: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    paddingTop: 5
  },
  thumbnailResize: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2
  },
  radioStyle: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0
  },
  videoContent: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});
