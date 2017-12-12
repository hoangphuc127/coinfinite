import React, { Component } from 'react';
import { View, Alert, TouchableHighlight, StyleSheet, Modal, AsyncStorage } from 'react-native'
import Wallet from './Wallet'
import { Container, Button, Text, Content, Fab, Icon, Picker,
  Body,Form, Item, Label, Input, CheckBox,ListItem } from 'native-base';
import host from '../config/config'

class List extends Component {
  render(){
    const wallets = Array.from(this.props.wallet);
    const list = wallets.filter(j => j.active).map((i,index) => 
       (
      <Wallet id={i._id.toString()} 
      key={i.name.toString()} 
      name={i.name.toString()} 
      money={i.cash.currency.toString()} 
      unit={i.cash.unit.toString()} 
      index={index}
      onDelete={(id,i)=>this.props.onDelete(id,i)}/>
    ))
    return <Content>{list}</Content>
  }
  
}


export default class WalletList extends Component {

  static navigationOptions = { title: 'Wallet', };
  constructor(props) {
    super(props);
    this.state = {
      wallets: [],
      modalVisible: false,
      active: false,
      unit:'usd',
      name:'',
      currency:'',
    }
  }
   async fetchWallet() {
    var token = await AsyncStorage.getItem('token');
    fetch(host + '/wallets/all', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      params:{
        page:'2',
      }
    }).then(response => {
      if (response.status >= 400) Alert.alert("Network Error! Please try again!");
      return response.json()
    }).then((json) => {
      this.setState({
        wallets: json
      })
    })
  }
  componentDidMount() {
    this.fetchWallet();
  }
  setModalVisible(visible) { 
    this.setState({ modalVisible: visible }); 
  }
  async getToken() {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.log(error);
    }
  }
  onValueChange(value) {
    this.setState({
      unit: value
    });
  }
  async createWallet(){ 
    var token = await AsyncStorage.getItem('token');    
    fetch(host + '/wallets', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'authorization': token
      },
      body: JSON.stringify({
        cash: {
          currency:this.state.currency,
          unit:this.state.unit
        },
        name: this.state.name
      })
    }).then(response => {
      if (response.status >= 400) {Alert.alert("Network Error! Please try again!");
    ;}
      return response.json()
    }).then((json) => {
      var newWallet=this.state.wallets;
      newWallet.push(json);
      this.setState({
        wallets:newWallet
      });
      this.setModalVisible(!this.state.modalVisible);
    })
  }
  async onDeletePress(id,i){
    var token = await AsyncStorage.getItem('token');
    fetch(host + '/wallets/'+id, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
    }).then(response => {
      if (response.status >= 400) Alert.alert("Network Error! Please try again!");
      return response.json()
    }).then((json) => {
      newWallet=this.state.wallets;
      for (var j=0;j<newWallet.length;j++){
        if (newWallet[j]._id===id) {
          newWallet[j].active=false;
          this.setState({
            wallets: newWallet
          },()=>{j=newWallet.length})
        }
      }
    })  
  }
  render() {
    return (
      <Container>
        <Modal animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}
          style={{ width: '80%', height: '80%' }}>
          <View style={styles.container}>
          
        <Item floatingLabel style={styles.input}>
          <Label>Wallet name</Label>
          <Input onChangeText={(name) => this.setState({ name: name })}/>
        </Item>
          <Item floatingLabel style={styles.input}>
            <Label>Balance</Label>
            <Input onChangeText={(currency) => this.setState({ currency: currency })}/>
          </Item>
          <Picker style={{width:120,marginLeft:20,marginRight:20,}}
          placeholder="Choose Unit"
          mode="dropdown"
          selectedValue={this.state.unit}
          onValueChange={this.onValueChange.bind(this)}>
          <Item label="USD" value="USD" />
          <Item label="VND" value="VND" />
          <Item label="EURO" value="EURO" />

        </Picker>
          <ListItem>
          <CheckBox checked={this.state.active} onPress={(e)=> this.setState({active:!this.state.active})}/>
          <Label> Active</Label>
          </ListItem>
          <Item style={{alignItems:'center',justifyContent: 'center'}}>
          <Button style={styles.button} onPress={() => { this.createWallet() }}><Text>Add Wallet</Text></Button>
          <Button style={styles.button} onPress={() => { this.setModalVisible(!this.state.modalVisible) }}><Text>Cancel</Text></Button>
          </Item>
          </View>
        </Modal>
        <List wallet={this.state.wallets} onDelete={(id,i) => this.onDeletePress(id,i)}/>
        <Fab
          active={true}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={() => this.setModalVisible(true)}>
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}
var styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    justifyContent: 'center', 
  } ,
  input:{
    marginLeft:20,
    marginRight:20,
  },
  button:{
    width:150,
    marginLeft:10,
    marginRight:10,
    alignItems:'center',
    justifyContent:'center'
  }
})