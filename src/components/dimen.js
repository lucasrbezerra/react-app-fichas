import { Dimensions } from 'react-native';
import {
    widthPercentageToDP as wp2dp,
    heightPercentageToDP as hp2dp,
  } from 'react-native-responsive-screen';



export function ResponsiveHeigth(){
    const Height = Dimensions.get('screen').height;
    return Height;
};

export function ResponsiveWidth(){
    const Width =  Dimensions.get('screen').width;
    return Width;
};

/**
 * @param dimension
 * @returns {string} 
 */
export const wp = dimension => {
    return wp2dp((dimension / ResponsiveWidth()) * 100 + '%');
};
  
  /**
   * @param dimension 
   * @returns {string} 
   */
  export const hp = dimension => {
    return hp2dp((dimension / ResponsiveHeigth()) * 100 + '%');
};
  