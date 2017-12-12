import React, { Component } from 'react';
import { Image, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import { Left, Right, Card, CardItem, Text, Icon } from 'native-base';
import host from '../config/config'

class Wallet extends Component {
  render() {
    return (
      <Card>
        <CardItem style={{
          flex: 1,
          flexDirection: 'row',
        }}>
          <Image source={require("../image/wallet.png")} style={{ height: 40, width: 40 }} />
          <Text style={{ flex: 1, marginLeft: 10 }}>{this.props.name}</Text>
          <Text style={{ fontWeight: 'bold', marginLeft: 20 }}>{this.props.money} </Text>
          <Text>{this.props.unit}</Text>
          <Right>
            <TouchableOpacity style={styles.delete} onPress={ () =>
              {Alert.alert('Delete Wallet', 'Are you sure to delete this wallet?',
                [{ text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => this.props.onDelete(this.props.id, this.props.index) },]
               )}

            }>
              <Icon name="md-close" style={styles.deleteIcon} />
            </TouchableOpacity>

          </Right>
        </CardItem>
      </Card>
    );
  }
}
const styles = StyleSheet.create({
  delete: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteIcon: {
    color: 'red',
    fontSize: 30
  }
})
export default Wallet