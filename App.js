
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import AppHeader from './components/Header'
import LoginForm from './components/LoginForm'
import WalletList from './components/WalletList'
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import { StackNavigator, } from 'react-navigation';

const App = 

      StackNavigator({ 
        Home: { screen: LoginForm }, 
        Wallet: { screen: WalletList }, 
        
      },{
        headerMode: 'none' 
      })

export default App;
