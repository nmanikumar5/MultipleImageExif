import React, {Fragment, Component} from 'react';
import {isEmpty, cloneDeep} from 'lodash';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ImagePicker from 'react-native-image-crop-picker';
import Exif from 'react-native-exif';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  chooseImage = async () => {
    const options = {
      multiple: true,
      includeExif: true,
      includeBase64: true,
      avoidEmptySpaceAroundImage: true,
      mediaType: 'photo',
      writeTempFile: true,
    };
    ImagePicker.openPicker(options).then(images => {
      const oldImages = cloneDeep(this.state.images);
      let finalImages = oldImages;

      images.forEach(async (eachImg, idx) => {
        const gpsData = await Exif.getLatLong(eachImg.path);
        const eachObj = {
          path: eachImg.path,
          data: eachImg.data,
          lat: await gpsData.latitude,
          long: await gpsData.longitude,
        };
        await finalImages.push(eachObj);
      });

      this.setState(
        {
          images: finalImages, //.concat(...prevState.images),
        },
        () => {
          // console.log('finaImages: ', this.state.images);
        },
      );
    });
  };

  render() {
    const {images} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView style={styles.scrollView}>
            <View style={styles.body}>
              <View style={styles.btnParentSection}>
                <TouchableOpacity
                  onPress={this.chooseImage}
                  style={styles.btnSection}>
                  <Text style={styles.btnText}>Choose File</Text>
                </TouchableOpacity>
                <ScrollView horizontal={true}>
                  <View style={styles.ImageSections}>
                    {!isEmpty(images) &&
                      images.map((eachImage, idx) => {
                        return (
                          <View
                            key={`eachImageView${idx}`}
                            style={styles.eachImage}>
                            <Image
                              key={idx}
                              source={{
                                uri: eachImage.path,
                              }}
                              style={styles.images}
                            />
                            {/* <Text
                              key={`dateTime${idx}`}
                              style={styles.imageDataTxt}>
                              {`Date & Time: ${eachImage?.exif['{Exif}'].DateTimeOriginal}`}
                            </Text>
                            <Text
                              key={`model${idx}`}
                              style={styles.imageDataTxt}
                              s>
                              {`Model: ${eachImage?.exif['{TIFF}'].Model}`}
                            </Text> */}
                            <Text
                              key={`longitude${idx}`}
                              style={styles.imageDataTxt}>
                              {`Latitude: ${eachImage?.lat}`}
                            </Text>
                            <Text
                              key={`latitude${idx}`}
                              style={styles.imageDataTxt}>
                              {`Longitude: ${eachImage?.long}`}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  eachImage: {
    margin: 10,
  },
  imageDataTxt: {
    textAlign: 'center',
  },
  body: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('screen').height - 85,
    width: Dimensions.get('screen').width,
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
