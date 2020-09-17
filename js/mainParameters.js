/*Browse, visualize, and create  OME groups 

Version:  OME-ORG Demo v1.0.0
Github:   https://github.com/Mmasoud1
Author:   Mohamed Masoud
email:    mmasoud2@outlook.com
*/

  //---------- initialize Globals-------//  
   
   var DSA_SERVER_LIST=[];  //--  Host list --//
   DSA_SERVER_LIST.push(
                    {id: "1", value: "Girder", hostAPI: "http://dermannotator.org:8080/api/v1"},
                    {id: "2", value: "Cancer digital slide archive", hostAPI: "http://candygram.neurology.emory.edu:8080/api/v1"},
                    {id: "3", value: "Styx", hostAPI: "https://styx.neurology.emory.edu/girder/api/v1/"}, 
                    {id: "4", value: "HMIF", hostAPI: " https://imaging.htan.dev/girder/api/v1/"}   
                    )
   var Settings = []


    var colorContrastMap=[];
    colorContrastMap.push( { /*WHITE*/ color: "FFFFFF", contrast_Max: 35000, contrast_Min: 500  }, 
                           { /**RED**/ color: "FF0000", contrast_Max: 25000, contrast_Min: 1000 },
                           { /*BLUE**/ color: "0000FF", contrast_Max: 60000, contrast_Min: 500  },
                           { /*GREEN*/ color: "00FF00", contrast_Max: 5000 , contrast_Min: 100  }, 
                           { /*AQUA**/ color: "00FFFF", contrast_Max: 65000, contrast_Min: 1000 }
                          )

 
    class chColorContrastStates {
                 constructor (){
                  this.grpIndex = null;
                  this.chIndex = null;
                  this.originalColor = null;
                  this.originalContrastMax = null;
                  this.originalContrastMin = null;
                  this.newColor = null;                                        
                  this.newContrastMax = null;
                  this.newContrastMin = null;
                  this.changesComfirmed = false;
                  this.changesCanceled = false;        
                  this.lastCommand = null;  
                 }
    }

    var curChColorContrastStates = [];

   //-- Host/Collection selection states --//
    var currentHostCollectSelectionStates = [];
    currentHostCollectSelectionStates = ({hostObject: null, collectionList: null, foldersList: null, item: null, hostIndex: 0, collectionIndex: 0, isHostLogin: false})


    var lastHostCollectSelectionStates = ({hostIndex: 0, hostChanged: 0, collectionIndex: 0, itemId: null}); //-- --//

    var channelStates = ({currentIndex: null, lastIndex: null, channelChanged: 0}); //-- --//
 
    var tempSceneSelections=[];
    var tempGrpRemoved=[];
    var tempServerRemoved=[];

    var currentItemInfo = [];  //-- On selected OME File --//
 
    var lastItemSelectionStates = ({grpIndex: 0, zoomValue:0, storyIndex:0});



     var Opts = {
            // Options
            maxGrpLabelLen:               28,
            maxhostListWithSettings:      4,  // must be <= 4 
            selectedElemBgColor:          "rgba(255,255,255,0.5)",
            selectedElemFontColor:        "black",
            selectedElemFontWeight:       "bold",
            defaultElemBgColor:           "",  
            defaultElemFontColor:         "white", 
            defaultElemFontWeight:        "normal" 
     }

     var screenStatus = ({activeForm: null, activeLayout: null,  panels: null, activeMode: null, infoPanelFirstEnter: null,
                         bestScreenDim: { availWidth: 2071, 
                                          availHeight: 1179, 
                                          width: 2144, 
                                          height: 1206, 
                                          colorDepth: 24, 
                                          pixelDepth: 24, 
                                          top: 0, 
                                          left: 0, 
                                          availTop: 27, 
                                          availLeft: 73 
                                        }
                         }); //-- --//
