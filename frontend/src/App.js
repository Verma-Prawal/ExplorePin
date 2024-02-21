import * as React from 'react';     // Import React and React DOM
import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import "./app.css";
import axios from "axios"; // axios helps in making HTTP requests. It facilitates the communication between frontend and backend by fetching data smoothly from the backend
import { format } from "timeago.js"; // 'format' function from 'timeago.js' library helps in formatting timestamps to display relative time like "2 hours ago"
import Register from './components/Register';
import Login from './components/Login';


function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null); 
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // Popup off by default
  const [zoom, setZoom] = useState(1); 
  const [viewport, setViewport] = useState(true); // represents the current viewport state visibility
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {  
    const getPins = async () => {  
      try {
        const res = await axios.get("/pins");
        setPins(res.data);  
      } catch (err) {
        console.log(err);
      }
    };
    getPins();  
  }, []);

  // [] (empty dependency array)
  // This dependency array ensures that the 'useEffect' runs only once when the component mounts
  // Ensuring the data fetching only occurs once when the component is initially rendered

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);  
    setShowPopup(true); 
  };

  const handleAddClick = (e) => {  
    const { lngLat } = e; 
    if (lngLat && typeof lngLat === 'object' && 'lng' in lngLat && 'lat' in lngLat) { 
      const { lng, lat } = lngLat; 
      setNewPlace({  
        lat,
        long: lng,
      });
      setShowPopup(true);
    }
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }
    try {        
      const res = await axios.post("/pins", newPin); 
      setPins([...pins, res.data]); 
      setNewPlace(null); 
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => { 
    myStorage.removeItem("user"); 
    setCurrentUser(null);
  }
  

  return (
    <div className="App">
    <Map        
     {...viewport}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      initialViewState={{     
        latitude: 23,
        longitude: 82.975,
        zoom: 4
      }}
      style={{width: "100vw", height: "100vh"}}     
      mapStyle="mapbox://styles/mapbox/streets-v9"  
      onDblClick={handleAddClick}
      transitionDuration="1000"   

      onViewportChange={(nextViewport) => {   
    setZoom(nextViewport.zoom); 
    setViewport(nextViewport); 
  }}
    >
    {pins.map((p) => (  
    <>  
    <Marker  
    latitude={p.lat} 
    longitude={p.long} 
    anchor="bottom"  
    style={{ cursor: 'pointer' }} 
    > 
      <Room  
      style={{ 
        fontSize: zoom*50, 
      color: p.username===currentUser ? "tomato" : "green" }} 
      onClick={(e) => {
    e.stopPropagation(); 
    handleMarkerClick(p._id); }}
      />
    </Marker>
    
    {p._id === currentPlaceId && ( 
  (showPopup && (
    <Popup 
      latitude={p.lat}
      longitude={p.long} 
      anchor="left"
      onClose={() => setShowPopup(false)}
    >
      <div className="card">
        <label>Place</label>
        <h3>{p.title}</h3>
        <label>Review</label>
        <p className="desc">{p.desc}</p>
        <label>Rating</label>
        <div className="stars">
          {Array(p.rating).fill(<Star className="star" />)}
        </div>
        <label>Information</label>
        <span className="username"> Created By <b>{p.username}</b> </span>
        <span className="date">{format(p.createdAt)}</span> 
      </div>
    </Popup>
  ))
    )}
    </>
      ))}
      { newPlace && ( 
      (showPopup && (
    <Popup 
      latitude={newPlace.lat}
      longitude={newPlace.long} 
      anchor="left"
      onClose={() => setShowPopup(false)}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex">Title</div>
          <input 
          placeholder="Enter a title" 
          onChange={(e) => setTitle(e.target.value)}/> 
          <div className="flex">Review</div>
          <textarea 
          placeholder="Say us something about this place" 
          onChange={(e) => setDesc(e.target.value)}
          />
          <div className="flex">Rating</div>
          <select onChange={(e) => setRating(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option> 
            <option value="3">3</option> 
            <option value="4">4</option> 
            <option value="5">5</option> 
          </select>
          <button className="submitButton" type="submit">
            Add Pin
          </button>
        </form>
      </div>
    </Popup>
  ))
      )}
      {currentUser ? (
        <button className="button logout" onClick={handleLogout}>Log Out</button>
      ) : (
        <div className="buttons">
        <button className="button login" onClick={()=> setShowLogin(true)}>Log In</button>
        <button className="button register" onClick={()=> setShowRegister(true)}>Register</button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister}/>} 
      {showLogin && <Login 
      setShowLogin={setShowLogin} 
      myStorage={myStorage} 
      setCurrentUser={setCurrentUser}
      />}
    </Map>
    </div>
  );
}

export default App;


// useEffect(() => {  // function inside useEffect is called everytime the component is rendered
//   const getPins = async () => {  // async function to fetch pins from the backend
//     try {
//       const res = await axios.get("/pins");
//       setPins(res.data);  // if the request is successful, set the pins state to the data received from the backend
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   getPins();  // calling itself immediately when the component mounts
// }, []);


// const handleMarkerClick = (id) => {
//   setCurrentPlaceId(id);  // Set the current place id to the id of the marker that was clicked
//   setShowPopup(true); // Show popup when a marker is clicked
// };


// const handleAddClick = (e) => {   // event handler for adding a new place or marker on a map
//   const { lngLat } = e; // Destructure lngLat from the event object.  The lngLat object typically contains the longitude (lng) and latitude (lat) values of the location where the user clicked.

//   if (lngLat && typeof lngLat === 'object' && 'lng' in lngLat && 'lat' in lngLat) { // Check if lngLat is an object and contains lng and lat properties
//     const { lng, lat } = lngLat; // Extract lng and lat properties (Separation)
//     setNewPlace({  // Set the newPlace state to the lng and lat values of the location where the user clicked
//       lat,
//       long: lng, // Ensure you use 'lng' for longitude
//     });
//     setShowPopup(true);
//   }
// };


// try {        // if there is no error generated then it goes to try block
//   const res = await axios.post("/pins", newPin); // post request to the backend to create a new pin
//   setPins([...pins, res.data]); // This syntax creates a new array using the spread operator (...). It takes all the elements from the existing pins array and adds the new data (res.data) as the last element in the new array.
//   // setPins is used to update the state of the 'pins'. This function is used to update the state of the 'pins' variable with the new array.
//   setNewPlace(null); // In React, setting state to null is a common way to reset or clear the state variable.
// } catch (err) {
//   console.log(err);
// }
// };


// return (
//   <div className="App">
//   <Map        // Map component from react-map-gl - View Documentation for this.
//    {...viewport}
//     mapboxAccessToken={process.env.REACT_APP_MAPBOX}
//     initialViewState={{     // setting the latitudes and longitudes of India
//       latitude: 23,
//       longitude: 82.975,
//       zoom: 4
//     }}
//     style={{width: "100vw", height: "100vh"}}     // setting the width and height of the map
//     mapStyle="mapbox://styles/mapbox/streets-v9"  
//     onDblClick={handleAddClick}
//     transitionDuration="1000"   // transition duration of 1 second

//     onViewportChange={(nextViewport) => {   
//   setZoom(nextViewport.zoom); // Update zoom state when the map viewport changes
//   setViewport(nextViewport); // Update viewport state
// }}
//   >
//   {pins.map((p) => (  // map function to iterate over an array of pins and rendering Marker components for each pin
//   <>  // React.Fragment - A common pattern in React is for a component to return multiple elements. Fragments let you group a list of children without adding extra nodes to the DOM.
//   <Marker  // Marker component from react-map-gl - View Documentation for this.
//   latitude={p.lat} 
//   longitude={p.long} 
//   anchor="bottom"  // anchor property is used to position the marker relative to the coordinates
//   style={{ cursor: 'pointer' }} // Change cursor to pointer on hover over marker
//   > 
//     <Room  // Room icon from material-ui
//     style={{ 
//       fontSize: zoom*50, 
//     color: p.username===currentUser ? "tomato" : "green" }} // Change color of marker based on the user who created the pin
//     onClick={(e) => {
//   e.stopPropagation(); // Stop the event from propagating to parent elements
//   handleMarkerClick(p._id); }}
//     />
//   </Marker>



// {showRegister && <Register setShowRegister={setShowRegister}/>} //  If showRegister is true, it renders the Register component. The setShowRegister prop is passed to the Register component, likely to be used to update the state that controls whether the registration component is displayed.
//       {showLogin && <Login 
//       setShowLogin={setShowLogin} // The setShowLogin prop is passed to the Login component, likely to be used to update the state that controls whether the login component is displayed.
//       myStorage={myStorage} 
//       setCurrentUser={setCurrentUser}