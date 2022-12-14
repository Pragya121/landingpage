import "./App.css";
import { useEffect } from "react";
import Loading from "./components/Loading";
import { Sapling } from "@saplingai/sapling-js/observer";
import data from "./assets/data";
import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Signin from "./components/Signin";
import { Outlet, Link } from "react-router-dom";
function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignedout, setIsSignedout] = React.useState(false);
  const [user, setUser] = React.useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("token"))
      : {}
  );
  const [para, setPara] = React.useState("Text....");
  const role = user ? user.role : null;
  const [token, setToken] = React.useState(
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );

  let keyValues = window.location.search;
  const urlParams = new URLSearchParams(keyValues);
  let docId = urlParams.get("docId");
  // console.log("Keys and values", keyValues);
  function truncate(str, n){
    return (str.length > n) ? str.slice(0, n-1) + '&hellip;' : str;
  };
  const signOut = (e) => {
    setIsLoading(true);
    setIsSignedout(true);
    data
      .signOut(data.auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out");
        localStorage.removeItem("token");
        localStorage.removeItem("loginData");
        setIsLoading(false);
        window.location.reload();
      })
      .catch((error) => {
        // An error happened.
        alert("error in signing out!");
        setIsLoading(false);
        console.log(error);
      });
  };
  const getDocInfo = async () => {
    setIsLoading(true);
    let idToken = await data.getIdToken();
    if (!idToken) {
      idToken = token;
    }
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      };
      if (!docId) {
        docId = prompt(
          "Please enter the doc ID",
          "1j1qXOYmyDjFHZ01VvocoRlBV4Nzb4aLenRjyTAUNc90"
        );
      }
      const response = await data.axios.get(
        `${data.BASE_URL}/googleDocAnalyser?docId=${docId}`,

        config
      );
      const resp = response.data;

      console.log(`info`, resp);
      setPara(resp);
      setIsLoading(false);

      return resp;
    } catch (errors) {
      setIsLoading(false);
      console.error(errors);

      alert(errors.response.data.message);
    }
  };

  useEffect(() => {
    if (!isSignedout && token) {
      getDocInfo();
    }
    // 1j1qXOYmyDjFHZ01VvocoRlBV4Nzb4aLenRjyTAUNc90 doc id
setPara(truncate(para,20));
    Sapling.init({
      key: "MI52JDK7WA6CKCAW1JBIT96LW5MOGJAX",
      endpointHostname: "https://api.sapling.ai",
      editPathname: "/api/v1/edits",
      statusBadge: true,
      mode: "dev",
    });
  }, []);

  if (token) {
    if (!isLoading) {
      return (
        <div className="App">
          <Navbar />

          <div className="body">
            {" "}
            {/* <div id="editor" sapling-ignore="true" contentEditable="true">
              Lets get started!
            </div> */}
            <p>
              <textarea
                id="editor"
                // defaultValue={para}
                rows={15}
              >{para}</textarea>
            </p>
            <button
              onClick={(e) => {
                const editor = document.getElementById("editor");
                Sapling.observe(editor);
              }}
            >
              Check
            </button>
            {/* <button
              onClick={(e) => {
                const editor = document.getElementById("editor");
                Sapling.unobserve(editor);
              }}
            >
             Stop
            </button> */}
          </div>
          <Footer />
        </div>
      );
    } else {
      return <Loading />;
    }
  } else {
    return <Signin />;
  }
}

export default App;
