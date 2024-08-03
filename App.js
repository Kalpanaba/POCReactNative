import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Modal, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './store';
import { addToCart, incrementQuantity, decrementQuantity } from './cartSlice';

const Stack = createStackNavigator();

const ProductList = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  const handleAddToCart = product => {
    dispatch(addToCart(product));
    setModalVisible(false);
    navigation.navigate('Cart');
  };

  const handleIncrement = id => {
    dispatch(incrementQuantity({ id }));
  };

  const handleDecrement = id => {
    dispatch(decrementQuantity({ id }));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.product} onPress={() => { setSelectedProduct(item); setModalVisible(true); }}>
      <Text>{item.title}</Text>
      <Text>${item.price}</Text>
    </TouchableOpacity>
  );

  const renderModalContent = () => {
    const productInCart = cart.find(item => item.id === selectedProduct.id);
    const quantity = productInCart ? productInCart.quantity : 0;

    return (
      <View style={styles.modalContent}>
        <Image source={{ uri: selectedProduct.image }} style={styles.image} />
        <Text>{selectedProduct.title}</Text>
        <Text>{selectedProduct.description}</Text>
        <Text>${selectedProduct.price}</Text>
        <View style={styles.quantityContainer}>
          <Button title="-" onPress={() => handleDecrement(selectedProduct.id)} />
          <Text style={styles.quantity}>{quantity}</Text>
          <Button title="+" onPress={() => handleIncrement(selectedProduct.id)} />
        </View>
        <Button title="Add to Cart" onPress={() => handleAddToCart(selectedProduct)} />
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />

      {selectedProduct && (
        <Modal visible={modalVisible} animationType="slide">
          {renderModalContent()}
        </Modal>
      )}
    </View>
  );
};

const CartScreen = () => {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const handleIncrement = id => {
    dispatch(incrementQuantity({ id }));
  };

  const handleDecrement = id => {
    dispatch(decrementQuantity({ id }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text>{item.title}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Button title="+" onPress={() => handleIncrement(item.id)} />
            <Button title="-" onPress={() => handleDecrement(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  product: {
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  cartItem: {
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 18,
  },
});

const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default RootApp;
