import React, { Component } from 'react';
import { Text, StyleSheet, Image, Alert, Keyboard, AsyncStorage, TextInput } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Button, Label, Left, Right, Body, Title, Toast,Icon } from 'native-base';
import host from '../config/config'
export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showToast: false
    };
    this.onLoginClick = this.onLoginClick.bind(this);
  }
  static navigationOptions = { 
  title: 'Login',
  header: null  
  };
  render() {
    return (
      <Container style={styles.container}>
        <Image source={(require('../image/logo.png'))} style={styles.logo} resizeMode='contain' />
        <Container style={styles.content}>
          <Form>
            <Item style={{marginRight:15,marginTop:5,marginBottom:5,backgroundColor:'white'}}>
                <Icon style={{marginLeft:5}} active name='md-person' />
              <Input style={styles.input} placeholder="Username" onChangeText={(username) => this.setState({ username: username })} />
            </Item>
            <Item style={{marginRight:15,marginTop:5,marginBottom:5, backgroundColor:'white'}}>
            <Icon style={{marginLeft:5}} active name='md-key' />
            
              <Input style={styles.input} placeholder="Password"  onChangeText={(password) => this.setState({ password: password })} secureTextEntry />
            </Item>
            <Button full style={styles.btn} onPress={this.onLoginClick}><Text style={styles.button}>Login</Text></Button>
            
          </Form>

        </Container>
      </Container>
    );
  }
onLoginClick() {
    Keyboard.dismiss();
    fetch(host + '/oauth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    }).then(response => {
      if (response.status >=400) Alert.alert("Error!","Network Error! Please try again!",[
        {text: 'OK'},
      ]);
      return response.json()
    })
      .then(async (json) => {
        console.log(json.token);
        if (json.message) Alert.alert("Error!",json.message,[
          {text: 'OK'},
        ]);
        if (json.token){ 
          try {       
            await AsyncStorage.setItem('token', json.token,(err,value)=>{
              console.log(err);
              console.log(value);
            });
  
          } catch (error) {
              console.log(error);
          }   
          const navigation = this.props.navigation;
          navigation.navigate('Wallet')
      }
      }).catch(error => {
        Alert.alert(error.message);
      })
  }
}

const styles = StyleSheet.create({
  input: {
  },
  content: {
    flex: 2,
    justifyContent: 'center',
    marginLeft:20,
    marginRight:20,
  },
  logo: {
    flex: 1,
    alignSelf: 'stretch',
    width: undefined,
    height: undefined
  },
  btn:{
    backgroundColor:'#ECEEF1',
    marginRight:15,marginLeft:15,marginTop:15,marginBottom:5
  },
  button: {
    color:'#26AE90',
    marginLeft:30,
    marginRight:30,
    textAlign: 'center',

  },
  buttonContainer: {
    justifyContent: 'center',
    marginLeft:20,
    marginRight:20,

  },
  container:{
    backgroundColor:'#26AE90',
  }
});