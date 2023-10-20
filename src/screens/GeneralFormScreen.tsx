import React, { FC, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, NativeModules, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import { MyScreen, Header } from '../components';
import DynamicForm from './DynamicForms';
import { API_URL } from "../utils/constant";
import axios from 'axios';
import { Colors } from '../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = Record<never, string>;
const { StatusBarManager } = NativeModules;
const GeneralFormScreen: FC<Props> = ({ }: Props) => {
  const navigation = useNavigation<RootNavigationProp>();
  const baseUrl = API_URL.BASE_URL_DEV;
  const [data, setData] = useState([]);
  const [token, setUserToken] = useState("");



  const getHeader = async () => {
    const value = await AsyncStorage.getItem("USER");
    let token = JSON.parse(value).token
    if (!token) {
      return {};
    }
    return {
      headers: {
        token: `${token}`,
      },
    };
  };


  const getLabels = async () => {
    await axios.get(`${baseUrl}/general/getLabels`, await getHeader())
      .then((response) => {
        setData(response.data.data.general_form);
        //console.log(response.data.data.general_form);
      }).catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getLabels();
  }, [])


  return (

    <>
      {data.length > 0 &&
        <MyScreen>
          <Header navigation={navigation} style={styles.header}
            header='General Form' />
          <ScrollView>
            <DynamicForm formData={data} />
          </ScrollView>
        </MyScreen>
      }
    </>

  );
};




const styles = StyleSheet.create({
  header: {
    paddingTop: 30
  },
  textHeadingHeader: {
    fontSize: 20,
    color: Colors.DARK_NAVY_BLUE_PRIMARY,
    fontWeight: '700',
    paddingTop: 15,
    paddingLeft: 15
  },
});

export default GeneralFormScreen;