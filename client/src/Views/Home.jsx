import React from 'react';
import myScript from './Scripts/home.js';
import './Styles/home.css';

class Home extends React.Component {
    componentDidMount() {
        myScript();
    }
    
    render() {
        return (
            <div>
                <div class="container" id="container">
                    <div class="loader desactivate" id="loader">
                        <span class="loader"></span>
                    </div>
                    <div class="content" id="content">
                        <h1>Uploaded File</h1>   

                        <form action="/select" onsubmit="event.preventDefault()">
                        <input type="file" id="song-input" name="song" accept=".mp3, .flac"></input>
                        <button type="submit" id="btn-submit">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;