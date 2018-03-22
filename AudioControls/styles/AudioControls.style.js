import {Dimensions, Platform, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  //----------  ----------//
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  detailContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginVertical: 10
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
  playbackContainer: {
    flexDirection: 'row'
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  playbackBar: {
    flex: 1
  },
  playButton: {
    width: 80,
    height: 80
  },
  controlButton: {
    width: 20,
    height: 20,
    margin: 5
  },
  buttonLeft: {
    position: 'absolute',
    top: 20,
    left: 20
  },
  buttonLive: {
    marginBottom: 20
  },
  buttonGroup: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10
  },
  contentStyle: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    paddingTop: 5
  }
});
