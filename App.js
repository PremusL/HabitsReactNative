import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Button, TextInput } from 'react-native';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Calendar } from 'react-native-calendars';

import { format } from 'date-fns';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
// import HomeScreen from './HomeScreen'; // Assume this is your current App component
// import DetailScreen from './DetailScreen'; // This is the new scene you want to navigate to

const App = () => {

  const Stack = createNativeStackNavigator();

  return(

    <NavigationContainer>
      {/* <Stack.Navigator screenOptions={{ headerShown: false }}> */}
      <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e', // Set your desired color
        },
        headerTintColor: '#fff', // Set the color of the back button and title
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Welcome'}}/>
        <Stack.Screen name="Habit" component={HabitsScreen} />
        <Stack.Screen name="HabitScreen"  component={HabitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({navigation, route}) => {
  const [habits, setHabits] = useState([]);
  const [currentKey, setCurrentKey] = useState(0);
  // currentKey = 0;
  const addHabit = (habitName) => {
    setHabits([...habits, [habitName, currentKey]])
    setCurrentKey(currentKey + 1)
    console.log(habits)
  };
  const removeHabit = (habitKey) => {
    const updatedHabits = habits.filter(habit => habit[1] != habitKey);

    setHabits(updatedHabits);
  };

  useEffect(() => {
    if (route.params && route.params.description) {
      const description = route.params.description.text;
      addHabit(description);
      console.log("route.params.description: ", description);
    }
    else if (route.params && route.params.remove) {
      const remove = route.params.remove.habit_key;
      removeHabit(remove)
    }
    else{
      console.log("no params")
    }
    
  }, [route.params]); 
  
  return (
  <View style={styles.mainPage}>
    <Text style={{fontSize: 20, padding: 10}}>I will quit:</Text>
    <AddButton navigation={navigation} whereTo={'Habit'}/>
    <HabitList habits={habits} navigation={navigation}/>
    </View>
  );
};

const AddButton = ({navigation, whereTo, disabled=false, data={}}) => (
  <TouchableOpacity
    style={[styles.addButton, disabled ? {backgroundColor: 'grey'} : {backgroundColor: 'darkblue'}]}
    onPress={() => navigation.navigate(whereTo, data)}
    disabled={disabled}
  >
    <Text style={{color:"white", fontWeight:"normal", fontSize: 24}}>+</Text>
  </TouchableOpacity>
);

const RemoveButton = ({navigation, whereTo='Home', data={}}) => {
  console.log("RemoveButton data: ", data)
  return(
  <TouchableOpacity
    style={[styles.removeButton]}
    
    onPress={() => navigation.navigate(whereTo, data)}
  >
    <Text style={{color:"white", fontWeight:"normal", fontSize: 24}}>-</Text>
  </TouchableOpacity>
);
};

const HabitsScreen = ({navigation}) => {
  const [text, onChangeText] = useState('');
  const [settable, setSettable] = useState(true);

  const [selected, setSelected] = useState('');
  const usableDate = new Date(selected)
  


  const onChangeAction = (text) => {
    onChangeText(text);
    if (text && text.length > 0) {
      setSettable(false);
    } else {
      setSettable(true);
    }
  }
  const getTodaysDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    // getMonth() returns 0-11; add 1 to get 1-12 and pad with 0 if needed
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  return (
    <View style={styles.habit_view}>
      <Text style={{fontSize: 17}}>What addiction or habit do you want to quit?</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeAction}
        value={text}
        placeholder="Enter here"
        keyboardType="default"
      />
      <Text 
        style={{fontSize: 17, margin: 20, fontWeight: '600'}}>
          Choose the last date of occurance:
      </Text>

      <AddButton navigation={navigation} whereTo='Home' disabled={settable} data={{description: {text}}}/>

      <Calendar
      onDayPress={day => {
        console.log(getTodaysDate());
        setSelected(day.dateString);
      }}
      hideExtraDays={true}

      firstDay={1}
      markedDates={{
        [selected]: {selected: true, selectedDotColor: 'orange'},
  
        '2024-07-08': {startingDay: true, color: '#50cebb', textColor: 'white'},
        '2024-07-13': {endingDay: true, color: '#50cebb', textColor: 'white'}

      }}
      theme={{
        backgroundColor: '#00000',
        calendarBackground: '#00000',
        textSectionTitleColor: 'black',
        selectedDayBackgroundColor: 'orange',
        selectedDayTextColor: 'black',
        selectedDayTextWeight: '700',
        todayTextColor: 'green',
        dayTextColor: 'black',
        textDisabledColor: 'gray',
      }}
      markingType={'period'}
    
    />
    {selected ? <Text style={{fontSize: 17, margin: 20}}>Selected date: {selected}</Text> : null}
    </View>
  );
};
const HabitScreen = ({navigation, route}) => {
  let habit_key = route.params[1]; 
  return (
    <View style={styles.habit_view}>
      <Text style={{fontSize: 24}}>Habit key: {habit_key}</Text>
      <RemoveButton navigation={navigation} whereTo='Home' data={{remove: {habit_key}}}/>
    </View>
  );
};

const HabitList = ({
  habits,
  navigation,
}) => (
    <View>
      {habits.map(habit => (
        <Habit key={habit[1]} value={habit} navigation={navigation}/>
      ))}
    </View>
  );

const Habit = ({value, navigation}) => (
  <TouchableOpacity
  onPress={() => navigation.navigate("HabitScreen", value)}
  >
    <View style={styles.habit_card}>
      
    <Text style={{fontSize: 24}}>{value[0]}</Text>
    
  </View>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  navigationBar: {
    backgroundColor: 'darkblue',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 5.84,
  },
  mainPage: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#99a8bf',
  },
  addButton: {
    backgroundColor: 'darkblue',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  removeButton: {
    backgroundColor: 'darkred',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  habit_card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    justifyContent: 'center',
    alignItems: 'center',
  },
  habit_view: {
    // alignContent: 'center',
    alignItems: 'center',
    // justifyContent: 'center', // center vertically
    backgroundColor: '#99a8bf',
    paddingTop: 20,
    flex: 1,

  },
  input: {
    height: 40,
    width: 230,
    margin: 12,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    // padding: 10,
  },

  container: {
    flex: 1,
    backgroundColor: '#ff00',
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,

  },
  grid_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', 
    alignItems: 'flex-start',
    // backgroundColor: '#f00',
    height: 500,
    marginTop: 50,
  },
  set_button: {
    width: 100,
    height: 90,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    color: '#fff',
  },  

  grid_item: {
    width: '50%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'orange',
    // margin: 2,
  },
  grid_text: {
    fontSize: 24,
    marginTop: 10,
  },
  box:{
    width: 40,
    height: 40,
  }

});

export default App;