import React, { Component } from 'react';
import './App.css';
import defaultlogo from './default.jpeg';
import {unsplash,toJson} from './config.js';


class App extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { 
      firstSelectedPhoto: '',
      secondSelectedPhoto:'',
      prevSelectedIndex:'',
      score:0,
      gameOver:false,
      photos:[]
    };
  }

  togglePhotoDisplay = (photoListArray) =>{
    photoListArray.map((photo)=>{
        photo.display='photo-hide';
        photo.default='photo-show';
        return photo;
      })
      return photoListArray;
  }

  componentDidMount = () => {

    //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffleArray(d) {
      for (var c = d.length - 1; c > 0; c--) {
        var b = Math.floor(Math.random() * (c + 1));
        var a = d[c];
        d[c] = d[b];
        d[b] = a;
      }
      return d
    };

    unsplash.photos.listPhotos(2, 14, "latest")
    .then(toJson)
    .then(photoList => {
      let doubleList= JSON.parse(JSON.stringify(photoList));
      photoList=photoList.concat(doubleList);
      photoList=this.togglePhotoDisplay(photoList);
      shuffleArray(photoList);
      this.setState({photos:photoList})
    });
  }

  changeState(gameRef){
    gameRef.gameOver= gameRef.photos.length === 0 ? true : false;
    this.setState({
      photos:gameRef.photos,
      prevSelectedIndex:gameRef.prevIndex,   
      score:gameRef.score,
      gameOver:gameRef.gameOver
    })
  }
 
  checkSimillarity(prevIndex,currentIndex){
    let simillarity = new Promise((resolve, reject) => {     
        let {photos,score}=this.state;
        let firstSelectedPhoto=photos[prevIndex];
        let secondSelectedPhoto=photos[currentIndex];
        if(firstSelectedPhoto){
            prevIndex='';
          if(firstSelectedPhoto.urls.thumb === secondSelectedPhoto.urls.thumb){ // eslint-disable-next-line
              setTimeout(()=>{
                    photos.map((photo,index)=>{ 
                        if(photo.id === firstSelectedPhoto.id || photo.id === secondSelectedPhoto.id){
                          if(photos.length === 2){
                            photos=[];
                          }else{
                            photos.splice(index,1); 
                          }
                          
                        }
                    })
                    resolve({'photos':photos,'prevIndex':prevIndex, 'score':score+1});                 
              },500);
              this.changeState({'photos':photos,'prevIndex':prevIndex, 'score':score});
            }else{
              setTimeout(()=>{
                photos=this.togglePhotoDisplay(photos);
                resolve({'photos':photos,'prevIndex':prevIndex, 'score':score});
              },500) 
              this.changeState({'photos':photos,'prevIndex':prevIndex, 'score':score});                   
            }
        }else{     
          if(prevIndex === ''){
            prevIndex=currentIndex
          }
          resolve({'photos':photos,'prevIndex':prevIndex, 'score':score});
        }
    });
    return simillarity;
  }

  async turnPhoto(event,index){
    event.preventDefault();
    let {photos,prevSelectedIndex}=this.state;
    let photoItem=photos[index];   
    photoItem.display=photoItem.display === 'photo-hide' ? 'photo-show' : 'photo-hide'
    photoItem.default=photoItem.default === 'photo-show' ? 'photo-hide' : 'photo-show'
    let gameRef=await this.checkSimillarity(prevSelectedIndex,index);
    this.changeState(gameRef);
  }

  render() {
    const {photos,score,gameOver}=this.state;

    return (
      <div className="Container">
          <div className="scoreCard">
          <h4>{'Current Score is    '+score}</h4>
          </div>
            {
              gameOver ? <div className="scoreCard">
              <h4>Game Over</h4>
              </div> : null
            }
            {
              !gameOver ? <div  className={'App'}>
            {
              photos.map((photo,index) => {
                return  <div className="tile">
                            <img src={photo.urls.thumb} alt="" className={photo.display}></img>
                            <img src={defaultlogo}  alt="default" className={photo.default} onClick={(event) => this.turnPhoto(event,index)}></img>
                        </div>
              })
            }
            </div> : null
          }       
      </div>
    );
  }
}

export default App;
