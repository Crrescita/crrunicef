import React, { FC, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, NativeModules, Platform } from 'react-native';
import { useNavigation, RouteProp, useRoute, } from "@react-navigation/native";
import { RootNavigationProp } from '../../../App';
import { MyScreen, Header } from '../../components';
import DynamicDetailIssueForms from './DynamicDetailIssueForms';
import { API_URL } from "../../utils/constant";
import axios from 'axios';
import { Colors } from '../../config/colors';
import { RootStackParamList } from '../../../src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';


type issueRoute = RouteProp<RootStackParamList, "IssuesFormScreen">;
type Props = Record<never, string>;
const IssuesFormScreen: FC<Props> = ({ }: Props) => {
  const navigation = useNavigation<RootNavigationProp>();
  const baseUrl = API_URL.BASE_URL_DEV;
  const [data, setData] = useState([]);
  const route = useRoute<issueRoute>();
  const fs_id = route?.params?.id;

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
    axios.get(`${baseUrl}/general/getIssueslSymtom?fs_id=${fs_id}`, await getHeader()).then((response) => {
      setData(response.data.data);
      console.log(response.data.data);
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
            header='Symptoms' />
          <ScrollView>
            <DynamicDetailIssueForms formData={data} />
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

export default IssuesFormScreen;